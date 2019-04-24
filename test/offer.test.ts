// Imports
import {expect, test} from '@oclif/test'
import cmd = require('../src')
import * as fs from 'fs'; 
import * as path from 'path';
import * as storage from 'node-persist';

import Offer = require('../src/models/Offer');

// Vars

describe('job-o-scraper.offer', () => {
  
  test
    .it('Creates a new Offer', ctx => {
      //Create model
      let raw_offer:any = {
        title: 'title',
        description: 'description',
        price: '40.25',
        url: 'url',
        company: 'company',
        id: 'id'
      }
      let offer = new Offer.Offer(raw_offer);
      
      //Expect
      expect(offer instanceof Offer.Offer).to.be.true;
      expect(offer.title).to.equal('title');
      expect(offer.description).to.equal('description');
      expect(offer.price).to.equal(40.25);
      expect(offer.url).to.equal('url');
      expect(offer.company).to.equal('company');
      expect(offer.id).to.equal('id');
    });

    it('Saves an offer', async () => {
      //Init ddbb
      await storage.init(); //@TODO should init with a proper config
      await storage.clear();
      //Create model
      let raw_offer:any = {
        title: 'title',
        description: 'description',
        price: '40.25',
        url: 'url',
        company: 'company',
        id: 'id'
      }
      let offer = new Offer.Offer(raw_offer);
      //Saves the offer
      let saved = await offer.save();      
    
      //Expect      
      expect(offer).to.not.be.null;
    });

    it('Upsert with insertion - an offer', async () => {
      //Init ddbb
      await storage.init(); //@TODO should init with a proper config
      await storage.clear();
      //Create model
      let raw_offer:any = {
        title: 'title',
        description: 'description',
        price: '40.25',
        url: 'url',
        company: 'company',
        id: 'id'
      }
      let offer = new Offer.Offer(raw_offer);
      //Upsert the offer
      let saved = await offer.upsert();      
    
      //Expect      
      expect(saved).to.not.be.null;
    });

    it('Upsert with no insertion - an offer', async () => {
      //Init ddbb
      await storage.init(); //@TODO should init with a proper config
      await storage.clear();
      //Create model
      let raw_offer:any = {
        title: 'title',
        description: 'description',
        price: '40.25',
        url: 'url',
        company: 'company',
        id: 'id'
      }
      let offer = new Offer.Offer(raw_offer);
      //Upsert the offer
      let saved = await offer.upsert();      
      let upserted = await offer.upsert();      
    
      //Expect    
      expect(upserted).to.be.null;
    });
})
