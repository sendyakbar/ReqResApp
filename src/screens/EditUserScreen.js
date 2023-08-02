import React, {useState, useCallback} from 'react';
import {StyleSheet, View, TextInput, Button, Alert} from 'react-native';
import {useMutation, useQueryClient} from '@tanstack/react-query';

import {editUser} from '../services/queryFunctions';
import FastImage from 'react-native-fast-image';

export default function EditUserScreen({navigation, route}) {
  const {user} = route.params;
  const queryClient = useQueryClient();
  const [data, setData] = useState({
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
    avatar: user.avatar,
    id: user.id,
  });
  const {mutate, isLoading} = useMutation({
    mutationFn: editUser,
    onSuccess: ({data: res}) => {
      queryClient.setQueryData(['users'], old => {
        const mapData = old.pages.map(page => {
          const edit = page.data.map(item => {
            if (item.id === data.id) {
              return {...res};
            }
            return item;
          });
          return {
            ...page,
            data: edit,
          };
        });
        return {...old, pages: [...mapData]};
      });
      navigation.goBack();
      Alert.alert('Success', 'User data updated');
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

  const onPressSave = useCallback(() => {
    mutate(data);
  }, [mutate, data]);

  return (
    <View style={styles.container}>
      <FastImage
        source={{
          uri: data.avatar,
          priority: FastImage.priority.high,
        }}
        resizeMode="contain"
        style={styles.avatar}
      />
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
        title="Save"
        onPress={onPressSave}
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
  avatar: {
    height: 120,
    width: 120,
    borderRadius: 100,
    backgroundColor: 'grey',
    marginBottom: 16,
    alignSelf: 'center',
  },
});
