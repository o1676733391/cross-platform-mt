import React, { useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  Alert,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { addUser } from "../api/api";

export default function AddUserScreen({ navigation }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [imageAsset, setImageAsset] = useState(null);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    // Yêu cầu quyền truy cập thư viện ảnh
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Lỗi", "Cần quyền truy cập thư viện ảnh!");
      return;
    }

    const pickerOptions = { mediaTypes: ["images"] };

    const result = await ImagePicker.launchImageLibraryAsync({
      ...pickerOptions,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImageAsset(result.assets[0]);
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async () => {
    // Validation
    if (!username.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập username!");
      return;
    }
    if (!email.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập email!");
      return;
    }
    if (!validateEmail(email)) {
      Alert.alert("Lỗi", "Email không hợp lệ!");
      return;
    }
    if (!password.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập password!");
      return;
    }
    if (password.length < 6) {
      Alert.alert("Lỗi", "Password phải có ít nhất 6 ký tự!");
      return;
    }

    try {
      setLoading(true);

      // Tạo FormData
      const formData = new FormData();
      formData.append("username", username);
      formData.append("email", email);
      formData.append("password", password);

      if (imageAsset) {
        const filename = imageAsset.fileName || imageAsset.uri.split("/").pop() || `photo_${Date.now()}.jpg`;
        const mimeType = imageAsset.mimeType || imageAsset.type || "image/jpeg";

        if (Platform.OS === "web") {
          const response = await fetch(imageAsset.uri);
          const blob = await response.blob();
          formData.append("image", blob, filename);
        } else {
          formData.append("image", {
            uri: imageAsset.uri,
            name: filename,
            type: mimeType,
          });
        }
      }

      await addUser(formData);

      if (Platform.OS === "web" && typeof window !== "undefined") {
        window.alert("User đã được tạo!");
        navigation.goBack();
      } else {
        Alert.alert("Thành công", "User đã được tạo!", [
          {
            text: "OK",
            onPress: () => {
              navigation.goBack();
            },
          },
        ]);
      }
    } catch (error) {
      const message = error?.message || "Không thể tạo user";
      if (Platform.OS === "web" && typeof window !== "undefined") {
        window.alert("Không thể tạo user: " + message);
      } else {
        Alert.alert("Lỗi", "Không thể tạo user: " + message);
      }
      console.error("Add user error", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.label}>Username *</Text>
        <TextInput
          style={styles.input}
          placeholder="Nhập username"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />

        <Text style={styles.label}>Email *</Text>
        <TextInput
          style={styles.input}
          placeholder="Nhập email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={styles.label}>Password *</Text>
        <TextInput
          style={styles.input}
          placeholder="Nhập password (tối thiểu 6 ký tự)"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <Text style={styles.label}>Ảnh đại diện</Text>
        <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
          <Text style={styles.imagePickerText}>
            {imageAsset ? "📷 Đổi ảnh" : "📷 Chọn ảnh"}
          </Text>
        </TouchableOpacity>

        {imageAsset && (
          <View style={styles.imagePreview}>
            <Image source={{ uri: imageAsset.uri }} style={styles.previewImage} />
          </View>
        )}

        <TouchableOpacity
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>💾 Lưu User</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
          disabled={loading}
        >
          <Text style={styles.cancelButtonText}>❌ Hủy</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  form: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  imagePicker: {
    backgroundColor: "#9C27B0",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 8,
  },
  imagePickerText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  imagePreview: {
    alignItems: "center",
    marginTop: 15,
  },
  previewImage: {
    width: 150,
    height: 150,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#ddd",
  },
  submitButton: {
    backgroundColor: "#4CAF50",
    padding: 18,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  submitButtonDisabled: {
    backgroundColor: "#999",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  cancelButton: {
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  cancelButtonText: {
    color: "#666",
    fontSize: 16,
    fontWeight: "bold",
  },
});
