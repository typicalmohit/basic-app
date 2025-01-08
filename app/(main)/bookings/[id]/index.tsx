import React, { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { useLocalSearchParams, useRouter, useFocusEffect } from "expo-router";
import { supabase } from "@/lib/supabase";
import Toast from "@/components/Toast";
import ScreenWrapper from "@/components/ScreenWrapper";
import { theme } from "@/constants/theme";
import ViewBooking from "./view";

interface BookingData {
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
  return_type: string;
  extras?: string;
}

export default function BookingDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState<BookingData | null>(null);

  useFocusEffect(
    React.useCallback(() => {
      if (!id) {
        Toast.show({
          type: "error",
          message: "Invalid booking ID",
        });
        router.back();
        return;
      }
      fetchBookingDetails();
    }, [id])
  );

  const fetchBookingDetails = async () => {
    try {
      if (!id) return;

      const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .eq("id", id.toString())
        .single();

      if (error) throw error;
      if (data) {
        setBooking(data);
      }
    } catch (error) {
      console.error("Error fetching booking:", error);
      Toast.show({
        type: "error",
        message: "Failed to load booking details",
      });
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    router.push(`/bookings/${id}/edit`);
  };

  if (loading) {
    return (
      <ScreenWrapper bg="white" hideHeader>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </ScreenWrapper>
    );
  }

  if (!booking) {
    return null;
  }

  // Navigate to the edit screen when edit is pressed
  return (
    <ScreenWrapper bg="white" hideHeader>
      <View style={{ flex: 1 }}>
        {/* Use the ViewBooking component */}
        <ViewBooking
          booking={booking}
          onEdit={handleEdit}
          onBack={() => router.back()}
        />
      </View>
    </ScreenWrapper>
  );
}
