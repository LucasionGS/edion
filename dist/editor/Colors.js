"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Colors {
    static reset(str) {
        return Colors._reset + str + Colors._reset;
    }
    static black(str) {
        return Colors._black + str + Colors._reset;
    }
    static red(str) {
        return Colors._red + str + Colors._reset;
    }
    static green(str) {
        return Colors._green + str + Colors._reset;
    }
    static yellow(str) {
        return Colors._yellow + str + Colors._reset;
    }
    static blue(str) {
        return Colors._blue + str + Colors._reset;
    }
    static magenta(str) {
        return Colors._magenta + str + Colors._reset;
    }
    static cyan(str) {
        return Colors._cyan + str + Colors._reset;
    }
    static white(str) {
        return Colors._white + str + Colors._reset;
    }
    static brightBlack(str) {
        return Colors._brightBlack + str + Colors._reset;
    }
    static brightRed(str) {
        return Colors._brightRed + str + Colors._reset;
    }
    static brightGreen(str) {
        return Colors._brightGreen + str + Colors._reset;
    }
    static brightYellow(str) {
        return Colors._brightYellow + str + Colors._reset;
    }
    static brightBlue(str) {
        return Colors._brightBlue + str + Colors._reset;
    }
    static brightMagenta(str) {
        return Colors._brightMagenta + str + Colors._reset;
    }
    static brightCyan(str) {
        return Colors._brightCyan + str + Colors._reset;
    }
    static brightWhite(str) {
        return Colors._brightWhite + str + Colors._reset;
    }
}
exports.default = Colors;
Colors._reset = "\u001b[0m";
// Regular colors
Colors._black = "\u001b[30m";
Colors._red = "\u001b[31m";
Colors._green = "\u001b[32m";
Colors._yellow = "\u001b[33m";
Colors._blue = "\u001b[34m";
Colors._magenta = "\u001b[35m";
Colors._cyan = "\u001b[36m";
Colors._white = "\u001b[37m";
// Bright colors
Colors._brightBlack = "\u001b[30;1m";
Colors._brightRed = "\u001b[31;1m";
Colors._brightGreen = "\u001b[32;1m";
Colors._brightYellow = "\u001b[33;1m";
Colors._brightBlue = "\u001b[34;1m";
Colors._brightMagenta = "\u001b[35;1m";
Colors._brightCyan = "\u001b[36;1m";
Colors._brightWhite = "\u001b[37;1m";
//# sourceMappingURL=Colors.js.map