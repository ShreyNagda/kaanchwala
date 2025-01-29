import { off, title } from "process";

const product = {
  name: "product",
  title: "Products",
  type: "document",
  fields: [
    { name: "name", type: "string", title: "Name of the Product" },
    { name: "slug", title: "Slug", type: "slug", options: { source: "name" } },
    {
      name: "images",
      type: "array",
      title: "Product Images",
      of: [
        {
          type: "image",
          options: [{ hotspot: true }],
          fields: [{ name: "alt", type: "string", title: "Alt" }],
        },
      ],
    },
    {
      name: "description",
      type: "array",
      title: "Description of the Product",
      of: [{ type: "block" }],
    },
    {
      name: "colors",
      title: "Colors",
      type: "array",
      of: [{ type: "string" }],
    },
    { name: "category", title: "Category", type: "string" },
    {
      name: "faceshape",
      title: "Suitable for Face Shape ",
      type: "array",
      of: [{ type: "string" }],
      options: {
        list: [
          {
            title: "Rectangle",
            value: "rectangle",
          },
          {
            title: "Square",
            value: "square",
          },
          {
            title: "Diamond",
            value: "diamond",
          },
          {
            title: "Round",
            value: "round",
          },
          {
            title: "Oval",
            value: "oval",
          },
          {
            title: "Heart",
            value: "heart",
          },
        ],
      },
    },
    { name: "price", title: "Price", type: "number" },
    { name: "sale", title: "Sale", type: "string" },
  ],
};

export default product;
