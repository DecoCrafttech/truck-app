import React, { useContext, useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Modal,
  TextInput,
  TouchableOpacity,
  Text,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "../../constants";
import HeaderWithOutBS from "../../components/HeaderWithOutBS";
import MarketPlaceProducts from "./MarketPlaceProducts";
import SearchFilter from "../../components/SearchFilter";
import CustomButton from "../../components/CustomButton";
import { LoadNeedsContext } from "../../hooks/LoadNeedsContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axiosInstance from "../../services/axiosInstance";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";


const MarketPlace = ({ navigation }) => {

  const GOOLE_API_KEY = "AIzaSyCLT-nqnS-13nBpe-mqzJVsRK7RZIl3I5s"
  const [loading, setLoading] = useState(true);

  const {
    isLoading,
    setIsLoading,
    aadhaarOTP,
    setAadhaarOTP
  } = useContext(LoadNeedsContext)

  const [searchQuery, setSearchQuery] = useState("");
  const [marketPlaceProducts, setMarketPlaceProducts] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isAadhaarModal, setIsAadhaarModal] = useState(false)
  const [modalValues, setModalValues] = useState({
    brand: "",
    model: "",
    location: "",
  });
  const [errorFields, setErrorFields] = useState({
    brand: false,
    model: false,
    location: false,
  });
  const [aadhaar, setAadhaar] = useState("")
  const [aadhaarError, setAadhaarError] = useState("")
  const [showOTPInputBox, setShowOTPInputBox] = useState(false)
  const [timeLeft, setTimeLeft] = useState(null);

  const [locationModal, setLocationModal] = useState(false)

  useEffect(() => {
    const getMarketPlaceProducts = async () => {
      try {
        const response = await axiosInstance.get("/all_buy_sell_details");
        if (response.data.error_code === 0) {
          setMarketPlaceProducts(response.data.data);
        } else {
          console.log(response.data.message);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    getMarketPlaceProducts();
  }, [isLoading]);


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
      const isAadhaarVerifiedParams = {
        user_id: `${await AsyncStorage.getItem("user_id")}`
      }
      const response = await axiosInstance.post("/check_aadhar_verification", isAadhaarVerifiedParams)
      console.log(response)
      if (response.data.error_code === 0) {
        if (response.data.data.is_aadhar_verified === true) {
          navigation.navigate("SellYourTruck");
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


  const onPressCategory = (item) => {
    navigation.navigate("TruckDetails", { item });
  };

  const filteredProducts = marketPlaceProducts.filter((product) =>
    product.brand.toLowerCase().includes(searchQuery.toLowerCase())
  );


  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);

    setModalValues({
      brand: "",
      model: "",
      location: "",
    });
    setErrorFields({
      brand: false,
      model: false,
      location: false,
    });
  };

  const handleInputChange = (field, value) => {
    setModalValues({ ...modalValues, [field]: value });
    setErrorFields({ ...errorFields, [field]: false });
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
        navigation.navigate("SellYourTruck");
      } else {
        Toast.error(response.data.message)
        return
      }

    } catch (err) {
      console.log(err)
    }
  }

  const applyFilter = async () => {
    // let hasError = false;
    // const errors = {};

    // Object.keys(modalValues).forEach((key) => {
    //   if (!modalValues[key]) {
    //     errors[key] = true;
    //     hasError = true;
    //   }
    // });

    // if (hasError) {
    //   setErrorFields(errors);
    //   return;
    // }


    const filterParams = {
      "owner_name": "",
      "vehicle_number": "",
      "contact_no": "",
      "kms_driven": "",
      "brand": modalValues.brand,
      "model": modalValues.model,
      "location": modalValues.location
    }

    try {

      console.log(filterParams)

      const response = await axiosInstance.post("/user_buy_sell_filter", filterParams)
      if (response.data.error_code === 0) {
      
        setMarketPlaceProducts(response.data.data)
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
        <HeaderWithOutBS title="Market Place" />
        <View style={styles.container}>
          <CustomButton
            title="Sell your Truck"
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
        <MarketPlaceProducts
          navigation={navigation}
          searchQuery={searchQuery}
          onPressCategory={onPressCategory}
          filteredProducts={filteredProducts}
          loading={loading}
        />
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
              style={[styles.input, errorFields.brand && styles.inputError]}
              placeholder="Brand"
              value={modalValues.brand}
              onChangeText={(text) => handleInputChange("brand", text)}
            />
            <TextInput
              style={[styles.input, errorFields.model && styles.inputError]}
              placeholder="Model"
              value={modalValues.model}
              onChangeText={(text) => handleInputChange("model", text)}
            />
            <TextInput
              style={[styles.input, errorFields.location && styles.inputError]}
              placeholder="location"
              value={modalValues.location}
              // onChangeText={(text) => handleInputChange("location", text)}
              onPress={() => setLocationModal(true)}
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
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    marginTop: 10,
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
});

export default MarketPlace;
