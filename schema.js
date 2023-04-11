export const schemaConfig = {
  class: "Meme",
  vectorizer: "img2vec-neural",
  vectorIndexTypr: "hnsw",
  moduleConfig: {
    "img2vec-neural": {
      img2vec: {
        imageFields: ["image"],
      },
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
    }
  ],
};
