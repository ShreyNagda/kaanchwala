import Link from "next/link";

export default function Navbar() {
  return (
    <div className="flex justify-between p-3 max-w-4xl mx-auto">
      <div>Kaanchwala & Sons</div>
      <div>
        <Link href={"/"}>Home</Link>
      </div>
    </div>
  );
}
