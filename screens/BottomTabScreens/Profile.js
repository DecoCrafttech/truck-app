import React, { useState } from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity, Modal, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../../constants"
import VehicleProfileDetails from "./VehicleProfileDetails";
import HeaderWithoutNotifications from "../../components/HeaderWithoutNotifications";
import ProfileTopContainer from "./ProfileTopContainer";

const Profile = () => {

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <HeaderWithoutNotifications title="Profile" />

        <ProfileTopContainer />

        <VehicleProfileDetails />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

});

export default Profile;
