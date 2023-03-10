const quantumRangesKeys = [
  "_QK_MODS",
  "_QK_MODS_MAX",
  "_QK_MOD_TAP",
  "_QK_MOD_TAP_MAX",
  "_QK_LAYER_TAP",
  "_QK_LAYER_TAP_MAX",
  "_QK_LAYER_MOD",
  "_QK_LAYER_MOD_MAX",
  "_QK_TO",
  "_QK_TO_MAX",
  "_QK_MOMENTARY",
  "_QK_MOMENTARY_MAX",
  "_QK_DEF_LAYER",
  "_QK_DEF_LAYER_MAX",
  "_QK_TOGGLE_LAYER",
  "_QK_TOGGLE_LAYER_MAX",
  "_QK_ONE_SHOT_LAYER",
  "_QK_ONE_SHOT_LAYER_MAX",
  "_QK_ONE_SHOT_MOD",
  "_QK_ONE_SHOT_MOD_MAX",
  "_QK_LAYER_TAP_TOGGLE",
  "_QK_LAYER_TAP_TOGGLE_MAX",
  "_QK_KB",
  "_QK_KB_MAX",
  "_QK_MACRO",
  "_QK_MACRO_MAX"
];
const quantumRanges = (basicKeyToByte) => {
  return Object.keys(basicKeyToByte).reduce((acc, key) => quantumRangesKeys.includes(key) ? {...acc, [key]: basicKeyToByte[key]} : acc, {});
};
const modCodes = {
  QK_LCTL: 256,
  QK_LSFT: 512,
  QK_LALT: 1024,
  QK_LGUI: 2048,
  QK_RMODS_MIN: 4096,
  QK_RCTL: 4352,
  QK_RSFT: 4608,
  QK_RALT: 5120,
  QK_RGUI: 6144
};
const modMasks = {
  MOD_LCTL: 1,
  MOD_LSFT: 2,
  MOD_LALT: 4,
  MOD_LGUI: 8,
  MOD_RCTL: 17,
  MOD_RSFT: 18,
  MOD_RALT: 20,
  MOD_RGUI: 24,
  MOD_HYPR: 15,
  MOD_MEH: 7
};
const topLevelMacroToValue = {
  MT: "_QK_MOD_TAP",
  LT: "_QK_LAYER_TAP",
  LM: "_QK_LAYER_MOD",
  TO: "_QK_TO",
  MO: "_QK_MOMENTARY",
  DF: "_QK_DEF_LAYER",
  TG: "_QK_TOGGLE_LAYER",
  OSL: "_QK_ONE_SHOT_LAYER",
  OSM: "_QK_ONE_SHOT_MOD",
  TT: "_QK_LAYER_TAP_TOGGLE",
  CUSTOM: "_QK_KB",
  MACRO: "_QK_MACRO"
};
const modifierKeyToValue = {
  LCTL: modCodes.QK_LCTL,
  C: modCodes.QK_LCTL,
  LSFT: modCodes.QK_LSFT,
  S: modCodes.QK_LSFT,
  LALT: modCodes.QK_LALT,
  A: modCodes.QK_LALT,
  LGUI: modCodes.QK_LGUI,
  LCMD: modCodes.QK_LGUI,
  LWIN: modCodes.QK_LGUI,
  G: modCodes.QK_LGUI,
  RCTL: modCodes.QK_RCTL,
  RSFT: modCodes.QK_RSFT,
  ALGR: modCodes.QK_RALT,
  RALT: modCodes.QK_RALT,
  RCMD: modCodes.QK_RGUI,
  RWIN: modCodes.QK_RGUI,
  RGUI: modCodes.QK_RGUI,
  SCMD: modCodes.QK_LSFT | modCodes.QK_LGUI,
  SWIN: modCodes.QK_LSFT | modCodes.QK_LGUI,
  SGUI: modCodes.QK_LSFT | modCodes.QK_LGUI,
  LSG: modCodes.QK_LSFT | modCodes.QK_LGUI,
  LAG: modCodes.QK_LALT | modCodes.QK_LGUI,
  RSG: modCodes.QK_RSFT | modCodes.QK_RGUI,
  RAG: modCodes.QK_RALT | modCodes.QK_RGUI,
  LCA: modCodes.QK_LCTL | modCodes.QK_LALT,
  LSA: modCodes.QK_LSFT | modCodes.QK_LALT,
  SAGR: modCodes.QK_RSFT | modCodes.QK_RALT,
  RSA: modCodes.QK_RSFT | modCodes.QK_RALT,
  RCS: modCodes.QK_RCTL | modCodes.QK_RSFT,
  LCAG: modCodes.QK_LCTL | modCodes.QK_LALT | modCodes.QK_LGUI,
  MEH: modCodes.QK_LCTL | modCodes.QK_LALT | modCodes.QK_LSFT,
  HYPR: modCodes.QK_LCTL | modCodes.QK_LALT | modCodes.QK_LSFT | modCodes.QK_LGUI
};
const modifierValueToKey = Object.entries(modifierKeyToValue).reduce((acc, [key, value]) => ({...acc, [value]: key}), {});
const leftModifierValueToKey = Object.entries(modifierKeyToValue).filter(([_, value]) => Object.values(modCodes).includes(value) && value < modCodes.QK_RMODS_MIN).reduce((acc, [key, value]) => ({...acc, [value]: key}), {});
const rightModifierValueToKey = Object.entries(modifierKeyToValue).filter(([_, value]) => Object.values(modCodes).includes(value) && value >= modCodes.QK_RMODS_MIN).reduce((acc, [key, value]) => ({...acc, [value]: key}), {});
const topLevelValueToMacro = (basicKeyToByte) => {
  return Object.entries(topLevelMacroToValue).reduce((acc, [key, value]) => ({...acc, [basicKeyToByte[value]]: key}), {});
};
export const advancedStringToKeycode = (inputString, basicKeyToByte) => {
  const upperString = inputString.toUpperCase();
  const parts = upperString.split(/\(|\)/).map((part) => part.trim());
  if (Object.keys(topLevelMacroToValue).includes(parts[0])) {
    return parseTopLevelMacro(parts, basicKeyToByte);
  } else if (Object.keys(modifierKeyToValue).includes(parts[0])) {
    return parseModifierCode(parts, basicKeyToByte);
  }
  return 0;
};
export const advancedKeycodeToString = (inputKeycode, basicKeyToByte, byteToKey) => {
  let valueToRange = Object.entries(quantumRanges(basicKeyToByte)).map(([key, value]) => [value, key]).sort((a, b) => a[0] - b[0]);
  let lastRange = null;
  let lastValue = -1;
  const btk = byteToKey;
  for (let [value, rangeName] of valueToRange) {
    if (inputKeycode < value) {
      break;
    }
    lastRange = rangeName;
    lastValue = +value;
  }
  const topLevelModKeys = ["_QK_MODS"];
  if (topLevelModKeys.includes(lastRange)) {
    return topLevelModToString(inputKeycode, basicKeyToByte, byteToKey);
  }
  let humanReadable = topLevelValueToMacro(basicKeyToByte)[lastValue] + "(";
  let remainder = inputKeycode & ~lastValue;
  let layer = 0;
  let keycode = "";
  let modValue = 0;
  switch (lastRange) {
    case "_QK_MOMENTARY":
    case "_QK_DEF_LAYER":
    case "_QK_TOGGLE_LAYER":
    case "_QK_ONE_SHOT_LAYER":
    case "_QK_LAYER_TAP_TOGGLE":
    case "_QK_TO":
    case "_QK_KB":
    case "_QK_MACRO":
      humanReadable += remainder + ")";
      break;
    case "_QK_LAYER_TAP":
      layer = remainder >> 8;
      keycode = btk[remainder & 255];
      humanReadable += layer + "," + keycode + ")";
      break;
    case "_QK_ONE_SHOT_MOD":
      humanReadable += modValueToString(remainder) + ")";
      break;
    case "_QK_LAYER_MOD":
      let mask = basicKeyToByte._QK_LAYER_MOD_MASK;
      let shift = Math.log2(mask + 1);
      layer = remainder >> shift;
      modValue = remainder & mask;
      humanReadable += layer + "," + modValueToString(modValue) + ")";
      break;
    case "_QK_MOD_TAP":
      modValue = remainder >> 8 & 31;
      keycode = byteToKey[remainder & 255];
      humanReadable += modValueToString(modValue) + "," + keycode + ")";
      break;
    default:
      humanReadable = null;
  }
  return humanReadable;
};
const modValueToString = (modMask) => {
  const excluded = ["MOD_HYPR", "MOD_MEH"];
  const qualifyingStrings = Object.entries(modMasks).filter((part) => !excluded.includes(part[0]) && (part[1] & modMask) === part[1]).map((part) => part[0]);
  return qualifyingStrings.join(" | ");
};
const topLevelModToString = (keycode, basicKeyToByte, byteToKey) => {
  const containedKeycode = byteToKey[keycode & 255];
  const modifierValue = keycode & 7936;
  const modifierKey = modifierValueToKey[modifierValue];
  if (modifierKey != void 0) {
    return modifierKey + "(" + containedKeycode + ")";
  }
  const enabledMods = Object.entries(modifierValue & modCodes.QK_RMODS_MIN ? rightModifierValueToKey : leftModifierValueToKey).filter((part) => {
    const current = Number.parseInt(part[0]);
    return (current & modifierValue) === current;
  }).map((part) => part[1]);
  return enabledMods.join("(") + "(" + containedKeycode + ")".repeat(enabledMods.length);
};
const parseTopLevelMacro = (inputParts, basicKeyToByte) => {
  var _a;
  const topLevelKey = inputParts[0];
  const parameter = (_a = inputParts[1]) != null ? _a : "";
  let [param1, param2] = ["", ""];
  let layer = 0;
  let mods = 0;
  switch (topLevelKey) {
    case "MO":
    case "DF":
    case "TG":
    case "OSL":
    case "TT":
    case "TO":
      layer = Number.parseInt(parameter);
      if (layer < 0) {
        return 0;
      }
      return basicKeyToByte[topLevelMacroToValue[topLevelKey]] | layer & 255;
    case "OSM":
      mods = parseMods(parameter);
      if (mods === 0) {
        return 0;
      }
      return basicKeyToByte[topLevelMacroToValue[topLevelKey]] | mods & 255;
    case "LM":
      [param1, param2] = parameter.split(",").map((s) => s.trim());
      let mask = basicKeyToByte._QK_LAYER_MOD_MASK;
      let shift = Math.log2(mask + 1);
      layer = Number.parseInt(param1);
      mods = parseMods(param2);
      if (layer < 0 || mods === 0) {
        return 0;
      }
      return basicKeyToByte[topLevelMacroToValue[topLevelKey]] | (layer & 15) << shift | mods & mask;
    case "LT":
      [param1, param2] = parameter.split(",").map((s) => s.trim());
      layer = Number.parseInt(param1);
      if (layer < 0 || !basicKeyToByte.hasOwnProperty(param2)) {
        return 0;
      }
      return basicKeyToByte[topLevelMacroToValue[topLevelKey]] | (layer & 15) << 8 | basicKeyToByte[param2];
    case "MT":
      [param1, param2] = parameter.split(",").map((s) => s.trim());
      mods = parseMods(param1);
      if (mods === 0 || !basicKeyToByte.hasOwnProperty(param2)) {
        return 0;
      }
      return basicKeyToByte[topLevelMacroToValue[topLevelKey]] | (mods & 31) << 8 | basicKeyToByte[param2] & 255;
    case "CUSTOM": {
      const n = Number.parseInt(parameter);
      const nMax = basicKeyToByte._QK_KB_MAX - basicKeyToByte._QK_KB;
      if (n >= 0 && n <= nMax) {
        return basicKeyToByte[topLevelMacroToValue[topLevelKey]] + n;
      }
      return 0;
    }
    case "MACRO": {
      const n = Number.parseInt(parameter);
      const nMax = basicKeyToByte._QK_MACRO_MAX - basicKeyToByte._QK_MACRO;
      if (n >= 0 && n <= nMax) {
        return basicKeyToByte[topLevelMacroToValue[topLevelKey]] + n;
      }
      return 0;
    }
    default:
      return 0;
  }
};
const parseMods = (input = "") => {
  const parts = input.split("|").map((s) => s.trim());
  if (!parts.reduce((acc, part) => acc && modMasks.hasOwnProperty(part), true)) {
    return 0;
  }
  return parts.reduce((acc, part) => acc | modMasks[part], 0);
};
const parseModifierCode = (inputParts, basicKeyToByte) => {
  const realParts = inputParts.filter((nonce) => nonce.length !== 0);
  const bytes = realParts.map((part, idx) => {
    if (idx === realParts.length - 1) {
      return basicKeyToByte.hasOwnProperty(part) ? basicKeyToByte[part] : null;
    } else {
      return modifierKeyToValue.hasOwnProperty(part) ? modifierKeyToValue[part] : null;
    }
  });
  if (bytes.find((e) => e === null)) {
    return 0;
  }
  return bytes.reduce((acc, byte) => acc | byte, 0);
};
export const anyKeycodeToString = (input, basicKeyToByte, byteToKey) => {
  let currentValue = "";
  const advancedParsed = advancedKeycodeToString(input, basicKeyToByte, byteToKey);
  if (byteToKey[input] && !byteToKey[input].startsWith("_QK")) {
    currentValue = byteToKey[input];
  } else if (advancedParsed !== null) {
    currentValue = advancedParsed;
  }
  return currentValue;
};
