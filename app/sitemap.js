import {
  getAllProducts,
  getProductCategories
} from "@/lib/woocommerce";
export const revalidate = 600;

export default async function sitemap() {


  const products = await getAllProducts();

  const categories = await getProductCategories();



  const productUrls = products.map((product)=>({

    url:
      `${process.env.NEXT_PUBLIC_SITE_URL}/product/${product.slug}`,

    lastModified:
      new Date()

  }));



  const categoryUrls = categories.map((category)=>({

    url:
      `${process.env.NEXT_PUBLIC_SITE_URL}/product-category/${category.slug}`,

    lastModified:
      new Date()

  }));



  return [

    {
      url: process.env.NEXT_PUBLIC_SITE_URL,
      lastModified: new Date()
    },

    ...productUrls,

    ...categoryUrls

  ];

}