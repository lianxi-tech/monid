export class Utils {
  static stripMethodPrefix = (did: string) => {
    if (did.indexOf('monid') === -1) throw 'Only "monid" DIDs are allowed';
    return `0x${did.substring(did.lastIndexOf(':') + 1)}`;
  };

  static decimalToHex = (decimal: number) => {
    var hex = Number(decimal).toString(16);
    if (hex.length < 2) {
      hex = '0' + hex;
    }
    return '0x' + hex;
  };
}
