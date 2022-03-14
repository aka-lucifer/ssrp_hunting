import { Tent } from "../models/camping/tent";
import { Campfire } from "../models/camping/campfire";
import { Player } from "../models/player";
import { Server } from "../server";
import { Vector3 } from "fivem-js";
import { Dist, Inform } from "../utils";
import { Events } from "../../shared/enums/events";

export class CampingManager {
  public server: Server;
  public createdTents: Tent[] = [];
  public createdFires: Campfire[] = [];

  constructor(server: Server) {
    this.server = server;
  }

  // Methods
  public async createTent(creator: Player, position: Vector3, heading?: number): Promise<Tent> {
    const tentData = new Tent(creator, position, heading)
    await tentData.Process()
    this.createdTents.push(tentData);

    emitNet(Events.syncCampingData, -1, this.createdTents, this.createdFires);

    if (this.server.config.debug) {
      Inform("Camping Manager (createTent)", `${creator.name} is creating a tent at (${JSON.stringify(position)})`)
    }
    
    return tentData;
  }

  public getNearestTent(player: Player): [number, Tent] {
    let closest: Tent, dist;
    for (let i = 0; this.createdTents.length; i++) {
      if (closest === undefined) {
        closest = this.createdTents[i];
        dist = Dist(player.Position(), this.createdTents[i].position, true);
      } else {
        const newDist = Dist(player.Position(), this.createdTents[i].position, true);
        if (newDist < dist) {
          closest = this.createdTents[i];
          dist = newDist;
        }
      }
    }

    return [dist, closest];
  }

  public async pickupTent(tentNet: number): Promise<void> {
    const tentIndex = this.createdTents.findIndex(tent => tent.netId == tentNet);
    // console.log(`Tent Index - ${tentIndex} | ${tentNet}`)
    if (tentIndex != -1) {
      const entity = NetworkGetEntityFromNetworkId(this.createdTents[tentIndex].netId);
      DeleteEntity(entity);
      emitNet('QBCore:Notify', this.createdTents[tentIndex].creator.GetHandle, "You've picked up your tent", "success")
      this.createdTents.splice(tentIndex, 1);
      emitNet(Events.syncCampingData, -1, this.createdTents, this.createdFires);
    }
  }

  public async createFire(creator: Player, position: Vector3, heading?: number): Promise<Campfire> {
    const campfireData = new Campfire(creator, position, heading);
    console.log("created campfire");
    await campfireData.Process();
    this.createdFires.push(campfireData);

    emitNet(Events.syncCampingData, -1, this.createdTents, this.createdFires);

    if (this.server.config.debug) {
      Inform("Camping Manager (createFire)", `${creator.name} is creating a fire at (${JSON.stringify(position)})`)
    }
    
    return campfireData;
  }

  public getNearestFire(player: Player): [number, Campfire] {
    let closest: Campfire, dist;
    for (let i = 0; this.createdFires.length; i++) {
      if (closest === undefined) {
        closest = this.createdFires[i];
        dist = Dist(player.Position(), this.createdFires[i].position, true);
      } else {
        const newDist = Dist(player.Position(), this.createdFires[i].position, true);
        if (newDist < dist) {
          closest = this.createdFires[i];
          dist = newDist;
        }
      }
    }

    return [dist, closest];
  }

  public async destroyFire(fireNet: number): Promise<void> {
    const fireIndex = this.createdFires.findIndex(tent => tent.netId == fireNet);
    console.log(`Fire Index - ${fireIndex} | ${fireNet}`)
    if (fireIndex != -1) {
      const entity = NetworkGetEntityFromNetworkId(this.createdFires[fireIndex].netId);
      DeleteEntity(entity);
      emitNet('QBCore:Notify', this.createdFires[fireIndex].creator.GetHandle, "You've destroyed your campfire", "success")
      this.createdFires.splice(fireIndex, 1);
      emitNet(Events.syncCampingData, -1, this.createdTents, this.createdFires);
    }
  }
}
