import { Player } from "./models/player";
import { Tent } from "./models/camping/tent";
import { Campfire } from "./models/camping/campfire";
import { PlayerManager } from "./managers/players";
import { CampingManager } from "./managers/camping";
import { Events } from "../shared/enums/events";
import config from "../configs/server.json";
import { Vector3 } from "fivem-js";
import { Delay, GetHash, Inform, Random } from "./utils";

export class Server {
    public config: Record<string, any> = {};
    public debugging: boolean;
    public QBCore: Record<string, any> = {};

    constructor() {
        // Define Config Data
        this.config = config;
        this.debugging = this.config.debugging;

        // QB Processor
        if (GetResourceState("qb-core") == "started") { // If QB Core Already Started
            this.QBCore = global.exports["qb-core"].GetCoreObject();
            this.RegisterItems();
        }

        // Events
        on(Events.resourceStart, this.EVENT_QBCoreStarted);
        on(Events.resourceStop, this.EVENT_ResourceStopped);
        on(Events.playerConnected, this.EVENT_PlayerLoaded);
        on(Events.playerDropped, this.EVENT_PlayerDropped);
        onNet(Events.resourceRestarted, this.EVENT_PlayerLoaded);
        onNet(Events.harvestAnimal, this.EVENT_HarvestAnimal.bind(this));
        onNet(Events.pickupTent, this.EVENT_PickupTent.bind(this));
        onNet(Events.destroyFire, this.EVENT_DestroyFire.bind(this));
        onNet(Events.cookMeat, this.EVENT_CookMeat.bind(this));
        onNet(Events.buyItem, this.EVENT_BuyItem.bind(this));
        onNet(Events.sellItem, this.EVENT_SellItem.bind(this));
    }

    // Events
    private EVENT_QBCoreStarted(resourceName: string): void { // FOR QB-CORE RESTARTING
        if ("qb-core" == resourceName) {
            this.QBCore = global.exports[resourceName].GetCoreObject();
            this.RegisterItems();
        }

    }

    private EVENT_ResourceStopped(resourceName: string): void {
        if (GetCurrentResourceName() == resourceName) {
            if (campingManager.createdTents.length > 0) {
                for (let i = 0; i < campingManager.createdTents.length; i++) {
                    const objID = NetworkGetEntityFromNetworkId(campingManager.createdTents[i].netId);
                    DeleteEntity(objID);
                    console.log(`Deleted tent [${campingManager.createdTents[i].Handle} | ${campingManager.createdTents[i].netId}] at (${JSON.stringify(campingManager.createdTents[i].position)})`)
                }
            }

            if (campingManager.createdFires.length > 0) {
                for (let i = 0; i < campingManager.createdFires.length; i++) {
                    const objID = NetworkGetEntityFromNetworkId(campingManager.createdFires[i].netId);
                    DeleteEntity(objID);
                    console.log(`Deleted fire [${campingManager.createdFires[i].Handle} | ${campingManager.createdFires[i].netId}] at (${JSON.stringify(campingManager.createdFires[i].position)})`)
                }
            }

            Inform("Resource Stopped", "Deleted all tents and campfires as the resource was stopped!");
        }
    }

    private EVENT_PlayerLoaded(): void {
        const player = new Player(source);
        playerManager.Add(player);
        player.TriggerEvent(Events.startCampManager)
    }

    private EVENT_PlayerDropped(): void {
        playerManager.Remove(source);
    }

    private EVENT_HarvestAnimal(animalData: Record<string, any>): void {
        console.log(`State: ${animalData.state} | Lethal: ${animalData.lethal} | Model: ${JSON.stringify(animalData.model)} | Net ID: ${animalData.netId}`);
        let meatItem: string, peltItem: string, meatAmount: number;
        console.log(`Ped Model (${JSON.stringify(animalData.model)}) | ${animalData.model.hash} | ${GetHash("a_c_deer")}`)
        switch(animalData.model.hash) {
            case GetHash("a_c_deer"):
                meatItem = "raw_venison_meat";
                switch(animalData.state) {
                    case "PERFECT":
                        meatAmount = Random(1, 4);
                        if (animalData.lethal) {
                            peltItem = "deer_pelt_perfect";
                        } else {
                            peltItem = "deer_pelt_good";
                        }
                        break;
                    case "GOOD":
                        meatAmount = Random(1, 3);
                        peltItem = "deer_pelt_good"
                        break;
                    case "BAD":
                        meatAmount = Random(1, 2);
                        peltItem = "deer_pelt_bad"
                        break;
                    case "RUINED":
                        meatAmount = 1;
                        peltItem = "deer_pelt_ruined"
                        break;
                }
                break;
            case GetHash("a_c_boar"):
                meatItem = "raw_pork_meat";
                switch(animalData.state) {
                    case "PERFECT":
                        meatAmount = Random(1, 4);
                        if (animalData.lethal) {
                            peltItem = "boar_pelt_perfect";
                        } else {
                            peltItem = "boar_pelt_good";
                        }
                        break;
                    case "GOOD":
                        meatAmount = Random(1, 3);
                        peltItem = "boar_pelt_good"
                        break;
                    case "BAD":
                        meatAmount = Random(1, 2);
                        peltItem = "boar_pelt_bad"
                        break;
                    case "RUINED":
                        meatAmount = 1;
                        peltItem = "boar_pelt_ruined"
                        break;
                }
                break;
            case GetHash("a_c_mtlion"):
                meatItem = "raw_lion_meat";
                switch(animalData.state) {
                    case "PERFECT":
                        meatAmount = Random(1, 4);
                        if (animalData.lethal) {
                            peltItem = "lion_pelt_perfect";
                        } else {
                            peltItem = "lion_pelt_good";
                        }
                        break;
                    case "GOOD":
                        meatAmount = Random(1, 3);
                        peltItem = "lion_pelt_good"
                        break;
                    case "BAD":
                        meatAmount = Random(1, 2);
                        peltItem = "lion_pelt_bad"
                        break;
                    case "RUINED":
                        meatAmount = 1;
                        peltItem = "lion_pelt_ruined"
                        break;
                }
                break;
            case GetHash("a_c_coyote"):
                meatItem = "raw_coyote_meat";
                switch(animalData.state) {
                    case "PERFECT":
                        meatAmount = Random(1, 4);
                        if (animalData.lethal) {
                            peltItem = "coyote_pelt_perfect";
                        } else {
                            peltItem = "coyote_pelt_good";
                        }
                        break;
                    case "GOOD":
                        meatAmount = Random(1, 3);
                        peltItem = "coyote_pelt_good"
                        break;
                    case "BAD":
                        meatAmount = Random(1, 2);
                        peltItem = "coyote_pelt_bad"
                        break;
                    case "RUINED":
                        meatAmount = 1;
                        peltItem = "coyote_pelt_ruined"
                        break;
                }
                break;
            case GetHash("a_c_rabbit_01"):
                meatItem = "raw_mutton_meat";
                switch(animalData.state) {
                    case "PERFECT":
                        meatAmount = Random(1, 4);
                        if (animalData.lethal) {
                            peltItem = "rabbit_pelt_perfect";
                        } else {
                            peltItem = "rabbit_pelt_good";
                        }
                        break;
                    case "GOOD":
                        meatAmount = Random(1, 3);
                        peltItem = "rabbit_pelt_good"
                        break;
                    case "BAD":
                        meatAmount = Random(1, 2);
                        peltItem = "rabbit_pelt_bad"
                        break;
                    case "RUINED":
                        meatAmount = 1;
                        peltItem = "rabbit_pelt_ruined"
                        break;
                }
                break;
            case GetHash("a_c_cormorant"):
                meatItem = "raw_pidgeon_meat";
                switch(animalData.state) {
                    case "PERFECT":
                        meatAmount = Random(1, 4);
                        if (animalData.lethal) {
                            peltItem = "pidgeon_feathers_perfect";
                        } else {
                            peltItem = "pidgeon_feathers_good";
                        }
                        break;
                    case "GOOD":
                        meatAmount = Random(1, 3);
                        peltItem = "pidgeon_feathers_good"
                        break;
                    case "BAD":
                        meatAmount = Random(1, 2);
                        peltItem = "pidgeon_feathers_bad"
                        break;
                    case "RUINED":
                        meatAmount = 1;
                        peltItem = "pidgeon_feathers_ruined"
                        break;
                }
                break;
            case GetHash("a_c_chickenhawk"):
                meatItem = "raw_hawk_meat";
                switch(animalData.state) {
                    case "PERFECT":
                        meatAmount = Random(1, 4);
                        if (animalData.lethal) {
                            peltItem = "hawk_feathers_perfect";
                        } else {
                            peltItem = "hawk_feathers_good";
                        }
                        break;
                    case "GOOD":
                        meatAmount = Random(1, 3);
                        peltItem = "hawk_feathers_good"
                        break;
                    case "BAD":
                        meatAmount = Random(1, 2);
                        peltItem = "hawk_feathers_bad"
                        break;
                    case "RUINED":
                        meatAmount = 1;
                        peltItem = "hawk_feathers_ruined"
                        break;
                }
                break;
        }

        console.log(`${meatItem} | ${meatAmount} | ${peltItem}`)
        const player = this.QBCore.Functions.GetPlayer(source);
        if (player.Functions.AddItem(meatItem, meatAmount)) {
            TriggerClientEvent('inventory:client:ItemBox', source, this.QBCore.Shared.Items[meatItem], "add")
            if (player.Functions.AddItem(peltItem, 1)) {
                TriggerClientEvent('inventory:client:ItemBox', source, this.QBCore.Shared.Items[peltItem], "add")
                if (peltItem == "deer_pelt_perfect") {
                    player.Functions.AddItem("deer_horn", 1)
                }
                
                const entity = NetworkGetEntityFromNetworkId(animalData.netId);
                DeleteEntity(entity);
            }
        }
    }

    private async EVENT_PickupTent(tentData: Tent): Promise<void> {
        const player = await playerManager.GetPlayer(source);
        if (player) {
            const qbPlayer = this.QBCore.Functions.GetPlayer(player.handle)
            Inform("Tent Manager", `Picking up Tent (${JSON.stringify(tentData)})`);
            await campingManager.pickupTent(tentData.netId);
            qbPlayer.Functions.AddItem("hunting_tent", 1);
            await player.TriggerEvent('inventory:client:ItemBox', this.QBCore.Shared.Items["hunting_tent"], "add");
        }        
    }

    private async EVENT_DestroyFire(fireData: Campfire): Promise<void> {
        const player = await playerManager.GetPlayer(source);
        if (player) {
            const qbPlayer = this.QBCore.Functions.GetPlayer(player.handle)
            Inform("Campfire Manager", `Picking up Campfire (${JSON.stringify(fireData)})`);
            await campingManager.destroyFire(fireData.netId);
        }   
    }

    private async EVENT_CookMeat(itemData: Record<string, any>): Promise<void> {
        const player = await playerManager.GetPlayer(source);
        const hasItem = await this.HasItem(player, itemData.name);

        if (hasItem) {
            const itemArgs = itemData.name.split("_");
            const newItem = `cooked_${itemArgs[1]}_meat`;
            if (newItem) {
                const isItem = await this.isItem(newItem);
                if (isItem) {
                    await player.TriggerEvent("QBCore:Notify", `Cooking ${itemData.label}...`, "success", 3000);
                    await Delay(4500);
                    const qbPlayer = this.QBCore.Functions.GetPlayer(player.GetHandle)
                    if (qbPlayer.Functions.RemoveItem(itemData.name, 1)) {
                        TriggerClientEvent('inventory:client:ItemBox', player.GetHandle, this.QBCore.Shared.Items[itemData.name], "remove")
                        qbPlayer.Functions.AddItem(newItem, 1);
                        TriggerClientEvent('inventory:client:ItemBox', player.GetHandle, this.QBCore.Shared.Items[newItem], "add")
                    }
                }
            }
        } else {
            await player.TriggerEvent("QBCore:Notify", `You don't have any ${itemData.label}!`, "error", 2000);
        }
    }

    private async EVENT_BuyItem(itemData: Record<string, any>): Promise<void> {
        const player = await playerManager.GetPlayer(source);
        const qbPlayer = this.QBCore.Functions.GetPlayer(player.GetHandle);
        if (qbPlayer) {
            console.log(`Cash: ${qbPlayer.Functions.GetMoney("cash")} | Item Data: ${JSON.stringify(itemData)}`);
            if (qbPlayer.Functions.GetMoney("cash") >= itemData.price) {
                qbPlayer.Functions.RemoveMoney("cash", itemData.price, `You bought a (${itemData.label}).`)
                await player.TriggerEvent("QBCore:Notify", `You bought a ${itemData.label}`, "success", 3000);
                qbPlayer.Functions.AddItem(itemData.name, 1);
                TriggerClientEvent('inventory:client:ItemBox', player.GetHandle, this.QBCore.Shared.Items[itemData.name], "add")
            } else {
                await player.TriggerEvent("QBCore:Notify", "Insufficient Funds!", "error", 2000);
            }
        }
    }

    private async EVENT_SellItem(itemData: Record<string, any>): Promise<void> {
        const player = await playerManager.GetPlayer(source);
        const hasItem = await this.HasItem(player, itemData.name);

        if (hasItem) {
            const isItem = await this.isItem(itemData.name);
            if (isItem) {
                await player.TriggerEvent("QBCore:Notify", `Selling ${itemData.label}...`, "success", 3000);
                await Delay(4500);
                const qbPlayer = this.QBCore.Functions.GetPlayer(player.GetHandle)
                if (qbPlayer.Functions.RemoveItem(itemData.name, 1)) {
                    TriggerClientEvent('inventory:client:ItemBox', player.GetHandle, this.QBCore.Shared.Items[itemData.name], "remove")
                    qbPlayer.Functions.AddMoney("cash", itemData.price, `You sold (${itemData.label}) to a fence.`);
                }
            }
        } else {
            await player.TriggerEvent("QBCore:Notify", `You don't have any ${itemData.label}!`, "error", 2000);
        }
    }

    private RegisterItems(): void {
        this.config.items.rawMeats.forEach(rawMeat => {
            this.QBCore.Functions.CreateUseableItem(rawMeat, (source: number, item: Record<string, any>) => {
                const Player = this.QBCore.Functions.GetPlayer(source)
                if (Player.Functions.RemoveItem(item.name, 1, item.slot)) {
                    TriggerClientEvent("consumables:client:RawMeat", source, item.name)
                }
            });
        });

        this.QBCore.Functions.CreateUseableItem("hunting_tent", async(source: string, item: Record<string, any>) => {
            const player = await playerManager.GetPlayer(source);
            const pos = player.Position();
            const qbPlayer = this.QBCore.Functions.GetPlayer(source)
            if (qbPlayer.Functions.RemoveItem(item.name, 1, item.slot)) {
                await player.Ped();
                await player.TriggerEvent("QBCore:Notify", "Putting up tent...", "success", 2000);
                await Delay(500)
                FreezeEntityPosition(player.ped, true);
                await player.TriggerEvent(Events.progressBar, 5000, {player: true});
                await Delay(5000); // Wait until it's scrapped
                const tent = await campingManager.createTent(player, new Vector3(pos.x + 1, pos.y + 1, pos.z - 0.3), player.Heading());
                // const tent = await campingManager.createTent(player, new Vector3(pos.x + 1.0, pos.y + 1.0, pos.z), player.Heading());
                FreezeEntityPosition(player.ped, false);
                if (this.config.debug) Inform("Hunting Tent (Item)", `Created a tent at (${JSON.stringify(tent)})`);
            }
        });

        this.QBCore.Functions.CreateUseableItem("campfire_kit", async(source: string, item: Record<string, any>) => {
            const player = await playerManager.GetPlayer(source);
            const pos = player.Position();

            const qbPlayer = this.QBCore.Functions.GetPlayer(source)

            if (qbPlayer.Functions.RemoveItem(item.name, 1, item.slot)) {
                player.Ped();
                await player.TriggerEvent("QBCore:Notify", "Putting up campfire...", "success", 2000);
                FreezeEntityPosition(player.ped, true);

                await player.TriggerEvent(Events.progressBar, 5000, {player: true});

                await Delay(5000); // Wait until it's scrapped

                const fire = await campingManager.createFire(player, new Vector3(pos.x, pos.y + 1, pos.z - 0.3), player.Heading());
                FreezeEntityPosition(player.ped, false);
                if (this.config.debug) Inform("Campfire Kit (Item)", `Created a campfire at (${JSON.stringify(fire)})`);
            }
        });
    }

    private async HasItem(player: Player, itemName: string): Promise<boolean> {
        let hasItem = false;
        const qbPlayer = this.QBCore.Functions.GetPlayer(player.GetHandle);
        const inventory = qbPlayer.PlayerData.items;
        for (const item in inventory) {
            console.log(`${inventory[item].name} | ${itemName}`);
            if (inventory[item].name == itemName) {
                console.log("MATCH")
                hasItem = true;
                break;
            }
        }

        return hasItem;
    }

    private async isItem(itemName: string): Promise<boolean> {
        let isItem = false;
        const items = this.QBCore.Shared.Items

        for (const index in items) {
            if (items[index].name == itemName) {
                isItem = true;
                break;
            }
        }

        return isItem;
    }
}

export const server = new Server();
export const playerManager = new PlayerManager(server);
export const campingManager = new CampingManager(server);
