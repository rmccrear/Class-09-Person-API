// import express from 'express'
const express = require('express');
// create the express app server
const app = express();

// TODO...call an exteral API
// for calling an API to get photos
const axios = require('axios');
const PHOTO_KEY = process.env.PHOTO_KEY;

// import my knockKnockJoke function.
const knockKnockJoke = require("./chat");

const cors = require('cors'); // CORS is a security feature
app.use(cors()); // we need this for API servers

require('dotenv').config(); // we need this to load our .env file!
const PORT = process.env.PORT;

// Our data is here.
const data = require('./data/people.json');

// set the root route.
app.get('/', (request, response) => {
  response.send(data);
})

// set the people route
app.get('/people', (request, response) => {
  response.send(data);
})

// This can let us crete 
class Person {
  constructor(personObj) {
    // You can copy just the properties you need.
    this.name = personObj.name;
    this.favColor = personObj.favCol;
    this.favMusic = personObj.favMusic;
    this.favFood = personObj.favFood;
    // You can add more complex properties here as well.
    this.allFaves = `My favorite food is ${personObj.favFood}. My fav music is ${personObj.favMusic}. My fav color is ${personObj.favCol}.`
  }
}

// set the favorite-color route
// This is an example URL that will activate a valid response from this route
// https://class-09-person-api.rmccrear.repl.co/favorite-color?searchQuery=Red
app.get('/favorite-color', async (request, response) => {
  // This will get the searchQuery parameter from the URL
  // That is: ?searchQuery=Red part
  let favColor = request.query.searchQuery;
  console.log(favColor);

  // This is a simple response to show proof of life. Start with this!
  // response.send(`I know your favorite color! ${favColor}`);

  // This starts a more complext, but correct response.
  // Find the one person with this favorite color.
  // Set that person in the `person` variable
  let person = data.find((per) => per.favCol === favColor);

  // If not found, we send an error.
  if (!person) {
    return response.status(404).send({
      error: `No one found with favCol: ${favCol}`
    });
  }

  // Extra: we can call an external API to get more information.
  let result = await knockKnockJoke(person.name, `${person.favColor} Color`);
  console.log(result);
  let joke = result.content;

  // Simply send a response...
  // response.send(person);

  // Send a response with these just properties, also include the joke.
  // For your lab, you don't need this, because you aren't adding a joke.
  response.send({
    name: person.name,
    imgUrl: person.imgUrl,
    favColor: person.favCol,
    joke: joke
  });
});

app.get('/favorite-music', async (request, response, next) => {
  let favMusic = request.query.searchQuery;
  console.log(favMusic);
  // response.send(`I know your favorite music! ${favMusic}`);

  if (!favMusic) {
    next(new Error("must include a search query"))
  }

  let person = data.find((per) => per.favMusic === favMusic);

  let result = await knockKnockJoke(person.name, `${person.favMusic} Music`);

  console.log(result);
  let joke = result.content;


  response.send({
    name: person.name,
    imgUrl: person.imgUrl,
    favMusic: person.favMusic,
    joke: joke
  });
});

// https://class-09-person-api.rmccrear.repl.co/favorite-food?searchQuery=Salmon%20Ceasar%20Salad
app.get('/favorite-food', (request, response, next) => {
  let favFood = request.query.searchQuery;
  console.log(favFood);

  // response.send(`Thats's my favorite food also! ${favFood}`);

  let personObj = data.find(
    (person) => person.favFood === favFood);

  // if(!city) {
  if (!personObj) {
    // return response.status(404).send({ error: "Can't find person" });
    return next(new Error("Can't find person"));
  }

  // Note: In your lab you do this to an array of objects, not just a single object.
  let person = new Person(personObj);
  return response.send(person);

});

// https://class-09-person-api.rmccrear.repl.co/favorite-weather?searchQuery=
app.get('/favorite-weather', async (request, response) => {
  let favWeather = request.query.searchQuery;
  console.log(favWeather);
  let photo;
  let url = `https://api.unsplash.com/search/photos?client_id=${PHOTO_KEY}&query=${favWeather}`;
  try {
    let result = await axios.get(url);
    console.log(result.data);
    photo = result.data.results[0].urls.small;
  } catch (e) {
    console.log(e.message, e.status);
    return response.status(500).send({ error: e.message });
  }

  let person = data.find(p => p.favWeather === favWeather);
  person.weatherPhotoUrl = photo;
  response.send(person);
  // response.send(`That is my favorite game too! ${favGame}`);
});

// https://class-09-person-api.rmccrear.repl.co/favorite-game?searchQuery=
app.get('/favorite-game', (request, response) => {
  let favGame = request.query.searchQuery;
  console.log(favGame);

  let person = data.find(p => p.favGame === favGame);
  response.send(person);
  // response.send(`That is my favorite game too! ${favGame}`);
});

// https://class-09-person-api.rmccrear.repl.co/favorite-book?searchQuery=
app.get('/favorite-book', (request, response) => {
  let favBook = request.query.searchQuery;
  console.log("Fav book:", favBook);
  let person = data.find((p) => p.favBook === favBook);
  response.send(person)
  // response.send(`That is my favorite book too! ${favBook}`);
});


app.use((error, request, response, next) => {
  response.status(500).send({
    "error": error.message
  });
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})