import React, { useState, useContext } from "react";
import { useNavigation } from '@react-navigation/native';
import { Text, Button, Center, Image, Divider, FormControl, Input, VStack, useColorModeValue, Box, HStack, Alert, Modal } from "native-base";
import logoBlue from '../../assets/images/icon-store512.png';
import { MyContext } from "../../context/AppContext";


export default function Login() {
    const navigation = useNavigation();
    const bg = useColorModeValue("ligthmode.bg", "darkmode.bg");
    const { apiAxios } = useContext(MyContext);
    const [formData, setFormData] = useState({ name: null, password: null, address: null, phone: null, email: null });

    const [showModal, setShowModal] = useState(false);
    const openModal = () => setShowModal(true);
    const closeModal = () => {
        setShowModal(false);
        navigateLogin();
    }

    //modalbuttons
    const [isPressedButton, setIsPressedButton] = useState(false);

    //control onFocus input
    const [isFocusedName, setIsFocusedName] = useState(false);
    const [isFocusedAddress, setIsFocusedAddress] = useState(false);
    const [isFocusedEmail, setIsFocusedEmail] = useState(false);
    const [isFocusedPhone, setIsFocusedPhone] = useState(false);
    const [isFocusedPassword, setIsFocusedPassword] = useState(false);

    //errors validate
    const [errorName, setErrorName] = useState(null);
    const [errorAddress, setErrorAddress] = useState(null);
    const [errorEmail, setErrorEmail] = useState(null);
    const [errorPhone, setErrorPhone] = useState(null);
    const [errorPassword, setErrorPassword] = useState(null);


    const validateName = () => {
        if (formData.name === null) {
            setErrorName("El nombre es obligatorio");
            return false;
        }
        const nameTrim = formData.name.trim();
        setFormData({ ...formData, name: nameTrim });
        const name = formData.name;

        if (name.length < 4) {
            setErrorName("El nombre debe tener al menos 4 caracteres");
            return false;
        }
        if (name.length > 100) {
            setErrorName("El nombre no puede tener más de 100 caracteres");
            return false;
        }
        return true;
    };

    const validateAddress = () => {
        if (formData.address === null) {
            setErrorAddress("La dirección es obligatoria");
            return false;
        }
        const valueTrim = formData.address.trim();
        setFormData({ ...formData, address: valueTrim });
        const value = formData.address;

        if (value.length < 4) {
            setErrorAddress("La dirección debe tener al menos 4 caracteres");
            return false;
        }
        if (value.length > 100) {
            setErrorAddress("La dirección no puede tener más de 100 caracteres");
            return false;
        }
        return true;
    };

    const validatePhone = () => {
        if (formData.phone === null) {
            setErrorPhone("El número de teléfono es obligatorio");
            return false;
        }
        const valueTrim = formData.phone.trim().replace(/\s/g, '');
        setFormData({ ...formData, phone: valueTrim });
        const value = formData.phone;

        if (value.length < 10) {
            setErrorPhone("El teléfono debe tener al menos 10 dígitos");
            return false;
        }
        if (value.length > 12) {
            setErrorPhone("El teléfono no puede tener más de 12 dígitos");
            return false;
        }
        return true;
    };

    const validateEmail = () => {
        if (formData.email === null) {
            setErrorEmail("El correo electrónico es obligatorio");
            return false;
        }
        const valueTrim = formData.email.trim();
        setFormData({ ...formData, email: valueTrim });
        const value = formData.email;

        if (!isValidEmail(value)) {
            setErrorEmail("El email debe terminar en @gmail.com");
            return false;
        }

        if (value.length < 11) {
            setErrorEmail("El email debe tener al menos 11 caracteres");
            return false;
        }
        if (value.length > 200) {
            setErrorEmail("El email no puede tener más de 200  caracteres");
            return false;
        }
        return true;
    };
    const isValidEmail = (email) => {
        const emailRegex = /@gmail\.com$/i;
        return emailRegex.test(email);
    }

    const validatePassword = () => {
        if (formData.password === null) {
            setErrorPassword("La contraseña es obligatoria");
            return false;
        }
        const valueTrim = formData.password.trim();
        setFormData({ ...formData, password: valueTrim });
        const value = formData.password;

        if (value.length < 8) {
            setErrorPassword("La contraseña debe tener al menos 8 caracteres");
            return false;
        }
        if (value.length > 16) {
            setErrorPassword("La contraseña no puede tener más de 16 caracteres");
            return false;
        }
        return true;
    };

    const signUpUser = async () => {
        setErrorName(null);
        setErrorAddress(null);
        setErrorPhone(null);
        setErrorEmail(null);
        setErrorPassword(null);

        const fVName = validateName();
        const fVAddress = validateAddress();
        const fVPhone = validatePhone();
        const fVEmail = validateEmail()
        const fVPassword = validatePassword();

        if (fVName && fVAddress && fVPhone && fVEmail && fVPassword) {
            const config = {
                headers: { 'Content-Type': 'multipart/form-data' }
            };
            const data = new FormData();
            data.append("address", formData.address);
            data.append("name", formData.name);
            data.append("email", formData.email);
            data.append("phone", formData.phone);
            data.append("password", formData.password);

            await apiAxios.post("/usere_signup", data, config).then(
                response => {
                    openModal();
                })
                .catch(error => {
                    if (error.response.status === 422) {
                        const errors = error.response.data;
                        console.log(errors);
                        for (let property in errors) {
                            switch (property) {
                                case "name":
                                    setErrorName(errors[property][0]);
                                    break;
                                case "address":
                                    setErrorAddress(errors[property][0]);
                                    break;
                                case "email":
                                    setErrorEmail(errors[property][0]);
                                    break;
                                case "phone":
                                    setErrorPhone(errors[property][0]);
                                    break;
                                case "password":
                                    setErrorPassword(errors[property][0]);
                                    break;
                                default:
                                    break;
                            }
                        }
                    }
                });
        } else console.log("SIGNUP datos invalidos")
    }

    const navigateLogin = () => {
        navigation.navigate("Login");
    }



    const handleFocusName = () => {
        setIsFocusedName(true);
    };
    const handleBlurName = () => {
        setIsFocusedName(false);
    };
    const handleFocusAddress = () => {
        setIsFocusedAddress(true);
    };
    const handleBlurAddress = () => {
        setIsFocusedAddress(false);
    };
    const handleFocusPhone = () => {
        setIsFocusedPhone(true);
    };
    const handleBlurPhone = () => {
        setIsFocusedPhone(false);
    };
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


    return (
        <Center width="100%" height="100%" bg={bg} >
            <HStack alignItems="center">
                <Image source={logoBlue} alt="Alternate Text" size="md" ></Image>
                <Text fontSize="4xl" >Regístrate</Text>
            </HStack>
            <VStack >
                <Divider my={4}></Divider>
                <FormControl >
                    {isFocusedName || formData.name ? <FormControl.Label _text={{ fontSize: "lg" }} >Nombre</FormControl.Label> : null}
                    <Input
                        variant="underlined"
                        size="xl" p={2} w="80%"
                        placeholder="Nombre y apellidos"
                        onChangeText={value => {setFormData({ ...formData, name: value }),setErrorName(null)}}
                        _focus={{ borderColor: "ligthmode.accent", backgroundColor: "ligthmode.input" }}
                        onFocus={handleFocusName}
                        onBlur={handleBlurName}
                    />
                </FormControl>
                {errorName === null ? null :
                    (
                        <Box bg="error.300" >
                            <Text _text={{ fontSize: "sm" }}>{errorName}</Text>
                        </Box>

                    )
                }
                <Divider my={1}></Divider>

                <FormControl >
                    {isFocusedAddress || formData.address ? <FormControl.Label _text={{ fontSize: "lg" }} >Dirección</FormControl.Label> : null}
                    <Input
                        variant="underlined"
                        size="xl" p={2} w="80%"
                        placeholder="Dirección"
                        onChangeText={value =>{ setFormData({ ...formData, address: value }),setErrorAddress(null)}}
                        _focus={{ borderColor: "ligthmode.accent", backgroundColor: "ligthmode.input" }}
                        onFocus={handleFocusAddress}
                        onBlur={handleBlurAddress}
                    />
                    {errorAddress === null ? null :
                        (
                            <Box bg="error.300" >
                                <Text _text={{ fontSize: "sm" }}>{errorAddress}</Text>
                            </Box>

                        )
                    }
                </FormControl>
                <Divider my={1}></Divider>

                <FormControl>
                    {isFocusedPhone || formData.phone ? <FormControl.Label _text={{ fontSize: "lg" }} >Número de teléfono</FormControl.Label> : null}
                    <Input
                        keyboardType="numeric"
                        variant="underlined"
                        size="xl" p={2} w="80%"
                        placeholder="Número de teléfono"
                        onChangeText={value =>{setFormData({ ...formData, phone: value }),setErrorPhone(null)}}
                        _focus={{ borderColor: "ligthmode.accent", backgroundColor: "ligthmode.input" }}
                        onFocus={handleFocusPhone}
                        onBlur={handleBlurPhone}
                    />
                    {errorPhone === null ?
                        null :
                        (
                            <Box bg="error.300" >
                                <Text _text={{ fontSize: "sm" }}>{errorPhone}</Text>
                            </Box>
                        )
                    }
                </FormControl>
                <Divider my={1}></Divider>
                <FormControl >
                    {isFocusedEmail || formData.email ? <FormControl.Label _text={{ fontSize: "lg" }} >Correo electrónico</FormControl.Label> : null}
                    <Input
                        variant="underlined"
                        size="xl" p={2} w="80%"
                        placeholder="Correo electrónico"
                        onChangeText={value =>{ setFormData({ ...formData, email: value }),setErrorEmail(null)}}
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
                <Divider my={1}></Divider>
                <FormControl >
                    {isFocusedPassword || formData.password ? <FormControl.Label _text={{ fontSize: "lg" }} >Contraseña</FormControl.Label> : null}
                    <Input
                        variant="underlined"
                        size="xl" p={2} w="80%"
                        placeholder="Contraseña"
                        onChangeText={value =>{ setFormData({ ...formData, password: value }),setErrorPassword(null)}}
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
                <Divider my={4}></Divider>
                <Button bgColor="ligthmode.accent" rounded={2} h={12} _text={{ fontSize: "lg" }}
                onPress={signUpUser} onPressIn={() => setIsPressedButton(true)}
                onPressOut={() => setIsPressedButton(false)}
                style={{
                  opacity: isPressedButton ? 0.8 : 1,
                }}>
                    Registrar
                </Button>


                <Modal isOpen={showModal} onClose={closeModal}>
                    <Modal.Content maxWidth="400px">
                        <Modal.CloseButton />
                        <Modal.Header>¡Registro exitoso!</Modal.Header>
                        <Modal.Body >
                            <Button onPress={closeModal}>
                                Continuar
                            </Button>
                        </Modal.Body>
                    </Modal.Content>
                </Modal>
            </VStack>

        </Center>

    );
}
