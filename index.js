import weaviate from "weaviate-ts-client";
import { schemaConfig } from "./schema.js";
import { img } from "./vector";

const client = weaviate.client({
  scheme: "http",
  host: "localhost:8080",
});

const schemas = await client.schema.getter().do();

await client.schema.classCreator().withClass(schemaConfig).do();
const base64 = Buffer.from(img).toString("base64");
const res = await client.data
  .creator()
  .withClassName("Meme")
  .withProperties({
    image: base64,
    text: "bug meme",
  })
  .do();
console.log(schemas);
