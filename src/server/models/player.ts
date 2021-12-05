import { Vector3 } from "fivem-js";
import { Events } from "../../shared/enums/events";
import { NumToVector3 } from "../utils";

export class Player {
    public handle: string;
    public name: string;
    public ped: number;
    public position: Vector3;
    public heading: number;

    constructor(playerHandle: string) {
        this.handle = playerHandle;
        this.name = GetPlayerName(this.handle);
        this.ped = GetPlayerPed(this.handle);
        this.position = NumToVector3(GetEntityCoords(this.ped));
        this.heading = GetEntityHeading(this.ped);
    }

    // Get Requests
    public get GetHandle(): string {
        return this.handle
    }

    // Methods
    public Ped(): number {
        this.ped = GetPlayerPed(this.handle);
        return this.ped;
    }

    public Position(): Vector3 {
        this.position = NumToVector3(GetEntityCoords(this.ped));
        return this.position;
    }
    
    public Heading(): number {
        this.heading = GetEntityHeading(this.ped);
        return this.heading;
    }

    public async TriggerEvent(eventName: Events | string, ...args: any[]): Promise<void> {
      return emitNet(eventName, this.handle, ...args);
    }
}