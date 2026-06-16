import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import BottomTabNavigator from "./components/BottomTabNavigator";
import UploadPage from "./screens/UploadPage";
import RegisterScreen from "./screens/register";
import LocationPage from "./screens/LocationPage";

const Stack = createNativeStackNavigator();
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="MainTabs"
          component={BottomTabNavigator}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="UploadPage"
          component={UploadPage}
          options={{ title: "Upload" }}
        />

        <Stack.Screen
          name="RegisterPage"
          component={RegisterScreen}
          options={{ title: "Register" }}
        />

        <Stack.Screen
            name="LocationPage"
            component={LocationPage}
            options={{title: "Locatie"}}
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
}
