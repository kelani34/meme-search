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
