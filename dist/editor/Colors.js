"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = new class Colors {
    constructor() {
        this._Reset = "\u001b[0m";
        this._Black = "\u001b[30m";
        this._Red = "\u001b[31m";
        this._Green = "\u001b[32m";
        this._Yellow = "\u001b[33m";
        this._Blue = "\u001b[34m";
        this._Magenta = "\u001b[35m";
        this._Cyan = "\u001b[36m";
        this._White = "\u001b[37m";
        this._BrightBlack = "\u001b[30;1m";
        this._BrightRed = "\u001b[31;1m";
        this._BrightGreen = "\u001b[32;1m";
        this._BrightYellow = "\u001b[33;1m";
        this._BrightBlue = "\u001b[34;1m";
        this._BrightMagenta = "\u001b[35;1m";
        this._BrightCyan = "\u001b[36;1m";
        this._BrightWhite = "\u001b[37;1m";
    }
    Black(str) {
        return this._Black + str + this._Reset;
    }
    Red(str) {
        return this._Red + str + this._Reset;
    }
    Green(str) {
        return this._Green + str + this._Reset;
    }
    Yellow(str) {
        return this._Yellow + str + this._Reset;
    }
    Blue(str) {
        return this._Blue + str + this._Reset;
    }
    Magenta(str) {
        return this._Magenta + str + this._Reset;
    }
    Cyan(str) {
        return this._Cyan + str + this._Reset;
    }
    White(str) {
        return this._White + str + this._Reset;
    }
    Reset(str) {
        return this._Reset + str + this._Reset;
    }
    BrightBlack(str) {
        return this._BrightBlack + str + this._Reset;
    }
    BrightRed(str) {
        return this._BrightRed + str + this._Reset;
    }
    BrightGreen(str) {
        return this._BrightGreen + str + this._Reset;
    }
    BrightYellow(str) {
        return this._BrightYellow + str + this._Reset;
    }
    BrightBlue(str) {
        return this._BrightBlue + str + this._Reset;
    }
    BrightMagenta(str) {
        return this._BrightMagenta + str + this._Reset;
    }
    BrightCyan(str) {
        return this._BrightCyan + str + this._Reset;
    }
    BrightWhite(str) {
        return this._BrightWhite + str + this._Reset;
    }
};
//# sourceMappingURL=Colors.js.map