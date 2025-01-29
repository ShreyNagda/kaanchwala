import Logo from "@/Components/Logo";
import { noto_serif_display } from "@/lib/fonts";
import { getFeaturedProducts, getProducts } from "@/sanity/sanity-utils";

export default async function Home() {
  // Fetching data from Sanity
  // const products = await getProducts();
  // const featuredProducts = await getFeaturedProducts();
  return (
    <div>
      <section
        className={
          "flex flex-col items-center pt-32 text-white h-[calc(100vh-80px)] " +
          noto_serif_display.className
        }
      >
        <div className="text-amber-400 tracking-wide text-lg md:text-xl ">
          Kaanchwala & Sons
        </div>
        <div className="text-4xl text-center tracking-wider md:text-5xl max-w-sm mx-auto">
          Where Vision Meets Style
        </div>
      </section>
      <section
        className={
          "flex flex-col items-center justify-center bg-light-primary text-black h-[95vh] gap-2 text-2xl " +
          noto_serif_display.className
        }
      >
        Coming Soon..
      </section>
    </div>
  );
}
