"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("colors");
exports.default = new class Syntax {
    json(line) {
        [
            // Quotes
            line => line.replace(/"[^"\\\\]*(?:\\\\.[^"\\\\]*)*"/sg, "$&".cyan)
        ].forEach(func => line = func(line));
        return line;
    }
};
//# sourceMappingURL=Syntax.js.map