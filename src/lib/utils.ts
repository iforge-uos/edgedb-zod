import fs from "node:fs/promises";
import path from "node:path";
import { $, Client } from "edgedb";

export interface PointerConstraint {
  name: string,
  params: {
    name: string,
    kind: string,
    value: string,
  }[]
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

export const getProjectRoot = async (dir?: string): Promise<string | null> => {
  const currentDir = dir ?? process.cwd();
  const systemRoot = path.parse(currentDir).root;

  if (currentDir === systemRoot) {
    return null;
  }

  const oldTomlPath = path.join(currentDir, "edgedb.toml");
  const tomlPath = path.join(currentDir, "gel.toml");

  try {
    await fs.access(oldTomlPath);
    return currentDir;
  } catch {}
  try {
    await fs.access(tomlPath);
    return currentDir;
  } catch {}

  const next = path.join(currentDir, "..");
  return getProjectRoot(next);
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
        value := @value
      }
    }
  `;

  const result = await client.queryJSON(query, {
    objectName: objName,
    pointerName: pointer.name,
  });

  return JSON.parse(result) as PointerConstraint[];
};
