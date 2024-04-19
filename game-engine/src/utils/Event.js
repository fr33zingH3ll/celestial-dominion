class Event {

    constructor(type, message) {
        this.type = type;
		this.message = message;
        this.cancelable = true;
        this.cancelled = false;
    }

    isCancelable() {
		return this.cancelable;
	}

	setCancelable(cancelable) {
		this.cancelable = cancelable;
	}

	isCancelled() {
		return this.cancelled;
	}

	setCancelled(cancelled) {
		if (!this.isCancelable()) {
            throw new Error("this event is not cancelable");
		}
		this.cancelled = cancelled;
	}

	getType() {
		return this.type;
	}

	toString() {
		return "Event [type=" + this.type + ", cancelable=" + this.cancelable + ", cancelled=" + this.cancelled + "]";
	}
}

export { Event };