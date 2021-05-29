// read the config which contains api keys from .env file.
const dotenv = require('dotenv')
dotenv.config()

const express = require('express')

const cors = require('cors')
const bodyParser = require('body-parser')
const fetch = require('node-fetch')

const port = 9999
// Instance of express.
const app =express()
app.use(cors())
app.use(express.static('dist'))

//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.json())

// for Tests
module.exports = app


// Set up for geonames API.

console.log(`Printing geonames key  => ${process.env.GEONAMES_KEY}`)

const GEONAMES_ROOT = "http://api.geonames.org/searchJSON?q="
const GEONAMES_KEY_AND_PRAMS = `&username=${process.env.GEONAMES_KEY}&maxRows=1`

app.post('/geonames', callGeonames)

/* function callGeonames(){} 
*/

const callGeonames = (request,response) => {

    const city = 'Toronto'
    console.log(`request city is ${city}`)
    //const city = req.body.userData.destinationCity
    const geonamesCompleteURL = GEONAMES_ROOT + city + GEONAMES_KEY_AND_PRAMS
    console.log(`geonamesCompleteURL is ${geonamesCompleteURL}`)

    try {
       const response = await fetch(geonamesCompleteURL)
       if(!response.ok){
           console.error("hey i didn't proper response from geonames")
           response.send(null)
       } else {
        const jsonResponse = await response.json()
        console.log(jsonResponse)
        response.send(jsonResponse)
       }
    } catch(error) {
       console.error(`Error is this - ${error}`)
    }

}

app.listen(port,
    () => console.log(`This app listening on port ${port}!`)
)
