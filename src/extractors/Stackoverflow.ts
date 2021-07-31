/**
 * Requires
 */
import * as fs from "fs";
import axios from "axios";
import * as cheerio from "cheerio";
import * as storage from "node-persist";
import { Offer } from "../models/Offer";

export default class Stackoverflow {
  // @TODO create an interface
  // Vars
  private config: any;
  private MAIN_URL: string;
  private company: string;

  static extractor_ref: string = "stackoverflow";
  static extractor_logo: string = "https://i.stack.imgur.com/440u9.png";

  // Constructor
  constructor(config: any) {
    //Parse values
    this.config = config;
    this.MAIN_URL = "https://www.stackoverflow.com";
    this.company = "Stackoverflow";
  }

  //Functions
  public async getProjectsFromURL(URL: string) {
    // Vars
    var self = this;
    var items: Array<any>;
    //Retrieve the first one
    if (!URL) throw new Error("No URL defined");
    else {
    }
  }

  // Parses an HTML body string to a nice array of projecs found
  public parseHTML(body: Buffer) {
    //not sure if its a string

    let items: Array<Offer> = [];
    let self = this;

    try {
      // Safely tries to parse object
      let $ = cheerio.load(body);

      $(".-job").each((i, element) => {
        let item: any = {};
        // Define extractor
        item.extractor = Stackoverflow.extractor_ref;
        item.extractor_logo = Stackoverflow.extractor_logo;
        // Title
        item.title = $(element).find("h2").text().trim();
        //item.description = $(element).find('.project-details').text().trim();
        // Salary
        let salaryRaw = this.findSalaryRaw(
          $(element).find(".fs-caption").text().trim()
        );
        if (salaryRaw.length) {
          let salary = this.parseSalary(salaryRaw);
          item.salary_min = salary.min;
          item.salary_max = salary.max;
          item.salary_currency = salary.currency;
        }
        // Description
        item.description = $(element).find(".-salary").text().trim();
        // Url
        item.url = self.MAIN_URL + $(element).find("h2>a").attr("href");
        // Company
        item.company = $(element).find("h3>span:first-child").text().trim();
        // Location
        item.location = $(element)
          .find("h3>span:nth-child(2)")
          .text()
          .trim()
          .substring(3);
        // Publish date
        item.publish_date_info = $(element)
          .find(".fs-caption:first-child")
          .text()
          .trim();
        // Internal ID
        item.id = item.company + ">>" + item.title;

        const offer = new Offer(item);
        items.push(offer);
      });
    } catch (e) {
      console.log(e);
    }

    return items;
  }

  private findSalaryRaw(extra_info: string) {
    var salaryRaw: string = "";
    //Salary raw comes in a string with other stuff
    //split by dots and tries to find something with numbers
    let arr: Array<string> = extra_info.split("\n");
    //First element is always the publishing date
    arr.shift();
    arr.forEach((item) => {
      if (/\d/.test(item)) salaryRaw = item.trim();
    });

    return salaryRaw;
  }

  private parseSalary(salary_raw: string) {
    let salary: any = {
      currency: null,
      min: null,
      max: null,
    };
    try {
      if (salary_raw) {
        salary.currency = salary_raw[0];
        let split = salary_raw.substring(1).split("–");
        salary.min = split[0].slice(0, -1);
        salary.max = split[1].slice(0, -1);
      }
      salary.min = Number(salary.min) * 1000;
      salary.max = Number(salary.max) * 1000;
    } catch (e) {
      console.log("Error", e);
    }
    return salary;
  }
}
