import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View, Image } from "react-native";
import React, { useContext, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, SIZES } from "../../constants";
import HeaderWithoutNotifications from "../../components/HeaderWithoutNotifications";
import { LoadNeedsContext } from "../../hooks/LoadNeedsContext";
import Ionicons from '@expo/vector-icons/Ionicons';
import images from '../../constants/images.js';
import icons from '../../constants/icons.js';
import { useNavigation } from "@react-navigation/native";


const Message = () => {

  const navigation = useNavigation()

  const {
    currentUser,
    setCurrentUser
  } = useContext(LoadNeedsContext)

  const messagesData = [
    {
      id: "1",
      fullName: "Jhon Smith",
      isOnline: false,
      userImg: images.user1,
      lastSeen: "2023-11-16T04:52:06.501Z",
      lastMessage: 'See you soon baby',
      messageInQueue: 2,
      lastMessageTime: "12:25 PM",
    },
    {
      id: "2",
      fullName: "Anuska Sharma",
      isOnline: true,
      userImg: images.user2,
      lastSeen: "2023-11-18T04:52:06.501Z",
      lastMessage: 'I Know. you are so busy man.',
      messageInQueue: 0,
      lastMessageTime: "12:15 PM",
    },
    {
      id: "3",
      fullName: "Virat Kohili",
      isOnline: true,
      userImg: images.user3,
      lastSeen: "2023-11-20T04:52:06.501Z",
      lastMessage: 'Ok, see u soon',
      messageInQueue: 0,
      lastMessageTime: "09:12 PM",
    },
    {
      id: "4",
      fullName: "Shikhor Dhaon",
      isOnline: false,
      userImg: images.user4,
      lastSeen: "2023-11-18T04:52:06.501Z",
      lastMessage: 'Great! Do you Like it.',
      messageInQueue: 0,
      lastMessageTime: "04:12 PM",
    },
    {
      id: "5",
      fullName: "Shakib Hasan",
      isOnline: false,
      userImg: images.user5,
      lastSeen: "2023-11-21T04:52:06.501Z",
      lastMessage: 'Thank you !',
      messageInQueue: 2,
      lastMessageTime: "10:30 AM",
    },
    {
      id: "6",
      fullName: "Jacksoon",
      isOnline: false,
      userImg: images.user6,
      lastSeen: "2023-11-20T04:52:06.501Z",
      lastMessage: 'Do you want to go out dinner',
      messageInQueue: 3,
      lastMessageTime: "10:05 PM",
    },
    {
      id: "7",
      fullName: "Tom Jerry",
      userImg: images.user7,
      lastSeen: "2023-11-20T04:52:06.501Z",
      lastMessage: 'Do you want to go out dinner',
      messageInQueue: 2,
      lastMessageTime: "11:05 PM",
      isOnline: true
    },
    {
      id: "8",
      fullName: "Lucky Luck",
      isOnline: false,
      userImg: images.user8,
      lastSeen: "2023-11-20T04:52:06.501Z",
      lastMessage: 'Can you share the design with me?',
      messageInQueue: 2,
      lastMessageTime: "09:11 PM",
    },
    {
      id: "9",
      fullName: "Nate Jack",
      userImg: images.user9,
      lastSeen: "2023-11-20T04:52:06.501Z",
      lastMessage: 'Tell me what you want?',
      messageInQueue: 0,
      lastMessageTime: "06:43 PM",
      isOnline: true
    },
    {
      id: "10",
      fullName: "Nate Jack",
      userImg: images.user9,
      lastSeen: "2023-11-20T04:52:06.501Z",
      lastMessage: 'Tell me what you want?',
      messageInQueue: 0,
      lastMessageTime: "06:43 PM",
      isOnline: true
    },
    {
      id: "11",
      fullName: "Nate Jack",
      userImg: images.user9,
      lastSeen: "2023-11-20T04:52:06.501Z",
      lastMessage: 'Tell me what you want?',
      messageInQueue: 0,
      lastMessageTime: "06:43 PM",
      isOnline: true
    },
    {
      id: "12",
      fullName: "Nate Jack",
      userImg: images.user9,
      lastSeen: "2023-11-20T04:52:06.501Z",
      lastMessage: 'Tell me what you want?',
      messageInQueue: 0,
      lastMessageTime: "06:43 PM",
      isOnline: true
    },
  ]

  const [search, setSearch] = useState("")
  const [filteredUsers, setFilteredUsers] = useState(messagesData);

  const handleSearch = (text) => {
    console.log(text)
    setSearch(text)
    const filteredResult = messagesData.filter((value) => {
      return value.fullName.toLowerCase().includes(text.toLowerCase())
    })
    setFilteredUsers(filteredResult)
  }

  const handleNavigateToChat = (item) => {
    console.log(item)
    navigation.navigate("Chat", { username: item.fullName })
    setCurrentUser(item)
  }


  const renderItem = ({ item, index }) => {
    return (
      <>
        <TouchableOpacity
          key={index}
          onPress={() => handleNavigateToChat(item)}
          style={[
            styles.userContainer,
            index % 2 !== 0 ? styles.oddBackground : null,
          ]}
        >
          <View style={styles.userImageContainer}>
            {item.isOnline && item.isOnline === true && (
              <View style={styles.onlineIndicator} />
            )}
            <Image
              source={item.userImg}
              resizeMode='contain'
              style={styles.userImage}
            />
          </View>

          <View style={{
            flexDirection: 'row',
            width: SIZES.width - 104
          }}>
            <View style={styles.userInfoContainer}>
              <Text style={styles.fullName}>{item.fullName}</Text>
              <Text style={styles.lastMessage}>{item.lastMessage}</Text>
            </View>

            <View style={{
              position: 'absolute',
              right: 4,
              alignItems: 'center',
            }}>
              <Text style={styles.lastMessageTime}>{item.lastMessageTime}</Text>
              {
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
              }
            </View>
          </View>
        </TouchableOpacity>
      </>
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
              data={filteredUsers}
              showsVerticalScrollIndicator={false}
              renderItem={renderItem}
              keyExtractor={(value) => value.id.toString()}
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
    paddingHorizontal: 20
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
