import { View, Text, Image, Alert } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import {
  DrawerItem,
  DrawerItemList,
  createDrawerNavigator,
} from "@react-navigation/drawer";
import { COLORS } from "../constants";
import { Ionicons } from "@expo/vector-icons";
import BottomTabNavigation from "./BottomTabNavigation";
import { SafeAreaView } from "react-native-safe-area-context";
import Refer from "../screens/DrawerNavigationScreens/Refer";
import AboutUs from "../screens/DrawerNavigationScreens/AboutUs";
import Blogs from "../screens/DrawerNavigationScreens/Blogs";
import TermsAndCondition from "../screens/DrawerNavigationScreens/TermsAndCondition";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LoadNeedsContext } from "../hooks/LoadNeedsContext";
import Constants from 'expo-constants';


const Drawer = createDrawerNavigator();
const DrawerNavigation = () => {

  const navigation = useNavigation()
  

  const {
    isLoggedIn,
    setIsLoggedIn,
    isSignedUp,
    setIsSignedUp,
    setUserStatesFromProfile
  } = useContext(LoadNeedsContext)

  const [userName,setUserName] = useState("")
  const [mobileNumber,setMobileNumber] = useState("")

  // cdn link
  const cdnLink = Constants.expoConfig?.extra?.REACT_APP_CDN_LINK 



  
   useEffect(() => {
    const fetchData = async () => {
      setUserName(await AsyncStorage.getItem("userName"))
      setMobileNumber(await AsyncStorage.getItem("mobileNumber"))
    };

    (async =>  fetchData())() // Call the async function here
  }, [isLoggedIn,isSignedUp]); // Empty dependency array means this runs once after component mounts




  const handleLogout = async () => {

    Alert.alert("Logout","Are you sure want to logout?",
      [
        {
          text : "Yes",
          onPress : () => {
            const logoutFunction = async () => {
              setIsLoggedIn(false)
              setIsSignedUp(false)
              await AsyncStorage.removeItem("user_id")
              await AsyncStorage.removeItem("userName")
              await AsyncStorage.removeItem("mobileNumber")
              navigation.navigate("Login")
              setUserStatesFromProfile([])
          }
          (async () => logoutFunction())()
          }
        },
        {
          text : "Cancel",
          onPress : () => null
        }
      ]
    )
}

  return (
    <Drawer.Navigator
      drawerContent={(props) => {
        return (
          <SafeAreaView>
            <View
              style={{
                height: 200,
                width: "100%",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: COLORS.white,
              }}
            >
              <Image
                source={{uri : `${cdnLink}/truckmessage_round.png`}}
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 999,
                  marginBottom: 12,
                }}
              />
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "bold",
                  color: COLORS.brand,
                  marginBottom: 6,
                }}
              >
                {userName}
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  color: COLORS.black,
                }}
              >
               {mobileNumber}
              </Text>
            </View>
            <DrawerItemList {...props} />
            <DrawerItem
            label="Logout"
            labelStyle={{color:COLORS.black,padding:0,marginLeft:-6}}
            onPress={handleLogout}
            icon={({ color, size }) => (
              <Ionicons name="power-outline" size={size} color={COLORS.brand} />
            )}
          />
          </SafeAreaView>
        );
      }}
      screenOptions={{
        drawerStyle: {
          backgroundColor: COLORS.white,
          width: 250,
        },
        headerStyle: {
          backgroundColor: COLORS.white,
        },
        headerShown: false,
        headerTintColor: COLORS.black,
        drawerLabelStyle: {
          color: COLORS.black,
          fontSize: 14,
          marginLeft: -10,
        },
      }}
    >
      <Drawer.Screen
        name="DrawerHome"
        options={{
          drawerLabel: "Home",
          title: "Home",
          headerShadowVisible: false,
          drawerIcon: () => (
            <Ionicons name="home-outline" size={24} color={COLORS.brand} />
          ),
        }}
        component={BottomTabNavigation}
      />
      <Drawer.Screen
        name="DrawerMyPost"
        options={{
          drawerLabel: "My Posts",
          title: "MyPosts",
          headerShadowVisible: false,
          drawerIcon: () => (
            <Ionicons name="mail-open-outline" size={24} color={COLORS.brand} />
          ),
        }}
        component={Refer}
      />
       {/* <Drawer.Screen
        name="DrawerLanguage"
        options={{
          drawerLabel: "Language",
          title: "Language",
          headerShadowVisible: false,
          drawerIcon: () => (
            <Ionicons name="language-sharp" size={24} color={COLORS.brand} />
          ),
        }}
        component={Language}
      /> */}
      <Drawer.Screen
        name="DrawerAboutUs"
        options={{
          drawerLabel: "About Us",
          title: "AboutUs",
          headerShadowVisible: false,
          drawerIcon: () => (
            <Ionicons name="business-outline" size={24} color={COLORS.brand} />
          ),
        }}
        component={AboutUs}
      />
      <Drawer.Screen
        name="DrawerBlogs"
        options={{
          drawerLabel: "Blogs",
          title: "Blogs",
          headerShadowVisible: false,
          drawerIcon: () => (
            <Ionicons name="chatbox-ellipses-outline" size={24} color={COLORS.brand} />
          ),
        }}
        component={Blogs}
      />

      <Drawer.Screen
        name="DrawerTermsAndCondition"
        options={{
          drawerLabel: "Terms",
          title: "TermsAndCondition",
          headerShadowVisible: false,
          drawerIcon: () => (
            <Ionicons name="alert-circle-outline" size={24} color={COLORS.brand} />
          ),
        }}
        component={TermsAndCondition}
      />

     

      {/* <Drawer.Screen
        name="DrawerLogout"
        
        options={{
          drawerLabel: "Logout",
          title: "Logout",
          headerShadowVisible: false,
          drawerIcon: () => (
            <Ionicons name="power-outline" size={24} color={COLORS.brand} />
          ),
        
        }}
        
        
        component={Logout}
        
      /> */}
          
    </Drawer.Navigator>
  );
};

export default DrawerNavigation;