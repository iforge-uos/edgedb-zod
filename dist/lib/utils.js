"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPointerConstraints = exports.getProjectRoot = exports.ensureDir = void 0;
const promises_1 = __importDefault(require("node:fs/promises"));
const node_path_1 = __importDefault(require("node:path"));
const TOML = __importStar(require("@iarna/toml"));
const systemUtils_1 = require("edgedb/dist/systemUtils");
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
const getProjectRoot = async () => {
    let currentDir = process.cwd();
    let schemaDir = "dbschema";
    const systemRoot = node_path_1.default.parse(currentDir).root;
    while (currentDir !== systemRoot) {
        const gelToml = node_path_1.default.join(currentDir, "gel.toml");
        const edgedbToml = node_path_1.default.join(currentDir, "edgedb.toml");
        let configFile = null;
        if (await (0, systemUtils_1.exists)(gelToml)) {
            configFile = gelToml;
        }
        else if (await (0, systemUtils_1.exists)(edgedbToml)) {
            configFile = edgedbToml;
        }
        if (configFile) {
            const config = TOML.parse(await (0, systemUtils_1.readFileUtf8)(configFile));
            const maybeProjectTable = config.project;
            const maybeSchemaDir = maybeProjectTable?.["schema-dir"];
            if (typeof maybeSchemaDir === "string") {
                schemaDir = maybeSchemaDir;
            }
            break;
        }
        currentDir = node_path_1.default.join(currentDir, "..");
    }
    return schemaDir;
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
        value := @value,
      },
      finalexpr,
    }
  `;
    return (await client.query(query, {
        objectName: objName,
        pointerName: pointer.name,
    }));
};
exports.getPointerConstraints = getPointerConstraints;
