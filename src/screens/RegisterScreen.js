import React, {useState, useCallback} from 'react';
import {StyleSheet, View, TextInput, Button, Alert} from 'react-native';
import {useMutation} from '@tanstack/react-query';

import {register} from '../services/queryFunctions';
import {useTokenStore} from '../store/useTokenStore';
import {storage} from '../..';

export default function RegisterScreen() {
  const [data, setData] = useState({
    email: '',
    password: '',
  });
  const {setToken} = useTokenStore();
  const {mutate, isLoading} = useMutation({
    mutationFn: register,
    onSuccess: res => {
      storage.set('token', res.token);
      setToken(res.token);
    },
    onError: () => {
      Alert.alert('Oops..', 'Something went wrong');
    },
  });

  const onChangeEmail = useCallback(email => {
    setData(prevData => ({
      ...prevData,
      email,
    }));
  }, []);

  const onChangePassword = useCallback(password => {
    setData(prevData => ({
      ...prevData,
      password,
    }));
  }, []);

  const onPressRegister = useCallback(() => {
    mutate({
      email: data.email,
      password: data.password,
    });
  }, [mutate, data.email, data.password]);

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Email"
        onChangeText={onChangeEmail}
        value={data.email}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        placeholder="Password"
        onChangeText={onChangePassword}
        value={data.password}
        secureTextEntry
        autoCapitalize="none"
      />
      <Button title="Register" onPress={onPressRegister} disabled={isLoading} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 16,
  },
});
