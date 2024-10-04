import React, { useContext, useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Modal,
  TextInput,
  TouchableOpacity,
  Text,
  Alert,
  ActivityIndicator,
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
import AadhaarOTPVerification from "../AadhaarOTPVerification";
import Toast from "react-native-toast-message";
import RNPickerSelect from 'react-native-picker-select';
import Constants from 'expo-constants'


const MarketPlace = ({ navigation }) => {

  
  // google api key
  const googleApiKey = Constants.expoConfig?.extra?.REACT_APP_GOOGLE_PLACES_KEY

  const [loading, setLoading] = useState(true);

  const {
    isLoading,
    setIsLoading,
    aadhaarOTP,
  } = useContext(LoadNeedsContext)

  const [searchQuery, setSearchQuery] = useState("");
  const [marketPlaceProducts, setMarketPlaceProducts] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isAadhaarModal, setIsAadhaarModal] = useState(false)
  const [modalValues, setModalValues] = useState({
    brand: "",
    price: "",
    kmsDriven: "",
    model: "",
    location: "",
    ton: ""
  });
  const [errorFields, setErrorFields] = useState({
    brand: false,
    price: false,
    kmsDriven: false,
    model: false,
    location: false,
    ton: false
  });

  const [truckBodyType, setTruckBodyType] = useState("");
  const [numberOfTyres, setNumberOfTyres] = useState("");
  const [aadhaar, setAadhaar] = useState("")
  const [aadhaarError, setAadhaarError] = useState("")
  const [showOTPInputBox, setShowOTPInputBox] = useState(false)
  const [timeLeft, setTimeLeft] = useState(null);

  const [locationModal, setLocationModal] = useState(false)
  const [pageLoading, setPageLoading] = useState(false)


  useEffect(() => {
    const getMarketPlaceProducts = async () => {
      try {
        setPageLoading(true)
        const response = await axiosInstance.get("/all_buy_sell_details");
        if (response.data.error_code === 0) {
          setMarketPlaceProducts(response.data.data);
          setPageLoading(false)
        } else {
          console.log(response.data.message);
          setPageLoading(false)

        }
      } catch (error) {
        console.log(error);
        setPageLoading(false)

      } finally {
        setLoading(false);
        setPageLoading(false)

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
    product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.location.toLowerCase().includes(searchQuery.toLowerCase())
  );


  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);

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
        if (response.data.error_code === 0) {
          AsyncStorage.setItem("client_id", response.data.data[0].client_id)
          setShowOTPInputBox(true)
          setTimeLeft(60)
        } else {
          Alert.alert(response.data.message)
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
      if (response.data.error_code === 0) {
        Alert.alert("OTP Resent successfully")
        setTimeLeft(60)
        AsyncStorage.setItem("client_id", response.data.data[0].client_id)
      } else {
        Alert.alert(response.data.message)
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



      const response = await axiosInstance.post("/aadhaar_submit_otp", verifyParams)

      if (response.data.error_code === 0) {
        Toast.success(response.data.message)
        setIsAadhaarModal(false)
        setTimeLeft(null)
        AsyncStorage.removeItem("client_id")
        navigation.navigate("SellYourTruck");
      } else {
        Alert.alert(response.data.message)
        return
      }

    } catch (err) {
      console.log(err)
    }
  }

  const applyFilter = async () => {

    const filterParams = {
      "user_id": "",
      "owner_name": "",
      "vehicle_number": "",
      "contact_no": "",
      "kms_driven": modalValues.kmsDriven,
      "brand": modalValues.brand !== "" ? [`${modalValues.brand}`] : [],
      "model": modalValues.model !== "" ? [`${modalValues.model}`] : [],
      "location": modalValues.location,
      "price": modalValues.price !== "" ? modalValues.price : "",
      "tonnage": modalValues.ton
    }



    try {
      toggleModal(); // Close modal after applying filter
      setPageLoading(true)


      const response = await axiosInstance.post("/user_buy_sell_filter", filterParams)
      if (response.data.error_code === 0) {
        setMarketPlaceProducts(response.data.data)
        setPageLoading(false)


      } else {
        console.error(
          "Error fetching all loads:",
          response.data.error_message
        );
        setPageLoading(false)

      }

    } catch (err) {
      console.log(err)
      setPageLoading(false)

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


    setModalValues({
      ...modalValues, location: (`${city}, ${state}`)
    })
    setLocationModal(false)
  };



  const handleClearFilter = () => {
    setIsLoading(!isLoading);
    setModalValues({
      brand: "",
      price: "",
      kmsDriven: "",
      model: "",
      location: "",
      ton: ""
    });
    setTruckBodyType("")
    setNumberOfTyres("")
    toggleModal()
  }

  const brandData = [
    { label: 'Ashok Leyland', value: 'Ashok Leyland' },
    { label: 'Tata', value: 'Tata' },
    { label: 'Mahindra', value: 'Mahindra' },
    { label: 'Eicher', value: 'Eicher' },
    { label: 'Daimler India', value: 'Daimler India' },
    { label: 'Bharat Benz', value: 'Bharat Benz' },
    { label: 'Maruthi Suzuki', value: 'Maruthi Suzuki' },
    { label: 'SML Lsuzu', value: 'SML Lsuzu' },
    { label: 'Force', value: 'Force' },
    { label: 'AMW', value: 'AMW' },
    { label: 'Man', value: 'Man' },
    { label: 'Volvo', value: 'Volvo' },
    { label: 'Scania', value: 'Scania' },
    { label: 'Others', value: 'Others' },
  ]

  const kmsData = [
    { label: '0 - 10,000 kms', value: '(0 - 10,000) kms' },
    { label: '10,001 - 30,000 kms', value: '(10,001 - 30,000) kms' },
    { label: '30,001 - 50,000 kms', value: '(30,001 - 50,000) kms' },
    { label: '50,001 - 70,000 kms', value: '(50,001 - 70,000) kms' },
    { label: '70,001 - 100,000 kms', value: '(70,001 - 100,000) kms' },
    { label: '100,001 - 150,000 kms', value: '(100,001 - 150,000) kms' },
    { label: '150,001 - 200,000 kms', value: '(150,001 - 200,000) kms' },
    { label: '200,001 - 300,000 kms', value: '(200,001 - 300,000) kms' },
    { label: '300,001 - 500,000 kms', value: '(300,001 - 500,000) kms' },
    { label: '500,001 - 700,000 kms', value: '(500,001 - 700,000) kms' },
    { label: '700,001 - 1,000,000 kms', value: '(700,001 - 1,000,000) kms' },
    { label: '1,000,001 - 1,500,000 kms', value: '(1,000,001 - 1,500,000) kms' },
    { label: '1,500,001 - 2,000,000 kms', value: '(1,500,001 - 2,000,000) kms' },
    { label: '2,000,001+ kms', value: '(2,000,001+) kms' }
  ];


  const priceData = [
    { label: '0 - 5,00,000 lakhs', value: '(0 - 5,00,000) lakhs' },
    { label: '5,00,001 - 10,00,000 lakhs', value: '(5,00,001 - 10,00,000) lakhs' },
    { label: '10,00,001 - 20,00,000 lakhs', value: '(10,00,001 - 20,00,000) lakhs' },
    { label: '20,00,001 - 30,00,000 lakhs', value: '(20,00,001 - 30,00,000) lakhs' },
    { label: '30,00,001 - 40,00,000 lakhs', value: '(30,00,001 - 40,00,000) lakhs' },
    { label: '40,00,001 - 50,00,000 lakhs', value: '(40,00,001 - 50,00,000) lakhs' },
    { label: '50,00,001 - 60,00,000 lakhs', value: '(50,00,001 - 60,00,000) lakhs' },
    { label: '60,00,001 - 70,00,000 lakhs', value: '(60,00,001 - 70,00,000) lakhs' },
    { label: '70,00,001 - 80,00,000 lakhs', value: '(70,00,001 - 80,00,000) lakhs' },
    { label: '80,00,001 - 90,00,000 lakhs', value: '(80,00,001 - 90,00,000) lakhs' },
    { label: '90,00,001 and above lakhs', value: '(90,00,001 and above) lakhs' }
  ];



  const bodyTypeData = [
    { label: 'Open body', value: 'Open body' },
    { label: 'Container', value: 'Container' },
    { label: 'Trailer', value: 'Trailer' },
    { label: 'Tanker', value: 'Tanker' },
    { label: 'Tipper', value: 'Tipper' },
    { label: 'LCV', value: 'LCV' },
    { label: 'Bus', value: 'Bus' },
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
  const years = Array.from({ length: 45 }, (_, index) => {
    const year = currentYear - index;
    return {
      label: `${year}`,
      value: `${year}`,
    };
  });

  const yearsData = years


  const tonsData = [
    { label: "1 Ton - 2.5 Ton", value: "1 Ton - 2.5 Ton" },
    { label: "2.5 Ton - 5 Ton", value: "2.5 Ton - 5 Ton" },
    { label: "5 Ton - 10 Ton", value: "5 Ton - 10 Ton" },
    { label: "10 Ton - 20 Ton", value: "10 Ton - 20 Ton" },
    { label: "20 Ton - 40 Ton", value: "20 Ton - 40 Ton" },
    { label: "Above 40 Ton", value: "Above 40 Ton" },
  ]



  const handleClose = () => {
    setShowOTPInputBox(false)
    setIsAadhaarModal(false)
  }


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
        {
          pageLoading === false ?
            <MarketPlaceProducts
              navigation={navigation}
              searchQuery={searchQuery}
              onPressCategory={onPressCategory}
              filteredProducts={filteredProducts.reverse()}
              loading={loading}
            />
            :
            <View style={styles.ActivityIndicatorContainer}>
              <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        }
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={toggleModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.filterHeadingContainer}>
              <Text style={styles.modalTitle}>Filter Options</Text>
            </View>


            <View style={{ borderColor: COLORS.gray, borderWidth: 1, padding: 0, borderRadius: 5, marginBottom: 10 }}>
              <RNPickerSelect
                onValueChange={(value) => setModalValues({ ...modalValues, model: value })}
                items={yearsData}
                value={modalValues.model}
                placeholder={{
                  label: 'Model',
                  value: null,
                  color: 'grey',
                }}
              />
            </View>

            <View style={{ borderColor: COLORS.gray, borderWidth: 1, padding: 0, borderRadius: 5, marginBottom: 10 }}>
              <RNPickerSelect
                onValueChange={(value) => setModalValues({ ...modalValues, brand: value })}
                items={brandData}
                value={modalValues.brand}
                placeholder={{
                  label: 'Brand',
                  value: null,
                  color: 'grey',
                }}
              />
            </View>

            <TextInput
              style={[styles.input, errorFields.location && styles.inputError, { fontSize: 16, borderColor: COLORS.gray, borderWidth: 1, paddingLeft: 17, borderRadius: 5, height: 55, marginBottom: 10 }]}
              placeholder="Search location"
              placeholderTextColor="#c2c2c2"
              value={modalValues.location}
              onPress={() => {
                setLocationModal(true);
              }}
            />

            <View style={{ borderColor: COLORS.gray, borderWidth: 1, padding: 0, borderRadius: 5, marginBottom: 10 }}>
              <RNPickerSelect
                onValueChange={(value) => setModalValues({ ...modalValues, ton: value })}
                items={tonsData}
                value={modalValues.ton}
                placeholder={{
                  label: 'Select ton',
                  value: null,
                  color: 'grey',
                }}
              />
            </View>


            <View style={{ borderColor: COLORS.gray, borderWidth: 1, padding: 0, borderRadius: 5, marginBottom: 10 }}>
              <RNPickerSelect
                onValueChange={(value) => setModalValues({ ...modalValues, kmsDriven: value })}
                items={kmsData}
                value={modalValues.kmsDriven}
                placeholder={{
                  label: 'KMS Driven',
                  value: null,
                  color: 'grey',
                }}
              />
            </View>





            <View style={{ borderColor: COLORS.gray, borderWidth: 1, padding: 0, borderRadius: 5, marginBottom: 10 }}>
              <RNPickerSelect
                onValueChange={(value) => setModalValues({ ...modalValues, price: value })}
                items={priceData}
                value={modalValues.price}
                placeholder={{
                  label: 'Price',
                  color: 'grey',
                }}
              />
            </View>


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





            <TouchableOpacity style={styles.applyButton} onPress={applyFilter}>
              <Text style={styles.applyButtonText}>Apply filter</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.applyButton}
              onPress={() => handleClearFilter()}>
              <Text style={styles.applyButtonText} >Clear filter</Text>
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
                    <Text>Didn't receive the code ? </Text>
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
            <TouchableOpacity style={styles.closeButton} onPress={() => handleClose()}>
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
      >
        <View style={styles.locationModalContainer}>
          <View style={styles.locationModalContent}>
            <Text style={styles.modalTitle}>Location</Text>


            <View style={styles.locationContainer}>
              <GooglePlacesAutocomplete
                placeholder="Search location"
                onPress={handleLocation}
                textInputProps={{
                  autoFocus: true,
                }}
                query={{
                  key: googleApiKey, // Use your hardcoded key if Config is not working
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

    </SafeAreaView >
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    marginTop: 10,

  },
  ActivityIndicatorContainer : {
    flex : 1,
    justifyContent:'center',
  },  
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    height: "90%"
  },
  modalContent: {
    backgroundColor: COLORS.white,
    padding: 20,
    width: "80%",
    borderRadius: 10,
    elevation: 5,

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
  closeIcon: {
    position: 'absolute',
    end: 20,
    top: 15
  },
  textInput: {
    borderWidth: 1,
    borderColor: COLORS.gray,
    borderRadius: 5,
    padding: 15,
    marginBottom: 10,
  },

});

export default MarketPlace;
