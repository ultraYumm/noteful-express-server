const express = require('express')
const { v4: uuid } = require('uuid');
const logger = require('../logger')
const notes = require ('../notes-data.js')
const folders = require ('../folders-data.js')

const notesRouter = express.Router()
const bodyParser = express.json()

notesRouter
  .route('/notes')
  .get((req, res) => {
    res.json(notes);
    
  })
  .post(bodyParser, (req, res) => {
            const { name, content, folderId } = req.body;
      
        if (!name) {
          logger.error(`Name is required`);
          return res
            .status(400)
            .send('Invalid data');
        }
        
        if (!content) {
          logger.error(`Content is required`);
          return res
            .status(400)
            .send('Invalid data');
        }
      
        if (!folderId) {
          logger.error(`folderId is required`);
          return res
            .status(400)
            .send('Invalid data');
        }
       
        if (folders.length > 0) {
          let valid = true;
          const validId = folders.find(f => f.id == folderId);
            if (!validId) {
              logger.error(`Folder with id ${folderId} not found in folder array.`);
              valid = false;
            }
          ;
      
          if (!valid) {
            return res
              .status(400)
              .send('Invalid data');
          }
        }
      
        const id = uuid();
      
        const modified = new Date();
      
        const note = {
          id,
          name,
          modified,
          folderId,
          content,    
        };
      
      notes.push(note);
      logger.info(`Note with id ${id} created`);
      
      res
        .status(201)
        .location(`http://localhost:8000/notes/${id}`)
        .json(note);
      
      })
      
    
notesRouter
  .route('/notes/:id')
  .get((req, res) => {{
  const { id } = req.params;
  const note = notes.find(n => n.id == id);

  // make sure we found a note
  if (!note) {
    logger.error(`Note with id ${id} not found.`);
    return res
      .status(404)
      .send('Note Not Found');
  }

  res.json(note);
}})

.delete((req, res) => {
    const { id } = req.params;

    const noteIndex = notes.find(n => n.id == id);
  
    if (!noteIndex) {
      logger.error(`Note with id ${id} not found.`);
      return res
        .status(404)
        .send('Not Found');
    }
  
    notes.splice(noteIndex, 1);
  
    logger.info(`Note with id ${id} deleted.`);
    res
      .status(204)
      .end();
  });
  
 
module.exports = notesRouter