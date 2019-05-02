import {Command, flags} from '@oclif/command'
import axios from 'axios';
import * as storage from 'node-persist';
import * as fs from 'fs'; 
import * as path from 'path';

import Workana from './extractors/Workana';
import { Offer } from './models/Offer';

class JobOScraper extends Command {
  static description = 'describe the command here'

  static flags = {
    // URL, 
    url: flags.string({char: 'u', description: 'URL: URL to scrap'}),    
    // CONFIG,
    conf: flags.string({char: 'c', description: 'CONFIGURATION FILE: Filepath to the configuration file '}),
  }

  static args = [{name: 'file'}]

  async run() {
    const {args, flags} = this.parse(JobOScraper)
    const self = this;

    // Init ddbb
    await storage.init(); //@TODO should init with a proper config

    if (flags.url){
      // Run in URL mode
      this.log('Reading single URL...', flags.url);
      // Get offers
      const offers = await this.processURL(flags.url)
      // Save results
      const saved = await this.saveOffers(offers);
    }
    else if (flags.conf){
      // Run from conf file
      const config = this.parseConf(path.join(__dirname, flags.conf));
      this.log('Starting in endless mode...');
      // If endless mode is enabled (default false)
      if (config.endless){
        // Set the timer
        setInterval(async function () { 
          //Iterate 
          for (const url of config.urls){ //@TODO refactor, now assuming every url is from workana site
            // Get offers
            const offers = await self.processURL(url)
            // Save results
            const saved = await self.saveOffers(offers);
          }
        }, config.delay); //Using delay from config
      }
    }
    else{
      this.log('No param set, running in URL mode...');
      //run --url="https://www.workana.com/jobs?ref=home_top_bar"
      //run --conf="../bin/default.json"
    }     
  }

  private async processURL(url:string){
    // Init array
    let offers:Array<Offer>=[];
    // Request to the server
    this.log('Requesting url ' + url);
    const response = await axios.get(url as string);      
    // Select parser
    try{
      let parser_name:string = url.split('.')[1];
      const ParserImport = await import('./extractors/'+parser_name);
      let parser = new ParserImport.default({});
      // Parse offers
      offers = await parser.parseHTML(response.data as any);      
    }
    catch(e){
      this.log('Parser undefined for url', e);
    }
    // Return
    return offers;
  }

  private async saveOffers(offers:Array<Offer>){
    let upserted:Array<Offer>=[];  
    for (const offer of offers){
      let o = await offer.upsert();
      if (o)
        upserted.push(o);
    }
    // Log
    this.log(`Success! ${upserted.length} new offer(s) found and saved`);
    return upserted;
  }

  private parseConf(conf_url: any){
    //@TODO parse
    return JSON.parse(fs.readFileSync(conf_url, 'utf8'));;
  }
}

export = JobOScraper