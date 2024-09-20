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
import { Picker } from "react-native-web";
import { Dropdown } from "react-native-element-dropdown";
import { useNavigation } from "@react-navigation/native";
import RNPickerSelect from 'react-native-picker-select';



const SellYourTruck = () => {

  const GOOLE_API_KEY = "AIzaSyCLT-nqnS-13nBpe-mqzJVsRK7RZIl3I5s"

  const navigation = useNavigation("")


  const { isLoading, setIsLoading } = useContext(LoadNeedsContext)
  const [ownerName, setOwnerName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [kmsDriven, setKmsDriven] = useState("");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [truckBodyType, setTruckBodyType] = useState("");
  const [numberOfTyres, setNumberOfTyres] = useState("");
  const [ton, setTon] = useState("");


  const [ownerNameValid, setOwnerNameValid] = useState(true);
  const [contactNumberValid, setContactNumberValid] = useState(true);
  const [vehicleNumberValid, setVehicleNumberValid] = useState(true);
  const [kmsDrivenValid, setKmsDrivenValid] = useState(true);
  const [brandValid, setBrandValid] = useState(true);
  const [modelValid, setModelValid] = useState(true);
  const [priceValid, setPriceValid] = useState(true)
  const [tonValid, setTonValid] = useState(true);

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
      price.trim() === "" ||
      location.trim() === "" ||
      ton.trim() === "" ||
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
      setPriceValid(price.trim() !== "");
      setLocationValid(location.trim() !== "");
      setDescriptionValid(description.trim() !== "");
      setTonValid(ton.trim() !== "");

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
    formData.append('price', price);
    formData.append('location', location);
    formData.append("truck_body_type",truckBodyType)
    formData.append("no_of_tyres",numberOfTyres)
    formData.append('description', description);
    formData.append('tonnage', ton);
    


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


      if (response.data.error_code === 0) {
        setOwnerName("");
        setContactNumber("");
        setVehicleNumber("");
        setKmsDriven("");
        setBrand("");
        setModel("");
        setPrice("");
        setLocation("");
        setDescription("");
        setTon("");

        setImages([])
        Alert.alert("Post added successfully!");
        navigation.goBack()
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



    setLocation(`${city} , ${state}`)
    setLocationModal(false)
    // You can use the extracted details as needed
  };

  const brandData = [
    { label: 'Ashok Leyland', value: 'ashok_leyland' },
    { label: 'Tata', value: 'tata' },
    { label: 'Mahindra', value: 'mahindra' },
    { label: 'Eicher', value: 'eicher' },
    { label: 'Daimler India', value: 'daimler_india' },
    { label: 'Bharat Benz', value: 'bharat_benz' },
    { label: 'Maruthi Suzuki', value: 'maruthi_suzuki' },
    { label: 'SML Lsuzu', value: 'sml_isuzu' },
    { label: 'Force', value: 'force' },
    { label: 'AMW', value: 'amw' },
    { label: 'Man', value: 'man' },
    { label: 'Volvo', value: 'volvo' },
    { label: 'Scania', value: 'scania' },
    { label: 'Others', value: 'others' },
  ]

  const kmsData = [
    { label: '0 - 10,000 kms', value: '0_10000_kms' },
    { label: '10,001 - 30,000 kms', value: '10001_30000_kms' },
    { label: '30,001 - 50,000 kms', value: '30001_50000_kms' },
    { label: '50,001 - 70,000 kms', value: '50001_70000_kms' },
    { label: '70,001 - 100,000 kms', value: '70001_100000_kms' },
    { label: '100,001 - 150,000 kms', value: '100001_150000_kms' },
    { label: '150,001 - 200,000 kms', value: '150001_200000_kms' },
    { label: '200,001 - 300,000 kms', value: '200001_300000_kms' },
    { label: '300,001 - 500,000 kms', value: '300001_500000_kms' },
    { label: '500,001 - 700,000 kms', value: '500001_700000_kms' },
    { label: '700,001 - 1,000,000 kms', value: '700001_1000000_kms' },
    { label: '1,000,001 - 1,500,000 kms', value: '1000001_1500000_kms' },
    { label: '1,500,001 - 2,000,000 kms', value: '1500001_2000000_kms' },
    { label: '2,000,001+ kms', value: '2000001_plus_kms' },
  ];


  const priceData = [
    { label: '0 - 5,00,000 lakhs', value: '0_5_lakhs' },
    { label: '5,00,001 - 10,00,000 lakhs', value: '5_10_lakhs' },
    { label: '10,00,001 - 20,00,000 lakhs', value: '10_20_lakhs' },
    { label: '20,00,001 - 30,00,000 lakhs', value: '20_30_lakhs' },
    { label: '30,00,001 - 40,00,000 lakhs', value: '30_40_lakhs' },
    { label: '40,00,001 - 50,00,000 lakhs', value: '40_50_lakhs' },
    { label: '50,00,001 - 60,00,000 lakhs', value: '50_60_lakhs' },
    { label: '60,00,001 - 70,00,000 lakhs', value: '60_70_lakhs' },
    { label: '70,00,001 - 80,00,000 lakhs', value: '70_80_lakhs' },
    { label: '80,00,001 - 90,00,000 lakhs', value: '80_90_lakhs' },
    { label: '90,00,001 and above lakhs', value: '90_above_lakhs' },
  ];

  const bodyTypeData = [
    { label: 'Open body', value: 'open_body' },
    { label: 'Container', value: 'container' },
    { label: 'Trailer', value: 'trailer' },
    { label: 'Tanker', value: 'tanker' },
    { label: 'Tipper', value: 'tipper' },
    { label: 'LCV', value: 'lcv' },
  ];

  const numberOfTyresData = [
    { label: '4', value: '4' },
    { label: '6', value: '6' },
    { label: '8', value: '8' },
    { label: '10', value: '10' },
    { label: '12', value: '12' },
    { label: '14', value: '14' },
    { label: '16', value: '16' },
    { label: '18', value: '18' },
    { label: '20', value: '20' },
    { label: '22', value: '22' },
  ];



  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 40 }, (_, index) => {
    const year = currentYear - index;
    return {
      label: `${year}`,
      value: `${year}`,
    };
  });

  const yearsData = years








  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
      <View style={{ flex: 1, backgroundColor: COLORS.white }}>
        <HeaderWithOutBS title="Sell Your Truck" />

        <ScrollView contentContainerStyle={styles.contentContainer}>
          <View style={styles.textInputContainer}>

            <Text style={styles.label}>Model Year</Text>
            <View style={{ borderColor: COLORS.gray, borderWidth: 1, padding: 0, borderRadius: 5, marginBottom: 10 }}>

              <RNPickerSelect
                onValueChange={(value) => setModel(value)}
                items={yearsData}
                value={model}
              />
            </View>

            <Text style={styles.label}>Brand</Text>
            <View style={{ borderColor: COLORS.gray, borderWidth: 1, padding: 0, borderRadius: 5, marginBottom: 10 }}>
              <RNPickerSelect
                onValueChange={(value) => setBrand(value)}
                items={brandData}
                value={brand}
              />
            </View>

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
              placeholder="250000"
              keyboardType="number-pad"
              onChangeText={setKmsDriven}
              value={kmsDriven}
            />

            <Text style={styles.label}>Price</Text>
            <TextInput
              style={[styles.textInput, !priceValid && { borderColor: "red" }]}
              placeholder="Price"
              onChangeText={setPrice}
              value={price}
              keyboardType="number-pad"
            />

            <Text style={styles.label}>Contact Number</Text>
            <TextInput
              style={[
                styles.textInput,
                !contactNumberValid && { borderColor: "red" },
              ]}
              keyboardType="number-pad"
              placeholder="Type Your Number"
              onChangeText={setContactNumber}
              value={contactNumber}
              maxLength={10}
            />











            <Text style={styles.label}>Location</Text>
            <TextInput
              style={[
                styles.textInput,
                !locationValid && { borderColor: "red" },
              ]}
              placeholder="Location"
              value={location}
              onPress={() => setLocationModal(true)}
            />

            <Text style={styles.label}>Truck Body Type</Text>
            <View style={{ borderColor: COLORS.gray, borderWidth: 1, padding: 0, borderRadius: 5, marginBottom: 10 }}>
              <RNPickerSelect
                onValueChange={(value) => setTruckBodyType(value)}
                items={bodyTypeData}
                value={truckBodyType}
                placeholder={{
                  label: 'Select truck body type',
                  value: null,
                  color: 'grey',
                }}
              />
            </View>


            <Text style={styles.label}>No. of Tyres</Text>

            <View style={{ borderColor: COLORS.gray, borderWidth: 1, padding: 0, borderRadius: 5, marginBottom: 10 }}>
              <RNPickerSelect
                onValueChange={(value) => setNumberOfTyres(value)}
                items={numberOfTyresData}
                value={numberOfTyres}
                placeholder={{
                  label: 'Select number of tyres',
                  value: null,
                  color: 'grey',
                }}
              />
            </View>

            <Text style={styles.label}>Ton</Text>
            <TextInput
              style={[styles.textInput, !tonValid && { borderColor: "red" }]}
              placeholder="Example : 2"
              onChangeText={setTon}
              value={ton}
              keyboardType="number-pad"
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
    padding: 15,
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
  dropdown: {
    fontSize: 14,
    width: "100%",
    borderBottomColor: 'gray',
    paddingLeft: 12,
    borderWidth: 1,
    borderWidth: 1,
    borderColor: COLORS.gray,
    borderRadius: 5,
    paddingVertical: 11,
    marginBottom: 10,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 14,
    color: 'grey'
  },
  itemTextStyle: {
    fontSize: 14,
  },
  selectedTextStyle: {
    fontSize: 14,
  },
});

export default SellYourTruck;
