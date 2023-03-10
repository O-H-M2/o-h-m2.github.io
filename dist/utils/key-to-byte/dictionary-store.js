import basicKeyToByte from "./default.js";
import v10BasicKeyToByte from "./v10.js";
import v11BasicKeyToByte from "./v11.js";
import v12BasicKeyToByte from "./v12.js";
export function getBasicKeyDict(version) {
  switch (version) {
    case 13:
    case 12: {
      return v12BasicKeyToByte;
    }
    case 11: {
      return v11BasicKeyToByte;
    }
    case 10: {
      return v10BasicKeyToByte;
    }
    default: {
      return basicKeyToByte;
    }
  }
}
