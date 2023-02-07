/*Tools: code editor, browser, command line utility, 
application and server utility, API platform
*/
const bodyParser = require('body-parser');
const express = require('express');
const { isValid } = require('ipaddr.js');
const app = express();
app.use(express.json());
app.use(bodyParser.json());

const songs = [
    { id: 1, name: 'Beethoven Symphony No 5', genre: 'classical', year: '1808', month: 'December' },
    { id: 2, name: 'Sandstorm', genre: 'electronic', year: '2009', month: 'July' }
]

const genres = [
    { name: 'pop' },
    { name: 'hiphop' },
    { name: 'rap' },
    { name: 'classical' },
    { name: 'rock' },
    { name: 'jazz' },
    { name: 'blues' },
    { name: 'electronic' }
];

app.listen(3000, () => {
    console.log('Listening on port 3000 ...')
})

//=========== ROUTES FOR HTTP GET REQUESTS ==========
app.get('/api/home', (req, res) => {
    res.send("Welcome to the music app, created by Elliot Zou.");
})

app.get('/api/genre', (req, res) => {
    res.send(genres);
})

app.get('/api/songs', (req, res) => {
    res.send(songs);
})

app.get('/api/songs/:genre', (req, res) => {
    let foundGenre = false;
    for(genre of genres) {
        if(genre.name == req.params.genre) {
            foundGenre = true;
            break;
        }
    }
    if(!foundGenre) {
        res.status(400).send("Could not find genre with name " + req.params.genre + ".");
        return;
    }
    //all the songs of a certain genre
    res.send(songs.filter(song => song.genre == req.params.genre));
})

app.get('/api/songs/:year/:month', (req, res) => {
    //all the songs of a certain year and month
    res.send(songs.filter(song => song.year == req.params.year && song.month == req.params.month));
})

//=========== ROUTES FOR HTTP POST REQUESTS ==========

app.post('/api/genre', (req, res) => {
    if (req.body.name.length <= 2) {
        res.status(400).send("The name of the genre must be at least 3 characters.");
        return;
    }
    if (req.body.name.length > 30) {
        res.status(400).send("The name of the genre must not exceed 30 characters.");
        return;
    }
    genres.push({name: req.body.name});
    res.status(200).send(genres);
})

app.post('/api/songs', (req, res) => {
    if (req.body.name.length <= 1) {
        res.status(400).send("The name of the song must be at least 2 characters.");
        return;
    }
    if (req.body.name.length > 30) {
        res.status(400).send("The name of the song must not exceed 30 characters.");
        return;
    }
    if(req.body.genre.length <= 2) {
        res.status(400).send("The name of the genre must be at least 3 characters.");
        return;
    }
    if (req.body.genre.length > 100) {
        res.status(400).send("The name of the genre must not exceed 100 characters.");
        return;
    }
    let songName = req.body.name;
    let genre = req.body.genre;

    if(genres.includes(genre) == false) {
        genres.push(genre);
    }

    songs.push({
        id: songs[songs.length - 1].id + 1,
        name: songName,
        genre: genre,
        year: req.body.year,
        month: req.body.month.charAt(0).toUpperCase() + req.body.month.substring(1).toLowerCase()
    })
    res.status(200).send(songs);
})


//=========== ROUTES FOR HTTP PUT REQUESTS ==========

app.put('/api/songs/:id', (req, res) => {
    let song = songs.find(song => song.id === parseInt(req.params.id));
    if(!song) {
        res.status(404).send("The song with the given ID was not found.");
    }

    if(req.body.name.length <= 2) {
        res.status(400).send("The name of the song must be at least 3 characters long.");
        return;
    }

    if(req.body.name != null) {
        song.name = req.body.name;
    }
    if(req.body.genre != null) {
        song.genre = req.body.genre;
    }
    if(req.body.year != null) {
        song.year = req.body.year;
    }
    if(req.body.month != null) {
        song.month = req.body.month;
    }
    res.status(200).send(song);
})


//=========== ROUTES FOR HTTP DELETE REQUESTS ==========

app.delete('/api/songs/:id', (req, res) => {
    let removeID = req.params.id;
    let isValidID = false;
    for(song of songs) {
        if(song.id == req.params.id) {
            isValidID = true;
            break;
        }
    }
    if(!isValidID) {
        res.status(400).send("Please enter a valid id.");
        return;
    }
    let removeIdx = removeID - 1;
    songs.splice(removeIdx, 1);
    res.status(200).send(songs);
})

/*
Reflection - Elliot Zou Sec86

1. There are many ways that different programs can communicate to other programs. APIs are one of the best tools that developers can use to send and receive
information between programs. Through requests like GET and POST, we are able to send and receive information from programs.

2. I learned about managing data in the backend. I also learned more about filtering data, which is extremely important since when you're dealing with
large amounts of data, you need filters to get only what you need. 

3. There are many ways in which this project can be expanded. For one, we could house more information about each song, such as its popularity
and artist, which would allow for users to obtain data sorted by more things like artist and popularity.
*/