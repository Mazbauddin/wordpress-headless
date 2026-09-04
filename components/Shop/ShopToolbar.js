"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function ShopToolbar({ total }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function change(value) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set("sort", value);
    else params.delete("sort");
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="shop-toolbar">
      <span>{total} products</span>
      <select value={searchParams.get("sort") || ""} onChange={(e) => change(e.target.value)}>
        <option value="">Latest</option>
        <option value="popular">Popular</option>
        <option value="rating">Highest Rated</option>
        <option value="price-low">Price: Low to High</option>
        <option value="price-high">Price: High to Low</option>
      </select>
    </div>
  );
}
