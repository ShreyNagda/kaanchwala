import { AnimatePresence } from "framer-motion";
import Hero from "./components/Hero";
import Services from "./components/Services";
import About from "./components/About";

export default async function Home() {
  // Fetching data from Sanity
  // const products = await getProducts();
  // const featuredProducts = await getFeaturedProducts();
  return (
    <div>
      <Hero />
      <About />
      <Services />
    </div>
  );
}
