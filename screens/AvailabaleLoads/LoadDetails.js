import React from "react";
import { StyleSheet, View, ScrollView, Text } from "react-native";
import TruckCard from "../TruckCard"; 

const LoadDetails = ({ filteredTrucks,status,handleEdit }) => {
  
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {filteredTrucks.length > 0 ? (
        filteredTrucks.map((truck, index) => (
          <TruckCard
            key={index}
            title={truck.title}
            fromLocation={truck.fromLocation}
            toLocation={truck.toLocation}
            labels={truck.labels}
            description={truck.description}
            onButton1Press={() => handleEdit(truck)} // Ensure handleEdit is invoked correctly
            onButton2Press={truck.onButton2Press}
            status={status}
          />
        ))
      ) : (
        <Text style={styles.noResultsText}>No Data Found</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,    
  },
  noResultsText: {
    textAlign: "center",
    marginTop: 20,
    color: "grey",
    fontSize: 16,
  },
});

export default LoadDetails;
