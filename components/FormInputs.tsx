import React from "react";
import { View, Text, TextInput, Pressable } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { theme } from "@/constants/theme";
import { styles } from "@/styles/bookings";
import DateTimePicker from "@react-native-community/datetimepicker";
import Toast from "@/components/Toast";

interface PickerState {
  departureDate: boolean;
  departureTime: boolean;
  arrivalDate: boolean;
  arrivalTime: boolean;
}

interface RenderDateTimePickerProps {
  label: string;
  dateField: keyof PickerState;
  timeField: keyof PickerState;
  dateValue: Date;
  timeValue: Date;
  showPicker: PickerState;
  setShowPicker: React.Dispatch<React.SetStateAction<PickerState>>;
  onDateChange: (
    event: any,
    selectedDate: Date | undefined,
    field: keyof PickerState
  ) => void;
}

export const renderInput = (
  label: string,
  value: string,
  onChangeText: (text: string) => void,
  icon: keyof typeof MaterialIcons.glyphMap,
  placeholder: string,
  keyboardType: "default" | "numeric" = "default",
  inputProps?: any
) => {
  const handleTextChange = (text: string) => {
    if (keyboardType === "numeric") {
      // Allow empty string or valid numbers only
      if (text === "" || /^\d*\.?\d*$/.test(text)) {
        onChangeText(text);
      } else {
        Toast.show({
          type: "error",
          message: "Please enter a valid number",
        });
      }
    } else {
      onChangeText(text);
    }
  };

  return (
    <View style={styles.inputContainer}>
      <View style={styles.labelContainer}>
        <MaterialIcons name={icon} size={18} color={theme.colors.textLight} />
        <Text style={styles.inputLabel}>{label}</Text>
      </View>
      <TextInput
        style={[
          styles.input,
          inputProps?.multiline && {
            height: 100,
            textAlignVertical: "top",
            paddingTop: 12,
          },
        ]}
        placeholder={placeholder}
        value={value}
        onChangeText={handleTextChange}
        keyboardType={keyboardType}
        {...inputProps}
      />
    </View>
  );
};

export const renderDateTimePicker = ({
  label,
  dateField,
  timeField,
  dateValue,
  timeValue,
  showPicker,
  setShowPicker,
  onDateChange,
}: RenderDateTimePickerProps) => (
  <View style={styles.dateTimeContainer}>
    <View style={styles.dateTimeLabelContainer}>
      <MaterialIcons name="event" size={18} color={theme.colors.textLight} />
      <Text style={styles.inputLabel}>{label}</Text>
    </View>
    <View style={styles.dateTimeInputs}>
      <Pressable
        style={[styles.dateTimeButton, { flex: 2 }]}
        onPress={() =>
          setShowPicker((prev) => ({ ...prev, [dateField]: true }))
        }
      >
        <Text style={styles.dateTimeText}>
          {dateValue.toLocaleDateString()}
        </Text>
      </Pressable>
      <Pressable
        style={[styles.dateTimeButton, { flex: 1 }]}
        onPress={() =>
          setShowPicker((prev) => ({ ...prev, [timeField]: true }))
        }
      >
        <Text style={styles.dateTimeText}>
          {timeValue.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
      </Pressable>
    </View>

    {showPicker[dateField] && (
      <DateTimePicker
        value={dateValue}
        mode="date"
        onChange={(e, date) => onDateChange(e, date, dateField)}
      />
    )}
    {showPicker[timeField] && (
      <DateTimePicker
        value={timeValue}
        mode="time"
        onChange={(e, date) => onDateChange(e, date, timeField)}
      />
    )}
  </View>
);
