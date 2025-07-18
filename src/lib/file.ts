import fs from "node:fs/promises";

export class File {
  private buffer: string;
  private importBuffer: string;
  filePath: string;

  constructor(filePath: string) {
    this.buffer = "";
    this.importBuffer = "";
    this.filePath = filePath;
  }

  write(data: string, depth = 0) {
    const indentation = "  ".repeat(Math.max(0, depth));
    this.buffer += `${indentation}${data}`;
  }

  private writeImport(data: string) {
    this.importBuffer += data;
  }

  importNamed(name: string, mod: string) {
    return this.writeImport(`import { ${name} } from "${mod}";\n`);
  }

  importStarNamed(name: string, mod: string) {
    return this.writeImport(`import * as ${name} from "${mod}";\n`);
  }

  exportStar(mod: string, alias?: string) {
    const line = !alias ? "*" : `* as ${alias}`;
    return this.write(`export ${line} from "${mod}";\n`);
  }

  exportNamed(name: string, value: string) {
    return this.write(`export const ${name} = ${value};\n`);
  }

  save() {
    const contents = `${this.importBuffer}\n${this.buffer}`;
    return fs.writeFile(this.filePath, contents, "utf-8");
  }
}
