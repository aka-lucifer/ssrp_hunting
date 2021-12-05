import { Vector3 } from "fivem-js";
import { Inform } from "../../utils";

export class Tent {
  private handle: number;
  public position: Vector3;
  public heading: number;
  public creator: number;
  public object: number;
  public netId: number

  constructor(handle: number, creator: number, position: Vector3, netId: number) {
    this.handle = handle;
    this.position = position;
    this.creator = creator;
    this.netId = netId;
    Inform("Tent Class", `Created a new tent \n(${JSON.stringify(this)})`);
  }
  
  // Getters
  public get Handle(): number {
    return this.handle;
  }
}