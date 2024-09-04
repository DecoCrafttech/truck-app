import React, { useState, useEffect, useContext } from "react";
import {
  StyleSheet,
  View,
  ActivityIndicator,
  Linking,
  Modal,
  TextInput,
  TouchableOpacity,
  Text,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "../../constants";
import HeaderWithOutBS from "../../components/HeaderWithOutBS";
import SearchFilter from "../../components/SearchFilter";
import CustomButton from "../../components/CustomButton";
import axiosInstance from "../../services/axiosInstance";
import TruckDetails from "./TruckDetails";
import { LoadNeedsContext } from "../../hooks/LoadNeedsContext";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";

const AvailableTruck = ({ navigation }) => {

  const GOOLE_API_KEY = "AIzaSyCLT-nqnS-13nBpe-mqzJVsRK7RZIl3I5s"


  const {
    isLoading,
    setIsLoading,
    aadhaarOTP,
    setAadhaarOTP,
    setMessageReceiver

  } = useContext(LoadNeedsContext)

  const [searchQuery, setSearchQuery] = useState("");
  const [getTruckData, setGetTruckData] = useState([]);
  const [isLoadings, setisLoadings] = useState(true);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isAadhaarModal, setIsAadhaarModal] = useState(false)

  const [modalValues, setModalValues] = useState({
    companyName: "",
    fromLocation: "",
    toLocation: "",
    material: "",
    noOfTyres: "",
    tons: "",
    truckBodyType: "",
  });
  const [errorFields, setErrorFields] = useState({
    companyName: false,
    fromLocation: false,
    toLocation: false,
    material: false,
    noOfTyres: false,
    tons: false,
    truckBodyType: false,
  });
  const [aadhaar, setAadhaar] = useState("")
  const [aadhaarError, setAadhaarError] = useState("")
  const [showOTPInputBox, setShowOTPInputBox] = useState(false)
  const [timeLeft, setTimeLeft] = useState(null);

  const [fromLocationModal, setFromLocationModal] = useState(false)
  const [toLocationModal, setToLocationModal] = useState(false)

  useEffect(() => {
    if (timeLeft === 0) {
      setTimeLeft(null);
    }

    if (!timeLeft) return;

    const intervalId = setInterval(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timeLeft]);

  const navigateToSellYourTruck = async () => {

    try {

      console.log(`${await AsyncStorage.getItem("user_id")}`)
      const isAadhaarVerifiedParams = {
        user_id: `${await AsyncStorage.getItem("user_id")}`
      }
      const response = await axiosInstance.post("/check_aadhar_verification", isAadhaarVerifiedParams)
      console.log(response)
      console.log("true or false", response.data.data.is_aadhar_verified)
      if (response.data.error_code === 0) {
        if (response.data.data.is_aadhar_verified === true) {

          navigation.navigate("TruckNeeds");
        } else {
          setIsAadhaarModal(true)
          setAadhaar("")
        }
      } else {
        Toast.error(response.data.message)
      }
    } catch (err) {
      console.log(err)
    }
  };


  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleChatNavigate = () => {
    navigation.navigate("Chat")
  }

  useEffect(() => {
    const getAllTruckDetails = async () => {
      try {
        const response = await axiosInstance.get("/all_truck_details");
        if (response.data.error_code === 0) {
          const transformedData = response.data.data.map((item) => ({
            title: item.company_name,
            fromLocation: item.from_location,
            toLocation: item.to_location,
            labels: [
              { icon: "table-view", text: item.truck_name },
              { icon: "directions-bus", text: item.vehicle_number },
              { icon: "attractions", text: item.no_of_tyres },
              { icon: "local-shipping", text: item.truck_body_type },
              { icon: "verified", text: "RC verified" },
            ],
            description: item.description,
            onButton1Press: () => Linking.openURL(`tel:${item.contact_no}`),
            onButton2Press: () => {
              setMessageReceiver(item)
              handleChatNavigate()
            }
          }));

          setGetTruckData(transformedData);
        } else {
          console.error(
            "Error fetching all loads:",
            response.data.error_message
          );
        }
      } catch (error) {
        console.error("Error fetching all loads:", error);
      } finally {
        setisLoadings(false); // Set loading to false after fetch completes
      }
    };

    getAllTruckDetails();
  }, [isLoading]);

  const filteredTrucks = getTruckData.filter(
    (truck) =>
      truck.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      truck.fromLocation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      truck.toLocation.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
    setModalValues({
      companyName: "",
      fromLocation: "",
      toLocation: "",
      material: "",
      noOfTyres: "",
      tons: "",
      truckBodyType: "",
    });
    setErrorFields({
      companyName: false,
      fromLocation: false,
      toLocation: false,
      material: false,
      noOfTyres: false,
      tons: false,
      truckBodyType: false,
    });
  };

  const handleInputChange = (field, value) => {
    setModalValues({ ...modalValues, [field]: value });
    // setErrorFields({ ...errorFields, [field]: false });
  };

  const handleAadhaarSubmit = async () => {
    if (aadhaar === "") {
      setAadhaarError("Enter your aadhaar number")
      return
    } else {
      setAadhaarError("")
      try {
        const generateOTPParams = {
          id_number: `${aadhaar}`
        }
        const response = await axiosInstance.post("/aadhaar_generate_otp", generateOTPParams)
        console.log(response.data)
        if (response.data.error_code === 0) {
          console.log(response.data)
          AsyncStorage.setItem("client_id", response.data.data[0].client_id)
          setShowOTPInputBox(true)
          setTimeLeft(60)
        } else {
          Toast.error(response.data.message)
        }
      } catch (err) {
        console.log(err)
      }
    }
  }

  const resendClick = async () => {
    try {
      const resendParams = {
        id_number: `${aadhaar}`
      }
      const response = await axiosInstance.post("/aadhaar_generate_otp", resendParams)
      console.log(response.data)
      if (response.data.error_code === 0) {
        console.log(response.data)
        AsyncStorage.setItem("client_id", response.data.data[0].client_id)
      } else {
        Toast.error(response.data.message)
      }
    } catch (err) {
      console.log(err)
    }

  }

  const handleVerifyAadhaarOTP = async () => {
    const verifyParams = {
      "client_id": `${await AsyncStorage.getItem("client_id")}`,
      "otp": `${aadhaarOTP}`,
      "user_id": `${await AsyncStorage.getItem("user_id")}`
    }

    try {


      console.log(verifyParams)

      const response = await axiosInstance.post("/aadhaar_submit_otp", verifyParams)

      if (response.data.error_code === 0) {
        console.log(response)
        Toast.success(response.data.message)
        setIsAadhaarModal(false)
        setTimeLeft(null)
        AsyncStorage.removeItem("client_id")
        navigation.navigate("TruckNeeds");
      } else {
        Toast.error(response.data.message)
        return
      }

    } catch (err) {
      console.log(err)
    }
  }

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


    setModalValues((prevState) => ({
      ...prevState, fromLocation: (`${city} , ${state}`)
    }))
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


    setModalValues((prevState) => ({
      ...prevState, toLocation: (`${city} , ${state}`)
    }))
    setToLocationModal(false)
    // You can use the extracted details as needed
  };

  const applyFilter = async () => {
    const filterParams = {
      "contact_no": "",
      "vehicle_number": "",
      "company_name": "",
      "from_location": modalValues.fromLocation,
      "to_location": modalValues.toLocation,
      "truck_name": "",
      "truck_body_type": modalValues.truckBodyType,
      "no_of_tyres": modalValues.noOfTyres,
      "tone": modalValues.tons
    }

    try {
      const response = await axiosInstance.post("/user_truck_details_filter", filterParams)
      if (response.data.error_code === 0) {
        const transformedData = response.data.data.map((item) => ({
          title: item.company_name,
          fromLocation: item.from_location,
          toLocation: item.to_location,
          labels: [
            { icon: "table-view", text: item.truck_name },
            { icon: "directions-bus", text: item.vehicle_number },
            { icon: "attractions", text: item.no_of_tyres },
            { icon: "local-shipping", text: item.truck_body_type },
            { icon: "verified", text: "RC verified" },
          ],
          description: item.description,
          onButton1Press: () => Linking.openURL(`tel:${item.contact_no}`),
          onButton2Press: () => {
            setMessageReceiver(item)
            handleChatNavigate()
          }
        }));
        setGetTruckData(transformedData);
        toggleModal(); // Close modal after applying filter
      } else {
        console.error(
          "Error fetching all loads:",
          response.data.error_message
        );
      }
    } catch (err) {
      console.log(err)
    }
  };

  if (isLoadings) {
    return (
      <SafeAreaView style={styles.centeredContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
      <View style={{ flex: 1, backgroundColor: COLORS.white }}>
        <HeaderWithOutBS title="Available Truck" />
        <View style={styles.container}>
          <CustomButton
            title="Post Truck Details"
            onPress={navigateToSellYourTruck}
            backgroundColor="#8a1c33"
            textColor="white"
          />
          <CustomButton
            title="Filter"
            onPress={toggleModal}
            backgroundColor="#8a1c33"
            textColor="white"
          />
        </View>
        <SearchFilter onSearch={handleSearch} />
        <TruckDetails navigation={navigation} filteredTrucks={filteredTrucks} />
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={toggleModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Filter Options</Text>
            <TextInput
              style={[
                styles.input,
                errorFields.companyName && styles.inputError,
              ]}
              placeholder="Company Name"
              value={modalValues.companyName}
              onChangeText={(text) => handleInputChange("companyName", text)}
            />
            <TextInput
              style={[
                styles.input,
                errorFields.fromLocation && styles.inputError,
              ]}
              placeholder="From Location"
              value={modalValues.fromLocation}
              // onChangeText={(text) => handleInputChange('fromLocation', text)}
              onPress={() => {
                setFromLocationModal(true);
                setModalValues(prevValues => ({
                  ...prevValues,
                  fromLocation: ""
                }));
              }}
            />
            <TextInput
              style={[
                styles.input,
                errorFields.toLocation && styles.inputError,
              ]}
              placeholder="To Location"
              value={modalValues.toLocation}
              // onChangeText={(text) => handleInputChange('toLocation', text)}
              onPress={() => {
                setToLocationModal(true);
                setModalValues(prevValues => ({
                  ...prevValues,
                  toLocation: ""
                }));
              }}
            />
            <TextInput
              style={[styles.input, errorFields.material && styles.inputError]}
              placeholder="Material"
              value={modalValues.material}
              onChangeText={(text) => handleInputChange("material", text)}
            />
            <TextInput
              style={[styles.input, errorFields.noOfTyres && styles.inputError]}
              placeholder="Number of Tyres"
              keyboardType="number-pad"
              value={modalValues.noOfTyres}
              onChangeText={(text) => handleInputChange("noOfTyres", text)}
            />
            <TextInput
              style={[styles.input, errorFields.tons && styles.inputError]}
              placeholder="Tons"
              keyboardType="number-pad"
              value={modalValues.tons}
              onChangeText={(text) => handleInputChange("tons", text)}
            />
            <TextInput
              style={[
                styles.input,
                errorFields.truckBodyType && styles.inputError,
              ]}
              placeholder="Truck Body Type"
              value={modalValues.truckBodyType}
              onChangeText={(text) => handleInputChange("truckBodyType", text)}
            />
            <TouchableOpacity style={styles.applyButton} onPress={applyFilter}>
              <Text style={styles.applyButtonText}>Apply Filter</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.closeButton} onPress={toggleModal}>
              <Text style={styles.applyButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Aadhaar verify Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isAadhaarModal}
        onRequestClose={() => setIsAadhaarModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Aadhaar Verication</Text>
            <TextInput
              style={[styles.input, errorFields.companyName && styles.inputError, { marginVertical: 30 }]}
              placeholder="Enter your 12 digit aadhaar"
              value={aadhaar}
              maxLength={12}
              keyboardType="number-pad"
              onChangeText={(text) => setAadhaar(text)}
            />
            {
              aadhaarError !== "" ?
                <Text style={{ color: 'red', marginBottom: 20 }}>{aadhaarError}</Text>
                :
                null
            }

            {
              showOTPInputBox ?
                <>
                  <AadhaarOTPVerification
                  />
                  <View style={{ alignItems: 'center', marginVertical: 20 }}>
                    <Text>Don't receive the code ? </Text>
                    <TouchableOpacity disabled={timeLeft === null ? false : true}>
                      <Text
                        style={{ color: timeLeft === null ? "#4285F4" : '#ccc', fontWeight: 'bold', textDecorationLine: 'underline', marginTop: 10 }}
                        onPress={resendClick}
                        disabled={timeLeft === null ? false : true}
                      >
                        {""}Resend code
                      </Text>
                      <Text style={{ display: timeLeft === null ? "none" : "inline" }}>(in {timeLeft} seconds)</Text>
                    </TouchableOpacity>
                  </View>
                </>
                :
                null
            }


            {
              showOTPInputBox ?
                // OTP Verify
                <TouchableOpacity style={[styles.applyButton, { marginTop: 20 }]} onPress={handleVerifyAadhaarOTP}>
                  <Text style={styles.applyButtonText}>Verify</Text>
                </TouchableOpacity>
                :
                // Aadhaar submit
                <TouchableOpacity style={[styles.applyButton, { marginTop: 20 }]} onPress={handleAadhaarSubmit}>
                  <Text style={styles.applyButtonText}>Submit</Text>
                </TouchableOpacity>
            }
            <TouchableOpacity style={styles.closeButton} onPress={() => setIsAadhaarModal(false)}>
              <Text style={styles.applyButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/*From Location Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={fromLocationModal}
      // onRequestClose={() => setIsAadhaarModal(false)}
      >
        <View style={styles.locationModalContainer}>
          <View style={styles.locationModalContent}>
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

      {/*To Location Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={toLocationModal}
      // onRequestClose={() => setIsAadhaarModal(false)}
      >
        <View style={styles.locationModalContainer}>
          <View style={styles.locationModalContent}>
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
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    marginTop: 10,
  },
  centeredContainer: {
    flex: 1,
    backgroundColor: "#e8f4ff",
    justifyContent: "center",
    alignItems: "center",
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
    width: "80%",
    borderRadius: 10,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    height: 40,
  },
  inputError: {
    borderColor: "red",
  },
  applyButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  applyButtonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
  closeButton: {
    backgroundColor: "#8a1c33",
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  locationModalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    height: "90%"
  },
  locationModalContent: {
    backgroundColor: COLORS.white,
    padding: 20,
    width: "80%",
    borderRadius: 10,
    elevation: 5,
    height: "90%"
  },
  locationContainer: {
    flex: 1,
    padding: 5,
  },
  locationTextInput: {
    borderWidth: 1,
    borderColor: COLORS.gray,
  },
});

export default AvailableTruck;
