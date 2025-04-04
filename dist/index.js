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
Object.defineProperty(exports, "__esModule", { value: true });
exports.generate = void 0;
const path = __importStar(require("node:path"));
const gel_1 = require("gel");
const file_1 = require("./lib/file");
const registry_1 = require("./lib/registry");
const zod_1 = require("./lib/zod");
const utils_1 = require("./lib/utils");
const isUserObject = (type, registry) => {
    if (type.kind !== "object") {
        return false;
    }
    return type.bases.some((base) => {
        const baseType = registry.resolveType(base.id);
        return baseType.name === "std::Object" || isUserObject(baseType, registry);
    });
};
const writeProp = (type, ctx, depth = 0) => {
    if (type.kind === "scalar") {
        const zodString = (0, zod_1.scalarToZod)(type).join(".");
        return ctx.file.write(`z.${zodString}`);
    }
    if (type.kind === "array") {
        const elementType = ctx.registry.resolveType(type.array_element_id);
        writeProp(elementType, ctx, depth);
        return ctx.file.write(".array()");
    }
    /* TODO: Implement ranges
    if (type.kind === "range") {
      const elementType = registry.resolveType(type.range_element_id);

      writeProp(elementType, registry, file, depth);
      return file.write("...");
    }
    */
    if (type.kind === "tuple") {
        ctx.file.write("z.tuple([\n");
        type.tuple_elements.forEach((element) => {
            const elementType = ctx.registry.resolveType(element.target_id);
            ctx.file.write("", depth + 3);
            writeProp(elementType, ctx, depth + 1);
            ctx.file.write(",\n");
        });
        return ctx.file.write("])", depth + 2);
    }
};
const getBases = (type, ctx) => {
    const userDefinedBases = type.bases
        .map((b) => ctx.registry.objects.find((x) => x.id === b.id))
        .filter((b) => !!b);
    return [
        ...userDefinedBases,
        ...userDefinedBases.flatMap((base) => getBases(base.type, ctx)),
    ];
};
const writeObject = async (type, ctx, mode) => {
    const [_, name] = type.name.split("::");
    const identifier = `${mode}${name}Schema`;
    ctx.file.write(`export const ${identifier} = z.\n`);
    ctx.file.write("object({", 1);
    const userDefinedBases = getBases(type, ctx);
    for (const base of userDefinedBases) {
        ctx.file.write(` // ${base.fullName}\n`);
        await writeObjectProperties(base.type, ctx, mode);
        ctx.file.write("})\n", 1);
        ctx.file.write(".extend({", 1);
    }
    // If there were user defined base objects, annotate the original as well
    if (userDefinedBases.length > 0) {
        ctx.file.write(` // ${type.name}`);
    }
    ctx.file.write("\n");
    await writeObjectProperties(type, ctx, mode);
    ctx.file.write("});\n", 1);
};
const writePointerConstraint = async (ctx, constraint) => {
    if (constraint.name === "std::regexp") {
        const value = constraint.finalexpr
          .replace(/^select std::re_test\(r['"]/, "")
          .replace(/['"], __subject__\)$/, "");
        return ctx.file.write(`.regex(/${value}/)`);
    }
    if (constraint.name === "std::exclusive") {
        // TODO: How do we want to handle this
        return;
    }
    ctx.warnings.push(`Cannot handle constraint ${constraint.name}`);
};
const writeObjectProperties = async (type, ctx, mode) => {
    for (const pointer of type.pointers) {
        /*
          Link properties are excluded as it most likely will result in degraded DX
          All insert shapes however are generated and exported into their respective files
          Array<uuid> = User has to omit the link from the schema if they want the insert shape
          InsertShape<link> = User has to also omit the link from the schema if they want existing objects
        */
        if (pointer.kind === "link") {
            continue;
        }
        // Ignore computed values, these cannot be populated
        if (pointer.is_computed) {
            continue;
        }
        // If generating update schemas, ignore readonly props
        if (pointer.is_readonly && mode === "Update") {
            continue;
        }
        const pointerType = ctx.registry.resolveType(pointer.target_id);
        if (pointerType.kind === "range") {
            ctx.warnings.push(`${pointer.name}: range types are not supported!`);
            continue;
        }
        ctx.file.write(`${pointer.name}: `, 2);
        writeProp(pointerType, ctx);
        const constraints = await (0, utils_1.getPointerConstraints)(ctx.client, type.name, pointer);
        constraints.forEach((constraint) => writePointerConstraint(ctx, constraint));
        if (pointer.has_default) {
            ctx.file.write(".optional()");
        }
        if (pointer.card === $.Cardinality.AtMostOne) {
            ctx.file.write(".nullable()");
        }
        ctx.file.write(`, // ${pointerType.name}\n`);
    }
};
const visitScalars = (type, registry) => {
    if (type.kind === "scalar") {
        return registry.registerScalar(type);
    }
    if (type.kind === "array") {
        const elementType = registry.resolveType(type.array_element_id);
        return visitScalars(elementType, registry);
    }
    if (type.kind === "range") {
        const elementType = registry.resolveType(type.range_element_id);
        return visitScalars(elementType, registry);
    }
    if (type.kind === "tuple") {
        const elementTypes = type.tuple_elements.map((e) => registry.resolveType(e.target_id));
        return elementTypes.forEach((type) => visitScalars(type, registry));
    }
};
const generate = async (client, options) => {
    const outputDir = options.outputDir;
    const modulesDir = path.join(outputDir, "modules");
    const allTypes = await gel_1.$.introspect.types(client);
    const registry = new registry_1.Registry(allTypes);
    // This is recursive, output dir will also exist
    await (0, utils_1.ensureDir)(modulesDir);
    // Always register std:uuid
    registry.registerScalarByName("std::uuid");
    for (const type of allTypes.values()) {
        if (type.kind !== "object") {
            continue;
        }
        // We only care about user-generated objects
        if (!isUserObject(type, registry)) {
            continue;
        }
        registry.registerObject(type);
        for (const pointer of type.pointers) {
            const pointerType = registry.resolveType(pointer.target_id);
            visitScalars(pointerType, registry);
        }
    }
    const modules = registry.getModules();
    const errors = [];
    const warnings = [];
    for (const module of modules) {
        const moduleTypes = registry.getAllByModule(module);
        const moduleOutputFile = path.join(outputDir, "modules", `${module}.ts`);
        const file = new file_1.File(moduleOutputFile);
        file.importNamed("z", "zod");
        const ctx = {
            file: file,
            client: client,
            registry: registry,
            errors: [],
            warnings: [],
        };
        for (const scalar of moduleTypes.scalars) {
            const identifier = `${scalar.name}Schema`;
            file.write("\n");
            file.write(`// #region ${scalar.fullName}\n`);
            const methods = (0, zod_1.scalarToZod)(scalar.type);
            file.exportNamed(identifier, `z.${methods.join(".")}`);
            file.write("// #endregion\n");
        }
        for (const object of moduleTypes.objects) {
            file.write("\n");
            file.write(`// #region ${object.fullName}\n`);
            await writeObject(object.type, ctx, "Create");
            file.write("\n");
            await writeObject(object.type, ctx, "Update");
            file.write("// #endregion\n");
        }
        await file.save();
        errors.push(...ctx.errors);
        warnings.push(...ctx.warnings);
    }
    if (errors.length > 0) {
        return {
            success: false,
            errors: errors,
            warnings: warnings,
        };
    }
    const fileSuffix = options.target === "mts" ? ".js" : "";
    const indexPath = path.join(outputDir, "index.ts");
    const indexFile = new file_1.File(indexPath);
    if (modules.includes("default")) {
        indexFile.exportStar(`./modules/default${fileSuffix}`);
    }
    for (const module of modules) {
        indexFile.exportStar(`./modules/${module}${fileSuffix}`, module);
    }
    await indexFile.save();
    return {
        success: true,
        warnings,
    };
};
exports.generate = generate;
