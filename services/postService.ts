import { supabase } from "@/lib/supabase";
import { uploadFile } from "./imageService";

export const removePost = async (postId: string) => {
  try {
    const { error } = await supabase.from("posts").delete().eq("id", postId);

    if (error) {
      console.log("remove post error occured");
      return { success: false, msg: "remove post failed" };
    }

    console.log(error);
    return { success: true };
  } catch (error) {
    console.log("post delete error : ", error);
    return { success: false, msg: "could not delete post" };
  }
};

export const removeComment = async (commentId: string) => {
  try {
    const { error } = await supabase
      .from("comments")
      .delete()
      .eq("id", commentId);

    if (error) {
      console.log("remove comment error occured");
      return { success: false, msg: "remove comment failed" };
    }

    return { success: true };
  } catch (error) {
    console.log("commet delete error : ", error);
    return { success: false, msg: "could not delete commet" };
  }
};

export const createComment = async (comment: any) => {
  try {
    const { data, error } = await supabase
      .from("comments")
      .insert(comment)
      .select()
      .single();

    if (error) {
      console.log("post comment insertion error occured");
      return { success: false, msg: "comment post failed" };
    }

    return { success: true, data: data };
  } catch (error) {
    console.log("comment post error : ", error);
    return { success: false, msg: "could not comment post" };
  }
};

export const fetchPostsDetails = async (postId: any) => {
  try {
    const { data, error } = await supabase
      .from("posts")
      .select(
        `*, 
             user:users(id, name, image), 
             postLikes(*), 
             comments(*, user:users(id, name, image))`,
      )
      .eq("id", postId)
      .order("created_at", { ascending: false, foreignTable: "comments" })
      .single();

    if (error) {
      console.log("fetch posts details error occured", error);
      return { success: false, msg: "fetch posts details failed" };
    }

    return { success: true, data: data };
  } catch (error) {
    console.log("fetch posts details error : ", error);
    return { success: false, msg: "could not fetch post details" };
  }
};

export const createPostLike = async (postLike: any) => {
  try {
    const { data, error } = await supabase
      .from("postLikes")
      .insert(postLike)
      .select()
      .single();

    if (error) {
      console.log("like post error occured");
      return { success: false, msg: "like post failed" };
    }

    return { success: true, data: data };
  } catch (error) {
    console.log("like post error : ", error);
    return { success: false, msg: "could not like post" };
  }
};

export const removePostLike = async (postId: any, userId: any) => {
  try {
    const { error } = await supabase
      .from("postLikes")
      .delete()
      .eq("userId", userId)
      .eq("postId", postId);

    if (error) {
      console.log("remove like error occured");
      return { success: false, msg: "remove like failed" };
    }

    return { success: true };
  } catch (error) {
    console.log("like post error : ", error);
    return { success: false, msg: "could not like post" };
  }
};

export const fetchPosts = async (limit = 10) => {
  try {
    const { data, error } = await supabase
      .from("posts")
      .select(
        "*, user: users (id, name, image), postLikes (*), comments (count)",
      )
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      console.log("fetch posts error occured");
      return { success: false, msg: "fetch posts failed" };
    }

    return { success: true, data: data };
  } catch (error) {
    console.log("fetch posts error : ", error);
    return { success: false, msg: "could not fetch posts" };
  }
};

export const createOrUpdatePost = async (post: any) => {
  try {
    if (post.file && typeof post.file == "object") {
      let isImage = post?.file?.type == "image";
      let folderName = isImage ? "postImages" : "postVideos";
      let fileResult = await uploadFile(folderName, post?.file?.uri, isImage);
      if (fileResult.success) post.file = fileResult.data;
      else return fileResult;
    }

    const { data, error } = await supabase
      .from("posts")
      .upsert(post)
      .select()
      .single();

    if (error) {
      console.log("create post error : ", error);
      return { success: false, msg: "could not create post" };
    }

    return { success: true, data: data };
  } catch (error) {
    console.log("create post error : ", error);
    return { success: false, msg: "could not create post" };
  }
};
