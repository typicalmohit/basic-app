import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import ScreenWrapper from "@/components/ScreenWrapper";
import { theme } from "@/constants/theme";
import Toast from "@/components/Toast";
import { styles } from "@/styles/bookings";
import { Dropdown } from "react-native-element-dropdown";
import { format } from "date-fns";
import { getStatusColor } from "@/utils/statusColors";

interface Booking {
  id: string;
  user_id: string;
  from_location: string;
  to_location: string;
  departure_date: string;
  departure_time: string;
  arrival_date: string;
  arrival_time: string;
  customer_name: string;
  customer_contact: string;
  driver_name: string;
  driver_contact: string;
  owner_name: string;
  owner_contact: string;
  created_at: string;
  updated_at: string;
  money: number;
  advance: number;
  booking_status: string;
  payment_amount: number;
  payment_status: string;
  oil_status: string;
  return_type: "One-way" | "Both-ways";
  extras?: string;
}

const formatDateTime = (dateStr: string, timeStr: string) => {
  try {
    // For date
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      return { date: "Invalid date", time: "Invalid time" };
    }

    // For time
    const [hours, minutes] = timeStr.split(":");
    const time = new Date();
    time.setHours(parseInt(hours, 10), parseInt(minutes, 10));

    if (isNaN(time.getTime())) {
      return { date: format(date, "dd/MM/yyyy"), time: "Invalid time" };
    }

    return {
      date: format(date, "dd/MM/yyyy"),
      time: format(time, "HH:mm"),
    };
  } catch (error) {
    console.error("Date formatting error:", error);
    return { date: "Invalid date", time: "Invalid time" };
  }
};

const BookingCard = ({ booking }: { booking: Booking }) => {
  const router = useRouter();
  const departure = formatDateTime(
    booking.departure_date,
    booking.departure_time
  );
  const arrival = formatDateTime(booking.arrival_date, booking.arrival_time);

  return (
    <Pressable
      style={styles.bookingCard}
      onPress={() => router.push(`/bookings/${booking.id}`)}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.dateText}>{departure.date}</Text>
        <View
          style={[
            styles.statusBadge,
            {
              backgroundColor: getStatusColor(
                booking.booking_status,
                "booking"
              ),
            },
          ]}
        >
          <Text style={styles.statusText}>
            {booking.booking_status.toUpperCase()}
          </Text>
        </View>
      </View>

      <View style={styles.routeContainer}>
        <Text style={styles.locationText}>
          {booking.from_location} → {booking.to_location}
        </Text>
        <Text style={styles.returnTypeText}>
          {booking.return_type || "One-way"}
        </Text>
      </View>

      <View style={styles.customerInfo}>
        <Text style={styles.nameText}>{booking.customer_name}</Text>
        <Text style={styles.phoneText}>{booking.customer_contact}</Text>
      </View>

      <View style={styles.paymentInfo}>
        <Text style={styles.moneyText}>Total: ₹{booking.money}</Text>
        <View
          style={[
            styles.statusBadge,
            {
              backgroundColor: getStatusColor(
                booking.payment_status,
                "payment"
              ),
            },
          ]}
        >
          <Text style={styles.statusText}>
            {`PAYMENT ${booking.payment_status.toUpperCase()}`}
          </Text>
        </View>
      </View>

      <View style={styles.driverInfo}>
        <Text style={styles.driverText}>Driver: {booking.driver_name}</Text>
        <View
          style={[
            styles.statusBadge,
            {
              backgroundColor: getStatusColor(booking.oil_status, "oil"),
            },
          ]}
        >
          <Text style={styles.statusText}>
            {`OIL ${booking.oil_status.toUpperCase()}`}
          </Text>
        </View>
      </View>
    </Pressable>
  );
};

export default function BookingsScreen() {
  const { userProfile } = useAuth();
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedMonth, setSelectedMonth] = useState(
    format(new Date(), "MMMM")
  );
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const fetchBookings = async () => {
    try {
      if (!userProfile) return;

      let query = supabase
        .from("bookings")
        .select("*")
        .eq("user_id", userProfile.id)
        .order("departure_date", { ascending: false });

      const { data, error } = await query;

      if (error) throw error;

      setBookings(data || []);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      Toast.show({
        type: "error",
        message: "Failed to load bookings",
      });
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchBookings();
    }, [userProfile])
  );

  const groupBookingsByMonth = () => {
    const filteredBookings = bookings.filter((booking) => {
      const bookingDate = new Date(booking.departure_date);
      const bookingMonth = format(bookingDate, "MMMM");
      const bookingYear = bookingDate.getFullYear();

      return (
        (selectedMonth === "All" || bookingMonth === selectedMonth) &&
        bookingYear === selectedYear
      );
    });

    const grouped = filteredBookings.reduce((acc, booking) => {
      const month = format(new Date(booking.departure_date), "MMMM yyyy");
      if (!acc[month]) {
        acc[month] = [];
      }
      acc[month].push(booking);
      return acc;
    }, {} as Record<string, Booking[]>);

    return Object.entries(grouped).map(([month, bookings]) => ({
      month,
      bookings,
    }));
  };

  return (
    <ScreenWrapper bg="#d9cec1" hideHeader>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Pressable
            style={styles.backButton}
            onPress={() => router.push("/home")}
          >
            <MaterialIcons
              name="arrow-back"
              size={24}
              color={theme.colors.textDark}
            />
          </Pressable>
          <Text style={styles.headerTitle}>Bookings</Text>
        </View>
        <Pressable
          style={styles.addButton}
          onPress={() => router.push("/bookings/new")}
        >
          <MaterialIcons name="add" size={24} color="white" />
        </Pressable>
      </View>

      {/* Filters Card */}
      <View style={styles.filtersCard}>
        <View style={styles.filterItem}>
          <MaterialIcons
            name="event"
            size={20}
            color={theme.colors.textLight}
          />
          <View style={styles.pickerContainer}>
            <Dropdown
              style={styles.dropDownPicker}
              containerStyle={styles.dropDownContainer}
              data={[
                { label: "All Months", value: "All" },
                ...Array.from({ length: 12 }, (_, i) => ({
                  label: format(new Date(2020, i, 1), "MMMM"),
                  value: format(new Date(2020, i, 1), "MMMM"),
                })),
              ]}
              labelField="label"
              valueField="value"
              itemTextStyle={styles.dropDownItemText}
              value={selectedMonth}
              onChange={(item) => setSelectedMonth(item.value)}
              placeholder="Select Month"
              placeholderStyle={styles.dropDownText}
              selectedTextStyle={styles.dropDownText}
              maxHeight={200}
            />
          </View>
        </View>

        <View style={styles.filterDivider} />

        <View style={styles.filterItem}>
          <MaterialIcons
            name="calendar-today"
            size={20}
            color={theme.colors.textLight}
          />
          <View style={styles.pickerContainer}>
            <Dropdown
              style={styles.dropDownPicker}
              containerStyle={styles.dropDownContainer}
              data={Array.from({ length: 5 }, (_, i) => {
                const year = new Date().getFullYear() + i;
                return {
                  label: year.toString(),
                  value: year.toString(),
                };
              })}
              labelField="label"
              valueField="value"
              itemTextStyle={styles.dropDownItemText}
              value={selectedYear.toString()}
              onChange={(item) => setSelectedYear(parseInt(item.value))}
              placeholder="Select Year"
              placeholderStyle={styles.dropDownText}
              selectedTextStyle={styles.dropDownText}
              maxHeight={200}
            />
          </View>
        </View>
      </View>

      {/* Bookings List */}
      <ScrollView style={styles.container}>
        {bookings.length === 0 ? (
          <View style={styles.emptyStateContainer}>
            <Text style={styles.emptyStateText}>
              No bookings found for{" "}
              {selectedMonth === "All" ? "" : `${selectedMonth} `}
              {selectedYear}
            </Text>
          </View>
        ) : (
          groupBookingsByMonth().map((group) => (
            <View key={group.month} style={styles.monthGroup}>
              <Text style={styles.monthTitle}>{group.month}</Text>
              {group.bookings.map((booking) => (
                <BookingCard key={booking.id} booking={booking} />
              ))}
            </View>
          ))
        )}
      </ScrollView>
    </ScreenWrapper>
  );
}
