import { sql } from "drizzle-orm";
import {
  pgTable,
  integer,
  text,
  jsonb,
  serial,
  timestamp,
  bigint,
  index,
} from "drizzle-orm/pg-core";

// Create the advocates table and 
// Create a full text index for being able to search for advocates
// by first name, last name, city, and degree using a gin index.
// This converts the columns to a tsvector which is an optimized type
// for full text search in postgres.

// We can see the table is now using the fullTextIdx index we created in the schema file. 
// by the following EXPLAIN ANALZYE:
// Bitmap Heap Scan on advocates  (cost=29.97..34.25 rows=1 width=184) (actual time=0.068..0.069 rows=0 loops=1)
//   Recheck Cond: (to_tsvector('english'::regconfig, ((((((first_name || ' '::text) || last_name) || ' '::text) || city) || ' '::text) || degree)) @@ '''search'' & ''term'''::tsquery)
//   ->  Bitmap Index Scan on advocates_fulltext_idx  (cost=0.00..29.97 rows=1 width=0) (actual time=0.067..0.067 rows=0 loops=1)
//         Index Cond: (to_tsvector('english'::regconfig, ((((((first_name || ' '::text) || last_name) || ' '::text) || city) || ' '::text) || degree)) @@ '''search'' & ''term'''::tsquery)
// Planning Time: 0.293 ms
// Execution Time: 0.088 ms
const advocates = pgTable(
  "advocates",
  {
    id: serial("id").primaryKey(),
    firstName: text("first_name").notNull(),
    lastName: text("last_name").notNull(),
    city: text("city").notNull(),
    degree: text("degree").notNull(),
    specialties: jsonb("payload").default([]).notNull(),
    yearsOfExperience: integer("years_of_experience").notNull(),
    phoneNumber: bigint("phone_number", { mode: "number" }).notNull(),
    createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => {
    return {
      fullTextIdx: index('advocates_fulltext_idx')
        .using('gin', sql`to_tsvector('english', ${table.firstName} || ' ' || ${table.lastName} || ' ' || ${table.city} || ' ' || ${table.degree})`),
    };
  }
);


// Export the inferred types for the advocates table
export type Advocate = typeof advocates.$inferSelect;
export type NewAdvocate = typeof advocates.$inferInsert;

export { advocates };
