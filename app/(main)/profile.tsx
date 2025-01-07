import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
} from "react-native";
import {
  TextInput,
  Button,
  IconButton,
  SegmentedButtons,
} from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import { MaterialIcons } from "@expo/vector-icons";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import ScreenWrapper from "@/components/ScreenWrapper";
import Toast from "@/components/Toast";
import { theme } from "@/constants/theme";
import { hp, wp } from "@/helpers/common";

interface PhoneNumber {
  id: string;
  country_code: string;
  phone_number: string;
  phone_type: "Primary" | "Secondary" | "Other";
}

export default function ProfileScreen() {
  const { userProfile, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState<{ [key: string]: boolean }>({});
  const [uploading, setUploading] = useState(false);
  const [profile, setProfile] = useState({
    name: userProfile?.name || "",
    email: userProfile?.email || "",
    countryCode: userProfile?.country_code || "+91",
    phone_number: userProfile?.phone_number || "",
    address: userProfile?.address || "",
    gender: userProfile?.gender || "",
    birthday: userProfile?.birthday || new Date(),
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [phoneNumbers, setPhoneNumbers] = useState<PhoneNumber[]>([]);
  const [isAddingPhone, setIsAddingPhone] = useState(false);
  const [newPhone, setNewPhone] = useState({ number: "", type: "Primary" });

  // Image Picker and Upload Functions
  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });

      if (!result.canceled) {
        await uploadImage(result.assets[0].uri);
      }
    } catch (error) {
      Toast.show({
        type: "error",
        message: "Error selecting image",
      });
    }
  };

  const uploadImage = async (uri: string) => {
    try {
      setUploading(true);
      const response = await fetch(uri);
      const blob = await response.blob();

      const fileExt = uri.substring(uri.lastIndexOf(".") + 1);
      const fileName = `${userProfile?.id}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("profile-images")
        .upload(filePath, blob, { upsert: true });

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("profile-images").getPublicUrl(filePath);

      // Update both profile state and users table
      await updateProfile({ image: publicUrl });
      setProfile((prev) => ({ ...prev, image: publicUrl }));

      Toast.show({
        type: "success",
        message: "Profile image updated successfully",
      });
    } catch (error) {
      Toast.show({
        type: "error",
        message: "Error uploading image",
      });
    } finally {
      setUploading(false);
    }
  };

  // Rest of your existing functions
  const toggleEdit = (field: string) => {
    setIsEditing((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleUpdate = async (field: string, value: string | Date) => {
    try {
      await updateProfile({ [field]: value });
      setProfile((prev) => ({
        ...prev,
        [field]: value,
      }));
      toggleEdit(field);
      Toast.show({
        type: "success",
        message: "Profile updated successfully",
      });
    } catch (error) {
      Toast.show({
        type: "error",
        message: "Error updating profile",
      });
    }
  };

  // Fetch phone numbers
  useEffect(() => {
    async function fetchPhoneNumbers() {
      if (!userProfile?.id) return;

      const { data, error } = await supabase
        .from("user_phones")
        .select("*")
        .eq("user_id", userProfile.id);

      if (error) {
        console.error("Error fetching phone numbers:", error);
        return;
      }

      const sortedData = [...data].sort((a, b) => {
        if (a.phone_type === "Primary") return -1;
        if (b.phone_type === "Primary") return 1;
        if (a.phone_type === "Secondary" && b.phone_type === "Other") return -1;
        if (a.phone_type === "Secondary" && b.phone_type === "Primary")
          return 1;
        if (a.phone_type === "Other") return 1;
        return 0;
      });
      setPhoneNumbers(sortedData);
    }

    fetchPhoneNumbers();
  }, [userProfile?.id]);

  // Add this validation function
  const validatePhoneType = (newType: string) => {
    const existingType = phoneNumbers.find(
      (phone) => phone.phone_type === newType
    );
    return !existingType;
  };

  // Update the handleAddPhone function
  const handleAddPhone = async () => {
    if (!userProfile?.id) {
      Toast.show({
        type: "error",
        message: "User not found",
      });
      return;
    }

    if (!newPhone.number) {
      Toast.show({
        type: "error",
        message: "Please enter a phone number",
      });
      return;
    }

    // Check if this phone type already exists in phoneNumbers array
    const existingPhoneType = phoneNumbers.find(
      (phone) => phone.phone_type === newPhone.type
    );

    if (existingPhoneType) {
      Toast.show({
        type: "error",
        message: `A ${newPhone.type} phone number already exists`,
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from("user_phones")
        .insert({
          user_id: userProfile.id,
          country_code: profile.countryCode,
          phone_number: newPhone.number,
          phone_type: newPhone.type,
        })
        .select()
        .single();

      if (error) {
        console.log("Supabase error:", error);
        Toast.show({
          type: "error",
          message: error.message,
        });
        return;
      }

      if (newPhone.type === "Primary") {
        await updateProfile({
          country_code: profile.countryCode,
          phone_number: newPhone.number,
        });
      }

      setPhoneNumbers([...phoneNumbers, data]);
      setIsAddingPhone(false);
      setNewPhone({ number: "", type: "Primary" });

      Toast.show({
        type: "success",
        message: "Phone number added successfully",
      });
    } catch (error: any) {
      console.log("Error in handleAddPhone:", error);
      Toast.show({
        type: "error",
        message: error.message || "Failed to add phone number",
      });
    }
  };

  // Delete phone number
  const handleDeletePhone = async (phoneId: string) => {
    try {
      // Find the phone number being deleted
      const phoneToDelete = phoneNumbers.find((phone) => phone.id === phoneId);

      if (!phoneToDelete) {
        Toast.show({
          type: "error",
          message: "Phone number not found",
        });
        return;
      }

      // Delete from user_phones table
      const { error: deleteError } = await supabase
        .from("user_phones")
        .delete()
        .eq("id", phoneId);

      if (deleteError) throw deleteError;

      // If deleting primary number, clear it from users table
      if (phoneToDelete.phone_type === "Primary") {
        const { error: updateError } = await supabase
          .from("users")
          .update({
            country_code: null,
            phone_number: null,
          })
          .eq("id", userProfile?.id);

        if (updateError) throw updateError;

        // Update local profile state
        await updateProfile({
          country_code: undefined,
          phone_number: undefined,
        });
      }

      // Update local phoneNumbers state
      setPhoneNumbers(phoneNumbers.filter((phone) => phone.id !== phoneId));

      Toast.show({
        type: "success",
        message: "Phone number deleted successfully",
      });
    } catch (error: any) {
      console.error("Delete phone error:", error);
      Toast.show({
        type: "error",
        message: error.message || "Failed to delete phone number",
      });
    }
  };

  // Update the phone type buttons to disable already used types
  const renderPhoneTypeButtons = () => {
    const types = ["Primary", "Secondary", "Other"] as const;
    return (
      <SegmentedButtons
        value={newPhone.type}
        onValueChange={(value) =>
          setNewPhone((prev) => ({
            ...prev,
            type: value as "Primary" | "Secondary" | "Other",
          }))
        }
        buttons={types.map((type) => ({
          value: type,
          label: type,
          disabled: !validatePhoneType(type),
        }))}
      />
    );
  };

  const formatPhoneNumber = (fullNumber: string) => {
    // Match the country code pattern (+ followed by 1-3 digits)
    const match = fullNumber.match(/^(\+\d{1,3})(.*)/);
    if (match) {
      return {
        countryCode: match[1],
        number: match[2],
      };
    }
    return {
      countryCode: "",
      number: fullNumber,
    };
  };

  // Add this sorting function
  const sortPhoneNumbers = (phones: PhoneNumber[]) => {
    const typeOrder = {
      Primary: 1,
      Secondary: 2,
      Other: 3,
    };

    return [...phones].sort((a, b) => {
      return typeOrder[a.phone_type] - typeOrder[b.phone_type];
    });
  };

  const renderPhoneSection = () => (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>Phone Numbers</Text>

      {/* Display sorted phone numbers */}
      {sortPhoneNumbers(phoneNumbers).map((phone) => (
        <View key={phone.id} style={styles.phoneItemContainer}>
          <View style={styles.phoneInfo}>
            <View style={styles.phoneNumberContainer}>
              <Text style={styles.countryCode}>{phone.country_code}</Text>
              <Text style={styles.phoneNumber}>{phone.phone_number}</Text>
            </View>
            <View
              style={[
                styles.phoneTypeBadge,
                phone.phone_type === "Primary" && styles.primaryBadge,
              ]}
            >
              <Text style={styles.phoneTypeText}>{phone.phone_type}</Text>
            </View>
          </View>
          <IconButton
            icon="delete"
            size={20}
            onPress={() => handleDeletePhone(phone.id)}
          />
        </View>
      ))}

      {/* Add new phone button */}
      {!isAddingPhone && (
        <Button
          onPress={() => setIsAddingPhone(true)}
          style={styles.addPhoneButton}
        >
          Add Phone Number
        </Button>
      )}

      {/* Add new phone form */}
      {isAddingPhone && (
        <View style={styles.addPhoneContainer}>
          <View style={styles.phoneInputContainer}>
            <TextInput
              mode="outlined"
              value={profile.countryCode}
              onChangeText={(text) => {
                console.log("Country code changed:", text); // Debug log
                setProfile((prev) => ({ ...prev, countryCode: text }));
              }}
              style={styles.countryCodeInput}
              placeholder="+91"
            />
            <TextInput
              mode="outlined"
              value={newPhone.number}
              onChangeText={(text) => {
                console.log("Phone number changed:", text); // Debug log
                setNewPhone((prev) => ({ ...prev, number: text }));
              }}
              placeholder="Phone number"
              style={styles.phoneInput}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.phoneTypeContainer}>
            <SegmentedButtons
              value={newPhone.type}
              onValueChange={(value) => {
                console.log("Phone type changed:", value); // Debug log
                setNewPhone((prev) => ({
                  ...prev,
                  type: value as "Primary" | "Secondary" | "Other",
                }));
              }}
              buttons={[
                { value: "Primary", label: "Primary" },
                { value: "Secondary", label: "Secondary" },
                { value: "Other", label: "Other" },
              ]}
            />
          </View>

          <View style={styles.addPhoneActions}>
            <Button
              onPress={() => {
                console.log("Cancel pressed"); // Debug log
                setIsAddingPhone(false);
              }}
            >
              Cancel
            </Button>
            <Button
              onPress={() => {
                console.log("Save pressed with:", {
                  // Debug log
                  countryCode: profile.countryCode,
                  number: newPhone.number,
                  type: newPhone.type,
                });
                handleAddPhone();
              }}
            >
              Save
            </Button>
          </View>
        </View>
      )}
    </View>
  );

  return (
    <ScreenWrapper bg="white">
      <ScrollView style={styles.container}>
        {/* Profile Image Section */}
        <View style={styles.imageContainer}>
          <Image
            source={
              userProfile?.image
                ? { uri: userProfile.image }
                : require("@/assets/images/defaultUser.png")
            }
            style={styles.profileImage}
          />
          <Pressable
            style={styles.editButton}
            onPress={pickImage}
            disabled={uploading}
          >
            <MaterialIcons name="edit" size={20} color="white" />
          </Pressable>
        </View>

        {/* Name Field */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Name</Text>
          {isEditing.name ? (
            <View style={styles.editContainer}>
              <TextInput
                value={profile.name}
                onChangeText={(text) =>
                  setProfile((prev) => ({ ...prev, name: text }))
                }
                style={styles.input}
              />
              <Button onPress={() => handleUpdate("name", profile.name)}>
                Save
              </Button>
            </View>
          ) : (
            <View style={styles.valueContainer}>
              <Text>{profile.name}</Text>
              <IconButton icon="pencil" onPress={() => toggleEdit("name")} />
            </View>
          )}
        </View>

        {/* Email Field (Read-only) */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Email</Text>
          <Text>{profile.email}</Text>
        </View>

        {/* Phone Field */}
        {renderPhoneSection()}

        {/* Address Field */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Address</Text>
          {isEditing.address ? (
            <View style={styles.editContainer}>
              <TextInput
                value={profile.address}
                onChangeText={(text) =>
                  setProfile((prev) => ({ ...prev, address: text }))
                }
                multiline
                numberOfLines={4}
                style={styles.input}
              />
              <Button onPress={() => handleUpdate("address", profile.address)}>
                Save
              </Button>
            </View>
          ) : (
            <View style={styles.valueContainer}>
              <Text>{profile.address || "Not set"}</Text>
              <IconButton icon="pencil" onPress={() => toggleEdit("address")} />
            </View>
          )}
        </View>

        {/* Gender Field */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Gender</Text>
          {isEditing.gender ? (
            <View style={styles.editContainer}>
              <View style={styles.genderButtons}>
                {["Male", "Female", "Other"].map((option) => (
                  <Button
                    key={option}
                    mode={profile.gender === option ? "contained" : "outlined"}
                    onPress={() => handleUpdate("gender", option)}
                  >
                    {option}
                  </Button>
                ))}
              </View>
            </View>
          ) : (
            <View style={styles.valueContainer}>
              <Text>{profile.gender || "Not set"}</Text>
              <IconButton icon="pencil" onPress={() => toggleEdit("gender")} />
            </View>
          )}
        </View>

        {/* Birthday Field */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Birthday</Text>
          <View style={styles.valueContainer}>
            <Text>
              {profile.birthday
                ? new Date(profile.birthday).toLocaleDateString()
                : "Not set"}
            </Text>
            <IconButton
              icon="calendar"
              onPress={() => setShowDatePicker(true)}
            />
          </View>
        </View>

        {showDatePicker && (
          <DateTimePicker
            value={new Date(profile.birthday)}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) {
                handleUpdate("birthday", selectedDate);
              }
            }}
          />
        )}
      </ScrollView>
      <Toast position="bottom" />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: wp(4),
  },
  imageContainer: {
    position: "relative",
    alignItems: "center",
    marginBottom: hp(2),
  },
  profileImage: {
    width: wp(30),
    height: wp(30),
    borderRadius: wp(15),
    backgroundColor: theme.colors.gray,
  },
  editButton: {
    position: "absolute",
    right: wp(32),
    bottom: 0,
    backgroundColor: theme.colors.primary,
    padding: wp(2),
    borderRadius: wp(4),
    elevation: 2,
  },
  fieldContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
  },
  editContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  valueContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  input: {
    flex: 1,
    marginRight: 8,
  },
  genderButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  phoneContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  addPhoneContainer: {
    gap: hp(2),
    marginBottom: hp(2),
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
  },
  phoneInputContainer: {
    flexDirection: "row",
    gap: wp(2),
    marginBottom: hp(1),
  },
  countryCodeInput: {
    width: wp(15),
    height: hp(6),
    borderWidth: 1,
    borderColor: theme.colors.darkLight, // Changed from theme.colors.border to theme.colors.darkLight
    borderRadius: theme.radius.sm,
    paddingHorizontal: wp(2),
  },
  phoneInput: {
    flex: 1,
    height: hp(6),
    borderWidth: 1,
    borderColor: theme.colors.darkLight, // Changed from theme.colors.border to theme.colors.darkLight to match theme types
    borderRadius: theme.radius.sm,
    paddingHorizontal: wp(2),
  },
  sectionContainer: {
    marginBottom: hp(3),
  },
  sectionTitle: {
    fontSize: hp(2),
    fontWeight: "600",
    marginBottom: hp(2),
    color: theme.colors.textDark,
  },
  phoneItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: hp(1),
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.darkLight, // Changed from theme.colors.border to theme.colors.darkLight to match theme types
  },
  phoneInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: wp(2),
  },
  phoneNumberContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp(1),
  },
  countryCode: {
    fontSize: hp(1.8),
    color: theme.colors.textLight,
    fontWeight: "500",
  },
  phoneNumber: {
    fontSize: hp(1.8),
    color: theme.colors.textDark,
  },
  phoneTypeBadge: {
    paddingHorizontal: wp(2),
    paddingVertical: hp(0.5),
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.gray,
  },
  primaryBadge: {
    backgroundColor: theme.colors.primary,
  },
  phoneTypeText: {
    fontSize: hp(1.4),
    color: "white",
  },
  addPhoneButton: {
    marginTop: hp(2),
  },
  phoneTypeContainer: {
    marginBottom: hp(2),
  },
  addPhoneActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: wp(2),
  },
});
