const cheerio = require('cheerio');
const request = require('request');

const url = "https://www.marvel.com/characters";

request(url, main);

function main(error, response, html){
    if(error){
        console.log(error);
        return;
    }

    const $ = cheerio.load(html);
    // const main_tab = $('.mvl-card.mvl-card--explore');
    const main_tab = $('.main-footer');
    console.log(main_tab.length);
    // for(let i=0; i<main_tab.length; i++){
    //     const link = $(main_tab[i]).find('a').attr('href');
    //     console.log(link);
    // }
}