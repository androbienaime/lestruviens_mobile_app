import Skeleton from "@/components/skeletonPlaceholder";
import CategoriesSkeletonPlaceholder from "@/components/skeletonPlaceholder/CategoriesSkeletonPlaceholder";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Category } from "@/src/@types/models";
import API_CONFIG from "@/src/api/config";
import { categoriesService } from "@/src/api/services/categories.service";
import { useThemeColors, useThemeTypography } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useMemo, useState } from "react";
import { FlatList, Image, Pressable, StyleSheet, Text } from "react-native";


const CategoriesList = ({...otherProps}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const colors = useThemeColors();
  const typography = useThemeTypography();

  const styles = useMemo(() => createStyles(colors, typography), [colors, typography]);
  
  useEffect(()=>{
    const fetchCategories = async () =>{
      try{
        const response = (await categoriesService.getCategories());
        if(response){
          setCategories(response.data);
        }
      }catch(error){
        console.log("Erreur lors de la recuperation des categories", error);
      }finally{
        setLoading(false);
      }
      
    };

    fetchCategories();
  }, []);


    return (
        <ThemedView {...otherProps}>
        <ThemedView style={styles.titleWrapper}>
            <ThemedText style={styles.title}>Categories</ThemedText>
            <Pressable style={styles.titleBtnWrapper}>
                <ThemedText style={styles.titleBtn}>See All</ThemedText>
                <Ionicons name="arrow-forward-outline" />
            </Pressable>
        </ThemedView>
        {loading ? (
          <Skeleton.Categories
            itemCount={5} 
            itemSize={70} 
            itemTextWidth={60}
          />
        ) : (
          <FlatList
              data={categories} 
              horizontal
              showsHorizontalScrollIndicator
              keyExtractor={(item) => item.id.toString()}
              renderItem={({index, item}) => 
                <Pressable>
                  <ThemedView style={styles.item}>
                      <Image source={{ uri: 'http://172.20.10.7:8000'+item.coverImage }} style={styles.itemImg} />
                      <ThemedText style={{ color: colors.text.primary }}>{item.name}</ThemedText>
                  </ThemedView>
                </Pressable>
              } 
          />
        )}
      </ThemedView>

    )
}

export default CategoriesList;

const createStyles = (colors: any, typography:any) => 
  StyleSheet.create({
    titleWrapper:{
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 10,
        marginHorizontal: 18
      },
      title:{
        ...typography.h4,
        color: colors.text.primary
      },
      titleBtn:{
        ...typography.h5,
        color: colors.text.primary
      },
      titleBtnWrapper:{
        flexDirection: "row",
        alignItems: "center",
      },
      item:{
        marginVertical: 10,
        gap:5, 
        alignItems: "center",
        marginLeft: 18
      },
      itemImg:{
        height: 60, 
        width: 60,
        borderRadius: 30,
        borderColor: "#fff",
        borderWidth: 5
      }
})