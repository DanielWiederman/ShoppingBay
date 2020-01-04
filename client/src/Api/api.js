//PRODUCTS
export const ADD_PROD = "/api/shoppingbay/add-product";
export const GET_ALL_PROD = "/api/shoppingbay/get-all-products";
export const DELETE_PROD = "/api/shoppingbay/remove-product";
export const GET_PROD_BY_ID = "/api/shoppingbay/get-product-by-id";
export const EDIT_PROD = "/api/shoppingbay/update-product";
export const GET_PROD_CATEGORIES = "/api/shoppingbay/get-categories";
export const GET_PROD_BY_CATEGORY = "/api/shoppingbay/get-product-by-category";
export const SEARCH_PROD_BY_NAME_AND_CATEGORY = "/api/shoppingbay/get-prod-by-name";

//HOT-PRODUCTS
export const ADD_HOT_PRODUCT = "/api/shoppingbay/add-hot-product";
export const REMOVE_HOT_PRODUCT = "/api/shoppingbay/remove-hot-product";
export const GET_ALL_HOT_PRODUCT = "/api/shoppingbay/get-all-hot-product";

//SALES
export const DELETE_SALE = "/api/shoppingbay/remove-sale";
export const GET_SALE_BY_ID = "/api/shoppingbay/get-sale-by-id";
export const ADD_SALE = "/api/shoppingbay/add-sale";
export const GET_ALL_SALES = "/api/shoppingbay/get-all-sale";
export const UPDATE_SALE = "/api/shoppingbay/update-sale";
export const GET_ALL_SALEANDPRODUCTS = "/api/shoppingbay/get-all-saleAndProducts";
export const GET_SALE_PRODUCTS_BY_ID = "/api/shoppingbay/get-all-sale-products-by-id";
export const GET_ACTIVE_SALES = "/api/shoppingbay/get-active-sales";

//USER
export const GET_ALL_USERS = "/api/shoppingbay/get-all-users";
export const NEW_USER = "/api/shoppingbay/add-user";
export const GET_USER = "/api/shoppingbay/get-user";
export const USER_LOGOUT = "/api/user/logout-user";

//AUTH - LOGIN
export const UPDATE_USER = "/api/shoppingbay/update-user";
export const FORGOT_PASSWORD = "/api/shoppingbay/forgot-password";
export const LOGIN_WITH_TOKEN = "/api/shoppingbay/loginWithToken";
export const LOGIN_WITH_CRED = "/api/shoppingbay/loginWithCred";

//ORDER
export const NEW_ORDER = "/api/shoppingbay/new-order"
export const GET_ORDER_BY_USER_ID = "/api/shoppingbay/get-order-by-user-id"
export const GET_ALL_ORDERS = "/api/shoppingbay/get-all-orders"
export const UPDATE_ORDER = "/api/shoppingbay/update-order"
export const GET_ORDER_BY_ID = "/api/shoppingbay/get-order-by-id"
export const CANCEL_ORDER = "/api/shoppingbay/cancel-order"

//FAVORITE
export const GET_FAVORIT_PRODUCTS_ID_BY_USER_ID = "/api/shoppingbay/get-favorit-product-id-by-user-id" // user_id
export const TOGGLE_FAVORITE_PRODUCT = "/api/shoppingbay/toggle-item" //user_id, prod_id
export const GET_FAVORIT_PRODUCTS_BY_USER_ID = "/api/shoppingbay/get-favorit-products-by-user-id" //user_id

//ETC
export const UPLOAD_PICTURE = "/api/shoppingbay/add-image";