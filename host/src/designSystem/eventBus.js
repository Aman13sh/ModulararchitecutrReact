// Event Bus for Communication Between Micro-Frontends
class EventBus {
  constructor() {
    this.events = {};
  }

  // Subscribe to an event
  on(eventName, callback) {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }
    this.events[eventName].push(callback);

    // Return unsubscribe function
    return () => {
      this.events[eventName] = this.events[eventName].filter(cb => cb !== callback);
    };
  }

  // Emit an event
  emit(eventName, data) {
    if (this.events[eventName]) {
      this.events[eventName].forEach(callback => callback(data));
    }
  }

  // Remove all listeners for an event
  off(eventName) {
    delete this.events[eventName];
  }
}

// Create singleton instance
const eventBus = new EventBus();

export default eventBus;
