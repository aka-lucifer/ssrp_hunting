import * as Utils from "../../utils";
import { Control } from "fivem-js";
import Config from "../../../configs/client.json";

export class Progress {
  private configuration: Record<string, any>;
  private onStart: CallableFunction;
  private onComplete: CallableFunction;
  private running: boolean;
  private disablerTick: number = -1;

  constructor(progressOptions: Record<string, any>, staticBar: boolean = false) {
    this.configuration = progressOptions;
    this.configuration.radius = Config.progressConfig.radius;
    this.configuration.stroke = Config.progressConfig.stroke;
    this.configuration.x = Config.progressConfig.x;
    this.configuration.y = Config.progressConfig.y;
    this.configuration.colour = Config.progressConfig.colour;
    this.configuration.backgroundColour = Config.progressConfig.backgroundColour;
    this.configuration.rotation = Config.progressConfig.rotation;
    this.configuration.maxAngle = Config.progressConfig.maxAngle;
    this.configuration.from = Config.progressConfig.startPercentage;
    this.configuration.to = Config.progressConfig.stopPercentage;
    this.configuration.useTime = Config.progressConfig.useTime;
    this.configuration.usePercent = Config.progressConfig.usePercent;
    this.configuration.display = true;
    
    this.onStart = progressOptions.onStart;
    this.onComplete = progressOptions.onComplete;
    
    SendNuiMessage(JSON.stringify({
      type: "create_progress",
      data: this.configuration
    }));

    this.running = true;

    if (this.configuration.disabler) {
      this.disablerTick = setTick(() => {
        if (this.running) {
          if (this.configuration.disabler.mouse) {
            DisableControlAction(1, Control.LookLeftRight, true);
            DisableControlAction(1, Control.LookUpDown, true);
            DisableControlAction(1, Control.VehicleMouseControlOverride, true);
          } else if (this.configuration.disabler.player) {
            DisableControlAction(0, Control.Sprint, true);
            DisableControlAction(0, Control.MoveLeftRight, true);
            DisableControlAction(0, Control.MoveUpDown, true);
            DisableControlAction(0, Control.Duck, true);
          } else if (this.configuration.disabler.vehicle) {
            DisableControlAction(0, Control.VehicleAccelerate, true);
            DisableControlAction(0, Control.VehicleBrake, true);
            DisableControlAction(0, Control.VehicleExit, true);
          }
        } else {
          clearTick(this.disablerTick);
        }
      })
    }

    // NUI Callbacks
    Utils.RegisterNuiCallback("progress_start", (data, cb) => {
      if (this.onStart) {
        console.log("start progress!");
        this.onStart();
      }
    });

    Utils.RegisterNuiCallback("progress_complete", (data, cb) => {
      this.running = false;
      if (this.onComplete) {
        console.log("finish progress!");
        this.onComplete();
      }
    });

    Utils.RegisterNuiCallback("progress_stop", (data, cb) => {
      this.running = false;
    });
  }

  // Methods
  public Stop(): void {
    SendNuiMessage(JSON.stringify({stop: true}));
    this.running = false;
  }
}