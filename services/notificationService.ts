import { supabase } from "@/lib/supabase";

export const fetchNotifications = async (receiverId: any) => {
  try {
    const { data, error } = await supabase
      .from("notifications")
      .select(
        `*, 
             sender: senderId(id, name, image)`,
      )
      .eq("receiverId", receiverId)
      .order("created_at", { ascending: false });

    if (error) {
      console.log("fetch notifications error occured", error);
      return { success: false, msg: "fetch notifications failed" };
    }

    return { success: true, data: data };
  } catch (error) {
    console.log("fetch notifications error : ", error);
    return { success: false, msg: "could not fetch notifications" };
  }
};

export const createNotification = async (notification: any) => {
  try {
    const { data, error } = await supabase
      .from("notifications")
      .insert(notification)
      .select()
      .single();

    console.log("create notification : ", error);
    if (error) {
      console.log("notification error occured");
      return { success: false, msg: "notification post failed" };
    }

    return { success: true, data: data };
  } catch (error) {
    console.log("notification post error : ", error);
    return { success: false, msg: "notification failed" };
  }
};
