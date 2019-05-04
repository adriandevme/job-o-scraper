/**
 * Requires
 */
import * as fs from 'fs';
import axios from 'axios';
import * as cheerio from 'cheerio';
import * as storage from 'node-persist';
import { Offer } from '../models/Offer';

export default class Tecnoempleo { // @TODO create an interface
  // Vars
  private config: any;
  private MAIN_URL: string;
  private company: string;

  static parser_ref: string = 'tecnoempleo';
  
  // Constructor
  constructor(config: any) {
    //Parse values
    this.config = config;
    this.MAIN_URL = 'https://www.tecnoempleo.com';
    this.company = 'Tecnoempleo';
  }
  
  // Parses an HTML body string to a nice array of projecs found
  public parseHTML(body: Buffer) { //not sure if its a string
    
    let items:Array<Offer>=[];
    let self = this;
    
    try{
      // Safely tries to parse object
      let $ = cheerio.load(body);

      $('article').each((i, element)=>{        
        let item:any = {}        
        item.title = $(element).find('h3>a').text().trim();
        item.description = $(element).find('.d-none.d-md-block.g-mb-5.g-mt-5.g-font-size-13.g-pr-120').text().trim();
        let salary = self.parseSalary($(element).find('.d-none.d-md-inline.g-mt-0.g-color-gray-dark-v5').html());
        item.salary_min = salary.min;
        item.salary_max = salary.max;
        item.salary_currency = salary.currency;
        item.url = $(element).find('h3>a').attr('href'); 
        item.company = $(element).find('h4>a').text().trim();
        item.location = $(element).find('.list-inline.g-mb-5>li:nth-child(2)').text().trim();
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

  private parseSalary(salary_raw:string | null){
    let salary:any = {
      currency: null,
      min: null,
      max: null
    }
    try{
      if (salary_raw){
        salary_raw = salary_raw.split('fal fa-wallet g-pos-rel g-top-1 g-ml-5')[1];
        salary_raw = salary_raw.split('|')[0];
        salary_raw = salary_raw.substring(12);
        salary.min = salary_raw.split('&#xFFFD')[0].trim();
        salary.max = salary_raw.split('&#xFFFD')[1].substring(3).trim();
      }
      salary.min = Number(salary.min)*1000;
      salary.max = Number(salary.max)*1000;
      salary.currency = '€';
    }
    catch(e){
      //console.log('Error', e);
    }
    return salary;
  }
} 