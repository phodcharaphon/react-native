import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stack, useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
    Animated,
    Dimensions,
    ImageBackground,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from 'react-native';

import Sidebar from '../components/Sidebar';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

export default function Home() {
  const router = useRouter();
  const [menuVisible, setMenuVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(-SCREEN_WIDTH * 0.75)).current;

  const openMenu = () => {
    setMenuVisible(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeMenu = () => {
    Animated.timing(slideAnim, {
      toValue: -SCREEN_WIDTH * 0.75,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setMenuVisible(false));
  };

  const toggleMenu = () => {
    if (menuVisible) closeMenu();
    else openMenu();
  };

  const handleBooking = () => {
    closeMenu();
    router.push('/booking');
  };

  const handleRealEstate = () => {
    closeMenu();
    router.push('/RealEstate');
  };

  const handleLogout = async () => {
    closeMenu();
    await AsyncStorage.removeItem('accessToken');
    router.push('/login');
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ImageBackground
        source={require('../assets/images/mobile.jpg')}
        style={styles.background}
        blurRadius={4}
      >
        <View style={styles.overlay}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>หน้าหลัก</Text>
            <TouchableOpacity onPress={toggleMenu} style={styles.menuButton}>
              <Ionicons name="menu" size={32} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Overlay ด้านหลังเมนู */}
          {menuVisible && (
            <TouchableWithoutFeedback onPress={closeMenu}>
              <View style={styles.menuOverlay} />
            </TouchableWithoutFeedback>
          )}

          {/* Sidebar Component */}
          {menuVisible && (
            <Sidebar
              slideAnim={slideAnim}
              onClose={closeMenu}
              onBooking={handleBooking}
              onLogout={handleLogout}
              onRealEstate={handleRealEstate}
            />
          )}

          {/* Body */}
          <View style={styles.content}>
            <Text style={styles.welcomeText}>ยินดีต้อนรับเข้าสู่ระบบ!</Text>
          </View>
        </View>
      </ImageBackground>
    </>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    paddingHorizontal: 10,
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  headerTitle: {
    fontSize: 28,
    color: '#fff',
    fontFamily: 'Kanit_300Light',
  },
  menuButton: {
    position: 'absolute',
    left: 0,
    padding: 12,
  },
  menuOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 8,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 20,
    color: '#fff',
    fontFamily: 'Kanit_300Light',
  },
});
