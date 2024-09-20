import React from "react";
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from "react-native";
import { COLORS } from "../constants";
import Icon from "react-native-vector-icons/MaterialIcons";
import Icon1 from 'react-native-vector-icons/FontAwesome';


const TruckCard = ({
  title,
  fromLocation,
  toLocation,
  labels,
  description,
  onButton1Press,
  onButton2Press,
  status,
  profileName,
  post,
  companyName,
  selectedValue

}) => {



  return (
    <View style={styles.card}>



      {
        selectedValue === "user_load_details" ||
          selectedValue === "user_driver_details" ||
          selectedValue === "user_truck_details" ||
          selectedValue === "user_buy_sell_details" ?
          null :
          <View style={[styles.ratingsContainer]}>
            <View style={styles.starsContainer}>
              {[...Array(5)].map((_, index) => (
                <Icon1
                  key={index}
                  name={index > 2 ? "star-o" : "star"}
                  size={13}
                  color="#FFD700"
                />
              ))}
            </View>
            <Text style={styles.textRight}>Posts : {post}</Text>
          </View>
      }


      <View style={styles.titleContainer}>
        {
          selectedValue === "user_load_details" ||
            selectedValue === "user_driver_details" ||
            selectedValue === "user_truck_details" ||
            selectedValue === "user_buy_sell_details" ?
            <Text style={styles.title}>{companyName}</Text>
            :
            <>
              <Text style={styles.title}>{profileName}</Text>
              {/* <Text style={styles.title}>{companyName}</Text> */}
            </>
        }

        {
          selectedValue === "user_load_details" ||
            selectedValue === "user_driver_details" ||
            selectedValue === "user_truck_details" ||
            selectedValue === "user_buy_sell_details" ?
            null :
            <>
              <View style={[styles.labelsContainer, { justifyContent: 'center' }]}>
                <Icon1 name="building-o" size={20} color={COLORS.black} />
                <Text style={styles.label}>{companyName}</Text>
              </View>
            </>
          
            
        }


      </View>
      <View style={styles.locationContainer}>
        <Icon name="place" size={24} color={COLORS.iconPickup} />
        <Text style={styles.location}>{fromLocation}</Text>
      </View>
      <View style={styles.locationContainer}>
        <Icon name="place" size={24} color={COLORS.iconDrop} />
        <Text style={styles.location}>{toLocation}</Text>
      </View>

      <View style={styles.labelsContainer}>
        {labels.slice(0, 4).map((label, index) => (
          <View key={index} style={styles.labelRow}>
            <Icon name={label.icon} size={20} color={COLORS.black} />
            <Text style={styles.label}>{label.text}</Text>
          </View>
        ))}
      </View>

      <View>
        <Text style={{ fontWeight: "bold" }}>Description</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.buttonGreen]}
          onPress={onButton1Press}
        >
          <Text style={styles.buttonText}>{status === "editAndDelete" ? "Edit" : "Call"}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.buttonRed]}
          onPress={onButton2Press}
        >
          <Text style={styles.buttonText}>{status === "editAndDelete" ? "Delete" : "Message"}</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    padding: 20,
    margin: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    color: "#3194d6",
  },
  titleContainer: {
    backgroundColor: "#f1f2ff", // Change to desired background color
    padding: 10, // Add padding
    borderRadius: 5, // Optional: Add border radius
    marginBottom: 10, // Add some margin below the title

  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
    justifyContent: "flex-start",
  },
  location: {
    fontSize: 16,
    marginLeft: 5,
  },
  labelsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "48%",
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    marginLeft: 5,
  },
  description: {
    fontSize: 14,
    marginTop: 5,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  button: {
    flex: 1,
    alignItems: "center",
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 5,
  },
  buttonRed: {
    backgroundColor: COLORS.brand,
  },
  buttonGreen: {
    backgroundColor: "green",
  },
  buttonText: {
    color: COLORS.white,
    fontWeight: "bold",
  },
  ratingsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center', // Center vertically if needed
    marginHorizontal: 5,
    marginBottom: 10,
    paddingTop: 10
  },
  starsContainer: {
    flexDirection: 'row', // Align stars horizontally
  },
  textRight: {
    textAlign: 'right',
    fontWeight: '600'
    // Additional styling for the "Hi" text if needed
  },
});

export default TruckCard;
