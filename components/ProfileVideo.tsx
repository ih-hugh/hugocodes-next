type ProfileVideoProps = { 
  src: string;
  className?: string;
}

export default function ProfileVideo({ src, className = "" }: ProfileVideoProps) {
  return (
    <div className="relative w-full overflow-hidden">
      <video
        preload="true"
        playsInline
        autoPlay
        muted
        loop
        className={`w-full object-cover ${className}`}
      >
        <source src={src} type="video/mp4" />
      </video>
    </div>
  )
}
