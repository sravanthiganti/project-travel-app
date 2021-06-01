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
    document.getElementById('how-many-sleeps').innerHTML = `Your ${apiData.userData.tripDuration + 1}-day trip to ${apiData.userData.destinationCity}, ${apiData.cityData.country} ${messageEnd}`

    document.getElementById('forecast-title').innerHTML = "Here is the forecast for your trip:"


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
        const forecastCard = document.createElement('div')
        forecastCard.classList.add('forecast-card')
        forecastCard.innerHTML = "<h3>Today's date in your local time is already finished at the destination, so no forecast for today.</h3>"
        fragment.append(forecastCard)
    }
    if (apiData.returnFinishedAtDestination) {
        console.log("Adding just dummy card because return date finished")
        const forecastCardContainer = document.getElementById('forecast-card-container')
        forecastCardContainer.innerHTML = ""
        forecastCardContainer.append(fragment)
        return
    }
    const forecasts = apiData.WeatherForecastData

    // Create a forecast card for each day in the trip
    for (const forecast of forecasts) {
        const forecastCard = Client.createForecastCard(forecast, apiData.userData.units)

        // Append the card to the fragment for now, leave the DOM alone
        fragment.append(forecastCard)
    }

    // Clear any old data from the card container and add new cards to true DOM
    const forecastCardContainer = document.getElementById('forecast-card-container')
    forecastCardContainer.innerHTML = ""
    forecastCardContainer.append(fragment)
}