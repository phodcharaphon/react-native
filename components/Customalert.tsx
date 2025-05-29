import { Kanit_300Light, useFonts } from '@expo-google-fonts/kanit';
import React from 'react';
import {
    GestureResponderEvent,
    Modal,
    StyleSheet,
    Text,
    View
} from 'react-native';

interface CustomAlertProps {
    visible: boolean;
    onClose: (event?: GestureResponderEvent) => void;
    title: string;
    message: string;
}

export default function CustomAlert({
    visible,
    onClose,
    title,
    message,
}: CustomAlertProps) {
    const [fontsLoaded] = useFonts({
        Kanit_300Light,
    });

    if (!fontsLoaded) {
        return null;
    }

    return (
        <Modal
            transparent
            animationType="fade"
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.alertBox}>
                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.message}>{message}</Text>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    alertBox: {
        width: 300,
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        alignItems: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'normal',   // ใช้ normal เพราะฟอนต์ Light
        marginBottom: 10,
        fontFamily: 'Kanit_300Light',
    },
    message: {
        fontSize: 16,
        marginBottom: 20,
        textAlign: 'center',
        fontFamily: 'Kanit_300Light',
    },
});
