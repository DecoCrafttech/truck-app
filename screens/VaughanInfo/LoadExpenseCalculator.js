import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  ActivityIndicator,
  Alert,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "../../constants";
import HeaderWithOutBS from "../../components/HeaderWithOutBS";
import ExpenseHistory from "./ExpenseHistory";
import axiosInstance from "../../services/axiosInstance";
import{ LoadNeedsContext } from "../../hooks/LoadNeedsContext"

const LoadExpenseCalculator = ({ route }) => {
  const { item } = route.params;

  const {isLoading, setIsLoading} = useContext(LoadNeedsContext)

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [cashStatus, setCashStatus] = useState("");
  const [modalValues, setModalValues] = useState({
    category: "",
    amount: "",
    details: "",
  });
  const [errorFields, setErrorFields] = useState({
    category: false,
    amount: false,
    details: false,
  });

  const toggleModal = (cash) => {
    setCashStatus(cash);
    setIsModalVisible(!isModalVisible);
    setModalValues({
      category: "",
      amount: "",
      details: "",
    });
    setErrorFields({
      category: false,
      amount: false,
      details: false,
    });

   
  };

  const [cashFlowExpenseHistory, setCashFlowExpenseHistory] = useState([]);
  const [updateCashFlowStatus, setUpdateCashFlowStatus] = useState(false)
  const [initalCash, setInitialCash] = useState({
    cashIn:"",
    cashOut:""
  })

  useEffect(() => {

    const getInitialBalance = async () => {
   try {
    const getCashFlowParamter = {
      load_trip_id: item.load_trip_id,
    };
    const response = await axiosInstance.post(
      "/initial_cash_in_out",
      getCashFlowParamter
    );    

    console.log(response.data)

    if(response.data.error_code===0){
      setInitialCash({
        cashIn:response.data.data[0].available_cash,
    cashOut:response.data.data[0].spend_amount
      })
    }
   } catch (error) {
    
   }
    }

    getInitialBalance();

    const getFlowCashTrip = async () => {
      try {
        const getCashFlowParamter = {
          load_trip_id: item.load_trip_id,
        };
        const response = await axiosInstance.post(
          "/get_load_trip_cash_flow",
          getCashFlowParamter
        );        
        if (response.data.error_code === 0) {
          setCashFlowExpenseHistory(response.data.data);
          setIsLoading(!isLoading)
        }
      } catch (error) {}
    };

    getFlowCashTrip();
  }, [updateCashFlowStatus]);

  const handleInputChange = (field, value) => {
  setModalValues({ ...modalValues, [field.toLowerCase()]: value }); // Ensure field is lowercase
    setErrorFields({ ...errorFields, [field.toLowerCase()]: false }); // Ensure field is lowercase
  };

  const applyFilter = async () => {
    // Validate inputs
    let hasError = false;
    const errors = {};

    Object.keys(modalValues).forEach((key) => {
      if (!modalValues[key]) {
        errors[key] = true;
        hasError = true;
      }
    });

    if (hasError) {
      setErrorFields(errors);
      return;
    }

    try {
      const loadTripCashFlowEntryParameters = {        
          load_trip_id:item.load_trip_id,
          cash_flow_name:modalValues.details,
          category:modalValues.category,
          cash_flow_type:cashStatus === "Cash In" ? "IN" : "OUT",
          amount:modalValues.amount      
      }
      console.log(loadTripCashFlowEntryParameters)
      const response = await axiosInstance.post("/load_trip_cash_flow_entry",loadTripCashFlowEntryParameters) 
      if(response.data.error_code === 0){
        setUpdateCashFlowStatus(!updateCashFlowStatus)
      }else {
        Alert.alert(response.data.message)
      }
    } catch (error) {
      
    }

    toggleModal(); 
  };

  const handleButtonPress = (cash) => {
    toggleModal(cash);    
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
      <View style={{ flex: 1, backgroundColor: COLORS.white }}>
        <HeaderWithOutBS title="Load Expense Calculator" />
        <View style={styles.container}>
          <Text style={styles.title}>{item.load_name}</Text>
          <View style={styles.balanceContainer}>
            <View style={[styles.box, { marginRight: 10 }]}>
              <Text style={styles.boxTitle}>
                ₹ {initalCash.cashIn}
              </Text>
              <Text style={styles.boxValue}>Cash In</Text>
            </View>
            <View style={styles.box}>
              <Text style={styles.boxTitle}>₹ {initalCash.cashOut}</Text>
              <Text style={styles.boxValue}>Cash Out</Text>
            </View>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => handleButtonPress("Cash In")}
            >
              <Text style={styles.buttonText}>Credit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button1}
              onPress={() => handleButtonPress("Cash Out")}
            >
              <Text style={styles.buttonText}>Debit</Text>
            </TouchableOpacity>
          </View>
        </View>
        <ExpenseHistory cashFlowExpenseHistory={cashFlowExpenseHistory} />
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={toggleModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{cashStatus}</Text>
            <TextInput
              style={[styles.input, errorFields.category && styles.inputError]}
              placeholder="Category"
              value={modalValues.category}
              onChangeText={(text) => handleInputChange("category", text)} // Use lowercase
            />

            <TextInput
              style={[styles.input, errorFields.amount && styles.inputError]}
              placeholder="Amount"
              value={modalValues.amount}
              onChangeText={(text) => handleInputChange("amount", text)} // Use lowercase
            />

            <TextInput
              style={[styles.input, errorFields.details && styles.inputError]}
              placeholder="Details"
              value={modalValues.details}
              onChangeText={(text) => handleInputChange("details", text)} // Use lowercase
            />

            <TouchableOpacity style={styles.applyButton} onPress={applyFilter}>
              <Text style={styles.applyButtonText}>{cashStatus}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.closeButton} onPress={toggleModal}>
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
    marginTop: 10,
    padding: 20,
    backgroundColor: COLORS.gray,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
    color: COLORS.primary,
    textAlign: "center",
  },
  balanceContainer: {
    flexDirection: "row", // Arrange children horizontally
    paddingHorizontal: 20,
    marginTop: 10,
  },
  box: {
    flex: 1,
    height: 100,
    backgroundColor: COLORS.white,
    borderRadius: 10,
    justifyContent: "center", // Center content vertically
    alignItems: "center", // Center content horizontally
  },
  boxTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  boxValue: {
    fontSize: 16,
    color: COLORS.brand,
    fontWeight: "bold",
  },
  buttonContainer: {
    flexDirection: "row", // Arrange children horizontally
    justifyContent: "center", // Center children horizontally
    marginTop: 20,
  },
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 50,
    marginHorizontal: 10,
  },
  button1: {
    backgroundColor: COLORS.brand,
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 50,
    marginHorizontal: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
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

export default LoadExpenseCalculator;
