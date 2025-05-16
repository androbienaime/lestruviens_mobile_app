import React, { ReactNode, useRef } from "react";
import { Animated, StyleSheet } from "react-native";

type Props = {
    children: ReactNode;
}

const CustomAnimated = ({ children, ...props }: Props) => {
    // Animation values
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;

    // Start animations on component mount
    React.useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 800,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    return (
        <Animated.View 
            style={[
                styles.formContainer,
                { 
                    opacity: fadeAnim,
                    transform: [{ translateY: slideAnim }]
                }
            ]}
            {...props}
        >
            {children}
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    formContainer:{
        flex:1
    }
});
export default CustomAnimated;
