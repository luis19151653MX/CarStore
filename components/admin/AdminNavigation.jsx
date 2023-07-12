import { useContext, useEffect } from 'react';
import { MyContext } from '../../context/AppContext';
import { useColorModeValue } from "native-base";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import AdminDelivery from "./AdminDelivery";
import AdminProducts from "./AdminProducts";

export default function Navigation() {
    const Tab = createBottomTabNavigator();
    const { userId, setUserId } = useContext(MyContext);
    const { userType, setUserType } = useContext(MyContext);
    const labelTab = useColorModeValue("#000", "#fff");
    const darkBlue = "#0E7490";
    
    const logOut = async () => {
        try {
            await AsyncStorage.removeItem('AsyncUserId');
            await AsyncStorage.removeItem('AsyncUserType');
         } catch (e) {
            console.log(e);
        }
    }

    //tab navigation
    function ComponentAdminLogout() {
        useEffect(() => {
            setUserId(0);
            setUserType(0);
            logOut();
        }, []);

        return null;
    }

    return (
        <Tab.Navigator initialRouteName="adminProducts"
            screenOptions={{
                headerShown: false,
                tabBarActiveBackgroundColor: "#7dc0ff",
                tabBarLabelStyle: { fontSize: 20, color: labelTab },
                tabBarStyle: { height: 60 }
            }}
        >
            <Tab.Screen name="adminProducts" component={AdminProducts} options={{
                tabBarLabel: 'Productos',
                tabBarIcon: () => (
                    <Icon name="storefront" color={darkBlue} size={30} />
                ),
            }} />
            <Tab.Screen name="adminDelivery" component={AdminDelivery} options={{
                tabBarLabel: 'Pedidos',
                tabBarIcon: () => (
                    <Icon name="truck-delivery" color={darkBlue} size={30} />
                ),
            }} />
            <Tab.Screen name="adminLogOut" component={ComponentAdminLogout} options={{
                tabBarLabel: 'Salir',
                tabBarIcon: () => (
                    <Icon name="logout" color={darkBlue} size={30} />
                ),
            }} />

        </Tab.Navigator>
    );
}