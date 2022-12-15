INSERT INTO users (name, email, password)
VALUES ('Jade Duong', 'jadesduong@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.' ),
('Lucas Penney', 'lp@lp.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('Tim Key', 'a@a.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');

INSERT INTO properties(owner_id, title, thumbnail_photo_url, cover_photo_url, country, street, city, province, post_code)
VALUES 
(1,'nothing mansion','real.url', 'real2.url', 'canada', '123 st', 'surrey', 'B.C', 'V3S9X3'),
(1,'zero dollar special','real.url', 'real2.url', 'canada', '456 ave', 'surrey', 'B.C', 'V3S9X4'),
(2, 'oops, all free!', 'real.url', 'real2.url', 'canada', 'hello st', 'hamilton', 'ON', 'L5R1H2');

INSERT INTO reservations(start_date, end_date, property_id, guest_id)
VALUES ('2018-09-11', '2018-09-26', 1, 3),
('2019-01-04', '2019-02-01', 2, 2),
('2021-10-01', '2021-10-14', 3, 3);

INSERT INTO property_reviews(guest_id, property_id, reservation_id, rating, message)
VALUES (3, 1, 3, 5),
(2, 2, 3, 5, 'saw my friend tim!'),
(1, 1, 3, 1, 'saw some guy named tim...');
