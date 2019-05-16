// Imports
import {expect, test} from '@oclif/test'
import cmd = require('../src')
import * as fs from 'fs'; 
import * as path from 'path';
import * as storage from 'node-persist';

import Mailer = require('../src/reporters/mailer/Mailer');
import { Offer } from '../src/models/Offer';

describe.only('job-o-scraper.reporters.mailer', () => {
  
  test
    .it('Build MJML from an offer list', ctx => {
      //Offers
      let offers:Array<Offer>=[];
      let offer1 = new Offer({
        title: 'NodeJS Engineer',
        company: 'Sample Company Inc.',
        url: 'www.testurl.com/testurl/job/1',
        salary_min: 25000,
        salary_max: 30000,
        salary_currency: '€',
        location: 'Barcelona'
      })
      let offer2 = new Offer({
        title: 'AngularJS Developer',
        company: 'Facebook Inc.',
        url: 'www.testurl.com/testurl/job/1',
        salary_min: 45000,
        salary_max: 50000,
        salary_currency: '€',
        location: 'Alemania'
      });
      let offer3 = new Offer({
        title: 'Fullstack programmer',
        company: 'Amazon Inc.',
        url: 'www.testurl.com/testurl/job/1',
        salary_min: 15000,
        salary_max: 20000,
        salary_currency: 'D',
        location: 'Japan'
      });
      offers.push(offer1,offer2,offer3);

      // Parse
      let mailer = new Mailer.Mailer({});
      let template = mailer.buildMJML({offers: offers}).toString();
      //fs.writeFileSync(path.join(__dirname, './tmp/build.mjml'), template);
      
      //Expect
      expect(template).to.contain(offer1.title);
      expect(template).to.contain(offer2.title);
      expect(template).to.contain(offer3.title);  
    });

  test
  .it('Compiles MJML to HTML', ctx=>{
      //Offers
      let offers:Array<Offer>=[];
      let offer1 = new Offer({
        title: 'NodeJS Engineer',
        company: 'Sample Company Inc.',
        url: 'www.testurl.com/testurl/job/1',
        salary_min: 25000,
        salary_max: 30000,
        salary_currency: '€',
        location: 'Barcelona'
      })
      let offer2 = new Offer({
        title: 'AngularJS Developer',
        company: 'Facebook Inc.',
        url: 'www.testurl.com/testurl/job/1',
        salary_min: 45000,
        salary_max: 50000,
        salary_currency: '€',
        location: 'Alemania'
      });
      let offer3 = new Offer({
        title: 'Fullstack programmer',
        company: 'Amazon Inc.',
        url: 'www.testurl.com/testurl/job/1',
        salary_min: 15000,
        salary_max: 20000,
        salary_currency: 'D',
        location: 'Japan'
      });
      offers.push(offer1,offer2,offer3);

      // Parse
      let mailer = new Mailer.Mailer({});
      let template = mailer.buildMJML({offers: offers}).toString();
      let compiled = mailer.compileMJML(template).html;
      //fs.writeFileSync(path.join(__dirname, './tmp/build.mjml'), template);
      //fs.writeFileSync(path.join(__dirname, './tmp/compiled.html'), compiled);
      
      //Expect
      //@TODO check no errors
      expect(compiled).to.contain("<html xmlns=\"http://www.w3.org/1999/xhtml\"");
      expect(compiled).to.contain(offer1.title);
      expect(compiled).to.contain(offer2.title);
      expect(compiled).to.contain(offer3.title);  
  })
})
