import React, {useEffect} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {storage} from '../..';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import RegisterScreen from '../screens/RegisterScreen';
import {useTokenStore} from '../store/useTokenStore';
import CreateUserScreen from '../screens/CreateUserScreen';
import EditUserScreen from '../screens/EditUserScreen';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const persistedToken = storage.getString('token');
  const {token, setToken} = useTokenStore();

  useEffect(() => {
    if (persistedToken) {
      setToken(persistedToken);
    }
  }, [persistedToken, setToken]);

  return (
    <Stack.Navigator>
      {!token ? (
        <>
          <Stack.Screen
            name="LoginScreen"
            component={LoginScreen}
            options={{
              // headerShown: false,
              title: 'Login',
            }}
          />
          <Stack.Screen
            name="RegisterScreen"
            component={RegisterScreen}
            options={{
              // headerShown: false,
              title: 'Register',
            }}
          />
        </>
      ) : (
        <>
          <Stack.Screen
            name="HomeScreen"
            component={HomeScreen}
            options={{
              // headerShown: false,
              title: 'Users',
            }}
          />
          <Stack.Screen
            name="CreateUserScreen"
            component={CreateUserScreen}
            options={{
              // headerShown: false,
              title: 'Add User',
            }}
          />
          <Stack.Screen
            name="EditUserScreen"
            component={EditUserScreen}
            options={{
              // headerShown: false,
              title: 'Edit User',
            }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}
