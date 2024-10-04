import React, { useState } from "react";
import { View, Text, Image, StyleSheet,  Alert, BackHandler } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "../../constants";
import HeaderWithoutNotifications from "../../components/HeaderWithoutNotifications";
import { useFocusEffect } from "@react-navigation/native";

const Blogs = () => {

  useFocusEffect(
    React.useCallback(() => {
       BackHandler.addEventListener('hardwareBackPress',handleBackPress)

       return() => {
         BackHandler.removeEventListener('hardwareBackPress',handleBackPress)
       }
    })
  )

  const handleBackPress = () => {
    Alert.alert('Exit App','Are you sure want to exit?',
      [
        {
          text : 'Cancel',
          onPress : () => null,
          style : 'cancel'
        },
        {
          text : 'Exit',
          onPress : () => BackHandler.exitApp()
        }
      ]
    )
    return true
  }



  return (
    <SafeAreaView style={styles.container}>
      <HeaderWithoutNotifications title="Blogs" />
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
  content: {
    flex: 1,
    backgroundColor: COLORS.gray,
    paddingHorizontal: 15,
    marginTop: 50,
  },
  dropdownContainer: {
    width: "100%",
    marginTop: 10,
  },
  dropdown: {
    backgroundColor: "#fafafa",
  },
  dropdownStyle: {
    backgroundColor: "#fafafa",
  },
  postListContainer: {
    paddingTop: 20,
  },
  postCard: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 5,
  },
  postHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  postAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
  },
  postUsername: {
    flex: 1,
  },
  postDate: {
    fontSize: 12,
    color: "#A9A9A9",
  },
  postDescription: {
    fontSize: 16,
    color: "#00008B",
  },
  postImage: {
    marginTop: 10,
    width: "100%",
    height: 200,
  },
});

export default Blogs;
