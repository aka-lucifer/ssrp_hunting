import { Blip, BlipSprite, Color, Control, Game, InputMode, MarkerType, Vector3, World } from "fivem-js";
import {Delay, DisplayHelp } from "../utils";
import { Client } from "../client";
import { Menu } from "../models/ui/menu";
import { Submenu } from "../models/ui/submenu";
import serverConfig from "../../configs/server.json";
import { Events } from "../../shared/enums/events";

export class FenceManager {
  private client: Client;

  // Fence Data
  private location: Vector3;
  private mainMenu: Menu;
  private itemMenu: Submenu;
  private sellMenu: Submenu;
  private animalMeatMenu: Submenu;
  private animalItemMenu: Submenu;
  private zoneBlips: Blip[] = [];

  // Tick Data
  private fenceTick: number;
  private interactionTick: number;
  private waitTimer: number = 500;

  constructor(client: Client) {
    this.client = client;
    this.location = new Vector3(this.client.config.fence.position.x, this.client.config.fence.position.y, this.client.config.fence.position.z);

    // Menu
    this.mainMenu = new Menu("Fence", GetCurrentResourceName(), this.client.config.fence.menuPosition);
    this.itemMenu = new Submenu("Hunting Items", this.mainMenu.resource, this.mainMenu.handle, this.mainMenu.position);
    this.sellMenu = new Submenu("Selling", this.mainMenu.resource, this.mainMenu.handle, this.mainMenu.position);
    this.animalMeatMenu = new Submenu("Meats", this.mainMenu.resource, this.sellMenu.handle, this.mainMenu.position);
    this.animalItemMenu = new Submenu("Items", this.mainMenu.resource, this.sellMenu.handle, this.mainMenu.position);

    serverConfig.items.buying.forEach(meatData => {
      this.itemMenu.BindButton(meatData.label, () => {
        emitNet(Events.buyItem, meatData);
      });
    })

    serverConfig.items.selling.meats.forEach(meatData => {
      this.animalMeatMenu.BindButton(meatData.label, () => {
        emitNet(Events.sellItem, meatData);
      });
    })

    serverConfig.items.selling.items.forEach(meatData => {
      this.animalItemMenu.BindButton(meatData.label, () => {
        emitNet(Events.sellItem, meatData);
      });
    })

    // Fence Blip
    const handle = AddBlipForCoord(this.location.x, this.location.y, this.location.z);
    const fenceBlip = new Blip(handle);
    fenceBlip.Sprite = BlipSprite.Franklin;
    fenceBlip.Color = 31; // Brown
    fenceBlip.Name = "Fence";
    fenceBlip.Scale = 0.7;
    fenceBlip.IsShortRange = true;

    // Fence Marker & Interaction
    if (this.fenceTick == undefined) this.fenceTick = setTick(async() => {
      const ped = Game.PlayerPed;

      if (!ped.isInAnyVehicle()) {
        let dist = this.location.distance(ped.Position);

        if (dist < 10.0) {
          if (this.waitTimer > 0) {
            this.waitTimer = 0;
          }
          
          if (this.interactionTick == undefined) this.interactionTick = setTick(async () => {
            const menuOpen = await this.mainMenu.manager.IsAnyMenuOpen();
            if (!menuOpen) {
              dist = this.location.distance(ped.Position);
              World.drawMarker(MarkerType.WolfHead, this.location, new Vector3(0.0, 0.0, 0.0), new Vector3(0.0, 0.0, 0.0), new Vector3(1.0, 1.0, 1.0), new Color(255, 92, 39, 4), true, true, false);

              if (dist < 2.0) {
                DisplayHelp(!this.client.started ? "~INPUT_CONTEXT~ To Interact\n~INPUT_DETONATE~ Start Hunting" : "~INPUT_CONTEXT~ To Interact\n~INPUT_DETONATE~ Stop Hunting");

                if (Game.isControlJustPressed(InputMode.MouseAndKeyboard, Control.Context)) {
                  await this.mainMenu.Open();
                }

                if (Game.isControlJustPressed(InputMode.MouseAndKeyboard, Control.Detonate)) {
                  this.client.started = !this.client.started;
                  if (this.client.started) {
                    // Hunting Zone Creation
                    this.client.config.manual.huntingPoints.forEach(zone => {
                      const blip1 = AddBlipForCoord(zone.x, zone.y, zone.z);
                      const radarBlip = new Blip(blip1);
                      radarBlip.Sprite = BlipSprite.SonicWave;
                      radarBlip.Color = 27;
                      radarBlip.IsShortRange = false;

                      const blip2 = AddBlipForCoord(zone.x, zone.y, zone.z);
                      const zoneBlip = new Blip(blip2);
                      zoneBlip.Sprite = 442;
                      zoneBlip.Color = 27;
                      zoneBlip.Name = "Hunting Zone";
                      zoneBlip.Scale = 0.8;
                      zoneBlip.IsShortRange = false;

                      this.zoneBlips.push(radarBlip);
                      this.zoneBlips.push(zoneBlip);
                    })

                    this.client.QBCore.Functions.Notify("You've started hunting", "success", 3000);
                  } else {
                    this.client.QBCore.Functions.Notify("You've stopped hunting", "error", 3000);
                  }
                }
              }
            }
          })
        } else if (dist > 15) {
          if (this.waitTimer < 500) {
            this.waitTimer = 500;
          }

          if (this.interactionTick != undefined) {
            clearTick(this.interactionTick);
          }
        }
      }

      await Delay(this.waitTimer)
    });
  }
}