module default {
  scalar type PostStatus extending enum<Hidden, Private, Public, `Publish scheduled`>;

  type Post extending HasData {
    overloaded required property data -> str;

    optional property externalId -> int16 {
      constraint exclusive;
    };

    optional property status -> PostStatus {
      default := PostStatus.Hidden;
    };

    required property tags -> array<str>;
    optional property metadata -> tuple<views: int64, words: int32, lines: int16>;

    optional property moduleTest -> extra::MyEnum;
    optional property nestingTest -> array<tuple<str, int16, int32, int64, array<tuple<int16, int32>>>>;

    required property isPublic := (.status ?= PostStatus.Public);

    multi link reviewers -> User;

    required link author -> User;
    optional link featuredUser -> User;
  };

  type User extending HasTimestamps {
    required property name -> str;
    required property password -> str;

    required property emailAddress -> str {
      constraint regexp(r"^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$")
    };

    multi link posts := .<author[is Post];
    multi link featuredInPosts := .<featuredUser[is Post];
    multi link reviewerForPosts := .<reviewers[is Post];

    constraint exclusive on ((.name));
  }

  abstract type HasData {
    optional property data -> str;
  };

  abstract type Nothing {
    test: str;
  }

  abstract type HasCreatedAt {
     optional property createdAt -> datetime {
      readonly := true;
      annotation description := "Timestamp when this entity was created";
    };
  }

  abstract type HasUpdatedAt {
    optional property updatedAt -> datetime {
      annotation description := "Timestamp when this entity was updated";
    };
  };

  abstract type HasTimestamps extending HasCreatedAt, HasUpdatedAt {};

  type DeeplyNested extending HasTimestamps, Nothing {};

  type EnsureRegisteredInStd {
    field0: std::str;
    field1: std::bool;
    field2: std::json;
    field3: std::uuid;
    field4: std::int16;
    field5: std::int32;
    field6: std::int64;
    field7: std::bigint;
    field8: std::float32;
    field9: std::float64;
    field10: std::datetime;
    field11: std::duration;
    field12: cal::local_datetime;
    field13: cal::local_date;
    field14: cal::local_time;
    field15: cal::relative_duration;
    field16: cal::date_duration;
  }
};
