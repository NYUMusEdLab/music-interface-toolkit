import { Clock } from './Clock';

export class AnimationClock extends Clock {
  private animationFrame: number | null;

  constructor() {
    super();

    this.animationFrame = requestAnimationFrame(this.tick.bind(this));
  }

  dispose() {
    super.dispose();

    if (this.animationFrame !== null) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }
  }

  tick(time: number) {
    super.tick(time);
    this.animationFrame = requestAnimationFrame(this.tick.bind(this));
  }
}
