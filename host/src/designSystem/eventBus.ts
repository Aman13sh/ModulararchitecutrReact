// Event Bus for Communication Between Micro-Frontends

type EventCallback<T = any> = (data: T) => void;
type UnsubscribeFn = () => void;

interface EventMap {
  [eventName: string]: EventCallback[];
}

class EventBus {
  private events: EventMap;

  constructor() {
    this.events = {};
  }

  // Subscribe to an event
  on<T = any>(eventName: string, callback: EventCallback<T>): UnsubscribeFn {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }
    this.events[eventName].push(callback as EventCallback);

    // Return unsubscribe function
    return () => {
      if (this.events[eventName]) {
        this.events[eventName] = this.events[eventName].filter(cb => cb !== callback);
      }
    };
  }

  // Emit an event
  emit<T = any>(eventName: string, data?: T): void {
    if (this.events[eventName]) {
      this.events[eventName].forEach(callback => callback(data));
    }
  }

  // Remove all listeners for an event
  off(eventName: string): void {
    delete this.events[eventName];
  }
}

// Create singleton instance
const eventBus = new EventBus();

export default eventBus;
