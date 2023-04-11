const img = readFileSync("./img/img.png");

const base64 = Buffer.from(img).toString("base64");

const vector = new Vector({
  width: 1000,
  height: 1000,
  background: "#fff",
  elements: [
    {
      type: "image",
      src: `data:image/png;base64,${base64}`,
      x: 0,
      y: 0,
      width: 1000,
      height: 1000,
    },
  ],
});

const vectorBuffer = await vector.toBuffer();

const vectorBase64 = Buffer.from(vectorBuffer).toString("base64");

const client = weaviate.client({
  scheme: "http",
  host: "localhost:8080",
});

const meme = await client.data
  .batchUpsert()
  .withBatch([
    {
      className: "Meme",
      fields: {
        image: {
          data: vectorBase64,
          contentType: "image/png",
        },
        text: "Hello World",
      },
    },
  ])
  .do();

console.log(meme);
