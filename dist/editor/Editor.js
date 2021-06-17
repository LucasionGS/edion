"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const keypress_1 = __importDefault(require("keypress"));
const main_1 = require("../main");
const os_1 = __importDefault(require("os"));
const { stdin, stdout } = process;
class Editor {
    constructor(path) {
        this.path = path;
        this.content = [];
        this.cursor = {
            x: 0,
            y: 0
        };
        this.lastCursorX = 0;
        this.path = path = path_1.default.resolve(this.path);
        if (fs_1.default.existsSync(path)) {
            this.content = fs_1.default.readFileSync(path, "utf-8").split(/\r\n|\n/);
            this.rewrite(this.content);
        }
        else {
        }
        keypress_1.default(process.stdin);
        // var stdin = process.openStdin(); 
        // stdin.setEncoding("utf-8");
        stdin.setRawMode(true);
        stdin.resume();
        stdin.on('keypress', (chunk, key) => {
            // Errors
            if (!key) {
                if (typeof chunk === "undefined")
                    return;
                let char = chunk.toString();
                if (char.length === 1) {
                    this.append(char);
                }
            }
            // Kill the process
            else if (key.ctrl && key.name == 'c')
                process.exit();
            // Arrow keys to move around
            else if (!key.ctrl
                && !key.shift
                && (key.name === "up"
                    || key.name === "down"
                    || key.name === "left"
                    || key.name === "right"))
                this.moveCursor(key.name);
            // Move line up and down
            else if (key.ctrl
                && !key.shift
                && (key.name === "up"
                    || key.name === "down"))
                this.moveLine(this.cursor.y, key.name);
            // Any standard character
            else if (key.name.length === 1) {
                this.append(key.name);
            }
            // Special buttons
            else {
                const line = this.content[this.cursor.y];
                switch (key.name) {
                    case "backspace":
                        if (line === "") {
                            this.deleteLine();
                            break;
                        }
                        this.backspace();
                        break;
                    case "delete":
                        if (key.ctrl) {
                            this.deleteLine(this.cursor.y);
                            break;
                        }
                        this.delete();
                        break;
                    case "return":
                        this.enter();
                        break;
                    case "space":
                        this.append(" ");
                        break;
                    case "tab":
                        this.append("  ");
                        break;
                    case "home":
                        this.setCursor(0);
                        break;
                    case "end":
                        this.setCursor(line.length);
                        break;
                    default:
                        break;
                }
            }
            fs_1.default.writeFile("./test.txt", this.content.join(os_1.default.EOL), err => void 0);
        });
    }
    rewrite(content = this.content) {
        stdout.cursorTo(0, 0);
        stdout.clearScreenDown();
        stdout.write(`File: ${path_1.default.resolve(this.path)}\n-----------------------------------------`);
        stdout.cursorTo(0, 2);
        stdout.clearScreenDown();
        main_1.write(content.join("\n"));
        this.setCursor(this.cursor.x, this.cursor.x);
    }
    append(key, x = this.cursor.x, y = this.cursor.y) {
        const line = this.content[y];
        const p1 = line.substring(0, x);
        const p2 = line.substring(x);
        this.setLine(p1 + key + p2, y);
        this.setCursor(x + key.length);
    }
    enter(x = this.cursor.x, y = this.cursor.y) {
        const line = this.content[y];
        const p1c = this.content.slice(0, y);
        const p2c = this.content.slice(y + 1);
        const p1 = line.substring(0, x);
        const p2 = line.substring(x);
        this.content = p1c.concat(p1, p2, ...p2c);
        // this.setLine(p2, y + 1);
        this.rewrite(this.content);
        this.setCursor(0, y + 1);
    }
    backspace(x = this.cursor.x, y = this.cursor.y) {
        const line = this.content[y];
        const p1 = line.substring(0, x - 1);
        const p2 = line.substring(x);
        if (x > 0) {
            this.setLine(p1 + p2);
            if (x != line.length)
                this.moveCursor("left");
        }
        else if (y > 0) {
            this.deleteLine(y);
            const len = this.content[y - 1].length;
            this.setLine(this.content[y - 1] + p1 + p2, y - 1);
            this.setCursor(len);
        }
    }
    delete(x = this.cursor.x, y = this.cursor.y) {
        const line = this.content[y];
        const p1 = line.substring(0, x);
        const p2 = line.substring(x + 1);
        this.setLine(p1 + p2, y);
    }
    setLine(lineContent, lineIndex = this.cursor.y) {
        const { x, y } = this.cursor;
        this.setCursor(0, lineIndex);
        stdout.clearLine(1);
        main_1.write(lineContent);
        this.content[lineIndex] = lineContent;
        this.setCursor(x, y);
    }
    moveLine(lineIndex, dir) {
        let otherIndex = lineIndex + (dir === "up" ? -1 : 1);
        if (!(otherIndex in this.content))
            return;
        let otherText = this.content[otherIndex];
        let lineText = this.content[lineIndex];
        this.setLine(lineText, otherIndex);
        this.setLine(otherText, lineIndex);
        this.setCursor(this.cursor.x, otherIndex);
    }
    deleteLine(lineIndex = this.cursor.y) {
        const { x, y } = this.cursor;
        this.content.splice(lineIndex, 1);
        if (this.content.length === 0)
            this.content.push("");
        this.rewrite();
        this.setCursor(x, y);
    }
    setCursor(x, y = this.cursor.y) {
        const xTmp = Math.min(Math.max(0, x), this.content[y] ? this.content[y].length : 0);
        const yTmp = Math.min(Math.max(0, y), this.content.length - 1);
        // if (this.cursor.x != x) this.lastCursorX = xTmp;
        this.cursor.x = xTmp;
        this.cursor.y = yTmp;
        stdout.cursorTo(this.cursor.x, typeof y === "number" ? this.cursor.y + 2 : undefined);
    }
    moveCursor(dir) {
        switch (dir) {
            case "up":
                // stdout.moveCursor(0, this.cursor.y > 0 ? -1 : 0);
                this.setCursor(this.cursor.x, --this.cursor.y);
                break;
            case "down":
                // stdout.moveCursor(0, this.cursor.y < this.content.length -1 ? 1 : 0);
                this.setCursor(this.cursor.x, ++this.cursor.y);
                break;
            case "left":
                // stdout.moveCursor(this.cursor.x > 0 ? -1 : 0, 0);
                this.setCursor(--this.cursor.x, this.cursor.y);
                break;
            case "right":
                // stdout.moveCursor(this.cursor.x < this.content.length -1 ? 1 : 0, 0);
                this.setCursor(++this.cursor.x, this.cursor.y);
                break;
            default:
                break;
        }
    }
}
exports.default = Editor;
//# sourceMappingURL=Editor.js.map