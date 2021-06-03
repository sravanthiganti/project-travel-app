
const app = require('../src/server/server')
const supertest = require('supertest')

// https://zellwk.com/blog/endpoint-testing/
const request = supertest(app)

describe("When we call with valid test data object", () => {

    it("to store api data endpoint", async () => {
        const response = await request.post('/storeApiData', "testData")
        expect(response.body.message).toBe("Successfuly saved the api data")
        expect(response.status).toBe(200)
    })
})