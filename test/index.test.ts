import {expect, test} from '@oclif/test'

import cmd = require('../src')

describe.skip('job-o-scraper', () => {
  test
    .stdout()
    .do(() => cmd.run([]))
    .it('simply runs', ctx => {
      expect(ctx.stdout).to.contain('Job-o CLI')
    })

  test
    .stdout()
    .do(() => cmd.run(['--url', 'https://www.tecnoempleo.com/busqueda-empleo.php?te=javascript&cp=,29,&pr=,234,#buscador-ofertas-ini']))
    .it('performs a manual search', ctx => {
      expect(ctx.stdout).to.contain('todo mock data');
    })
  
  test
    .stdout()
    .do(() => cmd.run(['--url', 'https://www.workana.com/jobs?ref=home_top_bar']))
    .it('Runs in URL mode with Workana parser', ctx => {
      expect(ctx.stdout).to.contain('Workana');
    })
  })
