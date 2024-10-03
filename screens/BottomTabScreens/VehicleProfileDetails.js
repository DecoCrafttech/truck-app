import React, { useContext, useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, Modal, TextInput, Button, ActivityIndicator } from "react-native";
import { COLORS, images } from "../../constants";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LoadNeedsContext } from "../../hooks/LoadNeedsContext";
import Container, { Toast } from 'toastify-react-native';
import axiosInstance from "../../services/axiosInstance";
import { Alert } from "react-native";


const VehicleProfileDetails = () => {

  const {
    isLoading,
    setIsLoading,
  } = useContext(LoadNeedsContext)

  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [isInputValid, setIsInputValid] = useState(true);
  const [pageLoading, setPageLoading] = useState(false)
  const [pageRefresh, setPageRefresh] = useState(false)



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
        setTimeout(() => {
          setPageLoading(true)
        }, 1000);
      } else {
        console.log(response.data.message)
      }
    }
    (async () => getProfilePage())()
  }, [isLoading, pageRefresh,pageLoading])




  // useEffect(() => {
  //   const viewFullVehicleDetails = async () => {
  //     const viewVehicleParams = {
  //       "vehicle_no": `${vehicleNo}`
  //     }
  //     try {
  //       const response = await axios.post("https://truck.truckmessage.com/get_vehicle_details", viewVehicleParams)
  //       if (response.data.error_code === 0) {
  //         setVehicleData(response.data.data)
  //       } else {
  //         console.log(response.data.message)
  //       }
  //     } catch (err) {
  //       console.log(err)
  //     }
  //   }

  //   (async => viewFullVehicleDetails())()


  // }, [])


  const handleAddTruck = () => {
    setModalVisible(true);
  };

  const handleSubmit = async () => {

    // if (!vehicleNumber.trim()) {
    //   setIsInputValid(false);
    //   return;
    // }
    setPageLoading(true)

    const addTruckParams = {
      user_id: await AsyncStorage.getItem("user_id"),
      vehicle_no: `${vehicleNumber}`
    }
    try {
      const response = await axios.post("https://truck.truckmessage.com/add_user_vehicle_details", addTruckParams)
      if (response.data.error_code === 0) {
        Toast.success("Posted successfully")


        // Reset state and close modal
        setModalVisible(false);
        setVehicleNumber("");
        setIsInputValid(true);
        setPageLoading(false)

        setIsLoading(!isLoading)

      } else {
        console.log(response.data.message)
      }

    } catch (err) {
      console.log(err)
    }



  };

  const handleViewVehicleDetails = async (vehicleNo) => {
    // const viewVehicleParams = {
    //   "vehicle_no": `${vehicleNo}`
    // }

    // try {
    //   const response = await axios.post("https://truck.truckmessage.com/get_vehicle_details", viewVehicleParams)
    //   if (response.data.error_code === 0) {
    //     navigation.navigate("ViewFullDetails", { vehicleNo })
    //   } else {
    //     console.log(response.data.message)
    //   }
    // } catch (err) {
    //   console.log(err)
    // }


  };



  const handleDeleteProfile = async (vehicleNo) => {

    Alert.alert("Delete post", "Are you sure want to delete this vehicle?",
      [
        {
          text: "Yes",
          onPress: async () => {
            const removeVehicleParams = {
              user_id: await AsyncStorage.getItem("user_id"),
              vehicle_no: vehicleNo
            }
            try {
              const response = await axiosInstance.post("/remove_user_vehicle_details", removeVehicleParams)
              if (response.data.error_code === 0) {
                alert(response.data.message)
                setPageRefresh(!pageRefresh)

              } else {
                console.log(response.data.message)
              }

            } catch (err) {
              console.log(err)
            }
          }
        },
        {
          text: "Cancel",
          onPress: () => null
        }
      ]
    )

  };




  return (
    <>
      <Container
        position="top"
        duration={3000}
        animationIn="slideInDown"
        height="auto"
        width="100%"
        textStyle={{
          fontSize: 15,
          flexWrap: 'wrap', // Ensure text wraps
          maxWidth: '90%', // Ensure text does not overflow
          overflow: 'hidden',
        }} // Ensure text wraps
      />
      {
        pageLoading === false ?
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size='large' color={COLORS.primary} />
          </View>
          :
          <ScrollView contentContainerStyle={[styles.scrollContainer]}>
            <View style={styles.container}>
              <View style={styles.header}>
                <Text style={styles.headerText}>Truck Details</Text>
                <TouchableOpacity style={styles.addButton} onPress={handleAddTruck}>
                  <Text style={styles.buttonText}>Add Truck</Text>
                </TouchableOpacity>
              </View>
              {
                users.length === 0 ?
                  <View style={styles.noResultContainer}>
                    <View>
                      <Image
                        source={require("../../assets/images/Folder_empty.png")}
                        width={50}
                        height={50}
                        resizeMode="center"
                      />
                    </View>
                    <Text style={styles.noResultsText}>No records</Text>
                  </View>
                  :
                  <>
                    {users.map((user, index) => (
                      <View key={index} style={styles.userCard}>
                        {/* <Image
                source={images.truck}
                style={styles.userPhoto}
              /> */}
                        <View style={styles.userInfo}>
                          <Text style={styles.vehicleNumber}>{user.vehicle_no}</Text>
                          <View style={{ marginBottom: 10 }}>
                            <Text style="">Fitness UpTo</Text>
                            <Text style={styles.userFollowers}>{user.fit_up_to}</Text>
                          </View>
                          <View style={{ marginBottom: 10 }}>
                            <Text style="">Insurance</Text>
                            <Text style={styles.userFollowers}>{user.insurance_company ? user.insurance_company : "none"}</Text>
                          </View>
                          <View style={{ marginBottom: 10 }}>
                            <Text style="">Pollution Certificate</Text>
                            <Text style={styles.userFollowers}>{user.pucc_upto ? user.pucc_upto : "none"}</Text>
                          </View>
                          <View style={{ marginBottom: 10 }}>
                            <Text style="">Road Tax</Text>
                            <Text style={styles.userFollowers}>{user.tax_paid_upto ? user.tax_paid_upto : "none"}</Text>
                          </View>
                          <View style={{ marginBottom: 10 }}>
                            <Text style="">RC Status</Text>
                            <Text style={styles.userFollowers}>{user.rc_status ? user.rc_status : "none"}</Text>
                          </View>

                        </View>
                        {/* <TouchableOpacity
                style={styles.editButton}
                onPress={() => handleViewVehicleDetails(user.vehicle_no)}
              >
                <Image
                  source={images.editIcon}
                  style={styles.icon}
                  resizeMode="contain"
                />
              </TouchableOpacity> */}
                        <TouchableOpacity
                          style={styles.editButton}
                          onPress={() => handleDeleteProfile(user.vehicle_no)}
                        >
                          <Image
                            source={images.deleteIcon}
                            style={styles.icon}
                            resizeMode="contain"
                          />
                        </TouchableOpacity>
                      </View>
                    ))}
                  </>
              }

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
                    <View style={{display:'flex',flexDirection:'row',justifyContent:'space-around',gap:20}}>
                    <Button title="Cancel" onPress={() => setModalVisible(false)} />
                    <Button title="Submit" onPress={handleSubmit} />
                    </View>
                  </View>
                </View>
              </Modal>
            </View>
          </ScrollView>
      }
    </>


  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#F1F2FF'
  },
  editButton: {
    marginHorizontal: 5,
    alignSelf: 'flex-start'
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
    backgroundColor: '#F1F2FF'
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
    backgroundColor: "#F6F8FF",
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
    shadowColor: '#303030',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3.5,
    Color: '#F6F8FF',
    borderColor: '#fff',
    borderWidth: 2,
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
    marginBottom: 10,
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
  noResultContainer: {
    marginTop: -40,
    alignItems: 'center',
    justifyContent: 'center',
    // flex:1,
  },
  noResultsText: {
    textAlign: "center",
    marginTop: -90,
    marginBottom: 30,
    color: "grey",
    fontSize: 16,
  },
});

export default VehicleProfileDetails;
