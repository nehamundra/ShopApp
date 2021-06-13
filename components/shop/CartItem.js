import React from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableNativeFeedback,
  Platform,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const TouchableComponent =
  Platform.OS === "android" ? TouchableNativeFeedback : TouchableOpacity;
const CartItem = (props) => {
  return (
    <View style={styles.cartItem}>
      <View style={styles.itemData}>
        <Text style={styles.quantity}>{props.item.quantity}</Text>
        <Text style={styles.mainText}>{props.item.productTitle}</Text>
      </View>
      <View style={styles.itemData}>
        <Text style={styles.mainText}>${props.item.sum.toFixed(2)}</Text>
        {props.deletable && (
          <TouchableComponent onPress={props.onRemove} style={styles.deleteBtn}>
            <Ionicons
              name={Platform.OS === "android" ? "md-trash" : "ios-trash"}
              size={23}
              color="red"
            />
          </TouchableComponent>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cartItem: {
    padding: 10,
    backgroundColor: "white",
    flexDirection: "row",
    justifyContent: "space-around",
  },
  itemData: {
    flexDirection: "row",
    alignItems: "center",
  },
  quantity: {
    color: "violet",
    fontSize: 16,
    fontWeight: "700",
    marginRight: 5,
  },
  mainText: {
    fontWeight: "700",
    fontSize: 16,
  },
  deleteBtn: {
    marginLeft: 20,
  },
});

export default CartItem;
