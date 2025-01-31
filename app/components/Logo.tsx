import Image from "next/image";

export default function Logo() {
  return (
    <div className="w-[80px] h-[80px] flex items-center justify-center">
      <Image src="/logo2.png" alt="logo" height={60} width={60} />
    </div>
  );
}
