// Imports
import {expect, test} from '@oclif/test'
import cmd = require('../src')
import * as fs from 'fs'; 
import * as path from 'path';

import Workana = require('../src/extractors/Workana');
console.log('CMD', );

// Vars

describe.only('job-o-scraper.extractors', () => {
  
  test
    .it('Test the Workana extractor', ctx => {
      // Load HTML
      let workana_mock = fs.readFileSync(path.join(__dirname, './mocks/workana.mock.html'));
      let workana = new Workana.Workana({});      
      let result = workana.parseHTML(workana_mock);            
      expect(result.length).to.be.equal(10);
    });

  test    
    .it('An extractor should use the proper interface', ctx => {
      expect(typeof Workana).to.equal('Extractor');
    })

  test
    .stdout()
    .do(() => cmd.run(['--url', 'https://www.tecnoempleo.com/busqueda-empleo.php?te=javascript&cp=,29,&pr=,234,#buscador-ofertas-ini']))
    .it('performs a manual search', ctx => {
      expect(ctx.stdout).to.contain('todo mock data');
    })
})
