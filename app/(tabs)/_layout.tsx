import { Tabs } from "expo-router";
import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet } from "react-native";
import { useLanguage } from '../mobx/LanguageStore/LanguageStore';
import { observer } from "mobx-react-lite";

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

const tabBarIconPicker = (rootName: string, focused: boolean) => {
  const focusedName = `${rootName}` as IoniconsName;
  const outlineName = `${rootName}-outline` as IoniconsName;
  return focused 
    ? <Ionicons name={focusedName} color={'white'} size={30} /> 
    : <Ionicons name={outlineName} color={'white'} size={30} />; 
};

const MainLayout = observer(() => {
  const {locale} = useLanguage();
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: "#ffffff",
        tabBarInactiveTintColor: "#888",
      }}
    >
      <Tabs.Screen name="index" options={{headerShown: false, tabBarIcon: ({focused}) => tabBarIconPicker('home', focused), title: locale.tabs.home}}/>
      <Tabs.Screen name="ai" options={{headerShown: false, tabBarIcon: ({focused}) => tabBarIconPicker('flash', focused), title: locale.tabs.ai}} />
      <Tabs.Screen name="market" options={{headerShown: false, tabBarIcon: ({focused}) => tabBarIconPicker('bag', focused), title: locale.tabs.market, }}/>
      <Tabs.Screen name="profile" options={{headerShown: false, tabBarIcon: ({focused}) => tabBarIconPicker('person', focused), title: locale.tabs.profile, }}/>
    </Tabs>
  )
})


const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    backgroundColor: "#222",
    borderRadius: 20,
    height: 65, 
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5, 
    borderTopWidth: 0, 
  },
});

export default MainLayout
