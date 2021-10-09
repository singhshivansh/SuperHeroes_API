const express   = require('express');
const path      = require('path');
const app       = express();
const port      = process.env.PORT || 3000;
const fs        = require('fs');
const mar       = require('./Marvel/All Marvel Movies.json');   // MARVEL JSON file
const dc        = require('./DC/All DC Movies.json');           // DC JSON file
const _         = require('lodash');

let marvel_json;

let marvel_file = path.join(__dirname, 'All Marvel Movies.json');
// const obj = JSON.parse(fs.readFileSync(marvel_file));
fs.readFile(marvel_file, 'utf8', (err, data)=>{
    marvel_json = JSON.parse(data);
})

app.get('/', (req, res)=>{
    res.send('Welcome to this wonderful API! By  : Shivansh <3 ');
})


//get MARVEL movie API
app.get('/get_marvel_movie', (req, res)=>{
    const body = req.query;
    const movie_name    = body.movie_name;
    const actor_name    = body.actor_name;
    let film = mar;
    if (movie_name)
        film = film.filter(e=>{
            if(e.name)
                return e.name.toLowerCase().includes(movie_name.toLowerCase())
        });
    if (actor_name)
        film = film.filter(e=>{
            if(e.stars[0])
                return e.stars[0].toLowerCase().includes(actor_name.toLowerCase())
        });
    res.end(JSON.stringify(film));
})

//get DC movie API
app.get('/get_dc_movie', (req, res)=>{
    const body = req.query;
    const movie_name = body.movie_name;
    const actor_name = body.actor_name;

    let film = dc;
    if(movie_name)
        film = film.filter(e=>{
            if(e.name)
                return e.name.toLowerCase().includes(movie_name.toLowerCase())
        });

    if (actor_name)
        film = film.filter(e=>{
            if(e.stars[0])
                return e.stars[0].toLowerCase().includes(actor_name.toLowerCase())
        });

    res.send(JSON.stringify(film));
})


app.listen(process.env.PORT || 3000, ()=>{
    console.log(`Server Started at ${port}`);
})