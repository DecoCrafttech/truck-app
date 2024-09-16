import React from "react";
import { StyleSheet, View, ScrollView, Text, Linking, Image } from "react-native";
import TruckCard from "../TruckCard";
import CustomButton from "../../components/CustomButton";
import { TouchableOpacity } from "react-native";
import { COLORS } from "../../constants";
import { useNavigation } from "@react-navigation/native";

const LoadDetails = ({ filteredTrucks, status, handleEdit, selectedValue }) => {

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
          />
        ))
      ) : (
        <>
          <View style={styles.noResultContainer}>
            <View>
              <Image
                source={require("../../assets/images/Folder_empty.png")}
                width={50}
                height={50}
                resizeMode="center"
              />
            </View>
            <Text style={styles.noResultsText}>No records</Text>
            <TouchableOpacity>
              <Text
                style={{ color: '#fff',width:"100%",padding:10,paddingHorizontal:20,borderRadius:5,textAlign:'center', fontWeight: 'bold',fontSize:16,backgroundColor:COLORS.primary}}
                onPress={() => navigation.navigate('SellYourTruck')}
              > Click here to post load</Text>
            </TouchableOpacity>

          </View>
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    flex: 1
  },
  noResultContainer: {
    marginTop: 50,
    alignItems: 'center',
    justifyContent: 'center',
    // flex:1,

  },
  noResultsText: {
    textAlign: "center",
    marginTop: -90,
    marginBottom:30,
    color: "grey",
    fontSize: 16,
  },
});

export default LoadDetails;
