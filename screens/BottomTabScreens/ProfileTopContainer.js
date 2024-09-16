import React, { useContext, useEffect, useRef, useState } from 'react';
import { View, Image, Text, Button, Modal, TextInput, TouchableOpacity, Platform, Alert } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Fontisto from '@expo/vector-icons/Fontisto';
import Feather from '@expo/vector-icons/Feather';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Dropdown } from 'react-native-element-dropdown';
import { useNavigation } from '@react-navigation/native';
import DropDownPicker from 'react-native-dropdown-picker';
import MultiSelectComponent from '../../components/MultiSelectComponent';
import { citiesData, statesData } from '../../constants/cityAndState';
import { ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RBSheet from 'react-native-raw-bottom-sheet';
import { COLORS } from '../../constants';
import MultiSelectComponentUpdation from '../../components/MultiSelectComponentUpdation';
import { Toast } from 'toastify-react-native';
import axiosInstance from '../../services/axiosInstance';
import { launchImageLibrary } from 'react-native-image-picker';
import CustomButton from '../../components/CustomButton';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import { MaterialIcons as Icon } from '@expo/vector-icons';
import { LoadNeedsContext } from '../../hooks/LoadNeedsContext';





const ProfileTopContainer = () => {

    
  const {
    userStatesFromProfile,
    setUserStatesFromProfile
  } = useContext(LoadNeedsContext)

    const refRBSheetCitites = useRef()
    const refRBSheetStates = useRef()
    const refRBSheetViewStates = useRef()

    const [editing, setEditing] = useState(false);
    const [name, setName] = useState("");
    const [mobile, setMobile] = useState("");
    const [dob, setDob] = useState("");
    const [category, setCategory] = useState("Category");
    const [profileImage, setProfileImage] = useState(null)

    const [userCities, setUserCities] = useState([])
    const [userStates, setUserStates] = useState([])



    const [selectedStates, setSelectedStates] = useState([]);
    const [operatingStates, setOperatingStates] = useState([])
    const [statesUpdated, setStatesUpdated] = useState(false)

    const [editSelectedStates, setEditSelectedStates] = useState([])
    const [editStates, setEditStates] = useState([])
    const [editStatesClick, setEditStatesClick] = useState(false)
    const [updateSelectedStates, setUpdateSelectedStates] = useState([])
    const [updateStates, setUpdateStates] = useState([])




    const [pageRefresh, setPageRefresh] = useState(false)
    // update states
    const [updatedName, setUpdatedName] = useState("");
    const [updatedMobile, setUpdatedMobile] = useState("");
    const [updatedDob, setUpdatedDob] = useState(new Date());
    const [updatedCategory, setUpdatedCategory] = useState("Category");

    const [updatedProfileImage, setUpdatedProfileImage] = useState(null)
    const [updateImageModal, setUpdateImageModal] = useState(false)


    const [updatedOperatingCities, setUpdatedOperatingCities] = useState([])
    const [updatedOperatingStates, setUpdatedOperatingStates] = useState([])

    const [date, setDate] = useState(new Date())
    const [show, setShow] = useState(false);


    // Dropdown data
    const categoryData = [
        { label: 'Lorry owners', category: 'Lorry owners' },
        { label: 'Logistics', category: 'Logistics' },
        { label: 'Lorry contractors', category: 'Lorry contractors' },
        { label: 'Load booking agent', category: 'Load booking agent' },
        { label: 'Driver', category: 'Driver' },
        { label: 'Lorry Buy & Sell dealers / Owners', category: 'Lorry Buy &Sell dealers / Owners' },
    ];

    useEffect(() => {
        const getProfilePage = async () => {
            const getUserProfileParams = {
                user_id: await AsyncStorage.getItem("user_id")
            }
            const response = await axios.post("https://truck.truckmessage.com/get_user_profile", getUserProfileParams)
            if (response.data.error_code === 0) {

                setName(response.data.data[1].name)
                setMobile(response.data.data[1].phone_number)
                setCategory(response.data.data[1].category)
                setDob(response.data.data[1].date_of_birth)
                setUserCities(response.data.data[1].operating_city)
                // setUserStates(response.data.data[1].state)
                setProfileImage(response.data.data[1].profile_image_name)
            } else {
                console.log(response.data.message)
            }
        }
        (async () => getProfilePage())()
    }, [pageRefresh])


    const getStates = async () => {
        try {
            const updateProfileParams = {
                "user_id": `${await AsyncStorage.getItem("user_id")}`,
            }

            const res = await axiosInstance.post("/get_user_state_list", updateProfileParams)

            if (res.data.error_code === 0) {
                setUserStates(res.data.data[0].state_list)
                setUserStatesFromProfile(res.data.data[0].state_list)
            } else {
                console.log(res.data.message)
            }
        } catch (err) {
            console.log(err)
        }
    }



    useEffect(() => {
        (async () => getStates())()
    }, [])

    console.log("userStatesFromProfile-Profilepage",userStatesFromProfile)


    const handleEditPress = () => {
        setEditing(true);
        setUpdatedName(name)
        setUpdatedMobile(mobile)
        setUpdatedDob(dob)
        setUpdatedCategory(category)
        // setUpdatedProfileImage(profileImage)
        // setUpdatedOperatingCities(userCities)
        // setUpdatedOperatingStates(userStates)
    };



    const handleCancel = () => {
        setEditing(false);
    };

    const handleUpdateImageModalCancel = () => {
        setUpdateImageModal(false)
    }


    const pickProfileImage = async () => {
        // Request permission to access the media library
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission required', 'Sorry, we need media library permissions to make this work!');
            return;
        }

        // Launch the image picker
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 4],
            quality: 1,
        });

        if (!result.canceled) {
            const { uri } = result.assets[0];
            setUpdatedProfileImage(uri);
        }
    };



    const updateProfileImageAPI = async (uri) => {
        const url = 'https://truck.truckmessage.com/update_profile_image'; // Replace with your server URL

        const formData = new FormData();
        formData.append('profile_image', {
            uri: Platform.OS === 'ios' ? uri.replace('file://', '') : uri,
            type: 'image/jpeg', // Adjust if you are dealing with different image types
            name: 'profile_image',
        });
        formData.append("user_id", `${await AsyncStorage.getItem("user_id")}`)

        try {
            const response = await axios.post(url, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.data.error_code === 0) {
                setProfileImage(response.data.data[0].profile_image_name)
                setUpdateImageModal(false)
                Alert.alert('Upload Success', 'Image uploaded successfully!');

            } else {
                Toast.error(response.data.message)
            }

        } catch (error) {
            Alert.alert('Upload Failed', 'Image upload failed. Please try again.');
            console.error('Error uploading image:', error);
        }
    };








    const handleSave = async () => {
        try {
            let localUri = updatedProfileImage;
            if (localUri) {
                let filename = localUri.split('/').pop();
                let match = /\.(\w+)$/.exec(filename);
                let type = match ? `image/${match[1]}` : `image`;
                let formData = new FormData();
                formData.append('profile_image', { uri: localUri, name: filename, type });
                formData.append('profile_image', filename);
            }

            const updateProfileParams = {
                "user_id": `${await AsyncStorage.getItem("user_id")}`,
                "first_name": `${updatedName}`,
                "date_of_birth": `${updatedDob}`,
                "phone_number": `${updatedMobile}`,
                "category": `${updatedCategory}`,
                "operating_city": [],
                "state": []
            }

            const res = await axios.post("https://truck.truckmessage.com/update_profile", updateProfileParams, {
                headers: {
                    "Content-Type": "application/json"
                }
            })


            if (res.data.error_code === 0) {
                setEditing(false);
                setPageRefresh(!pageRefresh)
            } else {
                console.log(res.data.message)
            }
        } catch (err) {
            console.log(err)
        }
    };


    // Date picker
    const showDatePicker = () => {
        setShow(true)
    }
    const onChange = (event, userSelectedDate) => {
        setShow(false);
        if (userSelectedDate !== undefined) {
            setDate(userSelectedDate);
            setUpdatedDob(userSelectedDate.toISOString().split('T')[0])
        }
    };

    const handleStatesSubmit = async () => {
        try {

            const addStatesParams = {
                "user_id": `${await AsyncStorage.getItem("user_id")}`,
                "state_name": operatingStates
            }

            const res = await axiosInstance.post("/user_state_entry", addStatesParams)

            if (res.data.error_code === 0) {
                setPageRefresh(!pageRefresh)
                refRBSheetStates.current.close()
                setOperatingStates([])
                setSelectedStates([])

                getStates()
            } else {
                console.log(res.data.message)
            }
        } catch (err) {
            console.log(err)
        }
    }



    const handleEditStates = () => {
        setEditStatesClick(true);
        setEditSelectedStates(userStates.map(stateName => {
            const stateObj = statesData.find(state => state.name === stateName);
            return stateObj ? stateObj.id : null;
        }).filter(id => id !== null));
        setEditStates(userStates)
        
    };


    const handleEditStatesChange = async (selectedItemIds) => {
        // Log previously selected states
        const prevSelectedStateNames = editSelectedStates.map(id => {
            const state = statesData.find(state => state.id === id);
            return state ? state.name : null;
        }).filter(name => name !== null);


        // Update selected states
        setEditSelectedStates(selectedItemIds);

        // Log currently selected states
        const selectedStateNames = selectedItemIds.map(id => {
            const state = statesData.find(state => state.id === id);
            return state ? state.name : null;
        }).filter(name => name !== null);
        setUpdateSelectedStates(selectedStateNames)
    };



    const handleUpdateStates = async () => {
        try {
            const removeStatesParams = {
                "user_id": `${await AsyncStorage.getItem("user_id")}`,
                "state_name": editStates
            }

            const res = await axiosInstance.post("/remove_user_state_list", removeStatesParams)

            if (res.data.error_code === 0) {
                console.log(res.data)
                await updateStatesFunction()
            } else {
                console.log(res.data.message)
            }
        } catch (err) {
            console.log(err)
        }
    }

    const updateStatesFunction = async () => {
        try {
            const updateStatesParams = {
                "user_id": `${await AsyncStorage.getItem("user_id")}`,
                "state_name": updateSelectedStates
            }

            const res = await axiosInstance.post("/user_state_entry", updateStatesParams)

        if (res.data.error_code === 0) {
            setPageRefresh(!pageRefresh)
            setEditStatesClick(false)
            getStates()
        } else {
            console.log(res.data.message)
        }
        } catch (err) {
            console.log(err)
        }

    }


    return (
        <View style={styles.container}>
            <Text style={styles.editIcon} >
                <TouchableOpacity onPress={handleEditPress}>
                    <Feather name="edit" size={24} color="black" />
                </TouchableOpacity>
            </Text>
            <View style={styles.header}>
                <View>
                    <Image
                        style={styles.avatar}
                        source={{ uri: profileImage }} />
                    <Feather style={styles.modalImageEditIcon}
                        name="edit"
                        size={20}
                        color="#000"
                        onPress={() => setUpdateImageModal(true)}
                    />
                </View>
                <View style={styles.info}>


                    <Text style={styles.name} >{name}</Text>
                    <Text style={[styles.phone]}>
                        <Text><FontAwesome name="phone" size={15} color="black" /></Text>
                        <Text style={{ marginLeft: 50 }}>{`   +91${mobile}`}</Text>
                    </Text>
                    <Text style={[styles.dob]}>
                        <Text><Fontisto name="date" size={15} color="black" /></Text>
                        <Text style={{ marginLeft: 50 }}>{`  ${dob}`}</Text>
                    </Text>
                </View>
            </View>
            <View style={styles.stats}>
                <View style={styles.stat}>
                    <Text style={styles.statLabel}>Category</Text>
                    <Text style={styles.statValue}>{category}</Text>
                </View>


                <TouchableOpacity style={[styles.addButton, { marginEnd: 10 }]} onPress={() => refRBSheetStates.current.open()} >
                    <Text style={styles.buttonText}>Add states</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.addButton} onPress={() => refRBSheetViewStates.current.open()} >
                    <Text style={styles.buttonText}>View states</Text>
                </TouchableOpacity>



            </View>

            <Modal visible={editing} animationType="slide" transparent={true}>
                <View style={styles.modalContainer}>

                    <View style={styles.modalContent}>
                        <Text style={{ fontSize: 17, fontWeight: 'bold', marginBottom: 20 }}>Edit Profile</Text>
                        {/* <View>
                            <Image style={styles.modalAvatar}
                                source={{ uri: updatedProfileImage }}
                            />
                            <Feather style={styles.modalImageEditIcon}
                                name="edit"
                                size={20}
                                color="#000"
                                onPress={() => pickProfileImage()}
                            />
                        </View> */}

                        <TextInput
                            style={styles.input}
                            value={updatedName}
                            onChangeText={(text) => setUpdatedName(text)}
                            placeholder="Name"
                        />
                        <TextInput
                            style={styles.input}
                            value={updatedMobile}
                            onChangeText={(text) => setUpdatedMobile(text)}
                            placeholder="Mobile Number"
                        />
                        {/* <TextInput
                            style={styles.input}
                            value={dob}
                            onChangeText={(text) => setDob(text)}
                            placeholder="Date of Birth"
                        /> */}
                        <View >
                            <TextInput
                                placeholder={`Enter your date of birth`}
                                placeholderTextColor='grey'
                                style={styles.input}
                                onPress={showDatePicker}
                                value={updatedDob}
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

                        {/* <TextInput
                            style={styles.input}
                            value={category}
                            onChangeText={(text) => setCategory(text)}
                            placeholder="Category"
                        /> */}
                        <Dropdown
                            style={styles.input}
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
                            value={updatedCategory}
                            onChange={item => setUpdatedCategory(item.category)}
                        />
                        {/* <DropDownPicker
                            open={open}
                            value={value}
                            items={items}
                            setOpen={setOpen}
                            setValue={setValue}
                            setItems={setItems}
                            multiple={true}
                            mode="BADGE"
                            badgeDotColors={["#e76f51", "#00b4d8", "#e9c46a", "#e76f51", "#8ac926", "#00b4d8", "#e9c46a"]}
                            style={styles.input}
                        /> */}
                        {/* <TextInput
                            style={styles.input}
                            value={updatedCity}
                            onChangeText={(text) => setUpdatedCity(text)}
                            placeholder="City"
                        /> */}
                        <View style={{ marginBottom: 6 }}>
                            <MultiSelectComponentUpdation
                                listOfData={citiesData}
                                userCities={userCities}
                                setUserCities={setUserCities}
                                updatedOperatingCities={updatedOperatingCities}
                                setUpdatedOperatingCities={setUpdatedOperatingCities}
                            />
                        </View>
                        {/* <TextInput
                            style={styles.input}
                            value={updatedState}
                            onChangeText={(text) => setUpdatedState(text)}
                            placeholder="State"
                        /> */}
                        <View style={{ marginBottom: 6 }}>
                            <MultiSelectComponentUpdation
                                listOfData={statesData}
                                userStates={userStates}
                                setUserStates={setUserStates}
                                updatedOperatingStates={updatedOperatingStates}
                                setUpdatedOperatingStates={setUpdatedOperatingStates}
                            />
                        </View>
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={handleSave}>
                                <Text style={styles.buttonText}>Save</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={handleCancel}>
                                <Text style={styles.buttonText}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            <Modal visible={updateImageModal} animationType="slide" transparent={true}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={{ fontSize: 17, fontWeight: 'bold', marginBottom: 20 }}>Edit Profile</Text>
                        <View>
                            <View>
                                <Image
                                    style={[styles.avatar, { alignItems: 'center', marginHorizontal: 'auto' }]}
                                    source={{ uri: updatedProfileImage || profileImage }} />
                                <Feather style={[styles.modalImageEditIcon, { position: 'absolute', bottom: 0, left: "65%" }]}
                                    name="edit"
                                    size={20}
                                    color="#000"
                                    onPress={() => pickProfileImage()}
                                />
                            </View>
                        </View>

                        <View style={styles.buttonContainer}>
                            <TouchableOpacity
                                style={[styles.button, styles.saveButton]}
                                onPress={() => updateProfileImageAPI(updatedProfileImage)}>
                                <Text style={styles.buttonText}>Save</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.button, styles.cancelButton]}
                                onPress={handleUpdateImageModalCancel}>
                                <Text style={styles.buttonText}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            <View>
                <RBSheet
                    ref={refRBSheetCitites}
                    height={400}
                    openDuration={250}
                    closeOnDragDown={true}
                    closeOnPressBack={true}
                    closeOnPressMask={true}
                    customStyles={{
                        wrapper: {
                            backgroundColor: "rgba(0,0,0,0.5)",
                        },
                        draggableIcon: {
                            backgroundColor: COLORS.gray,
                            width: 100,
                        },
                        container: {
                            borderTopLeftRadius: 30,
                            borderTopRightRadius: 30,
                            alignItems: "center",
                            justifyContent: "center",
                            padding: 20,
                        },
                    }}
                >
                    <View>
                        <ScrollView>

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






                            <View>
                                <Text
                                    style={{
                                        textAlign: "center",
                                        fontWeight: "bold",
                                        color: COLORS.brand,
                                        fontSize: 16
                                    }}
                                >Your Operating Cities {'\n'}</Text>
                            </View>
                            <Text style={{ textAlign: "center", fontWeight: "500", color: COLORS.secondary, fontSize: 14 }}>
                                {
                                    updatedOperatingCities.length === 0 ?
                                        <View>
                                            {
                                                userCities.map((city, index) => {
                                                    return (
                                                        <React.Fragment key={index}>
                                                            <Text>{city}</Text>
                                                        </React.Fragment>
                                                    )
                                                })
                                            }
                                        </View>
                                        :
                                        <>
                                            {
                                                updatedOperatingCities.map((city, index) => {
                                                    return (
                                                        <React.Fragment key={index}>
                                                            <Text style={{ marginVertical: 30 }}>{city} {"\n"}</Text>
                                                        </React.Fragment>
                                                    )
                                                })
                                            }
                                        </>
                                }

                            </Text>
                        </ScrollView>
                    </View>
                </RBSheet>
            </View>


            <View>
                <RBSheet
                    ref={refRBSheetStates}
                    height={400}
                    openDuration={250}
                    closeOnDragDown={true}
                    closeOnPressBack={true}
                    closeOnPressMask={true}
                    customStyles={{
                        wrapper: {
                            backgroundColor: "rgba(0,0,0,0.5)",
                        },
                        draggableIcon: {
                            backgroundColor: COLORS.gray,
                            width: 100,
                        },
                        container: {
                            borderTopLeftRadius: 30,
                            borderTopRightRadius: 30,
                            alignItems: "center",
                            justifyContent: "center",
                            padding: 20,
                        },
                    }}
                >
                    <View>
                        <ScrollView>
                            <View>
                                <Text style={{ fontSize: 18, fontWeight: "700", marginBottom: 18, color: COLORS.primary }}>Add States</Text>
                            </View>
                            <View style={{ width: 320 }}>
                                <MultiSelectComponent
                                    listOfData={statesData}
                                    selectedStates={selectedStates}
                                    setSelectedStates={setSelectedStates}
                                    setOperatingStates={setOperatingStates}
                                />
                            </View>

                            <View style={{ marginTop: 20 }}>
                                <TouchableOpacity style={styles.addButton} onPress={() => handleStatesSubmit()} >
                                    <Text style={[styles.buttonText, { textAlign: 'center' }]}>Submit</Text>
                                </TouchableOpacity>
                            </View>


                        </ScrollView>
                    </View>
                </RBSheet>
            </View>

            <View>
                <RBSheet
                    ref={refRBSheetViewStates}
                    height={500}
                    openDuration={250}
                    closeOnDragDown={true}
                    closeOnPressBack={true}
                    closeOnPressMask={true}
                    customStyles={{
                        wrapper: {
                            backgroundColor: "rgba(0,0,0,0.5)",
                        },
                        draggableIcon: {
                            backgroundColor: COLORS.gray,
                            width: 100,
                        },
                        container: {
                            borderTopLeftRadius: 30,
                            borderTopRightRadius: 30,
                            alignItems: "center",
                            justifyContent: "center",
                            padding: 20,
                        },
                    }}
                >
                    <View>
                        <ScrollView>


                            <View style={{ width: 320 }}>
                                {
                                    editStatesClick === true ?
                                        <>
                                            <View style={{ width: 320 }}>
                                                {/* <MultiSelectComponent
                                                    listOfData={statesData}
                                                    selectedStates={selectedStates}
                                                    setSelectedStates={setSelectedStates}
                                                    setOperatingStates={setOperatingStates}
                                                /> */}
                                                <SectionedMultiSelect
                                                    items={statesData}
                                                    IconRenderer={Icon}
                                                    uniqueKey="id"
                                                    searchPlaceholderText="Search state"
                                                    selectedText="selected"
                                                    selectText="Select"
                                                    confirmText="Done"
                                                    onSelectedItemsChange={handleEditStatesChange}  // Call to update selected items
                                                    selectedItems={editSelectedStates}  // Initialize with current user states
                                                    styles={{
                                                        backdrop: styles.multiSelectBackdrop,
                                                        selectToggle: styles.multiSelectBox,
                                                        chipContainer: styles.multiSelectChipContainer,
                                                        chipText: styles.multiSelectChipText,
                                                        selectToggleText: styles.selectToggleText,
                                                        selectedItemText: styles.selectedItemText,
                                                        selectText: styles.selectText,
                                                        button: { backgroundColor: '#CE093A' },
                                                    }}
                                                />
                                            </View>

                                            <View style={{ marginTop: 20 }}>
                                                <TouchableOpacity style={styles.addButton} onPress={() => handleUpdateStates()} >
                                                    <Text style={[styles.buttonText, { textAlign: 'center' }]}>Update</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </>
                                        : null
                                }

                                <View style={{ flexDirection: 'row', marginTop: 20, justifyContent: 'space-between' }}>
                                    <Text
                                        style={{
                                            fontWeight: "bold",
                                            color: COLORS.brand,
                                            fontSize: 16,
                                        }}
                                    >Your Operating States {'\n'}
                                    </Text>
                                    <Text
                                        onPress={() => handleEditStates()}
                                    >Edit
                                    </Text>

                                </View>
                                {/* <View>
                                    <Text
                                        style={{
                                            fontWeight: "bold",
                                            color: COLORS.brand,
                                            fontSize: 16,
                                            marginTop: 20,
                                        }}
                                    >Your Operating States {'\n'}
                                    </Text>
                                    <Text
                                        style={{ position: 'absolute', right: "0%", bottom: "35%" }}
                                        onPress={() => handleEditStates()}
                                    >Edit
                                    </Text>

                                </View> */}
                            </View>
                            <Text style={{ fontWeight: "500", color: COLORS.secondary, fontSize: 14 }}>

                                {
                                    updatedOperatingStates.length === 0 ?
                                        <>
                                            {
                                                userStates.map((state, index) => {
                                                    return (
                                                        <React.Fragment key={index}>
                                                            <Text style={{ marginTop: 50 }}>{state} {"\n"}</Text>
                                                        </React.Fragment>
                                                    )
                                                })
                                            }
                                        </>
                                        :
                                        <>
                                            {
                                                updatedOperatingStates.map((state, index) => {
                                                    return (
                                                        <React.Fragment key={index}>
                                                            <Text style={{ marginTop: 50 }}>{state} {"\n"}</Text>
                                                        </React.Fragment>
                                                    )
                                                })
                                            }
                                        </>

                                }
                            </Text>
                        </ScrollView>
                    </View>
                </RBSheet>
            </View>
        </View>
    );
};

const styles = {
    container: {
        // backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        // marginTop: 10,

    },
    editIcon: {
        position: 'absolute',
        right: 10,
        top: 10
    },
    header: {
        marginTop: 10,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        paddingVertical: 10,

    },
    avatar: {
        width: 110,
        height: 110,
        borderRadius: 25,
    },
    modalAvatar: {
        width: 80,
        height: 80,
        borderRadius: 3,
        marginBottom: 20,
        marginHorizontal: 'auto',
        position: 'relative'
    },
    modalImageEditIcon: {
        position: 'absolute',
        right: "0%",
        bottom: "0%",
    },
    info: {
        marginLeft: 20,
    },
    editButtonContainer: {
        backgroundColor: '#0066cc',
        borderRadius: 5,
        marginTop: 12,
        marginHorizontal: 5,
        paddingVertical: 6,
        borderWidth: 1,
        alignItems: "center",
    },
    editButtonText: {
        color: '#fff',
        fontSize: 14,
        textAlign: 'center',

    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
        maxWidth: '80%',
    },
    phone: {
        marginBottom: 10,
        marginHorizontal: 0,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    dob: {
        // marginBottom : 10,
        marginHorizontal: 0,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    username: {
        color: '#999',
        fontSize: 16,
        marginBottom: 5,
    },
    stats: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
    },
    stat: {
        flex: 1,
        alignItems: 'center',
    },
    statLabel: {
        color: '#999',
        fontSize: 14,
    },
    statValue: {
        fontSize: 16,
    },
    bio: {
        padding: 20,
        fontSize: 16,
        color: '#333',
    },
    headerContainer: {
        alignItems: "center",
    },
    coverPhoto: {
        width: "100%",
        height: 200,
    },
    profileContainer: {
        alignItems: "center",
        marginTop: -50,
    },
    profilePhoto: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    nameText: {
        fontSize: 20,
        fontWeight: "bold",
        marginTop: 10,
    },
    bioContainer: {
        padding: 15,
    },
    bioText: {
        fontSize: 16,
    },
    statsContainer: {
        flexDirection: "row",
        marginTop: 20,
        marginBottom: 20,
    },
    statContainer: {
        alignItems: "center",
        flex: 1,
    },
    statCount: {
        fontSize: 20,
        fontWeight: "bold",
    },
    button: {
        backgroundColor: "#0066cc",
        borderRadius: 5,
        padding: 10,
        marginHorizontal: 20,
        marginTop: 10,
    },
    buttonText: {
        fontSize: 16,
        color: "#fff",
        textAlign: "center",
    },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 10,
        width: "80%",
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
        fontSize: 14,
    },
    multiSelectComponent: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
        fontSize: 14,
    },
    placeholderStyle: {
        fontSize: 14,
        color: 'grey'
    },
    selectedTextStyle: {
        fontSize: 14,
    },
    itemTextStyle: {
        fontSize: 14,
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginTop: 20,
    },
    saveButton: {
        backgroundColor: "#0066cc",
        width: '25%'
    },
    cancelButton: {
        backgroundColor: "#999",
    },
    addButton: {
        backgroundColor: COLORS.primary,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },

    multiSelectBackdrop: {
        backgroundColor: 'rgba(0, 0, 0, 0.01)',
    },
    multiSelectBox: {
        borderWidth: 1,
        borderRadius: 8,
        borderColor: 'grey',
        padding: 10,
        paddingLeft: 15,
        marginBottom: 4,
    },
    selectToggleText: {
        color: '#000',
        fontSize: 14
    },
    selectText: {
        color: 'red'
    },
    selectedItemText: {
        color: COLORS.primary,
    },
    multiSelectChipContainer: {
        borderWidth: 0,
        backgroundColor: '#ddd',
        borderRadius: 8,
    },
    multiSelectChipText: {
        color: '#222',
        fontSize: 12,
    }
};

export default ProfileTopContainer;
