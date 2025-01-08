import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import ScreenWrapper from "@/components/ScreenWrapper";
import Button from "@/components/Button";
import { theme } from "@/constants/theme";
import Toast from "@/components/Toast";
import { styles } from "@/styles/bookings";
import { renderInput, renderDateTimePicker } from "@/components/FormInputs";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";
import { supabase } from "@/lib/supabase";

interface FormDataType {
  fromLocation: string;
  toLocation: string;
  departureDate: Date;
  departureTime: Date;
  arrivalDate: Date;
  arrivalTime: Date;
  customerName: string;
  customerContact: string;
  driverName: string;
  driverContact: string;
  ownerName: string;
  ownerContact: string;
  money: number;
  advance: number;
  payment_amount: number;
  payment_status: string;
  oil_status: string;
  bookingStatus: string;
  return_type: "One-way" | "Both-ways";
  extras: string;
}

interface PickerState {
  departureDate: boolean;
  departureTime: boolean;
  arrivalDate: boolean;
  arrivalTime: boolean;
}

interface EditBookingProps {
  formData: FormDataType;
  setFormData: React.Dispatch<React.SetStateAction<FormDataType>>;
  showPicker: PickerState;
  setShowPicker: React.Dispatch<React.SetStateAction<PickerState>>;
  onSave: () => void;
  onCancel: () => void;
  loading: boolean;
}

export default function EditBookingScreen() {
  const router = useRouter();
  const { session } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPicker, setShowPicker] = useState<PickerState>({
    departureDate: false,
    departureTime: false,
    arrivalDate: false,
    arrivalTime: false,
  });

  const [formData, setFormData] = useState<FormDataType>({
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
    money: 0,
    advance: 0,
    payment_amount: 0,
    payment_status: "pending",
    oil_status: "not_included",
    bookingStatus: "booked",
    return_type: "One-way",
    extras: "",
  });

  // Get booking ID from route params
  const id = useLocalSearchParams().id as string;

  // Fetch booking data when component mounts
  useEffect(() => {
    fetchBooking();
  }, [id]);

  const fetchBooking = async () => {
    try {
      const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;

      if (data) {
        setFormData({
          fromLocation: data.from_location,
          toLocation: data.to_location,
          departureDate: new Date(data.departure_date),
          departureTime: new Date(`2000-01-01T${data.departure_time}`),
          arrivalDate: new Date(data.arrival_date),
          arrivalTime: new Date(`2000-01-01T${data.arrival_time}`),
          customerName: data.customer_name,
          customerContact: data.customer_contact,
          driverName: data.driver_name,
          driverContact: data.driver_contact,
          ownerName: data.owner_name,
          ownerContact: data.owner_contact,
          money: data.money.toString(),
          advance: data.advance.toString(),
          payment_amount: data.payment_amount.toString(),
          payment_status: data.payment_status,
          oil_status: data.oil_status,
          bookingStatus: data.booking_status,
          return_type: data.return_type,
          extras: data.extras,
        });
      }
    } catch (error) {
      console.error("Error fetching booking:", error);
      Toast.show({
        type: "error",
        message: "Failed to fetch booking details",
      });
    }
  };

  const handleSave = async () => {
    try {
      if (!validateForm()) return;
      setLoading(true);

      const { error } = await supabase
        .from("bookings")
        .update({
          from_location: formData.fromLocation,
          to_location: formData.toLocation,
          departure_date: formData.departureDate.toISOString(),
          departure_time: format(formData.departureTime, "HH:mm"),
          arrival_date: formData.arrivalDate.toISOString(),
          arrival_time: format(formData.arrivalTime, "HH:mm"),
          customer_name: formData.customerName,
          customer_contact: formData.customerContact,
          driver_name: formData.driverName,
          driver_contact: formData.driverContact,
          owner_name: formData.ownerName,
          owner_contact: formData.ownerContact,
          money: formData.money,
          advance: formData.advance,
          payment_amount: formData.payment_amount,
          payment_status: formData.payment_status,
          booking_status: formData.bookingStatus,
          oil_status: formData.oil_status,
          return_type: formData.return_type,
          extras: formData.extras,
        })
        .eq("id", id);

      if (error) throw error;

      Toast.show({
        type: "success",
        message: "Booking updated successfully",
      });

      router.back();
    } catch (error) {
      console.error("Error updating booking:", error);
      Toast.show({
        type: "error",
        message: "Failed to update booking",
      });
    } finally {
      setLoading(false);
    }
  };

  const onDateChange = (
    event: any,
    selectedDate: Date | undefined,
    field: keyof PickerState
  ) => {
    const currentDate = selectedDate || formData[field as keyof FormDataType];
    setShowPicker((prev) => ({ ...prev, [field]: false }));

    setFormData((prev) => ({
      ...prev,
      [field]: currentDate,
    }));
  };

  const validateForm = () => {
    if (!formData.fromLocation || !formData.toLocation) {
      Toast.show({
        type: "error",
        message: "Location fields are required",
      });
      return false;
    }
    if (!formData.customerName || !formData.customerContact) {
      Toast.show({
        type: "error",
        message: "Customer details are required",
      });
      return false;
    }
    return true;
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
        <Text style={styles.headerTitle}>Edit Booking</Text>
        <MaterialIcons
          name="save"
          size={30}
          color={theme.colors.primary}
          onPress={handleSave}
        />
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
            "From",
            formData.fromLocation,
            (text) => setFormData((prev) => ({ ...prev, fromLocation: text })),
            "location-on",
            "Enter From Location"
          )}

          {renderInput(
            "To",
            formData.toLocation,
            (text) => setFormData((prev) => ({ ...prev, toLocation: text })),
            "location-on",
            "Enter drop Location"
          )}

          {/* Date/Time Pickers with icons */}
          {renderDateTimePicker({
            label: "Departure",
            dateField: "departureDate",
            timeField: "departureTime",
            dateValue: formData.departureDate,
            timeValue: formData.departureTime,
            showPicker,
            setShowPicker,
            onDateChange,
          })}

          {renderDateTimePicker({
            label: "Arrival",
            dateField: "arrivalDate",
            timeField: "arrivalTime",
            dateValue: formData.arrivalDate,
            timeValue: formData.arrivalTime,
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

          <View style={styles.statusContainer}>
            {renderInput(
              "Money",
              formData.money.toString(),
              (text) =>
                setFormData((prev) => ({ ...prev, money: Number(text) })),
              "attach-money",
              "Enter Money",
              "numeric"
            )}
            {["included", "not_included"].map((status) => (
              <Pressable
                key={status}
                style={[
                  styles.statusButton,
                  formData.oil_status === status && styles.statusButtonActive,
                ]}
                onPress={() =>
                  setFormData((prev) => ({ ...prev, oil_status: status }))
                }
              >
                <Text
                  style={[
                    styles.statusText,
                    formData.oil_status === status && styles.statusTextActive,
                  ]}
                >
                  {`OIL ${status === "included" ? "INCLUDED" : "NOT INCLUDED"}`}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Customer Details */}
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
            formData.customerName,
            (text) => setFormData((prev) => ({ ...prev, customerName: text })),
            "person",
            "Enter customer name"
          )}

          {renderInput(
            "Customer Contact",
            formData.customerContact,
            (text) =>
              setFormData((prev) => ({ ...prev, customerContact: text })),
            "phone",
            "Enter customer contact"
          )}
        </View>

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
            formData.driverName,
            (text) => setFormData((prev) => ({ ...prev, driverName: text })),
            "person",
            "Enter driver name"
          )}

          {renderInput(
            "Driver Contact",
            formData.driverContact,
            (text) => setFormData((prev) => ({ ...prev, driverContact: text })),
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
            "Name",
            formData.ownerName,
            (text) => setFormData((prev) => ({ ...prev, ownerName: text })),
            "person",
            "Enter owner name"
          )}

          {renderInput(
            "Contact",
            formData.ownerContact,
            (text) => setFormData((prev) => ({ ...prev, ownerContact: text })),
            "phone",
            "Enter owner contact"
          )}
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
            "Advance",
            formData.advance.toString(),
            (text) =>
              setFormData((prev) => ({ ...prev, advance: Number(text) })),
            "money",
            "Enter Advance Paid",
            "numeric"
          )}

          {renderInput(
            "Payment Amount",
            formData.payment_amount.toString(),
            (text) =>
              setFormData((prev) => ({
                ...prev,
                payment_amount: Number(text),
              })),
            "account-balance-wallet",
            "Enter Paid Amount",
            "numeric"
          )}

          {/* Status Selections */}
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
                  formData.payment_status === status &&
                    styles.statusButtonActive,
                ]}
                onPress={() =>
                  setFormData((prev) => ({ ...prev, payment_status: status }))
                }
              >
                <Text
                  style={[
                    styles.statusText,
                    formData.payment_status === status &&
                      styles.statusTextActive,
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
          <View style={styles.sectionHeader}>
            <MaterialIcons
              name="event"
              size={24}
              color={theme.colors.primary}
            />
            <Text style={styles.sectionTitle}>Booking Status</Text>
          </View>

          <View style={styles.statusContainer}>
            {["booked", "completed", "cancelled"].map((status) => (
              <Pressable
                key={status}
                style={[
                  styles.statusButton,
                  formData.bookingStatus === status &&
                    styles.statusButtonActive,
                ]}
                onPress={() =>
                  setFormData((prev) => ({ ...prev, bookingStatus: status }))
                }
              >
                <Text
                  style={[
                    styles.statusText,
                    formData.bookingStatus === status &&
                      styles.statusTextActive,
                  ]}
                >
                  {status.toUpperCase()}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

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
                  formData.return_type === type && styles.statusButtonActive,
                ]}
                onPress={() =>
                  setFormData((prev) => ({
                    ...prev,
                    return_type: type as "One-way" | "Both-ways",
                  }))
                }
              >
                <Text
                  style={[
                    styles.statusText,
                    formData.return_type === type && styles.statusTextActive,
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
            formData.extras,
            (text) => setFormData((prev) => ({ ...prev, extras: text })),
            "notes",
            "Add any additional information",
            "default",
            { multiline: true, numberOfLines: 3 }
          )}
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title="Cancel"
            variant="secondary"
            onPress={() => router.back()}
            disabled={loading}
            buttonStyle={styles.cancelButton}
          />
          <Button
            title="Save"
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
