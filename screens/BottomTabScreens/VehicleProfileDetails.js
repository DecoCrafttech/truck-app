import React, { useContext, useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, Modal, TextInput, Button } from "react-native";
import { images } from "../../constants";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LoadNeedsContext } from "../../hooks/LoadNeedsContext";
import Container, { Toast } from 'toastify-react-native';


const VehicleProfileDetails = () => {

  const {
    isLoading,
    setIsLoading,
  } = useContext(LoadNeedsContext)

  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [isInputValid, setIsInputValid] = useState(true);

  // Example array of users
  // const users = [
  //   { id: 1, vehicleNumber: "TN22 AV4455", avatar: images.truck },
  //   { id: 2, vehicleNumber: "TN22 AV4455", avatar: images.truck },
  //   { id: 3, vehicleNumber: "TN22 AV4455", avatar: images.truck },
  //   { id: 4, vehicleNumber: "TN22 AV4455", avatar: images.truck },
  //   { id: 5, vehicleNumber: "TN22 AV4455", avatar: images.truck },
  //   { id: 6, vehicleNumber: "TN22 AV4455", avatar: images.truck },
  //   { id: 7, vehicleNumber: "TN22 AV4455", avatar: images.truck },
  //   { id: 8, vehicleNumber: "TN22 AV4455", avatar: images.truck },
  //   { id: 9, vehicleNumber: "TN22 AV4455", avatar: images.truck },
  // ];
  const [users, setUsers] = useState([])



  useEffect(() => {
    const getProfilePage = async () => {
      const getVehicleDetailsParams = {
        user_id: await AsyncStorage.getItem("user_id")
      }
      const response = await axios.post("https://truck.truckmessage.com/get_user_profile", getVehicleDetailsParams)

      if (response.data.error_code === 0) {
        setUsers(response.data.data[0].vehicle_data)
      } else {
        console.log(response.data.message)
      }

    }
    (async () => getProfilePage())()

  }, [isLoading])


  const handleAddTruck = () => {
    setModalVisible(true);
  };

  const handleSubmit = async () => {

    // if (!vehicleNumber.trim()) {
    //   setIsInputValid(false);
    //   return;
    // }

    const addTruckParams = {
      user_id: await AsyncStorage.getItem("user_id"),
      vehicle_no: `${vehicleNumber}`
    }
    try {
      const response = await axios.post("https://truck.truckmessage.com/add_user_vehicle_details", addTruckParams)
      if (response.data.error_code === 0) {
        Toast.success(response.data.message)


        // Reset state and close modal
        setModalVisible(false);
        setVehicleNumber("");
        setIsInputValid(true);
        setIsLoading(!isLoading)

      } else {
        console.log(response.data.message)
      }

    } catch (err) {
      console.log(err)
    }



  };

  const handleViewVehicleDetails = async (vehicleNo) => {
    const viewVehicleParams = {
      "vehicle_no": `${vehicleNo}`
    }

    try {
      const response = await axios.post("https://truck.truckmessage.com/get_vehicle_details", viewVehicleParams)
      if (response.data.error_code === 0) {
        navigation.navigate("ViewFullDetails", { vehicleNo })
      } else {
        console.log(response.data.message)
      }
    } catch (err) {
      console.log(err)
    }


  };

  const handleDeleteProfile = (userId) => {
    console.log(`Delete Profile pressed for user ID: ${userId}`);
    // Implement logic for deleting profile of user with userId
  };

  return (
    <>
      <Container
        position="footer"
        duration={3000}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        height={60}
        textStyle={{ backgroundColor: '', fontSize: 12 }}
      />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.headerText}>Truck Details</Text>
            <TouchableOpacity style={styles.addButton} onPress={handleAddTruck}>
              <Text style={styles.buttonText}>Add Truck</Text>
            </TouchableOpacity>
          </View>
          {users.map((user, index) => (
            <View key={index} style={styles.userCard}>
              <Image
                source={images.truck}
                style={styles.userPhoto}
              />
              <View style={styles.userInfo}>
                <Text style={styles.vehicleNumber}>{user.vehicle_no}</Text>
                <Text style={styles.userFollowers}>Vehicle Number</Text>
              </View>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => handleViewVehicleDetails(user.vehicle_no)}
              >
                <Image
                  source={images.editIcon}
                  style={styles.icon}
                  resizeMode="contain"
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => handleDeleteProfile(user.id)}
              >
                <Image
                  source={images.deleteIcon}
                  style={styles.icon}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
          ))}

          {/* Modal for adding truck */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(false);
              setIsInputValid(true); // Reset input validation state
            }}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Add Truck</Text>
                <TextInput
                  style={[styles.input, !isInputValid && styles.inputError]} // Conditional styling based on validation
                  placeholder="Enter Vehicle Number"
                  value={vehicleNumber}
                  onChangeText={(text) => {
                    setVehicleNumber(text);
                    setIsInputValid(true); // Reset validation when typing
                  }}
                />
                {!isInputValid && (
                  <Text style={styles.errorText}>Please enter a valid vehicle number</Text>
                )}
                <Button title="Submit" onPress={handleSubmit} />
              </View>
            </View>
          </Modal>
        </View>
      </ScrollView>
    </>


  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  editButton: {
    marginHorizontal: 5
  },
  container: {
    paddingHorizontal: 20,
    paddingBottom: 60,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    marginBottom: 10,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  addButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  userCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
  },
  userPhoto: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  userInfo: {
    flex: 1,
    marginLeft: 10,
  },
  vehicleNumber: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 5,
  },
  userFollowers: {
    color: "#999",
  },
  icon: {
    width: 30,
    height: 30,
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  inputError: {
    borderColor: "red",
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
});

export default VehicleProfileDetails;
