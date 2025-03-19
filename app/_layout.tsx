import React from 'react';
import { Stack } from "expo-router";
import { LanguageProvider } from './mobx/LanguageStore/LanguageStore';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function RootLayout() {
  return (
    <LanguageProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="screens/Settings"
            options={({ navigation }) => ({
              headerTitleStyle: {fontSize: 22, color: 'white'},
              headerTransparent: true,
              headerBlurEffect: "systemThickMaterialDark",
              headerLeft: () => (
                <TouchableOpacity onPress={() => navigation.goBack()}>
                  <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
              ),
            })}
          />

        </Stack>
      </GestureHandlerRootView>

    </LanguageProvider>
  );
}
