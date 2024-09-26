import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View, Image } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, SIZES } from "../../constants";
import HeaderWithoutNotifications from "../../components/HeaderWithoutNotifications";
import { LoadNeedsContext } from "../../hooks/LoadNeedsContext";
import Ionicons from '@expo/vector-icons/Ionicons';
import images from '../../constants/images.js';
import icons from '../../constants/icons.js';
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";


const Message = () => {

  const navigation = useNavigation()

  const {
    currentUser,
    setCurrentUser,
    messageReceiver,
    setMessageReceiver,
    pageRefresh,
    setPageRefresh
  } = useContext(LoadNeedsContext)



  const [search, setSearch] = useState("")
  const [allPersons, setAllPersons] = useState([])
  const [filteredUsers, setFilteredUsers] = useState([]);


  const getChatList = async () => {
    try{
      const userIdParams = {
        user_id : await AsyncStorage.getItem("user_id")
      }
      const response = await axios.post('https://truck.truckmessage.com/get_user_chat_list', userIdParams);
   
      setAllPersons(response.data.data)
      setFilteredUsers(response.data.data)
    }catch(err){
      console.log(err)
    }
}

  useEffect(() => {

      getChatList()

  },[pageRefresh])

  const handleSearch = (text) => {
    setSearch(text)
    const filteredResult = allPersons.filter((value) => {
      return value.profile_name.toLowerCase().includes(text.toLowerCase())
    })
    setFilteredUsers(filteredResult)
  }

  const handleNavigateToChat = (item) => {
    console.log(item)
    navigation.navigate("Chat")
    setMessageReceiver(item)
  }


  const renderItem = ({ item, index }) => {
    return (
      <View >
        <TouchableOpacity
          key={index}
          onPress={() => handleNavigateToChat(item)}
          style={[
            styles.userContainer,
            styles.oddBackground
          ]}
        >
          <View style={styles.userImageContainer}>
            {item.isOnline && item.isOnline === true && (
              <View style={styles.onlineIndicator} />
            )}
            <Image
              source={{uri: item.profile_image_name}}
              resizeMode='contain'
              style={styles.userImage}
            />
          </View>

          <View style={{
            flexDirection: 'row',
            width: SIZES.width - 104
          }}>
            <View style={styles.userInfoContainer}>
              <Text style={styles.fullName}>{item.profile_name}</Text>
              {/* <Text style={styles.lastMessage}>{item.lastMessage}</Text> */}
              <Text style={styles.lastMessage}>{item.last_msg}</Text>
            </View>

            <View style={{
              position: 'absolute',
              right: 4,
              alignItems: 'center',
            }}>
              <Text style={styles.lastMessageTime}>{item.last_time}</Text>
              {/* {
                item.messageInQueue !== 0 && (
                  <TouchableOpacity style={{
                    width: 20,
                    height: 20,
                    borderRadius: 10,
                    backgroundColor: COLORS.primary,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: 12
                  }}>
                    <Text style={styles.messageInQueue}>{item.messageInQueue}</Text>
                  </TouchableOpacity>
                )
              } */}
            </View>
          </View>
        </TouchableOpacity>
      </View>
    )
  }



  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
      <View style={{ flex: 1, backgroundColor: COLORS.white }}>
        <HeaderWithoutNotifications title="Message" />

        {/* Chats */}
        <View style={{ marginBottom: 190 }}>
          <View style={styles.searchBar}>
            <TouchableOpacity >
              <Text>
                <Ionicons
                  name='search-outline'
                  size={24}
                  color='grey'
                />
              </Text>
            </TouchableOpacity>
            <TextInput
              style={styles.searchInput}
              placeholder='Search contact'
              value={search}
              onChangeText={handleSearch}
            >
            </TextInput>
            <TouchableOpacity>
              <Image
                source={icons.editPencil}
                style={{
                  width: 24,
                  height: 24,
                  tintColor: COLORS.gray
                }}
              />
            </TouchableOpacity>
          </View>

          {/* Render Flatlist for chats */}
          <View>
            <FlatList
              // data={filteredUsers}
              data={filteredUsers.sort((a, b) => a.last_time - b.last_time)}
              showsVerticalScrollIndicator={false}
              renderItem={renderItem}
              keyExtractor={(item, index) => `${item.person_id}_${index}`}  // Use a combination of person_id and index
              />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};




const styles = StyleSheet.create({
  area: {
    flex: 1,
    backgroundColor: COLORS.secondaryGray
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.secondaryWhite,
    padding: 16,
  },
  searchBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 12,
    marginHorizontal: 'auto',
    paddingHorizontal: 12,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    height: 50,
    width: SIZES.width - 32,
    borderRadius: 7,
  },
  searchInput: {
    flex: 1,
    height: "100%",
    marginHorizontal: 12,
  },
  userContainer: {
    width: "100%",
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: COLORS.secondaryWhite,
    borderBottomWidth: 1,
    marginHorizontal: 'auto',
    paddingHorizontal: 20,
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
  },
  fullName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.black,
    marginBottom: 4
  },
  lastMessage: {
    fontSize: 14,
    color: 'grey',
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


export default Message;
