import Mailer from "./mailer/Mailer";
import { Offer } from "../models/Offer";
import { logger } from "handlebars";
//import { logger } from 'handlebars';

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
      if (reporter == "email") {
        try {
          let info = await self.sendMail({
            date: new Date(Date.now()),
            offers: self.parseOffers(offers)
          });
          console.log("Report: Mail sent! ", info);
        } catch (e) {
          console.error("Error generating mail report", e);
        }
      }
      //if (reporter == 'html')
      //@TODO process HTML
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
      info = await mailer.sendMail(
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
    // readonly id: string; //@WATCHOUT
    // readonly title: string;
    // readonly description: string;
    // readonly url: string;
    // readonly company: string;
    // readonly location: string;
    // readonly salary_min: number;
    // readonly salary_max: number;
    // readonly salary_currency: string;
    // readonly extractor: string;
    for (let offer of offers) {
      try {
        parsedOffers.push({
          extractor_logo: offer.extractor_logo,
          title: offer.title.substring(0, 40),
          company: offer.company,
          location: offer.location,
          salary_min: offer.salary_min / 1000 + "k" || null,
          salary_max: offer.salary_max / 1000 + "k" || null
        });
      } catch (e) {
        console.error("Error parsing Offer", e);
      }
    }
    return parsedOffers;
  }
}
