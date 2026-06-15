import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';
import HomeScreen from '../screens/HomePage';
import MapScreen from '../screens/MapPage';
import ProfileScreen from '../screens/ProfilePage';
import DigitalMuseumScreen from '../screens/DigitalMuseumPage';
import ArtistsScreen from '../screens/ArtistsPage';
import LoginScreen from "../screens/login";

const Tab = createBottomTabNavigator();

const ICONS = {
    Home: {focused: 'home', outline: 'home-outline'},
    Map: {focused: 'map', outline: 'map-outline'},
    DigitalMuseum: {focused: 'images', outline: 'images-outline'},
    Artists: {focused: 'people', outline: 'people-outline'},
    Profile: {focused: 'person', outline: 'person-outline'},
    Login: {focused: 'log-in', outline: 'log-in-outline'}
}

function BottomTabNavigator() {
    return (
        <Tab.Navigator
            screenOptions={({route}) => ({
                tabBarIcon: ({focused, color}) => {
                    const icon = ICONS[route.name];
                    return (
                        <Ionicons
                            name={focused ? icon.focused : icon.outline}
                            size={30}
                            color={color}
                            style={{marginRight: -10}}
                        />
                    );
                },
                tabBarActiveTintColor: '#F5F5F5',
                tabBarInactiveTintColor: 'gray',
                headerShown: false,
                tabBarShowLabel: false,
                tabBarStyle: {
                    backgroundColor: '#051923',
                    height: 100,
                },
                tabBarItemStyle: {
                    paddingVertical: 15,
                }
            })}
        >
            <Tab.Screen name="Home" component={HomeScreen}/>
            <Tab.Screen name="Map" component={MapScreen}/>
            <Tab.Screen name="DigitalMuseum" component={DigitalMuseumScreen}/>
            <Tab.Screen name="Artists" component={ArtistsScreen}/>
            <Tab.Screen name="Profile" component={ProfileScreen}/>
            <Tab.Screen name="Login" component={LoginScreen}/>
        </Tab.Navigator>
    );
}

export default BottomTabNavigator;