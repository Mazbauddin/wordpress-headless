import Image from "next/image";
import { notFound } from "next/navigation";

import AddToCart from "@/components/Product/AddToCart";
import ProductCard from "@/components/Product/ProductCard";
import ProductPrice from "@/components/Product/ProductPrice";
import ProductReviews from "@/components/Product/ProductReviews";
import ReviewForm from "@/components/Product/ReviewForm";

import ProductSchema from "@/components/SEO/ProductSchema";
import Breadcrumbs from "@/components/UI/Breadcrumbs";

import {
  getProductBySlug,
  getProductReviews,
  getRelatedProducts
} from "@/lib/woocommerce";

import { getProductVariations } from "@/lib/wc-admin";



export async function generateMetadata({ params }) {

  const { slug } = await params;

  const product = await getProductBySlug(slug);


  if (!product) {

    return {
      title: "Product Not Found"
    };

  }


  const description =
    product.short_description
      ?.replace(/<[^>]*>/g, "")
      .trim()
      .slice(0,155);



  const site = process.env.NEXT_PUBLIC_SITE_URL;



  return {

    title: product.name,

    description,


    alternates: {
      canonical: `${site}/product/${product.slug}`
    },


    openGraph: {

      title: product.name,

      description,

      url: `${site}/product/${product.slug}`,

      images: product.images?.[0]
        ? [
            {
              url: product.images[0].src
            }
          ]
        : []

    }

  };

}





export default async function ProductPage({ params }) {


  const { slug } = await params;


  const product = await getProductBySlug(slug);



  if (!product) {

    notFound();

  }




  const [
    related,
    reviews,
    variations

  ] = await Promise.all([


    getRelatedProducts(product.id,4),


    getProductReviews(product.id),


    product.has_options

      ? getProductVariations(product.id)
          .catch(() => [])

      : Promise.resolve([])


  ]);






  return (

    <>


      <ProductSchema product={product} />



      <section className="container product-page">





        {/* Breadcrumb */}

        <div className="full product-breadcrumb">

          <Breadcrumbs

            items={[
              {
                label:"Shop",
                href:"/shop"
              },
              {
                label:product.name
              }
            ]}

          />

        </div>







        {/* PRODUCT MAIN */}


        <div className="product-layout">





          {/* GALLERY */}


          <div className="product-gallery">


            <div className="main-product-image">


              <Image

                src={
                  product.images?.[0]?.src
                }

                alt={
                  product.images?.[0]?.alt ||
                  product.name
                }

                width={900}

                height={1100}

                className="zoom-image"

                priority

              />


            </div>






            {/* THUMBNAILS */}


            <div className="product-thumbnails">


              {
                product.images?.map((image)=>(


                  <Image

                    key={image.id}

                    src={image.src}

                    alt={
                      image.alt ||
                      product.name
                    }

                    width={100}

                    height={120}

                    className="thumbnail-image"


                  />


                ))

              }



            </div>




          </div>









          {/* PRODUCT INFO */}


          <div className="product-summary">





            <h1>

              {product.name}

            </h1>






            <div className="product-single-price">


              <ProductPrice

                prices={product.prices}

              />


            </div>







            <p

              className={
                product.is_in_stock
                ? "in-stock"
                : "out-of-stock"
              }

            >

              {
                product.is_in_stock
                ? "In stock"
                : "Out of stock"
              }


            </p>








            <div

              className="wp-content product-short-description"

              dangerouslySetInnerHTML={{

                __html:
                product.short_description

              }}

            />








            <AddToCart

              product={product}

              variations={variations}

            />






          </div>





        </div>









        {/* DESCRIPTION */}


        <div className="full product-long-content">


          <h2>

            Description

          </h2>



          <div

            className="wp-content"

            dangerouslySetInnerHTML={{

              __html:
              product.description

            }}

          />


        </div>









        {/* REVIEWS */}



        <div className="full product-reviews-section">


          <h2>

            Reviews

          </h2>



          <ProductReviews

            reviews={reviews}

          />



          <ReviewForm

            productId={product.id}

          />



        </div>









        {/* RELATED PRODUCTS */}



        {
          related.length > 0 && (


            <div className="full related-products">


              <h2>

                You may also like

              </h2>





              <div className="product-grid">


                {
                  related.map((item)=>(


                    <ProductCard

                      key={item.id}

                      product={item}

                    />


                  ))

                }


              </div>



            </div>


          )

        }





      </section>


    </>

  );


}