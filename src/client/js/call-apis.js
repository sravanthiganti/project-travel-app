const fetch = require('node-fetch')
const app = require('../../server/server')

/**
 * 
 * @param {*} apiData -- it stores all API responses 
 * @returns void
 */

const callApis = async (apiData) => {

  const genericError = document.getElementById('generic-error')
  const serverErrorMessage = "We couldn't connect to our APIs -- please try later.."
  
  //call geoNames EndPoint localhost:9999/geonames
  const geoNamesResponse = apiCaller('/geonames', apiData)

  if(geoNamesResponse == null) {
    genericError.innerHTML = serverErrorMessage
    return null
  }else if(geoNamesResponse.geonames.length === 0) {
      genericError.innerHTML = `We can't find the city ${apiData.userData.destinationCity}. Verify your spelling and try again`
      return null
  }
  // Test this -- extractCityData
  apiData["cityData"] = Client.extractCityData(geoNamesResponse)
  console.log(apiData.cityData)
  
  //call weatherbit Endpoint localhost:9999/weatherbit
  const weatherBitResponse = apiCaller('/weatherbit', apiData)
  
  if(weatherBitResponse == null) {
    genericError.innerHTML = serverErrorMessage
    return null
  }

   // Test this -- extractForecastData
   apiData["WeatherForecastData"] = Client.extractForecastData(weatherBitResponse, apiData)
   console.log(apiData.WeatherForecastData)

   //call pixabay Endpoint localhost:9999/pixabay
  const pixabayResponse = apiCaller('/pixabay',apiData)
  if(pixabayResponse == null) {
    genericError.innerHTML = serverErrorMessage
    return null
  }

  apiData["mostlikedPhoto"] = Client.extractMostLikedPhoto(pixabayResponse)
  apiData["photos"] = photoData
  console.log(apiData.mostlikedPhoto)
  
 const storeApiData = await apiCaller('storeApiData',apiData)
 console.log(`apiData is stored with this message => ${storeApiData}`)
}


/**
 * - helper function that can be reuesed by geonames, weatherbit , pixabay and to store data.
 */

const apiCaller = async (apiUrl,apiData) => {
  
     try{
        const body =  {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json'
            },
            // Body data type must match "Content-Type" header        
            body: JSON.stringify(apiData)
           }
        const response = await fetch(apiUrl,body)
        if (!response.ok) {
            console.log(`Can't connect to http://localhost:9999/${url}.Status is ${response.status}`)
            return null
        }
        return response.json()

     }catch(error) {
        console.error(`No sure what happened, we couldn't make api call -- error check the server logs ${error}`)
        return null
     }
}