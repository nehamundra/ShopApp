import React from "react";
import { FlatList, Alert, View, Text, StyleSheet } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import ProductItem from "../../components/shop/ProductItem";
import * as productActions from "../../store/actiions/product";

const UserProductScreen = (props) => {
  const userProducts = useSelector((state) => state.products.userProducts);
  const dispatch = useDispatch();
  const editProduct = (product) => {
    props.navigation.navigate("EditProduct", {
      product: product,
    });
  };

  const deleteHandler = (id) => {
    Alert.alert("Are You Sure?", "This will be deleted permanently!!", [
      { text: "No", style: "cancel" },
      {
        text: "Yes",
        style: 'destructive',
        onPress: () => {
          dispatch(productActions.deleteProduct(id));
        },
      },
    ]);
  };

  if(!userProducts.length){
    return <View style={styles.screen}>
      <Text>No Products found</Text>
    </View>
  }
  return (
    <FlatList
      data={userProducts}
      keyExtractor={(item) => item.id}
      renderItem={(itemData) => (
        <ProductItem
          product={itemData.item}
          userAdmin
          onDeleteProduct={()=>deleteHandler(itemData.item.id)}
          onEditProduct={() => editProduct(itemData.item)}
          onViewDetail={() => editProduct(itemData.item)}
        />
      )}
    />
  );
};

const styles=StyleSheet.create({
  screen:{
    flex:1,
    justifyContent:'center',
    alignItems:'center'
  }
})

export default UserProductScreen;
