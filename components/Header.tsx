import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import BackButton from './BackButton'
import { useRouter } from 'expo-router'
import { theme } from '@/constants/theme'
import { hp } from '@/helpers/common'

const Header = ({title, showBackButton = true, mb=10, handleLogout}: {title:string, showBackButton: boolean, mb: number, handleLogout: any}) => {

    const router = useRouter();
    return (
    <View style={[styles.container, {marginBottom: mb}]}>
      {
        showBackButton && (
            <View style={styles.showBackButton}>
                <BackButton router={router}/>
            </View>
        )
      }
      <Text style={styles.title}>{title || ""}</Text>
    </View>
  )
}

export default Header

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 5,
        gap: 10
    },
    showBackButton: {
        position: 'absolute',
        left: 0,
    },
    title: {
        fontSize: hp(2.7),
        fontWeight: theme.fonts.semibold,
        color: theme.colors.textDark,
    }
})