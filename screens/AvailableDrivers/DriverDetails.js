import React from "react";
import { StyleSheet, ScrollView, Text, View, Image } from "react-native";
import TruckCard from "../TruckCard"; 
import { TouchableOpacity } from "react-native";
import { COLORS } from "../../constants";

const DriverDetails = ({  filteredTrucks,navigation }) => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {filteredTrucks.length > 0 ? (
        filteredTrucks.map((truck, index) => (
          <TruckCard
            key={index}
            post={truck.post}
            profileName={truck.profileName}
            title={truck.title}
            fromLocation={truck.fromLocation}
            toLocation={truck.toLocation}
            labels={truck.labels}
            description={truck.description}
            onButton1Press={truck.onButton1Press}
            onButton2Press={truck.onButton2Press}
            companyName = {truck.companyName}
            updatedTime={truck.updatedTime}
          />
        ))
      ) : (
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
              style={{ color: '#fff', width: "100%", padding: 10, paddingHorizontal: 20, borderRadius: 5, textAlign: 'center', fontWeight: 'bold', fontSize: 16, backgroundColor: COLORS.primary }}
              onPress={() => navigation.navigate('DriverNeeds')}
            > Click here to post a driver</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,    
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
    marginBottom: 30,
    color: "grey",
    fontSize: 16,
  },
});

export default DriverDetails;
