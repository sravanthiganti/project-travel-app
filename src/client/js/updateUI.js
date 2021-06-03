export const updateUI = (apiData) => {

    // Countdown display
    let messageEnd;
    if (apiData.userData.timeUntilTrip == 0) {
        messageEnd = "is today! Are you ready to go?"
    } else if (apiData.userData.timeUntilTrip == 1) {
        messageEnd = "is tomorrow! Are you packed?"
    } else {
        messageEnd = `is coming up in ${apiData.userData.timeUntilTrip} days!`
    }
    document.getElementById('duration-of-trip').innerHTML = `Your ${apiData.userData.tripDuration + 1}-day trip to ${apiData.userData.destinationCity}, ${apiData.cityData.country} ${messageEnd}`

    document.getElementById('forecast-title').innerHTML = "Forecast for the trip:"


    // Image of the location
    const locationImage = document.createElement('img')
    locationImage.src = apiData.extractRandomPhoto
    locationImage.alt = `Photo taken in ${apiData.userData.destinationCity}`
    locationImage.height = 225
    locationImage.width = 300
    const imageContainer = document.getElementById('location-image-container')

    // Clears previous image (if any) and adds new one
    // Multiple images will pile up if not cleared
    imageContainer.innerHTML = ""

    // Create document fragment to add to true DOM all at once
    // This is better performance, each add to DOM has a cost
    let fragment = document.createDocumentFragment()
    fragment.append(locationImage)

    // Create the button to change the image
    const changeImageButton = document.createElement('button')
    changeImageButton.innerHTML = "Change Image"
    changeImageButton.classList.add('change-image-button')

    // Add the click listener
    changeImageButton.addEventListener('click', () => {
        // Get a random photo, clear storage, set storage again
        // The resetting of the storage makes sure that same photo will
        // be loaded again if user comes back
        apiData.extractRandomPhoto = Client.extractRandomPhoto(apiData.pixabayResponse)
        locationImage.src = apiData.extractRandomPhoto
        localStorage.clear()
        localStorage.setItem('apiData', JSON.stringify(apiData))
    })
    fragment.append(changeImageButton)
    imageContainer.append(fragment)


    fragment = document.createDocumentFragment()

    // Make a card with message if user leaves today but it's already 
    // tomorrow's date at destination so no forecast available
    if (apiData.departFinishedAtDestination) {
        // Create the card div, data will append to this
        console.log("Making dummy card for today with departure date finished")
        const weatherForecastCards = document.createElement('div')
        weatherForecastCards.classList.add('forecast-card')
        weatherForecastCards.innerHTML = "<h3>Today's date in your local time is already finished at the destination, so no forecast for today.</h3>"
        fragment.append(weatherForecastCards)
    }
    if (apiData.returnFinishedAtDestination) {
        console.log("Adding just dummy card because return date finished")
        const forecastCardContainer = document.getElementById('forecast-card-container')
        forecastCardContainer.innerHTML = ""
        forecastCardContainer.append(fragment)
        return
    }
    const weatherForecasts = apiData.WeatherForecastData

    // Create a forecast card for each day in the trip
    for (const forecast of weatherForecasts) {
        const forecastCard = Client.createWeatherForecastCards(forecast, apiData.userData.units)

        // Append the card to the fragment for now, leave the DOM alone
        fragment.append(forecastCard)
    }

    // Clear any old data from the card container and add new cards to true DOM
    const forecastCardContainer = document.getElementById('forecast-card-container')
    forecastCardContainer.innerHTML = ""
    forecastCardContainer.append(fragment)
}


export const createWeatherForecastCards = (forecast, units) => {

    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    let temperature, speed,depth
   
    if (units == "I") {
        temperature = "F"
        speed = "mph"
        depth = "inches"
    } else {
        temperature = "deg C"
        speed = "m/s"
        depth = "mm"
    }

    // Create the card div, data will append to this
    const weatherForecastCards = document.createElement('div')
    weatherForecastCards.classList.add('forecast-card')

    // Create all div elements
    const dateDiv = document.createElement('div')
    const descriptionDiv = document.createElement('div')
    const highTemperatureDiv = document.createElement('div')
    const lowTemperatureDiv = document.createElement('div')
    const humidityDiv = document.createElement('div')
    const chancePrecipitationDiv = document.createElement('div')
    const precipitationDiv = document.createElement('div')
    const snowDiv = document.createElement('div')
    const windSpeedDiv = document.createElement('div')
 

    dateDiv.classList.add('date')
    const dayOfWeek = days[new Date(forecast.date).getDay()]
    dateDiv.innerHTML = `<h4 class="card-date">${forecast.date}<br>${dayOfWeek}</h4>`

    // icon div and link to icon image
    const icon = document.createElement('img')
    icon.classList.add('icon')
    icon.src = `./images/${forecast.icon}.png`
    icon.alt = "Showing weather icons"

    // weather description
    descriptionDiv.classList.add('description')
    descriptionDiv.innerHTML = forecast.description
    // high temperature
    highTemperatureDiv.classList.add('high-temperature')
    highTemperatureDiv.innerHTML = `High Temp: ${forecast.highTemperature}°${temperature}`
    // low temperature
    lowTemperatureDiv.classList.add('low-temperature')
    lowTemperatureDiv.innerHTML = `Low Temp: ${forecast.lowTemperature}°${temperature}`
    // relative humidity 
    humidityDiv.classList.add('humidity')
    humidityDiv.innerHTML = `Humidity: ${forecast.humidity}%`
    // precipitation chance
    chancePrecipitationDiv.classList.add('chance-precipitation')
    chancePrecipitationDiv.innerHTML = `Precipitation Chance: ${forecast.chancePrecipitation}%`
    // amount of precipitation
    precipitationDiv.classList.add('precipitation')
    precipitationDiv.innerHTML = `Precipitation Amount: ${forecast.precipitation.toFixed(1)}${depth}`
    // amount of snow
    snowDiv.classList.add('snow')
    snowDiv.innerHTML = `Snow : ${forecast.snow.toFixed(1)}${depth}`
    // wind speed
    windSpeedDiv.classList.add('wind-speed')
    windSpeedDiv.innerHTML = `Wind Speed: ${forecast.windSpeed.toFixed(1)}${speed}`

    weatherForecastCards.append(dateDiv)
    weatherForecastCards.append(icon)
    weatherForecastCards.append(descriptionDiv)
    weatherForecastCards.append(highTemperatureDiv)
    weatherForecastCards.append(lowTemperatureDiv)
    weatherForecastCards.append(chancePrecipitationDiv)
    weatherForecastCards.append(precipitationDiv)
    weatherForecastCards.append(snowDiv)
    weatherForecastCards.append(windSpeedDiv)
    weatherForecastCards.append(humidityDiv)
   
 

    return weatherForecastCards
}