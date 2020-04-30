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
   connection: process.env.DB_URL
  })  

console.log('knex and driver installed correctly')

app.use(morgan(morganOption))

app.use(helmet())
app.use(cors())
app.use(notesRouter)
app.use(foldersRouter)


app.use(function errorHandler(error, req, res, next) {
  let response
  if (NODE_ENV === 'production') {
    response = { error: { message: 'server error' } }
  } else {
    console.error(error)
    response = { message: error.message, error }
  }
  res.status(500).json(response)
})

app.get("/", (req, res) =>{
  res.send ('Hello, noteful-express-server!')
})





module.exports = app