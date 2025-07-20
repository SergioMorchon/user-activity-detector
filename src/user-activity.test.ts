import { ActivityTrigger } from "./activity-triggers";
import userActivity from "./user-activity";
import { beforeEach, expect, test, vi } from "vitest";

beforeEach(() => {
  const now = 0;
  vi.useFakeTimers({
    now,
  });
});

const inactivityTimespan = 1;

test("default activity status", () => {
  expect(userActivity({ inactivityTimespan }).isActive()).toBe(false);
});

test("notify activity marks as active", () => {
  const activity = userActivity({ inactivityTimespan });
  const onChange = vi.fn();
  activity.subscribe(onChange);

  activity.notifyActivity();

  expect(onChange).toHaveBeenCalledOnce();
  expect(activity.isActive()).toBe(true);
});

test.each(["pointermove", "pointerdown", "wheel", "keydown"])(
  "default activity trigger window $0",
  (eventName) => {
    const activity = userActivity({ inactivityTimespan });
    const onChange = vi.fn();
    activity.subscribe(onChange);

    window.dispatchEvent(new Event(eventName));

    expect(onChange).toHaveBeenCalledOnce();
    expect(activity.isActive()).toBe(true);
  },
);

test("default activity trigger document visibility", () => {
  const activity = userActivity({ inactivityTimespan });
  const onChange = vi.fn();
  activity.subscribe(onChange);

  Object.defineProperty(document, "visibilityState", {
    value: "visible",
  });

  document.dispatchEvent(new Event("visibilitychange"));

  expect(onChange).toHaveBeenCalledOnce();
  expect(activity.isActive()).toBe(true);
});

test("custom activity trigger", () => {
  let notifyActivityReference: (() => void) | undefined;
  const triggerUnsubscribe = vi.fn();
  const activity = userActivity({
    inactivityTimespan,
    activityTriggers: [
      (notifyActivity) => {
        notifyActivityReference = notifyActivity;
        return triggerUnsubscribe;
      },
    ],
  });

  expect(notifyActivityReference).toBeDefined();

  const onChange = vi.fn();
  activity.subscribe(onChange);

  expect(activity.isActive()).toBe(false);

  notifyActivityReference?.();

  expect(activity.isActive()).toBe(true);

  vi.advanceTimersByTime(inactivityTimespan);

  expect(activity.isActive()).toBe(false);

  activity.dispose();

  expect(triggerUnsubscribe).toHaveBeenCalled();
});

test("marks as inactive after timespan", () => {
  const activity = userActivity({ inactivityTimespan });
  activity.notifyActivity();

  const onChange = vi.fn();
  activity.subscribe(onChange);

  vi.advanceTimersByTime(inactivityTimespan);

  expect(onChange).toHaveBeenCalledOnce();
  expect(activity.isActive()).toBe(false);
});
