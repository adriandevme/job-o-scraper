// Imports
import {expect, test} from '@oclif/test'
import cmd = require('../src')
import * as fs from 'fs'; 
import * as path from 'path';
import axios from 'axios';

import Workana = require('../src/extractors/Workana');
import Stacko = require('../src/extractors/Stackoverflow');
import Tecnoempleo = require('../src/extractors/Tecnoempleo');
import { Offer } from '../src/models/Offer';

// Vars

describe.only('job-o-scraper.extractors', () => {
  
  test
    .it('should crawl all items from Workana website', async ctx => {
      // Load HTML
      // const url = 'https://www.workana.com/jobs?ref=home_top_bar&page=1';
      // let stacko_response = await axios.get(url as string); 
      // fs.writeFileSync(path.join(__dirname, './mocks/workana.mock.html'), stacko_response.data);
      // fs.writeFileSync(path.join(__dirname, './mocks/workana_result.mock.json'), JSON.stringify(result));

      let mock_html = fs.readFileSync(path.join(__dirname, './mocks/workana.mock.html'));
      let mock_result_json = JSON.parse(fs.readFileSync(path.join(__dirname, './mocks/workana_result.mock.json'), "utf8"));
      let mock_result: Offer[] = [];
      for (var mr of mock_result_json){ mock_result.push(mr)};

      let workana = new Workana.default({});      
      let result = workana.parseHTML(mock_html);     
      
      expect(result[0]).to.equal(mock_result[0]);
    });

  // test
  // .it('should crawl all items from StackOverflow website', async ctx => {
  //   // Load HTML
  //   const url = 'https://stackoverflow.com/jobs';
  //   //let stacko_response = await axios.get(url as string); 
  //   //fs.writeFileSync(path.join(__dirname, './mocks/stackoverflow.mock.html'), stacko_response.data);
  //   let stacko_response = { data: fs.readFileSync(path.join(__dirname, './mocks/stackoverflow.mock.html'))};
  //   let stacko = new Stacko.default({});      
  //   let result = stacko.parseHTML(stacko_response.data);    

  //   expect(result.length).to.be.equal(10);
  // })

  // test
  // .it('Test the Tecnoempleo extractor', async ctx => {
  //   // Load HTML
  //   //const url = 'https://www.tecnoempleo.com/busqueda-empleo.php';
  //   //let tecnoempleo_response = await axios.get(url as string); 
  //   //fs.writeFileSync(path.join(__dirname, './mocks/tecnoempleo.mock.html'), tecnoempleo_response.data);
  //   let tecnoempleo_response = { data: fs.readFileSync(path.join(__dirname, './mocks/tecnoempleo.mock.html'))};
  //   let tecnoempleo = new Tecnoempleo.default({});      
  //   let result = tecnoempleo.parseHTML(tecnoempleo_response.data);    

  //   expect(result.length).to.be.equal(10);
  // })

  // test
  //   .it('Offer model should be well formed', ctx => {
  //     //Create model
  //     //Check properties
  //   })

  // test
  // .it('should have a default class', ctx => {
  //   //Create model
  //   //Check properties
  // })
    
  // test
  //   .it('An extractor should use the proper interface', ctx => {
  //     expect(typeof Workana).to.equal('Extractor');
  //   })
})
