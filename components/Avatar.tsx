import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { hp, wp } from "@/helpers/common";
import { theme } from "@/constants/theme";
import { Image } from "expo-image";
import { getUserImageSrc } from "@/services/imageService";

const Avatar = ({
  uri,
  size = hp(4.5),
  rounded = theme.radius.md,
  style = {},
}: {
  uri: string;
  size: number;
  rounded: number;
  style: any;
}) => {
  console.log(getUserImageSrc(uri));
  return (
    <Image
      source={getUserImageSrc(uri)}
      transition={100}
      style={[styles.avatar, { height: size, borderRadius: rounded }, style]}
    />
  );
};

export default Avatar;

const styles = StyleSheet.create({
  avatar: {
    borderCurve: "continuous",
    borderColor: theme.colors.darkLight,
    borderWidth: 1,
  },
});

