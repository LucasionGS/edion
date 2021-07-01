import { existsSync, readFileSync, writeFileSync } from "fs";
import os from "os";
import Path from "path";

export default new class History {
  public readonly maxSize = 10;

  public add(path: string) {
    let lastIndex = this.history.indexOf(path);
    if (lastIndex > -1) this.history.splice(lastIndex, 1);
    this.history.unshift(path);
    if (this.history.length > this.maxSize) this.history.splice(this.maxSize);

    writeFileSync(this.location, JSON.stringify(this.history));
  }

  public getHistory(): readonly string[] {
    return this.history.slice();
  }

  location = Path.resolve(os.homedir(), ".edionhistory");
  
  private history: string[] = existsSync(this.location) ? JSON.parse(readFileSync(this.location, "utf8")) : [];
}