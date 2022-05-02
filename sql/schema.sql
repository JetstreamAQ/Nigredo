CREATE SCHEMA `mediaDB`;

CREATE TABLE Media (
	url VARCHAR(256) NOT NULL,
    PRIMARY KEY (url)
);

CREATE TABLE Tag (
	name VARCHAR(64) NOT NULL,
    Primary Key (name)
);

CREATE TABLE MediaTag (
	url VARCHAR(256) NOT NULL,
    name VARCHAR(64) NOT NULL,
    PRIMARY KEY (url, name),
    FOREIGN KEY (url)
		REFERENCES Media (url),
	FOREIGN KEY (name)
		REFERENCES Tag (name)
);
