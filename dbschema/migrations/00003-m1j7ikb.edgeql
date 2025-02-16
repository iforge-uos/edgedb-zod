CREATE MIGRATION m1j7ikbbcro2gnezl6bcts37u4tcmweoryjiz3ttfwbwdrkuw2br3q
    ONTO m1uvi7odoo3tbrz372mxra33hber6gww72535z63w3tmudsm6432ua
{
  CREATE TYPE default::EnsureRegisteredInStd {
      CREATE PROPERTY field0: std::str;
      CREATE PROPERTY field10: std::datetime;
      CREATE PROPERTY field11: std::duration;
      CREATE PROPERTY field12: cal::local_datetime;
      CREATE PROPERTY field13: cal::local_date;
      CREATE PROPERTY field14: cal::local_time;
      CREATE PROPERTY field15: cal::relative_duration;
      CREATE PROPERTY field16: cal::date_duration;
      CREATE PROPERTY field1: std::bool;
      CREATE PROPERTY field2: std::json;
      CREATE PROPERTY field3: std::uuid;
      CREATE PROPERTY field4: std::int16;
      CREATE PROPERTY field5: std::int32;
      CREATE PROPERTY field6: std::int64;
      CREATE PROPERTY field7: std::bigint;
      CREATE PROPERTY field8: std::float32;
      CREATE PROPERTY field9: std::float64;
  };
};
