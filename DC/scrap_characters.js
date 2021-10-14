const request   = require('request');
const cheerio   = require('cheerio');
const fs        = require('fs');
const path      = require('path');
const { table } = require('console');

const base_url  = 'https://comicvine.gamespot.com';
const url       = 'https://comicvine.gamespot.com/profile/theoptimist/lists/top-100-dc-characters/32198/';


//LINKS
const links = [
    'https://comicvine.gamespot.com/profile/theoptimist/lists/top-100-dc-characters/32198/',
    'https://comicvine.gamespot.com/profile/brook78dc/lists/list-of-dc-characters-part-1/84843/',
    'https://comicvine.gamespot.com/profile/brook78dc/lists/list-of-dc-characters-part-2/84855/',
    'https://comicvine.gamespot.com/profile/brook78dc/lists/list-of-characters-part-3/84862/',
    'https://comicvine.gamespot.com/profile/brook78dc/lists/list-of-dc-characters-part-4/84878/',
    'https://comicvine.gamespot.com/profile/brook78dc/lists/list-of-dc-characters-part-5/84896/',
//     'https://comicvine.gamespot.com/profile/brook78dc/lists/list-of-dc-characters-part-6/84959/',
//     'https://comicvine.gamespot.com/profile/brook78dc/lists/list-of-dc-characters-part-7/84980/',
//     'https://comicvine.gamespot.com/profile/brook78dc/lists/list-of-dc-characters-part-8/84984/',
//     'https://comicvine.gamespot.com/profile/brook78dc/lists/list-of-dc-characters-part-9/84989/',
//     'https://comicvine.gamespot.com/profile/brook78dc/lists/list-of-dc-characters-part-10/84992/',
//     'https://comicvine.gamespot.com/profile/brook78dc/lists/list-of-dc-characters-part-11/85004/',
//     'https://comicvine.gamespot.com/profile/brook78dc/lists/list-of-dc-characters-part-12/85089/',
//     'https://comicvine.gamespot.com/profile/brook78dc/lists/list-of-dc-characters-part-13/85234/',
//     'https://comicvine.gamespot.com/profile/brook78dc/lists/list-of-dc-characters-part-14/85240/',
//     'https://comicvine.gamespot.com/profile/brook78dc/lists/list-of-dc-characters-part-15/85247/',
//     'https://comicvine.gamespot.com/profile/brook78dc/lists/list-of-dc-characters-part-16/85311/',
//     'https://comicvine.gamespot.com/profile/brook78dc/lists/list-of-dc-characters-part-16/85390/',
//     'https://comicvine.gamespot.com/profile/brook78dc/lists/list-of-dc-characters-part-16/85430/',
//     'https://comicvine.gamespot.com/profile/brook78dc/lists/list-of-dc-characters-part-17/85435/',
//     'https://comicvine.gamespot.com/profile/brook78dc/lists/list-of-dc-characters-part-18/85444/',
//     'https://comicvine.gamespot.com/profile/brook78dc/lists/list-of-dc-characters-part-19/85456/',
//     'https://comicvine.gamespot.com/profile/brook78dc/lists/list-of-dc-characters-part-20/85472/',
//     'https://comicvine.gamespot.com/profile/brook78dc/lists/list-of-dc-characters-part-21/85743/'
]


for(let i=0; i<links.length; i++){
    request(links[i], main);
}



let counter = 0;

//main function
function main(error, response, html){
    if(!html)
        return
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
    if(!html)
        return
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
    make_JSON(char, name);
    // console.log($('.instapaper_title.entry-title').text().trim() , o);
}



function make_JSON(movie_json, name){
    if(name.length == 0)
        return;
    const filePath = path.join(__dirname, "All DC Characters.json");

    if(fs.existsSync(filePath)){
        const fileData = fs.readFileSync(filePath);
        let jsonData = JSON.parse(fileData);

        if (jsonData.filter(e=>e.Name === name).length > 0){
            console.log(jsonData.filter(e=>e.Name === name));
            return
        }
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
    console.log(`Done ${counter} ${name}`);
}

