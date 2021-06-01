//  Webpack build tool needs this
// Import functions from other files
import { submitted ,checkLocalStorage,clearLocalStorage } from './js/app'
import { updateUI } from './js/updateUI'
import { callApis,extractCityData,extractForecastData,extractRandomPhoto } from './js/call-apis'
import { createForecastCard } from './js/createForecastCard'


// Export functions to Client library (see webpack.dev and webpack.prod files)
export {
    submitted,
    updateUI,
    checkLocalStorage,
    clearLocalStorage,
    callApis,
    extractCityData,
    extractForecastData,
    extractRandomPhoto,
    createForecastCard
}

import './styles/resets.scss'
import './styles/base.scss'
import './styles/footer.scss'
import './styles/form.scss'
import './styles/header.scss'

// Import weather images from icon folder
import './images/a01d.png'
import './images/a02d.png'
import './images/a03d.png'
import './images/a04d.png'
import './images/a05d.png'
import './images/a06d.png'
import './images/c01d.png'
import './images/c02d.png'
import './images/c03d.png'
import './images/c04d.png'
import './images/d01d.png'
import './images/d02d.png'
import './images/d03d.png'
import './images/f01d.png'
import './images/r01d.png'
import './images/r02d.png'
import './images/r03d.png'
import './images/r04d.png'
import './images/r05d.png'
import './images/r06d.png'
import './images/s01d.png'
import './images/s02d.png'
import './images/s03d.png'
import './images/s04d.png'
import './images/s05d.png'
import './images/s06d.png'
import './images/t01d.png'
import './images/t02d.png'
import './images/t03d.png'
import './images/t04d.png'
import './images/t05d.png'
import './images/u00d.png'

(function () {
    // Get today's date
    const d = new Date()
    let minMonth = (d.getMonth() + 1).toString()
    let minDate = d.getDate().toString()
    const minYear = d.getFullYear().toString()
    // Add 0 to months and days that are < 10
    if (minMonth.length == 1) {
        minMonth = "0" + minMonth
    }
    if (minDate.length == 1) {
        minDate = "0" + minDate
    }

    // Maximum date to start forecast is 10 days from today
    d.setDate(d.getDate() + 10)
    let maxMonth = (d.getMonth() + 1).toString()
    let maxDate = d.getDate().toString()
    const maxYear = d.getFullYear().toString()
    // Add 0 to months and days that are < 10
    if (maxMonth.length == 1) {
        maxMonth = "0" + maxMonth
    }
    if (maxDate.length == 1) {
        maxDate = "0" + maxDate
    }

    // Set minimum and maximum dates in calendar
    const formattedMinDate = `${minYear}-${minMonth}-${minDate}`
    const formattedMaxDate = `${maxYear}-${maxMonth}-${maxDate}`
    const departureDate = document.getElementById('departure-date')
    departureDate.setAttribute("min", formattedMinDate)
    departureDate.setAttribute("max", formattedMaxDate)
    const returnDate = document.getElementById('return-date')
    returnDate.setAttribute("min", formattedMinDate)

    // Add click listener on submit button
    const submitButton = document.getElementById('submit-button')
    submitButton.addEventListener('click', submitted)

    // Add listener to update the UI from local storage if it exists
    window.addEventListener('load', checkLocalStorage)

    // Add click listener to Clear Data button to erase local storage
    const clearButton = document.getElementById('clear-button')
    clearButton.addEventListener('click', clearLocalStorage)

})()