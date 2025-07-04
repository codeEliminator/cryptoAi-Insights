import React from 'react';
import { Stack } from 'expo-router';
import { MainStoreProvider } from './mobx/MainStore';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
interface RouteParams {
  id: string;
}

export default function RootLayout() {
  return (
    <MainStoreProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="screens/Settings"
            options={({ navigation }) => ({
              headerTitleStyle: { fontSize: 22, color: 'white' },
              headerTransparent: true,
              headerBlurEffect: 'systemThickMaterialDark',
              headerLeft: () => (
                <TouchableOpacity onPress={() => navigation.goBack()}>
                  <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
              ),
            })}
          />
          <Stack.Screen
            name="screens/crypto/[id]"
            options={({ navigation, route }) => ({
              headerTitleStyle: { fontSize: 22, color: 'white' },
              title: (route.params as RouteParams)?.id
                ? `${String((route.params as RouteParams).id).toUpperCase().substring(0, 20)}`
                : 'Currency?',
              headerTransparent: true,
              headerBlurEffect: 'systemThickMaterialDark',
              headerLeft: () => (
                <TouchableOpacity onPress={() => navigation.goBack()}>
                  <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
              ),
            })}
          />
        </Stack>
      </GestureHandlerRootView>
    </MainStoreProvider>
  );
}
