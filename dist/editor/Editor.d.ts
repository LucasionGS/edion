import "colors";
export declare enum EditorMode {
    Edit = 0
}
export default class Editor {
    private filePath;
    private readonly DEBUG;
    private readonly LANG;
    private readonly EOL;
    private mode;
    private ssh;
    private tempSSHpath;
    private tabLength;
    private spacePerTab;
    private useTabs;
    private isSSH;
    constructor(filePath: string, args?: string[]);
    private onKeypressEditMode;
    private setup;
    getCurrentLine(): string;
    getCurrentLineIndex(): number;
    private scrollOffset;
    private clipboard;
    private getEOL;
    save(): Promise<unknown>;
    private randomString;
    private justSaved;
    content: string[];
    cursor: {
        x: number;
        y: number;
    };
    private width;
    private height;
    private pageSize;
    private indention;
    private showLineNumbers;
    render(content?: string[]): void;
    scroll(amount: number, render?: boolean): void;
    /**
     * Draw a line expanding the full width.
     */
    drawLine(): void;
    setMessage(msg?: string): void;
    setTitle(title?: string): void;
    private topMessage;
    append(key: string, x?: number, y?: number): void;
    enter(x?: number, y?: number): void;
    backspace(x?: number, y?: number): void;
    delete(x?: number, y?: number): void;
    setLine(lineContent: string, lineIndex?: number): void;
    moveLine(lineIndex: number, dir: "up" | "down"): void;
    deleteLine(lineIndex?: number): void;
    private lastCursorX;
    setCursor(x?: number, y?: number): void;
    moveCursor(dir: "up" | "down" | "left" | "right"): void;
}
