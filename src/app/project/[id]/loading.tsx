export default function ProjectLoading() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* 返回按钮骨架 */}
      <div className="h-4 w-28 bg-[#1e1e1e] rounded animate-pulse mb-6" />

      {/* 视频骨架 */}
      <div className="aspect-video w-full rounded-xl bg-[#1e1e1e] animate-pulse" />

      {/* 内容骨架 */}
      <div className="mt-8 space-y-4">
        <div className="h-7 w-2/3 bg-[#1e1e1e] rounded animate-pulse" />
        <div className="flex gap-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-6 rounded-full bg-[#1e1e1e] animate-pulse"
              style={{ width: `${40 + i * 14}px` }}
            />
          ))}
        </div>
        <div className="space-y-2">
          <div className="h-4 w-full bg-[#1e1e1e] rounded animate-pulse" />
          <div className="h-4 w-5/6 bg-[#1e1e1e] rounded animate-pulse" />
          <div className="h-4 w-4/6 bg-[#1e1e1e] rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
}
