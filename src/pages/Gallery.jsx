export default function Gallery() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-14">
      <h1 className="text-3xl font-bold mb-3 text-center">Gallery</h1>
      <p className="text-center text-brand-dark/60 mb-10">A glimpse of the goodness 🍝</p>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {Array.from({ length: 9 }).map((_, i) => (
          <div
            key={i}
            className="aspect-square bg-brand-orange/10 rounded-xl flex items-center justify-center text-5xl"
          >
            🍝
          </div>
        ))}
      </div>

      <p className="text-center mt-10 text-brand-dark/60 text-sm">
        Upload your product images via the{' '}
        <a href="/admin" className="text-brand-red underline">admin panel</a> to fill this gallery.
      </p>
    </div>
  );
}
