DROP TABLE IF EXISTS noteful_notes;

  CREATE TABLE noteful_notes (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    name TEXT NOT NULL,
    modified DATE DEFAULT now() NOT NULL,
    folderId INTEGER REFERENCES noteful_folders(id) NOT NULL,
    content TEXT
  );