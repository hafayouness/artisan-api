
DROP TABLE IF EXISTS artisans CASCADE;

CREATE TABLE artisans (
   id SERIAL PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    profession VARCHAR(100) NOT NULL,
    telephone VARCHAR(20) NOT NULL UNIQUE,
    email VARCHAR(150) UNIQUE,
    ville VARCHAR(100) DEFAULT 'Tiznit',
    rating DECIMAL(2,1) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP


);
CREATE INDEX idx_profession ON artisans(profession);
CREATE INDEX idx_ville ON artisans(ville);
INSERT INTO artisans (nom, prenom, profession, telephone, email, ville, rating) VALUES
('Alami', 'Mohammed', 'Électricien', '0661234567', 'malami@email.com', 'Tiznit', 4.5),
('Bennani', 'Hassan', 'Plombier', '0662345678', 'hbennani@email.com', 'Tiznit', 4.2),
('Chakir', 'Fatima', 'Peintre', '0663456789', 'fchakir@email.com', 'Tiznit', 4.8),
('Daoudi', 'Ahmed', 'Menuisier', '0664567890', 'adaoudi@email.com', 'Tiznit', 4.0),
('El Fassi', 'Rachid', 'Technicien climatisation', '0665678901', 'relfassi@email.com', 'Tiznit', 4.6),
('Filali', 'Omar', 'Maçon', '0666789012', 'ofilali@email.com', 'Tiznit', 3.9),
('Ghali', 'Karim', 'Serrurier', '0667890123', 'kghali@email.com', 'Tiznit', 4.3),
('Hamidi', 'Youssef', 'Jardinier', '0668901234', 'yhamidi@email.com', 'Tiznit', 4.1),
('Idrissi', 'Nadia', 'Électricien', '0669012345', 'nidrissi@email.com', 'Tiznit', 4.7),
('Jbari', 'Said', 'Plombier', '0660123456', 'sjbari@email.com', 'Tiznit', 4.4),
('Kerroum', 'Laila', 'Peintre', '0671234567', 'lkerroum@email.com', 'Tiznit', 4.9),
('Lahlou', 'Mehdi', 'Menuisier', '0672345678', 'mlahlou@email.com', 'Tiznit', 3.8),
('Mansouri', 'Amina', 'Électricien', '0673456789', 'amansouri@email.com', 'Tiznit', 4.5),
('Naciri', 'Khalil', 'Technicien climatisation', '0674567890', 'knaciri@email.com', 'Tiznit', 4.2),
('Ouazzani', 'Salma', 'Maçon', '0675678901', 'souazzani@email.com', 'Tiznit', 4.0);

SELECT * FROM artisans;