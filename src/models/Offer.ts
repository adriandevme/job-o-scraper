/**
 * Requires
 */
import * as fs from 'fs';
import axios from 'axios';
import * as cheerio from 'cheerio';
import * as storage from 'node-persist';

export class Offer { 
  // Vars
  readonly title: string;
  readonly description: string;
  readonly price: number;
  readonly url: string;
  readonly company: string;
  readonly location: string;
  readonly salary_min: number;
  readonly salary_max: number;
  readonly salary_currency: string;

  readonly id: string; //@WATCHOUT 

  static parser_ref: string = 'workana';
  
  // Constructor
  constructor(data: any) {
      if (!data.id)
        throw new Error('Error, ID cannot be undefined');
    this.id = data.id;

    this.title = data.title;
    this.description = data.description;
    this.price = Number(data.price); //@TODO cast the value
    this.url = data.url;
    this.company = data.company;
    this.location = data.location;
    this.salary_max = data.salary_max;
    this.salary_min = data.salary_min;
    this.salary_currency = data.salary_currency;
  }


  public async upsert(){
      const self = this;
      //Find the item
      let found = await storage.getItem(self.id);
  
      if (!found){
        await self.save();
        return self;
      }
      else
        return null;
  }

  //Default search are performed by id
  public static async findOne(id:string){
      return storage.getItem(id);
  }

  //Functions
  public static async list(){
    return storage.values()
  }

  public async save(){
      let saved;
      try{
        await storage.setItem(this.id, this);
        saved = this;
      }
      catch(e){
          console.log(e);
      }
      return saved;
  }
}