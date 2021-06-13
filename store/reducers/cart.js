import { ADD_TO_CART, REMOVE_FROM_CART } from "../actiions/cart";
import CartItem from "../../models/CartItem";
import { ADD_ORDER } from "../actiions/orders";
import { DELETE_PRODUCT } from "../actiions/product";
const initialState = {
  items: {},
  totalAmount: 0,
};

const CartReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_TO_CART:
      const addedProduct = action.product;
      const prodPrice = addedProduct.price;
      const prodTitle = addedProduct.title;

      let updatedOrNewCartItem;
      if (state.items[addedProduct.id]) {
        updatedOrNewCartItem = new CartItem(
          state.items[addedProduct.id].quantity + 1,
          prodPrice,
          prodTitle,
          state.items[addedProduct.id].sum + prodPrice
        );
        return {
          ...state,
          items: {
            ...state.items,
            [addedProduct.id]: updatedOrNewCartItem,
          },
          totalAmount: state.totalAmount + prodPrice,
        };
      } else {
        updatedOrNewCartItem = new CartItem(1, prodPrice, prodTitle, prodPrice);
        return {
          ...state,
          items: {
            ...state.items,
            [addedProduct.id]: updatedOrNewCartItem,
          },
          totalAmount: state.totalAmount + prodPrice,
        };
      }
    case REMOVE_FROM_CART:
      const updatedCartIems = { ...state.items };
      const selectedCartItem = updatedCartIems[action.pid];
      if (selectedCartItem.quantity > 1) {
        selectedCartItem.quantity -= 1;
        selectedCartItem.sum -= selectedCartItem.productPrice;
      } else {
        delete updatedCartIems[action.pid];
      }
      return {
        ...state,
        items: updatedCartIems,
        totalAmount: state.totalAmount - selectedCartItem.productPrice,
      };

    case ADD_ORDER:
      return initialState;

    case DELETE_PRODUCT:
      if (!state.items[action.pid]) {
        return state;
      }
      const updatedItem = { ...state.items };
      const itemTotal = updatedItem[action.pid].sum;
      delete updatedItem[action.pid];
      return {
        ...state,
        items: updatedItem,
        totalAmount: state.totalAmount - itemTotal,
      };
  }
  return state;
};

export default CartReducer;
