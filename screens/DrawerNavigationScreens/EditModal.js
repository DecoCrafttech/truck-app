import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { COLORS } from "../../constants";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import RNPickerSelect from 'react-native-picker-select';



const EditLoadModal = ({ visible, onClose, onSave, loadDetails, selectedValue,editedDetails,setEditedDetails }) => {

  const GOOLE_API_KEY = "AIzaSyCLT-nqnS-13nBpe-mqzJVsRK7RZIl3I5s"

  // const [editedDetails, setEditedDetails] = useState(null);


  const [truckBodyType, setTruckBodyType] = useState("");

  const [locationModal, setLocationModal] = useState(false)

  const [fromLocationModal, setFromLocationModal] = useState(false)
  const [toLocationModal, setToLocationModal] = useState(false)


  useEffect(() => {
    if (loadDetails) {
      setEditedDetails({
        companyName: loadDetails.company_name || "",
        contactNumber: loadDetails.contact_no || "",
        fromLocation: loadDetails.from_location || "",
        toLocation: loadDetails.to_location || "",
        truckBodyType: loadDetails.truck_body_type || "",
        description: loadDetails.description || "",
        material: loadDetails.material || "",
        ton: loadDetails.tone || "",
        numberOfTyres: loadDetails.no_of_tyres || "", 
        vehicleNumber : loadDetails.vehicle_number || "",
        ownerName : loadDetails.owner_name || "",
        transportName : loadDetails.name_of_the_transport || "",
        truckBrandName : loadDetails.truck_brand_name || "",
        kmsDriven : loadDetails.kms_driven || "",
        model : loadDetails.model || "",
        price : loadDetails.price || "",  
        location : loadDetails.location || "",
        userId : loadDetails.user_id || "",
        userPost : loadDetails.user_post || "",
        updatedTime : loadDetails.updt || "",
        loadId : loadDetails.load_id || "",
        id : loadDetails.id || "",
        driverId : loadDetails.driver_id || "",
        driverName : loadDetails.driver_name || "",
        from : loadDetails.from || "" ,
        to : loadDetails.to || "",
        profileName :  loadDetails.profile_name || "",
        truckId : loadDetails.truck_id || "",
        truckName : loadDetails.truck_name || "",




        // labels: [
        //   { icon: "table-view", text: loadDetails.labels[0]?.text || "" },
        //   { icon: "attractions", text: loadDetails.labels[1]?.text || "" },
        //   { icon: "monitor-weight", text: loadDetails.labels[2]?.text || "" },
        //   { icon: "local-shipping", text: loadDetails.labels[3]?.text || "" },
        //   { icon: "verified", text: loadDetails.labels[4]?.text || "" },
        // ],
        labels: [
          { icon: "table-view", text: loadDetails.text || "" },
          { icon: "attractions", text: loadDetails.text || "" },
          { icon: "monitor-weight", text: loadDetails.text || "" },
          { icon: "local-shipping", text: loadDetails.text || "" },
          { icon: "verified", text: loadDetails.text || "" },
        ],
      });
    } else {
      setEditedDetails(null);
    }
  }, [loadDetails]);

  const handleSave = () => {
    onSave(editedDetails);
  };

  const handleLabelChange = (text, index) => {
    const updatedLabels = [...editedDetails.labels];

    // Set default text if 'text' is empty
    if (text === "") {
      text = " "; // Or any other default text you prefer
    }

    updatedLabels[index].text = text;
    setEditedDetails({ ...editedDetails, labels: updatedLabels });
  };



  const renderInputs = () => {
    if (!editedDetails) return null;

    const filteredLabels = editedDetails.labels.filter(label => label.text !== "");



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



      setLocation(`${city} , ${state}`)
      setLocationModal(false)
      // You can use the extracted details as needed
    };

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



      setEditedDetails({ ...editedDetails, fromLocation: (`${city} , ${state}`) })
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


      // setModalValues((prevState) => ({
      //   ...prevState, toLocation: (`${city} , ${state}`)
      // }))
      setEditedDetails({ ...editedDetails, toLocation: (`${city} , ${state}`) })

      setToLocationModal(false)
      // You can use the extracted details as needed
    };


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

    const kmsData = [
      { label: '0 - 10,000 kms', value: '0_10000_kms' },
      { label: '10,001 - 30,000 kms', value: '10001_30000_kms' },
      { label: '30,001 - 50,000 kms', value: '30001_50000_kms' },
      { label: '50,001 - 70,000 kms', value: '50001_70000_kms' },
      { label: '70,001 - 100,000 kms', value: '70001_100000_kms' },
      { label: '100,001 - 150,000 kms', value: '100001_150000_kms' },
      { label: '150,001 - 200,000 kms', value: '150001_200000_kms' },
      { label: '200,001 - 300,000 kms', value: '200001_300000_kms' },
      { label: '300,001 - 500,000 kms', value: '300001_500000_kms' },
      { label: '500,001 - 700,000 kms', value: '500001_700000_kms' },
      { label: '700,001 - 1,000,000 kms', value: '700001_1000000_kms' },
      { label: '1,000,001 - 1,500,000 kms', value: '1000001_1500000_kms' },
      { label: '1,500,001 - 2,000,000 kms', value: '1500001_2000000_kms' },
      { label: '2,000,001+ kms', value: '2000001_plus_kms' },
    ];


    const priceData = [
      { label: '0 - 5,00,000 lakhs', value: '0_5_lakhs' },
      { label: '5,00,001 - 10,00,000 lakhs', value: '5_10_lakhs' },
      { label: '10,00,001 - 20,00,000 lakhs', value: '10_20_lakhs' },
      { label: '20,00,001 - 30,00,000 lakhs', value: '20_30_lakhs' },
      { label: '30,00,001 - 40,00,000 lakhs', value: '30_40_lakhs' },
      { label: '40,00,001 - 50,00,000 lakhs', value: '40_50_lakhs' },
      { label: '50,00,001 - 60,00,000 lakhs', value: '50_60_lakhs' },
      { label: '60,00,001 - 70,00,000 lakhs', value: '60_70_lakhs' },
      { label: '70,00,001 - 80,00,000 lakhs', value: '70_80_lakhs' },
      { label: '80,00,001 - 90,00,000 lakhs', value: '80_90_lakhs' },
      { label: '90,00,001 and above lakhs', value: '90_above_lakhs' },
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



    const renderEditModalFields = (selectedValue) => {

      switch (selectedValue) {
        case "user_load_details":
          return (
            <ScrollView style={{width:"100%",height:"70%"}}>
              <TextInput
                style={styles.input}
                value={editedDetails.companyName}
                onChangeText={(text) =>
                  setEditedDetails({ ...editedDetails, companyName: text })
                }
                placeholder="Company name"
              />

              <TextInput
                style={styles.input}
                value={editedDetails.contactNumber}
                onChangeText={(text) =>
                  setEditedDetails({ ...editedDetails, contactNumber: text })
                }
                placeholder="Contact Number"
              />

              <TextInput
                style={styles.input}
                // onChangeText={(text) =>
                //   setEditedDetails({ ...editedDetails, fromLocation: text })
                // }
                placeholder="From Location"
                value={editedDetails.fromLocation}
                onPress={() => setFromLocationModal(true)}
              />

              <TextInput
                style={styles.input}
                // onChangeText={(text) =>
                //   setEditedDetails({ ...editedDetails, toLocation: text })
                // }
                placeholder="To Location"
                value={editedDetails.toLocation}
                onPress={() => setToLocationModal(true)}
              />

              <TextInput
                style={styles.input}
                value={editedDetails.material}
                onChangeText={(text) =>
                  setEditedDetails({ ...editedDetails, material: text })
                }
                placeholder="Material"
              />

              <TextInput
                style={styles.input}
                value={editedDetails.ton}
                onChangeText={(text) =>
                  setEditedDetails({ ...editedDetails, ton: text })
                }
                placeholder="Ton"
                keyboardType="number-pad"

              />

              <View style={{ borderColor: COLORS.gray, borderWidth: 1, width: "100%", padding: 0, borderRadius: 5, marginVertical: 8 }}>
                <RNPickerSelect
                  onValueChange={(value) => setEditedDetails({...editedDetails, truckBodyType : value})}
                  items={bodyTypeData}
                  value={editedDetails.truckBodyType}
                  placeholder={{
                    label: 'Select truck body type',
                    value: null,
                    color: 'grey',
                  }}
                />
              </View>

              <View style={{ borderColor: COLORS.gray, borderWidth: 1, width: "100%", padding: 0, borderRadius: 5, marginBottom: 8 }}>
                <RNPickerSelect
                  onValueChange={(value) => setEditedDetails({...editedDetails, numberOfTyres : value})}
                  items={numberOfTyresData}
                  value={editedDetails.numberOfTyres}
                  placeholder={{
                    label: 'Select number of tyres',
                    value: null,
                    color: 'grey',
                  }}
                />
              </View>

              <TextInput
                style={styles.input}
                value={editedDetails.description}
                onChangeText={(text) =>
                  setEditedDetails({ ...editedDetails, description: text })
                }
                placeholder="Description"
              />
            </ScrollView>
          )

        case "user_driver_details":
          return (
            <ScrollView style={{width:"100%",height:"70%"}}>

              <TextInput
                style={styles.input}
                value={editedDetails.vehicleNumber}
                onChangeText={(text) =>
                  setEditedDetails({ ...editedDetails, vehicleNumber: text })
                }
                placeholder="Vehicle number"
              />

              {/* <TextInput
                style={styles.input}
                value={editedDetails.companyName}
                onChangeText={(text) =>
                  setEditedDetails({ ...editedDetails, companyName: text })
                }
                placeholder="Company name"
              /> */}

              <TextInput
                style={styles.input}
                value={editedDetails.companyName}
                onChangeText={(text) =>
                  setEditedDetails({ ...editedDetails, companyName: text })
                }
                placeholder="Owner name"
              />

              <TextInput
                style={styles.input}
                value={editedDetails.contactNumber}
                onChangeText={(text) =>
                  setEditedDetails({ ...editedDetails, contactNumber: text })
                }
                placeholder="Contact Number"
                keyboardType="number-pad"

              />

              <TextInput
                style={styles.input}
                // onChangeText={(text) =>
                //   setEditedDetails({ ...editedDetails, fromLocation: text })
                // }
                placeholder="From Location"
                value={editedDetails.fromLocation}
                onPress={() => setFromLocationModal(true)}
              />

              <TextInput
                style={styles.input}
                // onChangeText={(text) =>
                //   setEditedDetails({ ...editedDetails, toLocation: text })
                // }
                placeholder="To Location"
                value={editedDetails.toLocation}
                onPress={() => setToLocationModal(true)}
              />



              <View style={{ borderColor: COLORS.gray, borderWidth: 1, width: "100%", padding: 0, borderRadius: 5, marginVertical: 8 }}>
                <RNPickerSelect
                  onValueChange={(value) => setEditedDetails({...editedDetails,truckBodyType : value})}
                  items={bodyTypeData}
                  value={editedDetails.truckBodyType}
                  placeholder={{
                    label: 'Select truck body type',
                    value: null,
                    color: 'grey',
                  }}
                />
              </View>

              <View style={{ borderColor: COLORS.gray, borderWidth: 1, width: "100%", padding: 0, borderRadius: 5, marginBottom: 8 }}>
                <RNPickerSelect
                  onValueChange={(value) => setEditedDetails({...editedDetails,numberOfTyres : value})}
                  items={numberOfTyresData}
                  value={editedDetails.numberOfTyres}
                  placeholder={{
                    label: 'Select number of tyres',
                    value: null,
                    color: 'grey',
                  }}
                />
              </View>

              <TextInput
                style={styles.input}
                value={editedDetails.description}
                onChangeText={(text) =>
                  setEditedDetails({ ...editedDetails, description: text })
                }
                placeholder="Description"
              />
            </ScrollView>
          )

        case "user_truck_details":
          return (
            <ScrollView style={{width:"100%",height:"70%"}}>

              <TextInput
                style={styles.input}
                value={editedDetails.vehicleNumber}
                onChangeText={(text) =>
                  setEditedDetails({ ...editedDetails, vehicleNumber: text })
                }
                placeholder="Vehicle number"
              />


              <TextInput
                style={styles.input}
                value={editedDetails.companyName}
                onChangeText={(text) =>
                  setEditedDetails({ ...editedDetails, companyName: text })
                }
                placeholder="Owner name"
              />

              <TextInput
                style={styles.input}
                value={editedDetails.contactNumber}
                onChangeText={(text) =>
                  setEditedDetails({ ...editedDetails, contactNumber: text })
                }
                placeholder="Contact Number"
                keyboardType="number-pad"

              />

              <TextInput
                style={styles.input}
                value={editedDetails.transportName}
                onChangeText={(text) =>
                  setEditedDetails({ ...editedDetails, transportName: text })
                }
                placeholder="Name of the transport"
              />

              <TextInput
                style={styles.input}
                value={editedDetails.ton}
                onChangeText={(text) =>
                  setEditedDetails({ ...editedDetails, ton: text })
                }
                placeholder="Ton"
                keyboardType="number-pad"

              />

              <TextInput
                style={styles.input}
                value={editedDetails.truckBrandName}
                onChangeText={(text) =>
                  setEditedDetails({ ...editedDetails, truckBrandName: text })
                }
                placeholder="Truck name"
              />

              <TextInput
                style={styles.input}
                // onChangeText={(text) =>
                //   setEditedDetails({ ...editedDetails, fromLocation: text })
                // }
                placeholder="From Location"
                value={editedDetails.fromLocation}
                onPress={() => setFromLocationModal(true)}
              />

              <TextInput
                style={styles.input}
                // onChangeText={(text) =>
                //   setEditedDetails({ ...editedDetails, toLocation: text })
                // }
                placeholder="To Location"
                value={editedDetails.toLocation}
                onPress={() => setToLocationModal(true)}
              />



              <View style={{ borderColor: COLORS.gray, borderWidth: 1, width: "100%", padding: 0, borderRadius: 5, marginVertical: 8 }}>
                <RNPickerSelect
                  onValueChange={(value) => setEditedDetails({...editedDetails,truckBodyType : value})}
                  items={bodyTypeData}
                  value={editedDetails.truckBodyType}
                  placeholder={{
                    label: 'Select truck body type',
                    value: null,
                    color: 'grey',
                  }}
                />
              </View>

              <View style={{ borderColor: COLORS.gray, borderWidth: 1, width: "100%", padding: 0, borderRadius: 5, marginBottom: 8 }}>
                <RNPickerSelect
                  onValueChange={(value) => setEditedDetails({...editedDetails,numberOfTyres : value})}
                  items={numberOfTyresData}
                  value={editedDetails.numberOfTyres}
                  placeholder={{
                    label: 'Select number of tyres',
                    value: null,
                    color: 'grey',
                  }}
                />
              </View>

              <TextInput
                style={styles.input}
                value={editedDetails.description}
                onChangeText={(text) =>
                  setEditedDetails({ ...editedDetails, description: text })
                }
                placeholder="Description"
              />
            </ScrollView>
          )

        case "user_buy_sell_details":
          return (
            <ScrollView style={{width:"100%",height:"70%"}}>
              <TextInput
                style={styles.input}
                value={editedDetails.ownerName}
                onChangeText={(text) =>
                  setEditedDetails({ ...editedDetails, ownerName: text })
                }
                placeholder="Owner name"
              />

              <TextInput
                style={styles.input}
                value={editedDetails.contactNumber}
                onChangeText={(text) =>
                  setEditedDetails({ ...editedDetails, contactNumber: text })
                }
                placeholder="Contact Number"
              />

              <TextInput
                style={styles.input}
                value={editedDetails.vehicleNumber}
                onChangeText={(text) =>
                  setEditedDetails({ ...editedDetails, vehicleNumber: text })
                }
                placeholder="Vehicle number"
              />

              <TextInput
                style={styles.input}
                value={editedDetails.kmsDriven}
                onChangeText={(text) =>
                  setEditedDetails({ ...editedDetails, kmsDriven: text })
                }
                placeholder="Kms driven"
              />

              <View style={{ borderColor: COLORS.gray, borderWidth: 1, width: "100%", padding: 0, borderRadius: 5, marginVertical: 8 }}>
                <RNPickerSelect
                  onValueChange={(value) => setEditedDetails({...editedDetails,brand : value})}
                  items={brandData}
                  value={editedDetails.brand}
                  placeholder={{
                    label: 'Brand',
                    value: null,
                    color: 'grey',
                  }}
                />
              </View>

              <View style={{ borderColor: COLORS.gray, borderWidth: 1, width: "100%", padding: 0, borderRadius: 5, marginVertical: 8 }}>
                <RNPickerSelect
                  onValueChange={(value) => setEditedDetails({...editedDetails,model : value})}
                  items={yearsData}
                  value={editedDetails.model}
                  placeholder={{
                    label: 'Model',
                    value: null,
                    color: 'grey',
                  }}
                />
              </View>

              <View style={{ borderColor: COLORS.gray, borderWidth: 1, width: "100%", padding: 0, borderRadius: 5, marginVertical: 8 }}>
                <RNPickerSelect
                  onValueChange={(value) => setEditedDetails({...editedDetails,price : value})}
                  items={priceData}
                  value={editedDetails.price}
                  placeholder={{
                    label: 'Price',
                    value: null,
                    color: 'grey',
                  }}
                />
              </View>
           

              <TextInput
                style={styles.input}
                // onChangeText={(text) =>
                //   setEditedDetails({ ...editedDetails, fromLocation: text })
                // }
                placeholder="Location"
                value={editedDetails.location}
                onPress={() => setLocationModal(true)}
              />

           

              <TextInput
                style={styles.input}
                value={editedDetails.description}
                onChangeText={(text) =>
                  setEditedDetails({ ...editedDetails, description: text })
                }
                placeholder="Description"
              />
            </ScrollView>
          )


        default:
          break;

      }



    }

    return (
      <>
        {renderEditModalFields(selectedValue)}

        {filteredLabels.map((data, index) => (

          <TextInput
            key={index}
            style={styles.input}
            value={data.text}
            onChangeText={(text) => handleLabelChange(text, index)}
            placeholder={`Label ${index + 1}`}
          />
        ))}


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



        {/*From Location Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={fromLocationModal}
        // onRequestClose={() => setIsAadhaarModal(false)}
        >
          <View style={styles.locationModalContainer}>
            <View style={styles.locationModalContent}>
              {/* <Text style={styles.modalTitle}>From Location</Text> */}


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
              {/* <Text style={styles.modalTitle}>To Location</Text> */}


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

      </>
    );
  };






  return (

    <>

      <Modal
        visible={visible}
        animationType="slide"
        transparent={true}
        onRequestClose={onClose}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.header}>Edit</Text>
            {renderInputs()}
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSave}
              disabled={!visible}
            >
              <Text style={styles.saveButtonText}>Save Changes</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>







    </>


  );
};

const styles = StyleSheet.create({
  header: {
    fontSize: 20,
    textAlign: "left",
    fontWeight: "bold",
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
    elevation: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.gray,
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
    width: "100%",
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
    height: "80%"
  },
  locationContainer: {
    flex: 1,
    padding: 5,
  },
  locationTextInput: {
    borderWidth: 1,
    borderColor: COLORS.gray,
  },
});

export default EditLoadModal;