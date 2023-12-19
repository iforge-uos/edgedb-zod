"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPointerConstraints = exports.getProjectRoot = exports.ensureDir = void 0;
const edgedb_1 = require("edgedb");
const ensureDir = async (path) => {
    const exists = await edgedb_1.adapter.exists(path);
    if (!exists) {
        return edgedb_1.adapter.fs.mkdir(path, {
            recursive: true,
        });
    }
};
exports.ensureDir = ensureDir;
const getProjectRoot = async (dir) => {
    const currentDir = dir ?? edgedb_1.adapter.process.cwd();
    const systemRoot = edgedb_1.adapter.path.parse(currentDir).root;
    if (currentDir === systemRoot) {
        return null;
    }
    const tomlPath = edgedb_1.adapter.path.join(currentDir, "edgedb.toml");
    const tomlExists = await edgedb_1.adapter.exists(tomlPath);
    if (tomlExists) {
        return currentDir;
    }
    const next = edgedb_1.adapter.path.join(currentDir, "..");
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
