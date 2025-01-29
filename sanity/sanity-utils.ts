import { createClient, groq } from "next-sanity";

const client = createClient({
  projectId: "ti0ok6ge",
  dataset: "production",
  apiVersion: "2024-12-19",
});

export function getProducts() {
  return client.fetch(
    groq`*[_type=="product"]{_id, _createdAt, name, "slug": slug.current, images[]{
    asset->{url}}, description, faceshape,  }`
  );
}

export function getProduct(id: string) {
  return client.fetch(groq`*[_type=="product" && _id == ${id}]{_id, _createdAt, name, "slug": slug.current, images[]{
    asset->{url}}, description, faceshape, price}`);
}

export function getProductByFaceShape(faceshape: string) {
  console.log(faceshape);
  const query = groq`*[_type=="product" && $faceshape in faceshape]{_id, _createdAt, name, "slug": slug.current, images[]{
    asset->{url}}, description, faceshape, price}`;
  const params = { faceshape };
  return client.fetch(query, params);
}

export function getFeaturedProducts() {
  return client.fetch(groq`*[_type=="featured"]{product -> {_id, _createdAt, name, "slug": slug.current, images[]{
    asset->{url}}, description, faceshape,price}} `);
}

export function getBanner() {
  return client.fetch(
    groq`*[_type=="banner"]{url, title, image{asset->{url}}}`
  );
}
