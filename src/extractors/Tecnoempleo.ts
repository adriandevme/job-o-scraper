/**
 * Requires
 */
import * as fs from "fs";
import axios from "axios";
import * as cheerio from "cheerio";
import * as storage from "node-persist";
import { Offer } from "../models/Offer";

export default class Tecnoempleo {
  // @TODO create an interface
  // Vars
  private config: any;
  private MAIN_URL: string;
  private company: string;

  static extractor_ref: string = "tecnoempleo";
  static extractor_logo: string =
    "http://ediciones.openexpo.es/wp-content/uploads/2016/11/tecnoempleo-logo.png";

  // Constructor
  constructor(config: any) {
    //Parse values
    this.config = config;
    this.MAIN_URL = "https://www.tecnoempleo.com";
    this.company = "Tecnoempleo";
  }

  // Parses an HTML body string to a nice array of projecs found
  public parseHTML(body: Buffer) {
    //not sure if its a string

    let items: Array<Offer> = [];
    let self = this;

    try {
      // Safely tries to parse object
      let $ = cheerio.load(body);

      $(".p-2.border-bottom").each((i, element) => {
        let item: any = {};
        item.extractor = Tecnoempleo.extractor_ref;
        // Extractor Logo
        item.extractor_logo = Tecnoempleo.extractor_logo;
        // Title
        item.title = $(element).find("h5>a").text().trim();
        // Company
        item.company = $(element).find(".pl-3.pr-1.mb-1>a").text().trim();
        // Description
        // item.description = $(element)
        //   .find(".d-none.d-md-block.g-mb-5.g-mt-5.g-font-size-13.g-pr-120")
        //   .text()
        //   .trim();

        let extra_info = $(element)
          .find(
            //".col-12.col-md-4.col-lg-3.order-xs-2.order-md-3.order-lg-3.hidden-sm-down>div"
            ".bg-theme-color-light.h-100-xs.p-3.rounded.mb-3.fs--15.text-muted"
          )
          .text()
          .trim()
          .replace(/\t/g, "")
          .split("\n  \n");
        // Salary stuff
        let salary = self.parseSalary(extra_info[4]);
        item.salary_min = salary.min;
        item.salary_max = salary.max;
        item.salary_currency = salary.currency;
        // Url
        item.url = $(element).find("h5>a").attr("href");
        // Location
        item.location = extra_info[1].slice(0, -1);
        if (item.location == "100% En Remoto") {
          item.remote = true;
        }

        // Publish date
        item.publish_date_info = extra_info[0].slice(0, -1);
        // Custom ID
        item.id = item.company + ">>" + item.title;

        const offer = new Offer(item);
        items.push(offer);
      });
    } catch (e) {
      console.log(e);
    }

    return items;
  }

  private parseSalary(salary_raw: string | null) {
    let salary: any = {
      currency: null,
      min: null,
      max: null,
    };
    try {
      if (salary_raw) {
        salary_raw = salary_raw.slice(0, -4);
        let salary_split = salary_raw.split(" - ");
        salary.min = Number(salary_split[0].slice(0, -1)) * 1000;
        salary.max = Number(salary_split[1].slice(0, -1)) * 1000;
      }
      salary.currency = "€";
    } catch (e) {
      //console.log('Error', e);
    }
    return salary;
  }
}
