CREATE TABLE Coach(
   idCoachM INT,
   nom VARCHAR(50),
   prenom VARCHAR(50),
   PRIMARY KEY(idCoachM)
);

CREATE TABLE MNS(
   idMNS INT,
   nom VARCHAR(50),
   prenom VARCHAR(50),
   PRIMARY KEY(idMNS)
);

CREATE TABLE Cours(
   idCours INT,
   debut DATETIME,
   fin DATETIME,
   type VARCHAR(50),
   PRIMARY KEY(idCours)
);

CREATE TABLE SalleFitness(
   idSalle INT,
   libre LOGICAL,
   PRIMARY KEY(idSalle)
);

CREATE TABLE Bassin(
   idBassin INT,
   nom VARCHAR(50),
   PRIMARY KEY(idBassin)
);

CREATE TABLE Adherent(
   idAdherent INT,
   nom VARCHAR(50),
   prenom VARCHAR(50),
   age INT,
   numero INT,
   adresseMail VARCHAR(50),
   mdp VARCHAR(50),
   estAdmin LOGICAL,
   idBassin INT,
   idSalle INT,
   idCours INT NOT NULL,
   PRIMARY KEY(idAdherent),
   FOREIGN KEY(idBassin) REFERENCES Bassin(idBassin),
   FOREIGN KEY(idSalle) REFERENCES SalleFitness(idSalle),
   FOREIGN KEY(idCours) REFERENCES Cours(idCours)
);

CREATE TABLE Abonnement(
   idAbonnement INT,
   depuis DATE,
   jusque DATE,
   type VARCHAR(50),
   idAdherent INT NOT NULL,
   PRIMARY KEY(idAbonnement),
   FOREIGN KEY(idAdherent) REFERENCES Adherent(idAdherent)
);

CREATE TABLE Machine(
   idMachinne INT,
   nom VARCHAR(50),
   libre LOGICAL,
   idAdherent INT NOT NULL,
   PRIMARY KEY(idMachinne),
   UNIQUE(idAdherent),
   FOREIGN KEY(idAdherent) REFERENCES Adherent(idAdherent)
);

CREATE TABLE Ligne(
   idLigne INT,
   libre LOGICAL,
   idBassin INT NOT NULL,
   PRIMARY KEY(idLigne),
   FOREIGN KEY(idBassin) REFERENCES Bassin(idBassin)
);

CREATE TABLE Perf(
   idPerf INT,
   nbRep INT,
   Charge INT,
   idAdherent INT NOT NULL,
   idMachinne INT NOT NULL,
   PRIMARY KEY(idPerf),
   FOREIGN KEY(idAdherent) REFERENCES Adherent(idAdherent),
   FOREIGN KEY(idMachinne) REFERENCES Machine(idMachinne)
);

CREATE TABLE Donner(
   idCoachM INT,
   idCours INT,
   PRIMARY KEY(idCoachM, idCours),
   FOREIGN KEY(idCoachM) REFERENCES Coach(idCoachM),
   FOREIGN KEY(idCours) REFERENCES Cours(idCours)
);

CREATE TABLE ReserverL(
   idCours INT,
   idLigne INT,
   PRIMARY KEY(idCours, idLigne),
   FOREIGN KEY(idCours) REFERENCES Cours(idCours),
   FOREIGN KEY(idLigne) REFERENCES Ligne(idLigne)
);

CREATE TABLE Surveiller(
   idMNS INT,
   idBassin INT,
   PRIMARY KEY(idMNS, idBassin),
   FOREIGN KEY(idMNS) REFERENCES MNS(idMNS),
   FOREIGN KEY(idBassin) REFERENCES Bassin(idBassin)
);
