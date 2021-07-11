const cheerio = require('cheerio');
const request = require('request');

const url = 'https://www.dccomics.com/characters';

request(url, main);

function main(error, response, html){
    if(error){
        console.log(error);
        return;
    }
    const $ = cheerio.load(html);
    // const main_tab = $('.whos-who-thumb');

    const main_tab = $('.browse-results');

    console.log(main_tab.length);
    

    // // console.log(main_tab.length);
    // for(let i = 0; i<main_tab.length; i++){
    //     console.log($(main_tab[i]).find('a').attr('href'));
    // }
}