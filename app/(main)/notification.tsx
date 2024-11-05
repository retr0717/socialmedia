import { ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { fetchNotifications } from "@/services/notificationService";
import { hp, wp } from "@/helpers/common";
import { theme } from "@/constants/theme";
import ScreenWrapper from "@/components/ScreenWrapper";
import NotificationItem from "@/components/NotificationItem";
import { useRouter } from "expo-router";

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    getNotifications();
  }, []);

  const getNotifications = async () => {
    let res = await fetchNotifications(user.id);
    console.log("notifications: ", res.data);
    if (res.success) setNotifications(res?.data);
  };

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listStyle}
        >
          {notifications?.map((item: any) => {
            return (
              <NotificationItem item={item} key={item?.id} router={router} />
            );
          })}

          {notifications.length == 0 && (
            <Text style={styles.noData}>No Notifications yet</Text>
          )}
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
};

export default Notification;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: wp(4),
  },
  listStyle: {
    paddingVertical: 20,
    gap: 10,
  },
  noData: {
    fontSize: hp(1.8),
    fontWeight: theme.fonts.medium,
    color: theme.colors.text,
    textAlign: "center",
  },
});

