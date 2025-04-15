import { Colors } from "@/constants/Colors";
import React from "react";
import { Text, TextInput, View } from "react-native";
import { StyleSheet } from "react-native";

type Props = {}

export default function InputField(props : React.ComponentProps<typeof TextInput>){
    return(
        <TextInput 
            style={styles.inputText} { ...props } />
    )
    
}

const styles = StyleSheet.create({
    inputText:{
        backgroundColor: "#fff",
        paddingVertical: 12,
        paddingHorizontal: 18,
        alignSelf : "stretch",
        borderRadius: 5,
        fontSize: 16,
        marginBottom: 20,
        width: "100%"
    }
})