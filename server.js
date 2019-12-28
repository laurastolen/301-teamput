'use strict';

const express = require('express');
const app = express();
require('ejs');
require('dotenv').config();
const methodOverride = require('method-override');
const superagent = require('superagent');

app.use(methodOverride('_method'));

const PORT = process.env.PORT || 3001;
const client = require('./lib/client');

app.set('view engine', 'ejs');
app.use(express.static('./public'));
app.use(express.urlencoded());


// // api JS
// const getYelpResults = require('./lib/yelp/yelp');
// const getEventsResults = require('./lib/events/getEventsResults');

// routes
app.get('/', getHome);
app.get('/result', showAllResults);
// app.get('/result', getEventsResults);
app.get('/aboutUs', aboutUs);
app.get('/quiz', displayQuiz);
app.put('/quiz', getLocPutdb);
app.delete('/result', deleteDbInfo);
app.delete('/', deleteDbInfo);

function deleteDbInfo(request, response) {
    let sql = 'DELETE FROM user_info;';
    client.query(sql);
    response.redirect('/');
}



function showAllResults(request, response) {
    let sql = 'SELECT * FROM user_info;';
    client.query(sql)
    //
    .then(results => {
        let answers = results.rows[0];
        let resultsArr = [];
        
        
        //yelp call
            let yesOrNo = answers.hunger;
            if (yesOrNo === 'yes') {
                // console.log(yesOrNo)
                let url = `https://api.yelp.com/v3/businesses/search?term=food&latitude=${answers.lat}&longitude=${answers.long}&limit=10`;
                superagent.get(url)
                    .set('Authorization', `Bearer ${process.env.YELP_API_KEY}`)
                    .then(results => {
                        let restaurants = results.body.businesses;
                        let restaurantArr = restaurants.map(place => new Restaurant(place));
                       
                        resultsArr.push(restaurantArr);
                    })
                    .catch(error => console.error(error));
            }

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


            // let promises = [getYelpResults(request, response, answers)];
            // Promise.all(resultsArr)
            //     .then(result => {
            //         console.log(result);
            //     })
            //     .catch(err => console.log(err))
            response.send(resultsArr);
        });
};


function getHome(request, response) {
    response.render('pages/index');
}

function aboutUs(request, response) {
    response.render('pages/aboutUs');
}

function displayQuiz(request, response) {
    response.render('pages/quiz');
}


//gets form data, calls geocode api, and updates that data to the database
function getLocPutdb(request, response) {


    let city = request.body.location;
    let url = `https://maps.googleapis.com/maps/api/geocode/json?address=${city}&key=${process.env.GEOCODE_API_KEY}`;
    superagent.get(url)
        .then(results => {
            let locationObject = {
                location: results.body.results[0].formatted_address,
                lat: results.body.results[0].geometry.location.lat,
                lng: results.body.results[0].geometry.location.lng,
            }

            let { hunger, interest, music, } = request.body;

            let sql = 'SELECT * FROM user_info;';
            client.query(sql)
                .then(results => {


                    if (results.rows.length > 0) {

                        let sql = 'UPDATE user_info SET hunger=$1, interest=$2, music=$3, location=$4, lat=$5, long=$6 WHERE user_id IS NOT NULL;';
                        let safeValues = [hunger, interest, music, locationObject.location, locationObject.lat, locationObject.lng];
                        client.query(sql, safeValues);
                    } else {
                        let sql = 'INSERT INTO user_info (hunger, interest, music, location, lat, long) VALUES ($1, $2, $3, $4, $5, $6);';
                        let safeValues = [hunger, interest, music, locationObject.location, locationObject.lat, locationObject.lng];
                        client.query(sql, safeValues);
                    }

                })

            response.redirect('/result');

        })
        .catch(error => console.error(error));

}




app.use('*', (request, response) => {
    response.status(404).send('page not found');
});
client.connect(() => {
    app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
})
