/**
 * Requires
 */
import * as fs from 'fs';
import axios from 'axios';
import * as cheerio from 'cheerio';
import * as storage from 'node-persist';
import { Offer } from '../models/Offer';

export default class Stackoverflow { // @TODO create an interface
  // Vars
  private config: any;
  private MAIN_URL: string;
  private company: string;

  static parser_ref: string = 'stackoverflow';
  
  // Constructor
  constructor(config: any) {
    //Parse values
    this.config = config;
    this.MAIN_URL = 'https://www.stackoverflow.com';
    this.company = 'Stackoverflow';
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

      $('.-job-summary').each((i, element)=>{        
        let item:any = {}        
        item.title = $(element).find('.-title>h2').text().trim();
        //item.description = $(element).find('.project-details').text().trim();
        let salary = this.parseSalary($(element).find('.-salary').text().trim())
        item.salary_min = salary.min;
        item.salary_max = salary.max;
        item.salary_currency = salary.currency;
        item.description = $(element).find('.-salary').text().trim(); 
        item.url = self.MAIN_URL + $(element).find('.job-details__spaced>a').attr('href'); 
        item.company = $(element).find('.-company>span:first-child').text().trim();
        item.location = $(element).find('.-company>span:nth-child(2)').text().trim().substring(3);
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

  private parseSalary(salary_raw:string){
    let salary:any = {
      currency: null,
      min: null,
      max: null
    }
    try{
      if (salary_raw){
        salary.currency = salary_raw[0];
        salary.min = salary_raw.substring(1).split('-')[0].trim().slice(0,-1);
        salary.max = salary_raw.substring(1).split('-')[1].trim().slice(0,-1); 
      }
      salary.min = Number(salary.min)*1000;
      salary.max = Number(salary.max)*1000;
    }
    catch(e){
      console.log('Error', e);
    }
    return salary;
  }
} 