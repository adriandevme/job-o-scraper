import { Command, flags } from "@oclif/command";
import axios from "axios";
import * as storage from "node-persist";
import * as fs from "fs";
import * as path from "path";

import { Offer } from "./models/Offer";
import Reporter from "./reporters/Reporter";

class JobOScraper extends Command {
  static description = "Jobo: scrap job offers";

  static flags = {
    // VERSION
    version: flags.version({ char: "v" }),
    help: flags.help({ char: "h" }),
    // Clear all the data
    clearCache: flags.boolean({
      char: "c",
      description: "Clear ALL stored data BEFORE it runs",
    }),
  };

  static args = [{ name: "conf_file" }];

  async run() {
    const { args, flags } = this.parse(JobOScraper);
    const self = this;

    // Init local ddbb
    await storage.init({ dir: path.join(__dirname, "../.node-persist") }); //@TODO should init with a proper config
    // Clear cache if selected
    if (flags.clearCache) {
      this.log("Clearing cache...");
      await storage.clear();
      this.log("Cache cleared!");
    }
    if (args.conf_file) {
      // Run from conf file
      const config = this.parseConf(path.join(args.conf_file));
      this.log("Reading conf file..");
      //Read URLs
      let all: Array<Offer> = [];
      for (const url of config.urls) {
        // Get offers
        let offers: Array<Offer> = await self.processURL(url);
        // Save results
        if (offers.length) {
          let saved: Array<Offer> = await self.saveOffers(offers);
          all = all.concat(saved);
        }
      }
      // Info
      console.log(`${all.length} offers found in total`);
      // Generate report
      if (all.length && config.reporters) {
        const reporter = new Reporter(config);
        await reporter.process(config.reporters, all);
      }
    } else {
      this.log("Error, no config url provided");
      //run --url="https://www.workana.com/jobs?ref=home_top_bar"
      //run --conf="../bin/default.json"
    }
  }

  private async processURL(url: string) {
    var self = this;
    // Init array
    let offers: Array<Offer> = [];
    this.log("Requesting url " + url);
    try {
      // Request to the server
      const response = await axios.get(url as string);
      // Select parser
      try {
        let parser_name: string = url.split(".")[1];
        parser_name =
          parser_name.charAt(0).toUpperCase() + parser_name.slice(1); //Capitalize
        const ParserImport = await import("./extractors/" + parser_name);
        let parser = new ParserImport.default({});
        // Parse offers
        offers = await parser.parseHTML(response.data as any);
      } catch (e) {
        this.log("Parser not defined for " + url.split(".")[1], e);
      }
    } catch (e) {
      console.log("Error, url not found");
    }
    // Return
    return offers;
  }

  private async saveOffers(offers: Array<Offer>) {
    let upserted: Array<Offer> = [];
    for (const offer of offers) {
      let o = await offer.upsert();
      if (o) upserted.push(o);
    }
    // Log
    this.log(`Success! ${upserted.length} new offer(s) found and saved`);
    return upserted;
  }

  private parseConf(conf_url: any) {
    //@TODO parse
    return JSON.parse(fs.readFileSync(conf_url, "utf8"));
  }
}

export = JobOScraper;
