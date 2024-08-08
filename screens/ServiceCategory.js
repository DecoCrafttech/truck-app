import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, FlatList } from 'react-native';
import { icons } from "../constants";
import { useNavigation } from '@react-navigation/native';

export default ServiceCategory = () => {
  const navigation = useNavigation();

  const data = [
    { id: 1, title: "Fastag", image: { source: icons.fastag }, screen: "Fastag" },
    { id: 2, title: "Insurance", image: { source: icons.insurance }, screen: "Insurance" },
    { id: 3, title: "Toll Calculator", image: { source: icons.toll }, screen: "TollCalculator" },
    { id: 4, title: "Mileage Calculator", image: { source: icons.mileage }, screen: "MileageCalculator" },
    // { id: 5, title: "Fuel Price", image: { source: icons.fuel }, screen: "FuelPrice" },
    { id: 6, title: "Expense Calculator", image: { source: icons.vaughan }, screen: "VaughanInfo" },
    { id: 7, title: "Buy & Sell", image: { source: icons.buy }, screen: "MarketPlace" },
    { id: 8, title: "Load Available", image: { source: icons.load }, screen: "AvailableLoads" },
    { id: 9, title: "Driver Needs", image: { source: icons.driver }, screen: "AvailableDrivers" },
    { id: 10, title: "Truck Availabe", image: { source: icons.truck }, screen: "AvailableTrucks" },
  ];

  const [options, setOptions] = useState(data);

  const handlePress = (screen) => {
    navigation.navigate(screen);
  };

  return (
    <View style={styles.container}>
      <FlatList
        style={styles.list}
        contentContainerStyle={styles.listContainer}
        data={options}
        numColumns={3}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => handlePress(item.screen)}
            activeOpacity={0.7}
          >
            <Image style={styles.cardImage} source={item.image.source} />
            <Text style={styles.title}>{item.title}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 20,
    backgroundColor: '#F1F2FF',
  },
  list: {
    flex: 1,
  },
  listContainer: {
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#F6F8FF',
    borderColor: '#fff',
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3.5,
    elevation: 5,
    width: '28%',
    height: 120,
  },
  cardImage: {
    width: 40,
    height: 40,
    marginBottom: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#0d6efd',
  },
});