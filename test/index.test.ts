import * as fs from 'fs'; 
import * as path from "path";
import {expect, test} from '@oclif/test'
import * as nock from 'nock';
import cmd = require('../src')


const scope = nock('https://www.stackoverflow.com')
  .get('/jobs?l=Spain')
  .reply(200, fs.readFileSync(
    path.join(__dirname, "./mocks/stackoverflow.mock.html")
  ));

describe('job-o-scraper', () => {
  test    
    .stdout()
    .do(() => cmd.run([]))
    .it('runs with no params', ctx => {      
      expect(ctx.stdout).to.contain("Error, no config url provided");
    })
  
  test    
    .stdout()
    .do(() => cmd.run([path.join(__dirname,"../test/config/single_url.config.json")]))
    .it('extract a single url', ctx => {      
      expect(ctx.stdout).to.contain('Reading conf file..');
      expect(ctx.stdout).to.contain('Requesting url https://www.stackoverflow.com/jobs?l=Spain');
      expect(ctx.stdout).to.contain('new offer(s) found and saved');
      expect(ctx.stdout).to.contain('offers found in total');      
    })

    test    
    .stdout()
    .do(() => cmd.run([path.join(__dirname,"../test/config/unexisting_url.config.json")]))    
    .it('tries to extract unexisting url', ctx => {      
      expect(ctx.stdout).to.contain('Reading conf file..');
      expect(ctx.stdout).to.contain('Requesting url https://www.thisisafakeurl.com');
      //expect(ctx.errorstdout?).to.contain('Error, url not found');
      expect(ctx.stdout).to.contain('0 offers found in total');      
    })    
  })
