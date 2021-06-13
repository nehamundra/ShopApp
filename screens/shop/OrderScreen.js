import React, { useEffect, useState } from "react";
import { StyleSheet, FlatList, ActivityIndicator, View, Text } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import OrderItem from "../../components/shop/OrderItem";
import Colors from "../../constants/Colors";
import * as OrdersAction from "../../store/actiions/orders";

const OrdersScreen = (props) => {
  const orders = useSelector((state) => state.orders.orders);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    (async () => {
      setIsLoading(true);
      await dispatch(OrdersAction.fetchOrders());
      setIsLoading(false);
    })();
  }, [dispatch]);

  if (isLoading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }
  if(!orders.length){
    return <View style={styles.screen}>
      <Text>No Orders found</Text>
    </View>
  }
  return (
    <FlatList
      data={orders}
      keyExtractor={(item) => item.id}
      renderItem={(itemData) => <OrderItem item={itemData.item} />}
    />
  );
};

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  screen:{
    flex:1,
    justifyContent:'center',
    alignItems:'center'
  }
});
export default OrdersScreen;
