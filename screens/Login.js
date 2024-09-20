import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, Button, Image, BackHandler, Alert } from 'react-native'
import React, { useContext, useRef, useState } from 'react'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import Checkbox from 'expo-checkbox';
import { Pressable } from 'react-native';
import axios from 'axios';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { COLORS } from '../constants';
import Container, { Toast } from 'toastify-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axiosInstance from '../services/axiosInstance';
import { LoadNeedsContext } from '../hooks/LoadNeedsContext';






const Login = () => {

    const inputRef = useRef("")

    const {
        isLoggedIn,
        setIsLoggedIn
      } = useContext(LoadNeedsContext)

    const navigation = useNavigation()

    const [inputs, setInputs] = useState({
        mobileNumber: "",
        password: "",
    })

    const [currentPage, setCurrentPage] = useState('login')

    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [isChecked, setIsChecked] = useState(false)


    useFocusEffect(
        React.useCallback(() => {
            BackHandler.addEventListener('hardwareBackPress', handleBackPress)

            return () => {
                BackHandler.removeEventListener('hardwareBackPress', handleBackPress)
            }
        })
    )

    const handleBackPress = () => {
        Alert.alert('Exit', 'Are you sure want to exit?',
            [
                {
                    text: 'Cancel',
                    onPress: () => null,
                    style: 'cancel'
                },
                {
                    text: 'Exit',
                    onPress: () => BackHandler.exitApp()
                }
            ]
        )
        return true
    }



    const handleChange = (name, value) => {
        setInputs((prevState) => ({
            ...prevState, [name]: value
        }))
    }


    const handleShowPassword = () => {
        setShowPassword(!showPassword)
    }




    const handleLogInClick = async (e) => {

        if (
            inputs.mobileNumber === "" ||
            inputs.password === ""
        ) {
            Toast.warn('Please fill all the details')
            return
        } else {
            const LogInParams = {
                "username": `${inputs.mobileNumber}`,
                "password": `${inputs.password}`
            }

            try {

                await AsyncStorage.setItem("mobileNumber", `${inputs.mobileNumber}`)


                // const response = await axiosInstance.post("/send_signup_otp", LogInParams)

                const response = await axios.post("https://truck.truckmessage.com/login", LogInParams)
                if (response.data.error_code === 0) {

                    setInputs({
                        mobileNumber: "",
                        password: "",
                    })
                    Toast.success(response.data.message)
                    await AsyncStorage.setItem("userName", `${response.data.data[0].first_name}`)
                    await AsyncStorage.setItem("user_id", `${response.data.data[0].id}`)
                    setIsLoggedIn(true);
                    navigation.navigate('Main')
                } else {
                    Toast.error(response.data.message)
                }
            } catch (err) {
                console.log(err)
            }
        }
    }

    const handleResetPassword = async () => {
        const resetPasswordPasswordParams = {
            "user_id": `${await AsyncStorage.getItem("user_id")}`,
        }

        try {

            const response = await axios.post("https://truck.truckmessage.com/send_forgot_pwd_otp", resetPasswordPasswordParams)

            if (response.data.error_code === 0) {
                Toast.success(response.data.message)
                navigation.navigate('ForgotPassword')
            } else {
                Toast.error(response.data.message)
            }
        } catch (err) {
            console.log(err)
        }
    }


    const [date, setDate] = useState(new Date());
    const [show, setShow] = useState(false);

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShow(Platform.OS === 'android');
        setDate(currentDate);
    };

    const showMode = (currentMode) => {
        setShow(!show);
    };




    return (
        <SafeAreaView style={[styles.container, { backgroundColor: '#fff' }]}>
            <Container
                position="footer"
                duration={3000}
                animationIn="slideInUp"
                animationOut="slideOutDown"
                height={60}
                width="100%"
                style={{ textAlign: 'center' }}
                textStyle={{ backgroundColor: '', fontSize: 14, }}
            />
            <View >
                {/* <StatusBar hidden /> */}
                {/* <View style={styles.pageHeadingContainer}>
                    <Text style={styles.pageHeading}>Login</Text>
                </View> */}



                {/* Login container */}
                <View style={styles.loginContainer}>
                    <View style={styles.avatarContainer}>
                        <Image
                            style={styles.avatar}
                            source={{uri : "https://ddyz8ollngqwo.cloudfront.net/truckmessage_round.png"}}
                        />
                    </View>

                    <View style={styles.pageHeadingContainer}>
                        <Text style={[styles.pageHeading]}>Login</Text>
                    </View>

                    <View style={styles.inputField}>
                        <View>
                            <Text style={styles.label}>Phone Number</Text>
                        </View>
                        <View style={styles.mobileNumberInputBox}>
                            <TextInput
                                placeholder='+91'
                                placeholderTextColor='grey'
                                readOnly
                                style={styles.contryCodeInput}></TextInput>
                            <TextInput
                                autoFocus
                                placeholder='Enter your mobile number'
                                placeholderTextColor='grey'
                                inputMode='numeric'
                                maxLength={10}
                                // maxLength={10}
                                style={styles.mobileNumberInput}
                                value={inputs.mobileNumber}
                                onChangeText={(value) => handleChange('mobileNumber', value)}
                            >
                            </TextInput>
                        </View>
                    </View>

                    <View>
                        <View>
                            <Text style={styles.label}>Password</Text>
                        </View>
                        <View style={[styles.passwordInputBox]}>
                            <TextInput
                                placeholder='Enter your password'
                                placeholderTextColor='grey'
                                style={[styles.input]}
                                secureTextEntry={showPassword ? false : true}
                                value={inputs.password}
                                onChangeText={(value) => handleChange('password', value)}
                            >
                            </TextInput>
                            <View style={{
                                position: "absolute",
                                right: 12,
                            }}>
                                <Pressable>
                                    {showPassword ?
                                        <Ionicons name="eye" size={30} color="black" onPress={() => handleShowPassword()} />
                                        :
                                        <Ionicons name="eye-off" size={30} color="black" onPress={() => handleShowPassword()} />
                                    }
                                </Pressable>
                            </View>
                        </View>
                    </View>

                    {/* <View style={{ marginTop: 30, marginHorizontal: 'auto', width: 300, justifyContent: 'center' }}>
                        <Button title='Login' onPress={handleLogInClick} />
                        <CustomButton title="Register" onPress={handleLogInClick} />
                    </View> */}

                    <View>
                        <TouchableOpacity style={styles.buttonContainer} onPress={handleLogInClick}>
                            <Text style={styles.buttonText}>Login</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginTop: 20,
                        justifyContent: 'center'
                    }}>
                        <Text style={{ textAlign: 'center' }}>
                            Forgot Password? {" "}
                        </Text>
                        <TouchableOpacity>
                            <Text
                                style={{ color: '#4285F4', fontWeight: 'bold', textDecorationLine: 'underline' }}
                                onPress={() => navigation.navigate("ForgotPassword")}
                            >Reset here</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginTop: 10,
                        justifyContent: 'center'
                    }}>
                        <Text style={{ textAlign: 'center' }}>
                            New user? {" "}
                        </Text>
                        <TouchableOpacity>
                            <Text
                                style={{ color: '#4285F4', fontWeight: 'bold', textDecorationLine: 'underline' }}
                                onPress={() => navigation.navigate('SignUp')}
                            >Sign up</Text>
                        </TouchableOpacity>
                    </View>

                </View>

            </View>



        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 22,
        width: "100%",
    },
    avatarContainer: {
        marginTop: 10,
        alignItems: 'center',
    },
    avatar: {
        width: 180,
        height: 180,
    },
    loginContainer: {
        padding: 22,
        borderRadius: 5,
        width: "100%",
    },
    pageHeading: {
        fontSize: 22,
        fontWeight: "bold",
        marginVertical: 12,
        marginBottom: 30,
        textAlign: 'left'
    },
    signupContainer: {
        marginHorizontal: 20,
        marginTop: 30
    },
    label: {
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 10
    },
    inputField: {
        marginBottom: 15,
    },
    inputBox: {
        width: "100%",
        height: 48,
        backgroundColor: "#fff",
        borderRadius: 5,
        borderColor: 'grey',
        borderWidth: 1
    },
    input: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingLeft: 15,
    },
    mobileNumberInputBox: {
        width: "100%",
        height: 48,
        backgroundColor: "#fff",
        borderRadius: 5,
        borderColor: 'grey',
        borderWidth: 1,
        flexDirection: 'row'
    },
    contryCodeInput: {
        width: "15%",
        alignItems: 'center',
        justifyContent: 'center',
        paddingLeft: 8,
        borderRightColor: 'grey',
        borderRightWidth: 1
    },
    mobileNumberInput: {
        width: "85%",
        alignItems: 'center',
        justifyContent: 'center',
        paddingLeft: 12,
    },
    passwordInputBox: {
        width: "100%",
        height: 48,
        backgroundColor: "#fff",
        borderRadius: 5,
        borderColor: 'grey',
        borderWidth: 1,
        justifyContent: 'center',
        // alignItems:'center'
    },
    buttonContainer: {
        backgroundColor: COLORS.primary,
        borderRadius: 5,
        paddingVertical: 15,
        alignItems: "center",
        marginTop: 30
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        textAlign: 'center',
        fontWeight: 'bold'
    },





})

export default Login