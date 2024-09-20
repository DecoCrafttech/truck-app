import React, { useState, useEffect, useContext } from "react";
import {
  StyleSheet,
  View,
  Modal,
  TextInput,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  Linking,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "../../constants";
import HeaderWithOutBS from "../../components/HeaderWithOutBS";
import SearchFilter from "../../components/SearchFilter";
import CustomButton from "../../components/CustomButton";
import DriverDetails from "./DriverDetails";
import axiosInstance from "../../services/axiosInstance";
import { LoadNeedsContext } from "../../hooks/LoadNeedsContext";
import axios from "axios";
import { OtpInput } from "react-native-otp-entry";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import RNPickerSelect from 'react-native-picker-select';
import SectionedMultiSelect from "react-native-sectioned-multi-select";
import { MaterialIcons as Icon } from '@expo/vector-icons';



const AvailableDrivers = ({ navigation }) => {

  const GOOLE_API_KEY = "AIzaSyCLT-nqnS-13nBpe-mqzJVsRK7RZIl3I5s"

  const {
    isLoading,
    setIsLoading,
    aadhaarOTP,
    setAadhaarOTP,
    setMessageReceiver,
    userStatesFromProfile,
    setUserStatesFromProfile

  } = useContext(LoadNeedsContext)

  const [searchQuery, setSearchQuery] = useState("");
  const [driversData, setDriversData] = useState([]);
  const [isLoadings, setisLoadings] = useState(true);

  const [selectedStates, setSelectedStates] = useState([]);
  const [filteredStates, setFilteredStates] = useState([])
  const [userToLocationStatesData, setUserToLocationStatesData] = useState({})

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isAadhaarModal, setIsAadhaarModal] = useState(false)

  const [modalValues, setModalValues] = useState({
    driverName: "",
    fromLocation: "",
    toLocation: "",
    vehicleNumber: "",
    noOfTyres: "",
    truckBodyType: "",
    truckName: "",
  });
  const [errorFields, setErrorFields] = useState({
    driverName: false,
    fromLocation: false,
    toLocation: false,
    vehicleNumber: false,
    noOfTyres: false,
    truckBodyType: false,
    truckName: false,
  });
  const [aadhaar, setAadhaar] = useState("")
  const [aadhaarError, setAadhaarError] = useState("")
  const [showOTPInputBox, setShowOTPInputBox] = useState(false)
  const [timeLeft, setTimeLeft] = useState(null);

  const [fromLocationModal, setFromLocationModal] = useState(false)
  const [toLocationModal, setToLocationModal] = useState(false)




  useEffect(() => {
    setUserToLocationStatesData(
      userStatesFromProfile.map((state, index) => ({
        id: index + 1,
        name: state
      }))
    )
  }, [])



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
          navigation.navigate("DriverNeeds");
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
    const getAllDrivers = async () => {
      try {
        const response = await axiosInstance.get("/all_driver_details");
        if (response.data.error_code === 0) {
          const transformedData = response.data.data.map((item) => ({
            companyName: item.company_name,
            post: item.user_post,
            profileName: item.profile_name,
            title: item.driver_name,
            fromLocation: item.from_location,
            toLocation: item.to_location,
            labels: [
              { icon: "directions-bus", text: item.vehicle_number },
              { icon: "attractions", text: `${item.no_of_tyres} wheels` },
              { icon: "local-shipping", text: item.truck_body_type },
              { icon: "factory", text: item.company_name },
            ],
            description: item.description,
            onButton1Press: () => Linking.openURL(`tel:${item.contact_no}`),
            onButton2Press: () => {
              setMessageReceiver(item)
              handleChatNavigate()
            }
          }));

          setDriversData(transformedData);
        } else {
          console.error(
            "Error fetching all loads:",
            response.data.error_message
          );
        }
      } catch (error) {
        console.error("Error fetching all drivers:", error);
      } finally {
        setisLoadings(false);
      }
    };

    getAllDrivers();
  }, [isLoading]);

  const filteredTrucks = driversData.filter(
    (truck) =>
      truck.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      truck.fromLocation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      truck.toLocation.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
    // Reset modal values and error fields when modal opens/closes
    setModalValues({
      driverName: "",
      fromLocation: "",
      toLocation: "",
      vehicleNumber: "",
      noOfTyres: "",
      truckBodyType: "",
      truckName: "",
    });
    setErrorFields({
      driverName: false,
      fromLocation: false,
      toLocation: false,
      vehicleNumber: false,
      noOfTyres: false,
      truckBodyType: false,
      truckName: false,
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
        if (response.data.error_code === 0) {
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
      if (response.data.error_code === 0) {
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



      const response = await axiosInstance.post("/aadhaar_submit_otp", verifyParams)

      if (response.data.error_code === 0) {
        Toast.success(response.data.message)
        setIsAadhaarModal(false)
        setTimeLeft(null)
        AsyncStorage.removeItem("client_id")
        navigation.navigate("DriverNeeds");

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
    // Validate inputs
    let hasError = false;
    const errors = {};

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
      "driver_name": modalValues.driverName,
      "contact_no": "",
      "vehicle_number": "",
      "company_name": "",
      "from_location": modalValues.fromLocation,
      "to_location": filteredStates,
      "truck_body_type": modalValues.truckBodyType,
      "truck_name": modalValues.truckName,
      "no_of_tyres": modalValues.noOfTyres
    }

    try {


      const response = await axiosInstance.post("/user_driver_details_filter", filterParams)
      if (response.data.error_code === 0) {
        const transformedData = response.data.data.map((item) => ({
          companyName : item.company_name,
          truckName: item.truck_name,
          post: item.user_post,
          profileName: item.profile_name,
          title: item.driver_name,
          fromLocation: item.from_location,
          toLocation: item.to_location,
          labels: [
            { icon: "directions-bus", text: item.vehicle_number },
            { icon: "attractions", text: item.no_of_tyres },
            { icon: "local-shipping", text: item.truck_body_type },
            { icon: "factory", text: item.truck_name },
          ],
          description: item.description,
          onButton1Press: () => Linking.openURL(`tel:${item.contact_no}`),
          onButton2Press: () => {
            setMessageReceiver(item)
            handleChatNavigate()
          }
        }));
        setDriversData(transformedData);
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


  const brandData = [
    { label: 'Ashok Leyland', value: 'ashokLeyland' },
    { label: 'Tata', value: 'tata' },
    { label: 'Mahindra', value: 'mahindra' },
    { label: 'Eicher', value: 'eicher' },
    { label: 'Daimler India', value: 'daimlerIndia' },
    { label: 'Bharat Benz', value: 'bharatBenz' },
    { label: 'Maruthi Suzuki', value: 'maruthiSuzuki' },
    { label: 'SML Lsuzu', value: 'smlLsuzu' },
    { label: 'Force', value: 'force' },
    { label: 'AMW', value: 'amw' },
    { label: 'Man', value: 'man' },
    { label: 'Volvo', value: 'volvo' },
    { label: 'Scania', value: 'scania' },
    { label: 'Others', value: 'others' },
  ]

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



  const handleSelectStates = async (selectedItemIds) => {
    // Log previously selected states
    const prevSelectedStateNames = selectedStates.map(id => {
      const state = userToLocationStatesData.find(state => state.id === id);
      return state ? state.name : null;
    }).filter(name => name !== null);


    // Update selected states
    setSelectedStates(selectedItemIds);

    // Log currently selected states
    const selectedStateNames = selectedItemIds.map(id => {
      const state = userToLocationStatesData.find(state => state.id === id);
      return state ? state.name : null;
    }).filter(name => name !== null);
    setFilteredStates(selectedStateNames)
  };


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
      <View style={{ flex: 1, backgroundColor: COLORS.white }}>
        <HeaderWithOutBS title="Available Drivers" />
        <View style={styles.container}>
          <CustomButton
            title="Post Driver Details"
            onPress={navigateToSellYourTruck}
            backgroundColor="#8a1c33"
            textColor="white"
          />
          <CustomButton
            title="Filter"
            backgroundColor="#8a1c33"
            onPress={toggleModal}
            textColor="white"
          />
        </View>
        <SearchFilter onSearch={handleSearch} />
        <DriverDetails
          navigation={navigation}
          filteredTrucks={filteredTrucks}
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
            {/* <View style={{ borderColor: "#ccc", borderWidth: 1, padding: 0, borderRadius: 5, marginBottom: 10 }}>
              <RNPickerSelect
                onValueChange={(value) => setModalValues({ ...modalValues, toLocation: value })}
                items={userToLocationStatesData}
                value={modalValues.truckName}
                placeholder={{
                  label: 'To Location',
                  value: null,
                  color: 'grey',
                }}
              />
            </View> */}

            <View style={{ width: "auto", marginBottom: 5 }}>
              <SectionedMultiSelect
                items={userToLocationStatesData}
                IconRenderer={Icon}
                uniqueKey="id"
                searchPlaceholderText="Search state"
                selectedText="selected"
                selectText="To Location"
                confirmText="Done"
                onSelectedItemsChange={handleSelectStates}  // Call to update selected items
                selectedItems={selectedStates}  // Initialize with current user states
                styles={{
                  backdrop: styles.multiSelectBackdrop,
                  selectToggle: styles.multiSelectBox,
                  chipContainer: styles.multiSelectChipContainer,
                  chipText: styles.multiSelectChipText,
                  selectToggleText: styles.selectToggleText,
                  selectedItemText: styles.selectedItemText,
                  selectText: styles.selectText,
                  button: { backgroundColor: '#CE093A' },
                }}
              />
            </View>

            <TextInput
              style={[styles.input, errorFields.material && styles.inputError]}
              placeholder="Material"
              value={modalValues.material}
              onChangeText={(text) => handleInputChange("material", text)}
            />


            <View style={{ borderColor: "#ccc", borderWidth: 1, padding: 0, borderRadius: 5, marginBottom: 10 }}>
              <RNPickerSelect
                onValueChange={(value) => setModalValues({ ...modalValues, truckBodyType: value })}
                items={bodyTypeData}
                value={modalValues.truckBodyType}
                placeholder={{
                  label: 'Select truck body type',
                  value: null,
                  color: 'grey',
                }}
              />
            </View>


            <View style={{ borderColor: "#ccc", borderWidth: 1, padding: 0, borderRadius: 5, marginBottom: 10 }}>
              <RNPickerSelect
                onValueChange={(value) => setModalValues({ ...modalValues, noOfTyres: value })}
                items={numberOfTyresData}
                value={modalValues.numberOfTyres}
                placeholder={{
                  label: 'Select number of tyres',
                  value: null,
                  color: 'grey',
                }}
              />
            </View>

            <TouchableOpacity style={styles.applyButton} onPress={applyFilter}>
              <Text style={styles.applyButtonText}>Apply Filter</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.applyButton}
              onPress={() => {
                setIsLoading(!isLoading)
                toggleModal()
              }}>
              <Text style={styles.applyButtonText} onPress={() => setIsLoading(!isLoading)}>Clear filter</Text>
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
    padding: 13
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
  closeButton: {
    backgroundColor: "#8a1c33",
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  applyButtonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
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
  multiSelectBackdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.01)',
  },
  multiSelectBox: {
    borderWidth: 1,
    borderRadius: 5,
    borderColor: 'grey',
    padding: 10,
    paddingLeft: 15,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12

  },
  selectToggleText: {
    color: '#000',
    fontSize: 14
  },
  selectText: {
    color: 'red'
  },
  selectedItemText: {
    color: COLORS.primary,
  },
  multiSelectChipContainer: {
    borderWidth: 0,
    backgroundColor: '#ddd',
    borderRadius: 8,
  },
  multiSelectChipText: {
    color: '#222',
    fontSize: 12,
  }
});

export default AvailableDrivers;
