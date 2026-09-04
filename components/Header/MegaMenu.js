import Link from "next/link";
import { convertWordPressUrl } from "@/lib/wordpress";

export default function MegaMenu({ columns = [] }) {
  return (
    <div className="mega-menu">
      <div className="container mega-menu-grid">
        {columns.map((column) => (
          <div className="mega-menu-column" key={column.id}>
            <Link className="mega-menu-title" href={convertWordPressUrl(column.url)}>
              {column.title}
            </Link>
            {column.children?.length > 0 && (
              <ul>
                {column.children.map((item) => (
                  <li key={item.id}>
                    <Link href={convertWordPressUrl(item.url)}>{item.title}</Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
