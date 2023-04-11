import weaviate from "weaviate-ts-client";
import { schemaConfig } from "./schema.js";

const client = weaviate.client({
  scheme: "http",
  host: "localhost:8080",
});

const schemas = await client.schema.getter().do();


await client.schema.classCreator().withClass(schemaConfig).do();
console.log(schemas);
