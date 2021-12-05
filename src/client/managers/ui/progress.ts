import { Progress } from "../../models/ui/progress";
import { Events } from "../../../shared/enums/events";
import { Client } from "../../client";

export class ProgressManager {
  private client: Client;

  constructor (client: Client) {
    this.client = client;

    // Events
    onNet(Events.progressBar, (duration: number, disablers: Record<string, any>, start: CallableFunction, finish: CallableFunction) => {
      console.log(`Recieved Progress Bar - Duration: ${duration} | Disablers: ${JSON.stringify(disablers)}`);
      const progress = new Progress({
        duration: duration,
        disabler: disablers,
        onStart: start,
        onComplete: finish
      })
    });
  }
}