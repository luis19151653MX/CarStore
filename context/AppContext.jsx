import React, { createContext, useEffect, useState} from 'react';
import axios from 'axios';
import { Audio } from 'expo-av';

export const MyContext = createContext();

export const ContextProvider = ({ children }) => {
    const [appName, setAppName] = useState("Car Store");

    const [userId, setUserId] = useState(0);
    const [userType, setUserType] = useState(0);
    const [sound, setSound] = useState();
    const [soundPreferences, setSoundPreferences] = useState();

    //local  baseURL: 'http://192.168.100.127:8000/api',
    //railway baseURL: 'https://electricar-api-rest-production.up.railway.app/api',
    const apiAxios = axios.create({
        baseURL: 'http://192.168.100.127:8000/api',
    });

    //sounds
    useEffect(() => {
        return sound
            ? () => {
                sound.unloadAsync();
            }
            : undefined;
    }, [sound]);

    const changeSound = () => {
        if (soundPreferences) setSoundPreferences(false);
        else setSoundPreferences(true);
    }

    async function playSoundDelete() {
        if (soundPreferences) {
            const { sound } = await Audio.Sound.createAsync(require('../assets/sounds/delete.m4a')
            );
            setSound(sound);
            await sound.playAsync();
        }
    }

    async function playSoundSuccess() {
        if (soundPreferences) {
            const { sound } = await Audio.Sound.createAsync(require('../assets/sounds/success.mp3')
            );
            setSound(sound);
            await sound.playAsync();
        }
    }

    async function playSoundAdd() {
        if (soundPreferences) {
            const { sound } = await Audio.Sound.createAsync(require('../assets/sounds/add.mp3')
            );
            setSound(sound);
            await sound.playAsync();
        }
    }

    return (
        <MyContext.Provider value={{ appName,setAppName,userId, setUserId, userType, setUserType, apiAxios, soundPreferences, setSoundPreferences, changeSound, playSoundDelete, playSoundSuccess, playSoundAdd }}>
            {children}
        </MyContext.Provider>
    );
};
