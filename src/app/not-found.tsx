import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <h1 className="text-6xl font-bold text-white/16 mb-4">404</h1>
      <p className="text-white/65 text-lg mb-8">页面不存在</p>
      <Link
        href="/"
        className="px-6 py-2.5 rounded-lg bg-accent text-white hover:bg-accent-hover transition-colors"
      >
        回到首页
      </Link>
    </div>
  );
}
