
[![Heroku](https://heroku-badge.herokuapp.com/?app=heroku-badge)]

# project-travel-app ( Work in Progress)
Travel app that obtains a desired trip location &amp; date from the user and displays weather and an image of the location using information obtained from external APIs

### External APIs used

* [Geonames API](http://www.geonames.org/) - returns latitude and longitude for location
* [Weatherbit API](https://www.weatherbit.io/) - returns weather forecast for the latitude and longitude
* [Pixabay API](https://pixabay.com/)  - To get photo for the location

We need API keys for all the APIs mentioned above.

Once we have the api keys, create `.env` file in the root and add api keys there as shown below.


```
GEONAMES_KEY = {your key here}
WEATHERBIT_KEY = {your key here}
PIXABAY_KEY = {your key here}
```

```
enable web serivce for geonames at https://www.geonames.org/manageaccount

request city is toronto
geonamesCompleteURL is http://api.geonames.org/searchJSON?q=toronto&username=marutikarra&maxRows=1
{
  totalResultsCount: 997,
  geonames: [
    {
      adminCode1: '08',
      lng: '-79.4163',
      geonameId: 6167865,
      toponymName: 'Toronto',
      countryId: '6251999',
      fcl: 'P',
      population: 2600000,
      countryCode: 'CA',
      name: 'Toronto',
      fclName: 'city, village,...',
      adminCodes1: [Object],
      countryName: 'Canada',
      fcodeName: 'seat of a first-order administrative division',
      adminName1: 'Ontario',
      lat: '43.70011',
      fcode: 'PPLA'
    }
  ]
}
```

### TODO(before submitting) -- Show how to install and run the app.

### TODO -- Show how to use the app.

### Results with Screenshots.

 - Add Screenshots here.
