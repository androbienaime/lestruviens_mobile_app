import Header from "@/components/Header";
import ProductSlider from "@/components/ProductSlider";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { ShopStackParamList } from "@/src/@types/navigation";
import { useThemeColors, typography, useThemeTypography } from '@/theme';
import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useMemo, useState, useEffect } from "react";
import { FlatList, Image, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Declination, Values, Product } from '../../src/@types/models';
import CustomRadioInput from "@/components/CustomRadioInput";
import QuantityControl from "@/components/QuantityControl";
import { Keyboard } from "react-native";
import RenderHTMLToText from "@/components/RenderHTMLToText";
import AccordionButton from "@/components/AccordionButton";
import useDisabledAttributeValues from '../../hooks/useDisabledAttributeValues';

type Props = NativeStackScreenProps<ShopStackParamList, 'ProductDetails'>;

const ProductDetailsScreen: React.FC<Props> = ({ route, navigation }) => {
    const { product } = route.params;
    const colors = useThemeColors();
    const typography = useThemeTypography();
    
    const [selectedDeclinations, setSelectedDeclinations] = useState<Record<string, string>>({});
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [quantity, setQuantity] = useState<number>(1);
    
    // État pour gérer le prix affiché et les images
    const [currentPrice, setCurrentPrice] = useState<number>(product.price);
    const [currentImages, setCurrentImages] = useState<string[]>(product.images);
    const [maxQuantity, setMaxQuantity] = useState<number>(product.stock_quantity);
    // Organiser les attributs et valeurs des déclinaisons
    const organizedValues = useMemo(() => {
        const attributeMap: Record<number, { id: number; values: Values[]; name: string; type: string }> = {};

        product.declination?.forEach((item) => {
            item.values.forEach((val) => {
                const attrId = val.attribute.id;
                if (!attributeMap[attrId]) {
                    attributeMap[attrId] = {
                        id: val.id,
                        values: [],
                        name: val.attribute.name,
                        type: val.attribute.type
                    };
                }

                const attr = attributeMap[attrId];
                let existingValue = attr.values.find((v) => v.id === val.id);
                if (!existingValue) {
                    existingValue = {
                        id: val.id,
                        value: val.value,
                        color: val.color,
                        attribute: val.attribute
                    };
                    attr.values.push(existingValue);
                }
            });
        });

        return attributeMap;
    }, [product.declination]);

    // Utiliser notre hook pour déterminer les valeurs désactivées
    const disabledValues = useDisabledAttributeValues(product.declination, selectedDeclinations);

    // Fonction pour trouver la déclinaison correspondante aux sélections actuelles
    const findMatchingDeclination = useMemo(() => {
        // Si aucune sélection n'est faite, on retourne undefined
        if (Object.keys(selectedDeclinations).length === 0) {
            return undefined;
        }

        // Le nombre d'attributs sélectionnés
        const selectedAttributesCount = Object.keys(selectedDeclinations).length;
        
        // On récupère le nombre d'attributs unique dans la première déclinaison
        const firstDecl = product.declination[0];
        const uniqueAttrsInFirstDecl = new Set(firstDecl?.values.map(v => v.attribute.name));
        const expectedAttributesCount = uniqueAttrsInFirstDecl.size;
        
        // On vérifie si tous les attributs nécessaires sont sélectionnés
        if (selectedAttributesCount !== expectedAttributesCount) {
            return undefined;
        }

        // Chercher la déclinaison qui correspond aux valeurs sélectionnées
        return product.declination.find(declination => {
            // Créer un mapping des attributs de cette déclinaison
            const declinationAttrs: Record<string, string> = {};
            declination.values.forEach(v => {
                declinationAttrs[v.attribute.name] = v.id.toString();
            });

            // Vérifier si toutes les sélections correspondent
            return Object.entries(selectedDeclinations).every(([attrName, valueId]) => {
                return declinationAttrs[attrName] === valueId;
            });
        });
    }, [product.declination, selectedDeclinations]);

    // Mettre à jour le prix et les images lorsqu'une déclinaison complète est sélectionnée
    useEffect(() => {
        const matchingDeclination = findMatchingDeclination;
        
        if (matchingDeclination) {
            // Mettre à jour le prix si la déclinaison a un prix spécifique
            if (matchingDeclination.price > 0) {
                setCurrentPrice(matchingDeclination.price);
            } else {
                // Revenir au prix par défaut du produit
                setCurrentPrice(product.price);
            }
            
            if(matchingDeclination.quantity >= 1){
                setMaxQuantity(matchingDeclination.quantity);
            }
            // Mettre à jour les images si la déclinaison a des images spécifiques
            if (matchingDeclination.declination_images && matchingDeclination.declination_images.length > 0) {
                setCurrentImages(matchingDeclination.declination_images);
            } else {
                // Revenir aux images par défaut du produit
                setCurrentImages(product.images);
            }
        } else {
            // Si aucune déclinaison complète n'est sélectionnée, revenir aux valeurs par défaut
            setCurrentPrice(product.price);
            setCurrentImages(product.images);
        }
    }, [findMatchingDeclination, product.price, product.images]);

    const handleDeclinationSelect = (attributeName: string, value: string) => {
        setSelectedDeclinations((prev) => ({
            ...prev,
            [attributeName]: value,
        }));
      
        // Clear error for this attribute if any
        setErrors((prev) => {
            const updated = { ...prev };
            delete updated[attributeName];
            return updated;
        });
    };
      
    const handleQuantityChange = (value: number) => {
        setQuantity(value);
    };

    const handleAddToCart = () => {
        const missingSelections: Record<string, string> = {};
      
        // Vérifier si tous les attributs nécessaires sont sélectionnés
        Object.values(organizedValues).forEach((item) => {
            if (!selectedDeclinations[item.name]) {
                missingSelections[item.name] = `Veuillez sélectionner une valeur pour ${item.name}`;
            }
        });
      
        if (Object.keys(missingSelections).length > 0) {
            setErrors(missingSelections);
            return;
        }
      
        // Tous les champs sont valides
        console.log('Ajout au panier:', {
            product: product.name,
            price: currentPrice,
            quantity: quantity,
            selections: selectedDeclinations,
            matchingDeclination: findMatchingDeclination
        });
      
        // Ici vous pourriez ajouter la logique pour réellement ajouter au panier
        // navigation.navigate('Cart', { screen: 'Cart' });
    };
    
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
                    <FlatList
                        data={[1]} // dummy item
                        keyExtractor={() => "home-section"}
                        renderItem={() => (
                            <View>
                                <ThemedView style={styles.controlThemedView}>
                                    <ProductSlider 
                                        images={currentImages}
                                        autoplay={false} 
                                        horizontalMargin={0}
                                        marginVertical={0}
                                        height={400}
                                    />
                                    <Pressable onPress={() => Keyboard.dismiss()}>
                                        <ThemedView style={styles.container}>
                                            <View style={[styles.detailsContainer, styles.subTitle]}>
                                                <ThemedView style={styles.controlThemedView}>
                                                    <ThemedText style={styles.caption}>Details du produit</ThemedText>
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
                                                        {parseInt(currentPrice.toString()).toFixed(2)}
                                                    </ThemedText>
                                                    {product.discount_price && (
                                                        <ThemedText style={styles.priceDiscount}>
                                                            {product.currency.symbol}{parseInt(product.discount_price.toString()).toFixed(2)}
                                                        </ThemedText>
                                                    )}
                                                </View>
                                                
                                                <View style={styles.ratingWrapper}>
                                                    <Ionicons name="star" size={20} color={"#D4AF34"} />
                                                    <Text style={[styles.rating, { color: colors.text.secondary }]}>3.5k pers. ont noté</Text>
                                                </View>
                                            </View>
                                            {(product.declination != null && product.declination.length > 0) && (  
                                                <>
                                                    {Object.values(organizedValues).map((item, index) => {
                                                        if(item.type === 'radio'){
                                                            const sizeOptions: { value: string; type: 'text'; content: string; disabled: boolean }[] = [];

                                                            item.values.forEach((val) => {
                                                                const isDisabled = disabledValues[item.name]?.has(val.id.toString()) || false;
                                                                
                                                                sizeOptions.push({ 
                                                                    value: val.id.toString(),  
                                                                    type: 'text' as const, 
                                                                    content: val.value,
                                                                    disabled: isDisabled,
                                                                });
                                                            });

                                                            return (
                                                                <ThemedView key={index} style={styles.subTitle}>
                                                                    <ThemedText style={styles.caption}>Selectionner {item.name}</ThemedText>
                                                                    <View style={{marginLeft: -8}}>
                                                                        <CustomRadioInput
                                                                            options={sizeOptions}
                                                                            defaultValue={selectedDeclinations[item.name] || ''}
                                                                            onSelect={(value) => handleDeclinationSelect(item.name, value)}
                                                                        />
                                                                    </View>
                                                                    {errors[item.name] && (
                                                                        <Text style={{ color: 'red', marginTop: 4 }}>{errors[item.name]}</Text>
                                                                    )}
                                                                </ThemedView>
                                                            );
                                                        }
                                                        if(item.type === 'color'){
                                                            const mixedOptions: { value: string; type: 'color'; content: string; disabled: boolean }[] = [];
                                                    
                                                            item.values.forEach((val) => {
                                                                const isDisabled = disabledValues[item.name]?.has(val.id.toString()) || false;
                                                                
                                                                mixedOptions.push({ 
                                                                    value: val.id.toString(),  
                                                                    type: 'color' as const, 
                                                                    content: "" + val.color,
                                                                    disabled: isDisabled,
                                                                });
                                                            });
                                                              
                                                            return (
                                                                <ThemedView key={index} style={styles.subTitle}>
                                                                    <ThemedText style={styles.caption}>Selectionner {item.name}</ThemedText>
                                                                    <View style={{marginLeft: -8}}>
                                                                        <CustomRadioInput
                                                                            options={mixedOptions}
                                                                            defaultValue={selectedDeclinations[item.name] || ''}
                                                                            onSelect={(value) => handleDeclinationSelect(item.name, value)}
                                                                        />
                                                                    </View>
                                                                    {errors[item.name] && (
                                                                        <Text style={{ color: 'red', marginTop: 4 }}>{errors[item.name]}</Text>
                                                                    )}
                                                                </ThemedView>
                                                            );
                                                        }
                                                        return null;
                                                    })}
                                                </>
                                            )}
                                            <ThemedView style={[styles.subTitle, styles.quantityWrapper]}>
                                                <ThemedText style={styles.caption}>Quantity</ThemedText>
                                                
                                                <View style={styles.quantity}>
                                                    <QuantityControl
                                                        min={1}
                                                        {...(product.has_unlimited_stock ? { } : {max: maxQuantity})}
                                                        initialValue={1}
                                                        onValueChange={handleQuantityChange} 
                                                    />
                                                </View>
                                            </ThemedView>

                                            {(product.description != null) && (
                                                <ThemedView style={styles.subTitle}>
                                                    <ThemedText style={styles.caption}>Description</ThemedText>
                                                    <ThemedText style={styles.description}>
                                                        {RenderHTMLToText(product.description, true)}
                                                    </ThemedText>
                                                </ThemedView>
                                            )}
                                            
                                            <ThemedView style={styles.subTitle}>
                                                <ThemedText style={{...typography.h4, color: colors.text.primary}}>Expedition à Gonaive, Rue parc Vincent</ThemedText>
                                                <ThemedText style={{ ...typography.h5, color: colors.text.primary}}>Livraison estime le :</ThemedText>
                                                <ThemedText style={{ ...typography.body1, color: colors.text.primary }}>19/05/2025 - 23/05/2025</ThemedText>
                                            </ThemedView>

                                            <ThemedView style={styles.subTitle}>
                                                <AccordionButton
                                                    title="Details du produit"
                                                    content={
                                                        RenderHTMLToText(product.description, true)
                                                    }
                                                />
                                            </ThemedView>
                                            <ThemedView style={styles.subTitle}>
                                                <AccordionButton
                                                    title="Retour sous 5 jours"
                                                    content={
                                                        RenderHTMLToText(product.description, true)
                                                    }
                                                />
                                            </ThemedView>
                                        </ThemedView>
                                    </Pressable>
                                </ThemedView>
                            </View>
                        )}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 190 }} // ajuste selon la tab bar
                    />
                </ThemedView>
            </SafeAreaView>

            {/* Bouton "Ajouter au panier" qui reste fixe en bas de l'écran */}
            <View style={styles.addToCartButtonContainer}>
                <View style={styles.addToCartButtonContainerWrapper}>
                    <Ionicons name="heart-outline" size={35} color={colors.text.primary} />
                    <TouchableOpacity 
                        onPress={handleAddToCart}
                        style={styles.addToCartButton}
                    >
                        <View style={styles.addToCartTextWrapper}>
                            <Ionicons name="cart" size={22} color={colors.background.secondary} />
                            <ThemedText style={styles.addToCartButtonText}>
                                Ajouter au panier
                            </ThemedText>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </>
    );
};

export default ProductDetailsScreen;

const createStyles = (colors : any, typography: any) =>
    StyleSheet.create({
        controlThemedView:{
            backgroundColor: colors.background.white,
        },
        subTitle:{
            backgroundColor: colors.background.white,
            marginTop: 10
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
        caption:{
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
        quantityWrapper:{
            flexDirection: 'row',
            alignItems: "center"
        },
        quantity:{
            paddingLeft: 5
        },
        description:{
            ...typography.body1,
            color: colors.text.primary
        },
         // Styles pour le bouton "Ajouter au panier"
         addToCartButtonContainer: {
            position: 'absolute', 
            bottom: 0, 
            left: 0, 
            right: 0, 
            backgroundColor: colors.background.white,
            padding: 15,
            paddingTop: 5,
            paddingBottom: 30,
            borderTopWidth: 1,
            borderTopColor: colors.border.default,
            elevation: 5,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
        },
        addToCartButtonContainerWrapper:{
            flex: 1,
            flexDirection: 'row',
            alignItems: "center"
         },
        addToCartButton: {
            flex: 1,
            marginLeft: 10,
            backgroundColor: colors.button.primary,
            paddingVertical: 10,
            borderRadius: 8,
            alignItems: 'center',
            
        },
        addToCartTextWrapper:{
            flexDirection: 'row',
            alignItems: 'center',
        },
        addToCartButtonText: {
            color: "#fff",
            fontSize: 16,
            fontWeight: 'bold',
            paddingHorizontal: 10
        }
    });