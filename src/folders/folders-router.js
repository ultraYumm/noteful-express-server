const express = require('express')
const { v4: uuid } = require('uuid');
const logger = require('../logger')

const foldersRouter = express.Router()
const bodyParser = express.json()

const notes = require ('../notes-data.js')
const folders = require ('../folders-data.js')


foldersRouter
  .route('/folders')
  .get((req, res) => {
    res.json(folders);
    
  })
  .post(bodyParser, (req, res) => {
    const { name } = req.body;

  if (!name) {
    logger.error(`Name is required`);
    return res
      .status(400)
      .send('Invalid data');
  }
  
  const id = uuid();

  const modified = new Date();

  const folder = {
    id,
    name
  };

folders.push(folder);
logger.info(`Note with id ${id} created`);

res
  .status(201)
  .location(`http://localhost:8000/folders/${id}`)
  .json(folder);
  })

foldersRouter
  .route('/folders/:id')
  .get((req, res) => {
    const { id } = req.params;
  const folder = folders.find(f => f.id == id);

  // make sure we found a folder
  if (!folder) {
    logger.error(`Folder with id ${id} not found.`);
    return res
      .status(404)
      .send('Folder Not Found');
  }

  res.json(folder);
})
  
module.exports = foldersRouter