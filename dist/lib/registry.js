"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Registry = void 0;
class Registry {
    types;
    objects;
    scalars;
    modules;
    warnings;
    constructor(types) {
        this.types = types;
        this.objects = [];
        this.scalars = [];
        this.modules = new Set();
        this.warnings = [];
    }
    resolveType(id) {
        return this.types.get(id);
    }
    registerScalar(scalar) {
        return this.register(scalar, this.scalars);
    }
    registerObject(object) {
        return this.register(object, this.objects);
    }
    registerScalarByName(name) {
        const typesArr = [...this.types.values()];
        const type = typesArr.find((t) => t.name === name);
        if (!type) {
            throw new Error(`Cannot locate scalar ${name}`);
        }
        if (type.kind !== "scalar") {
            throw new Error(`Cannot register ${type.kind} ${name} as scalar`);
        }
        return this.registerScalar(type);
    }
    getModules() {
        return [...this.modules.values()];
    }
    getAllByModule(module) {
        const scalars = this.scalars.filter((s) => s.module === module);
        const objects = this.objects.filter((o) => o.module === module);
        const sortNumeric = (a, b) => {
            return a.localeCompare(b, undefined, {
                numeric: true,
            });
        };
        return {
            scalars: [...scalars].sort((a, b) => sortNumeric(a.name, b.name)),
            objects: [...objects].sort((a, b) => sortNumeric(a.name, b.name)),
        };
    }
    register(type, arr) {
        if (!type.name.includes("::")) {
            throw new Error(`Invalid type name: ${type.name}`);
        }
        const [mod, name] = type.name.split("::");
        const oldEntry = arr.find((x) => x.fullName === type.name);
        if (!oldEntry) {
            this.modules.add(mod);
            arr.push({
                id: type.id,
                type: type,
                name: name,
                module: mod,
                fullName: type.name,
            });
        }
    }
}
exports.Registry = Registry;
