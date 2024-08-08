import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  Linking,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import HeaderWithOutBS from "../components/HeaderWithOutBS";
import { COLORS } from "../constants";
import axiosInstance from "../services/axiosInstance";

const TruckDetail = ({ route }) => {
  const { item } = route.params;

  const [fullProductDetails, setFullProductDetails] = useState({
    images: [],
  });

  useEffect(() => {
    const fetchFullProductDetails = async () => {
      try {
        const fullProductDetailParameter = {
          buy_sell_id: item.buy_sell_id,
        };
        const response = await axiosInstance.post(
          "/buy_sell_id_details",
          fullProductDetailParameter
        );
        if (response.data.error_code === 0) {
          setFullProductDetails(response.data.data[0]);
        }
      } catch (error) {
        console.error('Error fetching product details:', error);
      }
    };
  
    fetchFullProductDetails();
  }, [item.buy_sell_id]);

  const [selectedImage, setSelectedImage] = useState('');

  useEffect(() => {
    if (fullProductDetails.images && fullProductDetails.images.length > 0) {
      setSelectedImage(fullProductDetails.images[0]);
    }
  }, [fullProductDetails]);

  const renderImages = () => {
    return (
      <View style={styles.imagesContainer}>
        <View style={styles.mainImageContainer}>
          {selectedImage ? (
            <Image style={styles.mainImage} source={{ uri: selectedImage }} />
          ) : (
            <Text>No Image Available</Text>
          )}
        </View>
        <View style={styles.smallImagesContainer}>
          {fullProductDetails.images && fullProductDetails.images.map((image, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => setSelectedImage(image)}
              style={styles.smallImageContainer}
            >
              <Image style={styles.smallImage} source={{ uri: image }} />
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  if (!fullProductDetails.brand) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <HeaderWithOutBS title="Truck Details" />
        <ScrollView style={styles.content}>
          <View style={styles.card}>
            <View style={styles.productCardHeader}>
              <Text style={styles.name}>{fullProductDetails.brand}</Text>
              <Text style={styles.price}>
                {fullProductDetails.vehicle_number}
              </Text>
            </View>
            <View style={styles.cardContent}>{renderImages()}</View>
          </View>

          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Model</Text>
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.description}>{fullProductDetails.model}</Text>
            </View>
          </View>
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Kms Driven</Text>
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.description}>
                {fullProductDetails.kms_driven}
              </Text>
            </View>
          </View>
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Owner Name</Text>
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.description}>
                {fullProductDetails.owner_name}
              </Text>
            </View>
          </View>
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Location</Text>
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.description}>
                {fullProductDetails.location}
              </Text>
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Description</Text>
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.description}>
                {fullProductDetails.description}
              </Text>
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.cardContent}>
              <TouchableOpacity
                style={styles.shareButton}
                onPress={() =>
                  Linking.openURL(`tel:${fullProductDetails.contact_no}`)
                }
              >
                <Text style={styles.shareButtonText}>Contact</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  content: {
    marginLeft: 10,
    marginRight: 10,
  },
  card: {
    shadowColor: "#00000021",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.37,
    shadowRadius: 7.49,
    elevation: 12,
    marginVertical: 5,
    backgroundColor: "white",
    marginHorizontal: 5,
  },
  productCardHeader: {
    paddingTop: 12.5,
    paddingBottom: 25,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 1,
    borderBottomRightRadius: 1,
  },
  name: {
    fontSize: 22,
    color: "#696969",
    fontWeight: "bold",
  },
  price: {
    marginTop: 10,
    fontSize: 18,
    color: "green",
    fontWeight: "bold",
  },
  cardContent: {
    paddingVertical: 5,
    paddingHorizontal: 16,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 12.5,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 1,
    borderBottomRightRadius: 1,
  },
  cardTitle: {
    color: COLORS.brand,
  },
  description: {
    fontSize: 18,
    color: "#696969",
  },
  shareButton: {
    marginTop: 10,
    height: 45,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
    backgroundColor: COLORS.brand,
  },
  shareButtonText: {
    color: "#FFFFFF",
    fontSize: 20,
  },
  imagesContainer: {
    alignItems: "center",
  },
  mainImageContainer: {
    marginTop: 5,
    alignItems: "center",
  },
  mainImage: {
    width: 300,
    height: 300,
  },
  smallImagesContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  smallImageContainer: {
    paddingHorizontal: 10,
  },
  smallImage: {
    width: 60,
    height: 60,
  },
});

export default TruckDetail;
