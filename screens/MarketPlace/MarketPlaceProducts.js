import React, { useContext } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
} from "react-native";

import { COLORS, images } from "../../constants";
import { LoadNeedsContext } from "../../hooks/LoadNeedsContext";
import AntDesign from '@expo/vector-icons/AntDesign';
import Entypo from '@expo/vector-icons/Entypo';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/FontAwesome';
import Constants from 'expo-constants'




const ProductCategoryList = ({ navigation, filteredProducts, onPressCategory, loading }) => {

  const {
    setMessageReceiver
  } = useContext(LoadNeedsContext)

  // cdn link
  const cdnLink = Constants.expoConfig?.extra?.REACT_APP_CDN_LINK




  const renderItem = ({ item }) => (



    <View >
      <View style={[styles.categoryItem]}>
        {item.images && item.images.length > 0 ? (
          <View style={{borderRadius:8,paddingHorizontal:10,padding:10}}>
           <Text style={styles.profile_name}>{item.profile_name}</Text>
            <View style={[styles.ratingsContainer]}>
              <View style={styles.starsContainer}>
                {[...Array(5)].map((_, index) => (
                  <Icon
                    key={index}
                    name={index > 2 ? "star-o" : "star"}
                    size={13}
                    color="#FFD700"
                  />
                ))}
              </View>
              <Text style={styles.textRight}>Posts :{1} </Text>
            </View>

            <Image
              source={{ uri: item.images[0] }}
              style={styles.categoryImage}
            />
          </View>



        ) :
          <Image source={images.truck} style={styles.categoryImage} resizeMethod="auto" resizeMode="cover" />
        }
        <View style={styles.categoryInfoContainer}>
          <View>
            <MaterialCommunityIcons style={[styles.value, { textAlign: 'center' }]} name="map-marker-distance" size={24} color="black" />
            <Text style={[styles.value, { textAlign: 'center' }]}>{item.kms_driven}</Text>
          </View>
          <View>
            <Entypo style={[styles.value, { textAlign: 'center' }]} name="location-pin" size={24} color="black" />
            <Text style={[styles.value, { textAlign: 'center' }]}>{item.location}</Text>
          </View>
          <View>
            <AntDesign style={[styles.value, { textAlign: 'center' }]} name="calendar" size={24} color="black" />
            <Text style={[styles.value, { textAlign: 'center' }]}>{item.model}</Text>
          </View>

        </View>

        <Text style={styles.price}>
          Price : {item.price}
        </Text>

        <View>
          <TouchableOpacity 
              style={styles.buttonContainer} 
              onPress={() => {
                setMessageReceiver(item)
                onPressCategory(item)
              }}>
            <Text style={styles.buttonText}>View details</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );




  return loading ? (
    <ActivityIndicator
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      size="large"
      color="#0000ff"
    />
  ) : filteredProducts.length === 0 ? (
    <View style={styles.noResultContainer}>
          <View>
            <Image
               source={{ uri: `${cdnLink}/Folder_empty.png` }}
              width={50}
              height={50}
              resizeMode="center"
            />
          </View>
          <Text style={styles.noResultsText}>No records</Text>
          <TouchableOpacity>
            <Text
              style={{ color: '#fff', width: "100%", padding: 10, paddingHorizontal: 20, borderRadius: 5, textAlign: 'center', fontWeight: 'bold', fontSize: 16, backgroundColor: COLORS.primary }}
              onPress={() => navigation.navigate('SellYourTruck')}
            > Click here to post</Text>
          </TouchableOpacity>
        </View>
  ) : (
    <View style={{ flex: 1 }}>
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
    backgroundColor: COLORS.white,
    padding: 10,
    marginVertical: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  categoryImage: {
    width: "100%",
    height: 200,
    borderRadius: 5,
    margin: 'auto',
    resizeMode: 'cover',


  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: 15,
    fontWeight: "bold",
    textAlign: 'center'
  },
  categoryDescription: {
    fontSize: 15,
    fontWeight: "bold",
    textAlign: 'center'
  },
  categoryPrice: {
    fontSize: 15,
    fontWeight: "bold",
    textAlign: 'center'
  },
  categoryInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    textAlign: 'center',
    marginTop: 20,
    alignItems: 'center',
  },
  value: {
    marginTop: 10
  },
  price: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 20,
  },
  buttonContainer: {
    backgroundColor: COLORS.primary,
    borderRadius: 5,
    marginHorizontal: 5,
    paddingVertical: 10,
    alignItems: "center",
    marginVertical: 20
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold'
  },
  ratingsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center', // Center vertically if needed
    marginHorizontal:5,
    marginBottom:10,
    paddingTop:10
  },
  starsContainer: {
    flexDirection: 'row', // Align stars horizontally
  },
  textRight: {
    textAlign: 'right',
    fontWeight:'600'
  },
  noResultContainer: {
    marginTop: 50,
    alignItems: 'center',
    justifyContent: 'center',

  },
  noResultsText: {
    textAlign: "center",
    marginTop: -90,
    marginBottom: 30,
    color: "grey",
    fontSize: 16,
  },
  profile_name : {
    fontSize:20,
    fontWeight : "bold",
    textAlign:'center',
    backgroundColor : "#f1f2ff",
    paddingVertical:10,
    width:"100%"
  }

});

export default ProductCategoryList;
