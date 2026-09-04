"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

export default function Pagination({ totalPages }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const current = Number(searchParams.get("page")) || 1;

  if (totalPages <= 1) return null;

  function url(page) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    return `${pathname}?${params.toString()}`;
  }

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)
    .filter((p) => p === 1 || p === totalPages || Math.abs(p - current) <= 2);

  return (
    <nav className="pagination" aria-label="Pagination">
      {current > 1 && <Link href={url(current - 1)}>Previous</Link>}
      {pages.map((p) => (
        <Link key={p} href={url(p)} aria-current={p === current ? "page" : undefined}>
          {p}
        </Link>
      ))}
      {current < totalPages && <Link href={url(current + 1)}>Next</Link>}
    </nav>
  );
}
