import {NavigationContainer} from "@react-navigation/native";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import BottomTabNavigator from "./components/BottomTabNavigator";
import UploadPage from "./screens/UploadPage";
import RegisterScreen from "./screens/register";
import LoginScreen from "./screens/login";

const Stack = createNativeStackNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Main" screenOptions={{headerShown: false}}>
                <Stack.Screen name="Login" component={LoginScreen}/>
                <Stack.Screen name="RegisterPage" component={RegisterScreen}/>
                <Stack.Screen name="Main" component={BottomTabNavigator}/>
                <Stack.Screen name="UploadPage" component={UploadPage} options={{headerShown: true, title: "Upload"}}/>
            </Stack.Navigator>
        </NavigationContainer>
    );
}