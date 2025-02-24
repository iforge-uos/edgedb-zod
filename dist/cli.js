#!/usr/bin/env node
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
const path = __importStar(require("node:path"));
const yargs_1 = __importDefault(require("yargs"));
const helpers_1 = require("yargs/helpers");
const edgedb_1 = require("edgedb");
const index_1 = require("./index");
const utils_1 = require("./lib/utils");
yargs_1.default
    .command("*", "Generate Zod schemas from EdgeDB", {}, async (argv) => {
    const target = argv.target ?? "ts";
    const relativeDir = argv.outputDir ?? "dbschema/edgedb-zod";
    const projectRoot = await (0, utils_1.getProjectRoot)();
    if (!projectRoot) {
        throw new Error("Failed to detect project root.\nRun this command inside an EdgeDB project directory");
    }
    const outputDir = path.join(projectRoot, relativeDir);
    const client = (0, edgedb_1.createClient)();
    const options = {
        target: target,
        outputDir: outputDir,
    };
    const result = await (0, index_1.generate)(client, options);
    if (result.warnings.length > 0) {
        console.warn(result.warnings
            .map((msg) => `⚠️ ${msg}`)
            .join("\n"));
    }
    if (!result.success) {
        console.error("❌ Failed generating schemas");
        return console.error(result.errors.join("\n"));
    }
    return console.log("✔️ Success generating schemas");
})
    .option("target", {
    type: "string",
    choices: ["ts", "mts"],
})
    .parse((0, helpers_1.hideBin)(process.argv));
