import React from "react";
import { View, Text, ScrollView, StyleSheet, Pressable } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import ScreenWrapper from "@/components/ScreenWrapper";
import Button from "@/components/Button";
import { theme } from "@/constants/theme";
import { useRouter } from "expo-router";
import { styles } from "@/styles/bookings";
import { getStatusColor } from "@/utils/statusColors";

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
  money: number;
  advance: number;
  payment_amount: number;
  payment_status: string;
  oil_status: string;
  booking_status: string;
  return_type: string;
  extras?: string;
}

interface ViewBookingProps {
  booking: BookingData;
  onEdit: () => void;
  onBack: () => void;
}

export default function ViewBooking({
  booking,
  onEdit,
  onBack,
}: ViewBookingProps) {
  const router = useRouter();

  const renderDetailRow = (
    label: string,
    value: string | number,
    icon: keyof typeof MaterialIcons.glyphMap
  ) => (
    <View style={styles.detailRow}>
      <View style={styles.labelContainer}>
        <MaterialIcons name={icon} size={18} color={theme.colors.textLight} />
        <Text style={styles.detailLabel}>{label}:</Text>
      </View>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );

  return (
    <ScreenWrapper bg="white" hideHeader>
      <View style={styles.header}>
        <MaterialIcons
          name="arrow-back"
          size={24}
          color={theme.colors.textDark}
          onPress={onBack}
          style={styles.backButton}
        />
        <Text style={styles.headerTitle}>Booking Details</Text>
        <Pressable onPress={onEdit}>
          <MaterialIcons name="edit" size={24} color={theme.colors.primary} />
        </Pressable>
      </View>

      <ScrollView style={styles.container}>
        <View style={styles.card}>
          {/* Journey Details */}
          <View style={styles.detailSection}>
            <View style={styles.sectionHeader}>
              <MaterialIcons
                name="directions-bus"
                size={24}
                color={theme.colors.primary}
              />
              <Text style={styles.sectionTitle}>Journey Details</Text>
            </View>
            {renderDetailRow("From", booking.from_location, "location-on")}
            {renderDetailRow("To", booking.to_location, "location-on")}
            {renderDetailRow(
              "Departure",
              `${booking.departure_date} ${booking.departure_time}`,
              "event"
            )}
            {renderDetailRow(
              "Arrival",
              `${booking.arrival_date} ${booking.arrival_time}`,
              "schedule"
            )}
          </View>

          <View style={styles.divider} />

          {/* Customer Details */}
          <View style={styles.detailSection}>
            <View style={styles.sectionHeader}>
              <MaterialIcons
                name="person"
                size={24}
                color={theme.colors.primary}
              />
              <Text style={styles.sectionTitle}>Customer Details</Text>
            </View>
            {renderDetailRow("Name", booking.customer_name, "person")}
            {renderDetailRow("Contact", booking.customer_contact, "phone")}
          </View>

          <View style={styles.divider} />

          {/* Driver Details */}
          <View style={styles.detailSection}>
            <View style={styles.sectionHeader}>
              <MaterialIcons
                name="drive-eta"
                size={24}
                color={theme.colors.primary}
              />
              <Text style={styles.sectionTitle}>Driver Details</Text>
            </View>
            {renderDetailRow("Name", booking.driver_name, "person")}
            {renderDetailRow("Contact", booking.driver_contact, "phone")}
          </View>

          <View style={styles.divider} />

          {/* Owner Details */}
          <View style={styles.detailSection}>
            <View style={styles.sectionHeader}>
              <MaterialIcons
                name="business"
                size={24}
                color={theme.colors.primary}
              />
              <Text style={styles.sectionTitle}>Owner Details</Text>
            </View>
            {renderDetailRow("Name", booking.owner_name, "person")}
            {renderDetailRow("Contact", booking.owner_contact, "phone")}
          </View>

          <View style={styles.divider} />

          {/* Payment Details */}
          <View style={styles.detailSection}>
            <View style={styles.sectionHeader}>
              <MaterialIcons
                name="payments"
                size={24}
                color={theme.colors.primary}
              />
              <Text style={styles.sectionTitle}>Payment Details</Text>
            </View>
            {renderDetailRow(
              "Total Amount",
              `₹${booking.money}`,
              "attach-money"
            )}
            {renderDetailRow("Advance", `₹${booking.advance}`, "money")}
            {renderDetailRow(
              "Payment Amount",
              `₹${booking.payment_amount}`,
              "account-balance-wallet"
            )}
            <View
              style={[
                styles.statusChip,
                {
                  backgroundColor: getStatusColor(
                    booking.payment_status,
                    "payment"
                  ),
                },
              ]}
            >
              <MaterialIcons name="payment" size={18} />
              <Text style={styles.statusText}>
                {`PAYMENT ${booking.payment_status.toUpperCase()}`}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Oil Status */}
          <View style={styles.detailSection}>
            <View style={styles.sectionHeader}>
              <MaterialIcons
                name="local-gas-station"
                size={24}
                color={theme.colors.primary}
              />
              <Text style={styles.sectionTitle}>Oil Status</Text>
            </View>
            <View
              style={[
                styles.statusChip,
                { backgroundColor: getStatusColor(booking.oil_status, "oil") },
              ]}
            >
              <MaterialIcons name="local-gas-station" size={18} />
              <Text style={styles.statusText}>
                {`OIL ${booking.oil_status.toUpperCase()}`}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Booking Status */}
          <View style={styles.detailSection}>
            <View style={styles.sectionHeader}>
              <MaterialIcons
                name="book-online"
                size={24}
                color={theme.colors.primary}
              />
              <Text style={styles.sectionTitle}>Booking Status</Text>
            </View>
            <View
              style={[
                styles.statusChip,
                {
                  backgroundColor: getStatusColor(
                    booking.booking_status,
                    "booking"
                  ),
                },
              ]}
            >
              <MaterialIcons name="event-available" size={18} />
              <Text style={styles.statusText}>
                {booking.booking_status.toUpperCase()}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Return Type */}
          <View style={styles.detailSection}>
            <View style={styles.sectionHeader}>
              <MaterialIcons
                name="repeat"
                size={24}
                color={theme.colors.primary}
              />
              <Text style={styles.sectionTitle}>Return Type</Text>
            </View>
            {renderDetailRow(
              "Type",
              booking.return_type || "One-way",
              "repeat"
            )}
          </View>

          {booking.extras && (
            <>
              <View style={styles.divider} />
              {/* Additional Information */}
              <View style={styles.detailSection}>
                <View style={styles.sectionHeader}>
                  <MaterialIcons
                    name="comment"
                    size={24}
                    color={theme.colors.primary}
                  />
                  <Text style={styles.sectionTitle}>
                    Additional Information
                  </Text>
                </View>
                {renderDetailRow("Notes", booking.extras, "notes")}
              </View>
            </>
          )}

          <Button
            title="Edit Booking"
            onPress={onEdit}
            buttonStyle={styles.editButton}
          />
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}
