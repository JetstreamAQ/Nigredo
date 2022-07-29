DELIMITER //

CREATE PROCEDURE Search(
	IN terms TEXT,
	IN count INT
) BEGIN
	SELECT DISTINCT A.url, B.tags
	FROM (
		SELECT DISTINCT MediaTag.url, GROUP_CONCAT(MediaTag.name SEPARATOR ' ') AS tags
		FROM Media, MediaTag
		WHERE FIND_IN_SET(MediaTag.name, terms) = count AND MediaTag.url = Media.url
		GROUP BY Media.url) as A
	INNER JOIN (
			SELECT DISTINCT Media.url, GROUP_CONCAT(MediaTag.name SEPARATOR ' ') as tags
			FROM Media, MediaTag
			WHERE MediaTag.url = Media.url
			GROUP BY Media.URL) as B
	ON A.url = B.url;
END//

CREATE PROCEDURE SearchBound(
	IN terms TEXT,
	IN count INT,
	IN lower INT,
	IN entriesPerPage INT
) BEGIN
	SELECT DISTINCT A.url, B.tags
	FROM (
		SELECT DISTINCT MediaTag.url, GROUP_CONCAT(MediaTag.name SEPARATOR ' ') AS tags
		FROM Media, MediaTag
		WHERE FIND_IN_SET(MediaTag.name, terms) = count AND MediaTag.url = Media.url
		GROUP BY Media.url) as A
	INNER JOIN (
			SELECT DISTINCT Media.url, GROUP_CONCAT(MediaTag.name SEPARATOR ' ') as tags
			FROM Media, MediaTag
			WHERE MediaTag.url = Media.url
			GROUP BY Media.URL) as B
	ON A.url = B.url
	LIMIT lower, entriesPerPage;
END//

CREATE PROCEDURE SearchNoTerms() 
BEGIN
	SELECT DISTINCT A.url, B.tags 
	FROM 
		(SELECT * FROM Media) as A 
	LEFT JOIN ( 
		SELECT MediaTag.url, GROUP_CONCAT(MediaTag.name SEPARATOR ' ') as tags 
		FROM MediaTag GROUP BY MediaTag.url) as B 
	ON A.url = B.url;
END//

CREATE PROCEDURE SearchNoTermsBound(
	IN lower INT,
	IN entriesPerPage INT
) BEGIN
	SELECT DISTINCT A.url, B.tags 
	FROM 
		(SELECT * FROM Media) as A 
	LEFT JOIN ( 
		SELECT MediaTag.url, GROUP_CONCAT(MediaTag.name SEPARATOR ' ') as tags 
		FROM MediaTag GROUP BY MediaTag.url) as B 
	ON A.url = B.url
	LIMIT lower, entriesPerPage;
END//

CREATE PROCEDURE SearchUntagged () 
BEGIN
	SELECT DISTINCT A.url, B.tags 
	FROM 
		(SELECT * FROM Media) as A 
	LEFT JOIN ( 
		SELECT MediaTag.url, GROUP_CONCAT(MediaTag.name SEPARATOR ' ') as tags 
		FROM MediaTag GROUP BY MediaTag.url) as B 
	ON A.url = B.url AND tags = null;
END//

CREATE PROCEDURE SearchUntaggedBound(
	IN lower INT,
	IN entriesPerPage INT
) BEGIN
	SELECT DISTINCT A.url, B.tags 
	FROM 
		(SELECT * FROM Media) as A 
	LEFT JOIN ( 
		SELECT MediaTag.url, GROUP_CONCAT(MediaTag.name SEPARATOR ' ') as tags 
		FROM MediaTag GROUP BY MediaTag.url) as B 
	ON A.url = B.url AND tags = null
    LIMIT lower, entriesPerPage;
END//

CREATE PROCEDURE TagFetch(
	IN tag VARCHAR(64)
) BEGIN
	SELECT name
	FROM Tag
	WHERE LOWER(name)=LOWER(tag);
END//

CREATE PROCEDURE TagInsert(
	IN tag VARCHAR(64)
) BEGIN
	INSERT INTO Tag
	VALUES(tag);
END//

CREATE PROCEDURE CheckTagged(
	IN tag VARCHAR(64),
	IN url VARCHAR(256)
) BEGIN
	SELECT DISTINCT Media.url
	FROM Media, MediaTag
	WHERE LOWER(MediaTag.name)=LOWER(tag) AND MediaTag.url=Media.url AND Media.url=url;
END//

CREATE PROCEDURE TagImg(
	IN tag VARCHAR(64),
	IN url VARCHAR(256)
) BEGIN
	INSERT INTO MediaTag
	VALUES(url, tag);
END//

CREATE PROCEDURE InsertMedia (
	IN url VARCHAR(256)
) BEGIN
	INSERT INTO Media
	VALUES(url);
END//

CREATE PROCEDURE DeleteMedia (
	IN url VARCHAR(256)
) BEGIN
	DELETE FROM Media
	WHERE Media.url=url;
END//

CREATE PROCEDURE DeleteMediaTag (
	IN url VARCHAR(256)
) BEGIN
	DELETE FROM MediaTag
	WHERE MediaTag.url=url;
END//

CREATE PROCEDURE GetTags (
	IN regex VARCHAR(65)
) BEGIN
	SELECT *
	FROM Tag
	WHERE Tag.name REGEXP regex;
END//

DELIMITER ;
