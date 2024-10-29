import { Alert, Pressable, StyleSheet, Text, View} from 'react-native'
import React from 'react'
import ScreenWrapper from '@/components/ScreenWrapper'
import Button from '@/components/Button'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { hp, wp } from '@/helpers/common'
import { theme } from '@/constants/theme'
import Icon from '@/assets/icons'
import { useRouter } from 'expo-router'
import Avatar from '@/components/Avatar'

const Home = () => {

    const {setAuth, user} = useAuth();
    const router = useRouter();

    const onLogout = async () => {
        
        await setAuth(null);

        const {error} = supabase.auth.signOut();

        if(error)
        {
            Alert.alert('Logout', 'Logout failed!');
        }
    }
    
  return (
    <ScreenWrapper bg={"white"}>
      <View style={styles.container}>
        {/* header */}
        <View style={styles.header}>

          <Text style={styles.title}>ChitChat</Text>

          <View style={styles.icons}>

            <Pressable onPress={() => router.push('/(main)/notification')}>
              <Icon name={'heart'} size={hp(3.2)} strokeWidth={2} color={theme.colors.text} />
            </Pressable>

            <Pressable onPress={() => router.push('/(main)/NewPost')}>
              <Icon name={'plus'} size={hp(3.2)} strokeWidth={2} color={theme.colors.text} />
            </Pressable>

            <Pressable onPress={() => router.push('/(main)/profile')}>
              <Avatar
                uri={user?.image}
                size={hp(5.3)}
                rounded={theme.radius.md}
                style={{borderWidth: 2}}
              />
            </Pressable>

          </View>

        </View>
      </View>
      <Button title={"logout"} onPress={onLogout}/>
    </ScreenWrapper>
  )
}

export default Home

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //paddingHorizontal: wp(4),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    marginHorizontal: wp(4),
  },
  title: {
    color: theme.colors.text,
    fontSize: hp(3.2),
    fontWeight: theme.fonts.bold,
  },
  avatarImage: {
    height: hp(4.3),
    width: hp(4.3),
    borderRadius: theme.radius.sm,
    borderCurve: 'continuous',
    borderColor: theme.colors.gray,
    borderWidth: 3, 
  },
  icons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 18,
  },
  listStyle: {
    paddingTop: 20,
    paddingHorizontal: wp(4),
  },
  noPost: {
    fontSize: hp(2),
    textAlign: 'center',
    color: theme.colors.text,
  },
  pill: {
    position: 'absolute',
    right: -10,
    top: -4,
  }
})