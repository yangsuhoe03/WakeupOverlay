import React, { useState, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, FlatList, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { CompositeNavigationProp } from '@react-navigation/native';
import { CommonActions } from '@react-navigation/native';

type RootTabParamList = {
  HomeTab: undefined;
  Stats: undefined;
  Settings: undefined;
};

type SettingsStackParamList = {
  ContentPlayer: undefined;
};

type NavigationProp = CompositeNavigationProp<
  NativeStackNavigationProp<SettingsStackParamList, 'ContentPlayer'>,
  BottomTabNavigationProp<RootTabParamList>
>;

const { height, width } = Dimensions.get('window');

const videos = [
  { id: '1', title: '영상 1' },
  { id: '2', title: '영상 2' },
  { id: '3', title: '영상 3' },
];

// 데이터는 영상 3개 + 마지막 완료 페이지 추가
const data = [...videos, { id: '4', title: '완료페이지' }];

const ContentPlayerScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleWakeUp = () => {
    Alert.alert(
      '일어나기',
      '일어나시겠습니까?',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '확인',
          onPress: () => {
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [
                  {
                    name: 'HomeTab',
                    state: {
                      index: 0,
                      routes: [{ name: 'Home' }],
                    },
                  },
                ],
              }),
            );
          },
        },
      ],
    );
  };

  const onViewRef = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  });
  const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 50 });

  const renderItem = ({ item, index }: { item: any; index: number }) => {
    if (index < 3) {
      return (
        <View style={[styles.page, { height }]}>
          <Text style={styles.videoText}>{item.title} 재생 중...</Text>
        </View>
      );
    }

    // 4번째 페이지 (index 3)
    return (
      <View style={[styles.page, { height, justifyContent: 'center', padding: 20 }]}>
        <Text style={styles.completeTitle}>영상 시청 완료!</Text>
        <Text style={styles.completeSub}>이제 일어날 시간입니다</Text>

        <TouchableOpacity style={styles.completeButton} onPress={handleWakeUp}>
          <Text style={styles.completeButtonText}>일어나기</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.completeButton, { backgroundColor: '#4A90E2' }]}>
          <Text style={styles.completeButtonText}>광고 보고 조금 더...</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.completeButton, { backgroundColor: '#888' }]}>
          <Text style={styles.completeButtonText}>5분 뒤에 깨워주기</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        snapToAlignment="start"
        decelerationRate="fast"
        bounces={false}
        onViewableItemsChanged={onViewRef.current}
        viewabilityConfig={viewConfigRef.current}
      />

      {/* 현재 페이지가 마지막 페이지가 아니면 고정된 일어나기 버튼 보여주기 */}
      {currentIndex !== data.length - 1 && (
        <TouchableOpacity style={styles.wakeButton} onPress={handleWakeUp}>
          <Text style={styles.wakeButtonText}>일어나기</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default ContentPlayerScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  page: {
    width,
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoText: {
    color: '#fff',
    fontSize: 20,
  },
  wakeButton: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    backgroundColor: '#FF3B30',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  wakeButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  completeTitle: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  completeSub: {
    color: '#ccc',
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  completeButton: {
    backgroundColor: '#FF3B30',
    paddingVertical: 14,
    borderRadius: 8,
    marginVertical: 8,
    alignItems: 'center',
  },
  completeButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});