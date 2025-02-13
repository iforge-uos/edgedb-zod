"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPointerConstraints = exports.getProjectRoot = exports.ensureDir = void 0;
const promises_1 = __importDefault(require("node:fs/promises"));
const node_path_1 = __importDefault(require("node:path"));
const ensureDir = async (path) => {
    try {
        await promises_1.default.access(path);
    }
    catch {
        return promises_1.default.mkdir(path, {
            recursive: true,
        });
    }
};
exports.ensureDir = ensureDir;
const getProjectRoot = async (dir) => {
    const currentDir = dir ?? process.cwd();
    const systemRoot = node_path_1.default.parse(currentDir).root;
    if (currentDir === systemRoot) {
        return null;
    }
    const oldTomlPath = node_path_1.default.join(currentDir, "edgedb.toml");
    const tomlPath = node_path_1.default.join(currentDir, "gel.toml");
    try {
        await promises_1.default.access(oldTomlPath);
        return currentDir;
    }
    catch { }
    try {
        await promises_1.default.access(tomlPath);
        return currentDir;
    }
    catch { }
    const next = node_path_1.default.join(currentDir, "..");
    return (0, exports.getProjectRoot)(next);
};
exports.getProjectRoot = getProjectRoot;
const getPointerConstraints = async (client, objName, pointer) => {
    const query = `
    WITH
      module schema,
      object := (
        select ObjectType filter .name = <str>$objectName LIMIT 1
      ),
      pointer := (
        select object.pointers filter .name = <str>$pointerName LIMIT 1
      )
    SELECT pointer.constraints {
      name,
      params: {
        name,
        kind,
        value := @value
      }
    }
  `;
    const result = await client.queryJSON(query, {
        objectName: objName,
        pointerName: pointer.name,
    });
    return JSON.parse(result);
};
exports.getPointerConstraints = getPointerConstraints;
