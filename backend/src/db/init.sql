
CREATE TABLE IF NOT EXISTS shelfs (
    id SERIAL PRIMARY KEY,
    shelf_id varchar(100) UNIQUE,
    Shelf_table INT
);

CREATE TABLE IF NOT EXISTS items (
    id SERIAL PRIMARY KEY,
    manufacturer varchar(200),
    model varchar(200),
    serial varchar(200)

);

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username varchar(100),
    role varchar(50)
);

CREATE TABLE IF NOT EXISTS passwords (
    id INT REFERENCES users(id),
    value varchar(200),
    salt varchar(8)
);
