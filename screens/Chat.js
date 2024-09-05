import { View, Text, TouchableOpacity, Image, StyleSheet, TextInput } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { COLORS, icons, images, SIZES } from '../constants';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, FontAwesome } from '@expo/vector-icons';
import { Bubble, GiftedChat } from 'react-native-gifted-chat';
import { useNavigation } from '@react-navigation/native';
import { LoadNeedsContext } from '../hooks/LoadNeedsContext';
import EvilIcons from '@expo/vector-icons/EvilIcons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Chat = ({ username }) => {

  const navigation = useNavigation();
  const {
    currentUser,
    setCurrentUser,
    messageReceiver,
    setMessageReceiver
  } = useContext(LoadNeedsContext);

  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");

  useEffect(() => {
    const getChatMessages = async () => {
      try {
        const userIdParams = {
          user_id: await AsyncStorage.getItem("user_id"),
          person_id: messageReceiver.person_id,
        };

        const response = await axios.post('https://truck.truckmessage.com/get_user_chat_message_list', userIdParams);
       
        // Transform the API response
        const transformedMessages = transformMessages(response.data.data);

        // Set the transformed messages in the state
        setMessages(transformedMessages);

      } catch (err) {
        console.log(err);
      }
    };

    (async () => getChatMessages())();
  }, [messageReceiver]);

  const transformMessages = (apiMessages) => {
    return apiMessages.map(msg => ({
      _id: msg.id,
      text: msg.message,
      createdAt: msg.updt,
      user: {
        _id: msg.sender_id,
        name: msg.sender_name,
        avatar: msg.sender_avatar,
      }
    }));
  };

  const handleInputText = (text) => {
    setInputMessage(text);
  };

  const renderMessage = (props) => {
    const { currentMessage } = props;

    // Check if the message is from the current user or the opposite user
    const isCurrentUser = currentMessage.user._id === 1;

    return (
      <View
        style={{
          flex: 1,
          flexDirection: isCurrentUser ? 'row-reverse' : 'row', // Align right or left based on user
          justifyContent: isCurrentUser ? 'flex-end' : 'flex-start',
          marginVertical: 8,
        }}
      >
        <Bubble
          {...props}
          wrapperStyle={{
            right: {
              backgroundColor: isCurrentUser ? COLORS.primary : 'lightgrey',
              borderRadius: 20,
              marginHorizontal: 12,
            },
            left: {
              backgroundColor: isCurrentUser ? 'lightgrey' : COLORS.secondaryWhite,
              borderRadius: 20,
              marginHorizontal: 12,
            },
          }}
          textStyle={{
            right: {
              color: isCurrentUser ? COLORS.white : COLORS.black,
              fontSize: 14,
            },
            left: {
              color: isCurrentUser ? COLORS.black : COLORS.black,
              fontSize: 14,
            },
          }}
        />
      </View>
    );
  };

  const receiveOppositeMessage = () => {
    let CurrentTime = new Date().getTime();

    let message = {
      _id: Math.random().toString(36).substring(7),
      text: "This is a reply from the opposite user",
      createdAt: CurrentTime,
      user: { _id: 2 }
    };
    setMessages((prevMessage) =>
      GiftedChat.append(prevMessage, [message])
    );
  };

  const handleSendClick = async () => {
    try {
      let CurrentTime = new Date().getTime();

      const response = await axios.post('https://truck.truckmessage.com/user_chat_message', {
        user_id: await AsyncStorage.getItem("user_id"),
        person_id: messageReceiver.person_id,
        message: inputMessage,
      });

      let message = {
        _id: Math.random().toString(36).substring(7),
        text: inputMessage,
        createdAt: CurrentTime,
        user: { _id: 1 }
      };

      setMessages((prevMessage) =>
        GiftedChat.append(prevMessage, [message])
      );

      setInputMessage("");


    } catch (err) {
      console.log(err);
    }
  };

  return (
    <SafeAreaView style={{ backgroundColor: COLORS.white, flex: 1 }}>

      {/* Render header */}
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 16,
        borderBottomColor: 'grey',
        borderBottomWidth: 0.2,
      }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{ marginHorizontal: 12 }}
          >
            <Image
              source={icons.arrowLeft}
              style={{
                width: 24,
                height: 24,
                tintColor: COLORS.black
              }}
            />
          </TouchableOpacity>

          <View>
            <Image
              source={require("../assets/images/apple.png")}
              resizeMode='contain'
              style={{
                width: 48,
                height: 48,
                borderRadius: 999
              }}
            />
            <View style={{
              position: 'absolute',
              width: 10,
              height: 10,
              backgroundColor: COLORS.primary,
              bottom: 0,
              right: 4,
              borderRadius: 5,
              borderWidth: 2,
              borderColor: 'white',
              zIndex: 999
            }} />
          </View>

          <View style={{ marginLeft: 16 }}>
            <Text style={{
              fontSize: 14,
              marginBottom: 2
            }}>{messageReceiver.profile_name}</Text>
            <Text style={{
              fontSize: 10,
              color: COLORS.primary
            }}>Online</Text>
          </View>
        </View>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <TouchableOpacity>
            <EvilIcons name="refresh" size={30} color="black" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Render chat */}
      <GiftedChat
        messages={messages}
        renderInputToolbar={() => { return null }}
        user={{ _id: 1 }}
        minInputToolbarHeight={0}
        renderMessage={renderMessage}
      />

      {/* Render input bar */}
      <View style={styles.inputContainer}>
        <View style={styles.inputMessageContainer}>
          <TextInput
            style={styles.input}
            placeholder='Type here..'
            placeholderTextColor="grey"
            multiline
            numberOfLines={3}
            value={inputMessage}
            onChangeText={handleInputText}
          />
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
            <TouchableOpacity style={{ marginHorizontal: 10 }}>
              <Image
                source={icons.camera}
                resizeMode='contain'
                style={{
                  width: 20,
                  height: 20,
                }}
              />
            </TouchableOpacity>
            <TouchableOpacity style={{ marginHorizontal: 10 }}>
              <Image
                source={icons.stickyNote}
                resizeMode='contain'
                style={{
                  width: 20,
                  height: 20
                }}
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.sendBtn}
            onPress={handleSendClick}
          >
            <FontAwesome
              name='send'
              size={24}
              style={{
                color: COLORS.primary,
              }}
            />
          </TouchableOpacity>

        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    height: 72,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputMessageContainer: {
    height: 54,
    backgroundColor: COLORS.secondaryWhite,
    flexDirection: 'row',
    alignItems: 'center',
    width: SIZES.width - 28,
    borderRadius: 16,
    borderColor: 'rgba(128,128,128,0.4)',
    borderWidth: 1,
  },
  input: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 3,
  },
  sendBtn: {
    backgroundColor: COLORS.secondaryWhite,
    marginHorizontal: 6,
    padding: 4,
    borderRadius: 999
  }
});

export default Chat;
