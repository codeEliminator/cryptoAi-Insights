import { Stack } from "expo-router";
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';

interface RouteParams {
  id: string;
}

export default function CryptoLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="[id]"
        options={({ route, navigation }) => ({ 
          headerTitleStyle: {fontSize: 22, color: 'white'},
          headerTransparent: true,
          headerShown: true,
          headerBlurEffect: "systemThickMaterialDark",
          title: (route.params as RouteParams).id
            ? `${String((route.params as RouteParams).id).toUpperCase()}` 
            : 'Криптовалюта',
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
          ),
        })}
      />
    </Stack>
  );
}