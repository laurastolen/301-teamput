/* eslint-disable camelcase */
'use strict';

const superagent = require('superagent');

let getYelpResults = (request, response, cityObj) => {
  // request.body contains the answer to "Are you hungry?" (yes/no)
  let yesOrNo = request.body.search;
  if (yesOrNo === 'yes') {
    let url = `https://api.yelp.com/v3/businesses/search?term=food&latitude=${cityObj.lat}&longitude=${cityObj.lng}&limit=10`;
    superagent.get(url)
      .set('Authorization', `Bearer ${process.env.YELP_API_KEY}`)
      .then(results => {
        let restaurants = results.body.businesses;
        let restaurantArr = restaurants.map(place => new Restaurant(place));
        response.render('apipartials/yelp', { restaurantList: restaurantArr, });
      })
      .catch(error => console.error(error));
  }
};
function Restaurant(place) {
  this.id = place.id;
  this.name = place.name;
  this.image_url = place.image_url;
  this.is_closed = place.is_closed;
  this.rating = place.rating;
  this.price = place.price;
  this.phone = place.phone;
  this.distance = place.distance;
}

module.exports = getYelpResults;