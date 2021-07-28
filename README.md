job-o-scraper
=============

A simple CLI tool for easy scraping Job offers and get instant notifications.

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/job-o-scraper.svg)](https://npmjs.org/package/job-o-scraper)
[![CircleCI](https://circleci.com/gh/adriandevme/job-o-scraper/tree/master.svg?style=shield)](https://circleci.com/gh/adriandevme/job-o-scraper/tree/master)
[![Codecov](https://codecov.io/gh/adriandevme/job-o-scraper/branch/master/graph/badge.svg)](https://codecov.io/gh/adriandevme/job-o-scraper)
[![Downloads/week](https://img.shields.io/npm/dw/job-o-scraper.svg)](https://npmjs.org/package/job-o-scraper)
[![License](https://img.shields.io/npm/l/job-o-scraper.svg)](https://github.com/adriandevme/job-o-scraper/blob/master/package.json)

<!-- Install -->
### Install

```bash
npm install -g job-o-scraper
```
<!-- Commands -->
### Commands

```bash
Jobo: scrap job offers

USAGE
  $ jobo [CONF_FILE]

OPTIONS
  -h, --help     show CLI help
  -v, --version  show CLI version
```
<!-- How it works -->
### How it works
Each time you run the command 'jobo' performs a single search using the specified configuration. job-o-scraper uses its own local database in order to detect new job offers.

<!-- Usage -->
### Usage

Job-o-scraper uses JSON files for configuration. You can find a sample file in ./run/default.config.json

Available params are:
```json
{
    "urls": ["https://www.workana.com/jobs?ref=home_top_bar&page=1", 
        "https://www.stackoverflow.com/jobs",
        "https://www.tecnoempleo.com/busqueda-empleo.php"],
    "verbose": false, 
    "reporters": ["email"],
    "mail_config": {
        "from": "adriandevme@gmail.com",
        "to": "adriandevme@gmail.com",
        "host": "in-v3.mailjet.com",
        "port": 25,
        "secure": false,
        "auth": {
          "user": "76b8444375988329c5240918eda58254",
          "pass": "8ceb8d3d5d37ed7841323ec541745a07"
        }
    }
}
```

Currently supported sites are [Stackoverflow](https://stackoverflow.com/jobs), [Tecnoempleo](https://tecnoempleo.com) and [Workana](https://www.workana.com/jobs).

Using the default "email" reporter option will send you a formatted HTML mail like this
![](https://i.imgur.com/uhcfA7B.png)

Feel free to add more supported sites adding the convenient extractor.

