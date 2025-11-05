import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  Alert,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Platform,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { getUsers, deleteUser } from "../api/api";
import UserItem from "../components/UserItem";

export default function AdminListScreen({ navigation }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
  const data = await getUsers();
  setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      const message = error?.message || "Không thể tải danh sách users";
      if (Platform.OS === "web" && typeof window !== "undefined") {
        window.alert(message);
      } else {
        Alert.alert("Lỗi", message);
      }
      console.error("Load users error", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  useFocusEffect(
    useCallback(() => {
      loadUsers();
    }, [loadUsers])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadUsers();
    setRefreshing(false);
  }, [loadUsers]);

  const confirmAndDelete = useCallback(
    async (id) => {
      try {
        await deleteUser(id);
        if (Platform.OS === "web" && typeof window !== "undefined") {
          window.alert("User đã được xóa");
        } else {
          Alert.alert("Thành công", "User đã được xóa");
        }
        loadUsers();
      } catch (error) {
        const message = error?.message || "Không thể xóa user";
        if (Platform.OS === "web" && typeof window !== "undefined") {
          window.alert(message);
        } else {
          Alert.alert("Lỗi", message);
        }
        console.error("Delete user error", error);
      }
    },
    [loadUsers]
  );

  const handleDelete = useCallback(
    (id) => {
      if (Platform.OS === "web" && typeof window !== "undefined") {
        const confirmed = window.confirm(
          "Bạn có chắc chắn muốn xóa user này?"
        );
        if (confirmed) {
          confirmAndDelete(id);
        }
        return;
      }

      Alert.alert("Xác nhận xóa", "Bạn có chắc chắn muốn xóa user này?", [
        { text: "Hủy", style: "cancel" },
        {
          text: "Xóa",
          style: "destructive",
          onPress: () => confirmAndDelete(id),
        },
      ]);
    },
    [confirmAndDelete]
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
        <Text style={styles.loadingText}>Đang tải...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate("AddUser")}
      >
        <Text style={styles.addButtonText}>➕ Thêm User Mới</Text>
      </TouchableOpacity>

      {users.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Chưa có user nào</Text>
          <Text style={styles.emptySubText}>
            Nhấn nút "Thêm User Mới" để bắt đầu
          </Text>
        </View>
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <UserItem
              user={item}
              onEdit={() => navigation.navigate("EditUser", { user: item })}
              onDelete={() => handleDelete(item._id)}
            />
          )}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  addButton: {
    backgroundColor: "#2196F3",
    padding: 15,
    margin: 10,
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#666",
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
  },
});
