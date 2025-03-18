import React from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, StyleSheet } from 'react-native';
import { observer } from "mobx-react-lite";
import { useLanguage, LanguageProvider } from '../mobx/LanguageStore/LanguageStore';

const Profile = observer(() => {
  return (
    <SafeAreaView>
      <Text>Profile</Text>
    </SafeAreaView>
  ) });

export default Profile;
