import React, { useState, useEffect, useCallback } from "react";
import {
  FlatList,
  ActivityIndicator,
  View,
  StyleSheet,
  Text,
  Button,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import ProductItem from "../../components/shop/ProductItem";
import Colors from "../../constants/Colors";
import * as cartActions from "../../store/actiions/cart";
import * as productActions from "../../store/actiions/product";
const ProductOverView = (props) => {
  const products = useSelector((state) => state.products.availableProducts);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();

  const loadProducts = useCallback(async () => {
    setError(null);
    try {
      setIsRefreshing(true);
      await dispatch(productActions.fetchProducts());
    } catch (err) {
      setError(err.message);
    }
    setIsRefreshing(false);
  }, [dispatch, setIsLoading, setError]);

  useEffect(() => {
    const willFocusSub = props.navigation.addListener(
      "willFocus",
      loadProducts
    );
    return () => {
      // willFocusSub.remove();
    };
  }, [loadProducts]);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      await loadProducts();
      setIsLoading(false);
    })();
  }, [dispatch, loadProducts]);

  if (error) {
    return (
      <View style={styles.loader}>
        <Text>An Error occured</Text>
        <Button
          title="try again"
          onPress={loadProducts}
          color={Colors.primary}
        />
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!isLoading && !products.length) {
    return (
      <View style={styles.loader}>
        <Text>No Products Found.</Text>
      </View>
    );
  }
  return (
    <FlatList
      onRefresh={loadProducts}
      refreshing={isRefreshing}
      data={products}
      keyExtractor={(item) => item.id}
      renderItem={(itemData) => (
        <ProductItem
          product={itemData.item}
          overview
          onViewDetail={() => {
            props.navigation.navigate("ProductDetail", {
              product: itemData.item,
            });
          }}
          onAddtoCart={() => {
            dispatch(cartActions.addToCart(itemData.item));
          }}
        />
      )}
    />
  );
};

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ProductOverView;
