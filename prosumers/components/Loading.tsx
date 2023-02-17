export default function Loading() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex gap-4 md:gap-16 animate-pulse text-brand-500 fa-2x">
        <i className="fa-solid fa-earth-africa"></i>
        <i className="fa-solid fa-water"></i>
        <i className="fa-solid fa-fire"></i>
        <i className="fa-solid fa-wind"></i>
        <i className="fa-solid fa-infinity"></i>
      </div>
    </div>
  );
}
