import { describe, expect, it } from "vitest";
import { z } from "zod";
// import "./shapeSerializer";

const extra = import("../dbschema/zod/modules/extra");

describe("extra::MyEnum", async () => {
  const schema = (await extra).MyEnumSchema;

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

describe("extra::CreateMyType", async () => {
  const schema = (await extra).CreateMyTypeSchema;

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

describe("extra::UpdateMyType", async () => {
  const schema = (await extra).UpdateMyTypeSchema;

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
