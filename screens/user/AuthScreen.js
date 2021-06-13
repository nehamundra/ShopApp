import React, { useReducer, useState, useEffect } from "react";
import {
  ScrollView,
  View,
  KeyboardAvoidingView,
  StyleSheet,
  Button,
  ActivityIndicator,
  Alert,
} from "react-native";
import Card from "../../components/UI/Card";
import Input from "../../components/UI/Input";
import Colors from "../../constants/Colors";
import { LinearGradient } from "expo-linear-gradient";
import { useDispatch } from "react-redux";
import * as authActions from "../../store/actiions/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

const FORM_UPDATE = "FORM_UPDATE";
const FORM_VALID = "FORM_VALID";
const fromReducer = (state, action) => {
  if (action.type === FORM_UPDATE) {
    const updatedValues = {
      ...state.inputValues,
      [action.input]: action.value,
    };

    return {
      ...state,
      inputValues: updatedValues,
    };
  }
  if (action.type === FORM_VALID) {
    const updatedValidities = {
      ...state.inputValidities,
      [action.input]: action.isValid,
    };
    let updatedformValidity = true;
    for (const key in updatedValidities) {
      updatedformValidity = updatedformValidity && updatedValidities[key];
    }
    return {
      ...state,
      formIsValid: updatedformValidity,
      inputValidities: updatedValidities,
    };
  }
  return state;
};

const AuthScreen = (props) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [authLoading, setIsAuthLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [formState, dispatchFormState] = useReducer(fromReducer, {
    inputValues: {
      email: "",
      password: "",
    },
    inputValidities: {
      email: true,
      password: true,
    },
    formIsValid: false,
  });
  useEffect(() => {
    (async () => {
      setIsAuthLoading(true);
      const userData = await AsyncStorage.getItem("userData");
      setIsAuthLoading(false);
      if (!userData) {
        return;
      }
      const transformedData = JSON.parse(userData);
      const { token, userId, expiryDate } = transformedData;
      const expirationDate = new Date(expiryDate);
      if (expirationDate <= new Date() || !token || !userId) {
        return;
      }
      const expirationDate2 = expirationDate.getTime() - new Date().getTime();
      dispatch(authActions.automaticLogin(token, userId, true, expirationDate2));
    })();
  }, []);

  const isValidEmail = (email) => {
    const re =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  };

  const textChangeHandler = (text, inputIdentifier) => {
    dispatchFormState({
      type: FORM_UPDATE,
      value: text,
      input: inputIdentifier,
    });
  };

  const textValidationOnBlur = (inputIdentifier) => {
    let isValid = false;

    if (inputIdentifier === "email") {
      isValid = isValidEmail(formState.inputValues[inputIdentifier]);
    }
    if (inputIdentifier === "password") {
      isValid = formState.inputValues[inputIdentifier].trim().length >= 8;
    }
    dispatchFormState({
      type: FORM_VALID,
      isValid: isValid,
      input: inputIdentifier,
    });
  };

  const clearData = () => {
    for (const key in formState.inputValues) {
      textChangeHandler("", key);
    }
  };

  const authHandler = async () => {
    for (const key in formState.inputValues) {
      textValidationOnBlur(key);
    }
    if (formState.formIsValid) {
      try {
        setIsLoading(true);
        await dispatch(
          isSignUp
            ? authActions.signup(
                formState.inputValues.email,
                formState.inputValues.password
              )
            : authActions.signin(
                formState.inputValues.email,
                formState.inputValues.password
              )
        );
      } catch (err) {
        Alert.alert("Network Error", err.message, [
          { text: "OK", style: "default" },
        ]);
      }
      setIsLoading(false);
      clearData();
    } else {
      Alert.alert("Invalid Input", "Please enter valid inputs", [
        { text: "OK", style: "default" },
      ]);
      return;
    }
  };

  if (authLoading) {
    return (
      <View style={styles.screen}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      keyboardVerticalOffset={1}
      style={styles.screen}
    >
      <LinearGradient colors={["#ffedff", "#ffe3ff"]} style={styles.gradient}>
        <Card style={styles.card}>
          <ScrollView>
            <Input
              labelText="E-mail"
              label="email"
              formState={formState}
              textChangeHandler={textChangeHandler}
              errorText="Please enter valid email"
              textValidationOnBlur={textValidationOnBlur}
              autoCapitalize="none"
              keyboardType="email-address"
            />
            <Input
              labelText="Password"
              label="password"
              formState={formState}
              textChangeHandler={textChangeHandler}
              errorText="Please enter valid passoword"
              autoCapitalize="none"
              textValidationOnBlur={textValidationOnBlur}
              secureTextEntry={true}
            />
            {isLoading ? (
              <ActivityIndicator size={25} color={Colors.primary} />
            ) : (
              <>
                <View style={styles.btnContainer}>
                  <Button
                    title={isSignUp ? "Sign Up" : "Login"}
                    onPress={authHandler}
                    color={Colors.primary}
                  />
                </View>
                <View style={styles.btnContainer}>
                  <Button
                    title={`Switch to ${isSignUp ? "Login" : "Sign Up"}`}
                    onPress={() => {
                      setIsSignUp((prevState) => !prevState);
                    }}
                    color={Colors.accent}
                  />
                </View>
              </>
            )}
          </ScrollView>
        </Card>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  gradient: {
    height: "100%",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: "80%",
    maxWidth: 400,
    padding: 15,
    maxHeight: 400,
  },
  inputContainer: {
    margin: 10,
  },
  btnContainer: {
    marginTop: 10,
  },
});
export default AuthScreen;
