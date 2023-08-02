import React, {useState, useCallback} from 'react';
import {StyleSheet, View, TextInput, Text, Button, Alert} from 'react-native';
import {useMutation} from '@tanstack/react-query';

import {login} from '../services/queryFunctions';
import {useTokenStore} from '../store/useTokenStore';
import {storage} from '../..';

export default function LoginScreen({navigation}) {
  const [data, setData] = useState({
    email: '',
    password: '',
  });
  const {setToken} = useTokenStore();
  const {mutate, isLoading} = useMutation({
    mutationFn: login,
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

  const onPressLogin = useCallback(() => {
    mutate({
      email: data.email,
      password: data.password,
    });
  }, [mutate, data.email, data.password]);

  const onPressRegister = useCallback(() => {
    navigation.navigate('RegisterScreen');
  }, [navigation]);

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
      <Button title="Login" onPress={onPressLogin} disabled={isLoading} />
      <Text style={styles.questionText}>Didn't have an account?</Text>
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
  questionText: {
    textAlign: 'center',
    fontSize: 10,
    color: 'black',
    marginVertical: 12,
  },
});
