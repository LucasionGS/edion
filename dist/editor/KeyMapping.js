"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Key {
    constructor(key, ctrl = false, shift = false, alt = false) {
        this.key = key;
        this.ctrl = ctrl;
        this.shift = shift;
        this.alt = alt;
    }
}
function nKey(key, ctrl = false, shift = false, alt = false) {
    return new Key(key, ctrl, shift, alt);
}
exports.default = new class KeyMap {
    constructor() {
        this.map = {
            "97": nKey("a"),
            "27 91 68": nKey("ArrowLeft"),
            "27 91 67": nKey("ArrowRight"),
            "\x1B[A": nKey("ArrowUp"),
        };
    }
    bufferToMapKeyString(buffer) {
        return buffer.join(" ");
    }
    getKeyString(buffer) {
        let str = buffer.toString();
        if (str)
            return str;
        const key = this.map[this.bufferToMapKeyString(buffer)];
        if (!key)
            return null;
        else
            return key.key;
    }
    getKey(buffer) {
        const key = this.map[this.bufferToMapKeyString(buffer)];
        if (!key)
            return nKey(buffer.toString());
        else
            return key;
    }
};
//# sourceMappingURL=KeyMapping.js.map