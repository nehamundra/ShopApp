import React from 'react';
import {View, TextInput, Text, StyleSheet} from 'react-native';
import Colors from "../../constants/Colors"

const Input=props=>{
    return (
        <View style={styles.formControl}>
          <Text style={styles.label}>{props.labelText}</Text>
          <TextInput
          {...props}
            style={styles.input}
            value={props.formState.inputValues[props.label]}
            onChangeText={(text) => props.textChangeHandler(text, props.label)}
            onBlur={()=>props.textValidationOnBlur(props.label)}
          />
          {!props.formState.inputValidities[props.label] && (
            <View style={styles.errorText}><Text style={styles.errorText}>{props.errorText}</Text></View>
          )}
        </View>
    )
}

const styles=StyleSheet.create({
    formControl: {
        width: "100%",
      },
      label: {
        fontWeight: "700",
        marginVertical: 8,
      },
      input: {
        paddingHorizontal: 2,
        paddingVertical: 5,
        borderBottomColor: Colors.primary,
        borderBottomWidth: 1,
      },
      errorText:{
        color:'red'
      }
});

export default Input