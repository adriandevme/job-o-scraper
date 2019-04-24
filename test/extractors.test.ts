// Imports
import {expect, test} from '@oclif/test'
import cmd = require('../src')
import * as fs from 'fs'; 
import * as path from 'path';

import Workana = require('../src/extractors/Workana');

// Vars

describe.skip('job-o-scraper.extractors', () => {
  
  test
    .it('Test the Workana extractor', ctx => {
      // Load HTML
      let workana_mock = fs.readFileSync(path.join(__dirname, './mocks/workana.mock.html'));
      let workana = new Workana.Workana({});      
      let result = workana.parseHTML(workana_mock);            
      expect(result.length).to.be.equal(10);
    });

  test
    .it('Offer model should be well formed', ctx => {
      //Create model
      //Check properties
    })

  test
    .it('An extractor should use the proper interface', ctx => {
      expect(typeof Workana).to.equal('Extractor');
    })

  test
    .stdout()
    .do(() => cmd.run(['--url', 'https://www.workana.com/jobs?ref=home_top_bar']))
    .it('Runs in URL mode with Workana parser', ctx => {
      expect(ctx.stdout).to.contain('Workana');
    })
})
