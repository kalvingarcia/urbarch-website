let BASE_URL;
if(process.env.NODE_ENV === "development")
    BASE_URL = "http://localhost:3000";
else
    BASE_URL = "http://urbarch-website.projects.kalvingarcia.com";

export const GET_PRODUCTS = `${BASE_URL}/api/product`;
export const GET_FEATURED_PRODUCTS = `${BASE_URL}/api/product/featured`;
export const GET_RELATED_PRODUCTS = `${BASE_URL}/api/product/related`;
export const GET_PRODUCT_TAGS = `${BASE_URL}/api/product/tag`;

export const GET_SALVAGE = `${BASE_URL}/api/salvage`;
export const GET_RELATED_SALVAGE = `${BASE_URL}/api/salvage/related`;
export const GET_SALVAGE_TAGS = `${BASE_URL}/api/salvage/tag`;

export const GET_CUSTOMS = `${BASE_URL}/api/custom`;
export const GET_RELATED_CUSTOMS = `${BASE_URL}/api/custom/related`;