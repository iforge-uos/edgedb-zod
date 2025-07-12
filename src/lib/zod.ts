import { $ } from "gel";

const zodType = (name: string, ...args: unknown[]) => `${name}(${args})`;

const zodEnum = (values: unknown[]) => {
  const str = values.join(", ");
  return zodType("enum", `[${str}]`);
};

export const scalarToZod = (type: $.introspect.ScalarType) => {
  if (type.enum_values) {
    const values = type.enum_values.map((v) => `"${v}"`);

    return [
      zodEnum(values),
    ];
  }

  switch (type.name) {
    case "std::str":
      return [
        "z",
        zodType("string"),
      ];

    case "std::bool":
      return [
        "z",
        zodType("boolean"),
      ];

    case "std::json":
      return [
        "z",
        zodType("unknown"),
      ];

    case "std::uuid":
      return [
        "z",
        zodType("uuid"),
      ];

    case "std::int16":
      return [
        "z",
        zodType("int"),
        zodType("min", -32768),
        zodType("max", 32767),
      ];

    case "std::int32":
      return [
        "z",
        zodType("int"),
        zodType("min", -2147483648),
        zodType("max", 2147483647),
      ];

    case "std::int64":
      return [
        "z",
        zodType("bigint"),
        zodType("min", "-9223372036854775808n"),
        zodType("max", "9223372036854775807n"),
      ];

    case "std::bigint":
      return [
        "z",
        zodType("bigint"),
      ];

    case "std::float32":
      return [
        "z",
        zodType("number"),
        zodType("min", -3.40282347e38),
        zodType("max", 3.40282347e38),
      ];

    case "std::float64":
      return [
        "z",
        zodType("number"),
      ];

    // This is not a type in EdgeDB, the JS driver has this
    case "std::number":
      return [
        "z",
        zodType("number"),
      ];

    case "std::datetime":
      return [
        "zt",
        zodType("zonedDateTime"),
      ];
    case "std::duration":
      return [
        "zt",
        zodType("duration"),
      ];

    case "cal::local_datetime":
      return [
        "zt",
        zodType("plainDateTime"),
      ];
    case "cal::local_time":
      return [
        "zt",
        zodType("plainTime"),
      ];

    default:
      // TODO: Null might make more sense
      return [
        zodType("never"),
      ];
  }
};
