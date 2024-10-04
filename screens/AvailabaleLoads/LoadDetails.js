import React from "react";
import { StyleSheet, View, ScrollView, Text,  Image } from "react-native";
import TruckCard from "../TruckCard";
import { TouchableOpacity } from "react-native";
import { COLORS } from "../../constants";
import { useNavigation } from "@react-navigation/native";
import Constants from 'expo-constants';






const LoadDetails = ({ filteredTrucks, status,  selectedValue }) => {

  
  // cdn link
  const cdnLink = Constants.expoConfig?.extra?.REACT_APP_CDN_LINK 

  const navigation = useNavigation()


  return (
    <ScrollView contentContainerStyle={styles.container}>
      {filteredTrucks.length > 0 ? (
        filteredTrucks.reverse().map((truck, index) => (
          <TruckCard
            selectedValue={selectedValue}
            key={index}
            post={truck.post}
            profileName={truck.profileName}
            companyName={truck.companyName}
            title={truck.title}
            fromLocation={truck.fromLocation}
            toLocation={truck.toLocation}
            labels={truck.labels}
            description={truck.description}
            onButton1Press={truck.onButton1Press} // Ensure handleEdit is invoked correctly
            onButton2Press={truck.onButton2Press}
            status={status}
            updatedTime={truck.updatedTime}
          />
        ))
      ) : (
        <>
        {/* If My Posts empty */}
          {
            selectedValue === "user_load_details" ?
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
              </View>
              : null
          }

          {
            selectedValue === "user_driver_details" ?
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
              </View>
              : null
          }

          {
            selectedValue === "user_truck_details" ?
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
              </View>
              : null
          }

          {
            selectedValue === "user_buy_sell_details" ?
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
                    onPress={() => navigation.navigate('MarketPlace')}
                  > Click here to post a driver</Text>
                </TouchableOpacity>
              </View>
              : null
          }


          {/* If Four cards empty */}
          {
            !selectedValue && filteredTrucks.length === 0 ?
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
                    onPress={() => navigation.navigate('TruckNeeds')}
                  > Click here to post a truck</Text>
                </TouchableOpacity>
              </View>
              :
              null
          }

          

        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    flex:1
  },
  noResultContainer: {
    marginTop: 50,
    alignItems: 'center',
    justifyContent: 'center',
    flex:1
  },
  noResultsText: {
    textAlign: "center",
    marginBottom: 30,
    color: "grey",
    fontSize: 16,
  },
});

export default LoadDetails;
