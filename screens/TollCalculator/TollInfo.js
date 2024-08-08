import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Modal,
  SafeAreaView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import Toast from "react-native-toast-message";
import { COLORS } from "../../constants";

const TollInfo = () => {
  const apiKey = "AIzaSyCLT-nqnS-13nBpe-mqzJVsRK7RZIl3I5s";
  const [startingPoint, setStartingPoint] = useState("");
  const [endingPoint, setEndingPoint] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [isStartingPointModalVisible, setStartingPointModalVisible] =
    useState(false);
  const [isEndingPointModalVisible, setEndingPointModalVisible] =
    useState(false);
  const [routeDetails, setRouteDetails] = useState(null);

  const fetchRoute = async (start, end) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${encodeURIComponent(
          start
        )}&destination=${encodeURIComponent(end)}&key=${apiKey}`
      );
      const data = await response.json();
      if (data.status === "OK") {
        return data;
      } else {
        throw new Error(`Directions request failed due to ${data.status}`);
      }
    } catch (error) {
      throw error;
    }
  };

  const handleCalculate = async () => {
    try {
      const result = await fetchRoute(startingPoint, endingPoint);
      const routes = result.routes;

      if (routes.length > 0) {
        const route = routes[0];
        const tollData = calculateTolls(route, vehicleType);

        setRouteDetails({
          distance: route.legs[0].distance.text,
          duration: route.legs[0].duration.text,
          tollCount: tollData.count,
          totalCost: tollData.totalCost,
        });
      } else {
        setRouteDetails({
          distance: "N/A",
          duration: "N/A",
          tollCount: 0,
          totalCost: 0,
        });
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error fetching directions",
        text2: "Please try again later",
      });
      setRouteDetails({
        distance: "N/A",
        duration: "N/A",
        tollCount: 0,
        totalCost: 0,
      });
    }
  };

  const calculateTolls = (route, vehicleType) => {
    const tollLocations = route.legs[0].steps.filter((step) =>
      step.html_instructions.includes("Toll")
    );
    const tollCount = tollLocations.length;

    const tollCosts = {
      Truck: 200,
      Bus: 150,
      "6-Axle Vehicle": 300,
      "8-Axle Vehicle": 400,
      "10-Axle Vehicle": 500,
      "12-Axle Vehicle": 600,
    };

    const totalCost = tollCount * (tollCosts[vehicleType] || 0);
    return { count: tollCount, totalCost: totalCost };
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.label}>Starting Point</Text>
      <TextInput
        style={styles.input}
        value={startingPoint}
        onFocus={() => setStartingPointModalVisible(true)}
        placeholder="Enter starting point"
      />

      <Text style={styles.label}>Ending Point</Text>
      <TextInput
        style={styles.input}
        value={endingPoint}
        onFocus={() => setEndingPointModalVisible(true)}
        placeholder="Enter ending point"
      />

      <Text style={styles.label}>Vehicle Type</Text>
      <View style={styles.pickerContainer}>
        <Picker
        
          selectedValue={vehicleType}
          onValueChange={(itemValue) => setVehicleType(itemValue)}
        >
          <Picker.Item label="Select vehicle type" value="" />
          <Picker.Item label="Truck" value="Truck" />
          <Picker.Item label="Bus" value="Bus" />
          <Picker.Item label="6-Axle Vehicle" value="6-Axle Vehicle" />
          <Picker.Item label="8-Axle Vehicle" value="8-Axle Vehicle" />
          <Picker.Item label="10-Axle Vehicle" value="10-Axle Vehicle" />
          <Picker.Item label="12-Axle Vehicle" value="12-Axle Vehicle" />
        </Picker>
      </View>

      <Button title="Calculate" onPress={handleCalculate} />

      {routeDetails && (
        <>
          <Text style={styles.routeHeader}>Route Details</Text>
          <View style={styles.statsContainer}>
            <View style={styles.statContainer}>
              <Text style={styles.statCount}>Distance</Text>
              <Text style={styles.statLabel}>{routeDetails.distance}</Text>
            </View>
          </View>
          <View style={styles.statsContainer}>
            <View style={styles.statContainer}>
              <Text style={styles.statCount}>Duration</Text>
              <Text style={styles.statLabel}>{routeDetails.duration}</Text>
            </View>
          </View>
          <View style={styles.statsContainer}>
            <View style={styles.statContainer}>
              <Text style={styles.statCount}>Number of Tolls</Text>
              <Text style={styles.statLabel}>{routeDetails.tollCount}</Text>
            </View>
          </View>
          <View style={styles.statsContainer}>
            <View style={styles.statContainer}>
              <Text style={styles.statCount}>Total Toll Cost</Text>
              <Text style={styles.statLabel}>
                {routeDetails.totalCost} INR (Approximate value)
              </Text>
            </View>
          </View>
        </>
      )}





      <Modal visible={isStartingPointModalVisible} animationType="slide"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>To Location</Text>


            <View style={styles.locationContainer}>
              <GooglePlacesAutocomplete
                placeholder="Search for starting point"
                onPress={(data) => {
                  setStartingPoint(data.description);
                  setStartingPointModalVisible(false);
                }}
                query={{
                  key: apiKey,
                  language: "en",
                }}
                styles={{
                  textInputContainer: styles.autocompleteContainer,
                  textInput: styles.autocompleteInput,
                }}
              />
              <Button
                title="Close"
                onPress={() => setStartingPointModalVisible(false)}
              />



            </View>
          </View>
        </View>
      </Modal>


      <Modal visible={isEndingPointModalVisible} animationType="slide"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>To Location</Text>


            <View style={styles.locationContainer}>
              <GooglePlacesAutocomplete
                placeholder="Search for ending point"
                onPress={(data) => {
                  setEndingPoint(data.description);
                  setEndingPointModalVisible(false);
                }}
                query={{
                  key: apiKey,
                  language: "en",
                }}
                styles={{
                  textInputContainer: styles.autocompleteContainer,
                  textInput: styles.autocompleteInput,
                }}
              />
              <Button
                title="Close"
                onPress={() => setEndingPointModalVisible(false)}
              />



            </View>
          </View>
        </View>
      </Modal>



      <Toast />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    textAlign: "center",
    marginVertical: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 15,
    marginBottom: 16,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    marginBottom: 16,
    
  },
  results: {
    padding: 16,
    backgroundColor: "#f9f9f9",
    borderRadius: 4,
  },
  resultsTitle: {
    fontSize: 18,
    marginBottom: 8,
  },
  autocompleteContainer: {
    width: "100%",
  },
  autocompleteInput: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 4,
  },
  statsContainer: {
    flexDirection: "row",
    marginTop: 10,
    marginBottom: 10,
  },
  statContainer: {
    alignItems: "left",
    flex: 1,
  },
  statCount: {
    fontSize: 14,
    fontWeight: "bold",
  },
  statLabel: {
    fontSize: 14,
    color: "#999",
  },
  routeHeader: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: 'left',
    color: "maroon",
    marginTop: 10
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: COLORS.white,
    padding: 20,
    width: "90%",
    borderRadius: 10,
    elevation: 5,
    height: "90%"
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  locationContainer: {
    flex: 1,
    padding: 5,
  },
  locationTextInputContainer: {

  },
  locationTextInput: {
    borderWidth: 1,
    borderColor: COLORS.gray,
  },
  // input: {
  //   borderWidth: 1,
  //   borderColor: "#ccc",
  //   borderRadius: 5,
  //   paddingHorizontal: 10,
  //   marginBottom: 10,
  //   height: 40,
  // },
  closeButton: {
    backgroundColor: "#8a1c33",
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  applyButtonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
});

export default TollInfo;