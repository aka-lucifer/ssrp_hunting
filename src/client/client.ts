import { Game, Model, Ped, Prop, World } from "fivem-js";
import { Events } from "../shared/enums/events";
import { ForceOnGround, Inform, Log } from "./utils";
import { PedTypes } from "./enums/hunting/pedTypes";
import { Progress } from "./models/ui/progress";
import { CampingManager } from "./managers/camping";
import { AnimalManager } from "./managers/animal";
import { FenceManager } from "./managers/fence";
import { ProgressManager } from "./managers/ui/progress";
import config from "../configs/client.json";

export class Client {
    public config: Record<string, any> = {};
    public QBCore: Record<string, any> = {};
    public started: boolean = false;

    constructor() {
        this.config = config;
        
        // QB Processor
        if (GetResourceState("qb-core") == "started") { // If QB Core Already Started
            this.QBCore = global.exports["qb-core"].GetCoreObject();
        }

        // Events
        on(Events.resourceStart, (resourceName: string) => {
            this.EVENT_QBCoreStarted(resourceName);

            if (resourceName == GetCurrentResourceName()) {
                emitNet(Events.resourceRestarted);
            }
        });
    }

    // Events
    private EVENT_QBCoreStarted(resourceName: string): void { // FOR QB-CORE RESTARTING
        if ("qb-core" == resourceName) {
            this.QBCore = global.exports[resourceName].GetCoreObject();
        }
    }

    // Methods
    public async loadModels(): Promise<void> {
        // Model Loading
        const tentModel = new Model("ba_prop_battle_tent_01");
        const fireModel = new Model("prop_beach_fire");
        const chairModel = new Model(this.config.campfire.chairModel);

        if (tentModel.IsInCdImage) {
            const gotModel = await tentModel.request(1000);
            if (this.config.debug) Log("Client.JS", `Found Model (Tent): ${gotModel}`);
        } else {
            console.log("Tent model doesn't exist!");
        }

        if (fireModel.IsInCdImage) {
            const gotModel = await fireModel.request(1000);
            if (this.config.debug) Log("Client.JS", `Found Model (Fire): ${gotModel}`);
        } else {
            console.log("Campfire odel doesn't exist!");
        }

        if (chairModel.IsInCdImage) {
            const gotModel = await chairModel.request(1000);
            if (this.config.debug) Log("Client.JS", `Found Model (Chair): ${gotModel}`);
        } else {
            console.log("Chair model doesn't exist!");
        }
    }
}

export const client = new Client();
export const campingManager = new CampingManager(client);
export const animalManager = new AnimalManager(client);
const fenceManager = new FenceManager(client);
export const progressManager = new ProgressManager(client);

setImmediate(async() => {
    await client.loadModels();
})