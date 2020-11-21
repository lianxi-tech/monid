'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.Utils = void 0;
var Utils = /** @class */ (function () {
  function Utils() {}
  Utils.stripMethodPrefix = function (did) {
    if (did.indexOf('monid') === -1) throw 'Only "monid" DIDs are allowed';
    return '0x' + did.substring(did.lastIndexOf(':') + 1);
  };
  Utils.decimalToHex = function (decimal) {
    var hex = Number(decimal).toString(16);
    if (hex.length < 2) {
      hex = '0' + hex;
    }
    return '0x' + hex;
  };
  return Utils;
})();
exports.Utils = Utils;
