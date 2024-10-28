import { Alert, Pressable, StatusBar, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useRef, useState } from 'react'
import ScreenWrapper from '@/components/ScreenWrapper'
import { useRouter } from 'expo-router'
import BackButton from '@/components/BackButton'
import { hp, wp } from '@/helpers/common'
import { theme } from '@/constants/theme'
import Input from '@/components/Input'
import Icon from '@/assets/icons/index'
import Button from '@/components/Button'

const login = () => {
    const router = useRouter();
    const emailRef = useRef("");
    const passwordRef = useRef("");
    const [loading, setLoading] = useState(false);

    const onSubmit = async () => {
        if(!emailRef.current || !passwordRef.current)
        {
            Alert.alert('Login','Please fill the fields!')
        }
    }

    return (
        <ScreenWrapper bg={"white"}>
            <StatusBar barStyle={"dark-content"}/>
            <View style={styles.container}>
                <BackButton size={25} router={router}/>

                <View>
                    <Text style={styles.welcomeText}>Hey,</Text>
                    <Text style={styles.welcomeText}>Welcome Back</Text>
                </View>

                {/*form*/}
                <View style={styles.form}>
                    <Text style={{fontSize: hp(1.5), color: theme.colors.text}}>
                        Please login to continue
                    </Text>
                    <Input
                        icon={<Icon name='mail' size={26} strokeWidth={1.6}/>}
                        placeholder='Enter the email'
                        onChangeText={(value:any) => emailRef.current = value}
                    />
                    <Input
                        icon={<Icon name='lock' size={26} strokeWidth={1.6}/>}
                        placeholder='Enter the password'
                        onChangeText={(value:any) => passwordRef.current = value}
                        secureTextEntry
                    />

                    <TextInput style={styles.forgotPassword}>
                        Forgot Password?
                    </TextInput>

                    {/*submit button */}
                    <Button title={'Login'} loading={loading} onPress={onSubmit} hasShadow={true}/>

                    {/*footer*/}
                    <View style={styles.footer}>
                        <Text style={styles.footerText}>
                            Don't have an account?
                        </Text>
                        <Pressable onPress={() => router.push('/signup')}>
                            <Text style={[styles.footerText,
                                {   color: theme.colors.primaryDark,
                                    fontWeight: "600"
                                }
                            ]}>
                                Sign up
                            </Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </ScreenWrapper>
    )
}

export default login;

const styles = StyleSheet.create({
    container:{
        flex: 1,
        gap: 45,
        paddingHorizontal:wp(5)
    },
    welcomeText: {
        fontSize: hp(4),
        fontWeight: '700',
        color: theme.colors.text
    },
    form: {
        gap: 25,
    },
    forgotPassword: {
        textAlign: 'right',
        fontWeight: '600',
        color: theme.colors.text
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 5,
    },
    footerText: {
        textAlign: 'center',
        color: theme.colors.text,
        fontSize: hp(1.6)
    }
})