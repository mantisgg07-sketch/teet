import Image from 'next/image'

export default function Loading() {
  const loadingText = "Loading your adventure...";

  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="text-center">
        {/* Spinning Logo */}
        <div className="relative w-24 h-24 mx-auto mb-8 animate-spin">
          <Image
            src="/img/logo.png"
            alt="Loading"
            fill
            sizes="96px"
            className="object-contain"
          />
        </div>

        {/* Loading Text with Sea Wave Animation */}
        <div className="flex justify-center items-center gap-[1px]">
          {loadingText.split("").map((char, index) => (
            <span
              key={index}
              className="text-xl md:text-2xl text-primary-700 font-bold animate-wave"
              style={{
                animationDelay: `${index * 0.1}s`,
                display: char === " " ? "inline-block" : "inline-block",
                minWidth: char === " " ? "0.4em" : "auto"
              }}
            >
              {char}
            </span>
          ))}
        </div>

        <p className="mt-4 text-blue-400/60 text-sm font-medium animate-pulse tracking-widest uppercase">
          Just a moment
        </p>
      </div>
    </div>
  )
}
