import { Event } from "./Event";

class PlayerEvent extends Event {
    constructor(type, message) {
        super(type);
        this.message = message;
    }
}

class ConnectEvent extends Event {
    constructor(type, message) {
        super(type);
        this.message = message;
    }
}

export { ConnectEvent, PlayerEvent };