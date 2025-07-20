import eventListener, { type Unsubscribe } from "./event-listener";
import {
  pointermove,
  pointerdown,
  keydown,
  wheel,
  visibilitychange,
  type ActivityTriggers,
} from "./activity-triggers";

const defaultActivityTriggers: ActivityTriggers = [
  pointermove,
  pointerdown,
  keydown,
  wheel,
  visibilitychange,
];

type Options = {
  inactivityTimespan: number;
  activityTriggers?: ActivityTriggers;
};

export default (options: Options) => {
  const inactivityTimespan = options.inactivityTimespan;
  const listener = eventListener();

  let latestActivityTimestamp: number;
  let isActive = false;
  let timeoutId: number | undefined;

  const checkIsActive = () => {
    const isNowActive =
      latestActivityTimestamp + inactivityTimespan > Date.now();
    if (isNowActive !== isActive) {
      isActive = isNowActive;
      listener.notify();
    }
  };

  const notifyActivity = () => {
    latestActivityTimestamp = Date.now();
    checkIsActive();

    clearTimeout(timeoutId);
    timeoutId = setTimeout(checkIsActive, inactivityTimespan);
  };

  const unsubsribers = new Set<Unsubscribe>();
  for (const trigger of options.activityTriggers ?? defaultActivityTriggers) {
    unsubsribers.add(trigger(notifyActivity));
  }

  return Object.freeze({
    notifyActivity,
    isActive: () => isActive,
    subscribe: listener.subscribe,
    dispose: () => {
      for (const unsubsribe of unsubsribers) {
        unsubsribe();
      }
    },
  });
};
