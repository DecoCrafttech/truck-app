import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  BackHandler,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "../../constants";
import Header from "../../components/Header";
import DropDownPicker from "react-native-dropdown-picker";
import axiosInstance from "../../services/axiosInstance";
import LoadDetails from "../AvailabaleLoads/LoadDetails";
import MarketPlace from "./MarketPlace";
import EditLoadModal from "./EditModal";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Refer = () => {
  const [selectedValue, setSelectedValue] = useState(null);
  const [allLoadData, setAllLoadData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [feedbackModalVisible, setFeedbackModalVisible] = useState(false);
  const [editItem, setEditItem] = useState(null);

  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([
    { label: "Load Posts", value: "user_load_details" },
    { label: "Driver Posts", value: "user_driver_details" },
    { label: "Truck Posts", value: "user_truck_details" },
    { label: "Market Posts", value: "user_buy_sell_details" },
  ]);

  useFocusEffect(
    React.useCallback(() => {
       BackHandler.addEventListener('hardwareBackPress',handleBackPress)

       return() => {
         BackHandler.removeEventListener('hardwareBackPress',handleBackPress)
       }
    })
  )

  const handleBackPress = () => {
    Alert.alert('Exit App','Are you sure want to exit?',
      [
        {
          text : 'Cancel',
          onPress : () => null,
          style : 'cancel'
        },
        {
          text : 'Exit',
          onPress : () => BackHandler.exitApp()
        }
      ]
    )
    return true
  }
 

  const handleEdit = (item) => {

    
    setEditItem(item);
    setEditModalVisible(true);
  };

  const handleSaveChanges = async (updatedDetails) => {
    try {
      setEditModalVisible(false);
      await saveEditedDetails(updatedDetails);
    } catch (error) {
      console.log("Error updating load details:", error);
    }
  };

  const saveEditedDetails = async (updatedDetails) => {
    
    try {
      const response = await axiosInstance.post(
        "/update_load_details",
        updatedDetails
      );

      if (response.data.error_code === 0) {
        fetchData(selectedValue);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const [showFeedbackInput, setShowFeedbackInput] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");

  const handleYes = () => {
    setShowFeedbackInput(false);
  };

  const handleNo = () => {
    setShowFeedbackInput(true);
  };

  const [feedbackType, setFeedbackType] = useState("");

  const [feedbackModalData, setFeedbackModalData] = useState({
    item: null,
    type: "",
    selected: "",
  });

  const handleSubmit = () => {
    const { item, type, selected } = feedbackModalData;

    if (showFeedbackInput) {
      if (feedback.trim() === "") {
        Alert.alert("Error", "Please enter your feedback");
      } else {
        Alert.alert("Success", "Thank you for your feedback!");
        setFeedback("");
        handleDelete(item, type, selected);
        handleFeedBackModalClose();
      }
    } else {
      if (mobileNumber.trim() === "") {
        Alert.alert("Error", "Please enter your mobile number");
      } else {
        // Handle mobile number submission logic
        Alert.alert("Success", "Mobile number submitted successfully!");
        setMobileNumber("");
        handleDelete(item, type, selected);
        handleFeedBackModalClose();
      }
    }
  };

  const handleFeedBackModal = (item, type, selected) => {
    setFeedbackType(type);
    setFeedbackModalVisible(true);
    setFeedbackModalData({ item, type, selected });
  };

  const handleDelete = async (item, type, selected) => {
    let deleteParameters = {};
    let apiDelete;

    switch (type) {
      case "load":
        apiDelete = "remove_load_details";
        deleteParameters = {
          load_id: item.load_id,
        };
        break;
      case "driver":
        apiDelete = "remove_driver_entry";
        deleteParameters = {
          driver_id: item.driver_id,
        };

        break;
      case "truck":
        apiDelete = "remove_truck_entry";
        deleteParameters = {
          truck_id: item.truck_id,
        };
        break;

      default:
        break;
    }

    try {
      const response = await axiosInstance.post(
        `/${apiDelete}`,
        deleteParameters
      );

      if (response.data.error_code === 0) {
        fetchData(selected);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };



  const fetchData = async (selectedValue) => {
    setLoading(true);

    const userPostParameters = {
      user_id: await AsyncStorage.getItem("user_id"),
    };

    try {
      const response = await axiosInstance.post(
        `/${selectedValue}`,
        userPostParameters
      );

      console.log("response.data",response.data)

      if (response.data.error_code === 0) {
        switch (selectedValue) {
          case "user_load_details":
            const transformedData = response.data.data.map((item) => ({
              companyName :  item.company_name,
              contactNumber : item.contact_number,
              truckBodyType: item.truck_body_type,
              title: item.company_name,
              fromLocation: item.from_location,
              toLocation: item.to_location,
              labels: [
                { icon: "table-view", text: item.material },
                { icon: "attractions", text: item.no_of_tyres },
                { icon: "monitor-weight", text: item.tone },
                { icon: "local-shipping", text: item.truck_body_type },
              ],
              description: item.description,
              onButton1Press: () => handleEdit(item),
              onButton2Press: () =>
                handleFeedBackModal(item, "load", "user_load_details"),
            }));
            setAllLoadData(transformedData);

            break;
          case "user_driver_details":
            setAllLoadData([]);
            const transformedDriverData = response.data.data.map((item) => ({
              title: item.driver_name,
              fromLocation: item.from_location,
              toLocation: item.to_location,
              labels: [
                { icon: "directions-bus", text: item.vehicle_number },
                { icon: "attractions", text: item.no_of_tyres },
                { icon: "local-shipping", text: item.truck_body_type },
                { icon: "verified", text: item.truck_name },
              ],
              description: item.description,
              onButton1Press: () => handleEdit(item),
              onButton2Press: () =>
                handleFeedBackModal(item, "driver", "user_driver_details"),
            }));

            setAllLoadData(transformedDriverData);
            break;
          case "user_truck_details":
            setAllLoadData([]);
            const transformedAllTruckData = response.data.data.map((item) => ({
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
              onButton1Press: () => handleEdit(item),
              onButton2Press: () =>
                handleFeedBackModal(item, "truck", "user_truck_details"),
            }));
            setAllLoadData(transformedAllTruckData);
            break;

          case "user_buy_sell_details":
            setAllLoadData(response.data.data);
            break;
          default:
            break;
        }
      } else {
        console.log(response.data.message);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleFeedBackModalClose = () => {
    setFeedbackModalVisible(false);
  };


  // console.log("editItem",editItem)
  // console.log("allLoadData",allLoadData)

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
      <View style={{ flex: 1, backgroundColor: COLORS.white }}>
        <Header title="My Posts" />
        <View style={styles.container}>
          <DropDownPicker
            open={open}
            value={selectedValue}
            items={items}
            setOpen={setOpen}
            setValue={(value) => {
              setSelectedValue(value);
              fetchData(value());
            }}
            setItems={setItems}
            placeholder="Select Category"
            containerStyle={{ height: 40, marginBottom: 20 }}
            style={{ backgroundColor: "#fafafa" }}
          />
          {loading ? (
            <View style={[styles.loadingContainer, styles.loadingHorizontal]}>
              <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
          ) : selectedValue === "user_buy_sell_details" ? (
            <MarketPlace allData={allLoadData} />
          ) : (
            <LoadDetails
              filteredTrucks={allLoadData}
              status="editAndDelete"
              handleEdit={handleEdit}
            />
          )}
        </View>
        <EditLoadModal
          visible={editModalVisible}
          onClose={() => setEditModalVisible(false)}
          onSave={handleSaveChanges}
          loadDetails={editItem}
          selectedValue={selectedValue}
        />

        <Modal
          visible={feedbackModalVisible}
          onClose={() => {
            setFeedbackModalVisible(false);
          }}
          animationType="slide"
          transparent={true}
          onRequestClose={() => {
            setFeedbackModalVisible(false);
          }}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.header}>
                Did you post the {feedbackType} details using this platform?
              </Text>

              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[
                    styles.button,
                    showFeedbackInput && styles.selectedButton,
                  ]}
                  onPress={handleNo}
                >
                  <Text style={styles.buttonText}>Yes</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.button,
                    !showFeedbackInput && styles.selectedButton,
                  ]}
                  onPress={handleYes}
                >
                  <Text style={styles.buttonText}>No</Text>
                </TouchableOpacity>
              </View>

              {showFeedbackInput ? (
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Mobile Number:</Text>
                  <TextInput
                    style={styles.input}
                    keyboardType="phone-pad"
                    value={mobileNumber}
                    onChangeText={(text) => setMobileNumber(text)}
                    placeholder="Enter your mobile number"
                  />
                </View>
              ) : (
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Feedback:</Text>
                  <TextInput
                    style={styles.input}
                    multiline
                    numberOfLines={6}
                    value={feedback}
                    onChangeText={(text) => setFeedback(text)}
                    placeholder="Type your feedback here"
                  />
                </View>
              )}

              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleSubmit}
              >
                <Text style={styles.submitButtonText}>Submit</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.closeButton}
                onPress={handleFeedBackModalClose}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 10,
    paddingHorizontal: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingHorizontal: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
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
    width: "80%",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    backgroundColor: COLORS.gray,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  selectedButton: {
    backgroundColor: COLORS.primary,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 16,
  },
  inputContainer: {
    width: "100%",
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: COLORS.gray,
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    width: "100%",
    alignItems: "center",
  },
  submitButtonText: {
    color: COLORS.white,
    fontSize: 16,
  },
  closeButton: {
    backgroundColor: COLORS.brand,
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    width: "100%",
    alignItems: "center",
  },
  closeButtonText: {
    color: COLORS.white,
    fontSize: 16,
  },
});

export default Refer;
