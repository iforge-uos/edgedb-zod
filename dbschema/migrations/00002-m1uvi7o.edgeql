CREATE MIGRATION m1uvi7odoo3tbrz372mxra33hber6gww72535z63w3tmudsm6432ua
    ONTO m17syqhp6zn7gbrt7ckx4ybkaax6z4w3knl4fbjqagiacnowybfgsa
{
  CREATE ABSTRACT TYPE default::HasCreatedAt {
      CREATE OPTIONAL PROPERTY createdAt: std::datetime {
          SET readonly := true;
          CREATE ANNOTATION std::description := 'Timestamp when this entity was created';
      };
  };
  ALTER TYPE default::HasTimestamps {
      ALTER PROPERTY createdAt {
          DROP ANNOTATION std::description;
      };
  };
  CREATE ABSTRACT TYPE default::HasUpdatedAt {
      CREATE OPTIONAL PROPERTY updatedAt: std::datetime {
          CREATE ANNOTATION std::description := 'Timestamp when this entity was updated';
      };
  };
  ALTER TYPE default::HasTimestamps {
      EXTENDING default::HasCreatedAt,
      default::HasUpdatedAt LAST;
      ALTER PROPERTY createdAt {
          RESET OPTIONALITY;
          DROP OWNED;
          RESET TYPE;
      };
      ALTER PROPERTY updatedAt {
          DROP ANNOTATION std::description;
          RESET OPTIONALITY;
          DROP OWNED;
          RESET TYPE;
      };
  };
  CREATE ABSTRACT TYPE default::Nothing {
      CREATE PROPERTY test: std::str;
  };
  CREATE TYPE default::DeeplyNested EXTENDING default::HasTimestamps, default::Nothing;
};
