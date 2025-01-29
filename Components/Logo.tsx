import Image from "next/image";

export default function Logo() {
  return (
    // <div
    //   className={
    //     "text-2xl font-bold leading-none " + noto_serif_display.className
    //   }
    // >
    //   Kaanchwala
    //   <div className="text-sm leading-none">& Sons</div>
    // </div>
    <div className="w-[80px] h-[80px] flex items-center justify-center">
      <Image src="logo.png" alt="logo" height={50} width={50} />
    </div>
  );
}
