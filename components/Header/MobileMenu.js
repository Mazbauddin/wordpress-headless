"use client";

import Link from "next/link";
import { useState } from "react";

function MobileItem({ item, convertUrl, close }) {
  const [open, setOpen] = useState(false);
  const hasChildren = item.children?.length > 0;

  return (
    <li>
      <div className="mobile-menu-row">
        <Link href={convertUrl(item.url)} onClick={close}>{item.title}</Link>
        {hasChildren && (
          <button type="button" onClick={() => setOpen(!open)}>{open ? "−" : "+"}</button>
        )}
      </div>
      {hasChildren && open && (
        <ul className="mobile-submenu">
          {item.children.map((child) => (
            <MobileItem
              key={child.id}
              item={child}
              convertUrl={convertUrl}
              close={close}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

export default function MobileMenu({ menu = [], open, onClose, convertUrl }) {
  if (!open) return null;

  return (
    <>
      <div className="drawer-overlay" onClick={onClose} />
      <aside className="drawer-panel drawer-left">
        <div className="drawer-header">
          <strong>Menu</strong>
          <button type="button" onClick={onClose}>×</button>
        </div>
        <ul className="mobile-menu-list">
          {menu.map((item) => (
            <MobileItem
              key={item.id}
              item={item}
              convertUrl={convertUrl}
              close={onClose}
            />
          ))}
        </ul>
      </aside>
    </>
  );
}
