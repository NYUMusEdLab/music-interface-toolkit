// import { immediate, Clock } from 'tone';

// const PPQ = 96;

export interface TimelineEvent {
  time: number;
  duration?: number;
}

export class Timeline {
  private _activeEvents: Map<TimelineEvent, () => any>;

  constructor(
    eventList: TimelineEvent[],
    fn: (event: TimelineEvent) => (() => any) | undefined
  ) {
    this._activeEvents = new Map();

    // this._clock = new Clock((tickTime, ticks) => {
    //   if (ticks >= duration * PPQ) {
    //     for (let [activeEvent, activeCallback] of this._activeEvents) {
    //       activeCallback(tickTime);
    //       this._activeEvents.delete(activeEvent);
    //     }

    //     this._clock.setTicksAtTime(0, tickTime);
    //     ticks = 0;
    //     this._timelineIndex = 0;
    //   }

    //   while (
    //     this._timelineIndex < this._sortedTimeline.length &&
    //     this._sortedTimeline[this._timelineIndex].start <= ticks
    //   ) {
    //     let activeEvent = this._sortedTimeline[this._timelineIndex];
    //     this._activeEvents.set(activeEvent, synth(tickTime, activeEvent.data));
    //     this._timelineIndex += 1;
    //   }

    //   let remainingEvents = [];

    //   for (let [activeEvent, activeCallback] of this._activeEvents) {
    //     if (activeEvent.end <= ticks) {
    //       activeCallback(tickTime);
    //       this._activeEvents.delete(activeEvent);
    //     }
    //   }

    //   this._currentEvents = remainingEvents;
    // });

    // this.tempo = 120;

    // if (sequence) {
    //   this.timeline = sequence;
    // }
  }

  replaceEventList(eventList: TimelineEvent[], merge = true) {}

  get timeline() {
    return this._timeline;
  }

  set timeline({ timeline }) {
    this._timeline = timeline;
    this._sortedTimeline = getSortedTimeline(timeline);
  }

  get tempo() {}

  set tempo(tempo) {
    this._clock.frequency.value = 1 / (60 / tempo / PPQ);
  }

  start() {
    this._clock.start(immediate());
  }

  stop() {
    this._clock.stop(immediate());
    for (let [activeEvent, activeCallback] of this._activeEvents) {
      activeCallback(immediate());
      this._activeEvents.delete(activeEvent);
    }
    this._timelineIndex = 0;
  }
}

function getSortedTimeline(timeline) {
  let sortedTimeline = [];

  for (let i = 0; i < timeline.length; ++i) {
    let eventData = timeline[i];
    let eventTiming = {
      start: Math.round(eventData.time * PPQ),
      end: Math.round((eventData.time + eventData.duration) * PPQ),
      index: i,
      data: eventData,
    };

    sortedTimeline.push(eventTiming);
  }

  sortedTimeline.sort((a, b) => {
    if (a.start !== b.start) {
      return a.start - b.start;
    } else if (a.end !== b.end) {
      return a.end - b.end;
    } else {
      return a.index - b.index;
    }
  });

  return sortedTimeline;
}
