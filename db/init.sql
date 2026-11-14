CREATE TABLE IF NOT EXISTS coelhos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL,
  porte TEXT NOT NULL CHECK (porte IN ('mini', 'medio', 'grande')),
  idade INTEGER NOT NULL CHECK (idade >= 0),
  sexo TEXT NOT NULL CHECK (sexo IN ('macho', 'femea')),
  castrado INTEGER NOT NULL CHECK (castrado IN (0, 1)),
  peso_kg REAL NOT NULL CHECK (peso_kg > 0)
);

INSERT OR IGNORE INTO coelhos (id, nome, porte, idade, sexo, castrado, peso_kg) VALUES
  (1, 'Voldemort', 'medio', 3, 'macho', 1, 1.5),
  (2, 'Hanna', 'grande', 7, 'macho', 1, 3.0),
  (3, 'Frida', 'mini', 5, 'femea', 1, 1.0),
  (4, 'Pink', 'medio', 7, 'femea', 1, 1.6),
  (5, 'Mingau', 'medio', 9, 'macho', 1, 1.5),
  (6, 'Dani', 'mini', 7, 'femea', 1, 1.6),
  (7, 'José', 'mini', 7, 'macho', 1, 1.8);