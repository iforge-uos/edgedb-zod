import { describe, expect, it } from "vitest";
import { z } from "zod";

const std = import("../dbschema/zod/modules/std");
const cal = import("../dbschema/zod/modules/cal");

describe("std::int16", async () => {
  const schema = (await std).int16Schema;

  it("is exported", () => {
    expect(schema).toBeDefined();
  });

  it("is the correct instance", () => {
    expect(schema).toBeInstanceOf(z.ZodNumber);
  });

  it("it does the correct checks", () => {
    expect(schema._zod.def.checks).toMatchSnapshot();
  });
});

describe("std::int32", async () => {
  const schema = (await std).int32Schema;

  it("is exported", () => {
    expect(schema).toBeDefined();
  });

  it("is the correct instance", () => {
    expect(schema).toBeInstanceOf(z.ZodNumber);
  });

  it("it does the correct checks", () => {
    expect(schema._zod.def.checks).toMatchSnapshot();
  });
});

describe("std::int64", async () => {
  const schema = (await std).int64Schema;

  it("is exported", () => {
    expect(schema).toBeDefined();
  });

  it("is the correct instance", () => {
    expect(schema).toBeInstanceOf(z.ZodBigInt);
  });

  it("it does the correct checks", () => {
    expect(schema._zod.def.checks).toMatchSnapshot();
  });
});

describe("std::str", async () => {
  const schema = (await std).strSchema;

  it("is exported", () => {
    expect(schema).toBeDefined();
  });

  it("is the correct instance", () => {
    expect(schema).toBeInstanceOf(z.ZodString);
  });
});

describe("std::bool", async () => {
  const schema = (await std).boolSchema;

  it("is exported", () => {
    expect(schema).toBeDefined();
  });

  it("is the correct instance", () => {
    expect(schema).toBeInstanceOf(z.ZodBoolean);
  });
});

describe("std::json", async () => {
  const schema = (await std).jsonSchema;
±
  it("is exported", () => {
    expect(schema).toBeDefined();
  });

  it("is the correct instance", () => {
    expect(schema).toBeInstanceOf(z.ZodUnknown);
  });
});

describe("std::uuid", async () => {
  const schema = (await std).uuidSchema;

  it("is exported", () => {
    expect(schema).toBeDefined();
  });

  it("is the correct instance", () => {
    expect(schema).toBeInstanceOf(z.ZodUUID);
  });

  it("it does the correct checks", () => {
    expect(schema._zod.def.checks).toMatchSnapshot();
  });
});

describe("std::number", async () => {
  const schema = (await std).numberSchema;

  it("is exported", () => {
    expect(schema).toBeDefined();
  });

  it("is the correct instance", () => {
    expect(schema).toBeInstanceOf(z.ZodNumber);
  });
});

describe("std::datetime", async () => {
  const schema = (await std).datetimeSchema;

  it("is exported", () => {
    expect(schema).toBeDefined();
  });

  it("is the correct instance", () => {
    expect(schema).toBeInstanceOf(z.ZodString);
  });

  it("it does the correct checks", () => {
    expect(schema._zod.def.checks).toMatchSnapshot();
  });
});

describe("std::duration", async () => {
  const schema = (await std).durationSchema;

  it("is exported", () => {
    expect(schema).toBeDefined();
  });

  it("is the correct instance", () => {
    expect(schema).toBeInstanceOf(z.ZodString);
  });

  it("it does the correct checks", () => {
    expect(schema._zod.def.checks).toMatchSnapshot();
  });
});

describe("cal::local_datetime", async () => {
  const schema = (await cal).local_datetimeSchema;

  it("is exported", () => {
    expect(schema).toBeDefined();
  });

  it("is the correct instance", () => {
    expect(schema).toBeInstanceOf(z.ZodString);
  });

  it("it does the correct checks", () => {
    expect(schema._zod.def.checks).toMatchSnapshot();
  });
});

describe("cal::local_time", async () => {
  const schema = (await cal).local_timeSchema;

  it("is exported", () => {
    expect(schema).toBeDefined();
  });

  it("is the correct instance", () => {
    expect(schema).toBeInstanceOf(z.ZodString);
  });

  it("it does the correct checks", () => {
    expect(schema._zod.def.checks).toMatchSnapshot();
  });
});
