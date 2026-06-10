export default function Loading() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* 标题骨架 */}
      <div className="mb-6 space-y-2">
        <div className="h-8 w-40 bg-[#1e1e1e] rounded animate-pulse" />
        <div className="h-4 w-56 bg-[#1e1e1e] rounded animate-pulse" />
      </div>

      {/* 标签骨架 */}
      <div className="flex gap-2 mb-8">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="h-8 rounded-full bg-[#1e1e1e] animate-pulse"
            style={{ width: `${40 + i * 10}px` }}
          />
        ))}
      </div>

      {/* 卡片骨架 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-[#1e1e1e] rounded-xl overflow-hidden">
            <div className="aspect-video bg-[#1a1a1a] animate-pulse" />
            <div className="p-4 space-y-2">
              <div className="h-5 w-3/4 bg-[#2a2a2a] rounded animate-pulse" />
              <div className="h-4 w-full bg-[#2a2a2a] rounded animate-pulse" />
              <div className="flex gap-1.5 pt-1">
                {[1, 2].map((j) => (
                  <div
                    key={j}
                    className="h-5 rounded-full bg-[#2a2a2a] animate-pulse"
                    style={{ width: `${32 + j * 16}px` }}
                  />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
