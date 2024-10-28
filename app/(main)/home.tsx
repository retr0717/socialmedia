import { Alert, StyleSheet, Text} from 'react-native'
import React from 'react'
import ScreenWrapper from '@/components/ScreenWrapper'
import Button from '@/components/Button'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'

const Home = () => {

    const {setAuth} = useAuth();

    const onLogout = async () => {
        
        await setAuth(null);

        const {error} = supabase.auth.signOut();

        if(error)
        {
            Alert.alert('Logout', 'Logout failed!');
        }
    }
    
  return (
    <ScreenWrapper bg={"white"}>
      <Text>Home</Text>
      <Button title={"logout"} onPress={onLogout}/>
    </ScreenWrapper>
  )
}

export default Home

const styles = StyleSheet.create({})