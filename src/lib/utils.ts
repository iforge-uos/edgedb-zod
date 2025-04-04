import fs from "node:fs/promises";
import path from "node:path";
import * as TOML from "@iarna/toml";
import { $, Client } from "gel";
import { exists, readFileUtf8 } from "gel/dist/systemUtils";

export interface PointerConstraint {
  name: string;
  params: {
    name: string;
    kind: string;
    value: string;
  }[];
  finalexpr: string;
}

export const ensureDir = async (path: string) => {
  try {
    await fs.access(path);
  } catch {
    return fs.mkdir(path, {
      recursive: true,
    });
  }
};

export const getProjectRoot = async (): Promise<string | null> => {
  let currentDir = process.cwd();
  let schemaDir = "dbschema";
  const systemRoot = path.parse(currentDir).root;
  while (currentDir !== systemRoot) {
    const gelToml = path.join(currentDir, "gel.toml");
    const edgedbToml = path.join(currentDir, "edgedb.toml");
    let configFile: string | null = null;

    if (await exists(gelToml)) {
      configFile = gelToml;
    } else if (await exists(edgedbToml)) {
      configFile = edgedbToml;
    }

    if (configFile) {
      const config: {
        project?: { "schema-dir"?: string };
      } = TOML.parse(await readFileUtf8(configFile));

      const maybeProjectTable = config.project;
      const maybeSchemaDir = maybeProjectTable?.["schema-dir"];
      if (typeof maybeSchemaDir === "string") {
        schemaDir = maybeSchemaDir;
      }
      break;
    }
    currentDir = path.join(currentDir, "..");
  }
  return path.join(currentDir, schemaDir);
};

export const getPointerConstraints = async (
  client: Client,
  objName: string,
  pointer: $.introspect.Pointer,
) => {
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
  })) as PointerConstraint[];
};
