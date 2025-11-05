import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AdminListScreen from "./src/screens/AdminListScreen";
import AddUserScreen from "./src/screens/AddUserScreen";
import EditUserScreen from "./src/screens/EditUserScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="AdminList"
        screenOptions={{
          headerStyle: {
            backgroundColor: "#2196F3",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      >
        <Stack.Screen
          name="AdminList"
          component={AdminListScreen}
          options={{
            title: "👥 Quản Lý Users",
          }}
        />
        <Stack.Screen
          name="AddUser"
          component={AddUserScreen}
          options={{
            title: "➕ Thêm User Mới",
          }}
        />
        <Stack.Screen
          name="EditUser"
          component={EditUserScreen}
          options={{
            title: "✏️ Chỉnh Sửa User",
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
