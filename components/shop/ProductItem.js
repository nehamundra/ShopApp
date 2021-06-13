import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Button,
  TouchableOpacity,
  TouchableNativeFeedback,
  Platform,
} from "react-native";
import Colors from "../../constants/Colors";
import Card from "../UI/Card"

const ProductItem = (props) => {
  const TouchableComponent =
    Platform.OS === "android" ? TouchableNativeFeedback : TouchableOpacity;
  return (
    <Card style={styles.product}>
      <TouchableComponent onPress={props.onViewDetail} useForeground>
        <View>
          <View style={styles.imageContainer}>
            <Image
              style={styles.image}
              source={{ uri: props.product.imageUrl }}
            />
          </View>
          <View style={styles.detailContainer}>
            <Text style={styles.title}>{props.product.title}</Text>
            <Text style={styles.price}>${props.product.price.toFixed(2)}</Text>
          </View>
          {props.overview && (
            <View style={styles.buttonContainer}>
              <Button
                color={Colors.primary}
                title="View Details"
                onPress={props.onViewDetail}
              />
              <Button
                color={Colors.accent}
                title="Add to Cart"
                onPress={props.onAddtoCart}
              />
            </View>
          )}
          {props.userAdmin && (<View style={styles.buttonContainer}>
              <Button
                color={Colors.accent}
                title="Edit"
                onPress={props.onEditProduct}
              />
              <Button
                color={Colors.primary}
                title="Delete"
                onPress={props.onDeleteProduct}
              />
            </View>)}
        </View>
      </TouchableComponent>
    </Card>
  );
};

const styles = StyleSheet.create({
  product: {
    
    height: 300,
    margin: 20,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  title: {
    fontSize: 18,
    marginVertical: 4,
    fontWeight: "700",
  },
  price: {
    fontSize: 14,
    color: "violet",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    height: "25%",
  },
  detailContainer: {
    alignItems: "center",
    height: "15%",
    padding: 10,
    marginHorizontal: 10,
  },
  imageContainer: {
    width: "100%",
    height: "60%",
    overflow: "hidden",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
});

export default ProductItem;
