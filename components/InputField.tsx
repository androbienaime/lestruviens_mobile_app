import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TextInput, View } from "react-native";
import { StyleSheet } from "react-native";

type props = {
    label?: string;
    error?: string;
    helperText?: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    fullWidth?: boolean;
    onTogglePasswordVisibility?: () => void;
    isPasswordInput?: boolean;
}

export default function InputField({ label, ...props }: React.ComponentProps<typeof TextInput> & { label?: string }) {
    return(
        <View style={styles.inputContainer}>
            {label && (
                <Ionicons name="mail-outline" size={22} color="#7B8794" style={styles.inputIcon} />
            )}
            <TextInput
                style={styles.input}
                {...props}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    inputText:{
        height: 50,
        backgroundColor: '#F3F4F6',
        borderRadius: 14,
        paddingHorizontal: 16,
        fontSize: 16,
        color: '#111827',
        marginBottom: 16,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        marginBottom: 16,
        paddingHorizontal: 16,
        height: 56,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
      },
      inputIcon: {
        marginRight: 12,
      },
      input: {
        flex: 1,
        fontSize: 16,
        color: '#1A2138',
      },
})