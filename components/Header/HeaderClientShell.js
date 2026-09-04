"use client";

import { useState } from "react";
import MobileMenu from "./MobileMenu";
import { convertWordPressUrl } from "@/lib/wordpress";

export default function HeaderClientShell({ menu }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className="mobile-menu-button"
        aria-label="Open menu"
        onClick={() => setOpen(true)}
      >
        ☰
      </button>

      <MobileMenu
        menu={menu}
        open={open}
        onClose={() => setOpen(false)}
        convertUrl={convertWordPressUrl}
      />
    </>
  );
}
