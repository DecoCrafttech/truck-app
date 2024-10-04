import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "../../constants";
import HeaderWithOutBS from "../../components/HeaderWithOutBS";
import HeaderWithoutNotifications from "../../components/HeaderWithoutNotifications";

const Insurance = () => {
  return (
    <SafeAreaView style={styles.container}>
    <HeaderWithoutNotifications title="Insurance" />
         <View style={styles.container2}>
        <Text>Coming soon</Text>
    </View>
  </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  container2: {
    flex: 1,
    backgroundColor: COLORS.white,
    justifyContent : 'center',
    alignItems:'center'
  },
  
});
export default Insurance;
