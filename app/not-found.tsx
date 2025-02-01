import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-80px)] gap-4 bg-light-primary">
      <div className=" text-xl md:text-2xl text-light-text-primary">
        Coming Soon...
      </div>
      <Link
        href={"/"}
        className="bg-dark-primary text-light-primary p-2 rounded-md"
      >
        Back to Home
      </Link>
    </div>
  );
}
