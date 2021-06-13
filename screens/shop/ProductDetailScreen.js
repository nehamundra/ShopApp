import React from "react";
import {
  View,
  Text,
  Image,
  Button,
  StyleSheet,
  ScrollView,
} from "react-native";
import Colors from "../../constants/Colors";
import { useDispatch } from "react-redux";
import * as cartActions from "../../store/actiions/cart";
const ProductDetailScreen = (props) => {
  const { product } = props.route.params;
  props.navigation.setOptions({ title: product.title });
  const dispatch = useDispatch();
  const onAddToCart = () => {
    dispatch(cartActions.addToCart(product));
  };
  return (
    <ScrollView>
      <Image style={styles.image} source={{ uri: product.imageUrl }} />
      <View style={styles.btnContainer}>
        <Button
          color={Colors.accent}
          onPress={onAddToCart}
          title="Add To Cart"
        />
      </View>
      <Text style={styles.price}>${product.price.toFixed(2)}</Text>
      <Text style={styles.description}>{product.description}</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: 300,
  },
  price: {
    fontSize: 20,
    color: "violet",
    textAlign: "center",
    marginVertical: 20,
  },
  description: {
    fontSize: 14,
    textAlign: "center",
  },
  btnContainer: {
    marginVertical: 10,
    alignItems: "center",
  },
});

export default ProductDetailScreen;
