import { writeFileSync } from "fs";
import { lexicographicSortSchema, printSchema } from "graphql";
import { schema } from "../src/pages/api/graphql";

const schemaAsString = printSchema(lexicographicSortSchema(schema));

writeFileSync("src/generated/schema.graphql", schemaAsString);
