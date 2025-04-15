"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scalarToZod = void 0;
const zodType = (name, ...args) => `${name}(${args})`;
const zodEnum = (values) => {
    const str = values.join(", ");
    return zodType("enum", `[${str}]`);
};
const scalarToZod = (type) => {
    if (type.enum_values) {
        const values = type.enum_values.map((v) => `"${v}"`);
        return [
            zodEnum(values),
        ];
    }
    switch (type.name) {
        case "std::str":
            return [
                zodType("string"),
            ];
        case "std::bool":
            return [
                zodType("boolean"),
            ];
        case "std::json":
            return [
                zodType("unknown"),
            ];
        case "std::uuid":
            return [
                zodType("uuid"),
            ];
        case "std::int16":
            return [
                zodType("number"),
                zodType("int"),
                zodType("min", -32768),
                zodType("max", 32767),
            ];
        case "std::int32":
            return [
                zodType("number"),
                zodType("int"),
                zodType("min", -2147483648),
                zodType("max", 2147483647),
            ];
        case "std::int64":
            return [
                zodType("bigint"),
                zodType("min", "-9223372036854775808n"),
                zodType("max", "9223372036854775807n"),
            ];
        case "std::bigint":
            return [zodType("bigint")];
        case "std::float32":
            return [
                zodType("number"),
                zodType("min", -3.40282347e38),
                zodType("max", 3.40282347e38),
            ];
        case "std::float64":
            return [zodType("number")];
        // This is not a type in EdgeDB, the JS driver has this
        case "std::number":
            return [
                zodType("number"),
            ];
        case "std::datetime":
            return [
                "iso",
                zodType("datetime", "{ offset: true }"),
            ];
        case "std::duration":
            return [
                "iso",
                zodType("duration"),
            ];
        case "cal::local_datetime":
            return [
                "iso",
                zodType("datetime", "{ local: true }"),
            ];
        case "cal::local_time":
            return [
                "iso",
                zodType("time"),
            ];
        default:
            // TODO: Null might make more sense
            return [
                zodType("never"),
            ];
    }
};
exports.scalarToZod = scalarToZod;
