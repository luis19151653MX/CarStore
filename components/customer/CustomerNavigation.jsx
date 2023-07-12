import { useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useColorModeValue, Image, Box, Center } from "native-base";

import { MyContext } from "../../context/AppContext";
import { DrawerContentScrollView, DrawerItem, DrawerItemList, createDrawerNavigator } from '@react-navigation/drawer';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import IconFA from 'react-native-vector-icons/FontAwesome';
import IconFA5 from 'react-native-vector-icons/FontAwesome5';


import Profile from './Profile';
import Purchase from './PurchaseOrders';
import Favorites from './Favorites';
import CatalogProducts from "./CatalogProducts";
import ViewProducts from "./ViewProducts";
import ShoppingCar from "./ShoppingCar";
import logoBlue from '../../assets/images/icon-store64.png';

import { Dimensions } from 'react-native';

export default function Navigation() {
    const Drawer = createDrawerNavigator();
    const { userId, setUserId } = useContext(MyContext);

    const windowWidth = Dimensions.get('window').width;
    const bg = useColorModeValue("#fff", "#000");
    const darkBlue = "#0E7490";

    const logOut = async () => {
        setUserId(0);
        try {
            await AsyncStorage.removeItem('AsyncUserId');
            await AsyncStorage.removeItem('AsyncUserType');
            // await AsyncStorage.removeItem('AsyncSound');
        } catch (e) {
            console.log(e);
        }
    }

    function CustomDrawerContent(props) {
        const { navigation } = props;
        return (
            <DrawerContentScrollView {...props}>
                <DrawerItemList {...props} />
                <DrawerItem
                    inactiveBackgroundColor="#fff"
                    label="Cerrar sesión"
                    icon={() => (
                        <Icon
                            name="logout"
                            size={35}
                            color={darkBlue}
                        />
                    )}
                    onPress={logOut}
                />
            </DrawerContentScrollView>
        );
    }

    const headerWithImage = () => (
        <Center w={windowWidth + 180}>
            <Box w="100%">
                <Image
                    source={logoBlue}
                    alt="Electricar"
                    resizeMode="contain"
                    style={{ width: "100%", height: "100%" }}
                />
            </Box>
        </Center>
    );
    return (
        <Drawer.Navigator
            initialRouteName="Catalog"
            screenOptions={{
                drawerStyle: {
                    backgroundColor: "rgba(255,255,255,1)",
                    width: "70%",
                },
                headerStyle: {
                    backgroundColor: bg,
                },
                drawerInactiveBackgroundColor: bg,
                drawerActiveBackgroundColor: "#7dc0ff",
                drawerActiveTintColor: "#000",
                headerTitle: headerWithImage,
                drawerLabelStyle: {
                    fontSize: 15,
                }
            }}
            drawerContent={props => <CustomDrawerContent {...props} />}
        >
            <Drawer.Screen name="Profile" component={Profile}
                options={{
                    drawerIcon: () => (
                        <IconFA name="user" size={35} color={darkBlue} />
                    ),
                    title: 'Perfil',
                }} />
            <Drawer.Screen name="Catalog" component={CatalogProducts}
                options={{
                    drawerIcon: () => (
                        <Icon name="store-search" size={35} color={darkBlue} />
                    ),
                    title: 'Catálogo Electricar',
                }} />
            <Drawer.Screen name="ShoppingCar" component={ShoppingCar}
                options={{
                    drawerIcon: () => (
                        <IconFA name="shopping-cart" size={35} color={darkBlue} />
                    ),
                    title: 'Carrito de compras',
                }} />
            <Drawer.Screen name="Purchase" component={Purchase}
                options={{
                    drawerIcon: () => (
                        <IconFA5 name="file-invoice-dollar" size={35} color={darkBlue} />
                    ),
                    title: 'Órdenes de compras',
                }} />
            <Drawer.Screen name="Favorites" component={Favorites}
                options={{
                    drawerIcon: () => (
                        <IconFA name="heart" size={35} color={darkBlue} />
                    ),
                    title: 'Favoritos',
                }} />
            <Drawer.Screen name="Product" component={ViewProducts}
                options={{
                    drawerItemStyle: { height: 0 } // Ocultar la opción "Product" en el drawer
                }} />
        </Drawer.Navigator>
    );
}