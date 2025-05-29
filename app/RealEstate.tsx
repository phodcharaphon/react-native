import * as ImagePicker from 'expo-image-picker';
import { Stack, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

const API_BASE_URL = 'https://yourdomain.com/';

export default function RealEstate() {
  const router = useRouter();
  const [description, setDescription] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [showImage, setShowImage] = useState(true);

  // ขอสิทธิ์ตอน component mount
  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'สิทธิ์ถูกปฏิเสธ',
          'ต้องการสิทธิ์ในการเข้าถึงรูปภาพเพื่อเลือกภาพจากแกลเลอรี'
        );
      }
    })();
  }, []);

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images, // <-- แก้ตรงนี้
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setImageUri(result.assets[0].uri);
        setShowImage(true);
      }
    } catch (error) {
      console.error('Error picking image:', error);
    }
  };

  const removeImage = () => {
    Alert.alert(
      'ลบรูปภาพ',
      'คุณต้องการลบรูปภาพนี้หรือไม่?',
      [
        { text: 'ยกเลิก', style: 'cancel' },
        { text: 'ลบ', style: 'destructive', onPress: () => setImageUri(null) },
      ]
    );
  };

  const toggleShowImage = () => {
    setShowImage((prev) => !prev);
  };

  const handleSave = async () => {
    if (!description.trim()) {
      Alert.alert('แจ้งเตือน', 'กรุณากรอกรายละเอียด');
      return;
    }

    const formData = new FormData();
    formData.append('id', '3'); // แก้ไขตามจริง
    formData.append('agent_id', '5'); // แก้ไขตามจริง
    formData.append('description', description);

    if (imageUri) {
      const fileName = imageUri.split('/').pop() || 'image.jpg';
      const fileType = fileName.split('.').pop();

      formData.append('image', {
        uri: imageUri,
        name: fileName,
        type: `image/${fileType}`,
      } as any);
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}classes/Master.php?f=save_sup_edit_estate`,
        {
          method: 'POST',
          body: formData,
        }
      );

      const result = await response.json();
      console.log('ผลลัพธ์:', result);

      Alert.alert('ผลลัพธ์', result.msg || 'บันทึกสำเร็จ');
    } catch (error) {
      console.error('เกิดข้อผิดพลาด:', error);
      Alert.alert('ข้อผิดพลาด', 'การบันทึกล้มเหลว');
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        {/* ปุ่มย้อนกลับ */}
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← ย้อนกลับ</Text>
        </TouchableOpacity>

        <Text style={styles.title}>รายละเอียดงาน</Text>

        <TextInput
          style={styles.input}
          value={description}
          onChangeText={setDescription}
          placeholder="กรอกรายละเอียดงานที่นี่..."
          multiline
          numberOfLines={12}
          textAlignVertical="top"
          placeholderTextColor="#a1a1aa"
        />

        <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
          <Text style={styles.uploadButtonText}>เลือกรูปภาพ</Text>
        </TouchableOpacity>

        {imageUri && (
          <>
            <View style={styles.imageContainer}>
              {showImage ? (
                <Image source={{ uri: imageUri }} style={styles.imagePreview} />
              ) : (
                <View style={styles.imageHidden}>
                  <Text style={styles.imageHiddenText}>รูปภาพถูกซ่อน</Text>
                </View>
              )}

              <View style={styles.imageButtonsRow}>
                <TouchableOpacity
                  style={[styles.imageToggleButton, showImage ? styles.btnActive : styles.btnInactive]}
                  onPress={toggleShowImage}
                >
                  <Text style={styles.imageToggleText}>{showImage ? 'ซ่อนรูปภาพ' : 'แสดงรูปภาพ'}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.imageDeleteButton} onPress={removeImage}>
                  <Text style={styles.imageDeleteText}>ลบรูปภาพ</Text>
                </TouchableOpacity>
              </View>
            </View>
          </>
        )}

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>บันทึกข้อมูล</Text>
        </TouchableOpacity>
      </ScrollView>
    </>
  );
}

// (styles เหมือนเดิม)
const styles = StyleSheet.create({
  container: {
    padding: 25,
    backgroundColor: '#f0f4f8',
    flexGrow: 1,
  },
  backButton: {
    top: 20,
    alignSelf: 'flex-start',
    marginBottom: 25,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#dbeafe',
    shadowColor: '#3b82f6',
    shadowOpacity: 0.35,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 10,
    elevation: 6,
  },
  backButtonText: {
    fontSize: 17,
    color: '#1d4ed8',
    fontWeight: '600',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 20,
    fontFamily: 'System',
  },
  input: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 20,
    fontSize: 18,
    color: '#334155',
    shadowColor: '#0ea5e9',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 12,
    elevation: 10,
    marginBottom: 25,
    minHeight: 180,
    maxHeight: 220,
    textAlignVertical: 'top',
  },
  uploadButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 16,
    borderRadius: 30,
    marginBottom: 30,
    shadowColor: '#2563eb',
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 9 },
    shadowRadius: 14,
    elevation: 9,
  },
  uploadButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 20,
    textAlign: 'center',
    letterSpacing: 1,
  },
  imageContainer: {
    marginBottom: 35,
    borderRadius: 25,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: '#0ea5e9',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 20,
    elevation: 12,
    padding: 12,
  },
  imagePreview: {
    width: '100%',
    height: 280,
    borderRadius: 20,
    marginBottom: 10,
    resizeMode: 'cover',
  },
  imageHidden: {
    height: 280,
    borderRadius: 20,
    backgroundColor: '#cbd5e1',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  imageHiddenText: {
    color: '#64748b',
    fontSize: 18,
    fontStyle: 'italic',
  },
  imageButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  imageToggleButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 25,
    marginRight: 10,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnActive: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  btnInactive: {
    backgroundColor: '#fff',
    borderColor: '#2563eb',
  },
  imageToggleText: {
    fontWeight: '600',
    fontSize: 16,
    color: '#2563eb',
  },
  imageDeleteButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 25,
    backgroundColor: '#ef4444',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
    shadowColor: '#dc2626',
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 15,
    elevation: 9,
  },
  imageDeleteText: {
    fontWeight: '700',
    fontSize: 16,
    color: '#fff',
  },
  saveButton: {
    backgroundColor: '#22c55e',
    paddingVertical: 18,
    borderRadius: 30,
    shadowColor: '#16a34a',
    shadowOpacity: 0.45,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 20,
    elevation: 14,
  },
  saveButtonText: {
    color: '#ffffff',
    fontWeight: '900',
    fontSize: 22,
    textAlign: 'center',
    letterSpacing: 1,
  },
});
