#!/bin/bash
cd /www/job-o-scraper
git checkout release/1.0.0
npm install
rm ./tsconfig.tsbuildinfo
npm pack
npm install -g job-o-scraper-1.0.0.tgz