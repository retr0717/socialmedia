import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  createComment,
  fetchPostsDetails,
  removeComment,
  removePost,
} from "@/services/postService";
import { hp, wp } from "@/helpers/common";
import { theme } from "@/constants/theme";
import PostCard from "@/components/PostCard";
import { useAuth } from "@/contexts/AuthContext";
import Loading from "@/components/Loading";
import Input from "@/components/Input";
import Icon from "@/assets/icons";
import CommentItem from "@/components/CommentItem";
import { supabase } from "@/lib/supabase";
import { getUserData } from "@/services/userService";
import { createNotification } from "@/services/notificationService";

const PostDetails = () => {
  const { postId, commentId } = useLocalSearchParams();
  const [post, setPost] = useState(null);
  const [statLoading, setStartLoading] = useState(true);
  const inputRef = useRef(null);
  const commentRef = useRef(null);
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleNewComment = async (payload: any) => {
    if (payload.new) {
      let newComment = { ...payload.new };
      let res = await getUserData(newComment.userId);
      newComment.user = res.success ? res.data : {};
      setPost((prevPost: any) => {
        return {
          ...prevPost,
          comments: [newComment, ...prevPost.comments],
        };
      });
    }
  };

  useEffect(() => {
    let postChannel = supabase
      .channel("comments")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "comments",
          filter: `postId=eq.${postId}`,
        },
        handleNewComment,
      )
      .subscribe();

    getPostDetails();

    return () => {
      supabase.removeChannel(postChannel);
    };
  }, []);

  const getPostDetails = async () => {
    let res = await fetchPostsDetails(postId);
    if (res.success) setPost(res?.data);

    setStartLoading(false);
  };

  const onNewComment = async () => {
    if (!commentRef.current) return null;
    let data = {
      userId: user?.id,
      postId: post?.id,
      text: commentRef.current,
    };

    setLoading(true);
    const res = await createComment(data);
    setLoading(false);

    if (res.success) {
      //send notification.
      if (user.id != post.userid) {
        let notify = {
          senderId: user?.id,
          receiverId: post?.userid,
          title: "commented on your post",
          data: JSON.stringify({ postId: post?.id, commentId: res?.data?.id }),
        };

        createNotification(notify);
      }

      inputRef.current?.clear();
      commentRef.current = "";
    } else {
      Alert.alert("Comment", res.msg);
    }
  };

  if (statLoading) {
    return (
      <View style={styles.center}>
        <Loading />
      </View>
    );
  }

  if (!post) {
    return (
      <View
        style={[
          styles.center,
          { justifyContent: "flex-start", marginTop: 100 },
        ]}
      >
        <Text style={styles.notFound}>Post Not Found!</Text>
      </View>
    );
  }

  const onDeleteComment = async (comment: any) => {
    const res = await removeComment(comment?.id);

    if (res.success) {
      setPost((prevPost: any) => {
        let updatePost = { ...prevPost };

        updatePost.comments = updatePost.comments.filter(
          (item: any) => item.id != comment.id,
        );

        return updatePost;
      });
    } else {
      Alert.alert("Comment", "Something Went Wrong!");
    }
  };

  const onDeletePost = async (item: any) => {
    const res = await removePost(post?.id);

    if (res.success) {
      router.back();
    } else {
      Alert.alert("Post", "Something Went Wrong!");
    }
  };

  const onEditPost = async (item: any) => {
    router.back();
    router.push({ pathname: "NewPost", params: { ...item } });
  };

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
      >
        <PostCard
          item={{ ...post, comments: [{ count: post?.comments?.length }] }}
          currentUser={user}
          router={router}
          hasShadow={false}
          showMoreIcon={false}
          showDelete={true}
          onDelete={onDeletePost}
          onEdit={onEditPost}
        />

        {/* comment input */}
        <View style={styles.inputContainer}>
          <Input
            inputRef={inputRef}
            onChangeText={(value: any) => (commentRef.current = value)}
            placeholder={"Type something..."}
            placeholderTextColor={theme.colors.textLight}
            containerStyle={{
              flex: 1,
              height: hp(6.2),
              borderRadius: theme.radius.xl,
            }}
          />

          {loading ? (
            <View>
              <Loading size="small" />
            </View>
          ) : (
            <TouchableOpacity style={styles.sendIcon} onPress={onNewComment}>
              <Icon name="send" color={theme.colors.primaryDark} />
            </TouchableOpacity>
          )}
        </View>

        <View style={{ marginVertical: 10, gap: 17 }}>
          {post?.comments?.map((comment: any) => {
            return (
              <CommentItem
                key={comment.id.toString()}
                item={comment}
                canDelete={user.id == comment.userId || user.id == post.userid}
                onDelete={onDeleteComment}
                highlight={comment?.id == commentId}
              />
            );
          })}

          {post?.comments?.length == 0 && (
            <Text style={{ color: theme.colors.text, marginLeft: 5 }}>
              Be the first to comment!
            </Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default PostDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingVertical: wp(7),
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  list: {
    paddingHorizontal: wp(4),
  },
  sendIcon: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 0.8,
    borderColor: theme.colors.primary,
    borderRadius: theme.radius.lg,
    borderCurve: "continuous",
    height: hp(5.8),
    width: hp(5.8),
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  notFound: {
    fontSize: hp(2.5),
    color: theme.colors.text,
    fontWeight: theme.fonts.medium,
  },
  loading: {
    height: hp(5.8),
    width: hp(5.8),
    justifyContent: "center",
    alignItems: "center",
    transform: [{ scale: 1.3 }],
  },
});
