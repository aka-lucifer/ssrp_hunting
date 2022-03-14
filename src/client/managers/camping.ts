import { Tick } from "../models/utils/tick";
import { Campfire } from "../models/camping/campfire";
import { Tent } from "../models/camping/tent";
import { Progress } from "../models/ui/progress";
import { Menu } from "../models/ui/menu";
import { Events } from "../../shared/enums/events";
import { Client } from "../client";
import { Delay, DisplayHelp, Dist, GetHash, Inform, LoadAnim, NumToVector3, PlayAnim } from "../utils";
import { Bone, Control, EntityBone, Game, InputMode, Model, Prop, Vector3, World } from "fivem-js";

export class CampingManager {
  // Core Data
  private client: Client;
  public createdTents: Tent[] = [];
  public createdFires: Campfire[] = [];

  // Tent Data
  private tentTick: number;
  private tentInteractionTick: number;
  private tentHiding: boolean = false;

  // Campfire Data
  private fireTick: number;
  private fireInteractionTick: number;
  private cookingMenu: Menu;
  private chair: Prop;
  private chairState: string = "NONE";
  private invItems: any[] = [];

  // Constructor
  constructor(client: Client) {
    this.client = client;

    // Events
    onNet(Events.syncCampingData, this.Sync.bind(this));
    onNet(Events.startCampManager, this.Process.bind(this));

    // Menu Creating
    this.cookingMenu = new Menu("Campfire Cooking", GetCurrentResourceName(), this.client.config.campfire.menuPosition);
    this.client.config.campfire.cookItems.forEach(item => {
      this.cookingMenu.BindButton(item.label, async() => {
        emitNet(Events.cookMeat, item);
      })
    })
  }

  // Events
  private Sync(tents: Tent[], fires: Campfire[]): void {
    this.createdTents = tents;
    this.createdFires = fires;
    Inform("Camping Manager (Client)", `Recieved new camping data (${JSON.stringify(this.createdTents)} | ${JSON.stringify(this.createdFires)})`)
    this.Process();
  }

  private async Process(): Promise<void> {
    let waitTimer = 500;
    let tentPos;
    let firePos;

    if (this.tentTick == undefined) this.tentTick = setTick(async () => {
      const ped = Game.PlayerPed;
      if (this.createdTents.length > 0) {
        this.createdTents.forEach(tentData => {
          if (GetDistanceBetweenCoords(tentData.position.x, tentData.position.y, tentData.position.z, ped.Position.x, ped.Position.y, ped.Position.z, false) <= 2.5) {
            if (waitTimer > 0) {
              waitTimer = 5
              tentPos = new Vector3(tentData.position.x, tentData.position.y, tentData.position.z);
            }

            if (this.tentInteractionTick == undefined) this.tentInteractionTick = setTick(async() => {
              DisplayHelp(!this.tentHiding ? "~INPUT_CONTEXT~ Hide\n~INPUT_DETONATE~ Rest\n~INPUT_ENTER~ Pickup" : "~INPUT_CONTEXT~ Exit\n~INPUT_DETONATE~ Rest\n~INPUT_ENTER~ Pickup");

              if (Game.isControlJustPressed(InputMode.MouseAndKeyboard, Control.Context) || Game.isDisabledControlJustPressed(InputMode.MouseAndKeyboard, Control.Context)) {
                if (!this.tentHiding) {NetworkFadeOutEntity(Game.PlayerPed.Handle, false, true);
                  this.client.QBCore.Functions.Notify("You started hiding", "success", 3000);
                  ForcePedMotionState(Game.PlayerPed.Handle, 1110276645, false, false, false);
                  // FreezeEntityPosition(Game.PlayerPed.Handle, true);
                } else {
                  NetworkFadeInEntity(Game.PlayerPed.Handle, true);
                  ForcePedMotionState(Game.PlayerPed.Handle, 247561816, true, true, false);
                  this.client.QBCore.Functions.Notify("You're stopped hiding", "success", 3000);
                  // FreezeEntityPosition(Game.PlayerPed.Handle, false);
                }

                this.tentHiding = !this.tentHiding;
              }
              
              if (Game.isControlJustPressed(InputMode.MouseAndKeyboard, Control.Detonate)) {
                const progress = new Progress({
                  duration: 5000,
                  disabler: {
                    player: true
                  },
            
                  onStart: () => {
                    NetworkFadeOutEntity(Game.PlayerPed.Handle, false, true);
                    this.client.QBCore.Functions.Notify("You started resting", "success", 2000);
                  },
            
                  onComplete: () => {
                    emit("hud:client:UpdateStress", 0);
                    Game.PlayerPed.Health = Game.PlayerPed.MaxHealth;
                    NetworkFadeInEntity(Game.PlayerPed.Handle, true);
                    this.client.QBCore.Functions.Notify("You're completely rested", "success", 3000);
                  }
                });
              }

              if (Game.isControlJustPressed(InputMode.MouseAndKeyboard, Control.Enter)) {
                emitNet(Events.pickupTent, tentData);

                while (this.tentInteractionTick != undefined) {
                  clearTick(this.tentInteractionTick);
                  this.tentInteractionTick = undefined;
                  await Delay(0);
                }
              }
            });
          }
        })
      }

      if (tentPos != undefined) {
        if (tentPos.distance(ped.Position) > 5) {
          if (waitTimer < 500) {
            clearTick(this.tentInteractionTick);
            this.tentInteractionTick = undefined;
            waitTimer = 500;
            tentPos = undefined;
          }
        }
      }

      await Delay(waitTimer)
    });

    if (this.fireTick == undefined) this.fireTick = setTick(async() => {
      const ped = Game.PlayerPed;
      if (this.createdFires.length > 0) {
        this.createdFires.forEach(async(fireData) => {
          if (GetDistanceBetweenCoords(fireData.position.x, fireData.position.y, fireData.position.z, ped.Position.x, ped.Position.y, ped.Position.z, false) <= 8.0) {
            if (waitTimer > 0) {
              waitTimer = 5
              firePos = new Vector3(fireData.position.x, fireData.position.y, fireData.position.z);
            }

            if (this.fireInteractionTick == undefined) this.fireInteractionTick = setTick(async() => {
              DisplayHelp(this.chairState == "NONE" ? "~INPUT_CONTEXT~ Pull Out Chair\n~INPUT_DETONATE~ Cook Meat\n~INPUT_ENTER~ Tear Down" : "~INPUT_CONTEXT~ Put Away Chair\n~INPUT_DETONATE~ Cook Meat\n~INPUT_ENTER~ Tear Down");

              if (Game.isControlJustPressed(InputMode.MouseAndKeyboard, Control.Context)) {
                if (this.chair == undefined) {
                  const myHeading = Game.PlayerPed.Heading;
                  this.chairState = "CREATING";
                  this.client.QBCore.Functions.Notify("Pulling out a chair", "success", 3000);

                  await Delay(4500);

                  // console.log(`Heading: ${this.chair.Heading}`);
                  const loadedAnim = await LoadAnim("timetable@ron@ig_3_couch");
                  if (loadedAnim) {
                    this.chair = await World.createProp(new Model(this.client.config.campfire.chairModel), new Vector3(1.0, 1.0, 1.0), false, true);
                    AttachEntityToEntity(this.chair.Handle, Game.PlayerPed.Handle, GetPedBoneIndex(Game.PlayerPed.Handle, 0), 0, 0.0, -0.22, 3.4, 0.4, 180.0, false, false, false, false, 2, true);
                    this.chair.markAsNoLongerNeeded();
                    this.chairState = "CREATED";
                    const animLength = GetAnimDuration("timetable@ron@ig_3_couch", "base");
                    PlayAnim(Game.PlayerPed, "timetable@ron@ig_3_couch", "base", 1, animLength, 1.0, 4.0, 0, false, false, false);
                  }
                } else {
                  this.chair.delete();
                  this.chairState = "NONE";
                  this.chair = undefined;
                  ClearPedTasks(Game.PlayerPed.Handle);
                }
              }

              if (Game.isControlJustPressed(InputMode.MouseAndKeyboard, Control.Detonate)) {
                await this.cookingMenu.Open();
              }

              if (Game.isControlJustPressed(InputMode.MouseAndKeyboard, Control.Enter)) {
                emitNet(Events.destroyFire, fireData);

                while (this.fireInteractionTick != undefined) {
                  clearTick(this.fireInteractionTick);
                  this.fireInteractionTick = undefined;
                  await Delay(0);
                }
              }
            });
          }
        })
      }

      if (firePos != undefined) {
        if (firePos.distance(ped.Position) > 5) {
          if (waitTimer < 500) {
            waitTimer = 500;
            firePos = undefined;
            clearTick(this.fireTick);
            this.fireTick = undefined;
          }
        }
      }

      await Delay(waitTimer)
    });
  }
}
