const FoldersService = require('../src/folders/folders-service')

const knex = require('knex')
const randomInt = require('random-int');


  describe(`Folders service object`, function() {
  
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
    
    before(() => {
      db = knex({
        client: 'pg',
        connection: process.env.TEST_DATABASE_URL,
      })
    })

    after(() => db.destroy())

    beforeEach('clean the table', () => db.raw('TRUNCATE noteful_folders, noteful_notes RESTART IDENTITY CASCADE'))

    afterEach('cleanup',() => db.raw('TRUNCATE noteful_folders, noteful_notes RESTART IDENTITY CASCADE'))


    after(() => db.destroy())
  
    context(`Given 'folder' has data`, () => {
         beforeEach('insert folders', () => {
           return db
          .into('noteful_folders')
          .insert(testFolders)})
      
         it(`getAllFolders() resolves all folders from 'noteful_folders' table`, () => {
            return FoldersService.getAllFolders(db)
            .then(actual => {
              expect(actual).to.eql(testFolders)
            })
         })

          it(`insertFolder() inserts a new folder and resolves the new folder with an 'id'`, () => {
            const newFolder = {
              id: 10,
              name: 'First test folder!',
                }
       
                 return FoldersService.insertFolder(db, newFolder)
                  .then(actual => {
                    expect(actual).to.eql({
                      id: 10,
                      name: newFolder.name,
                  })
                })  

          })
          it(`getById() resolves a folder by id from 'noteful_folders' table`, () => {
                 const thirdId = 3
                 const thirdTestFolder = testFolders[thirdId - 1]
                 return FoldersService.getById(db, thirdId)
                   .then(actual => {
                     expect(actual).to.eql({
                       id: thirdId,
                       name: thirdTestFolder.name,
                     })
                   })
               })

          it(`deleteFolder() removes an note by id from 'noteful_folders' table`, () => {
               const id = 3
               return FoldersService.deleteFolder(db, id)
                 .then(() => FoldersService.getAllFolders(db))
                 .then(allFolders => {
                   // copy the test folders array without the "deleted" folder
                   const expected = testFolders.filter(folder => folder.id !== id)
                   expect(allFolders).to.eql(expected)
                 })
             })
        
    })

    context(`Given 'noteful_folders' has no data`, () => {
      
      it(`getAllFolders() resolves an empty array`, () => {
      return FoldersService.getAllFolders(db)
        .then(actual => {
          expect(actual).to.eql([])
        })
      })
      
    })

  })
    


  



         