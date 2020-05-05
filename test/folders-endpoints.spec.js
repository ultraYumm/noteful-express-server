const { expect } = require('chai')
const knex = require('knex')
const app = require('../src/app')
const { makeFoldersArray } = require('./folders.fixtures')

describe ('folders endpoints', function() {

    let db
  
    before('make knex instance', () => {
      db = knex({
        client: 'pg',
        connection: process.env.TEST_DB_URL,
      })
      app.set('db', db)
    })
  
    after('disconnect from db', () => db.destroy())
  
    before('clean the table', () => db.raw('TRUNCATE noteful_folders, noteful_notes RESTART IDENTITY CASCADE'))
    
    afterEach('cleanup',() => db.raw('TRUNCATE noteful_folders, noteful_notes RESTART IDENTITY CASCADE'))
    
    after(() => db.destroy())


describe (`GET /api/folders`, () => {

    context(`Given no folders`, () => {
        it(`responds with 200 and an empty list`, () => {
        return supertest(app)
            .get('/api/folders')
            .expect(200, [])
        })
    })
     
    context('Given there are folders in the database', () => {

    const testFolders = makeFoldersArray()

    beforeEach('insert folders', () => {
        return db
        .into('noteful_folders')
        .insert(testFolders)
    })

    it('GET /api/folders responds with 200 and all of the folders', () => {
   
    return supertest(app)
    .get('/api/folders')
    .expect(200)
    .then (
        actual => {
        expect(actual).to.eql(testFolders
        )}
        )
    })
    
    })
   })
 

describe ('folders/:id endpoints', () => {

            context('Given there are folders in the database', () => {
        
            const testFolders = makeFoldersArray() 
            
            beforeEach('insert folders', () => {
                return db
                .into('noteful_folders')
                .insert(testFolders)
            })
                    
        
            it('GET /api/folders/:id responds with 200 and the specified folder', () => {
                    const id = 2
                    const expectedFolder = testFolders[id - 1]
                    return supertest(app)
                    .get(`/api/folders/${id}`)
                    .expect(200, expectedFolder)
                })    
        
            })       
        })
    
describe (`POST /api/folders`, () => {
    it(`creates folder, responding with 201 and the new folder`, function() {

            const newFolder = {
            name: "Post Folder Test",              
        }  
            
        return supertest(app)
            .post('/api/folders')
            .send(newFolder)
            .expect(201)
            .expect(res => {
                        expect(res.body.name).to.eql(newFolder.name)
                        expect(res.headers.location).to.eql(`/api/folders/${res.body.id}`)
                    })
        
        })
        
})

/*describe(`DELETE /api/folders/:folder_id`, () => {
        context('Given there are folders in the database', () => {

            const testFolders = makeFoldersArray()

    
            beforeEach('insert folders', () => {
            return db
            .into('noteful_folders')
            .insert(testFolders)
        })
    
            it('responds with 204 and removes the folder', () => {
            const idToRemove = 1
            const expectedFolders = testFolders.filter(folder => folder.id !== idToRemove)
            return supertest(app)
                .delete(`/api/folders/${idToRemove}`)
                .expect(200)
                .then(res =>
                supertest(app)
                    .get(`/api/folders`)
                    .expect(expectedFolders)
                )
            })
        })
    })*/

})


