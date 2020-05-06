require('dotenv').config()
const knex = require('knex')
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')
const app = express()
const notesRouter = require('./notes/notes-router')
const foldersRouter = require('./folders/folders-router')

const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

const knexInstance = knex({
    client: 'pg',
   connection: process.env.DATABASE_URL
  })  



app.use(morgan(morganOption))

app.use(cors())
app.use(helmet())
app.use('/api/notes', notesRouter)
app.use('/api/folders', foldersRouter)


app.use(function errorHandler(error, req, res, next) {
  let response
  if (NODE_ENV === 'production') {
    response = { error: { message: 'server error' } }
  } else {
    
    response = { message: error.message, error }
  }
  res.status(500).json(response)
})

app.get("/", (req, res) =>{
  res.send ('Hello, noteful-express-api!')
})



module.exports = app