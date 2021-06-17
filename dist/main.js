"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.write = void 0;
const Editor_1 = __importDefault(require("./editor/Editor"));
const { stdin, stdout } = process;
function main(args) {
    if (!args[0])
        return console.error("Must use args[0]");
    const [path] = args;
    console.log(args);
    new Editor_1.default(path);
}
exports.default = main;
const write = function (...args) {
    return stdout.write(args[0], args[1], args[2]);
};
exports.write = write;
//# sourceMappingURL=main.js.map