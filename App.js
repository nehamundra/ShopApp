import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { createStore, combineReducers, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import OrderReducer from "./store/reducers/order";
import ProductReducer from "./store/reducers/product";
import ShopNavigation from "./navigation/ShopNavigation";
import CartReducer from "./store/reducers/cart";
import ReduxThunk from 'redux-thunk';
import AuthReducer from "./store/reducers/auth";
const rootReducer = combineReducers({
  products: ProductReducer,
  cart: CartReducer,
  orders: OrderReducer,
  auth: AuthReducer
});

const store = createStore(rootReducer, applyMiddleware(ReduxThunk));

export default function App() {
  return (
    <Provider store={store}>
      <ShopNavigation/>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
