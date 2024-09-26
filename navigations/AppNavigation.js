import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import DrawerNavigation from "./DrawerNavigation";
import SellYourTruck from "../screens/SellYourTruck";
import MarketPlace from "../screens/MarketPlace/MarketPlace";
import { LoadNeeds, DriverNeeds } from "../screens";
import VaughanInfo from "../screens/VaughanInfo/VaughanInfo";
import AvailableLoads from "../screens/AvailabaleLoads/AvailableLoads";
import AvailableDrivers from "../screens/AvailableDrivers/AvailableDrivers";
import AvailableTruck from "../screens/AvailableTruck/AvailableTruck";
import TruckNeeds from "../screens/TruckNeeds";
import MileageCalculator from "../screens/MileageCalculator/MilegaeCalculator";
import Fastag from "../screens/Fastag/Fastag";
import Insurance from "../screens/Insurance/Insurance";
import TollCalculator from "../screens/TollCalculator/TollCalculator";
import FuelPrice from "../screens/FuelPrice/FuelPrice";
import Toast from "react-native-toast-message";
import LoadExpenseCalculator from "../screens/VaughanInfo/LoadExpenseCalculator";
import TruckDetail from "../screens/TruckDetail";
import ViewFullDetails from "../screens/BottomTabScreens/ViewFullDetails";
import SignUp from "../screens/SignUp";
import Login from "../screens/Login";
import OTPVerification from "../screens/OTPVerification";
import Chat from "../screens/Chat";
import ForgotPassword from "../screens/ForgotPassword";
import ResetPasswordOTPVerification from "../screens/ResetPasswordOTPVerification";
import ResetPassword from "../screens/ResetPassword";

const Stack = createNativeStackNavigator();
Login
const AppNavigation = () => {
  return (
    <NavigationContainer>
      <Toast />
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName="Main"
      >

        <Stack.Screen name="SignUp" component={SignUp} />

        <Stack.Screen name="Login" component={Login} />

        <Stack.Screen name="ForgotPassword" component={ForgotPassword} />

        <Stack.Screen name="OTPVerification" component={OTPVerification} />

        <Stack.Screen name="ResetPasswordOTPVerification" component={ResetPasswordOTPVerification} />
        
        <Stack.Screen name="ResetPassword" component={ResetPassword} />

        <Stack.Screen name="Main" component={DrawerNavigation} />
        {/* <Stack.Screen name="Main" component={PhoneNumber} /> */}

        <Stack.Screen
          name="MarketPlace"
          component={MarketPlace}
          options={{ title: "Market Place" }}
        />

        <Stack.Screen
          name="SellYourTruck"
          component={SellYourTruck}
          options={{ title: "Sell Your Truck" }}
        />
        <Stack.Screen
          name="LoadNeeds"
          component={LoadNeeds}
          options={{ title: "Load Needs" }}
        />
        <Stack.Screen
          name="DriverNeeds"
          component={DriverNeeds}
          options={{ title: "Driver Needs" }}
        />
        <Stack.Screen
          name="TruckNeeds"
          component={TruckNeeds}
          options={{ title: "Truck Needs" }}
        />
        <Stack.Screen
          name="TruckDetails"
          component={TruckDetail}
          options={{ title: "Truck Details" }}
        />
        <Stack.Screen
          name="AvailableLoads"
          component={AvailableLoads}
          options={{ title: "Acailable Loads" }}
        />
        <Stack.Screen
          name="AvailableDrivers"
          component={AvailableDrivers}
          options={{ title: "Available Drivers" }}
        />
        <Stack.Screen
          name="AvailableTrucks"
          component={AvailableTruck}
          options={{ title: "Available Trucks" }}
        />
        <Stack.Screen
          name="VaughanInfo"
          component={VaughanInfo}
          options={{ title: "Vaughan Info" }}
        />
        <Stack.Screen
          name="MileageCalculator"
          component={MileageCalculator}
          options={{ title: "Mileage Calculator" }}
        />
        <Stack.Screen
          name="Fastag"
          component={Fastag}
          options={{ title: "Fastag" }}
        />
        <Stack.Screen
          name="Insurance"
          component={Insurance}
          options={{ title: "Insurance" }}
        />
        <Stack.Screen
          name="TollCalculator"
          component={TollCalculator}
          options={{ title: "TollCalculator" }}
        />
        <Stack.Screen
          name="FuelPrice"
          component={FuelPrice}
          options={{ title: "Fuel Price" }}
        />
        <Stack.Screen
          name="LoadExpenseCalculator"
          component={LoadExpenseCalculator}
          options={{ title: "Load Expense Calculator" }}
        />
        <Stack.Screen
          name="ViewFullDetails"
          component={ViewFullDetails}
          options={{ title: "View Full Truck Details" }}
        />
        <Stack.Screen
          name='Chat'
          component={Chat}
          options={{ title: "Chat" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigation;
