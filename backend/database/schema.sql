CREATE TABLE coachs (
	id INTEGER NOT NULL, 
	nom VARCHAR(80) NOT NULL, 
	prenom VARCHAR(80), 
	description VARCHAR(100), 
	PRIMARY KEY (id)
);
CREATE TABLE cours_fitness (
	id INTEGER NOT NULL, 
	jour VARCHAR(10), 
	heure TIME, 
	activite VARCHAR(50), 
	PRIMARY KEY (id)
);
CREATE TABLE fitness_status (
	personnes INTEGER, 
	id INTEGER NOT NULL, 
	PRIMARY KEY (id)
);
CREATE TABLE bassins (
	id INTEGER NOT NULL, 
	nom VARCHAR(50) NOT NULL, 
	description VARCHAR(200), 
	longueur FLOAT, 
	profondeur FLOAT, 
	PRIMARY KEY (id)
);
CREATE TABLE IF NOT EXISTS "coursPiscine" (
	id INTEGER NOT NULL, 
	nom VARCHAR(100) NOT NULL, 
	description VARCHAR(300), 
	heure TIME, 
	jour VARCHAR(10), 
	PRIMARY KEY (id)
);
CREATE TABLE programme_musculation (
	id INTEGER NOT NULL, 
	titre VARCHAR(100) NOT NULL, 
	description TEXT NOT NULL, 
	PRIMARY KEY (id)
);
CREATE TABLE equipement_musculation (
	id INTEGER NOT NULL, 
	nom VARCHAR(100) NOT NULL, 
	description TEXT, 
	disponible BOOLEAN, 
	PRIMARY KEY (id)
);
CREATE TABLE contact_messages (
	id INTEGER NOT NULL, 
	nom VARCHAR(100) NOT NULL, 
	email VARCHAR(120) NOT NULL, 
	message TEXT NOT NULL, 
	date_envoi DATETIME, 
	is_vip_message BOOLEAN, 
	PRIMARY KEY (id)
);
CREATE TABLE abonnements (
	id INTEGER NOT NULL, 
	type VARCHAR(20) NOT NULL, 
	PRIMARY KEY (id)
);
CREATE TABLE users (
	id INTEGER NOT NULL, 
	email VARCHAR(120) NOT NULL, 
	username VARCHAR(80) NOT NULL, 
	password_hash VARCHAR(128) NOT NULL, 
	is_admin BOOLEAN, 
	prenom VARCHAR(80), 
	nom VARCHAR(80), 
	age INTEGER, 
	telephone VARCHAR(20), 
	abonnement_id INTEGER, 
	avatar_id INTEGER, 
	avatar_url VARCHAR(255), 
	mes_records TEXT, 
	PRIMARY KEY (id), 
	UNIQUE (email), 
	FOREIGN KEY(abonnement_id) REFERENCES abonnements (id)
);
CREATE TABLE IF NOT EXISTS "piscineStatus" (
	id INTEGER NOT NULL, 
	bassin_id INTEGER NOT NULL, 
	status INTEGER, 
	PRIMARY KEY (id), 
	FOREIGN KEY(bassin_id) REFERENCES bassins (id)
);
CREATE TABLE user_subscriptions (
	id INTEGER NOT NULL, 
	user_id INTEGER NOT NULL, 
	course_type VARCHAR(20) NOT NULL, 
	course_id INTEGER NOT NULL, 
	PRIMARY KEY (id), 
	FOREIGN KEY(user_id) REFERENCES users (id)
);
