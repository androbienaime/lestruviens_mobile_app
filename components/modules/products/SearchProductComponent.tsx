import React, { useState } from "react";
import SearchProduct from "./SearchProduct";

type Props = {
  backgroundColor?: string;
}

const SearchProductComponent = ({backgroundColor = ""} : Props) => {
    const [searchText, setSearchText] = useState('');

    const handleSearch = () => {
      console.log('Recherche de:', searchText);
    };
  
    const handleCameraPress = () => {
      console.log('Caméra activée');
    };
    return (
        <>
            <SearchProduct
                value={searchText}
                onChangeText={setSearchText}
                onSearch={handleSearch}
                onCameraPress={handleCameraPress}
                backgroundColor={backgroundColor}
            />
        </>
    )
}

export default SearchProductComponent;