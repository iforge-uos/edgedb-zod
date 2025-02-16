# edgedb-zod

`edgedb-zod` is a code generator for [Zod](https://github.com/colinhacks/zod) schemas from your EdgeDB database schema.

2 types of schemas will be generated:
- `Create`: All properties excluding link properties
- `Update`: All properties excluding link and readonly properties

## CLI

To run the CLI: `edgedb-zod [options]`

Currently the supported options are:
- `--outputDir`: The output directory relative from your `edgedb.toml`
- `--target ts|mts`: If set to `mts` will include `.js` in import statements

## Supported features

| Feature               |  Status   |
| --------------------- | :-------: |
| Scalars               | See table |
| Ranges                |     🔴     |
| Arrays, tuples        |     🟢     |
| Union types           |     🔴     |
| Abstract objects      |     🟢     |
| Overloaded properties |     🟢     |
| Regex constraints     |     🟢     |
| Min, max constraints  |     🔴     |
| Custom validators     |     🔴     |
| Property annotations  |     🔴     |

### Supported Scalars

| EdgeDB Type                                                                                                | Supported | Zod Type                                                          | Constraints                     |
| ---------------------------------------------------------------------------------------------------------- | :-------: | ----------------------------------------------------------------- | ------------------------------- |
| [`std::str`](https://docs.edgedb.com/database/stdlib/string/#type::std::str)                               |     🟢     | `z.string()`                                                      | -                               |
| [`std::bool`](https://docs.edgedb.com/database/stdlib/bool/#type::std::bool)                               |     🟢     | `z.boolean()`                                                     | -                               |
| [`std::json`](https://docs.edgedb.com/database/stdlib/json/#type::std::json)                               |     🟢     | `z.unknown()`                                                     | -                               |
| [`std::uuid`](https://docs.edgedb.com/database/stdlib/uuid/#type::std::uuid)                               |     🟢     | `z.string().uuid()`                                               | -                               |
| [`std::enum`](https://docs.edgedb.com/database/stdlib/enum#type::std::enum)                                |     🟢     | `z.enum()`                                                        | -                               |
| [`std::int16`](https://docs.edgedb.com/database/stdlib/numbers/#type::std::int16)                          |     🟢     | `z.number().int().min(-32768).max(32768)`                         | 16-bit unsigned integer         |
| [`std::int32`](https://docs.edgedb.com/database/stdlib/numbers/#type::std::int32)                          |     🟢     | `z.number().int().min(-2147483647).max(2147483647)`               | 32-bit unsigned integer         |
| [`std::int64`](https://docs.edgedb.com/database/stdlib/numbers/#type::std::int64)                          |     🟢     | `z.bigint().min(-9223372036854775808n).max(9223372036854775807n)` | 64-bit unsigned integer         |
| [`std::bigint`](https://docs.edgedb.com/database/stdlib/numbers/#type::std::bigint)                        |     🟢     | `z.bigint()`                                                      | -                               |
| [`std::float32`](https://docs.edgedb.com/database/stdlib/numbers/#type::std::float32)                      |     🟢     | `z.number().min(-3.40282347e38).max(3.40282347e38)`               | 32-bit float                    |
| [`std::float64`](https://docs.edgedb.com/database/stdlib/numbers/#type::std::float64)                      |     🟢     | `z.number()`                                                      | 64-bit float                    |
| [`std::datetime`](https://docs.edgedb.com/database/stdlib/datetime/#type::std::datetime)                   |     🟢     | `z.string().datetime({ offset: true })`                           | ISO datetime with timezone      |
| [`std::duration`](https://docs.edgedb.com/database/stdlib/datetime/#type::std::duration)                   |     🟢     | `z.string().duration()`                                           | ISO duration format             |
| [`cal::local_datetime`](https://docs.edgedb.com/database/stdlib/datetime#type::cal::local_datetime)        |     🟢     | `z.string().datetime({ local: true })`                            | Local datetime without timezone |
| [`cal::local_date`](https://docs.edgedb.com/database/stdlib/datetime/#type::cal::local_date)               |     🔴     | -                                                                 | -                               |
| [`cal::local_time`](https://docs.edgedb.com/database/stdlib/datetime/#type::cal::local_time)               |     🟢     | `z.string().time()`                                               | Local time format               |
| [`cal::relative_duration`](https://docs.edgedb.com/database/stdlib/datetime/#type::cal::relative_duration) |     🔴     | -                                                                 | -                               |
| [`cal::date_duration`](https://docs.edgedb.com/database/stdlib/datetime/#type::cal::date_duration)         |     🔴     | -                                                                 | -                               |
| [`std::bytes`](https://docs.edgedb.com/database/stdlib/bytes/#type::std::bytes)                            |     🔴     | -                                                                 | -                               |
| [`std::sequence`](https://docs.edgedb.com/database/stdlib/sequence#type::std::sequence)                    |     🔴     | -                                                                 | -                               |

Are we missing any? Please open an issue or PR.

## Example output

Partial output of `edgedb-zod/modules/default.ts`:
```ts
// #region default::User
export const CreateUserSchema = z.
  object({ // default::HasTimestamps
    createdAt: z.string().datetime().optional(), // std::datetime
    updatedAt: z.string().datetime().optional(), // std::datetime
  })
  .extend({ // default::User
    name: z.string(), // std::str
    emailAddress: z.string().regex(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/), // std::str
    password: z.string(), // std::str
  });

export const UpdateUserSchema = z.
  object({ // default::HasTimestamps
    updatedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d{3})?)?Z?$/).optional(), // std::datetime
  })
  .extend({ // default::User
    name: z.string(), // std::str
    emailAddress: z.string().regex(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/), // std::str
    password: z.string(), // std::str
  });
// #endregion
```