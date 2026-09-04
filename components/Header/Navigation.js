import Link from "next/link";
import MegaMenu from "./MegaMenu";
import { convertWordPressUrl } from "@/lib/wordpress";

export default function Navigation({ menu = [] }) {
  return (
    <nav className="desktop-navigation">
      <ul className="main-menu">
        {menu.map((item) => {
          const hasChildren = item.children?.length > 0;
          return (
            <li className={`menu-item ${hasChildren ? "mega-parent" : ""}`} key={item.id}>
              <Link href={convertWordPressUrl(item.url)}>{item.title}</Link>
              {hasChildren && <MegaMenu columns={item.children} />}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
