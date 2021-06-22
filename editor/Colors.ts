export default new class Colors {
  private _Reset = "\u001b[0m";
  private _Black = "\u001b[30m";
  private _Red = "\u001b[31m";
  private _Green = "\u001b[32m";
  private _Yellow = "\u001b[33m";
  private _Blue = "\u001b[34m";
  private _Magenta = "\u001b[35m";
  private _Cyan = "\u001b[36m";
  private _White = "\u001b[37m";
  
  private _BrightBlack = "\u001b[30;1m";
  private _BrightRed = "\u001b[31;1m";
  private _BrightGreen = "\u001b[32;1m";
  private _BrightYellow = "\u001b[33;1m";
  private _BrightBlue = "\u001b[34;1m";
  private _BrightMagenta = "\u001b[35;1m";
  private _BrightCyan = "\u001b[36;1m";
  private _BrightWhite = "\u001b[37;1m";
  
  
  Black(str: string) {
    return this._Black + str + this._Reset;
  }
  Red(str: string) {
    return this._Red + str + this._Reset;
  }
  Green(str: string) {
    return this._Green + str + this._Reset;
  }
  Yellow(str: string) {
    return this._Yellow + str + this._Reset;
  }
  Blue(str: string) {
    return this._Blue + str + this._Reset;
  }
  Magenta(str: string) {
    return this._Magenta + str + this._Reset;
  }
  Cyan(str: string) {
    return this._Cyan + str + this._Reset;
  }
  White(str: string) {
    return this._White + str + this._Reset;
  }
  Reset(str: string) {
    return this._Reset + str + this._Reset;
  }

  BrightBlack(str: string) {
    return this._BrightBlack + str + this._Reset;
  }
  BrightRed(str: string) {
    return this._BrightRed + str + this._Reset;
  }
  BrightGreen(str: string) {
    return this._BrightGreen + str + this._Reset;
  }
  BrightYellow(str: string) {
    return this._BrightYellow + str + this._Reset;
  }
  BrightBlue(str: string) {
    return this._BrightBlue + str + this._Reset;
  }
  BrightMagenta(str: string) {
    return this._BrightMagenta + str + this._Reset;
  }
  BrightCyan(str: string) {
    return this._BrightCyan + str + this._Reset;
  }
  BrightWhite(str: string) {
    return this._BrightWhite + str + this._Reset;
  }
}