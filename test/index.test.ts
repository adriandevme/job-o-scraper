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
      expect(ctx.stdout).to.contain('Error, no params set!');
    })

  test
    .skip()
    .stdout()
    .do(() => cmd.run(['--url', "https://www.stackoverflow.com/jobs?l=Spain"]))
    .it('performs a manual search using URL flag', ctx => {
      //@TODO clear database before
      expect(ctx.stdout).to.contain('Reading single URL... https://www.stackoverflow.com/jobs?l=Spain\nRequesting url https://www.stackoverflow.com/jobs?l=Spain\nSuccess!')// 0 new offer(s) found and saved\n');
    })
  
  test    
    .stdout()
    .do(() => cmd.run(['--conf', "../test/config/single_url.config.json"]))
    .it('extract a single url', ctx => {      
      expect(ctx.stdout).to.contain('Reading conf file..');
      expect(ctx.stdout).to.contain('Requesting url https://www.stackoverflow.com/jobs?l=Spain');
      expect(ctx.stdout).to.contain('Success! 0 new offer(s) found and saved');
      expect(ctx.stdout).to.contain('0 offers found in total');      
    })

    test    
    .stdout()
    .do(() => cmd.run(['--conf', "../test/config/unexisting_url.config.json"]))
    .it('tries to extract unexisting url', ctx => {      
      expect(ctx.stdout).to.contain('Reading conf file..');
      expect(ctx.stdout).to.contain('Requesting url https://www.thisisafakeurl.com');
      //expect(ctx.errorstdout?).to.contain('Error, url not found');
      expect(ctx.stdout).to.contain('0 offers found in total');      
    })    
  })
