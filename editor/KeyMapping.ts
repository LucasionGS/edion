class Key {
  constructor(
    public readonly key: string,
    public readonly ctrl: boolean = false,
    public readonly shift: boolean = false,
    public readonly alt: boolean = false
  ) {

  }
}

function nKey(
  key: string,
  ctrl: boolean = false,
  shift: boolean = false,
  alt: boolean = false
) {
  return new Key(key, ctrl, shift, alt);
}

export default new class KeyMap {
  public map = {
    "97": nKey("a"),
    "27 91 68": nKey("ArrowLeft"),
    "27 91 67": nKey("ArrowRight"),
    "\x1B[A": nKey("ArrowUp"),
  }

  public bufferToMapKeyString(buffer: Buffer) {
    return buffer.join(" ");
  }

  getKeyString(buffer: Buffer) {
    let str = buffer.toString();
    if (str) return str;
    const key = (this.map as any)[this.bufferToMapKeyString(buffer)] as Key;
    if (!key) return null;
    else return key.key;
  }
  
  getKey(buffer: Buffer) {
    const key = (this.map as any)[this.bufferToMapKeyString(buffer)] as Key;
    if (!key) return nKey(buffer.toString());
    else return key;
  }
}