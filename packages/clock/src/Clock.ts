type ClockAction = (time: number) => void;

interface ClockEvent {
  id: number;
  time: number;
  duration: number;
  callback: ClockAction;
  phase: 'start' | 'end';
}

export class Clock {
  private nextId = 0;

  private events: ClockEvent[] = [];
  private activeEvents = new Map<number, ClockEvent>();

  constructor() {}

  /**
   *
   * @param callback
   * @param time
   * @param duration
   *
   * @returns A numeric id used to cancel or reschedule the event
   */
  schedule(
    callback: (startTime: number) => ((endTime: number) => void) | void,
    time: number,
    duration = 0
  ) {
    const id = this.nextId;
    this.nextId += 1;

    return id;
  }

  /**
   *
   * @param id
   * @param time
   * @param duration
   */
  reschedule(id: number, time: number, duration = 0) {}

  /**
   *
   * @param id
   */
  cancel(id: number) {}

  /**
   *
   */
  dispose() {}

  protected tick(time: number) {}
}
