import {Command, flags} from '@oclif/command'
import axios from 'axios';
//const storage = require('node-persist');
import * as storage from 'node-persist';

import Workana = require('./extractors/Workana');
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

    // Init ddbb
    await storage.init(); //@TODO should init with a proper config

    if (flags.url){
      // Run in URL mode
      this.log('Reading single URL...', flags.url);
      // Get offers
      const offers = await this.processURL(flags.url)
      // Save results
      const saved = await this.saveOffers(offers);
      // Log
      this.log(`Success! ${offers.length} new offer(s) found from Workana site`);
    }
    else if (flags.conf){
      // Check if
      const config = this.parseConf(flags.conf);
      // If endless mode is enabled (default false)
      if (config.endless){
        // Set the timer
        setTimeout(function () { 
          //Iterate 
          for (const url of config.urls){ //@TODO refactor, now assuming every url is from workana site
            
          }
        }, config.delay); //Using delay from config
      }
    }
    else{
      this.log('No param set, running in URL mode...');
      //run --url=https://www.workana.com/jobs?ref=home_top_bar
    }     

    // const name = flags.name || 'world'
    // this.log(`hello ${name} from .\\src\\commands\\hello.ts`)
    // if (args.file && flags.force) {
    //   this.log(`you input --force and --file: ${args.file}`)
    // }
  }

  private async processURL(url:string){
    // Init array
    let offers:Array<Offer>=[];
    // Request to the server
    const response = await axios.get(url as string);      
    let workana = new Workana.Workana({});
    offers = await workana.parseHTML(response.data as any);      
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
    return upserted;
  }

  private parseConf(raw_config: any){
    //@TODO parse
    return raw_config;
  }
}

export = JobOScraper