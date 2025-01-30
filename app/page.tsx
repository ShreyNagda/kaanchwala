// import { getFeaturedProducts, getProducts } from "@/sanity/sanity-utils";
import About from "@/components/About";
import Hero from "@/components/Hero";

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
