import ReadClient from "../../../read-client/ReadClient";
import {InputFlow} from "./InputFlow";

export class InfluxInputFlow implements InputFlow {
  private readonly query: string;
  private select_field: string;
  private readonly database_name: string;
  private readonly client: ReadClient;

  constructor (database: string, query: string, client: ReadClient) {
    this.query = this.checkQuery(query);
    this.database_name = database;
    this.client = client;
  }

  public async getResult (): Promise<string> {
    console.log("Awaiting getResult()");
    console.log("DB:" + this.database_name);
    console.log("Query:" + this.query);
    const result = await this.client.readField(this.database_name, this.query)
      .catch((err) => {
        console.error("An error happened on getResult() " + err);
        throw err;
      });
    console.log("---getResult()");
    console.log(JSON.stringify(result[0]));
    console.log("---end getResult()");
    return result[0].rows[0][this.select_field];
  }

  private checkQuery (query: string): string {
    // Check if query has select *
    if (query.includes("*")) {
      throw new Error("The query cannot have a *, select a single field");
    }
    // Add limit if not already present
    if (!query.toLowerCase().includes("limit 1")) {
      query = query.concat(" LIMIT 1");
    }
    // Get the name of the field to select
    const select = query.substring(
      query.toLowerCase().indexOf("select") + 7,
      query.toLowerCase().indexOf("from"),
    ).trim();
    if (select.includes(",")) {
      throw new Error("The query cannot select more than one field!");
    }
    this.select_field = select;

    return query;
  }
}
