const express   = require('express');
const path      = require('path');
const app       = express();
const port      = process.env.PORT || 5000;
const fs        = require('fs');

const mar       = require('./Marvel/All Marvel Movies.json');               // MARVEL JSON file
const dc        = require('./DC/All DC Movies.json');                       // DC JSON file

const marvel_characters = require('./Marvel/All Marvel Characters.json');   //MARVEL Characters File
const dc_characters     = require('./DC/All DC Characters.json');           //DC Characters File
const _         = require('lodash');
const { re }    = require('semver');
const cors = require('cors');

app.use(cors());

app.get('/', (req, res)=>{
    res.sendFile(path.join(__dirname+'/index.html'));
})


//get MARVEL movie API
app.get('/get_marvel_movie', (req, res)=>{
    try {
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
                if(e.stars)
                    return e.stars.toLowerCase().includes(actor_name.toLowerCase())
            });
        
        if (film.length == 0)
            res.send({"status" : "Sorry, we find nothing for you :("})
        else
            res.send(JSON.stringify(film));
    } catch (error) {
        res.send({"error" : error.message});
    }
})

//get DC movie API
app.get('/get_dc_movie', (req, res)=>{
    try {
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
                if(e.stars)
                    return e.stars.toLowerCase().includes(actor_name.toLowerCase())
            });
        
       
        
        if (film.length == 0)
            res.send({"status" : "Sorry, we find nothing for you :("})
        else
            res.send(JSON.stringify(film));
    } catch (error) {
        res.send({"error" : error.message});
    }
})

//get random Marvel Movie
app.get('/get_marvel_movie/random', (req, res)=>{
    let films = mar;

    const film = get_random(films);

    res.send(film);
})

//get random DC Movie
app.get('/get_dc_movie/random', (req, res)=>{
    let films = dc;

    let film = get_random(films);
    while(film.year === 'ideo'){
        film = get_random(films);
    }

    res.send(film);
})

//get Marvel Character API
app.get('/get_marvel_character', (req, res)=>{
    try {
        const body = req.query;
        const name = body.name;
        const name_contain = body.name_contain;

        let chars = marvel_characters;

        if (name_contain){
            chars = chars.filter(e=>{
                if(e.Name){
                    return e.Name.toLowerCase().includes(name_contain.toLowerCase())
                }
            })
        }

        if (name){
            chars = chars.filter(e=>{
                if(e.Name){
                    return e.Name.toLowerCase() == (name.toLowerCase())
                }
            })
        }
        if (chars.length == 0)
            res.send({"status" : "Sorry, we find nothing for you :("})
        else
            res.send(chars);
    } catch (error) {
        res.send({"error" : error})
    }
})

//get DC Character API
app.get('/get_dc_character', (req, res)=>{
    try {
        const body = req.query;
        const name = body.name;
        const name_contain  = body.name_contain

        let chars = dc_characters;

        if (name_contain){
            chars = chars.filter(e=>{
                if(e.Name){
                    return e.Name.toLowerCase().includes(name_contain.toLowerCase())
                }
            })
        }

        if (name){
            chars = chars.filter(e=>{
                if(e.Name){
                    return e.Name.toLowerCase() == (name.toLowerCase())
                }
            })
        }
        if (chars.length == 0)
            res.send({"status" : "Sorry, we find nothing for you :("})
        else
            res.send(chars);
    } catch (error) {
        res.send({"error" : error})
    }
})

//get random Marvel Character
app.get('/get_marvel_character/random', (req, res)=>{
    let character = marvel_characters;
    character = get_random(character);

    return res.send(character);
})

//get random DC Character
app.get('/get_dc_character/random', (req, res)=>{
    let character = dc_characters;
    character = get_random(character);

    return res.send(character);
})


app.listen(process.env.PORT || 5000, ()=>{
    console.log(`Server Started at ${port}`);
})

// random function
function get_random(list){
    return list[Math.floor((Math.random()*list.length))];
}