/**
 * Requires
 */
import * as fs from 'fs';
import axios from 'axios';
import * as cheerio from 'cheerio';
import * as storage from 'node-persist';
import { Offer } from '../models/Offer';

export default class Workana { // @TODO create an interface
  // Vars
  private config: any;
  private MAIN_URL: string;
  private company: string;
  
  static extractor_ref: string = 'workana';
  static extractor_logo: string = 'https://www.workana.com/blog/wp-content/uploads/2018/10/Logo-Workana.png'
  
  // Constructor
  constructor(config: any) {
    //Parse values
    this.config = config;
    this.MAIN_URL = 'https://www.workana.com';
    this.company = 'Workana';
  }

  //Functions
  public async getProjectsFromURL (URL: string){
    // Vars
    var self = this;
    var items: Array<any>;
    //Retrieve the first one
    if (!URL)
      throw(new Error('No URL defined'));
    else{
      //logger.debug('Requesting URL page...', URL);
      //let response = await request(URL);
      //console.log(response);

      // request(URL, function (error, response, body) {
      //   //fs.writeFileSync('workana2.html', body);
      //   logger.debug('Request OK, data received');
      //   if (error)
      //     cb(error)
      //   else{ 
      //     var $;          
      //     try{
      //       // this.title = data.title;
      //       // this.description = data.description;
      //       // this.url = data.url;
      //       // this.price = data.price;
      //       // this.priceTo = data.priceTo;
      //       // this.hourly = data.hourly;

      //       // Safely tries to parse object
      //       $ = cheerio.load(body);
      //       // Pase by league blocks
      //       //logger.debug('Length', $('#_sport_0_types').children().length);            
      //       //$('.marketHolderExpanded').each(function(i, element){
      //       //logger.debug('Enumerating projects: ', $('.project-item').children().length);
      //       $('.listing').each(function(i, element){
      //         var item = {};
      //         item.title = $(this).find('.project-title').text().trim();
      //         item.description = $(this).find('.project-details').text().trim();
      //         item.price = $(this).find('.budget').text().trim();
      //         item.url = self.MAIN_URL + $(this).find('.project-title>a').attr('href'); 
      //         item.company = 'Workana';
      //         //console.log(item);
      //         items.push(new Project(item));
      //       });
      //     }
      //     catch(e){
      //       error = e;
      //     }
      //     if (error)
      //       cb(error);
      //     else{
      //       //Build            
      //       logger.debug('Elements extracted:', items.length);
      //       cb(null, items);
      //     }
      //   }
      // });
    }    
  }
  
  // Parses an HTML body string to a nice array of projecs found
  public parseHTML(body: Buffer) { //not sure if its a string
    
    let items:Array<Offer>=[];
    let self = this;
    
    try{
      // Safely tries to parse object
      let $ = cheerio.load(body);

      $('.project-item').each((i, element)=>{        
        let item:any = {}        
        item.extractor = Workana.extractor_ref;
        item.extractor_logo = Workana.extractor_logo;
        item.title = $(element).find('.project-title').text().trim();
        item.description = $(element).find('.project-details').text().trim();
        item.salary_min = $(element).find('.budget').text().trim();
        item.salary_max = $(element).find('.budget').text().trim();
        item.currency = '€';
        item.url = self.MAIN_URL + $(element).find('.project-title>a').attr('href'); 
        item.company = self.company;
        item.id = item.company+'>>'+item.title;
        const offer = new Offer(item);
        items.push(offer); 
      });
    }
    catch(e){
      console.log(e);
    }

    return items;
  }

}