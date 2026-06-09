import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import BottomTabNavigator from './components/BottomTabNavigator';
import UploadPage from "./screens/UploadPage";

const Stack = createNativeStackNavigator();
export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen
                    name="MainTabs"
                    component={BottomTabNavigator}
                    options={{headerShown: false}}
                />

                <Stack.Screen
                    name="UploadPage"
                    component={UploadPage}
                    options={{title: 'Upload'}}
                />

            </Stack.Navigator>
        </NavigationContainer>
    );
}