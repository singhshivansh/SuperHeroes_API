const cheerio = require('cheerio');
const request = require('request');

let url = 'https://marvel.fandom.com/wiki/Category:Characters?from=A';

request(url, main);

function main(error, response, html){
    if(error){
        console.log(error);
        return;
    }

    const $ = cheerio.load(html);
}