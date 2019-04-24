/**
 * Requires
 */
const fs = require('fs');
const request = require('request');
const cheerio = require('cheerio');
//const fs = require('fs');
const logger = require('logger');
//const md5 = require('md5');
const Project = require('../models/project');

/**
 * Constructor
 */
var Workana = function(config) {
  // Vars
  this.config = config;
  this.MAIN_URL = 'https://www.workana.com';
  this.company = 'Workana';
  // this.BOOKMAKER_ID = 'williamhill';
}

/**
 * Properties
 */
Workana.prototype = {  

  getProjectsFromURL: function(URL, cb){
    //Vars
    var self = this;    
    var items = [];
    //Retrieve the first one
    if (!URL)
      cb(new Error('No URL defined'));
    else{
      logger.debug('Requesting URL page...', URL);
      request(URL, function (error, response, body) {
        //fs.writeFileSync('workana2.html', body);
        logger.debug('Request OK, data received');
        if (error)
          cb(error)
        else{ 
          var $;          
          try{
            // this.title = data.title;
            // this.description = data.description;
            // this.url = data.url;
            // this.price = data.price;
            // this.priceTo = data.priceTo;
            // this.hourly = data.hourly;

            // Safely tries to parse object
            $ = cheerio.load(body);
            // Pase by league blocks
            //logger.debug('Length', $('#_sport_0_types').children().length);            
            //$('.marketHolderExpanded').each(function(i, element){
            //logger.debug('Enumerating projects: ', $('.project-item').children().length);
            $('.listing').each(function(i, element){
              var item = {};
              item.title = $(this).find('.project-title').text().trim();
              item.description = $(this).find('.project-details').text().trim();
              item.price = $(this).find('.budget').text().trim();
              item.url = self.MAIN_URL + $(this).find('.project-title>a').attr('href'); 
              item.company = 'Workana';
              //console.log(item);
              items.push(new Project(item));
            });
          }
          catch(e){
            error = e;
          }
          if (error)
            cb(error);
          else{
            //Build            
            logger.debug('Elements extracted:', items.length);
            cb(null, items);
          }
        }
      });
    }    
  }

};

/**
 * Exports
 */
module.exports = Workana;


/**
 * Privates
 */
function parsePrice(raw){
  return parseFloat(raw.slice(0,-1).replace(',', ''));
}

function parseProductCrawl(rawProduct){
  //shop
  //brand
  //url
  //product
  //detail
  //color
  //price
  //store_id
}

function cleanupTeamsScores(team){
  team = team.replace(/\n/g, "");
  team = team.replace(/\t/g, "");
  return team.split('(')[0] + team.split(')')[1];
}