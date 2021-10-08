const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

const url = 'https://www.imdb.com/list/ls021778931/';
// const base_url = 'https://www.imdb.com/';

main1(url, "Marvel");

function main1(url, name){
    request(url, main, name);
}

function main(error, response, html){
    if(error)
        console.log(error);
    
    // console.log(response);
    const $ = cheerio.load(html);

    const movie_list = $('.lister-list').find('.lister-item-content');

    // console.log(movie_list.length);
    // make_folder();
    for(let i=0; i<movie_list.length; i++){
        get_movie_details(movie_list[i]);
    }
}


function get_movie_details(movie_element){
    // console.log("pp");
    const $             = cheerio.load(movie_element);
    const movie_name    = $('.lister-item-header').find('a').text();
    let movie_url       =  $('.lister-item-header').find('a').attr('href');
    const year1         = $('.lister-item-year.text-muted.unbold').text().split(' ');
    let year          = year1[year1.length-1];
    year                = year.slice(1,5);
    let rating          = $('.ipl-rating-widget .ipl-rating-star__rating').text().slice(0,4);
    if (rating.slice(2,4) == 'Ra')
        rating = rating[0] + '.00';
    const directors_and_stars = $($('.text-muted.text-small')[1]).text().split('|');
    let director = directors_and_stars[0].trim().split(':');
    
    let stars = directors_and_stars[1].trim().split(":");
  
    stars = stars.splice(1);
    director  = director.splice(1);
    
    const movie_json = {
        "name" : movie_name,
        "year" : year,
        "rating" : rating,
        director : director,
        stars : stars
    }
    make_JSON(movie_json);
    console.log(movie_name);
    // console.log(movie_json);
}

function make_JSON(movie_json){
    const filePath = path.join(__dirname, name);

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


// console.log(movies);
