import React, {useCallback} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import FastImage from 'react-native-fast-image';
import {useNavigation} from '@react-navigation/native';
import {useMutation, useQueryClient} from '@tanstack/react-query';

import CustomButton from './CustomButton';
import {deleteUser} from '../services/queryFunctions';

export default function UserCardComponent(props) {
  const {data} = props;
  const navigation = useNavigation();
  const queryClient = useQueryClient();
  const {mutate} = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.setQueryData(['users'], old => {
        const mapData = old.pages.map(page => {
          const del = page.data.filter(item => item.id !== data.id);
          return {
            ...page,
            data: del,
          };
        });
        return {...old, pages: [...mapData]};
      });
    },
  });

  const onPressEdit = useCallback(() => {
    navigation.navigate('EditUserScreen', {user: data});
  }, [navigation, data]);

  const onPressDelete = useCallback(() => {
    mutate({id: data.id});
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
      <View style={styles.textRow}>
        <Text style={styles.nameText}>
          {`${data.first_name} ${data.last_name}`}
        </Text>
        <Text style={styles.emailText}>{data.email}</Text>
      </View>
      <View style={styles.buttonRow}>
        <CustomButton title="Edit" onPress={onPressEdit} />
        <View style={styles.spacer} />
        <CustomButton title="Delete" variant="danger" onPress={onPressDelete} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 3,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.18,
    shadowRadius: 4.59,
    elevation: 5,
    marginTop: 8,
  },
  avatar: {
    height: 64,
    width: 64,
    borderRadius: 100,
    backgroundColor: 'grey',
  },
  textRow: {
    paddingLeft: 16,
    flex: 3,
  },
  nameText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonRow: {
    paddingLeft: 16,
    flex: 1,
  },
  spacer: {
    height: 8,
  },
  emailText: {
    color: 'grey',
    fontSize: 12,
  },
});
