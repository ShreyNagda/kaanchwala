// import { getFeaturedProducts, getProducts } from "@/sanity/sanity-utils";
import About from "@/Components/About";
import Hero from "@/Components/Hero";

export default async function Home() {
  // Fetching data from Sanity
  // const products = await getProducts();
  // const featuredProducts = await getFeaturedProducts();
  return (
    <div>
      <>
        <Hero />
        <About />
      </>
    </div>
  );
}
