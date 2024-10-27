import { StatusBar, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import ScreenWrapper from '@/components/ScreenWrapper'
import { useRouter } from 'expo-router'
import BackButton from '@/components/BackButton'
import { hp, wp } from '@/helpers/common'
import { theme } from '@/constants/theme'

const Login = () => {
    const router = useRouter();

    return (
        <ScreenWrapper>
            <StatusBar barStyle={"dark-content"}/>
            <View style={styles.container}>
                <BackButton size={25} router={router}/>

                <View>
                    <Text style={styles.welcomeText}>Welcome</Text>
                </View>
            </View>
        </ScreenWrapper>
    )
}

export default Login;

const styles = StyleSheet.create({
    container:{
        flex: 1,
        gap: 45,
        paddingHorizontal:wp(5)
    },
    welcomeText: {
        fontSize: hp(4),
        fontWeight: theme.fonts.bold,
        color: theme.colors.text
    },
    form: {
        gap: 5,
    },

})