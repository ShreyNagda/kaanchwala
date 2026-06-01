import { CartProvider } from "@/components/cart/CartProvider";
import { CartSheet } from "@/components/cart/CartSheet";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export default function StoreLayout({
 children,
}: {
 children: React.ReactNode;
}) {
 return (
 <CartProvider>
 <Header />
 <main className="flex-1">{children}</main>
 <Footer />
 <CartSheet />
 </CartProvider>
 );
}
