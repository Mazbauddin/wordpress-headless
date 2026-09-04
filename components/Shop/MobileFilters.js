"use client";

import { useState } from "react";
import ShopFilters from "./ShopFilters";

export default function MobileFilters({ attributes }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button className="mobile-filter-button secondary-button" type="button" onClick={() => setOpen(true)}>
        Filters
      </button>

      {open && (
        <>
          <div className="drawer-overlay" onClick={() => setOpen(false)} />
          <aside className="drawer-panel drawer-left">
            <div className="drawer-header">
              <h2>Filters</h2>
              <button type="button" onClick={() => setOpen(false)}>×</button>
            </div>
            <ShopFilters attributes={attributes} afterChange={() => setOpen(false)} />
          </aside>
        </>
      )}
    </>
  );
}
