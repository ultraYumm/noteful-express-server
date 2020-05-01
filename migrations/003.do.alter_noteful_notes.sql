ALTER TABLE noteful_notes
DROP COLUMN folderId;

ALTER TABLE noteful_notes
ADD COLUMN folderId INTEGER REFERENCES noteful_folders(id) ON DELETE CASCADE NOT NULL;


