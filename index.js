import weaviate from "weaviate-ts-client";
import fs, { readdirSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";

function toBase64(file) {
  const bitmap = fs.readFileSync(file);
  return Buffer.from(bitmap).toString("base64");
}

const client = weaviate.client({
  scheme: "http",
  host: "localhost:8080",
});

const className = "Meme";

// Check if the class already exists
const existingClass = await client.schema
  .classGetter()
  .withClassName(className)
  .do();
if (existingClass) {
  console.log(`Class '${className}' already exists in Weaviate.`);
} else {
  // Create the class
  const schemaConfig = {
    class: className,
    vectorizer: "img2vec-neural",
    vectorIndexTypr: "hnsw",
    moduleConfig: {
      "img2vec-neural": {
        imageFields: ["image"],
      },
    },
    properties: [
      {
        name: "image",
        dataType: ["blob"],
      },
      {
        name: "text",
        dataType: ["string"],
      },
    ],
  };
  await client.schema.classCreator().withClass(schemaConfig).do();
  console.log(`Class '${className}' created successfully in Weaviate.`);
}

// const base64 = Buffer.from(img).toString("base64");
// const res = await client.data
//   .creator()
//   .withClassName("Meme")
//   .withProperties({
//     image: base64,
//     text: "bug meme",
//   })
//   .do();

// await client.data.deleter().withClassName("Meme").do();

const imgFiles = readdirSync(join("./img"));

const images = imgFiles.map(async (img) => {
  const b64 = toBase64(`./img/${img}`);

  await client.data
    .creator()
    .withClassName("Meme")
    .withProperties({
      image: b64,
      text: img.split(".")[0].replace(/_/g, " "),
    })
    .do();
});

await Promise.all(images);

const test = Buffer.from(readFileSync("./img/bug_meme.png")).toString("base64");

const meme = await client.data
  .getter()
  .withClassName("Meme")
  // .withWhere([{ path: ["image"], operator: "Equal", valueString: result }])
  .withFields(["image"])
  .withNearImage({
    image: test,
  })
  .withLimit(1)
  .do();

const result = meme.data.Get.Meme[0].image;

writeFileSync("./result/result.png", result, "base64");

console.log(schemas);
