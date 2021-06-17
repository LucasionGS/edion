import "colors";
import fs from "fs";
import Path from "path";
import keypress from "keypress";
import os from "os";
import Syntax from "./Syntax";

const { stdin, stdout } = process;

export default class Editor {
  constructor(private filePath: string) {
    this.filePath = filePath = Path.resolve(this.filePath);
    if (fs.existsSync(filePath)) {
      this.content = fs.readFileSync(filePath, "utf-8").split(/\r\n|\n/);
      this.render(this.content);
    }
    else {
      this.content = [""]
      this.setMessage("New File");
    }

    keypress(process.stdin);

    // var stdin = process.openStdin(); 
    // stdin.setEncoding("utf-8");
    stdin.setRawMode(true);
    stdin.resume();

    stdout.on("resize", () => this.render());

    stdin.on('keypress', (chunk: Buffer, key: KeyPress) => {
      // Errors
      if (!key) {
        if (typeof chunk === "undefined") return;
        let char = chunk.toString();
        if (char.length === 1) {
          this.append(char);
        }
      }

      // Control Special
      else if (key.ctrl) {
        // Kill the process
        if (key.name == "q" || key.name == "c") {
          stdout.cursorTo(0, 0);
          stdout.clearScreenDown();
          process.exit()
        }
        if (key.name == "s") {
          this.save();
          return;
        }
      
        // Move line up and down
        else if (
          !key.shift
          && (key.name === "up"
          || key.name === "down")
        ) this.moveLine(this.cursor.y, key.name);

      }

      // Arrow keys to move around
      else if (
        (key.name === "up"
        || key.name === "down"
        || key.name === "left"
        || key.name === "right")
      ) this.moveCursor(key.name);

      // Pg Up and Down
      else if (
        (key.name === "pageup"
        || key.name === "pagedown")
      ) {
        const max = Math.floor(this.content.length / this.pageSize);
        let nxPage = this.pageIndex + (key.name === "pagedown" ? 1 : -1);
        nxPage = Math.min(max, Math.max(0, nxPage));
        if (nxPage !== this.pageIndex) {
          this.setCursor(0, nxPage * this.pageSize);
          this.render();
        }
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

      if (this.justSaved) {
        this.justSaved = false;
        this.setMessage();
      }
    });
  }

  private pageIndex = 0;

  public save() {
    const content = this.content.join(os.EOL);
    fs.writeFile(
      this.filePath,
      content,
      err => {
        err ? this.setMessage(err.message) : this.setMessage(`Saved file - ${Buffer.byteLength(content)} bytes, ${this.content.length} lines, ${content.length} characters, `)
      });
    this.justSaved = true;
  }

  private justSaved = false;

  public content: string[] = [];

  public cursor: { x: number, y: number } = {
    x: 0,
    y: 0
  }

  private width: number;
  private height: number;
  private pageSize: number;
  private indention = 2;
  
  public render(content = this.content) {

    process.title = `Edion | ${this.filePath}`;
    
    this.indention = content.length.toString().length + 3; // 3 more for extra spacing
    const [w, h] = stdout.getWindowSize();
    this.width = w;
    this.height = h;
    const pageSize = this.pageSize = Math.floor(h - 6);
    stdout.cursorTo(0, 0);
    stdout.clearScreenDown();
    this.renderTitle();
    
    stdout.cursorTo(0, 1);
    this.drawLine();

    stdout.cursorTo(0, 2);
    stdout.clearScreenDown();
    for (let i = this.pageIndex * pageSize; i < Math.min(content.length, (this.pageIndex + 1) * pageSize); i++) {
      const line = content[i];
      this.setLine(line, i);
    }
    stdout.cursorTo(0, pageSize + 3);
    // stdout.cursorTo(0, pageSize);
    this.drawLine();
    this.setCursor();
  }

  /**
   * Draw a line expanding the full width.
   */
  public drawLine() {
    stdout.write("-".repeat(this.width).bgGreen + "\n");
  }

  public setMessage(msg: string = null) {
    this.topMessage = msg;
    this.renderTitle();
  }

  public renderTitle(title: string = `File: ${this.filePath}`) {
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
    const p1c = this.content.slice(0, y);
    const p2c = this.content.slice(y + 1);
    const p1 = line.substring(0, x);
    const p2 = line.substring(x);
    this.content = p1c.concat(p1, p2, ...p2c);
    // this.setLine(p2, y + 1);
    this.render(this.content);
    this.setCursor(0, y + 1);
  }

  public backspace(x = this.cursor.x, y = this.cursor.y) {
    const line = this.content[y];
    const p1 = line.substring(0, x - 1);
    const p2 = line.substring(x);
    if (x > 0) {
      this.setLine(p1 + p2);
      if (x != line.length) this.moveCursor("left");
    }
    else if (y > 0) {
      this.deleteLine(y);
      const len = this.content[y - 1].length;
      this.setLine(this.content[y - 1] + p1 + p2, y - 1);
      this.setCursor(len);
    }
  }

  public delete(x = this.cursor.x, y = this.cursor.y) {
    const line = this.content[y];
    const p1 = line.substring(0, x);
    const p2 = line.substring(x + 1);
    this.setLine(p1 + p2, y);
  }

  public setLine(lineContent: string, lineIndex = this.cursor.y) {
    const { x, y } = this.cursor;
    this.setCursor(0, lineIndex);
    stdout.cursorTo(0);
    const numLen = (lineIndex + 1).toString().length;
    stdout.write((lineIndex + 1).toString() + " ".repeat(this.indention - numLen - 2) + "|")
    this.setCursor(0, lineIndex);
    stdout.clearLine(1);
    // write(lineContent);
    let ext = Path.extname(this.filePath).substring(1);
    if (ext in Syntax && typeof (Syntax as any)[ext] === "function") stdout.write((Syntax as any)[ext](lineContent));
    else stdout.write(lineContent);
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

    x = Math.max(0, x);

    y = Math.max(0, y);
    y = Math.min(this.content.length - 1, y);

    
    const xTmp = Math.min(Math.max(0, x), this.content[y] ? this.content[y].length : 0);
    const yTmp = Math.min(Math.max(0, y), this.content.length - 1);

    // if (this.cursor.x != x) this.lastCursorX = xTmp;
    this.cursor.x = xTmp;
    this.cursor.y = yTmp;

    // Actual cords
    const nextPageIndex = Math.floor(this.cursor.y / this.pageSize);
    const [xReal, yReal] = [
      this.indention + this.cursor.x,
      (y % this.pageSize) + 2
    ];
    if (this.pageIndex != nextPageIndex) {
      this.pageIndex = nextPageIndex;
      this.render();
    }

    stdout.cursorTo(
      xReal,
      yReal
    );
  }

  public moveCursor(dir: "up" | "down" | "left" | "right") {
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