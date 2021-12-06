import { PedTypes } from "../enums/hunting/pedTypes";
import { AnimalTypes } from "../enums/hunting/animalTypes";
import { Blip, BlipColor, BlipSprite, Bone, Control, Game, InputMode, Model, Ped, Vector3, World } from "fivem-js";
import { Client } from "../client";
import { Delay, DisplayHelp, Dist, GetHash, Inform, Random } from "../utils";
import { Events } from "../../shared/enums/events";

export class AnimalManager {
  private client: Client;
  private nearbyAnimals: any[] = [];
  private fleeingAnimals: number[] = [];
  private deadAnimals: Ped[] = [];
  private spawnedAnimals: number = 0;

  private blipTick: number;
  private creatorTick: number;
  private huntTick: number;
  private huntInteractionTick: number;

  constructor(client: Client) {
    this.client = client;

    // Enable ped footsteps for tracking
    SetForcePedFootstepsTracks(true)

    // Events
    on(Events.gameEventTriggered, this.EVENT_GameEvents.bind(this));

    // Ticks
    this.blipTick = setTick(async() => { // Handle tracking nearby animals
      if (this.client.started) {
        const worldPeds = World.getAllPeds();
        worldPeds.forEach(async(worldPed) => {
          if (!worldPed.IsPlayer && !worldPed.IsHuman && GetPedType(worldPed.Handle) == PedTypes.Animal && !worldPed.isDead()) {
            if (Dist(worldPed.Position, Game.PlayerPed.Position, true) < 50.0) {
              if (!this.nearbyAnimals.includes(worldPed.Handle)) {
                const [isHuntingAnimal, animalData] = await this.isHuntingAnimal(worldPed);
                if (isHuntingAnimal) {
                  // Inform("Animal Tracking (Tick)", `Adding Animal (${worldPed.Handle}) | ${animalData.type}`);
                  if (!worldPed.AttachedBlip) {
                    const animalBlip = this.animalBlip(worldPed, animalData.type, false);
                    this.nearbyAnimals.push({
                      type: "world",
                      animalType: animalData.type,
                      handle: worldPed,
                      blip: animalBlip
                    });
                  }
                }
              }
            }
          }
        });
      }

      await Delay(1000);
    });

    this.creatorTick = setTick(async() => {
      if (this.client.started) {
        const myPed = Game.PlayerPed;
        const [success, data] = await this.inManualPoint(myPed);
        if (success) {
          if (this.spawnedAnimals < this.client.config.manual.animalLimit) {
            const randomSpawn = new Vector3(data.x, data.y, data.z);
            const randomX = (randomSpawn.x + Random(-this.client.config.manual.huntRadius + 30, this.client.config.manual.huntRadius - 30));
            const randomY = (randomSpawn.y + Random(-this.client.config.manual.huntRadius + 30, this.client.config.manual.huntRadius - 30));
            const randomZ = data.z + 999.9;
            const [onLand, posZ] = GetGroundZFor_3dCoord(randomX, randomY, randomZ, true);
            if (onLand) {
              console.log("found land location spawn animal!")
              const animalSpawn = new Vector3(randomX, randomY, posZ);
              const animalData = this.client.config.animals[Math.floor(Math.random() * this.client.config.animals.length)];
              console.log(`Creating a (${animalData.type})`)
              const spawnedAnimal = await World.createPed(new Model(animalData.model), animalSpawn, 0.0);
              SetBlockingOfNonTemporaryEvents(spawnedAnimal.Handle, false);
              this.spawnedAnimals++;
              TaskWanderStandard(spawnedAnimal.Handle, 0, 0);

              const animalBlip = this.animalBlip(spawnedAnimal, animalData.type, true);
              this.nearbyAnimals.push({
                type: "manual",
                handle: spawnedAnimal,
                animalType: animalData.type,
                blip: animalBlip
              });
            }
          }
        } else {
          this.nearbyAnimals.forEach((element, index) => {
            if (element.type == "manual") {
              element.handle.delete()
              element.blip.delete();
              this.nearbyAnimals.splice(index, 1);
            }
          })
        }
      }
      await Delay(100);
    });

    this.huntTick = setTick(async() => {
      const ped = Game.PlayerPed;
      let waitTimer = 500;
      let animalPos: Vector3;

      if (this.deadAnimals.length > 0) {
        this.deadAnimals.forEach(deadAnimal => {
          const dist = deadAnimal.Position.distance(ped.Position);
          if (dist < 3.0) {
            if (waitTimer > 0) {
              waitTimer = 0;
              animalPos = deadAnimal.Position;
            }

            if (this.huntInteractionTick == undefined) this.huntInteractionTick = setTick(() => {
              DisplayHelp("~INPUT_THROW_GRENADE~ Skin Animal")
              if (Game.isControlJustPressed(InputMode.MouseAndKeyboard, Control.ThrowGrenade)) {
                this.Harvest(deadAnimal);
              }
            });
          }
        })
      } else {
        clearTick(this.huntInteractionTick);
        this.huntInteractionTick = undefined;
      }

      if (animalPos !== undefined) {
        if (animalPos.distance(ped.Position) > 5) {
          if (waitTimer < 500) {
            waitTimer = 500;
            animalPos = undefined;
            clearTick(this.huntInteractionTick);
            this.huntInteractionTick = undefined;
          }
        }
      }

      await Delay(waitTimer);
    });
  }

  // Events
  private async EVENT_GameEvents(event: string, args: any[]): Promise<void> {
    if (event == "CEventNetworkEntityDamage") {
      const victim = new Ped(args[0])
      const attacker = new Ped(args[1])
      const isFatal = args[3]
      const weaponHash = args[4]
      const isMelee = args[9]

      if (victim.exists() && attacker.exists()) { // Check if both the attacker and victim exist in our world
        if (victim.Handle != attacker.Handle) { // Check we didn't injure ourselves
          if (GetPedType(victim.Handle) == PedTypes.Animal) {
            const [damaged, boneId] = GetPedLastDamageBone(victim.Handle);
            if (this.client.config.debug) Inform("Entity Damage", `Victim: ${victim.Handle} | Attacker: ${attacker.Handle} | Fatal: ${isFatal.toString()} | Weap Hash: ${weaponHash} | Melee: ${isMelee.toString()} | Is Player: ${IsPedAPlayer(victim.Handle)}`);
            if (this.client.config.debug) Inform("Entity Damage", `damage data - ${damaged} | ${boneId}`);

            if (isFatal) {
              const animalIndex = this.nearbyAnimals.findIndex(animal => animal.handle.Handle == victim.Handle);
              if (animalIndex != -1) {
                // console.log(`Nearby Animals B4 - ${this.nearbyAnimals.length}`);
                // console.log(`Dead Animals B4 - ${this.deadAnimals.length}`);
                // console.log(`Killed Animal: ${JSON.stringify(this.nearbyAnimals[animalIndex])}`);
                this.nearbyAnimals[animalIndex].blip.Sprite = BlipSprite.Dead;
                this.deadAnimals.push(this.nearbyAnimals[animalIndex].handle)
                this.nearbyAnimals.splice(animalIndex, 1);
                // console.log(`Nearby Animals After - ${this.nearbyAnimals.length}`);
                // console.log(`Dead Animals After - ${this.deadAnimals.length}`);
              }
            }
          }
        }
      }
    }
  }

  // Methods
  private async isHuntingAnimal(ped: Ped): Promise<[boolean, any]> {
    for (let i = 0; i < this.client.config.animals.length; i++) {
      if (GetHash(this.client.config.animals[i].model) == ped.Model.Hash) {
        return [true, this.client.config.animals[i]];
      }
    }

    return [false, null]
  }

  private animalBlip(ped: Ped, type: AnimalTypes, debug: boolean): Blip {
    const blip: Blip = ped.attachBlip();
    switch (type) {
      case AnimalTypes.Deer:
        blip.Sprite = BlipSprite.Hunting; // Deer Head
        blip.Color = 31; // Light Brown
        debug ? blip.Name = "Deer (Manual)" : blip.Name = "Deer";
        break;
      case AnimalTypes.Boar:
        blip.Sprite = 433; // Target
        blip.Color = BlipColor.Red;
        debug ? blip.Name = "Boar (Manual)" : blip.Name = "Boar";
        break;
      case AnimalTypes.MountainLion:
        blip.Sprite = 433; // Target
        blip.Color = BlipColor.Red;
        debug ? blip.Name = "Lion (Manual)" : blip.Name = "Lion";
        break;
      case AnimalTypes.Coyote:
        blip.Sprite = 463; // Coyote Head
        blip.Color = 39; // Light Gray
        debug ? blip.Name = "Coyote (Manual)" : blip.Name = "Coyote";
        break;
      case AnimalTypes.Rabbit:
        blip.Sprite = 433; // Target
        blip.Color = BlipColor.Red;
        debug ? blip.Name = "Rabbit (Manual)" : blip.Name = "Rabbit";
        break;
      case AnimalTypes.Pidgeon:
        blip.Sprite = 433; // Target
        blip.Color = BlipColor.Red;
        debug ? blip.Name = "Pidgeon (Manual)" : blip.Name = "Pidgeon";
        break;
        case AnimalTypes.Hawk:
          blip.Sprite = 433; // Target
          blip.Color = BlipColor.Red;
          debug ? blip.Name = "Hawk (Manual)" : blip.Name = "Hawk";
          break;
    }

    return blip;
  }

  private async inManualPoint(ped: Ped): Promise<[boolean, any]> {
    const huntingPoints = this.client.config.manual.huntingPoints;
    for (let i = 0; i < Object.keys(huntingPoints).length; i++) {
      if (Dist(ped.Position, new Vector3(huntingPoints[i].x, huntingPoints[i].y, huntingPoints[i].z), false) < this.client.config.manual.huntRadius) {
        return [true, huntingPoints[i]];
      }
    }

    return [false, null];
  }

  private async Harvest(ped: Ped): Promise<void> {
    if (HasPedGotWeapon(Game.PlayerPed.Handle, GetHash("WEAPON_KNIFE"), false) && GetSelectedPedWeapon(Game.PlayerPed.Handle) == GetHash("WEAPON_KNIFE")) {
      const [destroyedAnimal, meatState] = await this.getCauseOfDeath(ped);
      if (destroyedAnimal) {
        this.client.QBCore.Functions.Notify("The animal is too damaged to harvest anything", "error", "3000");
        return;
      } else {
        let lethalShot = false;
        const [boneData, damagedBone] = GetPedLastDamageBone(ped.Handle);
        if (damagedBone == Bone.SKEL_Head) {
          lethalShot = true;
        }

        const index = this.deadAnimals.findIndex(animal => animal.NetworkId == ped.NetworkId);
        if (index != -1) {
          this.deadAnimals.splice(index, 1);
          TaskTurnPedToFaceEntity(Game.PlayerPed.Handle, ped.Handle, -1);
          await Delay(1000);
          TaskStartScenarioInPlace(Game.PlayerPed.Handle, "CODE_HUMAN_MEDIC_TEND_TO_DEAD", -1, true);
          this.client.QBCore.Functions.Progressbar("harvest_animal", lethalShot ? "Harvesting Meat & Pelt..." : "Harvesting Meat...", 13000, false, true, {
            disableMovement: true,
            disableCarMovement: true,
            disableMouse: false,
            disableCombat: true,
          }, {}, {}, {}, async() => { // Done
            ClearPedTasks(Game.PlayerPed.Handle)
            await Delay(1000);
            const data = {
              state: meatState,
              lethal: lethalShot,
              model: ped.Model,
              netId: ped.NetworkId
            }
            emitNet(Events.harvestAnimal, data);
          }, () => { // Cancel
            ClearPedTasks(Game.PlayerPed.Handle);
            this.client.QBCore.Functions.Notify("Canceled", "error")
          });
        } else {
          this.client.QBCore.Functions.Notify("There was an issue harvesting the animal, report this to the developers", "error", 3000);
        }
      }
    } else {
      this.client.QBCore.Functions.Notify("You need a knife!", "error", "3000");
    }
  }

  private async getCauseOfDeath(ped: Ped): Promise<[boolean, string]> {
    let isExtreme = false;
    let foundCaliber = false;
    let state: string;
    const deathCause = GetPedCauseOfDeath(ped.Handle);

    if (deathCause == GetHash("WEAPON_RUN_OVER_BY_CAR") || deathCause == GetHash("WEAPON_RAMMED_BY_CAR") || HasEntityBeenDamagedByAnyVehicle(ped.Handle)) {
      isExtreme = true;
      state = "RUINED"
      foundCaliber = true;
    }

    const calibers = this.client.config.caliberResults;
    for (let i = 0; i < calibers.perfect; i++) {
      if (deathCause == GetHash(calibers.perfect[i])) {
        state = "PERFECT";
        foundCaliber = true;
        break;
      }
    }

    for (let i = 0; i < calibers.good; i++) {
      if (deathCause == GetHash(calibers.good[i])) {
        state = "GOOD";
        foundCaliber = true;
        break;
      }
    }

    for (let i = 0; i < calibers.bad; i++) {
      if (deathCause == GetHash(calibers.bad[i])) {
        state = "BAD";
        foundCaliber = true;
        break;
      }
    }

    if (!foundCaliber) {
      const weaponGroup = GetWeapontypeGroup(deathCause);
      if (weaponGroup == GetHash("GROUP_SNIPER")) {
        state = "PERFECT";
      } else if (weaponGroup == GetHash("GROUP_PISTOL") || weaponGroup == GetHash("GROUP_SMG") || weaponGroup == GetHash("GROUP_UNARMED") || weaponGroup == GetHash("GROUP_MELEE")) {
        state = "GOOD";
      } else if (weaponGroup == GetHash("GROUP_MG") || weaponGroup == GetHash("GROUP_SHOTGUN") || weaponGroup == GetHash("GROUP_RIFLE")) {
        state = "BAD";
      } else {
        state = "RUINED";
      }
    }

    return [isExtreme, state]
  } 
}