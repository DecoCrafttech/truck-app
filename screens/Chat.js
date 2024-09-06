import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { GiftedChat, Bubble } from "react-native-gifted-chat";
import { useNavigation } from "@react-navigation/native";
import { COLORS, icons, SIZES } from "../constants";
import { LoadNeedsContext } from "../hooks/LoadNeedsContext";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import FontAwesome from "@expo/vector-icons/FontAwesome";

const Chat = () => {
  const navigation = useNavigation();
  const { currentUser, messageReceiver } = useContext(LoadNeedsContext);

  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");

 

  useEffect(() => {

    const fetchChatMessages = async () => {
      try {
        const userId = await AsyncStorage.getItem("user_id");
        const response = await axios.post(
          "https://truck.truckmessage.com/get_user_chat_message_list",
          {
            user_id: userId,
            person_id: messageReceiver?.person_id,
          }
        );
        
        const transformedMessages = response.data.data.map((msg, index) => ({
          _id: index,
          text: msg.message,
          createdAt: new Date(msg.updt),
          user: {
            _id: msg.chat_id === parseInt(userId) ? 1 : 2,
            name:
              msg.chat_id === parseInt(userId)
                ? "You"
                : messageReceiver?.profile_name || "Unknown",
            avatar:
              msg.chat_id === parseInt(userId)
                ? currentUser?.avatar || null
                : messageReceiver?.avatar || null,
          },
        }));
  
        setMessages(transformedMessages);
      } catch (err) {
        console.error(err);
      }
    };
  

    fetchChatMessages();

    // if (messageReceiver && currentUser) {
      
    // }
  }, [messageReceiver, currentUser]);

  const handleInputText = (text) => setInputMessage(text);

  const handleSendClick = async () => {
    try {
      const userId = await AsyncStorage.getItem("user_id");
      const currentTime = new Date().getTime();

      await axios.post("https://truck.truckmessage.com/user_chat_message", {
        user_id: userId,
        person_id: messageReceiver.person_id,
        message: inputMessage,
      });

      const newMessage = {
        _id: Math.random().toString(36).substring(7),
        text: inputMessage,
        createdAt: currentTime,
        user: { _id: 1 },
      };

      setMessages((prevMessages) => GiftedChat.append(prevMessages, [newMessage]));
      setInputMessage("");
    } catch (err) {
      console.error(err);
    }
  };

  const renderMessage = (props) => {
    const { currentMessage } = props;
    const isCurrentUser = currentMessage.user._id === 1;

    return (
      <View
        style={{
          flex: 1,
          flexDirection: isCurrentUser ? "row-reverse" : "row",
          justifyContent: isCurrentUser ? "flex-end" : "flex-start",
          marginVertical: 8,
        }}
      >
        <Bubble
          {...props}
          wrapperStyle={{
            right: {
              backgroundColor: COLORS.primary,
              borderRadius: 20,
              marginHorizontal: 12,
            },
            left: {
              backgroundColor: COLORS.secondaryWhite,
              borderRadius: 20,
              marginHorizontal: 12,
            },
          }}
          textStyle={{
            right: {
              color: COLORS.white,
              fontSize: 14,
            },
            left: {
              color: COLORS.black,
              fontSize: 14,
            },
          }}
        />
      </View>
    );
  };

  return (
    <SafeAreaView style={{ backgroundColor: COLORS.white, flex: 1 }}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBackBtn}>
            <Image
              source={icons.arrowLeft}
              style={styles.headerBackIcon}
            />
          </TouchableOpacity>
          <View>
            <Image
              source={require("../assets/images/apple.png")}
              resizeMode="contain"
              style={styles.headerAvatar}
            />
            <View style={styles.headerOnlineIndicator} />
          </View>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerName}>{messageReceiver.profile_name}</Text>
            <Text style={styles.headerStatus}>Online</Text>
          </View>
        </View>
        <TouchableOpacity>
          <EvilIcons name="refresh" size={30} color="black" />
        </TouchableOpacity>
      </View>

      {/* Chat */}
      <GiftedChat
        messages={messages}
        renderInputToolbar={() => null}
        user={{ _id: 1 }}
        minInputToolbarHeight={0}
        renderMessage={renderMessage}
      />

      {/* Input Bar */}
      <View style={styles.inputContainer}>
        <View style={styles.inputMessageContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type here.."
            placeholderTextColor="grey"
            multiline
            numberOfLines={3}
            value={inputMessage}
            onChangeText={handleInputText}
          />
          <View style={styles.inputIcons}>
            <TouchableOpacity style={styles.iconBtn}>
              <Image source={icons.camera} style={styles.icon} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn}>
              <Image source={icons.stickyNote} style={styles.icon} />
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.sendBtn} onPress={handleSendClick}>
            <FontAwesome name="send" size={24} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomColor: "grey",
    borderBottomWidth: 0.2,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerBackBtn: {
    marginHorizontal: 12,
  },
  headerBackIcon: {
    width: 24,
    height: 24,
    tintColor: COLORS.black,
  },
  headerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 999,
  },
  headerOnlineIndicator: {
    position: "absolute",
    width: 10,
    height: 10,
    backgroundColor: COLORS.primary,
    bottom: 0,
    right: 4,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: "white",
    zIndex: 999,
  },
  headerTextContainer: {
    marginLeft: 16,
  },
  headerName: {
    fontSize: 14,
    marginBottom: 2,
  },
  headerStatus: {
    fontSize: 10,
    color: COLORS.primary,
  },
  inputContainer: {
    height: 72,
    alignItems: "center",
    justifyContent: "center",
  },
  inputMessageContainer: {
    height: 54,
    backgroundColor: COLORS.secondaryWhite,
    flexDirection: "row",
    alignItems: "center",
    width: SIZES.width - 28,
    borderRadius: 16,
    borderColor: "rgba(128,128,128,0.4)",
    borderWidth: 1,
  },
  input: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 3,
  },
  inputIcons: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconBtn: {
    marginHorizontal: 10,
  },
  icon: {
    width: 20,
    height: 20,
  },
  sendBtn: {
    backgroundColor: COLORS.secondaryWhite,
    marginHorizontal: 6,
    padding: 4,
    borderRadius: 999,
  },
});

export default Chat;
