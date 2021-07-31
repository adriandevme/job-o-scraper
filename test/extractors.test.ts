// Imports
import { expect, test } from "@oclif/test";
import cmd = require("../src");
import * as fs from "fs";
import * as path from "path";
import axios from "axios";

import { Offer } from "../src/models/Offer";
import Workana from "../src/extractors/Workana";
import Tecnoempleo from "../src/extractors/Tecnoempleo";
import Stackoverflow from "../src/extractors/Stackoverflow";

describe("job-o-scraper.extractors", () => {
  test.it("should extract all items from Workana website", async (ctx) => {
    // Load HTML
    // const url = 'https://www.workana.com/jobs?ref=home_top_bar&page=1';
    // let stacko_response = await axios.get(url as string);
    // fs.writeFileSync(path.join(__dirname, './mocks/workana.mock.html'), stacko_response.data);
    let mock_html = fs.readFileSync(
      path.join(__dirname, "./mocks/workana.mock.html")
    );
    let mock_result_json = JSON.parse(
      fs.readFileSync(
        path.join(__dirname, "./mocks/workana_result.mock.json"),
        "utf8"
      )
    );
    let mock_result: Offer[] = [];
    for (var mr of mock_result_json) {
      mock_result.push(new Offer(mr));
    }
    let parser = new Workana({});
    let result: Offer[] = parser.parseHTML(mock_html);
    //fs.writeFileSync(path.join(__dirname, './mocks/workana_result.mock.json'), JSON.stringify(result));
    expect(result).to.eql(mock_result);
  });

  test.it(
    "should extract all items from StackOverflow website",
    async (ctx) => {
      // Load HTML
      // const url = 'https://stackoverflow.com/jobs';
      // let site_response = await axios.get(url as string);
      // fs.writeFileSync(path.join(__dirname, './mocks/stackoverflow.mock.html'), site_response.data);
      // Read mock data
      let mock_html = fs.readFileSync(
        path.join(__dirname, "./mocks/stackoverflow.mock.html")
      );
      let mock_result_json = JSON.parse(
        fs.readFileSync(
          path.join(__dirname, "./mocks/stackoverflow_result.mock.json"),
          "utf8"
        )
      );
      let mock_result: Offer[] = [];
      for (var mr of mock_result_json) {
        mock_result.push(new Offer(mr));
      }
      let parser = new Stackoverflow({});
      let result: Offer[] = parser.parseHTML(mock_html);
      // fs.writeFileSync(
      //   path.join(__dirname, "./mocks/stackoverflow_result.mock.json"),
      //   JSON.stringify(result),
      //   { flag: "w" }
      // );
      expect(result).to.eql(mock_result);
    }
  );

  test
    .only()
    .it("should extract all items from Tecnoempleo website", async (ctx) => {
      // Load HTML
      // const url = "https://www.tecnoempleo.com/busqueda-empleo.php";
      // let site_response = await axios.get(url as string);
      // fs.writeFileSync(
      //   path.join(__dirname, "./mocks/tecnoempleo.mock.html"),
      //   site_response.data
      // );
      // Read mock data
      let mock_html = fs.readFileSync(
        path.join(__dirname, "./mocks/tecnoempleo.mock.html")
      );
      let mock_result_json = JSON.parse(
        fs.readFileSync(
          path.join(__dirname, "./mocks/tecnoempleo_result.mock.json"),
          "utf8"
        )
      );
      let mock_result: Offer[] = [];
      for (var mr of mock_result_json) {
        mock_result.push(new Offer(mr));
      }
      let parser = new Tecnoempleo({});
      let result: Offer[] = parser.parseHTML(mock_html);
      // fs.writeFileSync(
      //   path.join(__dirname, "./mocks/tecnoempleo_result.mock.json"),
      //   JSON.stringify(result),
      //   { flag: "w" }
      // );
      expect(result).to.eql(mock_result);
    });
});
