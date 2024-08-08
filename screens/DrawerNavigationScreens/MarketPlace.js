import React, { useState } from "react";
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
  Button
} from "react-native";
import axiosInstance from "../../services/axiosInstance";

const MarketPlace = ({ navigation, allData }) => {
  const [editItem, setEditItem] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
 
  const [editedData, setEditedData] = useState({
    vehicleNumber : "",
    brand: "",
    model: "",
    kms_driven: "",
    location: "",
    owner_name: "",
    contact_no: "",
    description: "",
    updt: ""
  });

  const handleEditPress = (item) => {
    setEditItem(item);
    setEditedData({
      vehicleNumber:item.vehicle_number,
      brand: item.brand,
      model: item.model,
      kms_driven: item.kms_driven,
      location: item.location,
      owner_name: item.owner_name,
      contact_no: item.contact_no,
      description: item.description,
      updt: item.updt
    });
    setModalVisible(true);
  };

  const handleDeletePress = async (item) => {

    const removePostParamters = {
      buy_sell_id:item.buy_sell_id
    }

    try {
      const response = await axiosInstance.post("/remove_truck_buy_sell", removePostParamters)
      console.log(response.data)
    } catch (error) {
      
    }    
  };

  const saveChanges = () => {
    // Implement save changes logic here
    alert("Saving changes...");
    setModalVisible(false);
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.item}>
        <Image source={{uri:item.images[0]}} style={styles.itemImage} />
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
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Item</Text>
            <TextInput
              style={styles.input}
              placeholder="Vehicle Number"
              value={editedData.vehicleNumber}
              onChangeText={(text) => setEditedData({ ...editedData, vehicleNumber: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Brand"
              value={editedData.brand}
              onChangeText={(text) => setEditedData({ ...editedData, brand: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Model"
              value={editedData.model}
              onChangeText={(text) => setEditedData({ ...editedData, model: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Kms Driven"
              value={editedData.kms_driven}
              onChangeText={(text) => setEditedData({ ...editedData, kms_driven: text })}
            />
             <TextInput
              style={styles.input}
              placeholder="Location"
              value={editedData.location}
              onChangeText={(text) => setEditedData({ ...editedData, location: text })}
            />
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
              placeholder="Description"
              value={editedData.description}
              onChangeText={(text) => setEditedData({ ...editedData, description: text })}
            />
            
            <View style={styles.modalButtons}>
              <Button title="Save Changes" onPress={saveChanges} />
              <Button title="Cancel" onPress={() => setModalVisible(false)} />
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
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 20,
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
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
  },
});

export default MarketPlace;


