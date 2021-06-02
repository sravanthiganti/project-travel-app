const fetch = require('node-fetch')
// const app = require('../../server/server')

/**
 * 
 * @param {*} apiData -- it stores all API responses 
 * @returns void
 */

export const callApis = async (apiData) => {
  const genericError = document.getElementById('generic-error')
  const serverErrorMessage = "We couldn't connect to our APIs -- please try later.."
  //call geoNames EndPoint localhost:9999/geonames
  const geoNamesResponse = await apiCaller('/geonames', apiData)
  console.log(`GeonamesResponse in call-apis is ${geoNamesResponse.geonames}`)
  if(geoNamesResponse == null) {
    genericError.innerHTML = serverErrorMessage
    return null
  }else if(geoNamesResponse.geonames.length == 0) {
      genericError.innerHTML = `We can't find the city ${apiData.userData.destinationCity}. Verify your spelling and try again`
      return null
  }
  apiData["cityData"] = Client.extractCityData(geoNamesResponse)
  console.log(apiData.cityData)
  
  //call weatherbit Endpoint localhost:9999/weatherbit
  const weatherBitResponse = await apiCaller('/weatherbit', apiData)
  if(weatherBitResponse == null) {
    genericError.innerHTML = serverErrorMessage
    return null
  }

   // Test this.. 
   apiData["WeatherForecastData"] = Client.extractForecastData(weatherBitResponse, apiData)
   console.log(apiData.WeatherForecastData)

   //call pixabay Endpoint localhost:9999/pixabay
  const pixabayResponse = await apiCaller('/pixabay',apiData)
  if(pixabayResponse == null) {
    genericError.innerHTML = serverErrorMessage
    return null
  }

  apiData["extractRandomPhoto"] =  Client.extractRandomPhoto(pixabayResponse)
  apiData["pixabayResponse"] = pixabayResponse
  console.log(apiData.extractRandomPhoto)
  
 const storeApiData = await apiCaller('/storeApiData',apiData)
 console.log(`apiData is stored with this message => ${storeApiData}`)

 return apiData
}


/**
 * - helper function that can be reuesed by geonames, weatherbit , pixabay and to store data.
 */

const apiCaller = async (apiUrl,apiData) => {
     try{
        console.log(`apiData is ${apiData}`)
        const port = 8081;
        console.log(`port is ${port}`)
        // for some reason local host not working on heroku
        const localUrl = `http://localhost:${port}${apiUrl}`
        //const localUrl = `https://0.0.0.0:${port}${apiUrl}`
        console.log(`URL is ${localUrl}`)
        const response = await fetch(localUrl, {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json'
            },
            // Body data type must match "Content-Type" header        
            body: JSON.stringify(apiData)
        })
        // Return null if server route was not found
        if (!response.ok) {
            console.log(`Error connecting to http://localhost:${port}${apiUrl}. Response status ${response.status}`)
            return null
        }
        const responseJSON = await response.json()
        console.log(`response is ${JSON.stringify(responseJSON)}`)
        return responseJSON

     }catch(error) {
        console.error(`No sure what happened, we couldn't make api call -- error check the server logs`)
        return null
     }
}


/**
 *  _helper function to extract data from geoname
 * 
 */

export const extractCityData = (geoNamesResponse) => {

  const longitude = geoNamesResponse.geonames[0].lng
  const latitude = geoNamesResponse.geonames[0].lat
  const country = geoNamesResponse.geonames[0].countryName
  const population = geoNamesResponse.geonames[0].population

  return { latitude, longitude, country, population }
}

/**
 * 
 * @param {*} weatherBitResponse 
 * @param {*} apiData 
 * @returns 
 */

 export const extractForecastData = (weatherBitResponse, apiData) => {

  // An array to hold objects each representing 1 day of forecast data
  const forecastData = []

  // Define these here just to shorten the references to them
  let timeUntilTrip = apiData.userData.timeUntilTrip
  let timeUntilReturn = apiData.userData.timeUntilReturn
  const departureDate = apiData.userData.departureDate

  // Checks if there is a mismatch between local time of user and local time 
  // at destination, adjusts dates accordingly
  apiData["departFinishedAtDestination"] = false
  apiData["returnFinishedAtDestination"] = false
  if (!(departureDate == weatherBitResponse.data[timeUntilTrip].valid_date)) {
      console.log(`Date difference between user and destination detected!`)
      // If departure date matches the next element in the forecast array, 
      // then current local date is 1 day behind user's date, and should
      // start at next element in the array
      if (departureDate == weatherBitResponse.data[timeUntilTrip + 1].valid_date) {
          console.log(`Destination current local date is 1 day behind user's date`)
          timeUntilTrip += 1
          timeUntilReturn += 1
          // Otherwise current local date must be 1 date after user's date
      } else {
          console.log(`Destination current local date is 1 day ahead of user's date`)
          if (timeUntilTrip > 0) {
              timeUntilTrip -= 1
          } else {
              // User leaves today but today's date is finished
              // at destination
              apiData.departFinishedAtDestination = true
              console.log("departFinishedAtDestination is true")
          }
          if (timeUntilReturn > 0) {
              timeUntilReturn -= 1
          } else {
              // User returns today but today's date is finished
              // at destination
              apiData.returnFinishedAtDestination = true
              console.log("FinishedAtDestination is true")
          }
      }
  }

  //  API currently returns max 16 days data
  let lastForecastDay = 10
  if (timeUntilReturn < 10) {
      lastForecastDay = timeUntilReturn
  }
  // Grab the weather information out of larger data 
  for (let i = timeUntilTrip; i <= lastForecastDay; i++) {
      const date = weatherBitResponse.data[i].valid_date
      const windSpeed = weatherBitResponse.data[i].wind_spd
      const windDirection = weatherBitResponse.data[i].wind_dir
      const highTemperature = weatherBitResponse.data[i].high_temp
      const lowTemperature = weatherBitResponse.data[i].low_temp
      const chancePrecipitation = weatherBitResponse.data[i].pop
      const precipitation = weatherBitResponse.data[i].precip
      const snow = weatherBitResponse.data[i].snow
      const humidity = weatherBitResponse.data[i].rh
      const description = weatherBitResponse.data[i].weather.description
      const icon = weatherBitResponse.data[i].weather.icon

      // Add an object containing all extracted weather information for this 
      // day to the array above
      forecastData.push({ date, windSpeed, windDirection, highTemperature, lowTemperature, chancePrecipitation, precipitation, snow, humidity, description, icon })
  }
  return forecastData
}


export const extractRandomPhoto = (pixabayResponse) => {
  // Largest value of a "page" in returned photo results
  let count = 40
  // Set count lower if fewer than count results were returned
  if (pixabayResponse.totalHits < count) {
      count = pixabayResponse.totalHits
  }
  // Use numberOfPhotos-1 because this will be an array index
  const randomNumber = Math.round(Math.random() * (count - 1))
  console.log(`Random photo chosen #${randomNumber + 1} of ${count}`)
  console.log(`pixabay response is ${JSON.stringify(pixabayResponse)}`)
  const randomPhoto = pixabayResponse.hits[randomNumber].webformatURL

  return randomPhoto
}




