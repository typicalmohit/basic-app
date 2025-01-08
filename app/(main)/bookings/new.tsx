import React, { useState } from "react";
import { View, ScrollView, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { format } from "date-fns";
import { theme } from "@/constants/theme";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import Toast from "@/components/Toast";
import ScreenWrapper from "@/components/ScreenWrapper";
import Button from "@/components/Button";
import { renderInput, renderDateTimePicker } from "@/components/FormInputs";
import { styles } from "@/styles/bookings";

export default function NewBookingScreen() {
  const router = useRouter();
  const { session } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPicker, setShowPicker] = useState({
    departureDate: false,
    departureTime: false,
    arrivalDate: false,
    arrivalTime: false,
  });

  // Initialize with default values
  const [booking, setBooking] = useState({
    fromLocation: "",
    toLocation: "",
    departureDate: new Date(),
    departureTime: new Date(),
    arrivalDate: new Date(),
    arrivalTime: new Date(),
    customerName: "",
    customerContact: "",
    driverName: "",
    driverContact: "",
    ownerName: "",
    ownerContact: "",
    money: "",
    advance: "",
    paymentAmount: "",
    paymentStatus: "pending",
    bookingStatus: "booked",
    oilStatus: "pending",
    returnType: "One-way",
    extras: "",
  });

  const onDateChange = (
    event: any,
    selectedDate: Date | undefined,
    field: keyof typeof showPicker
  ) => {
    const currentDate = selectedDate || booking[field as keyof typeof booking];
    setShowPicker((prev) => ({ ...prev, [field]: false }));
    setBooking((prev) => ({
      ...prev,
      [field]: currentDate,
    }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.from("bookings").insert({
        from_location: booking.fromLocation,
        to_location: booking.toLocation,
        departure_date: format(booking.departureDate, "yyyy-MM-dd"),
        departure_time: format(booking.departureTime, "HH:mm:ss"),
        arrival_date: format(booking.arrivalDate, "yyyy-MM-dd"),
        arrival_time: format(booking.arrivalTime, "HH:mm:ss"),
        customer_name: booking.customerName,
        customer_contact: booking.customerContact,
        driver_name: booking.driverName,
        driver_contact: booking.driverContact,
        owner_name: booking.ownerName,
        owner_contact: booking.ownerContact,
        money: parseFloat(booking.money) || 0,
        advance: parseFloat(booking.advance) || 0,
        payment_amount: parseFloat(booking.paymentAmount) || 0,
        payment_status: booking.paymentStatus,
        oil_status: booking.oilStatus,
        booking_status: booking.bookingStatus,
        user_id: session?.user.id,
        created_at: new Date().toISOString(),
        return_type: booking.returnType,
        extras: booking.extras,
      });

      if (error) throw error;
      Toast.show({
        type: "success",
        message: "Booking created successfully",
      });
      router.back();
    } catch (error) {
      console.error("Error creating booking:", error);
      Toast.show({
        type: "error",
        message: "Failed to create booking",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenWrapper bg="white" hideHeader>
      <View style={styles.header}>
        <MaterialIcons
          name="arrow-back"
          size={24}
          color={theme.colors.textDark}
          onPress={() => router.back()}
          style={styles.backButton}
        />
        <Text style={styles.headerTitle}>New Booking</Text>
      </View>

      <ScrollView style={styles.container}>
        {/* Journey Details */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialIcons
              name="directions-bus"
              size={24}
              color={theme.colors.primary}
            />
            <Text style={styles.sectionTitle}>Journey Details</Text>
          </View>
          {renderInput(
            "From Location",
            booking.fromLocation,
            (text) => setBooking((prev) => ({ ...prev, fromLocation: text })),
            "location-on",
            "Enter From location"
          )}
          {renderInput(
            "To Location",
            booking.toLocation,
            (text) => setBooking((prev) => ({ ...prev, toLocation: text })),
            "location-on",
            "Enter drop location"
          )}
        </View>

        {/* Schedule */}
        <View style={styles.section}>
          {renderDateTimePicker({
            label: "Departure",
            dateField: "departureDate",
            timeField: "departureTime",
            dateValue: booking.departureDate,
            timeValue: booking.departureTime,
            showPicker,
            setShowPicker,
            onDateChange,
          })}
          {renderDateTimePicker({
            label: "Arrival",
            dateField: "arrivalDate",
            timeField: "arrivalTime",
            dateValue: booking.arrivalDate,
            timeValue: booking.arrivalTime,
            showPicker,
            setShowPicker,
            onDateChange,
          })}
        </View>

        {/* Money */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialIcons
              name="local-gas-station"
              size={24}
              color={theme.colors.primary}
            />
            <Text style={styles.sectionTitle}>Money</Text>
          </View>
          {renderInput(
            "Money",
            booking.money,
            (text) => setBooking((prev) => ({ ...prev, money: text })),
            "attach-money",
            "Enter Money",
            "numeric"
          )}
          <View style={styles.statusContainer}>
            {["included", "not_included"].map((status) => (
              <Pressable
                key={status}
                style={[
                  styles.statusButton,
                  booking.oilStatus === status && styles.statusButtonActive,
                ]}
                onPress={() =>
                  setBooking((prev) => ({ ...prev, oilStatus: status }))
                }
              >
                <Text
                  style={[
                    styles.statusText,
                    booking.oilStatus === status && styles.statusTextActive,
                  ]}
                >
                  {`OIL ${status === "included" ? "INCLUDED" : "NOT INCLUDED"}`}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
        {/* Contact Details */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialIcons
              name="person"
              size={24}
              color={theme.colors.primary}
            />
            <Text style={styles.sectionTitle}>Customer Details</Text>
          </View>
          {renderInput(
            "Customer Name",
            booking.customerName,
            (text) => setBooking((prev) => ({ ...prev, customerName: text })),
            "person",
            "Enter customer name"
          )}
          {renderInput(
            "Customer Contact",
            booking.customerContact,
            (text) =>
              setBooking((prev) => ({ ...prev, customerContact: text })),
            "phone",
            "Enter customer contact"
          )}
          {/* Driver Details */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialIcons
                name="drive-eta"
                size={24}
                color={theme.colors.primary}
              />
              <Text style={styles.sectionTitle}>Driver Details</Text>
            </View>

            {renderInput(
              "Driver Name",
              booking.driverName,
              (text) => setBooking((prev) => ({ ...prev, driverName: text })),
              "person",
              "Enter driver name"
            )}
            {renderInput(
              "Driver Contact",
              booking.driverContact,
              (text) =>
                setBooking((prev) => ({ ...prev, driverContact: text })),
              "phone",
              "Enter driver contact"
            )}
          </View>

          {/* Owner Details */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialIcons
                name="business"
                size={24}
                color={theme.colors.primary}
              />
              <Text style={styles.sectionTitle}>Owner Details</Text>
            </View>

            {renderInput(
              "Owner Name",
              booking.ownerName,
              (text) => setBooking((prev) => ({ ...prev, ownerName: text })),
              "person",
              "Enter owner name"
            )}
            {renderInput(
              "Owner Contact",
              booking.ownerContact,
              (text) => setBooking((prev) => ({ ...prev, ownerContact: text })),
              "phone",
              "Enter owner contact"
            )}
          </View>
        </View>

        {/* Payment Details */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialIcons
              name="payments"
              size={24}
              color={theme.colors.primary}
            />
            <Text style={styles.sectionTitle}>Payment Details</Text>
          </View>
          {renderInput(
            "Advance Amount",
            booking.advance,
            (text) => setBooking((prev) => ({ ...prev, advance: text })),
            "attach-money",
            "Enter advance amount",
            "numeric"
          )}
          {renderInput(
            "Payment Amount",
            booking.paymentAmount,
            (text) => setBooking((prev) => ({ ...prev, paymentAmount: text })),
            "account-balance-wallet",
            "Enter paid amount",
            "numeric"
          )}
        </View>

        {/* Status Selections */}
        <View style={styles.section}>
          <Text style={styles.statusLabel}>
            <MaterialIcons
              name="payment"
              size={18}
              color={theme.colors.textLight}
            />{" "}
            Payment Status
          </Text>
          <View style={styles.statusContainer}>
            {["pending", "partial", "completed"].map((status) => (
              <Pressable
                key={status}
                style={[
                  styles.statusButton,
                  booking.paymentStatus === status && styles.statusButtonActive,
                ]}
                onPress={() =>
                  setBooking((prev) => ({ ...prev, paymentStatus: status }))
                }
              >
                <Text
                  style={[
                    styles.statusText,
                    booking.paymentStatus === status && styles.statusTextActive,
                  ]}
                >
                  {`PAYMENT ${status.toUpperCase()}`}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Booking Status */}
        <View style={styles.section}>
          <Text style={styles.statusLabel}>
            <MaterialIcons
              name="bookmark"
              size={18}
              color={theme.colors.textLight}
            />{" "}
            Booking Status
          </Text>
          <View style={styles.statusContainer}>
            {["booked", "confirmed", "cancelled"].map((status) => (
              <Pressable
                key={status}
                style={[
                  styles.statusButton,
                  booking.bookingStatus === status && styles.statusButtonActive,
                ]}
                onPress={() =>
                  setBooking((prev) => ({ ...prev, bookingStatus: status }))
                }
              >
                <Text
                  style={[
                    styles.statusText,
                    booking.bookingStatus === status && styles.statusTextActive,
                  ]}
                >
                  {status.toUpperCase()}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Return Type */}
        <View style={styles.section}>
          <Text style={styles.statusLabel}>
            <MaterialIcons
              name="repeat"
              size={18}
              color={theme.colors.textLight}
            />{" "}
            Return Type
          </Text>
          <View style={styles.statusContainer}>
            {["One-way", "Both-ways"].map((type) => (
              <Pressable
                key={type}
                style={[
                  styles.statusButton,
                  booking.returnType === type && styles.statusButtonActive,
                ]}
                onPress={() =>
                  setBooking((prev) => ({ ...prev, returnType: type }))
                }
              >
                <Text
                  style={[
                    styles.statusText,
                    booking.returnType === type && styles.statusTextActive,
                  ]}
                >
                  {type.toUpperCase()}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Extras/Comments Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialIcons
              name="comment"
              size={24}
              color={theme.colors.primary}
            />
            <Text style={styles.sectionTitle}>Additional Information</Text>
          </View>
          {renderInput(
            "Extras",
            booking.extras,
            (text) => setBooking((prev) => ({ ...prev, extras: text })),
            "notes",
            "Add any additional information",
            "default",
            { multiline: true, numberOfLines: 3 }
          )}
        </View>

        {/* Button Container */}
        <View style={styles.buttonContainer}>
          <Button
            title="Cancel"
            variant="secondary"
            onPress={() => router.back()}
            disabled={loading}
            buttonStyle={styles.cancelButton}
          />
          <Button
            title="Create"
            onPress={handleSave}
            loading={loading}
            disabled={loading}
            buttonStyle={styles.saveButton}
          />
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}
