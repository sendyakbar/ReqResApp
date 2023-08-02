import React, {useCallback, useState} from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  Button,
  Alert,
  ActivityIndicator,
  Text,
} from 'react-native';
import {useMutation, useQueryClient} from '@tanstack/react-query';

import {createUser} from '../services/queryFunctions';

export default function CreateUserScreen({navigation}) {
  const queryClient = useQueryClient();
  const [data, setData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    avatar: 'https://reqres.in/img/faces/9-image.jpg',
  });
  const {mutate, isLoading} = useMutation({
    mutationFn: createUser,
    onSuccess: ({data: res}) => {
      queryClient.setQueryData(['users'], old => ({
        ...old,
        pages: [
          {
            data: [res],
            page: 0,
            per_page: 6,
            total: 13,
            total_pages: 3,
          },
          ...old.pages,
        ],
      }));
      navigation.goBack();
      Alert.alert('Success', 'New user added');
    },
  });

  const onChangeFirstName = useCallback(first_name => {
    setData(prevData => ({
      ...prevData,
      first_name,
    }));
  }, []);

  const onChangeLastName = useCallback(last_name => {
    setData(prevData => ({
      ...prevData,
      last_name,
    }));
  }, []);

  const onChangeEmail = useCallback(email => {
    setData(prevData => ({
      ...prevData,
      email,
    }));
  }, []);

  const onPressAddUser = useCallback(() => {
    mutate(data);
  }, [mutate, data]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#009688" />
        <Text style={styles.loadingText}>Processing...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="First Name"
        onChangeText={onChangeFirstName}
        value={data.first_name}
        autoCapitalize="words"
      />
      <TextInput
        placeholder="Last Name"
        onChangeText={onChangeLastName}
        value={data.last_name}
        autoCapitalize="words"
      />
      <TextInput
        placeholder="Email"
        onChangeText={onChangeEmail}
        value={data.email}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <Button
        title="Add User"
        onPress={onPressAddUser}
        disabled={
          isLoading || !data.first_name || !data.last_name || !data.email
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 16,
  },
  loadingText: {
    fontSize: 10,
    color: 'grey',
    fontStyle: 'italic',
    marginTop: 4,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
