"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import CartIcon from "@/components/Cart/CartIcon";
import MiniCart from "@/components/Cart/MiniCart";
import SearchDrawer from "@/components/Search/SearchDrawer";

export default function HeaderActions() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    const handler = () => setCartOpen(true);
    window.addEventListener("open-mini-cart", handler);
    return () => window.removeEventListener("open-mini-cart", handler);
  }, []);

  return (
    <>
      <div className="header-actions">
        <button className="header-text-button" type="button" onClick={() => setSearchOpen(true)}>
          Search
        </button>
        <Link className="desktop-account-link" href="/my-account">Account</Link>
        <CartIcon onClick={() => setCartOpen(true)} />
      </div>

      <SearchDrawer open={searchOpen} onClose={() => setSearchOpen(false)} />
      <MiniCart open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
