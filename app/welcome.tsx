import { View, Text, StatusBar , StyleSheet, Image, Pressable} from 'react-native'
import React from 'react'
import ScreenWrapper from '@/components/ScreenWrapper'
import {hp, wp} from '@/helpers/common';
import { theme } from '@/constants/theme';
import Button from '@/components/Button';

const Welcome = () => {
  return (
    <ScreenWrapper bg={"white"}>
      <StatusBar barStyle={"dark-content"}/>
      <View style={styles.container}>
          <Image style={styles.welcomeImage} resizeMode='contain' source={require('../assets/images/welcome.png')}/>

          <View style={{gap:20}}>
            <Text style={styles.title}>ChitChat</Text>
            <Text style={styles.punchline}>Chat it out!</Text>
          </View>

          {/*footer*/}
          <View style={styles.footer}>
            <Button
              title={"Getting Started"}
              buttonStyle={{marginHorizontal: wp(3)}}
              onPress={() => {}}
              loading={false}
              hasShadow={true}
              textStyle={{}}
            />

            <View style={styles.bottomTextContainer}>
              <Text style={styles.loginText}>
                Already have an account?
              </Text>
              <Pressable>
                <Text style={[styles.loginText,
                {
                  color: theme.colors.primaryDark,
                  fontWeight: '600'
                }
                ]}>
                  Login
                </Text>
              </Pressable>
            </View>
          </View>
      </View>
    </ScreenWrapper>
  )
}

export default Welcome

const styles = StyleSheet.create({
  container : {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: 'white',
    paddingHorizontal : wp(4),
  },
  loginText: {
    textAlign: 'center',
    color: theme.colors.text,
    fontSize: hp(1.6)
  },
  bottomTextContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5
  },
  footer: {
    gap: 30,
    width: '100%'
  }
  ,
  punchline: {
    textAlign: 'center',
    paddingHorizontal: wp(10),
    fontSize: hp(1.7),
    color: theme.colors.text,
  },
  title: {
    color: theme.colors.text,
    fontSize: hp(4),
    textAlign: 'center',
    fontWeight: "800",
  },
  welcomeImage : {
    height : hp(30),
    width: wp(100),
    alignSelf: 'center',
  }
})