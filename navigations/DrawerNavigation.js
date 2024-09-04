import { View, Text, Image, BackHandler, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import {
  DrawerItem,
  DrawerItemList,
  createDrawerNavigator,
} from "@react-navigation/drawer";
import { COLORS, images } from "../constants";
import { Ionicons } from "@expo/vector-icons";
import BottomTabNavigation from "./BottomTabNavigation";
import { SafeAreaView } from "react-native-safe-area-context";
import Refer from "../screens/DrawerNavigationScreens/Refer";
import Language from "../screens/DrawerNavigationScreens/Language";
import AboutUs from "../screens/DrawerNavigationScreens/AboutUs";
import Blogs from "../screens/DrawerNavigationScreens/Blogs";
import TermsAndCondition from "../screens/DrawerNavigationScreens/TermsAndCondition";
import Logout from "../screens/Logout";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Drawer = createDrawerNavigator();
const DrawerNavigation = () => {

  const navigation = useNavigation()

  const [userName,setUserName] = useState("")
  const [mobileNumber,setMobileNumber] = useState("")
  
  useEffect(() => {
      const fun = async () => {
        const name = 
        setUserName(await AsyncStorage.getItem("userName"))
        setMobileNumber(await AsyncStorage.getItem("mobileNumber"))
      }
      fun()
  },[])

  const handleLogout = async () => {

    Alert.alert("Logout","Are you sure want to logout?",
      [
        {
          text : "Yes",
          onPress : () => {
            const logoutFunction = async () => {
              await AsyncStorage.removeItem("user_id")
              await AsyncStorage.removeItem("userName")
              await AsyncStorage.removeItem("mobileNumber")
              navigation.navigate("Login")
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
                source={require("../assets/images/app-logo.png")}
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
       <Drawer.Screen
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
      />
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