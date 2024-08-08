import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
} from "react-native";

import axiosInstance from "../../services/axiosInstance";
import { images } from "../../constants";
import { LoadNeedsContext } from "../../hooks/LoadNeedsContext";

const ProductCategoryList = ({ navigation, searchQuery,filteredProducts,onPressCategory,loading }) => {

 




  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => onPressCategory(item)}>
      <View style={styles.categoryItem}>
        {item.images && item.images.length > 0 ? (
          <Image
            source={{ uri: item.images[0] }}
            style={styles.categoryImage}
          />
        ) : (
          <Image source={images.truck} style={styles.categoryImage} />
        )}

        <View style={styles.categoryInfo}>
          <Text style={styles.categoryName}>{item.brand}</Text>
          <Text style={styles.categoryDescription}>{item.model}</Text>
          <Text style={styles.categoryPrice}>{item.location}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return loading ? (
    <ActivityIndicator
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      size="large"
      color="#0000ff"
    />
  ) : filteredProducts.length === 0 ? (
    <Text style={styles.noProductsText}>No truck details found</Text>
  ) : (
    <View style={{ flex: 1, marginBottom: 55 }}>
      <FlatList
        data={filteredProducts}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.container}
        contentInset={{ bottom: 100 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  noProductsText: {
    textAlign: "center",
    marginTop: 10,
    fontSize: 20,
  },
  categoryItem: {
    flexDirection: "row",
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  categoryImage: {
    width: 80,
    height: 80,
    borderRadius: 5,
    marginRight: 10,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  categoryDescription: {
    fontSize: 16,
    color: "#666",
    marginTop: 5,
  },
  categoryPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "green",
    marginTop: 5,
  },
});

export default ProductCategoryList;
