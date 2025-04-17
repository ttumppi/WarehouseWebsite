# Frontend

* changed npm package manager to yarn for lighter load on machine(npm freezes).
* Installed crypto-js for hashing user password.

# Backend

* Installed cors.
* Installed jsonwebtoken for auth.


# Database

* Added user level to users table.
* The dynamic table final schema :
    id SERIAL PRIMARY KEY,
    item_id INT, 
    balance INT,
    location INT UNIQUE,
    FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE