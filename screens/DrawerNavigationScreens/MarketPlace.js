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
  ScrollView,
  Alert,
} from "react-native";
import axiosInstance from "../../services/axiosInstance";
import RNPickerSelect from 'react-native-picker-select';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from "@react-native-async-storage/async-storage";




const MarketPlace = ({  allData,fetchData }) => {
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

    const formData = new FormData();

    // Append images to FormData
    editedData.images.forEach((image, index) => {
      formData.append(`truck_image${index + 1}`, {
        uri: image.uri,
        type: 'image/jpeg', // Adjust accordingly if different image types
        name: `truck_image_${index + 1}.jpg`, // Use a unique name for the image
      });
    });


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

              <TouchableOpacity
                style={styles.saveButton}
                onPress={saveChanges}
              >
                <Text style={styles.saveButtonText}>Save Changes</Text>
              </TouchableOpacity>

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


