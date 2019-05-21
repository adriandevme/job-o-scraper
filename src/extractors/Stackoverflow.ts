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

  static extractor_ref: string = 'stackoverflow';
  static extractor_logo: string = 'https://i.stack.imgur.com/440u9.png'
  
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
        item.extractor = Stackoverflow.extractor_ref;
        item.extractor_logo = Stackoverflow.extractor_logo;
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
        item.publish_date_info = $(element).find('.ps-absolute.pt2.r0.fc-black-500.fs-body1.pr12.t24').text().trim();
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