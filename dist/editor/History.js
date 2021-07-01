"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const os_1 = __importDefault(require("os"));
const path_1 = __importDefault(require("path"));
exports.default = new class History {
    constructor() {
        this.maxSize = 10;
        this.location = path_1.default.resolve(os_1.default.homedir(), ".edionhistory");
        this.history = fs_1.existsSync(this.location) ? JSON.parse(fs_1.readFileSync(this.location, "utf8")) : [];
    }
    add(path) {
        let lastIndex = this.history.indexOf(path);
        if (lastIndex > -1)
            this.history.splice(lastIndex, 1);
        this.history.unshift(path);
        if (this.history.length > this.maxSize)
            this.history.splice(this.maxSize);
        fs_1.writeFileSync(this.location, JSON.stringify(this.history));
    }
    getHistory() {
        return this.history.slice();
    }
};
//# sourceMappingURL=History.js.map