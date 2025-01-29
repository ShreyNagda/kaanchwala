import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4 bg-light-primary">
      <div className="text-black text-xl md:text-2xl">Coming Soon...</div>
      <Link href={"/"} className="bg-black text-white p-2 rounded-md">
        Back to Home
      </Link>
    </div>
  );
}
