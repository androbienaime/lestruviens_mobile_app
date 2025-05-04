import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { Product } from "@/src/@types/models";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import React from "react";
import { Dimensions, Pressable, Text } from "react-native";
import { Image, StyleSheet, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

type Props = {
    item : Product,
    index: number
};

const width = Dimensions.get("window").width - 40;

const ProductCard = ({item, index} : Props) => {
    return (
        // <Link href={`/product-details/${item.id}`} asChild>
            <Pressable>
                <Animated.View style={styles.container} entering={FadeInDown.delay(300 + index * 100).duration(500)}>
                    <Image source={{ uri: 'http://172.20.10.7:8000'+item.coverImage}} style={styles.productImg} />
                    <Pressable style={styles.bookmark}>
                        <Ionicons name="heart-outline" size={22} color={"#000"} />
                    </Pressable>
                    <View style={styles.productInfo}>
                        <Text style={styles.price}>${item.price}</Text>
                        <View style={styles.ratingWrapper}>
                            <Ionicons name="star" size={20} color={"#D4AF34"} />
                            <Text style={styles.rating}>4.7</Text>
                        </View>
                    </View>
                    <Text style={styles.title}>{item.name}</Text>
                </Animated.View>
            </Pressable>
        // </Link>
    )
}

export default ProductCard;

const styles = StyleSheet.create({
    container:{
        width: width / 2,
        height: 184,
        marginLeft: 18,
        borderRadius: 14,
        backgroundColor: "#fff"
    },
    productImg:{
        width: "100%",
        height: 150,
        borderRadius: 14,
        marginBottom: 10
    },
    bookmark:{
        position: "absolute",
        right: 15,
        top: 15,
        backgroundColor: "rgba(255, 255, 255, 0.5)",
        padding: 5,
        borderRadius: 30
    },
    title:{
        fontSize: 14,
        fontWeight: "400",
        color: Colors.light.text,
        letterSpacing: 1.1
    },
    productInfo:{
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 8
    },
    price:{
        fontSize: 16,
        fontWeight: "700",
        color: Colors.light.tint
    },
    ratingWrapper:{
        flexDirection: "row",
        alignItems: "center",
        gap: 5
    },
    rating:{
        fontSize: 14,
        color: "#222"
    }
})