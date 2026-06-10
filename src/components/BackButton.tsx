import Link from "next/link";

export default function BackButton() {
  return (
    <Link
      href="/"
      className="inline-flex items-center gap-2 text-sm text-white hover:text-white transition-all duration-300 mb-8 group"
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className="transition-transform duration-300 group-hover:-translate-x-0.5"
      >
        <path d="M10 4L6 8L10 12" />
      </svg>
      <span className="tracking-wider text-xs uppercase">返回作品列表</span>
    </Link>
  );
}
