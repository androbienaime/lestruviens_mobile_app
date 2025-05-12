import Header from "@/components/Header";
import ProductSlider from "@/components/ProductSlider";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { ShopStackParamList } from "@/src/@types/navigation";
import { useThemeColors, typography, useThemeTypography } from '@/theme';
import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useMemo, useState } from "react";
import { Image, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Declination } from '../../src/@types/models';
import CustomRadioInput from "@/components/CustomRadioInput";


type Props = NativeStackScreenProps<ShopStackParamList, 'ProductDetails'>;

const ProductDetailsScreen: React.FC<Props> = ({ route, navigation }) => {
    const {product} = route.params;
    const colors = useThemeColors();
    const typography = useThemeTypography();
    
    const [selectedOption, setSelectedOption] = useState<string>('');
    const [selectedSize, setSelectedSize] = useState<string>('');

  
    const handleRadioSelect = (value: string) => {
      setSelectedOption(value);
      console.log('Option sélectionnée:', value);
    };

    const handleSizeSelect = (value: string) => {
        setSelectedSize(value);
        console.log('Taille sélectionnée:', value);
      };

      // Options pour le type couleur
      const handleOptionSelect = (value: string) => {
        setSelectedOption(value);
        console.log('Option sélectionnée:', value);
      };

      const sizeOptions = [
        { value: 'S',  type: 'text' as const, content: 'S' },
        { value: 'M',  type: 'text' as const, content: 'M' },
        { value: 'L', type: 'text' as const, content: 'L' },
        { value: 'XL',  type: 'text' as const, content: 'XL' },
      ];
    
      const mixedOptions = [
        { value: 'RED',  type: 'color' as const, content: '#FF0000' },
        { value: 'CASUAL',  type: 'image' as const, content: '', imageSource: { uri: 'https://cdn.pixabay.com/photo/2022/07/01/14/22/chain-link-fence-7295711_960_720.jpg' } },
        { value: 'GREEN',  type: 'color' as const, content: '#00FF00' },
        { value: 'BLUE',  type: 'color' as const, content: '#0000FF' },
        { value: 'FORMAL',  type: 'image' as const, content: '', imageSource: { uri: 'https://via.placeholder.com/40' } },
      ];
    const styles = useMemo(() => createStyles(colors, typography), [colors, typography]);

    return (
        <>
            <SafeAreaView style={styles.controlThemedView}>
                <ThemedView style={styles.controlThemedView}>
                    <Header 
                        previousButton={true}
                        backgroundColor={colors.background.white} 
                        inputBackground={colors.background.primary} 
                    />
                    <ThemedView style={styles.controlThemedView}>
                        <ProductSlider 
                            images={product.images}
                            autoplay={false} 
                            horizontalMargin={0}
                            marginVertical={0}
                            height={400}
                        />

                        <ThemedView style={styles.container}>
                            <View style={styles.detailsContainer}>
                                <ThemedView style={styles.controlThemedView}>
                                    <ThemedText style={styles.productDetails}>Details du produit</ThemedText>
                                    <ThemedText style={styles.productTitle}>{product.name}</ThemedText>
                                </ThemedView>
                                <ThemedView style={[styles.controlThemedView, styles.detailsIcons]}>
                                    <Ionicons name="share-outline" size={32} />
                                    <Ionicons name="heart" size={25} style={{marginLeft: 10}} color={"red"} />
                                </ThemedView>
                           </View>
                           <View style={styles.priceAndRating}>
                                <View style={styles.priceContainer}>
                                    <ThemedText style={styles.productPrice}>
                                        {product.currency.symbol}
                                        {parseInt(product.price.toString()).toFixed(2)}
                                    </ThemedText>
                                    <ThemedText style={styles.priceDiscount}>{product.currency.symbol}4250 </ThemedText>
                                </View>
                                
                                <View style={styles.ratingWrapper}>
                                    <Ionicons name="star" size={20} color={"#D4AF34"} />
                                    <Text style={[styles.rating, { color: colors.text.secondary }]}>3.5k pers. ont noté</Text>
                                </View>
                           </View>

                            <ThemedView style={styles.controlThemedView}>
                                <ThemedText style={styles.productDetails}>Selectionner Taille</ThemedText>
                                <View style={{marginLeft: -8}}>
                                    <CustomRadioInput
                                        options={sizeOptions}
                                        defaultValue={selectedOption}
                                        onSelect={handleOptionSelect}
                                    />
                                </View>
                            </ThemedView>

                            <ThemedView style={styles.controlThemedView}>
                                <ThemedText style={styles.productDetails}>Selectionner Couleur</ThemedText>
                                <View style={{marginLeft: -8}}>
                                    <CustomRadioInput
                                        options={mixedOptions}
                                        defaultValue={selectedOption}
                                        onSelect={handleOptionSelect}
                                    />
                                </View>
                            </ThemedView>
                        </ThemedView>
                        
                        
                    </ThemedView>
                </ThemedView>
            </SafeAreaView>
            
        </>
    )
}

export default ProductDetailsScreen;

const createStyles = (colors : any, typography: any) =>
    StyleSheet.create({
        controlThemedView:{
            backgroundColor: colors.background.white
        },
        container:{
            backgroundColor : colors.background.white,
            borderTopLeftRadius: 50,
            borderTopEndRadius: 50,
            minHeight: 50,
            padding: 25,
        },
        imageContainer:{
            width: 100,
            height: 100
        },
        image:{
            zIndex: 1001
        },
        detailsContainer:{
            flexDirection: 'row',
            alignItems:"flex-end",
        },
        productDetails:{
            color : colors.text.primary,
            ...typography.h3
        },
        productTitle:{
            color: colors.text.primary,
            ...typography.h5
        },
        detailsIcons:{
            textAlign: "right",
            paddingLeft: 20,
            justifyContent: "space-between",
            flexDirection: 'row',
            alignItems: "baseline"
        },
        productPrice : {
            paddingTop: 10,
            ...typography.h3,
            color: colors.button.secondary
        },
        priceContainer:{
            flexDirection: "row",
            alignItems: "flex-end",
        },
        priceDiscount:{
            ...typography.h5,
            paddingHorizontal: 5,
            textDecorationLine: "line-through",
            color: colors.text.tertiary
        },
        priceAndRating:{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 10,
            
        },
        ratingWrapper: {
            flexDirection: "row",
            alignItems: "center",
            gap: 5,
            
        },
        rating: {
            fontSize: 14,
        },
})