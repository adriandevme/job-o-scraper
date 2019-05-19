/**
 * Requires
 */
import * as handlebars from "handlebars";
import { Offer } from "../../models/Offer";
import { readFileSync } from "fs";
import * as path from "path";
import * as nodemailer from "nodemailer";
const mjml2html = require("mjml");

/**
 * Class
 */
export default class Mailer {
  /**
   * Vars
   */
  private config: any;

  /**
   * Mailer
   * @param config Mailer-related configuration
   */
  constructor(config: any) {
    // == Sample config ==
    // host: "smtp.ethereal.email",
    // port: 587,
    // secure: false, // true for 465, false for other ports
    // auth: {
    //   user: testAccount.user, // generated ethereal user
    //   pass: testAccount.pass // generated ethereal password
    // }
    this.config = config; //@WATCHOUT
  }

  /**
   * Prepares the MJML template with the given data
   * @param data Data to inject
   */
  public buildMJML(data: any) {
    var source = readFileSync(path.join(__dirname, "./template.mjml"));
    var template = handlebars.compile(source.toString());
    return template(data);
  }

  /**
   * Compiles MJML template
   * @param mjml MJML string
   */
  public compileMJML(mjml: string) {
    //@TODO handle errors
    return mjml2html(mjml);
  }

  /**
   * From a given data, injects MJML and compiles HTML
   * @param data Handlebars data object
   */
  public generateHTML(data: any) {
    let html;
    try {
      html = this.compileMJML(this.buildMJML(data)).html;
    } catch (e) {
      console.error("Error generating HTML", e);
    }
    return html;
  }

  /**
   * Simply sends an email
   * @param from Sender address
   * @param to Receiver address(es)
   * @param subject Subject
   * @param html HTML body
   */
  public async sendMail(
    from: string,
    to: string,
    subject: string,
    html: string
  ) {
    let self = this;
    let transporter = nodemailer.createTransport(self.config);
    // == Sample data to send ==
    // from: '"Fred Foo 👻" <foo@example.com>', // sender address
    // to: "bar@example.com, baz@example.com", // list of receivers
    // subject: "Hello ✔", // Subject line
    // text: "Hello world?", // plain text body
    // html: "<b>Hello world?</b>" // html body
    let info = await transporter.sendMail({
      from: from,
      to: to,
      subject: subject,
      //text: text
      html: html
    });
    return info;
  }
}
