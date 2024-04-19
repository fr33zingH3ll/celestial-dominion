class EventDispatcher {
    constructor() {
		// Key: event type
		// Value: listener
		this.listeners = new Map();
		console.trace();
    }
  
    addEventListener(type, listener) {
		if (!this.listeners.has(type)) {
			this.listeners.set(type, []);
		}

		this.listeners.get(type).push(listener);
    }
  
    dispatchEvent(event) {
		const listeners = this.listeners.get(event.type);

		if (listeners) {
			for (const listener of listeners) {
				listener(event);
			}
		}
    }
  
    removeEventListener(type, listener) {
		const listeners = this.listeners.get(type);

		if (listeners) {
			const index = listeners.indexOf(listener);

			if (index !== -1) {
				listeners.splice(index, 1);
				if (listeners.length === 0) {
					this.listeners.delete(type);
				}
			}
		}
    }
  
    getListeners() {
      	return this.listeners;
    }
}

export { EventDispatcher };