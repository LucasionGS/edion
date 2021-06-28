"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Editor_1 = __importDefault(require("./editor/Editor"));
const Syntax_1 = __importDefault(require("./editor/Syntax"));
function main(args) {
    return __awaiter(this, void 0, void 0, function* () {
        { // Block because why not
            const [first] = args;
            if (!first)
                return Promise.resolve().then(() => __importStar(require("./package.json"))).then(pg => {
                    console.error([
                        `Edion CLI Text Editor - Version ${pg.version} by Lucasion`,
                        "",
                        "Usage: edi <filename> [--debug]",
                        "All parameters using the filename must come after the filename",
                    ].join("\n"));
                });
            // Special params
            if (first == "--langs") {
                return console.log([
                    "Supported Languages".underline.bold,
                    ...(() => {
                        const langs = [];
                        let key;
                        for (key in Syntax_1.default) {
                            if (!(key in Syntax_1.default) || key.startsWith("__") || typeof Syntax_1.default[key] !== "function")
                                continue;
                            langs.push(key);
                        }
                        return langs;
                    })()
                ].join("\n"));
            }
        }
        const [path] = args;
        new Editor_1.default(path, args);
    });
}
exports.default = main;
//# sourceMappingURL=main.js.map