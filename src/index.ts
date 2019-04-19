import {Command, flags} from '@oclif/command'
import axios from 'axios';
import * as fs from 'fs'; 
import Workana = require('./extractors/Workana');

class JobOScraper extends Command {
  static description = 'describe the command here'

  static flags = {
    // // add --version flag to show CLI version
    // version: flags.version({char: 'v'}),
    // help: flags.help({char: 'h'}),
    // // flag with a value (-n, --name=VALUE)
    // name: flags.string({char: 'n', description: 'name to print'}),
    // // flag with no value (-f, --force)
    // force: flags.boolean({char: 'f'}),
    // URL mode, 
    url: flags.string({char: 'u', description: 'URL MODE: URL to scrap'}),
    // WORKER mode
    conf: flags.string({char: 'w', description: 'WORKER MODE: Path to the configuration file'}),
  }

  static args = [{name: 'file'}]

  async run() {
    const {args, flags} = this.parse(JobOScraper)

    // let URL = 'https://www.workana.com/jobs?ref=home_top_bar';
    // const response = await axios.get(URL);
    // const filename = 'workana.mock.html';
    // console.log(response);
    // fs.writeFileSync(__dirname + '/' + filename, response.data);

    // const response = await axios.get(flags.url as string);
    // let workana = new Workana.Workana({});
    // const parsed = await workana.parseHTML(response.data as any);
    // this.log(`Success! found ${parsed.length} from Workana site`);

    if (flags.url){
      // Run in URL mode
      this.log('Running in URL mode...', flags.url);
      // Request to the server
      const response = await axios.get(flags.url as string);      
      let workana = new Workana.Workana({});
      const parsed = await workana.parseHTML(response.data as any);
      this.log(`Success! found ${parsed.length} from Workana site`);
    }
    else if (flags.conf){
      // Run in WORKER mode
      this.log('Running in WORKER mode...')
    }
    else{
      this.log('No param set, running in URL mode...');
    }     

    // const name = flags.name || 'world'
    // this.log(`hello ${name} from .\\src\\commands\\hello.ts`)
    // if (args.file && flags.force) {
    //   this.log(`you input --force and --file: ${args.file}`)
    // }
  }
}

export = JobOScraper