/**
 * Requires
 */
import axios from "axios";
import * as storage from "node-persist";

export class Offer { //@TODO add default

  readonly id: string; //@WATCHOUT
  readonly title: string;
  readonly description: string;
  readonly url: string;
  readonly company: string;
  readonly location: string;
  readonly salary_min: number;
  readonly salary_max: number;
  readonly salary_currency: string;
  readonly extractor: string;
  readonly extractor_logo: string; //@TODO to move when I'll interface the class
  //readonly createdAt: Date;

  /**
   * Offer constructor
   * @param data Object that contains the offer data
   */
  constructor(data: any) {
    //Build ID
    this.id = data.company + data.title;
    //Assign fields
    this.extractor = data.extractor;
    this.extractor_logo = data.extractor_logo;    
    this.title = data.title;
    this.description = data.description;
    this.url = data.url;
    this.company = data.company;
    this.location = data.location;
    this.salary_max = Number(data.salary_max) ? Number(data.salary_max) : 0;
    this.salary_min = Number(data.salary_max) ? Number(data.salary_max) : 0;
    this.salary_currency = data.salary_currency;
    //this.createdAt = new Date(Date.now());
  }

  /**
   * Tries to upsert this object
   */
  public async upsert() {
    const self = this;
    //Find the item
    let found = await storage.getItem(self.id);

    if (!found) {
      await self.save();
      return self;
    } else return null;
  }

  /**
   * Returns a single Offer by ID
   * @param id Offer ID
   */
  public static async findOne(id: string) {
    return storage.getItem(id);
  }

  /**
   * List all offers saved
   */
  public static async list() {
    return storage.values();
  }

  /**
   * Saves the current offer
   */
  public async save() {
    let saved;
    try {
      await storage.setItem(this.id, this);
      saved = this;
    } catch (e) {
      console.log(e);
    }
    return saved;
  }
}