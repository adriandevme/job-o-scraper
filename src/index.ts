import {Command, flags} from '@oclif/command'
import axios from 'axios';
//const storage = require('node-persist');
import * as storage from 'node-persist';

import Workana = require('./extractors/Workana');
import { Offer } from './models/Offer';

class JobOScraper extends Command {
  static description = 'describe the command here'

  static flags = {
    // URL mode, 
    url: flags.string({char: 'u', description: 'URL MODE: URL to scrap'}),
    // WORKER mode
    conf: flags.string({char: 'w', description: 'WORKER MODE: Path to the configuration file'}),
  }

  static args = [{name: 'file'}]

  async run() {
    const {args, flags} = this.parse(JobOScraper)

    if (flags.url){
      // Run in URL mode
      this.log('Running in URL mode...', flags.url);
      // Init ddbb
      await storage.init(); //@TODO should init with a proper config
      // Request to the server
      const response = await axios.get(flags.url as string);      
      let workana = new Workana.Workana({});
      const offers = await workana.parseHTML(response.data as any);      
      // Save results
      let e=0;
      for (const offer of offers){
        let o = await offer.upsert();
        if (o)
          e++; //@TODO waat
      }
      //const found = await Offer.upsertAll(offers);      
      this.log(`Success! ${e} new offer(s) found from Workana site`);
    }
    else if (flags.conf){
      // Run in WORKER mode
      this.log('Running in WORKER mode...')
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
}

export = JobOScraper