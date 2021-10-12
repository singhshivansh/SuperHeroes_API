const request   = require('request');
const cheerio   = require('cheerio');
const fs        = require('fs');
const path      = require('path');
const { table } = require('console');

const base_url  = 'https://comicvine.gamespot.com';
const url       = 'https://comicvine.gamespot.com/profile/theoptimist/lists/top-100-dc-characters/32198/';

request(url, main);

let counter = 0;

//main function
function main(error, response, html){
    const $ = cheerio.load(html);
    const li = $('h2').next().find('li');

    for(let i=0; i<li.length; i++){
        const tab       = $(li[i]);
        const name      = tab.text().trim().split('.').splice(1,5).join('');
        const link      = $(tab.find('a')[0]).attr('href');
        const img_link  = tab.find('img').attr('src')

        request(base_url + link, extract);
    }
}


//extracting deatils from each character
function extract(error, response, html){
    const $ = cheerio.load(html);
    const img = $('header').find('img');
    const table = $('table tr');
    const name = $('.instapaper_title.entry-title').text().trim();

    const char = {
        'Name' : name,
        'Image'  : $(img).attr('src'),
    }
    for(let i=0; i<table.length; i++){
        // console.log($(table[i]).find('th').text());
        const key = $(table[i]).find('th').text().trim();

        if(key == 'Super Name' || key =='Real Name' || key == 'Publisher' || key == 'Gender' 
            || key == 'Character Type' || key == 'Birthday' || key =='Died'){
            char[key] = $(table[i]).find('td').text().trim().split('\n')[0]
        }else if(key == 'Aliases'){
            char[key] = $($(table[i]).find('td').find('.aliases')[0]).text().replace(/\n/g, ', ')
        }else if(key == "Creators"){
            char[key] = $(table[i]).find('td').find('div[data-field="people"]').text().trim().replace(/^\s+|\s+$/gm,'').replace(/\n/g, ', ')
        }else if(key == 'Powers'){
            char[key] = $(table[i]).find('td').find('div[data-field="powers"]').text().trim().replace(/^\s+|\s+$/gm,'').replace(/\n/g, ', ')
        }else{
            char[$(table[i]).find('th').text().trim()] = $(table[i]).find('td').text().trim().replace(/\\n/g, '');
        }
    }

    // console.log(char);
    make_JSON(char);
    // console.log($('.instapaper_title.entry-title').text().trim() , o);
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
    counter++;
    console.log(`Done ${counter}`);
}
