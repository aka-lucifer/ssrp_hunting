import { Vector3 } from "fivem-js";
import { Delay, GetHash, Inform } from "../../utils";
import { campingManager } from "../../server";
import { Player } from "../../models/player";

export class Campfire {
  private handle: number;
  public position: Vector3;
  public heading: number;
  public creator: Player;
  public object: number;
  public netId: number

  constructor(creator: Player, position: Vector3, heading?: number) {
    this.handle = campingManager.createdTents.length + 1;
    this.creator = creator;
    this.position = position;
    this.heading = heading;
    this.object = CreateObject(GetHash("prop_beach_fire"), this.position.x, this.position.y, this.position.z - 1.17, true, true, false);
  }
  
  // Getters
  public get Handle(): number {
    return this.handle;
  }

  public async Process(): Promise<void> {
    await Delay(250);
    this.netId = NetworkGetNetworkIdFromEntity(this.object);
    if (campingManager.server.config.debug) Inform("Tent Class", `Created a new tent (${JSON.stringify(this)})`);
  }
}