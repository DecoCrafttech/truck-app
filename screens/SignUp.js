import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, Button, Image, Alert } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import Checkbox from 'expo-checkbox';
import { Pressable } from 'react-native';
import axios from 'axios';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Dropdown } from 'react-native-element-dropdown';
import AntDesign from '@expo/vector-icons/AntDesign';
import CustomButton from '../components/CustomButton';
import Container, { Toast } from 'toastify-react-native';
import axiosInstance from '../services/axiosInstance';
import { citiesData, statesData } from '../constants/cityAndState';
import DropDownPicker from 'react-native-dropdown-picker';
import { FlatList } from 'react-native-web';
import MultiSelectComponent from '../components/MultiSelectComponent';
import { BackHandler } from 'react-native';
import { COLORS } from '../constants';









const SignUp = () => {

    const inputRef = useRef("")

    const navigation = useNavigation()

    const [inputs, setInputs] = useState({
        name: "",
        dob: "",
        mobileNumber: "",
        email : "",
        state: "",
        pincode : "",
        operatingCity: "",
        password: "",
        confirmPassword: "",
    })
    const [selectedCities, setSelectedCities] = useState([]);
    const [selectedStates, setSelectedStates] = useState([]);

    const [operatingCities,setOperatingCities] = useState([])
    const [operatingStates,setOperatingStates] = useState([])

    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [isChecked, setIsChecked] = useState(false)
    const [category, setCategory] = useState("");


    const [date, setDate] = useState(new Date());
    const [show, setShow] = useState(false);

    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [items, setItems] = useState(citiesData);



    useFocusEffect(
        React.useCallback(() => {
            BackHandler.addEventListener('hardwareBackPress', handleBackPress)

            return () => {
                BackHandler.removeEventListener('hardwareBackPress',handleBackPress)
            }
        })
    )

    // useEffect(() => {
    //     BackHandler.addEventListener('hardwareBackPress',handleBackPress)

    //     return () => {
    //         BackHandler.removeEventListener('hardwareBackPress',handleBackPress)
    //     }
    // })

    const handleBackPress = () => {
        Alert.alert('Exit App', 'Are you sure want to exit?',
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
        // console.log(e.nativeEvent.text)
        setInputs((prevState) => ({
            ...prevState, [name]: value
        }))
    }


    // Date picker
    const showDatePicker = () => {
        setShow(true)
    }

    const onChange = (event, selectedDate) => {
        setShow(false);

        if (selectedDate !== undefined) {
            setDate(selectedDate);


            setInputs((prevState) => ({
                ...inputs, dob: selectedDate
            })
            )
        }
    };



    // Dropdown data
    const categoryData = [
        { label: 'Lorry owners', category: 'Lorry owners' },
        { label: 'Logistics', category: 'Logistics' },
        { label: 'Lorry contractors', category: 'Lorry contractors' },
        { label: 'Load booking agent', category: 'Load booking agent' },
        { label: 'Driver', category: 'Driver' },
        { label: 'Lorry Buy & Sell dealers / Owners', category: 'Lorry Buy &Sell dealers / Owners' },
    ];


    const handleShowPassword = () => {
        setShowPassword(!showPassword)
    }

    const handleShowConfirmPassword = () => {
        setShowConfirmPassword(!showConfirmPassword)
    }

    const handleCheckBox = () => {
        setIsChecked(!isChecked)
    }

    const handleRegisterClick = async (e) => {
        if (
            inputs.name === "" ||
            inputs.dob === "" ||
            inputs.mobileNumber === "" ||
            inputs.email === "" ||
            inputs.pincode === "" ||
            operatingStates.length === 0 ||
            inputs.password === "" ||
            inputs.confirmPassword === "" ||
            isChecked === false
        ) {
            Toast.warn('Please fill all the details')
            return
        } else {

            // const regex = "^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,20}$"

            // if ((inputs.password).match(regex)) {
            //     Toast.warn('enter correct password')
            // }

            // if (inputs.password !== inputs.confirmPassword) {
            //     Toast.warn('Confirm password should be matched with password')
            //     return
            // }

            const regex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,20}$/;

            if (!inputs.password.match(regex)) {
                Toast.warn('Password must be 8-20 characters long, include at least one number, and one special character (!@#$%^&*).');
                return; // Exit the function if the password does not match the regex
            }

            if (inputs.password !== inputs.confirmPassword) {
                Toast.warn('Confirm password should match the password.');
                return; // Exit the function if the passwords do not match
            }


            const signupParams = {
                first_name: inputs.name,
                date_of_birth: `${inputs.dob.toLocaleDateString("en-US", { year: 'numeric', month: '2-digit', day: '2-digit' }).split('/').reverse().join('-')}`,
                // date_of_birth: "1996-11-14" ,
                phone_number: inputs.mobileNumber,
                email : inputs.email,
                category: category,
                operating_city: "",
                state: operatingStates,
                pincode: inputs.pincode,
                password: inputs.password,
            }

            try {


                console.log(signupParams)

                const response = await axiosInstance.post("/registration", signupParams)
                console.log("signup response",response.data)
                if (response.data.error_code === 0) {
                    if (response.data.message === "Phone Number already registered!") {
                        Toast.warn(response.data.message)
                        return
                    }
                    await AsyncStorage.setItem("userName", `${inputs.name}`)
                    await AsyncStorage.setItem("user_id", `${response.data.data[0].id}`)
                    await AsyncStorage.setItem("mobileNumber", `${inputs.mobileNumber}`)
                    Toast.success(response.data.message)
                    setCategory("")
                    setInputs({
                        name: "",
                        dob: "",
                        mobileNumber: "",
                        state: "",
                        operatingCity: "",
                        password: "",
                        confirmPassword: "",
                    })
                   
                    sendOTP()
                    navigation.navigate("OTPVerification")
                } else {
                    Toast.error(response.data.message)
                }

               

            } catch (err) {
                console.log(err)
            }


        }


    }




    const sendOTP = async (e) => {
            const OTPParams = {
                "phone_number": `${inputs.mobileNumber}`,
            }
            try {
                const response = await axiosInstance.post("/send_signup_otp", OTPParams)
                if (response.data.error_code === 0) {
                    console.log(response.data)
                    Toast.success(response.data.message)
                } else {
                    Toast.error(response.data.message)
                }
            } catch (err) {
                console.log(err)
            }
        }
    


    // console.log("operatingCities", operatingCities)
    // console.log("operatingStates", operatingStates)

    console.log("inputs",inputs)

    return (
        <SafeAreaProvider>
            <SafeAreaView>
                <Container
                    position="footer"
                    duration={3000}
                    animationIn="slideInUp"
                    animationOut="slideOutDown"
                    height={60}
                    textStyle={{ backgroundColor: '', fontSize: 12 }}
                />

                <ScrollView style={{ backgroundColor: '#fff' }}>
                    <View style={styles.container}>
                        {/* <StatusBar hidden /> */}

                        <View style={styles.avatarContainer}>
                            <Image
                                style={styles.avatar}
                                source={require("../assets/images/app-logo.png")}
                                />
                        </View>

                        <View style={styles.pageHeadingContainer}>
                            <Text style={[styles.pageHeading]}>Registration</Text>
                        </View>

                        {/* Signup container */}
                        <View style={styles.signupContainer}>
                            <View style={styles.inputField}>
                                <View>
                                    <Text style={styles.label}>Name</Text>
                                </View>
                                <View style={styles.inputBox}>
                                    <TextInput
                                        autoFocus
                                        // ref={inputRef}
                                        placeholder='Enter your name'
                                        placeholderTextColor='grey'
                                        style={styles.input}
                                        value={inputs.name}
                                        onChangeText={(value) => handleChange('name', value)}
                                    >
                                    </TextInput>
                                </View>
                            </View>

                            <View style={styles.inputField}>
                                <View>
                                    <Text style={styles.label} >Date of Birth</Text>
                                </View>
                                <View style={styles.inputBox} >
                                    <TextInput
                                        placeholder={`Enter your date of birth`}
                                        placeholderTextColor='grey'
                                        style={styles.input}
                                        onPress={showDatePicker}
                                        value={inputs.dob !== "" ? inputs.dob.toLocaleDateString("en-GB", { year: 'numeric', month: '2-digit', day: '2-digit' }) : ""}
                                    >
                                    </TextInput>
                                    {show === true ?
                                        <DateTimePicker
                                            value={date}
                                            mode="date"
                                            display="default"
                                            onChange={onChange}
                                        /> : null
                                    }

                                </View>
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
                                        placeholder='Enter your mobile number'
                                        placeholderTextColor='grey'
                                        inputMode='numeric'
                                        // maxLength={10}
                                        style={styles.mobileNumberInput}
                                        value={inputs.mobileNumber}
                                        onChangeText={(value) => handleChange('mobileNumber', value)}
                                    >
                                    </TextInput>
                                </View>
                            </View>


                            <View style={styles.inputField}>
                                <View>
                                    <Text style={styles.label}>E-mail</Text>
                                </View>
                                <View style={styles.inputBox}>
                                    <TextInput
                                        placeholder='Enter your email'
                                        placeholderTextColor='grey'
                                        keyboardType='email-address'
                                        style={styles.input}
                                        value={inputs.email}
                                        onChangeText={(value) => handleChange('email', value)}
                                    >
                                    </TextInput>
                                </View>
                            </View>


                            <View style={styles.inputField}>
                                <View>
                                    <Text style={styles.label}>Category</Text>
                                </View>
                                <View style={styles.mobileNumberInputBox}>
                                    <Dropdown
                                        style={styles.dropdown}
                                        placeholderStyle={styles.placeholderStyle}
                                        selectedTextStyle={styles.selectedTextStyle}
                                        inputSearchStyle={styles.inputSearchStyle}
                                        iconStyle={styles.iconStyle}
                                        itemTextStyle={styles.itemTextStyle}
                                        itemContainerStyle={styles.itemContainerStyle}
                                        data={categoryData}
                                        maxHeight={300}
                                        labelField="label"
                                        valueField="category"
                                        placeholder="Select item"
                                        searchPlaceholder="Search..."
                                        value={category}
                                        onChange={item => setCategory(item.category)}
                                    />
                                </View>
                            </View>

                            {/* <View style={styles.inputField}>
                                <View>
                                    <Text style={styles.label}>Operating City</Text>
                                </View>
                                <View>
                                    <MultiSelectComponent
                                        listOfData={citiesData}
                                        selectedCities={selectedCities}
                                        setSelectedCities={setSelectedCities}
                                        setOperatingCities={setOperatingCities}
                                       
                                    />
                                </View>
                            </View> */}

                            <View style={styles.inputField}>
                                <View>
                                    <Text style={styles.label}>Operating States</Text>
                                </View>
                                <View>
                                    <MultiSelectComponent
                                        listOfData={statesData}
                                        selectedStates={selectedStates}
                                        setSelectedStates={setSelectedStates}
                                        setOperatingStates={setOperatingStates}
                                    />
                                </View>
                            </View>

                            <View style={styles.inputField}>
                                <View>
                                    <Text style={styles.label}>Pincode</Text>
                                </View>
                                <View style={styles.inputBox}>
                                    <TextInput
                                    keyboardType='number-pad'
                                        placeholder='Enter your pincode'
                                        maxLength={6}
                                        placeholderTextColor='grey'
                                        style={styles.input}
                                        value={inputs.pincode}
                                        onChangeText={(value) => handleChange('pincode', value)}
                                    >
                                    </TextInput>
                                </View>
                            </View>

                            <View style={styles.inputField}>
                                <View>
                                    <Text style={styles.label}>Password</Text>
                                </View>
                                <View style={styles.passwordInputBox}>
                                    <TextInput
                                        placeholder='Enter your password'
                                        placeholderTextColor='grey'
                                        style={styles.input}
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

                            <View style={styles.inputField}>
                                <View>
                                    <Text style={styles.label}>Confirm Password</Text>
                                </View>
                                <View style={styles.passwordInputBox}>
                                    <TextInput
                                        placeholder='Enter your password'
                                        placeholderTextColor='grey'
                                        style={styles.input}
                                        secureTextEntry={showConfirmPassword ? false : true}
                                        value={inputs.confirmPassword}
                                        onChangeText={(value) => handleChange('confirmPassword', value)}
                                    >
                                    </TextInput>
                                    <View style={{
                                        position: "absolute",
                                        right: 12,
                                    }}>
                                        <Pressable >
                                            {showConfirmPassword ?
                                                <Ionicons name="eye" size={30} color="black" onPress={() => handleShowConfirmPassword()} />
                                                :
                                                <Ionicons name="eye-off" size={30} color="black" onPress={() => handleShowConfirmPassword()} />
                                            }
                                        </Pressable>
                                    </View>
                                </View>
                            </View>

                            <View style={styles.checkboxContainer}>
                                <Checkbox
                                    value={isChecked ? true : false}
                                    onValueChange={handleCheckBox}
                                    color={COLORS.defaultPrimary}
                                />
                                <Text
                                    onPress={handleCheckBox}
                                    style={{ paddingLeft: 12 }}
                                >I agree to the terms and conditions</Text>
                            </View>
                            {/* <View>
                                <TouchableOpacity style={styles.buttonContainer} onPress={handleRegisterClick}>
                                    <Text style={styles.buttonText}>Register</Text>
                                </TouchableOpacity>
                            </View> */}
                            <CustomButton title="Register" onPress={handleRegisterClick} />
                            <View style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                marginTop: 10,
                                justifyContent: 'center',
                            }}>
                                <Text style={{ textAlign: 'center' }}>
                                    Registered user?{" "}
                                </Text>
                                <TouchableOpacity>
                                    <Text
                                        style={{ color: '#4285F4', fontWeight: 'bold', textDecorationLine: 'underline' }}
                                        onPress={() => navigation.navigate('Login')}
                                    > Log in</Text>
                                </TouchableOpacity>
                            </View>

                        </View>



                    </View>

                </ScrollView>



            </SafeAreaView>
        </SafeAreaProvider>
    )
}

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 20,
        marginVertical: 20,
    },
    pageHeading: {
        fontSize: 22,
        fontWeight: "bold",
        marginVertical: 12,
        marginHorizontal:20
    },
    avatarContainer: {
        marginTop: 30,
        alignItems: 'center',
    },
    avatar: {
        width: 180,
        height: 180,
    },
    signupContainer: {
        marginHorizontal: 20,
        marginTop: 15
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
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 30
    },
    datePickerContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30
    },
    datePicker: {
        width: 320,
        height: 260,
        backgroundColor: 'white',
    },
    dropdown: {
        fontSize: 14,
        width: "100%",
        borderBottomColor: 'gray',
        paddingLeft: 12,
    },
    icon: {
        marginRight: 5,
    },
    placeholderStyle: {
        fontSize: 14,
        color: 'grey'
    },
    selectedTextStyle: {
        fontSize: 14,
    },
    iconStyle: {
        width: 20,
        height: 20,
        marginRight: 15,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 14,
    },
    itemContainerStyle: {

    },
    itemTextStyle: {
        fontSize: 14,
    },
    buttonContainer: {
        backgroundColor: '#2196F3',
        borderRadius: 5,
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        textAlign: 'center',
    },


})

export default SignUp