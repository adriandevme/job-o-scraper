/**
 * Requires
 */
import * as handlebars from "handlebars";
import { Offer } from '../../models/Offer';
import { readFileSync } from 'fs';
import * as path from "path";
const mjml2html = require("mjml");

/**
 * Class
 */
export class Mailer {

  /**
   * Vars
   */

  /**
   * Mailer
   * @param config Mailer-related configuration
   */
  constructor(config: any) {    
  }

  /**
   * Prepares the MJML template with the given data
   * @param data Data to inject
   */
  public buildMJML(data:any) {
    var source = readFileSync(path.join(__dirname, './template.mjml'));
    var template = handlebars.compile(source.toString());
    return (template(data));
  }

  /**
   * Compiles MJML template
   * @param mjml MJML string
   */
  public compileMJML(mjml:string){
    //@TODO handle errors
    return mjml2html(mjml);
  }

}