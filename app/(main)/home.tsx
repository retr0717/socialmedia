import { Alert, FlatList, Pressable, StyleSheet, Text, View} from 'react-native'
import React, { useEffect, useState } from 'react'
import ScreenWrapper from '@/components/ScreenWrapper'
import Button from '@/components/Button'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { hp, wp } from '@/helpers/common'
import { theme } from '@/constants/theme'
import Icon from '@/assets/icons'
import { useRouter } from 'expo-router'
import Avatar from '@/components/Avatar'
import { fetchPosts } from '@/services/postService'
import PostCard from '@/components/PostCard'

let limit = 0;

const Home = () => {

    const {setAuth, user} = useAuth();
    const router = useRouter();
    const [posts, setPosts] = useState([]);

    useEffect(() => {
      getPosts();
    },[])

    const getPosts = async () => {

      limit += 10;

      const res = await fetchPosts(limit);
      
      if(res.success)
      {
        setPosts(res.data);
      }
    }

    // const onLogout = async () => {
        
    //     await setAuth(null);

    //     const {error} = supabase.auth.signOut();

    //     if(error)
    //     {
    //         Alert.alert('Logout', 'Logout failed!');
    //     }
    // }
    
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
                size={hp(4.3)}
                rounded={theme.radius.md}
                style={{borderWidth: 2,width:wp(7.5)}}
              />
            </Pressable>

          </View>

        </View>
      </View>

      {/* posts display */}
      <FlatList
        data={posts}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listStyle}
        keyExtractor={(item : any)=> item?.id.toString()}
        renderItem={({item}: {item : any}) => <PostCard
            item={item}
            currentUser={user}
            router={router}
        />}
      />

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
    padding: 10,
    //paddingHorizontal: wp(4),
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