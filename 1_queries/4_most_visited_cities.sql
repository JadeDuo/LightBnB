SELECT properties.city as city, count(reservations) as total_reservaions
FROM properties
JOIN reservations ON property_id = properties.id
GROUP BY city
ORDER BY total_reservaions DESC;