import React, { useState } from "react";
import { View, Text, Image, StyleSheet, FlatList, Alert, BackHandler } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "../../constants";
import DropDownPicker from "react-native-dropdown-picker";
import HeaderWithoutNotifications from "../../components/HeaderWithoutNotifications";
import { useFocusEffect } from "@react-navigation/native";

const Blogs = () => {
  const [selectedValue, setSelectedValue] = useState(null);
  const [open, setOpen] = useState(false);
  
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

  const posts = [
    {
      id: 1,
      userId: 1,
      username: "User 1",
      avatarUrl: "https://bootdey.com/img/Content/avatar/avatar2.png",
      date: "May 18, 2023",
      description: "This is a post description",
      imageUrl: "https://www.bootdey.com/image/580x520/FF00FF/000000",
    },
    {
      id: 2,
      userId: 2,
      username: "User 2",
      avatarUrl: "https://bootdey.com/img/Content/avatar/avatar6.png",
      date: "May 17, 2023",
      description: "Another post",
      imageUrl: null,
    },
    {
      id: 3,
      userId: 1,
      username: "User 1",
      avatarUrl: "https://bootdey.com/img/Content/avatar/avatar3.png",
      date: "May 18, 2023",
      description: "This is a post description",
      imageUrl: "https://www.bootdey.com/image/580x520/32CD32/000000",
    },
  ];

  const PostCard = ({ post }) => (
    <View style={styles.postCard}>
      <View style={styles.postHeader}>
        <Image source={{ uri: post.avatarUrl }} style={styles.postAvatar} />
        <Text style={styles.postUsername}>{post.username}</Text>
        <Text style={styles.postDate}>{post.date}</Text>
      </View>
      <Text style={styles.postDescription}>{post.description}</Text>
      {post.imageUrl && (
        <Image source={{ uri: post.imageUrl }} style={styles.postImage} />
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <HeaderWithoutNotifications title="Blogs" />
      <View style={styles.content}>
        <DropDownPicker
          open={open}
          value={selectedValue}
          items={[
            { label: "Tamil", value: "Tamil" },
            { label: "English", value: "English" },
            { label: "Malayalam", value: "Malayalam" },
            { label: "Hindi", value: "Hindi" },
            { label: "Telugu", value: "Telugu" },
            { label: "Kannada", value: "Kannada" },
          ]}
          setOpen={setOpen}
          setValue={(value) => {
            setSelectedValue(value);
          }}
          placeholder="Select your language"
          containerStyle={styles.dropdownContainer}
          style={styles.dropdown}
          dropDownStyle={styles.dropdownStyle}
          onChangeItem={(item) => setSelectedValue(item.value)}
        />
        <FlatList
          data={posts}
          contentContainerStyle={styles.postListContainer}
          keyExtractor={(post) => post.id.toString()}
          renderItem={({ item }) => <PostCard post={item} />}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
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
