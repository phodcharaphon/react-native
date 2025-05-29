import { Stack, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Calendar, DateData, LocaleConfig } from 'react-native-calendars';

// ตั้งค่าภาษาไทย
LocaleConfig.locales['th'] = {
  monthNames: [
    'มกราคม',
    'กุมภาพันธ์',
    'มีนาคม',
    'เมษายน',
    'พฤษภาคม',
    'มิถุนายน',
    'กรกฎาคม',
    'สิงหาคม',
    'กันยายน',
    'ตุลาคม',
    'พฤศจิกายน',
    'ธันวาคม',
  ],
  monthNamesShort: [
    'ม.ค.',
    'ก.พ.',
    'มี.ค.',
    'เม.ย.',
    'พ.ค.',
    'มิ.ย.',
    'ก.ค.',
    'ส.ค.',
    'ก.ย.',
    'ต.ค.',
    'พ.ย.',
    'ธ.ค.',
  ],
  dayNames: [
    'อาทิตย์',
    'จันทร์',
    'อังคาร',
    'พุธ',
    'พฤหัสบดี',
    'ศุกร์',
    'เสาร์',
  ],
  dayNamesShort: ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'],
  today: 'วันนี้',
};
LocaleConfig.defaultLocale = 'th';

const API_BASE_URL = Platform.select({
  android: 'https://bandee-erp.com',
  ios: 'https://bandee-erp.com',
  default: 'https://bandee-erp.com',
});

interface BookingDate {
  id: string;
  number: string;
  branch: string;
  agent_name: string;
  driver_display: string;
  date: string;
}

interface ApiResponse {
  status: 'success' | 'error';
  data?: Record<string, BookingDate[]>;
  message?: string;
}

// ฟังก์ชันแปลงปี ค.ศ. เป็น พ.ศ.
function formatThaiYear(year: number) {
  return year + 543;
}

export default function Booking() {
  const router = useRouter();
  // กำหนด type ของ markedDates ให้ชัดเจน
  const [markedDates, setMarkedDates] = useState<Record<
    string,
    {
      marked?: boolean;
      dotColor?: string;
      selected?: boolean;
      selectedColor?: string;
      selectedTextColor?: string;
      activeOpacity?: number;
      disableTouchEvent?: boolean;
    }
  >>({});

  const [eventsByDate, setEventsByDate] = useState<Record<string, BookingDate[]>>(
    {}
  );

  const [loading, setLoading] = useState(true);

  // กำหนดวันที่เลือกไว้เริ่มต้นเป็นวันนี้เลย
  const todayString = new Date().toISOString().slice(0, 10);
  const [selectedDate, setSelectedDate] = useState<string>(todayString);

  const [currentMonth, setCurrentMonth] = useState<number>(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState<number>(new Date().getFullYear());

  useEffect(() => {
    fetchBookedDates();
  }, []);

  // ฟังก์ชันดึงข้อมูลวันจองจาก API
  const fetchBookedDates = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/classes/Vehicles.php?f=get_vehicles_book_calendar`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ApiResponse = await response.json();

      if (data.status === 'success' && data.data) {
        const marks: Record<string, any> = {};
        const eventsMap: Record<string, BookingDate[]> = {};

        Object.entries(data.data).forEach(([date, bookings]) => {
          // แน่ใจว่าใส่ date ใน booking ด้วย (ถ้า API ไม่ใส่มา)
          const bookingsWithDate = bookings.map((booking) => ({
            ...booking,
            date,
          }));

          eventsMap[date] = bookingsWithDate;

          marks[date] = {
            marked: true,
            dotColor: '#b8860b', // สีทองเข้ม
            activeOpacity: 0,
            disableTouchEvent: false,
          };
        });

        setMarkedDates(marks);
        setEventsByDate(eventsMap);

        // หากข้อมูลของวันนี้ไม่มี ให้ล้าง selectedDate
        if (!data.data[todayString]) {
          setSelectedDate('');
        }
      } else {
        alert(data.message ?? 'ข้อมูลไม่ถูกต้องจากเซิร์ฟเวอร์');
      }
    } catch (error) {
      console.error('เกิดข้อผิดพลาดในการดึงข้อมูลการจอง:', error);
      alert('ไม่สามารถดึงข้อมูลการจองได้ กรุณาลองใหม่อีกครั้ง');
    } finally {
      setLoading(false);
    }
  };

  const handleDayPress = (day: DateData) => {
    setSelectedDate(day.dateString);
  };

  const onMonthChange = (month: { year: number; month: number }) => {
    setCurrentMonth(month.month - 1);
    setCurrentYear(month.year);
    setSelectedDate(''); // ล้างวันที่เลือกเมื่อเปลี่ยนเดือน
  };

  // แสดงหัวปฏิทินแบบกำหนดเอง (ภาษาไทย พร้อมปี พ.ศ.)
  const renderCustomHeader = () => {
    const monthName = LocaleConfig.locales['th'].monthNames[currentMonth];
    const thaiYear = formatThaiYear(currentYear);
    return (
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>{`${monthName} ${thaiYear}`}</Text>
      </View>
    );
  };

  const bookingsForSelectedDate = eventsByDate[selectedDate] || [];

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        {/* ปุ่มย้อนกลับ */}
        <Text
          onPress={() => router.back()}
          style={styles.backButton}
        >
          ← ย้อนกลับ
        </Text>
        {loading ? (
          <ActivityIndicator size="large" color="#b8860b" />
        ) : (
          <>
            <Text style={styles.title}>ปฏิทินการจองรถ</Text>
            <Calendar
              onDayPress={handleDayPress}
              markedDates={{
                ...markedDates,
                ...(selectedDate
                  ? {
                    [selectedDate]: {
                      ...markedDates[selectedDate],
                      selected: true,
                      selectedColor: '#ffd700', // สีทองสว่าง
                      selectedTextColor: '#5b3700',
                    },
                  }
                  : {}),
              }}
              onMonthChange={onMonthChange}
              renderHeader={renderCustomHeader}
              firstDay={1}
              theme={{
                backgroundColor: '#fff8dc',
                calendarBackground: '#fff8dc',
                textSectionTitleColor: '#b8860b',
                selectedDayBackgroundColor: '#ffd700',
                selectedDayTextColor: '#5b3700',
                todayTextColor: '#daa520',
                dayTextColor: '#6b4c00',
                textDisabledColor: '#d9c68c',
                dotColor: '#b8860b',
                selectedDotColor: '#5b3700',
                arrowColor: '#b8860b',
                monthTextColor: '#b8860b',
                indicatorColor: '#b8860b',
                textDayFontWeight: '700',
                textMonthFontWeight: '900',
                textDayHeaderFontWeight: '700',
                textDayFontSize: 16,
                textMonthFontSize: 24,
                textDayHeaderFontSize: 16,
              }}
              style={styles.calendar}
            />

            <View style={styles.bookingInfoContainer}>
              {selectedDate ? (
                <>
                  <Text style={styles.bookingInfoTitle}>
                    รายการจองวันที่ {new Date(selectedDate).toLocaleDateString('th-TH', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })} (
                    {LocaleConfig.locales['th'].dayNames[new Date(selectedDate).getDay()]})
                  </Text>
                  {bookingsForSelectedDate.length > 0 ? (
                    <ScrollView style={{ maxHeight: 250, marginTop: 10 }}>
                      {bookingsForSelectedDate.map((booking) => (
                        <View key={booking.id} style={styles.bookingCard}>
                          <Text style={styles.bookingNumber}>
                            🚗 รถเลขที่: {booking.number} ({booking.branch})
                          </Text>
                          <Text style={styles.bookingAgent}>👤 ผู้จอง: {booking.agent_name}</Text>
                          <Text style={styles.bookingDriver}>🚙 คนขับรถ: {booking.driver_display}</Text>
                        </View>
                      ))}
                    </ScrollView>
                  ) : (
                    <Text style={styles.noBookingText}>ไม่มีข้อมูลการจองในวันนี้</Text>
                  )}
                </>
              ) : (
                <Text style={styles.noBookingText}>โปรดเลือกวันที่เพื่อดูข้อมูลการจอง</Text>
              )}
            </View>
          </>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff8dc',
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  title: {
    fontSize: 30,
    fontWeight: '900',
    color: '#b8860b',
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: Platform.OS === 'ios' ? 'HelveticaNeue-Bold' : 'Roboto',
    textShadowColor: '#e6c200aa',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
  calendar: {
    borderRadius: 20,
    elevation: 8,
    shadowColor: '#b8860b',
    shadowOpacity: 0.4,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 10 },
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  headerContainer: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f0e68c',
    marginBottom: 12,
    alignItems: 'center',
    backgroundColor: '#fffbea',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: '900',
    color: '#b8860b',
    textShadowColor: '#d4af37aa',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 6,
  },
  bookingInfoContainer: {
    marginTop: 28,
    padding: 20,
    borderRadius: 20,
    backgroundColor: '#fffbea',
    minHeight: 140,
    shadowColor: '#d4af37aa',
    shadowOpacity: 0.35,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
  },
  bookingInfoTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#b8860b',
    marginBottom: 14,
    textShadowColor: '#d4af37aa',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 6,
  },
  bookingCard: {
    padding: 12,
    borderRadius: 10,
    marginBottom: 14,
    backgroundColor: '#fff8dc',
    borderWidth: 1,
    borderColor: '#b8860b',
  },
  bookingNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#8b6508',
  },
  bookingAgent: {
    fontSize: 16,
    color: '#6b4c00',
    marginTop: 6,
  },
  bookingDriver: {
    fontSize: 16,
    color: '#6b4c00',
    marginTop: 2,
  },
  noBookingText: {
    fontSize: 18,
    fontWeight: '700',
    fontStyle: 'italic',
    color: '#b8860b99',
    textAlign: 'center',
  },
  backButton: {
    fontSize: 18,
    color: '#b8860b',
    top: 30,
    marginBottom: 30,
    fontWeight: '700',
  },
});
