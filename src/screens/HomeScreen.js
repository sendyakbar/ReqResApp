import React, {useLayoutEffect, useCallback, useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Button,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import {useInfiniteQuery} from '@tanstack/react-query';

import {storage} from '../..';
import {useTokenStore} from '../store/useTokenStore';
import {getAllUsers} from '../services/queryFunctions';
import UserCardComponent from '../components/UserCardComponent';

export default function HomeScreen({navigation}) {
  const {setToken} = useTokenStore();
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ['users'],
    queryFn: getAllUsers,
    initialData: {data: {pages: []}},
    getNextPageParam: lastPage => {
      if (lastPage.page === lastPage.total_pages) {
        return undefined;
      }
      return lastPage.page + 1;
    },
  });
  const [refreshing, setRefreshing] = useState(false);

  useLayoutEffect(() => {
    const onPressLogout = () => {
      storage.clearAll();
      setToken('');
    };

    const headerRight = () => {
      return <Button title="Logout" onPress={onPressLogout} />;
    };

    navigation.setOptions({
      headerRight,
    });
  }, [navigation, setToken]);

  const onPressAddUser = useCallback(() => {
    navigation.navigate('CreateUserScreen');
  }, [navigation]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    refetch();
    setRefreshing(false);
  }, [refetch]);

  const onEndReached = () => {
    if (hasNextPage) {
      fetchNextPage();
    }
  };

  const renderItem = useCallback(({item}) => {
    return <UserCardComponent data={item} />;
  }, []);

  const renderFooter = useCallback(() => {
    if (isFetchingNextPage) {
      return (
        <View style={styles.footerLoading}>
          <ActivityIndicator size={28} color="#009688" />
          <Text style={styles.loadingText}>Loading more data...</Text>
        </View>
      );
    }
    return null;
  }, [isFetchingNextPage]);

  return (
    <>
      {isFetching ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#009688" />
          <Text style={styles.loadingText}>Please wait...</Text>
        </View>
      ) : (
        <FlatList
          contentContainerStyle={styles.container}
          data={data.pages && data.pages.map(page => page.data).flat()}
          keyExtractor={(_, i) => String(i)}
          renderItem={renderItem}
          onEndReached={onEndReached}
          onEndReachedThreshold={0.3}
          refreshing={refreshing}
          onRefresh={onRefresh}
          ListFooterComponent={renderFooter}
        />
      )}
      <View style={styles.footerContainer}>
        <Button title="Add User" onPress={onPressAddUser} />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
  },
  footerContainer: {
    backgroundColor: 'white',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.21,
    shadowRadius: 7.68,
    elevation: 10,
    padding: 16,
  },
  footerLoading: {
    width: '100%',
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
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
