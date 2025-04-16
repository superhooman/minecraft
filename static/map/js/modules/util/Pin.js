import { P } from '../Squaremap.js';

class Pin {
    constructor(def) {
        this.pinned = def;

        this.element = P.createElement("button", "pin", this);

        this.element.onclick = () => this.toggle();

        this.pin(this.pinned);
    }
    toggle() {
        this.pin(!this.pinned);
    }
    pin(pin) {
        this.pinned = pin;
        this.element.className = pin ? "pinned" : "unpinned";
    }
}

export { Pin };
