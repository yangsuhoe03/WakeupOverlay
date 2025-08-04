import React from 'react';
import { View, Button, NativeModules, StyleSheet } from 'react-native';

const { OverlayModule } = NativeModules;

const HomeScreen = () => {
  const startOverlay = () => {
    OverlayModule.startOverlay();
  };

  const stopOverlay = () => {
    OverlayModule.stopOverlay();
  };

  return (
    <View style={styles.container}>
      <Button title="Start Overlay" onPress={startOverlay} />
      <View style={styles.space} />
      <Button title="Stop Overlay~" onPress={stopOverlay} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  space: {
    height: 20,
  },
});

export default HomeScreen;