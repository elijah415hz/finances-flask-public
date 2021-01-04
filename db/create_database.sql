CREATE DATABASE finances_db CHARACTER SET utf8mb4 collate utf8mb4_unicode_ci;
USE finances_db;


CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50),
    password VARCHAR(255)
);

CREATE TABLE vendors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50),
    user_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
CREATE UNIQUE INDEX vendor_name ON vendors(name);

CREATE TABLE sources (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50),
    user_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
CREATE UNIQUE INDEX s_name ON sources(name);

CREATE TABLE persons (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30),
    user_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE income (
    id INT AUTO_INCREMENT PRIMARY KEY,
    date DATE,
    amount FLOAT,
    source_id INT,
    person_id INT,
    user_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (source_id) REFERENCES sources(id),
    FOREIGN KEY (person_id) REFERENCES persons(id)
);

CREATE TABLE broad_categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50),
    user_id INT NOT NULL,
    person BOOLEAN,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE narrow_categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50),
    broad_category_id INT NOT NULL,
    user_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE expenses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    date DATE,
    vendor_id INT,
    amount FLOAT,
    broad_category_id INT,
    narrow_category_id INT,
    person_id INT,
    notes VARCHAR(100),
    user_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (broad_category_id) REFERENCES broad_categories(id),
    FOREIGN KEY (narrow_category_id) REFERENCES narrow_categories(id),
    FOREIGN KEY (vendor_id) REFERENCES vendors(id),
    FOREIGN KEY (person_id) REFERENCES persons(id)
);