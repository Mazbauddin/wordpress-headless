import Image from "next/image";
import Link from "next/link";
import ProductPrice from "./ProductPrice";
import WishlistButton from "./WishlistButton";

export default function ProductCard({ product }) {
  const image = product.images?.[0];

  return (
    <article className="product-card">
      <div className="product-card-media">
        <Link href={`/product/${product.slug}`} className="product-image">
          {image ? (
            <Image
              src={image.src}
              alt={image.alt || product.name}
              width={700}
              height={875}
              sizes="(max-width: 600px) 50vw, (max-width: 1000px) 50vw, 25vw"
            />
          ) : (
            <span className="image-placeholder">No image</span>
          )}
        </Link>

        <WishlistButton productId={product.id} />
      </div>

      <div className="product-content">
        <h3><Link href={`/product/${product.slug}`}>{product.name}</Link></h3>
        <ProductPrice prices={product.prices} />
        {!product.is_in_stock && <small className="out-of-stock">Out of stock</small>}
      </div>
    </article>
  );
}
