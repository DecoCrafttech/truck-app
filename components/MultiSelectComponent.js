import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import { MaterialIcons as Icon } from '@expo/vector-icons';
import { ScrollView } from 'react-native';
import { citiesArray, citiesData, statesData } from '../constants/cityAndState';


function MultiSelectComponent({ 
    listOfData, 
    selectedCities, 
    setSelectedCities, 
    selectedStates, 
    setSelectedStates,
    setOperatingCities,
    setOperatingStates
   }) {
  

  const handleSelectedCities = (selectedItemIds) => {
    const prevSelectedCityNames = selectedCities.map(id => {
      const city = citiesData.find(city => city.id === id);
      return city ? city.name : null;
    }).filter(name => name !== null);

    // console.log('Previously selected cities:', prevSelectedCityNames);

    setSelectedCities(selectedItemIds);

    const selectedCityNames = selectedItemIds.map(id => {
      const city = citiesData.find(city => city.id === id);
      return city ? city.name : null;
    }).filter(name => name !== null);

    // console.log('Currently selected cities:', selectedCityNames);
    setOperatingCities(selectedCityNames)
  };

  const handleSelectedStates = (selectedItemIds) => {
    // Log previously selected states
    const prevSelectedStateNames = selectedStates.map(id => {
      const state = statesData.find(state => state.id === id);
      return state ? state.name : null;
    }).filter(name => name !== null);

    // console.log('Previously selected states:', prevSelectedStateNames);

    // Update selected states
    setSelectedStates(selectedItemIds);

    // Log currently selected states
    const selectedStateNames = selectedItemIds.map(id => {
      const state = statesData.find(state => state.id === id);
      return state ? state.name : null;
    }).filter(name => name !== null);

    // console.log('Currently selected states:', selectedStateNames);
    setOperatingStates(selectedStateNames)
  };

  return (
    <>
      <ScrollView>
        <View>
          {
            listOfData === citiesData ?
              <SectionedMultiSelect
                items={citiesData}
                IconRenderer={Icon}
                uniqueKey="id"
                searchPlaceholderText='Search city'
                selectedText='selected'
                selectText='Select'
                confirmText='Done'
                onSelectedItemsChange={handleSelectedCities}
                selectedItems={selectedCities}
                colors={{ primary: '#4285F4' }}
                styles={{
                  backdrop: styles.multiSelectBackdrop,
                  selectToggle: styles.multiSelectBox,
                  chipContainer: styles.multiSelectChipContainer,
                  chipText: styles.multiSelectChipText,
                  selectToggleText: styles.selectToggleText,
                  selectedItemText: styles.selectedItemText,
                  selectText: styles.selectText,
                }}
              />
              :
              <SectionedMultiSelect
              items={statesData}
              IconRenderer={Icon}
              uniqueKey="id"
              searchPlaceholderText='Search state'
              selectedText='selected'
              selectText='Select'
              confirmText='Done'
              onSelectedItemsChange={handleSelectedStates}
              selectedItems={selectedStates}
                styles={{
                  backdrop: styles.multiSelectBackdrop,
                  selectToggle: styles.multiSelectBox,
                  chipContainer: styles.multiSelectChipContainer,
                  chipText: styles.multiSelectChipText,
                  selectToggleText: styles.selectToggleText,
                  selectedItemText: styles.selectedItemText,
                  selectText: styles.selectText,
                }}
              />
          }
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  multiSelectBackdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.01)',
  },
  multiSelectBox: {
    borderWidth: 1,
    borderRadius: 8,
    borderColor: 'grey',
    padding: 10,
    paddingLeft: 15,
    marginBottom: 4,
  },
  selectToggleText: {
    color: '#000',
    fontSize: 14
  },
  selectText: {
    color: 'red'
  },
  selectedItemText: {
    color: '#4285F4',
  },
  multiSelectChipContainer: {
    borderWidth: 0,
    backgroundColor: '#ddd',
    borderRadius: 8,
  },
  multiSelectChipText: {
    color: '#222',
    fontSize: 12,
  }
});

export default MultiSelectComponent