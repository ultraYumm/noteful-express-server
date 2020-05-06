const { expect } = require('chai')
const knex = require('knex')
const app = require('../src/app')
const { makeFoldersArray } = require('./folders.fixtures')
const { makeNotesArray } = require('./notes.fixtures')


describe ('notes endpoints', function() {

    let db
  
    before('make knex instance', () => {
      db = knex({
        client: 'pg',
        connection: process.env.TEST_DATABASE_URL,
      })
      app.set('db', db)
    })
  
    after('disconnect from db', () => db.destroy())
  
    before('clean the table', () => db.raw('TRUNCATE noteful_folders, noteful_notes RESTART IDENTITY CASCADE'))
    
    afterEach('cleanup',() => db.raw('TRUNCATE noteful_folders, noteful_notes RESTART IDENTITY CASCADE'))
    
    after(() => db.destroy())


  describe (`GET /api/notes`, () => {

      context(`Given no notes`, () => {
          it(`responds with 200 and an empty list`, () => {
          return supertest(app)
              .get('/api/notes')
              .expect(200, [])
          })
      })
      
      context('Given there are notes in the database', () => {

      const testFolders = makeFoldersArray()
      const testNotes = makeNotesArray()

      beforeEach('insert folders', () => {
        return db
        .into('noteful_folders')
        .insert(testFolders)
        .then (() => {
            return db
            .into('noteful_notes')
            .insert(testNotes)
        })})

      it('GET /api/notes responds with 200 and all of the notes', () => {
        return supertest(app)
        .get('/api/notes')
        .expect(200)
        .then (
            res => {    
            expect(res.body).to.eql(testNotes)
            })    

      })
      
      })
    })
  

  describe('notes/:id endpoints', () => {

      context('Given there are notes in the database', () => {
  
      const testFolders = makeFoldersArray()
      const testNotes = makeNotesArray()
      
          
      beforeEach('insert folders', () => {
          return db
          .into('noteful_folders')
          .insert(testFolders)
          .then (() => {
              return db
              .into('noteful_notes')
              .insert(testNotes)
          })})
  
  
      it('GET /api/notes/:id responds with 200 and the specified note', () => {
              const id = 2
              const expectedNote = testNotes[id - 1]
              return supertest(app)
              .get(`/api/notes/${id}`)
              .expect(200, expectedNote)
          })    
        })       
  })
      
      
    
  describe (`DELETE /api/notes/:note_id`, () => {
        
        context('Given there are notes in the database', () => {

        const testNotes = makeNotesArray()
        const testFolders = makeFoldersArray()

    
        beforeEach('insert folders', () => {
            return db
            .into('noteful_folders')
            .insert(testFolders)
            .then (() => {
                return db
                .into('noteful_notes')
                .insert(testNotes)
            })})
    
    
        it('responds with 204 and removes the note', () => {
          const idToRemove = 2
          const expectedNotes = testNotes.filter(note => note.id !== idToRemove)
          return supertest(app)
            .delete(`/api/notes/${idToRemove}`)
            .expect(200)
            .then(res =>
              supertest(app)
                .get(`/api/notes`)
                .expect(expectedNotes)
            )
        })
    })
  })

  describe (`PATCH /api/notes/:note_id`, () => {
                
        context(`Given no /notes`, () => {
        const testNotes = makeNotesArray()
        const testFolders = makeFoldersArray()

        beforeEach('insert folders', () => {
            return db
            .into('noteful_folders')
            .insert(testFolders)
            .then (() => {
                return db
                .into('noteful_notes')
                .insert(testNotes)
            })})

        const newNote = {
                name: "Dogs Post Test",
                content: "Post Test content",
                folderid: 1,
                modified: new Date ()            
            }  

        it(`responds with 404`, () => {
          const noteId = 123456
          return supertest(app)
            .patch(`/api/notes/${noteId}`)
            .send(newNote)
            .expect(404, { error: { message: `Note doesn't exist` } })
        })
      })

      context('Given there are notes in the database', () => {
      const testNotes = makeNotesArray()
      const testFolders = makeFoldersArray()


      beforeEach('insert folders', () => {
          return db
          .into('noteful_folders')
          .insert(testFolders)
          .then (() => {
              return db
              .into('noteful_notes')
              .insert(testNotes)
          })})

      
      it('responds with 204 and updates the note', () => {
        const idToUpdate = 2
        const updateNote = {
          name: 'updated note name',
          content: 'updated note content',
          folderid: 1,
          modified: new Date ()         
        }

        const expectedNote= {
              ...testNotes[idToUpdate - 1],
              ...updateNote
            }
        
          return supertest(app)
            .patch(`/api/notes/${idToUpdate}`)
            .send(updateNote)
            .expect(204)
            .then(res =>
                      supertest(app)
                        .get(`/api/notes/${idToUpdate}`)
                        .expect(expectedNote)
                    )
      })

      it(`responds with 400 when no required fields supplied`, () => {
              const idToUpdate = 2
              return supertest(app)
                .patch(`/api/notes/${idToUpdate}`)
                .send({ irrelevantField: 'foo' })
                .expect(400, {
                  error: {
                    message: `Request body must contain 'name' or 'content' and 'folderid'`
                  }
                })
              })

      it(`responds with 204 when updating only a subset of fields`, () => {
                const idToUpdate = 2
                const updateNote = {
                    name: 'updated note name',
                    folderid: 2, 
                    modified: new Date ()     
                      }
                const expectedNote = {
                  ...testNotes[idToUpdate - 1],
                  ...updateNote
                }
          
                return supertest(app)
                  .patch(`/api/notes/${idToUpdate}`)
                  .send({
                    ...updateNote,
                    fieldToIgnore: 'should not be in GET response'
                  })
                  .expect(204)
                  .then(res =>
                    supertest(app)
                      .get(`/api/notes/${idToUpdate}`)
                      .expect(expectedNote)
                  )
              })
            })


   })

  describe(`POST notes`, () => {


      context('Given there are notes in the database', () => {

      const testNotes = makeNotesArray()
      const testFolders = makeFoldersArray()

  
      beforeEach('insert folders', () => {
          return db
          .into('noteful_folders')
          .insert(testFolders)
        
        }
      )


      it(`creates a note, responding with 201 and the new note`,  function() {
              const newNote = {
                id: 10000,
                name: 'Test name',
                content: 'content',
                folderid: 1 }

              return supertest(app)
                .post(`/api/notes`)
                .send(newNote)
                .expect(201)
                .expect(res => {
                expect(res.body.name).to.eql(newNote.name)
                expect(res.body.content).to.eql(newNote.content)
                expect(res.body.folderid).to.eql(newNote.folderid)
                expect(res.body).to.have.property('id')
                expect(res.body).to.have.property('modified')
                expect(res.headers.location).to.eql(`/api/notes/${res.body.id}`)
                })
              
                
      })
      })
    })

})
          
    