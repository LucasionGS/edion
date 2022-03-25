import "colors";
import fs from "fs";
import Path from "path";
import keypress from "keypress";
import os from "os";
import Syntax from "./Syntax";
import Readline from "readline";
import { NodeSSH } from "node-ssh";

const { stdin, stdout } = process;

export enum EditorMode {
  Edit = 0,
}

export default class Editor {
  private readonly DEBUG: boolean;
  private readonly LANG: string;
  private readonly EOL: string;
  private mode: EditorMode = EditorMode.Edit;
  private ssh: NodeSSH = null;
  private tempSSHpath: string = null;
  private tabLength = 4;
  private spacePerTab = 2;
  private useTabs = false;
  private isSSH() {
    return this.ssh != null;
  }

  constructor(private filePath: string, args: string[] = []) {
    // Is SSH?
    let isSSHPathRegex = /^(?:(\w+)?@)?(.{2,}):(.*)/;
    this.LANG = (() => {
      const langCmd = "--lang=";
      const arg = args.find(arg => arg.startsWith(langCmd));
      if (!arg) return Path.extname(this.filePath).substring(1);
      return arg.substring(langCmd.length);
    })();
    this.EOL = (() => {
      const eolCmd = "--eol=";
      const arg = args.find(arg => arg.startsWith(eolCmd));
      if (!arg) return os.EOL;
      return this.getEOL(arg.substring(eolCmd.length));
    })();
    if (!isSSHPathRegex.test(this.filePath)) {
      // Local file
      // File path
      this.filePath = Path.resolve(this.filePath);
      // Parameters
      this.DEBUG = args.includes("--debug");

      if (fs.existsSync(this.filePath)) {
        this.content = fs.readFileSync(this.filePath, "utf-8").split(/\r\n|\n/);
      }
      else {
        this.content = [""];
        this.setMessage("New File");
      }

      this.setup();
    }
    else {
      let [, username, host, path] = this.filePath.match(isSSHPathRegex);
      username = username ?? os.userInfo().username;
      this.filePath = path;
      const connect = (password: string) => {
        console.log("\nConnecting...");

        this.ssh = new NodeSSH();
        this.ssh.connect({
          username,
          host,
          password,
        }).then(
          async n => {
            rl.close();
            console.log("Connected");
            let exists = (await this.ssh.execCommand('[ -f "' + path + '" ] && echo "true" || echo "false"')).stdout; // Check if the file exists.

            if (exists === "true") {
              this.content = (await n.exec("cat", [path])).split(/\r\n|\n/);
            }
            else {
              this.content = [""]
              this.setMessage("New File");
            }

            this.setup();
          },
          reason => {
            console.error(reason.toString());
            ask();
          }
        );
      };

      // SSH connect
      let rl = Readline.createInterface(stdin, stdout);

      const originalWrite = (rl as any)._writeToOutput;

      const ask = () => {
        (rl as any)._writeToOutput = originalWrite;
        rl.question(`Password for ${username}@${host}: `, password => {
          connect(password);
        });

        (rl as any)._writeToOutput = function _writeToOutput(stringToWrite: string) {
          (rl as any).output.write("*");
        };
      };

      ask();
    }
  }

  private onKeypressEditMode(chunk: Buffer, key: KeyPress) {
    if (this.DEBUG) this.setMessage(JSON.stringify(key));
    // Errors
    if (!key) {
      if (typeof chunk === "undefined") return;
      let char = chunk.toString();
      if (char.length === 1) {
        this.append(char);
      }
    }
    // Kill the process
    else if (key.ctrl && (key.name == "q" || ( this.DEBUG && key.name == "x"))) {
      if (this.justSaved) {
        stdout.cursorTo(0, 0);
        stdout.clearScreenDown();
        process.exit();
      }
      else {
        this.setMessage(`CTRL+${key.name.toUpperCase()} was pressed. There are possibly unsaved changes. Press CTRL+S to save first, or press CTRL+${key.name.toUpperCase()} again to Quit without saving`);
        this.justSaved = true;
        return;
      }
    }

    // Kill the process
    else if (key.ctrl && (key.name == "w")) {
      this.save().then(() => {
        stdout.cursorTo(0, 0);
        stdout.clearScreenDown();
        process.exit();
      }).catch((err) => {
        if (err) {
          this.setMessage(err)
        }
      });
    }

    // Copy line
    else if (key.ctrl && (key.name == "c")) {
      this.clipboard = this.getCurrentLine();
      this.setMessage("Copied line to temporary clipboard");
    }
    
    // Toggle line numbers
    else if (key.ctrl && (key.name == "l")) {
      this.showLineNumbers = !this.showLineNumbers;
      this.setMessage(`Line numbers are now ${this.showLineNumbers ? "shown" : "hidden"}`);
      this.render();
    }
    
    // Toggle tabs or spaces
    else if (key.ctrl && (key.name == "t")) {
      this.useTabs = !this.useTabs;
      this.setMessage(`Tabs are now ${this.useTabs ? "tab" : "space"} characters`);
      this.render();
    }

    // Paste line
    else if (key.ctrl && (key.name == "v")) {
      if (typeof this.clipboard === "string") {
        const cur = this.getCurrentLine();
        this.enter(cur.length, this.getCurrentLineIndex());
        this.setLine(this.clipboard);
        this.setCursor(this.clipboard.length);
        this.setMessage("Pasted line from temporary clipboard");
      }
      else this.setMessage("No temporary clipboard available");
    }

    // Save the file
    else if (key.ctrl && key.name == "s") {
      this.save();
      return;
    }

    // Move line up and down
    else if (
      key.ctrl
      && !key.shift
      && (key.name === "up"
        || key.name === "down")
    ) this.moveLine(this.cursor.y, key.name);
    
    // Arrow keys to move around
    else if (
      !key.ctrl
      && (key.name === "up"
      || key.name === "down"
      || key.name === "left"
      || key.name === "right")
    ) this.moveCursor(key.name);

    // Arrow keys to move side to side quickly
    else if (
      key.ctrl
      && !key.shift
      && (key.name === "left"
      || key.name === "right")
    ) {
      let [line, x] = [this.getCurrentLine(), this.cursor.x];
      
      
      let final = 0;
      
      const reg = /[^\w]/g;
      // const reg = /\b/g;
      if (key.name === "left") {
        // if (x === 0) return;
        let l = [...line.slice(0, x)].reverse().join("");
        if (x === 0) {
          return this.moveCursor(key.name);
        }
        if (!l) return this.setCursor(0);

        let index = 0;
        let pos = l.slice(index).search(reg);
        if (pos === -1) return this.setCursor(0);
        final -= pos;
        // while (final === 0) {
        //   index++;
        // }
        final -= 1;
      }
      else { // key.name === "right"
        // if (x === line.length) return;
        let l = line.slice(x);
        if (x === line.length) {
          return this.moveCursor(key.name);
        }
        if (!l) return this.setCursor(line.length);

        let index = 0;
        while (final === 0) {
          let pos = l.slice(index).search(reg);
          if (pos === -1) return this.setCursor(line.length);
          final += pos;
          index++;
        }
        final += 1;
      }
      
      this.setCursor(this.cursor.x + final);
    }
      
    // Pg Up and Down
    else if (
      (key.name === "pageup"
        || key.name === "pagedown")
    ) {
      let direction = key.name === "pagedown" ? 1 : -1;
      this.scroll(direction, true);
      this.moveCursor(direction === 1 ? "down" : "up");
    }

    // Any standard character
    else if (key.name.length === 1) {
      this.append(key.shift ? key.name.toUpperCase() : key.name);
    }

    // Special buttons
    else {
      const line = this.content[this.cursor.y];
      switch (key.name) {
        case "backspace":
          // if (line === "") {
          //   this.deleteLine();
          //   break;
          // }
          this.backspace();
          break;
        case "delete":
          if (key.ctrl) {
            this.deleteLine(this.cursor.y);
            break;
          }
          this.delete();
          break;
        case "return": // Regular Enter
          this.enter();
          break;
        case "enter": // Enter while pressing control apparently???
          this.enter(this.content[this.cursor.y - 1].length, this.cursor.y - 1);
          break;
        case "space":
          this.append(" ");
          break;
        case "tab":
          this.useTabs ? this.append("\t") : this.append(" ".repeat(this.spacePerTab));
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

    if (this.justSaved) {
      this.justSaved = false;
      this.setMessage();
    }
  }

  private setup() {
    stdin.setRawMode(true);
    stdin.resume();
    keypress(stdin);
    
    this.render(this.content);


    stdout.on("resize", () => this.render());

    stdin.on('keypress', (chunk: Buffer, key: KeyPress) => {
      switch (this.mode) {
        case EditorMode.Edit:
          return this.onKeypressEditMode(chunk, key);

        default:
          break;
      }
    });
  }

  public getCurrentLine(): string {
    return this.content[this.cursor.y];
  }

  public getCurrentLineIndex(): number {
    return this.cursor.y;
  }

  private scrollOffset = 0;
  private clipboard: string;

  private getEOL(platform: string): string {
    return platform === "win32" || platform === "win" ? "\r\n" : "\n";
  }

  public async save() {
    const content = this.content.join(this.EOL);
    return new Promise(async (resolve, reject) => {
      if (!this.isSSH()) {
        fs.writeFile(
          this.filePath,
          content,
          err => {
            if (err) {
              this.setMessage(err.message);
              reject(err.message);
            }
            else {
              this.setMessage(`Saved file - ${Buffer.byteLength(content)} bytes, ${this.content.length} lines, ${content.length} characters, `)
              this.justSaved = true;
              resolve(true);
            }
          }
        );
      }
      else {
        // Save from ssh connection.
        while (!this.tempSSHpath) this.tempSSHpath = Path.resolve(os.tmpdir(), this.randomString(6));
        fs.writeFile(
          this.tempSSHpath,
          content,
          err => {
            if (err) {
              this.setMessage(err.message);
              reject(err.message);
            }
            else {

              this.ssh.putFile(this.tempSSHpath, this.filePath);
              
              this.setMessage(`Saved file - ${Buffer.byteLength(content)} bytes, ${this.content.length} lines, ${content.length} characters, `)
              this.justSaved = true;
              resolve(true);
            }
          }
        );
      }
    });
  }

  private randomString(length: number) {
    let result = "";
    let characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  private justSaved = true;

  public content: string[] = [];

  public cursor: { x: number, y: number } = {
    x: 0,
    y: 0
  }

  private width: number;
  private height: number;
  private pageSize: number;
  private indention = 2;
  private showLineNumbers = true;

  public render(content = this.content) {

    process.title = `Edion | ${this.filePath}`;

    this.indention = content.length.toString().length + 3; // 3 more for extra spacing
    const [w, h] = stdout.getWindowSize();
    this.width = w;
    this.height = h;
    this.pageSize = Math.floor(h - 6);
    // this.pageSize = Math.min(content.length - 6, Math.floor(h - 6));
    stdout.cursorTo(0, 0);
    stdout.clearScreenDown();
    this.setTitle();

    stdout.cursorTo(0, 1);
    this.drawLine();

    stdout.cursorTo(0, 2);
    stdout.clearScreenDown();
    for (let i = this.scrollOffset; i < Math.min(content.length, this.scrollOffset + this.pageSize); i++) {
      const line = content[i];
      this.setLine(line, i);
    }
    stdout.cursorTo(0, this.pageSize + 3);
    // stdout.cursorTo(0, this.pageSize);
    this.drawLine();
    this.setCursor();
  }

  public scroll(amount: number, render = true) {
    let newScrolloffset = this.scrollOffset + (amount ?? 1);
    newScrolloffset = Math.max(Math.min(this.content.length - this.pageSize, newScrolloffset), 0); // Clamp the value.
    
    if (newScrolloffset !== this.scrollOffset) {
      this.scrollOffset = newScrolloffset;
      
      if (render) this.render();
    }
  }

  /**
   * Draw a line expanding the full width.
   */
  public drawLine() {
    stdout.write("-".repeat(this.width).bgGreen + "\n");
  }

  public setMessage(msg: string = null) {
    this.topMessage = msg;
    this.setTitle();
  }

  public setTitle(title: string = `File: ${this.filePath}`) {
    stdout.cursorTo(0, 0);
    stdout.clearLine(1);
    stdout.write(title);

    // if message
    if (this.topMessage) stdout.write(` | ${this.topMessage}`);

    this.setCursor();
  }

  private topMessage: string = null;

  public append(key: string, x = this.cursor.x, y = this.cursor.y) {
    const line = this.content[y];
    const p1 = line.substring(0, x);
    const p2 = line.substring(x);
    this.setLine(p1 + key + p2, y);
    this.setCursor(x + key.length);
  }

  public enter(x = this.cursor.x, y = this.cursor.y) {
    const line = this.content[y];
    let spaceCount = 0;
    // while (line.substring(spaceCount, spaceCount + 1) === " ") spaceCount++; // Count the spaces before the cursor.
    const p1c = this.content.slice(0, y);
    const p2c = this.content.slice(y + 1);
    const p1 = line.substring(0, x);
    const p2 = " ".repeat(spaceCount) + line.substring(x);
    this.content = p1c.concat(p1, p2, ...p2c);
    // this.setLine(p2, y + 1);
    this.render(this.content);
    this.setCursor(spaceCount, y + 1);
  }

  public backspace(x = this.cursor.x, y = this.cursor.y) {
    const line = this.content[y];
    const p1 = line.substring(0, x - 1);
    const p2 = line.substring(x);
    if (x > 0) {
      // If not last line
      this.setLine(p1 + p2);
      if (y !== this.content.length - 1 || x !== line.length) {
        this.moveCursor("left");
      }
    }
    else if (y > 0) {
      const len = this.content[y - 1].length;
      this.setLine(this.content[y - 1] + p1 + p2, y - 1);
      this.setCursor(len, y - 1);
      this.deleteLine(y);
    }
  }

  public delete(x = this.cursor.x, y = this.cursor.y) {
    const line = this.content[y];
    const p1 = line.substring(0, x);
    const toDelete = line.substring(x, x + 1);
    let p2 = line.substring(x + 1);

    if (!toDelete && !p2 && typeof this.content[y + 1] === "string") {
      p2 = this.content[y + 1];
      this.deleteLine(y + 1);
    }

    this.setLine(p1 + p2, y);
  }

  public setLine(lineContent: string, lineIndex = this.cursor.y) {
    const { x, y } = this.cursor;
    this.setCursor(0, lineIndex);
    stdout.cursorTo(0);
    const numLen = (lineIndex + 1).toString().length;
    if (this.showLineNumbers) stdout.write((lineIndex + 1).toString() + " ".repeat(this.indention - numLen - 2) + "|");
    this.setCursor(0, lineIndex);
    stdout.clearLine(1);

    const filteredContent = lineContent.replace(/\t/g, " ".repeat(this.tabLength));
    if (this.LANG in Syntax && typeof (Syntax as any)[this.LANG] === "function") stdout.write((Syntax as any)[this.LANG](filteredContent, lineIndex));
    else stdout.write(filteredContent);
    // else stdout.write(lineContent);
    this.content[lineIndex] = lineContent;
    this.setCursor(x, y);
  }

  public moveLine(lineIndex: number, dir: "up" | "down") {
    let otherIndex = lineIndex + (dir === "up" ? -1 : 1);

    if (!(otherIndex in this.content)) return;

    let otherText = this.content[otherIndex];
    let lineText = this.content[lineIndex];
    this.setLine(lineText, otherIndex);
    this.setLine(otherText, lineIndex);
    this.setCursor(this.cursor.x, otherIndex);
  }

  public deleteLine(lineIndex = this.cursor.y) {
    const { x, y } = this.cursor;
    this.content.splice(lineIndex, 1);
    if (this.content.length === 0) this.content.push("");
    this.render();
    this.setCursor(x, y);
  }

  private lastCursorX = 0;

  public setCursor(x: number = this.cursor.x, y: number = this.cursor.y) {
    if (this.pageSize === undefined) this.render();
    x = x ?? this.cursor.x;
    y = y ?? this.cursor.y;

    const endOfFile = y === this.content.length;

    if (x !== this.cursor.x) {
      if (typeof this.content[y] === "string" && typeof this.content[y + 1] === "string" && x > this.content[y].length) {
        x = 0;
        y++;
      }
      
      if (typeof this.content[y] === "string" && typeof this.content[y - 1] === "string" && x < 0) {
        x = this.content[--y].length;
      }
    }

    x = Math.max(0, x);
    y = Math.min(this.content.length - 1, Math.max(0, y));
    
    
    const line = this.content[y];

    const xTmp = Math.min(Math.max(0, x), line ? line.length : 0);
    const yTmp = Math.min(Math.max(-1, y), this.scrollOffset + this.pageSize, this.content.length);
    
    const scrollDirection = yTmp - this.scrollOffset === -1 ? -1 : yTmp === this.scrollOffset + this.pageSize || endOfFile ? 1 : 0;
    // if (this.cursor.x != x) this.lastCursorX = xTmp;
    this.cursor.x = xTmp;
    this.cursor.y = yTmp;
    
    // Actual cords
    const [xReal, yReal] = [
      (this.showLineNumbers ? this.indention : 0) + this.cursor.x,
      (y - this.scrollOffset) + 2
    ];
    if (scrollDirection !== 0) {
      this.scroll(scrollDirection, true);
      // this.setCursor();
    }
    
    let tabs = line.slice(0, this.cursor.x).split("\t").length - 1;
    stdout.cursorTo(
      xReal + (tabs * (this.tabLength - 1)),// + (Math.max(0, tabs - 1) * this.tabLength),
      yReal - (endOfFile ? 0 : scrollDirection)
    );
  }

  public moveCursor(dir: "up" | "down" | "left" | "right") {
    switch (dir) {
      case "up":
        this.setCursor(this.cursor.x, this.cursor.y - 1);
        // this.setCursor(this.cursor.x, --this.cursor.y);
        break;
      case "down":
        this.setCursor(this.cursor.x, this.cursor.y + 1);
        // this.setCursor(this.cursor.x, ++this.cursor.y);
        break;
      case "left":
        this.setCursor(this.cursor.x - 1, this.cursor.y);
        // this.setCursor(--this.cursor.x, this.cursor.y);
        break;
      case "right":
        this.setCursor(this.cursor.x + 1, this.cursor.y);
        // this.setCursor(++this.cursor.x, this.cursor.y);
        break;

      default:
        break;
    }
  }
}

interface KeyPress {
  name: string,
  ctrl: boolean,
  /**
   * The alt key
   */
  meta: boolean,
  shift: boolean,
  sequence: string
}