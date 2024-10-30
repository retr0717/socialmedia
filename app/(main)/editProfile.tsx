import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { hp, wp } from '@/helpers/common'
import { theme } from '@/constants/theme'
import ScreenWrapper from '@/components/ScreenWrapper'
import Header from '@/components/Header'
import { Image } from 'expo-image'
import { useAuth } from '@/contexts/AuthContext'
import { getUserImageSrc } from '@/services/imageService'
import Icon from '@/assets/icons'
import Input from '@/components/Input'

const EditProfile = () => {

  const {user: currentUser} = useAuth();
  let imageSource = getUserImageSrc(user?.image);

  //form inputs.
  const [user, setUser] = useState({
    name: '',
    phoneNo: '',
    image: null,
    bio: '',
    address: ''
  });


  const onPickImage = async() => {
  }

  useEffect(() => {
    
    if(currentUser)
    {
      setUser({
        name: currentUser?.name || '',
        phoneNo: currentUser?.phoneNo || '',
        image: currentUser?.image || null,
        address: currentUser?.address || '',
        bio: currentUser?.bio || ''
      });
    }

  },[currentUser])

  return (
    <ScreenWrapper bg={'white'}>
      <View style={styles.container}>
        <ScrollView style={{flex: 1}}>
          <Header title='Edit Profile'/>

          {/* form */}
          <View style={styles.form}>
            <View style={styles.avatarContainer}>
              <Image 
                source={imageSource} style={styles.avatar}
              />
              <Pressable style={styles.cameraIcon} onPress={onPickImage}>
                <Icon name='camera' size={20} strokeWidth={2.5} />
              </Pressable>
            </View>

            <Text style={{fontSize: hp(1.5), color: theme.colors.text}}>
              Please fill you profile details
            </Text>

            <Input
              icon={<Icon name='user'/>}
              placeholder='Enter your name'
              value={user.name}
              onChageText={(value : any )=> setUser({...user, name: value})}
            />

            <Input
              icon={<Icon name='call'/>}
              placeholder='Enter your phone no'
              value={user.phoneNo}
              onChageText={(value : any )=> setUser({...user, phoneNo: value})}
            />

            <Input
              icon={<Icon name='location'/>}
              placeholder='Enter your address'
              value={user.address}
              onChageText={(value : any )=> setUser({...user, address: value})}
            />

            <Input
              placeholder='Enter your bio'
              value={user.bio}
              multiline={true}
              containerStyle={styles.bio}
              onChageText={(value : any )=> setUser({...user, bio: value})}
            />

          </View>

        </ScrollView>
      </View>
    </ScreenWrapper>
  )
}

export default EditProfile

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: wp(4),
  },
  avatarContainer: {
    height: hp(14),
    width: hp(14),
    alignSelf: 'center',
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: theme.radius.xxl*1.8,
    borderCurve: 'continuous',
    borderWidth: 1,
    borderColor: theme.colors.darkLight,
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: -10,
    padding: 8,
    borderRadius: 50,
    backgroundColor: 'white',
    shadowColor: theme.colors.textLight,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 7,
  },
  form: {
    gap: 18,
    marginTop: 20,
  },
  input: {
    flexDirection: 'row',
    borderWidth: 0.4,
    borderColor: theme.colors.text,
    borderRadius: theme.radius.xxl,
    borderCurve: 'continuous',
    padding: 17,
    paddingHorizontal: 20,
    gap: 15,
  },
  bio: {
    flexDirection: 'row',
    height: hp(15),
    alignItems: 'flex-start',
    paddingHorizontal: 15,
  }
})