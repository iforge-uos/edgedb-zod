import { describe, expect, it } from "vitest";
import { z } from "zod";

const defaultMod = import("../dbschema/zod/modules/default");

describe("default::PostStatus", async () => {
  const schema = (await defaultMod).PostStatusSchema;

  it("is exported", () => {
    expect(schema).toBeDefined();
  });

  it("is the correct instance", () => {
    expect(schema).toBeInstanceOf(z.ZodEnum);
  });

  it("has the expected values", () => {
    expect(schema.enum).toMatchSnapshot();
  });
});

describe("default::CreateHasData", async () => {
  const schema = (await defaultMod).CreateHasDataSchema;

  it("is exported", () => {
    expect(schema).toBeDefined();
  });

  it("is the correct instance", () => {
    expect(schema).toBeInstanceOf(z.ZodObject);
  });

  it("has the expected shape", () => {
    // expect(schema.shape).toMatchSnapshot();
  });
});

describe("default::UpdateHasData", async () => {
  const schema = (await defaultMod).UpdateHasDataSchema;

  it("is exported", () => {
    expect(schema).toBeDefined();
  });

  it("is the correct instance", () => {
    expect(schema).toBeInstanceOf(z.ZodObject);
  });

  it("has the expected shape", () => {
    // expect(schema.shape).toMatchSnapshot();
  });
});

describe("default::CreateHasTimestamps", async () => {
  const schema = (await defaultMod).CreateHasTimestampsSchema;

  it("is exported", () => {
    expect(schema).toBeDefined();
  });

  it("is the correct instance", () => {
    expect(schema).toBeInstanceOf(z.ZodObject);
  });

  it("has the expected shape", () => {
    // expect(schema.shape).toMatchSnapshot();
  });
});

describe("default::UpdateHasTimestamps", async () => {
  const schema = (await defaultMod).UpdateHasTimestampsSchema;

  it("is exported", () => {
    expect(schema).toBeDefined();
  });

  it("is the correct instance", () => {
    expect(schema).toBeInstanceOf(z.ZodObject);
  });

  it("has the expected shape", () => {
    // expect(schema.shape).toMatchSnapshot();
  });
});

describe("default::CreatePost", async () => {
  const schema = (await defaultMod).CreatePostSchema;

  it("is exported", () => {
    expect(schema).toBeDefined();
  });

  it("is the correct instance", () => {
    expect(schema).toBeInstanceOf(z.ZodObject);
  });

  it("has the expected shape", () => {
    expect(schema.shape).toMatchSnapshot();
  });
});

describe("default::UpdatePost", async () => {
  const schema = (await defaultMod).UpdatePostSchema;

  it("is exported", () => {
    expect(schema).toBeDefined();
  });

  it("is the correct instance", () => {
    expect(schema).toBeInstanceOf(z.ZodObject);
  });

  it("has the expected shape", () => {
    expect(schema.shape).toMatchSnapshot();
  });
});

describe("default::CreatePost", async () => {
  const schema = (await defaultMod).CreateUserSchema;

  it("is exported", () => {
    expect(schema).toBeDefined();
  });

  it("is the correct instance", () => {
    expect(schema).toBeInstanceOf(z.ZodObject);
  });

  it("has the expected shape", () => {
    expect(schema.shape).toMatchSnapshot();
  });
});

describe("default::UpdateUser", async () => {
  const schema = (await defaultMod).UpdateUserSchema;

  it("is exported", () => {
    expect(schema).toBeDefined();
  });

  it("is the correct instance", () => {
    expect(schema).toBeInstanceOf(z.ZodObject);
  });

  it("has the expected shape", () => {
    expect(schema.shape).toMatchSnapshot();
  });
});

describe("default::DeeplyNested", async () => {
  const schema = (await defaultMod).CreateDeeplyNestedSchema;

  it("is exported", () => {
    expect(schema).toBeDefined();
  });

  it("is the correct instance", () => {
    expect(schema).toBeInstanceOf(z.ZodObject);
  });

  // it("has the expected shape", () => {
  //   expect(schema.shape).toMatchSnapshot();
  // });

  it("has the right fields", () => {
    expect(schema.shape).toHaveProperty("test");
    expect(schema.shape).toHaveProperty("createdAt");
    expect(schema.shape).toHaveProperty("updatedAt");
  });
});
