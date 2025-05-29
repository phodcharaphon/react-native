import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    Animated,
    Dimensions,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity
} from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

interface SidebarProps {
    slideAnim: Animated.Value;
    onClose: () => void;
    onBooking: () => void;
    onLogout: () => void;
    onRealEstate: () => void;
}

export default function Sidebar({
    slideAnim,
    onClose,
    onBooking,
    onLogout,
    onRealEstate,
}: SidebarProps) {
    return (
        <Animated.View
            style={[
                styles.menuContainer,
                { transform: [{ translateX: slideAnim }] },
            ]}
        >
            <TouchableOpacity onPress={onClose} style={styles.backButton}>
                <Ionicons name="arrow-back" size={28} color="#333" />
            </TouchableOpacity>

            <Image
                source={require('../assets/images/บ้านดี.png')}
                style={styles.menuImage}
                resizeMode="contain"
            />

            <TouchableOpacity onPress={onBooking} style={styles.menuItemBox}>
                <Text style={styles.menuText}>จองรถ</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={onRealEstate} style={styles.menuItemBox}>
                <Text style={styles.menuText}>ตรวจงาน</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={onLogout} style={styles.menuItemBox}>
                <Text style={styles.menuText}>ออกจากระบบ</Text>
            </TouchableOpacity>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    menuContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        height: SCREEN_HEIGHT,
        width: SCREEN_WIDTH * 0.75,
        backgroundColor: '#fff',
        paddingTop: 60,
        paddingHorizontal: 20,
        zIndex: 10,
        shadowColor: '#000',
        shadowOffset: { width: 3, height: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 20,
    },
    backButton: {
        position: 'absolute',
        top: 40,
        right: 15,
        padding: 6,
        zIndex: 15,
        borderRadius: 20,
        backgroundColor: '#eee',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 5,
    },
    menuImage: {
        width: 80,
        height: 80,
        alignSelf: 'center',
        marginBottom: 50,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: '#ddd',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 6,
    },
    menuItemBox: {
        paddingVertical: 16,
        paddingHorizontal: 10,
        marginBottom: 15,
        borderRadius: 12,
        backgroundColor: '#f7f7f7',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 2,
    },
    menuText: {
        fontSize: 18,
        color: '#333',
        fontFamily: 'Kanit_300Light',
    },
});
