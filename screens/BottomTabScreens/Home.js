import { ActivityIndicator, Alert, BackHandler, Image, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { COLORS, SIZES } from '../../constants'
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
    setIsLoggedIn,
    userStatesFromProfile,
    setUserStatesFromProfile
  } = useContext(LoadNeedsContext)

  const [selectedStates, setSelectedStates] = useState([]);
  const [operatingStates, setOperatingStates] = useState([])
  const [pageLoading, setPageLoading] = useState(false)


  useFocusEffect(
    React.useCallback(() => {
      BackHandler.addEventListener('hardwareBackPress', handleBackPress)

      return () => {
        BackHandler.removeEventListener('hardwareBackPress', handleBackPress)
      }
    })
  )



  useEffect(() => {
    setPageLoading(true)
    setTimeout(() => {
      setPageLoading(false)
      const bottomSheetOpen = () => {
        isFirstSignup === true ? refRBSheetStates.current.open() : null
      }

      bottomSheetOpen()
    }, 2000);
  }, [])



  useEffect(() => {

    setStateFun()
  }, [])

  const setStateFun = () => {
    setUserStatesFromProfile(userStatesFromProfile)
  }



  useEffect(() => {
    console.log("userStatesFromProfileHome", userStatesFromProfile)
  }, [userStatesFromProfile])








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
        setUserStatesFromProfile(...userStatesFromProfile, operatingStates)
      } else {
        console.log(res.data.message)
      }
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
      {
        pageLoading === true ?
          <View style={styles.container}>
            <ActivityIndicator size="large" color={COLORS.primary} />
          </View>
          :
          <View style={styles.container2}>
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
                  ref={refRBSheet}
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
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={{ fontSize: 18, fontWeight: "700", marginBottom: 18, color: COLORS.primary }}>Notifications</Text>
                        <Text
                          style={{ fontSize: 18, fontWeight: "700", marginBottom: 18, color: COLORS.primary }}
                          onPress={() => {
                            setIsFirstSignup(false)
                            refRBSheet.current.close()
                          }}
                        >
                          <AntDesign name="close" size={24} color="black" />
                        </Text>
                      </View>
                      {/* <View style={{ width: 320 }}>
                        <MultiSelectComponent
                          listOfData={statesData}
                          selectedStates={selectedStates}
                          setSelectedStates={setSelectedStates}
                          setOperatingStates={setOperatingStates}
                        />
                      </View> */}
                      <TouchableOpacity
                        style={[
                          styles.userContainer,

                        ]}
                      >
                        <View style={styles.userImageContainer}>

                          <Image
                            source={require("../../assets/images/apple.png")}
                            resizeMode='contain'
                            style={styles.userImage}
                          />
                        </View>

                        <View style={{
                          flexDirection: 'row',
                          width: SIZES.width - 104,

                        }}>
                          <View style={styles.userInfoContainer}>
                            <Text style={styles.fullName}>FullName</Text>
                            {/* <Text style={styles.lastMessage}>{item.lastMessage}</Text> */}
                            <Text style={styles.lastMessage}>LastMessage</Text>
                          </View>

                          <View style={{
                            position: 'absolute',
                            right: 40,
                            alignItems: 'center',
                          }}>
                            <Text style={styles.lastMessageTime}>Time</Text>

                          </View>
                        </View>
                      </TouchableOpacity>


                    </ScrollView>
                  </View>
                </RBSheet>
              </View>
            }

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
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={{ fontSize: 18, fontWeight: "700", marginBottom: 18, color: COLORS.primary }}>Add your Operating States</Text>
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
          </View>
      }
    </SafeAreaView>
  )
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container2: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
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
  userContainer: {
    width: "100%",
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: COLORS.secondaryWhite,
    borderBottomWidth: 1,
    marginHorizontal: 'auto',
    paddingHorizontal: 20,
    backgroundColor: '#efefef',
    borderRadius: 10

  },
  oddBackground: {
    backgroundColor: COLORS.white
  },
  userImageContainer: {
    paddingVertical: 15,
    marginRight: 22
  },
  onlineIndicator: {
    position: 'absolute',
    top: 14,
    right: 2,
    backgroundColor: COLORS.primary,
    width: 14,
    height: 14,
    borderRadius: 7,
    zIndex: 999,
    borderColor: 'white',
    borderWidth: 2
  },
  userImage: {
    width: 50,
    height: 50,
    borderRadius: 25
  },
  userInfoContainer: {
    flexDirection: 'column',
    maxWidth: "80%",
  },
  fullName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.black,
    marginBottom: 4,

  },
  lastMessage: {
    fontSize: 14,
    color: 'grey',
    // maxWidth:"78%"
  },
  lastMessageTime: {
    fontSize: 12,
    color: COLORS.black
  },
  messageInQueue: {
    fontSize: 12,
    color: 'white'
  }
})


export default Home