import { ADD_ORDER, SET_ORDERS } from "../actiions/orders";
import Order from "../../models/Order";
const initialState = {
  orders: [],
};

const OrderReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_ORDERS:
      return{
        orders: action.orders
      }
    case ADD_ORDER:
      const newOrder = new Order(
        action.orderData.id,
        action.orderData.items,
        action.orderData.amount,
        action.orderData.date
      );

      return{
          ...state,
          orders: state.orders.concat(newOrder)
      }
  }
  return state;
};

export default OrderReducer;
