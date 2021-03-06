const path = require('path')
const express = require('express')
const NotesService = require('./notes-service')

const notesRouter = express.Router()
const jsonParser = express.json()

notesRouter
  .route('/')
  .get((req, res, next) => {
    NotesService.getAllNotes(
      req.app.get('db')
    )
      .then(notes => {
        res.json(notes)
      })
      .catch(next)
  })

  .post(jsonParser, (req, res, next) => {
    const { name, content, folderid } = req.body

    const newNote = { name, content, folderid }
    NotesService.insertNote(
      req.app.get('db'),
      newNote
    )
      .then(note => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${note.id}`))
          .json(note)
      })
      .catch(next)
  })

notesRouter
  .route('/:note_id')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db')
    NotesService.getById(knexInstance, req.params.note_id)
      .then(note => {
        if (!note) {
          return res.status(404).json({
            error: { message: `note doesn't exist` }
          })
        }
        res.json(note)
      })
      .catch(next)
  })

notesRouter
  .route('/:note_id')
  .delete((req, res, next) => {
    const knexInstance = req.app.get('db')
    NotesService.deleteNote(knexInstance, req.params.note_id)
      .then(note => {
        if (!note) {
          return res.status(404).json({
            error: { message: `note doesn't exist` }
          })
        }
        res.json(note)
      })
      .catch(next)

    })

notesRouter
  .route('/:note_id')  
  .patch(jsonParser, (req, res, next) => {
    const { name, content, folderid } = req.body
    const modified = new Date ()
    const noteToUpdate = { name, content, folderid, modified }
    const requiredValues = { name, content, folderid }

    const numberOfValues = Object.values(requiredValues).filter(Boolean).length
      if (numberOfValues === 0) {
        return res.status(204).json({
          error: {
            message: `Request body must contain 'name' or 'content' and 'folderid'`
          }
         
     })
   }


    NotesService.updateNote(
      req.app.get('db'),
      req.params.note_id,
      noteToUpdate
    ) 
      .then(note => {
        if (!note) {
          return res.status(404).json({
            error: { message: `Note doesn't exist` }
          })
        }
        
      res.status(204).end()
    })
      .catch(next)
  })
  




module.exports = notesRouter
