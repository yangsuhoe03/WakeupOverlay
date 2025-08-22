import React, { useEffect, useRef } from 'react';
import { Pressable, Animated, StyleSheet } from 'react-native';

type ToggleProps = {
  value: boolean;
  onChange: (val: boolean) => void;
};

const Toggle = ({ value, onChange }: ToggleProps) => {
  const offset = useRef(new Animated.Value(value ? 1 : 0)).current;

  // 애니메이션 실행
  useEffect(() => {
    Animated.timing(offset, {
      toValue: value ? 1 : 0,
      duration: 250,
      useNativeDriver: false,
    }).start();
  }, [value]);

  // 핸들 위치
  const handleTranslate = offset.interpolate({
    inputRange: [0, 1],
    outputRange: [2, 26],
  });

  // 배경 색상
  const backgroundColor = offset.interpolate({
    inputRange: [0, 1],
    outputRange: ['#ccc', '#c34cff'],
  });

  return (
    <Pressable onPress={() => onChange(!value)}>
      <Animated.View style={[styles.toggleBackground, { backgroundColor }]}>
        <Animated.View
          style={[
            styles.toggleHandle,
            { transform: [{ translateX: handleTranslate }] },
          ]}
        />
      </Animated.View>
    </Pressable>
  );
};

export default Toggle;

const styles = StyleSheet.create({
  toggleBackground: {
    width: 50,
    height: 26,
    borderRadius: 20,
    justifyContent: 'center',
    padding: 2,
  },
  toggleHandle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
  },
});