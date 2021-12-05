import { Vector3 } from "fivem-js";
import { Inform } from "../../utils";

export class Campfire {
  private handle: number;
  public position: Vector3;
  public creator: number;
  public netId: number

  constructor(handle: number, creator: number, position: Vector3, netId: number) {
    this.handle = handle;
    this.creator = creator;
    this.position = position;
    this.netId = netId;
    Inform("Campfire Class", `Created a new campfire (${JSON.stringify(this)})`);
  }
  
  // Getters
  public get Handle(): number {
    return this.handle;
  }
}