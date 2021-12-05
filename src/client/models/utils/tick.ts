import { TickState } from "../../enums/tickState";

export class Tick {
  private handle: number;
  private function: CallableFunction;
  public delay: number;
  private state: TickState;

  constructor(tickFunction: CallableFunction, delayTimer: number) {
    this.function = tickFunction;
    this.delay = delayTimer;
    this.handle = setTick(this.function);
    this.state = TickState.Started;
  }

  // Methods
  public Pause(): void {
    if (this.state == TickState.Started) {
      clearTick(this.handle);
      this.state = TickState.Paused;
    }
  }
  
  public Resume(): void {
    if (this.state == TickState.Paused) {
      this.handle = setTick(this.function);
      this.state = TickState.Started;
    }
  }

  public Stop(): void {
    if (this.state == TickState.Paused || this.state == TickState.Started) {
      clearTick(this.handle)
      this.state = TickState.Stopped;
    }
  }
}