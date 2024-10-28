import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import { Stack, useRouter } from 'expo-router'
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { getUserData } from '@/services/userService';

const _layout = () => {
  return(
    <AuthProvider>
      <MainLayout/>
    </AuthProvider>
  );
}

const MainLayout = () => {

  const {setAuth, setUserData, user} = useAuth();
  const router = useRouter();

  const updateUserData = async (user:any) => {
    let res = await getUserData(user.id);

    if(res.success)
    {
      setUserData(res.data);
    }
  }

  useEffect(() => {
    supabase.auth.onAuthStateChange((_event, session) => {
      console.log(session?.user);

      if(session)
      {
        setAuth(session.user);
        updateUserData(session.user);
        router.replace('/home');
        
      }else
      {
        setAuth(null);
        router.replace('/welcome');
      }
    })
  },[])

  return (
    <Stack
        screenOptions={{
            headerShown: false
        }}
    />
  )
}

export default _layout