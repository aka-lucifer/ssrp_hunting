import { Vector3 } from "fivem-js";
import { Events } from "../../shared/enums/events";
import { NumToVector3 } from "../utils";

export class Player {
    public handle: string;
    public name: string;
    public position: Vector3;

    constructor(handle: string, name: string, position: Vector3) {
        this.handle = handle;
        this.name = name;
        this.position = position;
    }

    // Get Requests
    public get GetHandle(): string {
        return this.handle
    }

    // Methods
    public Position(): Vector3 {
        this.position = NumToVector3(GetEntityCoords(GetPlayerPed(parseInt(this.handle)), false));
        return this.position;
    }
}