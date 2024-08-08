import React, { useContext, useState } from "react";
import {
  StyleSheet,
  View,
  Button,
  Alert,
  Text,
  TextInput,
  Image,
  ScrollView,
  TouchableOpacity,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { COLORS } from "../constants";
import HeaderWithOutBS from "../components/HeaderWithOutBS";
import axiosInstance from "../services/axiosInstance";
import { LoadNeedsContext } from "../hooks/LoadNeedsContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";

const SellYourTruck = () => {

  const GOOLE_API_KEY = "AIzaSyCLT-nqnS-13nBpe-mqzJVsRK7RZIl3I5s"



  const {isLoading , setIsLoading} = useContext(LoadNeedsContext)
  const [ownerName, setOwnerName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [kmsDriven, setKmsDriven] = useState("");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);

  const [ownerNameValid, setOwnerNameValid] = useState(true);
  const [contactNumberValid, setContactNumberValid] = useState(true);
  const [vehicleNumberValid, setVehicleNumberValid] = useState(true);
  const [kmsDrivenValid, setKmsDrivenValid] = useState(true);
  const [brandValid, setBrandValid] = useState(true);
  const [modelValid, setModelValid] = useState(true);
  const [locationValid, setLocationValid] = useState(true);
  const [descriptionValid, setDescriptionValid] = useState(true);


  const [locationModal, setLocationModal] = useState(false)

  const handlePostAdd = async () => {
    if (
      ownerName.trim() === "" ||
      contactNumber.trim() === "" ||
      vehicleNumber.trim() === "" ||
      kmsDriven.trim() === "" ||
      brand.trim() === "" ||
      model.trim() === "" ||
      location.trim() === "" ||
      description.trim() === "" ||
      images.length === 0
    ) {
      Alert.alert("Please fill in all the fields and add at least one image.");
      setOwnerNameValid(ownerName.trim() !== "");
      setContactNumberValid(contactNumber.trim() !== "");
      setVehicleNumberValid(vehicleNumber.trim() !== "");
      setKmsDrivenValid(kmsDriven.trim() !== "");
      setBrandValid(brand.trim() !== "");
      setModelValid(model.trim() !== "");
      setLocationValid(location.trim() !== "");
      setDescriptionValid(description.trim() !== "");
      return;
    }
  
    // Create FormData
    const formData = new FormData();
    formData.append('user_id', await AsyncStorage.getItem("user_id"));
    formData.append('owner_name', ownerName);
    formData.append('contact_no', contactNumber);
    formData.append('vehicle_number', vehicleNumber);
    formData.append('kms_driven', kmsDriven);
    formData.append('brand', brand);
    formData.append('model', model);
    formData.append('location', location);
    formData.append('description', description);
    
  
    // Append images to FormData
    images.forEach((image, index) => {
      formData.append(`truck_image${index + 1}`, {
        uri: image.uri,
        type: 'image/jpeg', // Adjust accordingly if different image types
        name: `truck_image_${index + 1}.jpg`, // Use a unique name for the image
      });
    });
  
    try {
      const response = await axiosInstance.post("/truck_buy_sell", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });      
      if(response.data.error_code === 0) {
        Alert.alert("Post added successfully!");
        setIsLoading(!isLoading)
      }
    } catch (error) {
      console.error("Error adding post:", error);
    }
  };
  

  const pickImage = async () => {
    if (images.length >= 3) {
      Alert.alert("Maximum of 3 images can be uploaded.");
      return;
    }
  
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 1,
    });
  
    if (!result.canceled) {
      // Filter out already selected images and limit to 3
      const newImages = result.assets.slice(0, 3 - images.length);
      setImages((prevImages) => [...prevImages, ...newImages]);
    }
  };


  const handleLocation = (data, details) => {
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

    setLocation(`${city} , ${state}`)
    setLocationModal(false)
    // You can use the extracted details as needed
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
      <View style={{ flex: 1, backgroundColor: COLORS.white }}>
        <HeaderWithOutBS title="Sell Your Truck" />

        <ScrollView contentContainerStyle={styles.contentContainer}>
          <View style={styles.textInputContainer}>
            <Text style={styles.label}>Owner Name</Text>
            <TextInput
              style={[
                styles.textInput,
                !ownerNameValid && { borderColor: "red" },
              ]}
              placeholder="Name of the Dealer"
              onChangeText={setOwnerName}
              value={ownerName}
            />
            <Text style={styles.label}>Contact Number</Text>
            <TextInput
              style={[
                styles.textInput,
                !contactNumberValid && { borderColor: "red" },
              ]}
              placeholder="Type Your Number"
              onChangeText={setContactNumber}
              value={contactNumber}
            />
            <Text style={styles.label}>Vehicle Number</Text>
            <TextInput
              style={[
                styles.textInput,
                !vehicleNumberValid && { borderColor: "red" },
              ]}
              placeholder="TN77AX6666"
              onChangeText={setVehicleNumber}
              value={vehicleNumber}
            />
            <Text style={styles.label}>Kms Driven</Text>
            <TextInput
              style={[
                styles.textInput,
                !kmsDrivenValid && { borderColor: "red" },
              ]}
              placeholder="2500000"
              onChangeText={setKmsDriven}
              value={kmsDriven}
            />
            <Text style={styles.label}>Brand</Text>
            <TextInput
              style={[styles.textInput, !brandValid && { borderColor: "red" }]}
              placeholder="Brand"
              onChangeText={setBrand}
              value={brand}
            />
            <Text style={styles.label}>Model</Text>
            <TextInput
              style={[styles.textInput, !modelValid && { borderColor: "red" }]}
              placeholder="Model"
              onChangeText={setModel}
              value={model}
            />
            <Text style={styles.label}>Location</Text>
            <TextInput
              style={[
                styles.textInput,
                !locationValid && { borderColor: "red" },
              ]}
              placeholder="Location"
              // onChangeText={setLocation}
              value={location}
              onPress={() => setLocationModal(true)}
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
            <Button title="Upload Images" onPress={pickImage} />
            <View style={styles.imageContainer}>
              {images.map((image, index) => (
                <Image
                  key={index}
                  source={{ uri: image.uri }}
                  style={styles.image}
                />
              ))}
            </View>
          </View>

          <TouchableOpacity style={styles.postButton} onPress={handlePostAdd}>
            <Text style={styles.postButtonText}>Add Post</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>


      {/* Location Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={locationModal}
      // onRequestClose={() => setIsAadhaarModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Location</Text>


            <View style={styles.locationContainer}>
              <GooglePlacesAutocomplete
                placeholder="Search location"
                onPress={handleLocation}
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


            <TouchableOpacity style={styles.closeButton} onPress={() => setLocationModal(false)}>
              <Text style={styles.applyButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
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
  imageContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginVertical: 10,
  },
  image: {
    width: 100,
    height: 100,
    marginRight: 10,
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

export default SellYourTruck;
