import {
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import Button from "@/components/Button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { hp, wp } from "@/helpers/common";
import { theme } from "@/constants/theme";
import Icon from "@/assets/icons";
import { useRouter } from "expo-router";
import Avatar from "@/components/Avatar";
import { fetchPosts } from "@/services/postService";
import PostCard from "@/components/PostCard";
import Loading from "@/components/Loading";
import { getUserData } from "@/services/userService";

let limit = 0;

const Home = () => {
  const { setAuth, user } = useAuth();
  const router = useRouter();
  const [posts, setPosts] = useState([]);
  const [hasMore, setHasMore] = useState(true);

  const handlePostEvent = async (payload: any) => {
    if (payload.eventType == "INSERT" && payload?.new?.id) {
      let newPost = { ...payload.new };
      let res = await getUserData(newPost?.userid);
      newPost.user = res.success ? res.data : {};
      setPosts((prevPosts: any) => [newPost, ...prevPosts]);
    }
  };

  const handleNewComment = async (payload: any) => {
    console.log("payload in home : ", payload.new);

    // if (payload.new) {
    //   let newComment = { ...payload.new };
    //   let res = await getUserData(newComment.userId);
    //   newComment.user = res.success ? res.data : {};
    //   setPosts((prevPost: any) => {
    //     return {
    //       ...prevPost,
    //       comments: [newComment, ...prevPost.comments],
    //     };
    //   });
    // }
  };

  useEffect(() => {
    let commentChannel = supabase
      .channel("comments")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "comments",
          filter: `userId=eq.${user.id}`,
        },
        handleNewComment,
      )
      .subscribe();

    let postChannel = supabase
      .channel("posts")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "posts" },
        handlePostEvent,
      )
      .subscribe();

    getPosts();

    return () => {
      supabase.removeChannel(commentChannel);
      supabase.removeChannel(postChannel);
    };
  }, []);

  const getPosts = async () => {
    if (!hasMore) return null;

    limit += 4;

    const res = await fetchPosts(limit);

    if (res.success) {
      if (posts.length == res?.data.length) setHasMore(false);

      setPosts(res.data);
    }
  };

  // const onLogout = async () => {

  //     await setAuth(null);

  //     const {error} = supabase.auth.signOut();

  //     if(error)
  //     {
  //         Alert.alert('Logout', 'Logout failed!');
  //     }
  // }

  const onDeletePost = (postId: any) => {};

  const onEditPost = (postId: any) => {};

  return (
    <ScreenWrapper bg={"white"}>
      <View style={styles.container}>
        {/* header */}
        <View style={styles.header}>
          <Text style={styles.title}>ChitChat</Text>

          <View style={styles.icons}>
            <Pressable onPress={() => router.push("/(main)/notification")}>
              <Icon
                name={"heart"}
                size={hp(3.2)}
                strokeWidth={2}
                color={theme.colors.text}
              />
            </Pressable>

            <Pressable onPress={() => router.push("/(main)/NewPost")}>
              <Icon
                name={"plus"}
                size={hp(3.2)}
                strokeWidth={2}
                color={theme.colors.text}
              />
            </Pressable>

            <Pressable onPress={() => router.push("/(main)/profile")}>
              <Avatar
                uri={user?.image}
                size={hp(3.6)}
                rounded={theme.radius.md}
                style={{ borderWidth: 2, width: wp(6.5) }}
              />
            </Pressable>
          </View>
        </View>

        {/* posts display */}
        <FlatList
          data={posts}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listStyle}
          keyExtractor={(item: any) => item?.id.toString()}
          renderItem={({ item }: { item: any }) => (
            <PostCard
              item={item}
              currentUser={user}
              router={router}
              showMoreIcon={true}
            />
          )}
          onEndReached={() => {
            getPosts();
          }}
          onEndReachedThreshold={0}
          ListFooterComponent={
            hasMore ? (
              <View style={{ marginVertical: posts.length == 0 ? 200 : 30 }}>
                <Loading />
              </View>
            ) : (
              <View style={{ marginVertical: 30 }}>
                <Text style={styles.noPost}>end of posts</Text>
              </View>
            )
          }
        />
      </View>
    </ScreenWrapper>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //paddingHorizontal: wp(4),
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
    borderCurve: "continuous",
    borderColor: theme.colors.gray,
    borderWidth: 3,
  },
  icons: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 18,
  },
  listStyle: {
    padding: 20,
    //paddingHorizontal: wp(4),
  },
  noPost: {
    fontSize: hp(2),
    textAlign: "center",
    color: theme.colors.text,
  },
  pill: {
    position: "absolute",
    right: -10,
    top: -4,
  },
});

