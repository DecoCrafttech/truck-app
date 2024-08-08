import React, { useContext, useState } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Alert,
  Text,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "../constants";
import HeaderWithOutBS from "../components/HeaderWithOutBS";
import axiosInstance from "../services/axiosInstance";
import { LoadNeedsContext } from "../hooks/LoadNeedsContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";

const TruckNeeds = () => {

  const GOOLE_API_KEY = "AIzaSyCLT-nqnS-13nBpe-mqzJVsRK7RZIl3I5s"


  const { isLoading, setIsLoading } = useContext(LoadNeedsContext);

  const [spinner, setSpinner] = useState(false);

  const [vehicleNumber, setVehicleNumber] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [fromLocation, setFromLocation] = useState("");
  const [toLocation, setToLocation] = useState("");
  const [ton, setTon] = useState("");
  const [truckName, setTruckName] = useState("");
  const [truckBodyType, setTruckBodyType] = useState("");
  const [numberOfTyres, setNumberOfTyres] = useState("");
  const [description, setDescription] = useState("");

  // State variables to track input field validity
  const [vehicleNumberValid, setVehicleNumberValid] = useState(true);
  const [companyNameValid, setCompanyNameValid] = useState(true);
  const [contactNumberValid, setContactNumberValid] = useState(true);
  const [fromLocationValid, setFromLocationValid] = useState(true);
  const [toLocationValid, setToLocationValid] = useState(true);
  const [tonValid, setTonValid] = useState(true);
  const [truckNameValid, setTruckNameValid] = useState(true);
  const [truckBodyTypeValid, setTruckBodyTypeValid] = useState(true);
  const [numberOfTyresValid, setNumberOfTyresValid] = useState(true);
  const [descriptionValid, setDescriptionValid] = useState(true);

  const [fromLocationModal, setFromLocationModal] = useState(false)
  const [toLocationModal, setToLocationModal] = useState(false)

  const handlePostAdd = async () => {
    setSpinner(true);
    // Validate input fields
    if (
      vehicleNumber.trim() === "" ||
      companyName.trim() === "" ||
      contactNumber.trim() === "" ||
      fromLocation.trim() === "" ||
      toLocation.trim() === "" ||
      ton.trim() === "" ||
      truckName.trim() === "" ||
      truckBodyType.trim() === "" ||
      numberOfTyres.trim() === "" ||
      description.trim() === ""
    ) {
      Alert.alert("Please fill in all the fields.");
      setVehicleNumberValid(vehicleNumber.trim() !== "");
      setCompanyNameValid(companyName.trim() !== "");
      setContactNumberValid(contactNumber.trim() !== "");
      setFromLocationValid(fromLocation.trim() !== "");
      setToLocationValid(toLocation.trim() !== "");
      setTonValid(ton.trim() !== "");
      setTruckNameValid(truckName.trim() !== "");
      setTruckBodyTypeValid(truckBodyType.trim() !== "");
      setNumberOfTyresValid(numberOfTyres.trim() !== "");
      setDescriptionValid(description.trim() !== "");
      setSpinner(false);
      return;
    }

    // Prepare data to send
    const postData = {
      vehicle_number: vehicleNumber,
      company_name: companyName,
      contact_no: contactNumber,
      from: fromLocation,
      to: toLocation,
      tone: ton,
      truck_name: truckName,
      truck_body_type: truckBodyType,
      no_of_tyres: numberOfTyres,
      description: description,
      user_id: await AsyncStorage.getItem("user_id")
    };

    try {
      // Send POST request to your API endpoint
      const response = await axiosInstance.post("/truck_entry", postData);
      console.log("Post added successfully:", response.data);
      if (response.data.error_code === 0) {
        setIsLoading(!isLoading);
        setVehicleNumber("");
        setCompanyName("");
        setContactNumber("");
        setFromLocation("");
        setToLocation("");
        setTon("");
        setTruckName("");
        setTruckBodyType("");
        setNumberOfTyres("");
        setDescription("");
        Alert.alert("Post added successfully!");
      } else {
        Alert.alert("Failed to add post. Please try again later.");
      }
      // Optionally, reset form fields after successful submission



    } catch (error) {
      console.error("Error adding post:", error);
      Alert.alert("Failed to add post. Please try again later.");
    } finally {
      setSpinner(false);
    }
  };



  const handleFromLocation = (data, details) => {
    let country = '';
    let state = '';
    let city = '';

    if (details.address_components) {
      details.address_components.forEach(component => {
        if (component.types.includes('country')) {
          country = component.long_name;
        }
        if (component.types.includes('administrative_area_level_1')) {
          state = component.long_name;
        }
        if (component.types.includes('locality')) {
          city = component.long_name;
        }
      });
    }

    console.log('Country:', country);
    console.log('State:', state);
    console.log('City:', city);

    setFromLocation(`${city} , ${state}`)
    setFromLocationModal(false)

    // You can use the extracted details as needed
  };


  const handleToLocation = (data, details) => {
    let country = '';
    let state = '';
    let city = '';

    if (details.address_components) {
      details.address_components.forEach(component => {
        if (component.types.includes('country')) {
          country = component.long_name;
        }
        if (component.types.includes('administrative_area_level_1')) {
          state = component.long_name;
        }
        if (component.types.includes('locality')) {
          city = component.long_name;
        }
      });
    }

    console.log('Country:', country);
    console.log('State:', state);
    console.log('City:', city);

    setToLocation(`${city} , ${state}`)
    setToLocationModal(false)

    // You can use the extracted details as needed
  };


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
      <View style={{ flex: 1, backgroundColor: COLORS.white }}>
        <HeaderWithOutBS title="Truck Needs" />

        <ScrollView contentContainerStyle={styles.contentContainer}>
          <View style={styles.textInputContainer}>
            <Text style={styles.label}>Vehicle Number</Text>
            <TextInput
              style={[
                styles.textInput,
                !vehicleNumberValid && { borderColor: "red" },
              ]}
              placeholder="Vehicle Number"
              onChangeText={setVehicleNumber}
              value={vehicleNumber}
            />
            <Text style={styles.label}>Company Name</Text>
            <TextInput
              style={[
                styles.textInput,
                !companyNameValid && { borderColor: "red" },
              ]}
              placeholder="Company Name"
              onChangeText={setCompanyName}
              value={companyName}
            />
            <Text style={styles.label}>Contact Number</Text>
            <TextInput
              style={[
                styles.textInput,
                !contactNumberValid && { borderColor: "red" },
              ]}
              placeholder="Contact Number"
              onChangeText={setContactNumber}
              value={contactNumber}
            />
            <Text style={styles.label}>From</Text>
            <TextInput
              style={[
                styles.textInput,
                !fromLocationValid && { borderColor: "red" },
              ]}
              placeholder="Starting Location"
              // onChangeText={setFromLocation}
              value={fromLocation}
              onPress={() => setFromLocationModal(true)}
            />

            <Text style={styles.label}>To</Text>
            <TextInput
              style={[
                styles.textInput,
                !toLocationValid && { borderColor: "red" },
              ]}
              placeholder="Destination Location"
              // onChangeText={setToLocation}
              value={toLocation}
              onPress={() => setToLocationModal(true)}
            />
            <Text style={styles.label}>Ton</Text>
            <TextInput
              style={[styles.textInput, !tonValid && { borderColor: "red" }]}
              placeholder="Weight in Tons"
              onChangeText={setTon}
              value={ton}
            />
            <Text style={styles.label}>Truck Name</Text>
            <TextInput
              style={[
                styles.textInput,
                !truckNameValid && { borderColor: "red" },
              ]}
              placeholder="Truck Name"
              onChangeText={setTruckName}
              value={truckName}
            />
            <Text style={styles.label}>Truck Body Type</Text>
            <TextInput
              style={[
                styles.textInput,
                !truckBodyTypeValid && { borderColor: "red" },
              ]}
              placeholder="Truck Body Type"
              onChangeText={setTruckBodyType}
              value={truckBodyType}
            />
            <Text style={styles.label}>No. of Tyres</Text>
            <TextInput
              style={[
                styles.textInput,
                !numberOfTyresValid && { borderColor: "red" },
              ]}
              placeholder="Number of Tyres"
              onChangeText={setNumberOfTyres}
              value={numberOfTyres}
            />
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[
                styles.textInput,
                !descriptionValid && { borderColor: "red" },
              ]}
              placeholder="Description"
              onChangeText={setDescription}
              value={description}
            />
          </View>

          {spinner ? (
            <TouchableOpacity style={styles.postButton}>
              <ActivityIndicator color={COLORS.white} size="small" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.postButton} onPress={handlePostAdd}>
              <Text style={styles.postButtonText}>Add Post</Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </View>

      {/* From Location Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={fromLocationModal}
      // onRequestClose={() => setIsAadhaarModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>From Location</Text>


            <View style={styles.locationContainer}>
              <GooglePlacesAutocomplete
                placeholder="Search location"
                onPress={handleFromLocation}
                textInputProps={{
                  autoFocus: true,
                }}
                query={{
                  key: GOOLE_API_KEY, // Use your hardcoded key if Config is not working
                  language: 'en',
                }}
                fetchDetails={true} // This ensures that you get more detailed information about the selected location
                styles={{
                  textInputContainer: styles.locationTextInputContainer,
                  textInput: styles.locationTextInput
                }}
              />
            </View>


            <TouchableOpacity style={styles.closeButton} onPress={() => setFromLocationModal(false)}>
              <Text style={styles.applyButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>


      {/* To Location Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={toLocationModal}
      // onRequestClose={() => setIsAadhaarModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>To Location</Text>


            <View style={styles.locationContainer}>
              <GooglePlacesAutocomplete
                placeholder="Search location"
                onPress={handleToLocation}
                textInputProps={{
                  autoFocus: true,
                }}
                query={{
                  key: GOOLE_API_KEY, // Use your hardcoded key if Config is not working
                  language: 'en',
                }}
                fetchDetails={true} // This ensures that you get more detailed information about the selected location
                styles={{
                  textInputContainer: styles.locationTextInputContainer,
                  textInput: styles.locationTextInput
                }}
              />
            </View>


            <TouchableOpacity style={styles.closeButton} onPress={() => setToLocationModal(false)}>
              <Text style={styles.applyButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>


    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  postButtonText: {
    fontSize: 20,
    color: COLORS.white,
    fontWeight: "700",
  },
  postButton: {
    backgroundColor: COLORS.brand,
    height: 50,
    borderRadius: 10,
    marginTop: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  contentContainer: {
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  textInputContainer: {
    flex: 1,
    marginLeft: 12,
    margin: 20,
  },
  label: {
    fontSize: 17,
    fontWeight: "bold",
    marginBottom: 5,
  },
  textInput: {
    borderWidth: 1,
    borderColor: COLORS.gray,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
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
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    height: 40,
  },
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

export default TruckNeeds;
