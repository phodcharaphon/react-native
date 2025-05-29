import { Kanit_300Light, Kanit_700Bold, useFonts } from '@expo-google-fonts/kanit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ImageBackground,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

import CustomAlert from '@/components/Customalert';
import { Feather } from '@expo/vector-icons';

export default function Login() {
    const router = useRouter();
    // const API_BASE_URL = Platform.select({
    //     android: 'https://bandee-erp.com/',  // Android Emulator
    //     ios: 'https://bandee-erp.com/',     // iOS Simulator
    //     default: 'https://bandee-erp.com/'  // Browser หรืออื่นๆ
    // });
        const API_BASE_URL = Platform.select({
        android: 'http://10.0.2.2/cms/',  // Android Emulator
        ios: 'http://localhost/cms/',     // iOS Simulator
        default: 'http://localhost/cms/'  // Browser หรืออื่นๆ
    });
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [showPassword, setShowPassword] = useState(false);

    // โหลด font Kanit-Light
    const [fontsLoaded] = useFonts({
        Kanit_300Light,
        Kanit_700Bold,
    });

    // state ของ custom alert
    const [alertVisible, setAlertVisible] = useState<boolean>(false);
    const [alertTitle, setAlertTitle] = useState<string>('');
    const [alertMessage, setAlertMessage] = useState<string>('');

    useEffect(() => {
        const checkToken = async () => {
            const token = await AsyncStorage.getItem('accessToken');
            if (token) {
                router.replace('/Home');  // ใช้ replace เพื่อไม่ให้ย้อนกลับมาหน้านี้ได้
            }
        };
        checkToken();
    }, []);

    if (!fontsLoaded) {
        return null;
    }

    const showAlert = (title: string, message: string) => {
        setAlertTitle(title);
        setAlertMessage(message);
        setAlertVisible(true);
    };

    const handleLogin = async () => {
        if (!username || !password) {
            showAlert('แจ้งเตือน', 'กรุณากรอกชื่อผู้ใช้และรหัสผ่าน');
            setAlertVisible(true);
            setTimeout(() => setAlertVisible(false), 3000);
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}classes/Login.php?f=login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            const result = await response.json();
            console.log('Login response:', result);

            if ((result.status === 'success' || result.status === 'success_old_password') && result.accessToken && result.user) {
                await AsyncStorage.setItem('accessToken', result.accessToken);

                const welcomeMessage = result.status === 'success_old_password'
                    ? `ยินดีต้อนรับ ${result.user.username}. ${result.message}`
                    : `ยินดีต้อนรับ ${result.user.username}`;

                showAlert('เข้าสู่ระบบสำเร็จ', welcomeMessage);
                setAlertVisible(true);

                setTimeout(() => {
                    setAlertVisible(false);
                    router.push('/Home');
                }, 2000);
            } else {
                showAlert('เข้าสู่ระบบไม่สำเร็จ', result.message || 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
                setAlertVisible(true);
                setTimeout(() => setAlertVisible(false), 3000);
            }
        } catch (error) {
            console.error('Login error:', error);
            showAlert('เกิดข้อผิดพลาด', 'ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้');
            setAlertVisible(true);
            setTimeout(() => setAlertVisible(false), 3000);
        }
    };

    return (
        <>
            <ImageBackground
                source={require('@/assets/images/mobile.jpg')} // เปลี่ยนชื่อไฟล์ตามจริง
                style={styles.backgroundImage}
                resizeMode="cover"
                blurRadius={2} // ละลายภาพพื้นหลังเล็กน้อย (ถ้าต้องการ)
            >
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                    style={styles.container}
                >

                    <View style={styles.formWrapper}>
                        <Text style={styles.title}>เข้าสู่ระบบ</Text>

                        {/* ช่องชื่อผู้ใช้ */}
                        <View style={styles.inputWrapper}>
                            <TextInput
                                style={[styles.input, { flex: 1 }]}
                                placeholder="ชื่อผู้ใช้"
                                placeholderTextColor="#999"
                                autoCapitalize="none"
                                value={username}
                                onChangeText={setUsername}
                            />
                            <TouchableOpacity>
                                <Feather name="user" size={20} color="#999" style={{ padding: 8 }} />
                            </TouchableOpacity>
                        </View>

                        {/* ช่องรหัสผ่าน */}
                        <View style={styles.inputWrapper}>
                            <TextInput
                                style={[styles.input, { flex: 1 }]}
                                placeholder="รหัสผ่าน"
                                placeholderTextColor="#999"
                                secureTextEntry={!showPassword}
                                value={password}
                                onChangeText={setPassword}
                            />
                            <TouchableOpacity onPress={() => setShowPassword(prev => !prev)}>
                                <Text style={{ padding: 8 }}>
                                    {showPassword ? '🙈' : '👁️'}
                                </Text>
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity style={styles.button} onPress={handleLogin}>
                            <Text style={styles.buttonText}>เข้าสู่ระบบ</Text>
                        </TouchableOpacity>
                    </View>

                </KeyboardAvoidingView>
            </ImageBackground>

            {/* Custom Alert */}
            <CustomAlert
                visible={alertVisible}
                onClose={() => setAlertVisible(false)}
                title={alertTitle}
                message={alertMessage}
            />
        </>
    );
}

const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        backgroundColor: 'rgba(0,0,0,0.3)', // เพื่อให้พื้นหลังยังเห็นภาพ
    },
    logo: {
        width: 100,
        height: 100,
        marginBottom: 24,
        resizeMode: 'contain',
    },
    title: {
        fontSize: 42,
        marginBottom: 24,
        color: '#333',
        fontFamily: 'Kanit_700Bold',
    },
    formWrapper: {
        width: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0.85)',
        borderRadius: 16,
        padding: 20,
        alignItems: 'center',
        // ขอบบางสวยงาม
        borderWidth: 1,
        borderColor: '#ddd',
        // Shadow for iOS
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 6,
        // Shadow for Android
        // elevation: 5,
    },
    inputWrapper: {
        width: '100%',
        backgroundColor: '#fff',
        borderRadius: 12,
        paddingVertical: 8,
        paddingHorizontal: 12,
        marginBottom: 16,
        flexDirection: 'row',
        alignItems: 'center',
        // เพิ่มจากเดิม:
        justifyContent: 'space-between',
        // ขอบบางสวยงาม
        borderWidth: 1,
        borderColor: '#ddd',

        // เงาเบาๆ (iOS)
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,

        // เงาสำหรับ Android
        elevation: 2,
    },
    input: {
        fontSize: 16,
        fontFamily: 'Kanit_300Light',
        color: '#333',
        height: 36, // กำหนดความสูงที่แน่นอน
        padding: 0, // ไม่มี padding ซ้ำซ้อน
        backgroundColor: 'transparent',
    },
    button: {
        width: '100%',
        height: 50,
        backgroundColor: '#007AFF',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 8,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontFamily: 'Kanit_300Light',
    },
});
