import { Alert, BackHandler, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { COLORS } from '../../constants'
import Header from '../../components/Header'
import BottomSheet from '../../components/BottomSheet'
import ServiceCategory from '../ServiceCategory'
import { useFocusEffect } from '@react-navigation/native'
import RBSheet from 'react-native-raw-bottom-sheet'
import MultiSelectComponent from '../../components/MultiSelectComponent'
import { statesData } from '../../constants/cityAndState'
import { TouchableOpacity } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axiosInstance from '../../services/axiosInstance'
import { LoadNeedsContext } from '../../hooks/LoadNeedsContext'
import AntDesign from '@expo/vector-icons/AntDesign';


const Home = () => {
  const refRBSheet = useRef()
  const refRBSheetStates = useRef()

  const {
    isFirstSignup,
    setIsFirstSignup,
    isLoggedIn,
    setIsLoggedIn
} = useContext(LoadNeedsContext)

  const [selectedStates, setSelectedStates] = useState([]);
  const [operatingStates, setOperatingStates] = useState([])


  useFocusEffect(
    React.useCallback(() => {
      BackHandler.addEventListener('hardwareBackPress', handleBackPress)

      return () => {
        BackHandler.removeEventListener('hardwareBackPress', handleBackPress)
      }
    })
  )


  useEffect(() => {
      const bottomSheetOpen = () => {
        isFirstSignup === true ?  refRBSheetStates.current.open() : null
      }

      bottomSheetOpen()
  }, [])

  const handleBackPress = () => {
    Alert.alert('Exit App', 'Are you sure want to exit?',
      [
        {
          text: 'Cancel',
          onPress: () => null,
          style: 'cancel'
        },
        {
          text: 'Exit',
          onPress: () => BackHandler.exitApp()
        }
      ]
    )
    return true
  }

  const handleStatesSubmit = async () => {
    try {

        const addStatesParams = {
            "user_id": `${await AsyncStorage.getItem("user_id")}`,
            "state_name": operatingStates
        }

        const res = await axiosInstance.post("/user_state_entry", addStatesParams)

        if (res.data.error_code === 0) {
            refRBSheetStates.current.close()
            setOperatingStates([])
            setSelectedStates([])

        } else {
            console.log(res.data.message)
        }
    } catch (err) {
        console.log(err)
    }
}




  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
      <View style={{ flex: 1, backgroundColor: COLORS.white }}>
        <Header
          title="Truck Message"
          onPress={() => refRBSheet.current.open()}
        />
        <ServiceCategory />

      </View>
      <BottomSheet bottomSheetRef={refRBSheetStates} />

      {
        <View>
        <RBSheet
          ref={refRBSheetStates}
          height={500}
          openDuration={250}
          closeOnDragDown={true}
          closeOnPressBack={true}
          closeOnPressMask={false}
          customStyles={{
            wrapper: {
              backgroundColor: "rgba(0,0,0,0.5)",
            },
            draggableIcon: {
              backgroundColor: COLORS.gray,
              width: 100,
            },
            container: {
              borderTopLeftRadius: 30,
              borderTopRightRadius: 30,
              alignItems: "center",
              justifyContent: "center",
              padding: 20,
            },
          }}
        >
          <View>
            <ScrollView>
              <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                <Text style={{ fontSize: 18, fontWeight: "700", marginBottom: 18, color: COLORS.primary }}>Add States</Text>
                <Text 
                  style={{ fontSize: 18, fontWeight: "700", marginBottom: 18, color: COLORS.primary }} 
                  onPress={() => {
                    setIsFirstSignup(false)
                    refRBSheetStates.current.close()
                  }}
                  >
                    <AntDesign name="close" size={24} color="black" />
                  </Text>
              </View>
              <View style={{ width: 320 }}>
                <MultiSelectComponent
                  listOfData={statesData}
                  selectedStates={selectedStates}
                  setSelectedStates={setSelectedStates}
                  setOperatingStates={setOperatingStates}
                />
              </View>

              <View style={{ marginTop: 20 }}>
                <TouchableOpacity style={styles.addButton} onPress={() => handleStatesSubmit()} >
                  <Text style={[styles.buttonText, { textAlign: 'center' }]}>Submit</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </RBSheet>
      </View>
      }

    </SafeAreaView>
  )
}


const styles = StyleSheet.create({
  addButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
})

export default Home