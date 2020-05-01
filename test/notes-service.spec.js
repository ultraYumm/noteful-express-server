const NotesService = require('../src/notes-service')
const knex = require('knex')



  describe(`Notes service object`, function() {
  
    let db
  

    let testFolders = [
      {
          id: 1,
          name: 'First test folder!'
      },
      {
          id: 2,
          name: 'Second test folder!',
      },
      {
          id: 3,
          name: 'Third test folder',
      },
    ]
    
    let testNotes = [
      {
        id: 1,
        name: 'First test note!',
        folderid: 1,
        modified:  '2019-01-03T00:00:00.000',
        content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus consequuntur deserunt commodi, nobis qui inventore corrupti iusto aliquid debitis unde non.Adipisci, pariatur.Molestiae, libero esse hic adipisci autem neque ?'
      },
      {
        id: 2,
        name: 'Second test note!',
        folderid: 2,
        modified: '2019-01-03T00:00:00.000',
        content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum, exercitationem cupiditate dignissimos est perspiciatis, nobis commodi alias saepe atque facilis labore sequi deleniti. Sint, adipisci facere! Velit temporibus debitis rerum.'
      },
      {
        id: 3,
        name: 'Third test note',
        folderid: 3,
        modified: '2019-01-03T00:00:00.000',
        content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Possimus, voluptate? Necessitatibus, reiciendis? Cupiditate totam laborum esse animi ratione ipsa dignissimos laboriosam eos similique cumque. Est nostrum esse porro id quaerat.'
      },
    ]
 
 

    before(() => {
      db = knex({
        client: 'pg',
        connection: process.env.TEST_DB_URL,
      })
    })

    after(() => db.destroy())

    before('clean the table', () => db.raw('TRUNCATE noteful_folders, noteful_notes RESTART IDENTITY CASCADE'))

    afterEach('cleanup',() => db.raw('TRUNCATE noteful_folders, noteful_notes RESTART IDENTITY CASCADE'))


    after(() => db.destroy())
  
    context(`Given 'note' has data`, () => {
         beforeEach('insert folders', () => {
           return db
          .into('noteful_folders')
          .insert(testFolders)
          .then (() => {
            return db
             .into('noteful_notes')
             .insert(testNotes)
         })})
      
         it(`getAllNotes() resolves all notes from 'noteful_notes' table`, () => {
            return NotesService.getAllNotes(db)
            .then(actual => {
              expect(actual).to.eql(testNotes.map(note => ({
                           ...note,
                           modified: new Date(note.modified)
                })
              ))
            })
         })

          it(`insertNote() inserts a new note and resolves the new note with an 'id'`, () => {
            const newNote = {
              id: 4,
              name: 'First test note!',
              folderid: 3,
              modified:  '2019-01-03T00:00:00.000',
              content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus consequuntur deserunt commodi, nobis qui inventore corrupti iusto aliquid debitis unde non.Adipisci, pariatur.Molestiae, libero esse hic adipisci autem neque ?'
                }
       
                 return NotesService.insertNote(db, newNote)
                  .then(actual => {
                    expect(actual).to.eql({
                      id: 4,
                      name: newNote.name,
                      folderid: newNote.folderid,
                      modified: new Date(newNote.modified),
                      content: newNote.content
                  })
                })  

          })

          it(`getById() resolves a note by id from 'noteful_articles' table`, () => {
                 const thirdId = 3
                 const thirdTestNote = testNotes[thirdId - 1]
                 return NotesService.getById(db, thirdId)
                   .then(actual => {
                     expect(actual).to.eql({
                       id: thirdId,
                       name: thirdTestNote.name,
                       folderid: thirdTestNote.folderid,
                       modified: new Date(thirdTestNote.modified),
                       content: thirdTestNote.content
                     })
                   })
               })


          it(`deleteNote() removes an note by id from 'noteful_notes' table`, () => {
               const noteId = 3
               return NotesService.deleteNote(db, noteId)
                 .then(() => NotesService.getAllNotes(db))
                 .then(allNotes => {
                   // copy the test notes array without the "deleted" note
                   const expected = testNotes.filter(note => note.id !== noteId).map(note => ({
                    ...note,
                    modified: new Date(note.modified)
                                       }))
                   expect(allNotes).to.eql(expected)
                 })
             })


          
        
    })

    context(`Given 'noteful_notes' has no data`, () => {
      
      it(`getAllNotes() resolves an empty array`, () => {
      return NotesService.getAllNotes(db)
        .then(actual => {
          expect(actual).to.eql([])
        })
      })
      
    })

  })
    


  



         