const BASE_URL = process.env.WORDPRESS_URL;


function buildQuery(params = {}) {

  const query = new URLSearchParams();


  for (const [key, value] of Object.entries(params)) {

    if (
      value === undefined ||
      value === null ||
      value === ""
    ) continue;


    if (Array.isArray(value)) {

      value.forEach((item) => {
        query.append(`${key}[]`, String(item));
      });

    } else {

      query.set(key, String(value));

    }

  }


  return query.toString();

}



/**
 * WooCommerce Store API Fetch
 */
async function storeApiFetch(url) {

  try {

    const response = await fetch(
  url,
  {
    next: {
      revalidate: 600
    },
    headers: {
      "Accept": "application/json"
    }
  }
);

    if (!response.ok) {

      const errorText = await response.text();


      console.error(
        "WooCommerce API Error:",
        response.status,
        errorText
      );


      return null;

    }


    return response;


  } catch(error) {


    console.error(
      "WooCommerce Fetch Error:",
      error
    );


    return null;

  }

}



/**
 * Get Products
 */
export async function getProducts(params = {}) {


  const response = await storeApiFetch(

    `${BASE_URL}/wp-json/wc/store/v1/products?${buildQuery(params)}`

  );


  if(!response)
    return [];


  return response.json();

}



/**
 * Products Pagination
 */
export async function getProductsPage(params = {}) {


  const response = await storeApiFetch(

    `${BASE_URL}/wp-json/wc/store/v1/products?${buildQuery(params)}`

  );


  if(!response){

    return {
      products:[],
      total:0,
      totalPages:1
    };

  }



  const products = await response.json();



  return {

    products,

    total:
      Number(response.headers.get("X-WP-Total"))
      || products.length,


    totalPages:
      Number(response.headers.get("X-WP-TotalPages"))
      || 1

  };


}



/**
 * Filter Products
 */
export async function getFilteredProducts(
  params={},
  attributes=[]
){


  const query = new URLSearchParams(
    buildQuery(params)
  );


  attributes.forEach((attribute,index)=>{


    query.set(
      `attributes[${index}][attribute]`,
      attribute.taxonomy
    );


    query.set(
      `attributes[${index}][slug]`,
      attribute.slug
    );


  });



  const response = await storeApiFetch(

    `${BASE_URL}/wp-json/wc/store/v1/products?${query}`

  );



  if(!response){

    return {
      products:[],
      total:0,
      totalPages:1
    };

  }



  const products = await response.json();



  return {

    products,

    total:
      Number(response.headers.get("X-WP-Total"))
      || products.length,


    totalPages:
      Number(response.headers.get("X-WP-TotalPages"))
      || 1

  };


}



/**
 * Single Product
 */
export async function getProductBySlug(slug){


  const response = await storeApiFetch(

    `${BASE_URL}/wp-json/wc/store/v1/products/${encodeURIComponent(slug)}`

  );


  if(!response)
    return null;


  return response.json();

}



/**
 * Categories
 */
export async function getProductCategories(){


  const response = await storeApiFetch(

    `${BASE_URL}/wp-json/wc/store/v1/products/categories?per_page=100`

  );


  if(!response)
    return [];


  return response.json();

}



/**
 * Attributes
 */
export async function getAttributes(){


  const response = await storeApiFetch(

    `${BASE_URL}/wp-json/wc/store/v1/products/attributes`

  );


  if(!response)
    return [];


  return response.json();

}



export async function getAttributeTerms(attributeId){


  const response = await storeApiFetch(

    `${BASE_URL}/wp-json/wc/store/v1/products/attributes/${attributeId}/terms`

  );


  if(!response)
    return [];


  return response.json();

}



/**
 * Related Products
 */
export async function getRelatedProducts(
  productId,
  limit=4
){

  return getProducts({

    related:productId,

    per_page:limit

  });

}



/**
 * Reviews
 */
export async function getProductReviews(productId){


  const response = await storeApiFetch(

    `${BASE_URL}/wp-json/wc/store/v1/products/reviews?product_id=${productId}&per_page=10`

  );


  if(!response)
    return [];


  return response.json();

}



/**
 * All Products
 */
export async function getAllProducts(){


  const all=[];

  let page=1;



  while(true){


    const result =
      await getProductsPage({

        per_page:100,

        page

      });



    all.push(
      ...result.products
    );



    if(page >= result.totalPages)
      break;



    page++;


  }


  return all;

}



/**
 * Customer Account
 */
export async function getCustomer(customerId){


  const auth = Buffer
    .from(
      `${process.env.WC_CONSUMER_KEY}:${process.env.WC_CONSUMER_SECRET}`
    )
    .toString("base64");



  const response = await fetch(

    `${process.env.WC_API_URL}/customers/${customerId}`,

    {

      headers:{

        Authorization:`Basic ${auth}`

      },

      cache:"no-store"

    }

  );



  if(!response.ok)
    return null;



  return response.json();


}