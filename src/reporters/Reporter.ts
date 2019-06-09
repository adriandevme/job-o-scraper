import Mailer from "./mailer/Mailer";
import { Offer } from "../models/Offer";
import * as moment from 'moment';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

export default class Reporter {
  private config: any;

  // Constructor
  constructor(config: any) {
    this.config = config;
  }

  /**
   * process
   */
  public async process(reporters: Array<string>, offers: Array<Offer>) {
    let self = this;
    for (let reporter of reporters) {
      switch(reporter){
        case "email":{
          try {
            let info = await self.sendMail({
              date: moment().format("YYYY-MM-DD HH:mm"),
              offers: self.parseOffers(offers)
            });
            console.log("Report: Mail sent!");
          } catch (e) {
            console.error("Error generating mail report", e);
          }
          break;
        }
        case "html":{
          try {
            let date = moment().format("YYYY-MM-DD HH:mm")
            let mailer = new Mailer(self.config.mail_config);
            let html = await mailer.generateHTML({
              date: date,
              offers: self.parseOffers(offers)
            });
            try{
              fs.writeFileSync(os.homedir()+'\\job-o-scraper_'+moment(date).format("YYYY-MM-DD_HH-mm")+'.html', html);
              console.log("Report: HTML saved at " + os.homedir());
            }
            catch(e){
              console.error('Error writing HTML report', e);
            }
          } catch (e) {
            console.error("Error generating mail report", e);
          }
          break;
        }        
      }
    }
  }

  /**
   * Send & build an HTML template
   * @param mail_data template data
   */
  private async sendMail(mail_data: any) {
    let self = this;
    let mailer = new Mailer(self.config.mail_config);
    let html = mailer.generateHTML(mail_data);
    let info;
    try {
      info = await mailer.sendMail( //@TODO require this
        self.config.mail_config.from,
        self.config.mail_config.to,
        "✔ Job-o-scraper results: " + mail_data.date,
        html
      );
    } catch (e) {
      console.error("Error sending mail", e);
    }
    return info;
  }

  /**
   * Parses the array of offers nicely for building the HTML template
   * @param offers Array of offers
   */
  private parseOffers(offers: Array<Offer>) {
    let parsedOffers: Array<any> = [];

    for (let offer of offers) {
      try {
        parsedOffers.push({
          extractor_logo: offer.extractor_logo,
          title: offer.title.substring(0, 100),
          company: offer.company,
          location: offer.location,
          salary_min: offer.salary_min ? offer.salary_min/ 1000 + "k" : undefined,
          salary_max: offer.salary_max ? offer.salary_max/ 1000 + "k" : undefined,
          salary_currency: offer.salary_currency,
          publish_date_info: offer.publish_date_info,
          url: offer.url
        });
      } catch (e) {
        console.error("Error parsing Offer", e);
      }
    }
    return parsedOffers;
  }
}
