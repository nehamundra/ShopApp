import React, { useState, useEffect, useCallback, useReducer } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  ActivityIndicator,
} from "react-native";
import { useDispatch } from "react-redux";
import * as productActions from "../../store/actiions/product";
import Input from "../../components/UI/Input";
import Colors from "../../constants/Colors";

const FORM_UPDATE = "FORM_UPDATE";
const FORM_VALID = "FORM_VALID";
const fromReducer = (state, action) => {
  if (action.type === FORM_UPDATE) {
    const updatedValues = {
      ...state.inputValues,
      [action.input]: action.value,
    };
    const updatedValidities = {
      ...state.inputValidities,
      [action.input]: action.isValid,
    };
    let formIsValid = true;
    for (const key in updatedValidities) {
      formIsValid = formIsValid && updatedValidities[key];
    }
    return {
      formIsValid: formIsValid,
      inputValues: updatedValues,
      inputValidities: updatedValidities,
    };
  }
  if (action.type === FORM_VALID) {
    const updatedValidities = {
      ...state.inputValidities,
      [action.input]: action.isValid,
    };
    let formIsValid = true;
    for (const key in updatedValidities) {
      formIsValid = formIsValid && updatedValidities[key];
    }
    return {
      ...state,
      formIsValid: formIsValid,
      inputValidities: updatedValidities,
    };
  }
  return state;
};

const EditProductScreen = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const product = props.route.params?.product;
  const dispatch = useDispatch();
  const [formState, dispatchFormState] = useReducer(fromReducer, {
    inputValues: {
      title: product ? product.title : "",
      imageUrl: product ? product.imageUrl : "",
      price: product ? product.imageUrl : "",
      desc: product ? product.description : "",
    },
    inputValidities: {
      title: true,
      imageUrl: true,
      price: true,
      desc: true,
    },
    formIsValid: product ? true : false,
  });
  const submitHandler = useCallback(async () => {
    if (!formState.formIsValid) {
      Alert.alert("Invalid Input", "Please enter valid inputs", [
        { text: "OK", style: "default" },
      ]);
      return;
    }
    const { title, desc, imageUrl, price } = { ...formState.inputValues };
    setError(null);
    setIsLoading(true);
    try {
      product
        ? await dispatch(
            productActions.updateProduct(product.id, title, desc, imageUrl)
          )
        : await dispatch(
            productActions.createProduct(title, desc, imageUrl, +price)
          );
      setIsLoading(false);
      props.navigation.goBack();
    } catch {
      (err) => {
        setError(err.message);
      };
    }
  }, [dispatch, formState]);

  useEffect(() => {
    props.navigation.setParams({ submit: submitHandler });
  }, [dispatch, formState]);

  useEffect(() => {
    if (error) {
      Alert.alert("An error occured", error, [{ text: "Ok" }]);
    }
  }, [error]);

  const textChangeHandler = (text, inputIdentifier) => {
    let isValid =
      inputIdentifier === "price" ? +text > 0 : text.trim().length > 0;
    dispatchFormState({
      type: FORM_UPDATE,
      value: text,
      isValid,
      input: inputIdentifier,
    });
  };

  const textValidationOnBlur = (inputIdentifier) => {
    dispatchFormState({
      type: FORM_VALID,
      isValid: formState.inputValues[inputIdentifier].length > 0,
      input: inputIdentifier,
    });
  };
  if (isLoading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }
  return (
    <KeyboardAvoidingView style={{ flex: 1 }} keyboardVerticalOffset={1}>
      <ScrollView>
        <View style={styles.form}>
          <Input
            label="title"
            labelText="Title"
            textChangeHandler={textChangeHandler}
            autoCapitalize="sentences"
            errorText="Please enter valid title"
            formState={formState}
            textValidationOnBlur={textValidationOnBlur}
          />
          <Input
            label="imageUrl"
            labelText="Image URL"
            textChangeHandler={textChangeHandler}
            errorText="Please enter valid Image URL"
            formState={formState}
            textValidationOnBlur={textValidationOnBlur}
          />

          {product ? null : (
            <Input
              label="price"
              labelText="Price"
              textChangeHandler={textChangeHandler}
              keyboardType="decimal-pad"
              errorText="Please enter valid Price"
              formState={formState}
              textValidationOnBlur={textValidationOnBlur}
            />
          )}
          <Input
            label="desc"
            labelText="Description"
            textChangeHandler={textChangeHandler}
            autoCapitalize="sentences"
            errorText="Please enter valid Description"
            numberOfLines={3}
            formState={formState}
            textValidationOnBlur={textValidationOnBlur}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  form: {
    margin: 20,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default EditProductScreen;
