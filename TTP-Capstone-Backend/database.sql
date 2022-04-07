CREATE DATABASE sandwich_maker;

CREATE TABLE user_profile (
  user_id SERIAL PRIMARY KEY,
  username varchar(255) NOT NULL,
  user_email varchar(255) NOT NULL,
  user_password varchar(255) NOT NULL
);

CREATE TABLE user_sandwich (
  sandwich_id SERIAL PRIMARY KEY,
  sandwich_name varchar(255),
  uid INTEGER,
  CONSTRAINT FK_user_id
    FOREIGN KEY (uid)
      REFERENCES user_profile(user_id) 
);

CREATE TABLE ingredients (
  ing_id SERIAL PRIMARY KEY,
  ing_type varchar(255),
  ing_name varchar(255),
  image_path varchar(255)
);

-- should have another table that is ingredient types 
CREATE TABLE sandwich_ingredients(
  item_id SERIAL PRIMARY KEY,
  used_in INTEGER,
  CONSTRAINT FK_sandwich_id
    FOREIGN KEY (used_in)
      REFERENCES user_sandwich(sandwich_id)
        ON DELETE CASCADE,
  ingredient_id INTEGER,
  CONSTRAINT FK_ingredient
    FOREIGN KEY (ingredient_id)
      REFERENCES ingredients(ing_id)
       ON DELETE CASCADE
);


