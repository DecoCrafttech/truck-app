import { Alert, BackHandler, View } from 'react-native'
import React, { useRef } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { COLORS } from '../../constants'
import Header from '../../components/Header'
import BottomSheet from '../../components/BottomSheet'
import ServiceCategory from '../ServiceCategory'
import { useFocusEffect } from '@react-navigation/native'

const Home = () => {
    const refRBSheet = useRef()

    useFocusEffect(
     React.useCallback(() => {
        BackHandler.addEventListener('hardwareBackPress',handleBackPress)

        return () => {
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
   <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
        <View style={{ flex: 1, backgroundColor: COLORS.white }}>
            <Header 
             title="Truck Message" 
             onPress={()=>refRBSheet.current.open()}
             />     
             <ServiceCategory/>
             
        </View>
        <BottomSheet bottomSheetRef={refRBSheet}/>
   </SafeAreaView>
  )
}

export default Home