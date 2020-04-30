require('dotenv').config()
const knex = require('knex')
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')
const app = express()

const NotesService = require('./notes-service')

const knexInstance = knex({
  client: 'pg',
  connection: process.env.DB_URL,
})

console.log(NotesService.getAllNotes())