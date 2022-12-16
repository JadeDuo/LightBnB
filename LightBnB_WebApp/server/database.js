const { Pool } = require('pg');

const pool = new Pool({
  user: 'vagrant',
  password: '123',
  host: 'localhost',
  database: 'lightbnb'
});

pool.connect(console.log('connected to lBnB'))



const properties = require('./json/properties.json');
const users = require('./json/users.json');

/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function(email) {
  const values = [email.toLowerCase()];
  return pool
  .query(` SELECT *
  FROM users
  WHERE users.email = $1;
  `, values)
  .then((result) => {
    if (result.rows[0]) {
      return result.rows[0];
    } 
    return null;
  })
  .catch((err) => {
    console.log(err.message);
    return null
  });
  
}
exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function(id) {
  const values = [id];
  return pool
  .query(` SELECT *
  FROM users
  WHERE users.id = $1;
  `, values)
  .then((result) => {
    if (result.rows[0]) {
      return result.rows[0];
    } 
    return null;
  })
  .catch((err) => {
    console.log(err.message);
    return null
  });
  
}
exports.getUserWithId = getUserWithId;


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser =  function(user) {
  const values = [user.name, user.password, user.email]
  const queryText = `INSERT INTO users(name, password, email)
  VALUES ($1, $2, $3) RETURNING *;
  `
  return pool
  .query(queryText, values)
  .then((result) => {
    return(result)
  })
  .catch((err) => {
    console.log(err.message);
    return null
  });
  
}

exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function(guest_id, limit = 10) {
  const values = [guest_id, limit];
  const queryStr = `SELECT reservations.*, properties.*
  FROM reservations
  JOIN properties ON reservations.property_id = properties.id
  JOIN property_reviews ON properties.id = property_reviews.property_id
  WHERE reservations.guest_id = $1
  GROUP BY reservations.id, properties.id
  ORDER BY reservations.start_date
  LIMIT $2;
  `;
  return pool
  .query(queryStr, values)
  .then((result) => {
    
    return(result.rows)
  })
  .catch((err) => {
    console.log(err.message);
    return null
  });
}

exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
const getAllProperties = function (options, limit = 10) {
  // 1
  const queryParams = [];
  // 2
  let queryString = `
  SELECT properties.*, avg(property_reviews.rating) as average_rating
  FROM properties
  JOIN property_reviews ON properties.id = property_id
  `;

  // if city is a param
  if (options.city) {
    queryParams.push(`%${options.city}%`);
    if(queryParams.length === 1) {
    queryString += `WHERE city LIKE $${queryParams.length} `;
    } else {
      queryString += `AND city LIKE $${queryParams.length} `;
    }
  }

  // if owner_id is a param
  if (options.owner_id) {
    queryParams.push(options.owner_id);
    if(queryParams.length === 1) {
    queryString += `WHERE owner_id = $${queryParams.length} `;
  } else {
    queryString += `AND owner_id = $${queryParams.length} `;
    }
  }

  // if min
  if (options.minimum_price_per_night) {
    queryParams.push(options.minimum_price_per_night);
    if(queryParams.length === 1) {
    queryString += `WHERE (cost_per_night / 100) >= $${queryParams.length} `;
    } else {
    queryString += `AND (cost_per_night / 100) >= $${queryParams.length} `;
    }
  }

  //if max
  if (options.maximum_price_per_night) {
    queryParams.push(options.maximum_price_per_night);
    if(queryParams.length === 1) {
      queryString += `WHERE (cost_per_night / 100) <= $${queryParams.length} `;
    } else {
      queryString += `AND (cost_per_night / 100) <= $${queryParams.length} `;
    }
  }
  if(options.minimum_rating) {
    queryParams.push(options.minimum_rating);
    if(queryParams.length === 1) {
      queryString += `WHERE rating >= $${queryParams.length} `;
    } else {
      queryString += `AND rating >= $${queryParams.length} `;
    }
  }

  // add limit
  queryParams.push(limit);
  queryString += `
  GROUP BY properties.id
  ORDER BY cost_per_night
  LIMIT $${queryParams.length};
  `;

  // 5
  console.log('querySTR is:', queryString, "queryPARAMS is:", queryParams);

  // 6
  return pool.query(queryString, queryParams).then((res) => res.rows);
};

exports.getAllProperties = getAllProperties;


/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {
  const propertyId = Object.keys(properties).length + 1;
  property.id = propertyId;
  properties[propertyId] = property;
  return Promise.resolve(property);
}
exports.addProperty = addProperty;
