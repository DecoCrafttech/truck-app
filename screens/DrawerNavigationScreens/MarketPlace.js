import React, { useEffect, useState } from "react";
import { COLORS } from "../../constants";
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  Button,
  ScrollView,
  Alert,
  Platform
} from "react-native";
import axiosInstance from "../../services/axiosInstance";
import RNPickerSelect from 'react-native-picker-select';
import Feather from '@expo/vector-icons/Feather';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from "@react-native-async-storage/async-storage";




const MarketPlace = ({ navigation, allData, editedDetails,buyAndSellRefresh,setBuyAndSellRefresh,fetchData }) => {
  const [editItem, setEditItem] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [pageRefresh, setPageRefresh] = useState(false)

  const [updateImage, setUpdatedImage] = useState(null)

  const [images, setImages] = useState([]);





  const [editedData, setEditedData] = useState({
    images: [],
    userId: "",
    brand: "",
    bodyType: "",
    noOfTyres : "",
    buySellId: "",
    contact_no: "",
    description: "",
    id: "",
    kms_driven: "",
    location: "",
    model: "",
    owner_name: "",
    price: "",
    vehicleNumber: "",
    ton: "",
    updt: "",
    truckImage: []

  });

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
    { label: 'Open body', value: 'open_body' },
    { label: 'Container', value: 'container' },
    { label: 'Trailer', value: 'trailer' },
    { label: 'Tanker', value: 'tanker' },
    { label: 'Tipper', value: 'tipper' },
    { label: 'LCV', value: 'lcv' },
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

  useEffect(() => {

  }, [pageRefresh])



  const handleEditPress =async(item) => {
    setEditItem(item);
    setEditedData({
      id : item.buy_sell_id,
      userId: await AsyncStorage.getItem("user_id"),
      buySellId : item.buy_sell_id,
      images: item.images,
      vehicleNumber: item.vehicle_number,
      brand: item.brand,
      model: item.model,
      bodyType: item.truck_body_type,
      noOfTyres  : item.no_of_tyres,
      kms_driven: item.kms_driven,
      location: item.location,
      owner_name: item.owner_name,
      contact_no: item.contact_no,
      description: item.description,
      updt: item.updt,
      ton: item.tonnage,
      price: item.price.toString(),
    });
    setModalVisible(true);
  };

  // const pickProfileImage = async () => {
  //   // Request permission to access the media library
  //   const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  //   if (status !== 'granted') {
  //     Alert.alert('Permission required', 'Sorry, we need media library permissions to make this work!');
  //     return;
  //   }

  //   // Launch the image picker
  //   const result = await ImagePicker.launchImageLibraryAsync({
  //     mediaTypes: ImagePicker.MediaTypeOptions.Images,
  //     allowsEditing: true,
  //     aspect: [4, 4],
  //     quality: 1,
  //   });

  //   if (!result.canceled) {
  //     const { uri } = result.assets[0];
  //     setUpdatedImage(uri);
  //   }
  // };

  const pickProfileImage = async () => {
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


  const handleDeletePress = async (item) => {

    Alert.alert("Delete post", "Are you sure want to delete this post?",
      [
        {
          text: "Yes",
          onPress: async () => {
            const removePostParamters = {
              buy_sell_id: item.buy_sell_id
            }

            try {
              const response = await axiosInstance.post("/remove_truck_buy_sell", removePostParamters)
              console.log(response.data)
              setPageRefresh(!pageRefresh)
            } catch (error) {
              console.log(error)
            }

          }
        },
        {
          text: "No",
          onPress: () => null
        }
      ]
    )

  };


  const saveChanges = async () => {

    // const requiredParams = {
    //   "user_id": editedData.userId,
    //   "brand": editedData.brand,
    //   "buy_sell_id": editedData.buySellId,
    //   "contact_no": editedData.contact_no,
    //   "description": editedData.description,
    //   "id": editedData.id,
    //   "kms_driven": editedData.kms_driven,
    //   "location": editedData.location,
    //   "model": editedData.model,
    //   "owner_name": editedData.owner_name,
    //   "price": editedData.price,
    //   "vehicle_number": editedData.vehicleNumber,
    // }


    const formData = new FormData();

    // Append images to FormData
    editedData.images.forEach((image, index) => {
      formData.append(`truck_image${index + 1}`, {
        uri: image.uri,
        type: 'image/jpeg', // Adjust accordingly if different image types
        name: `truck_image_${index + 1}.jpg`, // Use a unique name for the image
      });
    });

    // formData.append('truck_image1', {
    //   uri: Platform.OS === 'ios' ? updateImage.replace('file://', '') : updateImage,
    //   type: 'image/jpeg', // Adjust if you are dealing with different image types
    //   name: 'truck_image1',
    // });

    formData.append("user_id", editedData.userId)
    formData.append("brand", editedData.brand)
    formData.append("buy_sell_id", editedData.buySellId)
    formData.append("contact_no", editedData.contact_no)
    formData.append("description", editedData.description)
    formData.append("id", editedData.id)
    formData.append("kms_driven", editedData.kms_driven)
    formData.append("location", editedData.location)
    formData.append("model", editedData.model)
    formData.append("owner_name", editedData.owner_name)
    formData.append("price", editedData.price)
    formData.append("tonnage", editedData.ton)
    formData.append("vehicle_number", editedData.vehicleNumber)
    formData.append("truck_body_type", editedData.bodyType)
    formData.append("no_of_tyres", editedData.noOfTyres)
    try {   
      const response = await axiosInstance.post("/truck_buy_sell", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      console.log(response.data)
      setPageRefresh(!pageRefresh)

      setModalVisible(false);
      fetchData("user_buy_sell_details")

    } catch (error) {
      console.log(error)
    }
  };


  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.images[0] }} style={styles.itemImage} />
      <View style={styles.item}>
        <View style={styles.itemContent}>
          <Text style={styles.itemName}>{item.vehicle_number}</Text>
          <View style={styles.tableContainer}>
            <View style={styles.tableRow}>
              <Text style={styles.tableLabel}>Brand:</Text>
              <Text style={styles.tableValue}>{item.brand}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableLabel}>Model:</Text>
              <Text style={styles.tableValue}>{item.model}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableLabel}>Body type:</Text>
              <Text style={styles.tableValue}>{item.truck_body_type}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableLabel}>Kms Driven:</Text>
              <Text style={styles.tableValue}>{item.kms_driven}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableLabel}>Location:</Text>
              <Text style={styles.tableValue}>{item.location}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableLabel}>Owner Name:</Text>
              <Text style={styles.tableValue}>{item.owner_name}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableLabel}>Contact Number:</Text>
              <Text style={styles.tableValue}>{item.contact_no}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableLabel}>Description:</Text>
              <Text style={styles.tableValue}>{item.description}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableLabel}>Last Updated:</Text>
              <Text style={styles.tableValue}>{item.updt}</Text>
            </View>
          </View>
        </View>
      </View>
      <View style={styles.buttons}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => handleEditPress(item)}
        >
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeletePress(item)}
        >
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );



  const tonsData = [
    { label: "1 Ton - 2.5 Ton", value: "1 Ton - 2.5 Ton" },
    { label: "2.5 Ton - 5 Ton", value: "2.5 Ton - 5 Ton" },
    { label: "5 Ton - 10 Ton", value: "5 Ton - 10 Ton" },
    { label: "10 Ton - 20 Ton", value: "10 Ton - 20 Ton" },
    { label: "20 Ton - 40 Ton", value: "20 Ton - 40 Ton" },
    { label: "Above 40 ton", value: "Above 40 ton" },
  ]


  return (
    <View style={styles.container}>
      <FlatList
        data={allData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id} // keyExtractor should return a string
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent} >
            <Text style={styles.modalTitle}>Edit Item</Text>
            <ScrollView style={{ width: '100%', height: "70%" }} >

              {/* <Image source={{ uri: editedData.imageUrl }} style={styles.itemImage} /> */}




              <TextInput
                style={styles.input}
                placeholder="Owner Name"
                value={editedData.owner_name}
                onChangeText={(text) => setEditedData({ ...editedData, owner_name: text })}
              />
              <TextInput
                style={styles.input}
                placeholder="Contact Number"
                value={editedData.contact_no}
                onChangeText={(text) => setEditedData({ ...editedData, contact_no: text })}
              />
              <TextInput
                style={styles.input}
                placeholder="Vehicle Number"
                value={editedData.vehicleNumber}
                onChangeText={(text) => setEditedData({ ...editedData, vehicleNumber: text })}
              />
              <TextInput
                style={styles.input}
                placeholder="Kms Driven"
                value={editedData.kms_driven}
                onChangeText={(text) => setEditedData({ ...editedData, kms_driven: text })}
              />
              {/* <TextInput
              style={styles.input}
              placeholder="Brand"
              value={editedData.brand}
              onChangeText={(text) => setEditedData({ ...editedData, brand: text })}
            /> */}
              <View style={{ borderColor: "#ccc", borderWidth: 1, padding: 0, borderRadius: 5, marginBottom: 10 }}>
                <RNPickerSelect
                  onValueChange={(value) => setEditedData({ ...editedData, brand: value })}
                  items={brandData}
                  value={editedData.brand}
                  placeholder={{
                    label: 'Select brand',
                    color: 'grey',
                  }}
                />
              </View>



              {/* <TextInput
              style={styles.input}
              placeholder="Model"
              value={editedData.model}
              onChangeText={(text) => setEditedData({ ...editedData, model: text })}
            /> */}
              <View style={{ borderColor: "#ccc", borderWidth: 1, padding: 0, borderRadius: 5, marginBottom: 10 }}>
                <RNPickerSelect
                  onValueChange={(value) => setEditedData({ ...editedData, model: value })}
                  items={yearsData}
                  value={editedData.model}
                  placeholder={{
                    label: 'Select model',
                    color: 'grey',
                  }}
                />
              </View>


              <View style={{ borderColor: "#ccc", borderWidth: 1, padding: 0, borderRadius: 5, marginBottom: 10 }}>
                <RNPickerSelect
                  onValueChange={(value) => setEditedData({ ...editedData, bodyType: value })}
                  items={bodyTypeData}
                  value={editedData.bodyType}
                  placeholder={{
                    label: 'Select body type',
                    color: 'grey',
                  }}
                />
              </View>
              {/* 
              <View style={{ borderColor: COLORS.gray, borderWidth: 1, padding: 0, borderRadius: 5, marginBottom: 10 }}>
              <RNPickerSelect
                onValueChange={(value) => setEditedData({ ...editedData, tons: value })}
                items={tonsData}
                value={editedData.ton}
                placeholder={{
                  label: 'Select ton',
                  value: null,
                  color: 'grey',
                }}
              />
            </View> */}

              <TextInput
                style={styles.input}
                placeholder="Ton"
                value={editedData.ton}
                onChangeText={(text) => setEditedData({ ...editedData, ton: text })}
                keyboardType="number-pad"
              />

              <TextInput
                style={styles.input}
                placeholder="Price"
                value={editedData.price}
                onChangeText={(text) => setEditedData({ ...editedData, price: text })}
              />

              <TextInput
                style={styles.input}
                placeholder="Location"
                value={editedData.location}
                onChangeText={(text) => setEditedData({ ...editedData, location: text })}
              />


              <TextInput
                style={styles.input}
                placeholder="Description"
                value={editedData.description}
                onChangeText={(text) => setEditedData({ ...editedData, description: text })}
              />


              {/* <View>
                <View style={{ backgroundColor: 'red', marginBottom: 20 }}>
                  <Image
                    style={[styles.avatar, { alignItems: 'center', marginHorizontal: 'auto' }]}
                    source={{ uri: updateImage === null ? editedData.imageUrl : updateImage }} />
                  <Feather style={[styles.modalImageEditIcon, { position: 'absolute', top: 0, left: 0 }]}
                    name="edit"
                    size={20}
                    color="#000"
                    onPress={() => pickProfileImage()}
                  />
                </View>
              </View> */}


              {/* <View style={styles.multipleImageContainer}>
                {
                    <Image
                      source={{ uri: editedData.images[0] }}
                      style={styles.image}
                      width={80}
                      height={80}
                    />
                }
                {
                    <Image
                      source={{ uri: editedData.images[1] }}
                      style={styles.image}
                      width={80}
                      height={80}
                    />
                }
              </View> */}



              <View style={styles.multipleImageContainer}>
                {
                  editedData.images.map((image, index) => {
                    return (
                      <View key={index}>
                        <Image
                          source={{ uri: `${image}` }}
                          style={styles.image}
                          width={80}
                          height={80}
                        />
                      </View>
                    )
                  })
                }

                {/* <Image
                  source={{ uri: "https://www.themarketingnutz.com/wp-content/uploads/2018/01/opulent-profile-square-07.jpg" }}
                  style={styles.image}
                  width={80}
                  height={80}
                /> */}


              </View>



              <View style={styles.imageContainer}>
                {editedData.images.map((image, index) => (
                  <Image
                    key={index}
                    source={{ uri: `${image[0]}` }}
                    style={styles.image}
                  />
                ))}
              </View>


            </ScrollView>

            <View style={styles.modalButtons}>

              {/* <Button  title="Save Changes" onPress={saveChanges} /> */}
              <TouchableOpacity
                style={styles.saveButton}
                onPress={saveChanges}
              >
                <Text style={styles.saveButtonText}>Save Changes</Text>
              </TouchableOpacity>

              {/* <Button title="Cancel" onPress={() => setModalVisible(false)} /> */}
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => {
                  setUpdatedImage(null)
                  setModalVisible(false)
                }}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 10,
  },
  card: {
    marginTop: 10,
    marginHorizontal: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
    marginBottom: 20,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  itemImage: {
    width: 150,
    height: 150,
    borderRadius: 30,
    margin: 'auto',
    marginBottom: 20,
  },
  itemContent: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  tableContainer: {
    marginTop: 10,
  },
  tableRow: {
    flexDirection: "row",
    marginBottom: 5,
  },
  tableLabel: {
    fontWeight: "bold",
    marginRight: 5,
  },
  tableValue: {
    flex: 1,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginTop: 5,
  },
  button: {
    flex: 1,
    backgroundColor: COLORS.primary,
    paddingVertical: 15,
    borderRadius: 5,
    marginRight: 10,
  },
  deleteButton: {
    flex: 1,
    backgroundColor: COLORS.brand,
    paddingVertical: 15,
    borderRadius: 5,
    marginLeft: 10,
  },
  buttonText: {
    textAlign: "center",
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 16,
  },
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
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  // modalButtons: {
  //   flexDirection: "row",
  //   justifyContent: "space-around",
  //   marginTop: 20,
  // },
  saveButton: {
    backgroundColor: COLORS.primary,
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignSelf: "stretch",
    alignItems: "center",
    width: "100%",
  },
  saveButtonText: {
    color: COLORS.white,
    textAlign: "center",
  },
  closeButton: {
    backgroundColor: COLORS.brand,
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignSelf: "stretch",
    alignItems: "center",
    width: "100%",
  },
  closeButtonText: {
    color: COLORS.white,
    textAlign: "center",
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  modalImageEditIcon: {
    position: 'absolute',
    right: "0%",
    bottom: "0%",
  },
  multipleImageContainer: {
    flexDirection: 'row',
    gap: 5,
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    marginHorizontal: 10
  }
});

export default MarketPlace;


