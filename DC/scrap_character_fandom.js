const cheerio = require('cheerio');
const request = require('request');
const path = require('path');
const fs = require('fs');

let url = 'https://superheroes.fandom.com/wiki/List_of_DC_Comics_Characters';
let base_url = 'https://superheroes.fandom.com';

request(url, main);

const characters = [];
let char_json = require('./All DC Characters.json');


function main(error, response, html){
    if(error){
        console.log(error);
        return;
    }

    const $ = cheerio.load(html);

    let h2 = $('h2');

    h2 = h2.slice(1, 27);
    let total = 0, have = 0;

    console.log(h2.length);

    for(let i=0; i<h2.length; i++){
        // console.log($(h2[i]).text() , $(h2[i]).next().find('li'));
        const li = $(h2[i]).next().find('li');
        for(let j=0; j<li.length; j++){
            const i_text = $(li[j]).find('i').find('a');
            total++;

            // making character JSON
            // console.log(i_text.text());


            // if (i_text.text().length > 0){
            //     const char = {
            //         'name'              : i_text.text().trim(),
            //         'real_name'         : '' ,
            //         'first_appearance'  : '',
            //         'creators'          : '',
            //         'teams'             : '',
            //         'aliases'           : '',
            //         'base_of_operation' : '',
            //         'powers'            : '',
            //         'skills'            : '',
            //         'weapons'           : '',
            //     }
            //     make_JSON(char);
            // }

            if(i_text.length == 1){
                have++;
                // console.log(i_text.text());
                
                request(base_url + i_text.attr('href'), extract);
                // console.log(i_text.attr('href'));
            }
        }
    }
    console.log(total, have);
}



function extract(error, response, html){
    if(error){
        console.log(error);
        return;
    }

    const $ = cheerio.load(html);

    const table = $('table tbody tr');

    for(let i=0; i<table.length; i++){
        // console.log($($(table[i]).find('td')[0]).text(), "|",  $($(table[i]).find('td')[1]).text());
    }

    const char_name = $(table).first().text().trim();
    if(char_name)
        console.log(char_name , char_json.filter(e=>e.name.includes(char_name)).length);
    // console.log(char_name.split(' '));
    // console.log(characters);

}


function make_JSON(movie_json){
    const filePath = path.join(__dirname, "All DC Characters.json");

    if(fs.existsSync(filePath)){
        const fileData = fs.readFileSync(filePath);
        let jsonData = JSON.parse(fileData);
        jsonData.push(movie_json);
        const strngifyData = JSON.stringify(jsonData);

        fs.writeFileSync(filePath, strngifyData);
    }else{
        let arr = [];
        arr.push(movie_json);
        const stringifyData = JSON.stringify(arr);

        fs.writeFileSync(filePath, stringifyData);
    }
}
