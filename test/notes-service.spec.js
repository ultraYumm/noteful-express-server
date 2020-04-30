const FoldersService = require('../src/folders-service')
const NotesService = require('../src/notes-service')
const knex = require('knex')

  describe(`Notes service object`, function() {
  
    let db

    /*let testFolders = [
      {
          id: '4',
          name: 'First test folder!'
      },
      {
          id: '5',
          name: 'Second test folder!',
      },
      {
          id: '6',
          name: 'Third test folder',
      },
    ]*/
    let testNotes = [
      {
        id: 1,
        name: 'First test note!',
        folderid: 4,
        modified: new Date(),
        content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus consequuntur deserunt commodi, nobis qui inventore corrupti iusto aliquid debitis unde non.Adipisci, pariatur.Molestiae, libero esse hic adipisci autem neque ?'
      },
      {
        id: 2,
        name: 'Second test note!',
        folderid: 5,
        modified: new Date(),
        content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum, exercitationem cupiditate dignissimos est perspiciatis, nobis commodi alias saepe atque facilis labore sequi deleniti. Sint, adipisci facere! Velit temporibus debitis rerum.'
      },
      {
        id: 3,
        name: 'Third test note',
        folderid: 6,
        modified: new Date(),
        content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Possimus, voluptate? Necessitatibus, reiciendis? Cupiditate totam laborum esse animi ratione ipsa dignissimos laboriosam eos similique cumque. Est nostrum esse porro id quaerat.'
      },
    ]
 
 

    before(() => {
      db = knex({
        client: 'pg',
        connection: process.env.TEST_DB_URL,
      })
    })

    /*before (() => {
      return db
        .into('noteful_folders')
        .insert(testFolders)
    })8?

    before (() => {
      return db
        .into('noteful_notes')
        .insert(testNotes)
    })

    after(() => db.destroy())

    /*describe(`getAllFolders()`, () => {
      
      before (() => {
      it(`resolves all folders from 'noteful_folders' table`, () => {
       return FoldersService.getAllFolders()
       .then(actual => {
         expect(actual).to.eql(testFolders)
       })})
      })
    })*/

       
    
    describe(`getAllNotes()`, () => {
      
           it(`resolves all articles from 'noteful_notes' table`, () => {
            return NotesService.getAllNotes(db)
            .then(actual => {
              expect(actual).to.eql(testNotes)
            })
           })
         })

after(() => db.destroy())


})

         
       
       
       //before('clean the table', () => db.raw('TRUNCATE noteful_folders, noteful_notes RESTART IDENTITY CASCADE'))
     
       //afterEach('cleanup',() => db.raw('TRUNCATE noteful_folders, noteful_notes  RESTART IDENTITY CASCADE'))
      
      
       // before(() => db('noteful_notes').truncate())
       // afterEach(() => db('noteful_notes').truncate())
     
             //after(() => db.destroy())
     
            
        /*context(`Given 'noteful_notes' has data`, () => {
            before(() => {
              return db
                .into('noteful_notes')
                .insert(testNotes)
            })
         
             it(`getAllNotes() resolves all articles from 'noteful_notes' table`, () => {
               return NotesService.getAllNotes(db)
                 .then(actual => {
                   expect(actual).to.eql(testNotes)
                 })
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

  
})*/