import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import ProductOverView from "../screens/shop/ProductOverviewScreen";
import ProductDetailScreen from "../screens/shop/ProductDetailScreen";
import Colors from "../constants/Colors";
import { Platform, SafeAreaView, Button, View } from "react-native";
import HeaderButton from "../components/UI/HeaderButton";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import CartScreen from "../screens/shop/CartScreen";
import OrderScreen from "../screens/shop/OrderScreen";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { Ionicons } from "@expo/vector-icons";
import UserProductScreen from "../screens/user/UserProductScreen";
import EditProductScreen from "../screens/user/EditProductScreen";
import AuthScreen from "../screens/user/AuthScreen";
import { useSelector, useDispatch } from "react-redux";
import * as authActions from "../store/actiions/auth"

const StackNav = createStackNavigator();
const Drawer = createDrawerNavigator();

const defaultScreenOption = {
  headerStyle: {
    backgroundColor: Platform.OS === "android" ? Colors.primary : "white",
  },
  headerTintColor: Platform.OS === "android" ? "white" : Colors.primary,
  headerTitleAlign: "center",
};
const defaultDrawerOptions = (navigation) => (
  <HeaderButtons HeaderButtonComponent={HeaderButton}>
    <Item
      title="Menu"
      iconName={Platform.OS === "android" ? "md-menu" : "ios-menu"}
      onPress={() => {
        navigation.openDrawer();
      }}
    />
  </HeaderButtons>
);
const ProductNavigation = () => (
  <StackNav.Navigator screenOptions={defaultScreenOption}>
    <StackNav.Screen
      name="ProductOverview"
      component={ProductOverView}
      options={({ navigation, route }) => ({
        title: "All Products",
        headerRight: () => (
          <HeaderButtons HeaderButtonComponent={HeaderButton}>
            <Item
              title="Cart"
              iconName={Platform.OS === "android" ? "md-cart" : "ios-cart"}
              onPress={() => {
                navigation.navigate("CartScreen");
              }}
            />
          </HeaderButtons>
        ),
        headerLeft: () => defaultDrawerOptions(navigation),
      })}
    />
    <StackNav.Screen
      name="ProductDetail"
      component={ProductDetailScreen}
      options={{
        title: "Product Detail",
      }}
    />
    <StackNav.Screen
      name="CartScreen"
      component={CartScreen}
      options={{
        title: "Your Cart",
      }}
    />
  </StackNav.Navigator>
);
const OrderNavigation = () => (
  <StackNav.Navigator screenOptions={defaultScreenOption}>
    <StackNav.Screen
      name="Orders"
      component={OrderScreen}
      options={({ navigation, route }) => ({
        title: "Your Orders",
        headerLeft: () => defaultDrawerOptions(navigation),
      })}
    />
  </StackNav.Navigator>
);

const UserAdminNavigation = () => (
  <StackNav.Navigator screenOptions={defaultScreenOption}>
    <StackNav.Screen
      name="Admin"
      component={UserProductScreen}
      options={({ navigation, route }) => ({
        title: "Your Products",
        headerLeft: () => defaultDrawerOptions(navigation),
        headerRight: () => (
          <HeaderButtons HeaderButtonComponent={HeaderButton}>
            <Item
              title="Add"
              iconName={Platform.OS === "android" ? "md-create" : "ios-create"}
              onPress={() => {
                navigation.navigate("EditProduct");
              }}
            />
          </HeaderButtons>
        ),
      })}
    />
    <StackNav.Screen
      name="EditProduct"
      component={EditProductScreen}
      options={({ navigation, route }) => {
        const submitFn = route.params?.submit;
        return {
          title: route.params?.product ? "Edit Product" : "Add Product",
          headerRight: () => (
            <HeaderButtons HeaderButtonComponent={HeaderButton}>
              <Item
                title="Save"
                iconName={
                  Platform.OS === "android" ? "md-checkmark" : "ios-checkmark"
                }
                onPress={submitFn}
              />
            </HeaderButtons>
          ),
        };
      }}
    />
  </StackNav.Navigator>
);

const AuthNavigator = () => (
  <StackNav.Navigator screenOptions={defaultScreenOption}>
    <StackNav.Screen
      name="Auth"
      component={AuthScreen}
      options={{
        title: "Authentication",
      }}
    />
  </StackNav.Navigator>
);

const CustomDrawerContent = (props) => {
  const dispatch = useDispatch();
  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={{
        flex: 1,
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <SafeAreaView forceInset={{ top: "always", horizontal: "never" }}>
        <DrawerItemList {...props} />
      </SafeAreaView>
      <View style={{ padding: 20 }}>
        <Button title="Logout" color={Colors.primary} onPress={()=>{dispatch(authActions.logout())}}/>
      </View>
    </DrawerContentScrollView>
  );
};

const ShopNavigation = () => (
  <Drawer.Navigator
    initialRouteName="Shop"
    drawerContentOptions={{
      activeTintColor: Colors.primary,
    }}
    drawerContent={(props) => <CustomDrawerContent {...props} />}
  >
    <Drawer.Screen
      name="Shop"
      component={ProductNavigation}
      options={{
        drawerIcon: (drawerConfig) => (
          <Ionicons
            name={Platform.OS === "android" ? "md-cart" : "ios-cart"}
            size={26}
            color={drawerConfig.color}
          />
        ),
      }}
    />
    <Drawer.Screen
      name="Orders"
      component={OrderNavigation}
      options={{
        drawerLabel: "Your Orders",
        drawerIcon: (drawerConfig) => (
          <Ionicons
            name={Platform.OS === "android" ? "md-list" : "ios-list"}
            size={26}
            color={drawerConfig.color}
          />
        ),
      }}
    />
    <Drawer.Screen
      name="Admin"
      component={UserAdminNavigation}
      options={{
        drawerLabel: "Admin",
        drawerIcon: (drawerConfig) => (
          <Ionicons
            name={Platform.OS === "android" ? "md-create" : "ios-create"}
            size={26}
            color={drawerConfig.color}
          />
        ),
      }}
    />
  </Drawer.Navigator>
);
const MainNavigation = () => {
  const isUserLoggedIn = useSelector((state) => state.auth.isUserLoggedIn);
  return (
    <NavigationContainer>
      {isUserLoggedIn ? <ShopNavigation /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

export default MainNavigation;
