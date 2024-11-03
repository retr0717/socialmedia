import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { fetchPostsDetails } from '@/services/postService';
import { hp, wp } from '@/helpers/common';
import { theme } from '@/constants/theme';
import PostCard from '@/components/PostCard';
import { useAuth } from '@/contexts/AuthContext';
import Loading from '@/components/Loading';
import Input from '@/components/Input';
import Icon from '@/assets/icons';

const PostDetails = () => {

    const {postId} = useLocalSearchParams();
    const [post, setPost] = useState(null);
    const [statLoading, setStartLoading] = useState(true);
    const inputRef = useRef(null);
    const commentRef = useRef(null);
    const router = useRouter();
    const {user} = useAuth();

    useEffect(() => {
      getPostDetails();
    }, [])

    const getPostDetails = async () => {
      
      let res = await fetchPostsDetails(postId);
      if(res.success) setPost(res?.data);

      setStartLoading(false);
    }

    if(statLoading)
    {
      return(
        <View style={styles.center}>
          <Loading/>
        </View>
      )
    }

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.list} >
        <PostCard
          item={post}
          currentUser={user}
          router={router}
          hasShadow={false}
          showMoreIcon={false}
        />

        {/* comment input */}
        <View style={styles.inputContainer}>
          <Input
            inputRef={inputRef}
            onChangeText={(value:any) => commentRef.current = value}
            placeholder={'Type something...'}
            placeholderTextColor={theme.colors.textLight}
            containerStyle={{flex:1, height: hp(6.2), borderRadius: theme.radius.xl}}
          />

          <TouchableOpacity style={styles.sendIcon}>
            <Icon name='send' color={theme.colors.primaryDark} />
          </TouchableOpacity>
        </View>

      </ScrollView>
    </View>
  )
}

export default PostDetails

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingVertical: wp(7)
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  list: {
    paddingHorizontal: wp(4)
  },
  sendIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.8,
    borderColor: theme.colors.primary,
    borderRadius: theme.radius.lg,
    borderCurve: 'continuous',
    height: hp(5.8),
    width: hp(5.8)
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  notFound: {
    fontSize: hp(2.5),
    color: theme.colors.text,
    fontWeight: theme.fonts.medium
  },
  loading: {
    height: hp(5.8),
    width: hp(5.8),
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{scale: 1.3}]
  }
})