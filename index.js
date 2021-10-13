const express   = require('express');
const path      = require('path');
const app       = express();
const port      = process.env.PORT || 3000;
const fs        = require('fs');

const mar       = require('./Marvel/All Marvel Movies.json');               // MARVEL JSON file
const dc        = require('./DC/All DC Movies.json');                       // DC JSON file

const marvel_characters = require('./Marvel/All Marvel Characters.json');   //MARVEL Characters File
const dc_characters     = require('./DC/All DC Characters.json');           //DC Characters File
const _         = require('lodash');
const { re }    = require('semver');


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
                if(e.stars[0])
                    return e.stars[0].toLowerCase().includes(actor_name.toLowerCase())
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
                if(e.stars[0])
                    return e.stars[0].toLowerCase().includes(actor_name.toLowerCase())
            });
        
        if (film.length == 0)
            res.send({"status" : "Sorry, we find nothing for you :("})
        else
            res.send(JSON.stringify(film));
    } catch (error) {
        res.send({"error" : error.message});
    }
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

//get Marvel Character API
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


app.listen(process.env.PORT || 3000, ()=>{
    console.log(`Server Started at ${port}`);
})