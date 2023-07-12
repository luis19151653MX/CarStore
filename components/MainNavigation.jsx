import React, { useEffect, useContext } from "react";
import { MyContext } from "../context/AppContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationContainer } from '@react-navigation/native';


import AdminNavigation from "./admin/AdminNavigation";
import CustomerNavigation from "./customer/CustomerNavigation";
import GuestNavigation from "./guest/GuestNavigation";

export default function Main() {
    const { userId, setUserId } = useContext(MyContext);
    const { userType, setUserType } = useContext(MyContext);
    const { soundPreferences, setSoundPreferences } = useContext(MyContext);

    useEffect(() => {
        getAsyncUserId();
        getAsyncUserType();
        getSoundPreferences();
    }, []);

    const getAsyncUserId = async () => {
        try {
            const userAsync = await AsyncStorage.getItem('AsyncUserId');
            if (userAsync !== null) {
                setUserId(parseInt(userAsync));//save in context azyc value
            } else setUserId(0);
        } catch (e) {
            console.log(e);
        }
    }
    const getAsyncUserType = async () => {
        try {
            const userAsyncT = await AsyncStorage.getItem('AsyncUserType');
            if (userAsyncT !== null) {
                setUserType(parseInt(userAsyncT));//save in context async value
            } else setUserType(0);
        } catch (e) {
            console.log(e);
        }
    }
    const getSoundPreferences = async () => {
        try {
            const value = await AsyncStorage.getItem('AsyncSound');
            if (value !== null) {
                setSoundPreferences(value == 'true');
            }
        } catch (e) {
            console.log(e);
        }
    }
    return (
        <NavigationContainer>
            {
                userId == 0 ?
                    (
                        <GuestNavigation></GuestNavigation>
                    )
                    :
                    (
                        userType == 1 ?
                            (
                                <AdminNavigation></AdminNavigation>
                            ) :
                            (
                                <CustomerNavigation></CustomerNavigation>
                            )
                    )
            }
        </NavigationContainer>
    );
}

