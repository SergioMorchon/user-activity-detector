export type Listener = () => void;
export type Unsubscribe = () => void;

export default () => {
  const subscribers = new Set<Listener>();

  const subscribe = (listener: Listener): Unsubscribe => {
    subscribers.add(listener);

    return () => {
      subscribers.delete(listener);
    };
  };

  const notify = (): void => {
    subscribers.forEach((callback) => callback());
  };

  return {
    subscribe,
    notify,
  };
};
