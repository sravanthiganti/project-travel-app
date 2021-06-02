// read the config which contains api keys from .env file.
const dotenv = require('dotenv')
dotenv.config()

const express = require('express')

const cors = require('cors')
const bodyParser = require('body-parser')
const fetch = require('node-fetch')

const port = process.env.PORT || 9999;
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

// set up for weatherbit API.
console.log(`Weatherbit API key  => ${process.env.WEATHERBIT_KEY}`)
const WEATHERBIT_ROOT = "https://api.weatherbit.io/v2.0/forecast/daily?"
const WEATHERBIT_KEY_URL_AND_PARAMS = `&key=${process.env.WEATHERBIT_KEY}&units=`

// set up for pixabay API
console.log(`Pixabay API key  => ${process.env.PIXABAY_KEY}`)
const PIXABAY_ROOT = "https://pixabay.com/api/?q="
const PIXABAY_KEY_URL_AND_PARAMS = `&key=${process.env.PIXABAY_KEY}&image_type=photo&orientation=horizontal&safesearch=true&per_page=45`

/* 
app.get('/index', function(request,response){
    response.sendFile('index.html',{ root: 'src/client/views' })
})
 */
// Serves the main page 
app.get('/',
    (req, res) => res.sendFile('dist/index.html')
)


// Initalize an array to store API data 
const apiData = []

const storeApiData = async (request,response) => {
   // store all api response body here.
   apiData.push(request.body)
   responseMessage = {message:'Successfuly saved the api data'}
   response.send(responseMessage)
   console.log(responseMessage)
}

const callGeonames = async (geoRequest,geoResponse) => {
     // const city = 'Toronto' 
    const city = geoRequest.body.userData.destinationCity
    console.log(`request city is ${city}`)

    const geonamesCompleteURL = GEONAMES_ROOT + city + GEONAMES_KEY_AND_PRAMS
    console.log(`geonamesCompleteURL is ${geonamesCompleteURL}`)

    try {
       const response = await fetch(geonamesCompleteURL)
       if(!response.ok){
           console.error("hey i didn't proper response from geonames")
           geoResponse.send(null)
       } 
        const jsonResponse = await response.json()
        console.log(jsonResponse)
        geoResponse.send(jsonResponse)

    } catch(error) {
        geoResponse.send(null)
        console.error(`Error is this - ${error}`)

    }

}

const callWeatherbit = async (wbRequest,wbResponse) => {
    const latitude = wbRequest.body.cityData.latitude
    const longitude = wbRequest.body.cityData.longitude

    const locationURL = `lat=${latitude}&lon=${longitude}`
    const units = wbRequest.body.userData.units

    const weatherbitCompleteURL = WEATHERBIT_ROOT + `lat=${latitude}&lon=${longitude}` + WEATHERBIT_KEY_URL_AND_PARAMS + units
    console.log(`Weather bit complete url is ${weatherbitCompleteURL}`)

    try {
        const WeatherResponse = await fetch(weatherbitCompleteURL)
        if(!WeatherResponse.ok){
            wbResponse.send(null)
            console.error("hey i didn't proper response from weatherbit")
        }
            const jsonResponse = await WeatherResponse.json()
            console.log(jsonResponse)
            wbResponse.send(jsonResponse)

    }catch(error){
        wbResponse.send(null)
        console.error(`Error is this - ${error}`)
    }
}

const callPixabay = async (pixaRequest,pixaResponse) => {

    const destinationCity = pixaRequest.body.userData.destinationCity
    let pixabayCompleteURL = PIXABAY_ROOT + destinationCity + PIXABAY_KEY_URL_AND_PARAMS

    const destinationCountry = pixaRequest.body.cityData.country
    let pixabayCountryURL = PIXABAY_ROOT + destinationCountry + PIXABAY_KEY_URL_AND_PARAMS
   
    console.log(`pixabay complete url is ${pixabayCompleteURL}`)

    try{
        const response = await fetch(pixabayCompleteURL)
        if(!response.ok){
            pixaResponse.send(null)
            console.error("hey i didn't proper response from pixabay")
        } else {
            let jsonResponse = await response.json()
            console.log(jsonResponse)
            // Add a check if we didn't a image a for a city
            if(jsonResponse.total == 0){
                console.log("No images are avalaible for the destination city, we are showing the image for country")
                // We didn't get image for city. Let's show one for the country.
                const response = await fetch(pixabayCountryURL)
                if(!response.ok){
                    pixaResponse.send(null)
                    console.error("We didn't get country image from pixabay")
                }
                pixaResponse.send(response.json())
            }
            pixaResponse.send(jsonResponse)
        }

    }catch(error){
        pixaResponse.send(null)
        console.error(`Error is this - ${error}`)
    }
   
}

app.post('/storeApiData', storeApiData)
app.post('/geonames', callGeonames)
app.post('/weatherbit',callWeatherbit)
app.post('/pixabay', callPixabay)



app.listen(port,
    () => console.log(`Travel weather app is listening on port ${port}!`)
)
