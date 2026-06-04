import { NavigationContainer } from "@react-navigation/native";
import BottomTabNavigator from "./components/BottomTabNavigator";

export default function App() {
  return (
    <NavigationContainer>
      <BottomTabNavigator />
    </NavigationContainer>
  );
}
