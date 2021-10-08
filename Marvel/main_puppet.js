const puppet = require('puppeteer');

const browser = puppet.launch({headless : false});

let page;

browser.then(function(browser){
    const pagePromise = browser.pages();
    return pagePromise;
}).then(function(browserPages){
    page = browserPages[0];
    const gotoPage = page.goto('https://www.marvel.com/characters');
    return gotoPromise;
}).then(function(){
    let waitForElement = page.waitForElement(".content-grid.content-grid__6");
    return waitForElement;
})