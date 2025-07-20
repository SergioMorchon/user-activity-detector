import type { Listener, Unsubscribe } from "./event-listener";

type NotifyActivity = () => void;

export type ActivityTrigger = (notifyActivity: NotifyActivity) => Unsubscribe;
export type ActivityTriggers = ReadonlyArray<ActivityTrigger>;

const createWindowEventTrigger =
  (eventName: keyof WindowEventMap): ActivityTrigger =>
  (notifyActivity) => {
    window.addEventListener(eventName, notifyActivity);

    return () => {
      window.removeEventListener(eventName, notifyActivity);
    };
  };

export const pointermove = createWindowEventTrigger("pointermove");
export const pointerdown = createWindowEventTrigger("pointerdown");
export const wheel = createWindowEventTrigger("wheel");
export const keydown = createWindowEventTrigger("keydown");
export const visibilitychange: ActivityTrigger = (notifyActivity) => {
  const handler = () => {
    if (document.visibilityState === "visible") {
      notifyActivity();
    }
  };

  document.addEventListener("visibilitychange", handler);

  return () => {
    document.removeEventListener("visibilitychange", handler);
  };
};
