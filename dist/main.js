"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Editor_1 = __importDefault(require("./editor/Editor"));
function main(args) {
    if (!args[0])
        return console.error("Must use supply filename");
    const [path] = args;
    console.log(args);
    new Editor_1.default(path);
}
exports.default = main;
//# sourceMappingURL=main.js.map