import React from "react";
import { useState, useContext } from "react";
import { useNavigation } from '@react-navigation/native';

import { Text, Center, Image, useColorModeValue, FormControl, Input, Icon, VStack, Box } from "native-base";
import { MaterialIcons } from "@expo/vector-icons";
import { TouchableOpacity } from 'react-native';
import { Pressable } from "react-native";
import logoBlue from '../../assets/images/icon-store512.png';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MyContext } from "../../context/AppContext";

export default function LoginHead() {
    const bg = useColorModeValue("ligthmode.bg", "darkmode.bg");
    const darkBlue = "ligthmode.darkBlue";
    const navigation = useNavigation();
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [show, setShow] = useState(false);
    const { apiAxios } = useContext(MyContext);
    const { userId, setUserId } = useContext(MyContext);
    const { userType, setUserType } = useContext(MyContext);
    const { setSoundPreferences } = useContext(MyContext);

    //focus 
    const [isFocusedEmail, setIsFocusedEmail] = useState(false);
    const [isFocusedPassword, setIsFocusedPassword] = useState(false);

    const handleFocusEmail = () => {
        setIsFocusedEmail(true);
    };
    const handleBlurEmail = () => {
        setIsFocusedEmail(false);
    };
    const handleFocusPassword = () => {
        setIsFocusedPassword(true);
    };
    const handleBlurPassword = () => {
        setIsFocusedPassword(false);
    };

    //errors validate
    const [errorEmail, setErrorEmail] = useState(null);
    const [errorPassword, setErrorPassword] = useState(null);
    const [errorCredentials, setErrorCredentials] = useState(null);

    const validateCredentials = () => {
        if (formData.email === "" || formData.password === "") {
            if (formData.email === "")
                setErrorEmail("El correo electrónico es requerido");
            else setErrorEmail(null);

            if (formData.password === "")
                setErrorPassword("La contraseña es requerida");
            else setErrorPassword(null);

            return false;
        }
        setErrorEmail(null);
        setErrorPassword(null);
        return true;
    }

    const login = () => {
        if (validateCredentials()) {
            setAsyncUserId();
        }
    }

    const setAsyncUserId = async () => {
        const config = {
            headers: { 'Content-Type': 'multipart/form-data' }
        };
        const data = new FormData();
        data.append("email", formData.email);
        data.append("password", formData.password);
        await apiAxios.post("/usere_login", data, config).then(
            response => {
                saveUserIdAsyncStorage(response.data.id);
                saveUserType(response.data.status);
                setUserId(response.data.id);
                setUserType(response.data.status);

            })
            .catch(error => {
                if (error.response.status === 422) {
                    const errors = error.response.data;
                    //console.log(errors);
                    for (let property in errors) {
                        switch (property) {
                            case "email":
                                setErrorEmail(errors[property][0]);
                                break;
                            case "password":
                                setErrorPassword(errors[property][0]);
                                break;
                            default:
                                break;
                        }
                    }
                }
                if (error.response.status === 401) {
                    setErrorCredentials(error.response.data.error);
                }
            });
    }

    const saveUserIdAsyncStorage = async (id) => {
        try {
            await AsyncStorage.setItem('AsyncUserId', String(id));
            //console.log("async storage userId:" + await AsyncStorage.getItem('AsyncUserId'));
        } catch (e) {
            console.log(e);
        }
    }

    const saveUserType = async (status) => {
        if (status == 1) {
            setSoundPreferences(true);
        }
        try {
            await AsyncStorage.setItem('AsyncUserType', String(status));
            // console.log("async storage userId:" + await AsyncStorage.getItem('AsyncUserType'));
        } catch (e) {
            console.log(e);
        }
    }

    const navigateRegister = () => {
        navigation.navigate("RegisterUser");
    }

    return (
        <VStack width="100%" height="100%" bg={bg} justifyContent="center" alignItems="center">
            <Center>
                <VStack width="90%" justifyContent="center" alignItems="center" >
                    <Image source={logoBlue} alt="Alternate Text" size={200} ></Image>
                    <Text fontSize="4xl" >Bienvenido</Text>
                </VStack>
                <Box h="20px"></Box>
                <VStack width="100%" space={3} >
                    <Center />
                    <FormControl >
                        {isFocusedEmail || formData.email !== "" ? <FormControl.Label _text={{ fontSize: "lg" }} >Correo electrónico</FormControl.Label> : null}
                        <Input
                            variant="underlined"
                            size="xl" p={2} w="80%"
                            placeholder="Correo electrónico"
                            onChangeText={value => setFormData({ ...formData, email: value })}
                            _focus={{ borderColor: "ligthmode.accent", backgroundColor: "ligthmode.input" }}
                            onFocus={handleFocusEmail}
                            onBlur={handleBlurEmail}
                        />
                        {errorEmail === null ? null :
                            (
                                <Box bg="error.300" >
                                    <Text _text={{ fontSize: "sm" }}>{errorEmail}</Text>
                                </Box>
                            )
                        }
                    </FormControl>
                    <FormControl >
                        {isFocusedPassword || formData.password !== "" ? <FormControl.Label _text={{ fontSize: "lg" }} >Contraseña</FormControl.Label> : null}
                        <Input
                            variant="underlined"
                            size="xl" p={2} w="80%"
                            placeholder="1234..."
                            type={show ? "text" : "password"}
                            onChangeText={value => setFormData({ ...formData, password: value })}
                            InputRightElement={
                                <Pressable onPress={() => setShow(!show)}>
                                    <Icon as={<MaterialIcons name={show ? "visibility" : "visibility-off"} />}
                                        size={7} mr="2" color="ligthmode.accent" />
                                </Pressable>}
                            _focus={{ borderColor: "ligthmode.accent", backgroundColor: "ligthmode.input" }}
                            onFocus={handleFocusPassword}
                            onBlur={handleBlurPassword}
                        />
                        {errorPassword === null ? null :
                            (
                                <Box bg="error.300" >
                                    <Text _text={{ fontSize: "sm" }}>{errorPassword}</Text>
                                </Box>
                            )
                        }
                    </FormControl>
                    <FormControl>
                        {errorCredentials === null ? null :
                            (
                                <Box bg="error.300">
                                    <Text _text={{ fontSize: "sm" }}>{errorCredentials}</Text>
                                </Box>
                            )
                        }
                    </FormControl>
                </VStack>
                <Box h="30px"></Box>
                <VStack width="90%" space={3} justifyContent="center" alignItems="center">
                    <TouchableOpacity
                        onPress={login}
                        bgColor={darkBlue}
                        activeOpacity={0.8}
                        style={{
                            width: "100%",
                            backgroundColor: darkBlue,
                            borderRadius: 2,
                        }}
                    >
                        <Box bg={darkBlue} h={10} rounded={2} w="xs" justifyContent="center">
                            <Text fontSize="lg" textAlign="center" color="#fff">
                                Iniciar sesión
                            </Text>
                        </Box>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={navigateRegister}
                        bgColor={darkBlue}
                        activeOpacity={0.8}
                        style={{
                            width: "100%",
                            backgroundColor: darkBlue,
                            borderRadius: 2,
                        }}
                    >
                        <Box bg={darkBlue} h={10} rounded={2} w="xs" justifyContent="center" >
                            <Text fontSize="lg" textAlign="center" color="#fff">
                                Regístrate
                            </Text>
                        </Box>
                    </TouchableOpacity>
                </VStack>
            </Center>
        </VStack>
    );
}