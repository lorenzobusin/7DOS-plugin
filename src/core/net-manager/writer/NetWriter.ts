import {WriteClient} from "../../write-client/write-client";
import {CalcResultAggregate} from "../result/calculation-result/calculation-result";

export interface NetWriter {
  write(data: CalcResultAggregate): Promise<void>;
}

export class SingleNetWriter implements NetWriter {
  private client: WriteClient;

  public constructor(client: WriteClient) {
    if (client == null) {
      throw new Error("invalid client parameter");
    }
    this.client = client;
  }

  public async write(calcData: CalcResultAggregate): Promise<void> {
    if (calcData == null) {
      throw new Error("invalid calcData parameter");
    }
    await this.client.writeBatchData(calcData);
  }
}
