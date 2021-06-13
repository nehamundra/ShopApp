import PRODUCTS from "../../data/dummy-data";
import Product from "../../models/Product";
import {
  CREATE_PRODUCT,
  DELETE_PRODUCT,
  SET_PRODUCTS,
  UPDATE_PRODUCT,
} from "../actiions/product";
const initialState = {
  availableProducts: [],
  userProducts: [],
};

const ProductReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_PRODUCTS:
      return{
        ...state,
        availableProducts: action.products,
        userProducts: action.userProducts
      }
    case CREATE_PRODUCT:
      const newProduct = new Product(
        action.prodData.id,
        action.prodData.ownerId,
        action.prodData.title,
        action.prodData.imageURL,
        action.prodData.description,
        action.prodData.price
      );
      return {
        ...state,
        availableProducts: state.availableProducts.concat(newProduct),
        userProducts: state.userProducts.concat(newProduct),
      };
    case UPDATE_PRODUCT:
      const productIndex = state.userProducts.findIndex(
        (prod) => prod.id === action.pid
      );
      const availableProdIndex = state.availableProducts.findIndex(
        (prod) => prod.id === action.pid
      );
      const updatedProduct = new Product(
        action.pid,
        state.userProducts[productIndex].ownerId,
        action.prodData.title,
        action.prodData.imageURL,
        action.prodData.description,
        state.userProducts[productIndex].price
      );
      const updatedUserProducts = [...state.userProducts];
      updatedUserProducts[productIndex] = updatedProduct;
      const updatedAvailableProducts = [...state.availableProducts];
      updatedAvailableProducts[availableProdIndex] = updatedProduct;
        
      return {
        ...state,
        userProducts: updatedUserProducts,
        availableProducts: updatedAvailableProducts,
      };
    case DELETE_PRODUCT:
      return {
        ...state,
        userProducts: state.userProducts.filter(
          (prod) => prod.id !== action.pid
        ),
        availableProducts: state.availableProducts.filter(
          (prod) => prod.id !== action.pid
        ),
      };
  }
  return state;
};

export default ProductReducer;
