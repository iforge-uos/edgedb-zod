"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.File = void 0;
const promises_1 = __importDefault(require("node:fs/promises"));
class File {
    buffer;
    importBuffer;
    filePath;
    constructor(filePath) {
        this.buffer = "";
        this.importBuffer = "";
        this.filePath = filePath;
    }
    write(data, depth = 0) {
        const indentation = "  ".repeat(Math.max(0, depth));
        this.buffer += `${indentation}${data}`;
    }
    writeImport(data) {
        this.importBuffer += data;
    }
    importNamed(name, mod) {
        return this.writeImport(`import { ${name} } from "${mod}";\n`);
    }
    importStarNamed(name, mod) {
        return this.writeImport(`import * as ${name} from "${mod}";\n`);
    }
    exportStar(mod, alias) {
        const line = !alias ? "*" : `* as ${alias}`;
        return this.write(`export ${line} from "${mod}";\n`);
    }
    exportNamed(name, value) {
        return this.write(`export const ${name} = ${value};\n`);
    }
    save() {
        const contents = `${this.importBuffer}\n${this.buffer}`;
        return promises_1.default.writeFile(this.filePath, contents, "utf-8");
    }
}
exports.File = File;
