export const featured = {
  name: "featured",
  title: "Featured Products",
  type: "document",
  fields: [
    {
      name: "product",
      title: "Product",
      type: "reference",
      to: [{ type: "product" }],
    },
  ],
};
