import { View } from 'react-native'
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ScreenWrapper = ({children , bg} : {children : any, bg : any}) => {
    
    const {top} = useSafeAreaInsets();
    //for devices having notch top+5
    const paddingTop = top > 0 ? top+5 : 30;

  return (
    <View style={{flex: 1, paddingTop, backgroundColor: bg}}>
      {children}
    </View>
  )
}

export default ScreenWrapper;