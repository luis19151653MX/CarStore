import React, { useContext, useEffect, useState } from "react";
import { Center, Text, useColorModeValue, Button, Box, HStack, VStack, Image, Modal, FormControl, Input } from "native-base";
import { MyContext } from "../../context/AppContext";
import { useIsFocused } from '@react-navigation/native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TouchableOpacity } from "react-native";

import Icon from 'react-native-vector-icons/FontAwesome5';
import IconMC from 'react-native-vector-icons/MaterialCommunityIcons';

export default function Profile() {
  const bg = useColorModeValue("ligthmode.bg", "darkmode.bg");
  const darkBlue = "ligthmode.darkBlue";
  const input = "ligthmode.input";
  const title = "ligthmode.bg";//#fff
  const isFocused = useIsFocused();

  const { userId, apiAxios } = useContext(MyContext);
  const { soundPreferences, changeSound, playSoundSuccess } = useContext(MyContext);
  const [user, setUser] = useState({});
  //edit
  const [editedUser, setEditedUser] = useState({});
  const [iconName, setIconName] = useState("volume-up");

  //modal
  const [openModal, setOpenModal] = useState(false);
  const modalOpen = () => { setOpenModal(true); };
  const [openModalPassword, setOpenModalPassword] = useState(false);
  const modalOpenPassword = () => { setOpenModalPassword(true); };
  //modal errors
  const [errorPhone, setErrorPhone] = useState(null);
  const [errorName, setErrorName] = useState(null);
  const [errorAddress, setErrorAddress] = useState(null);

  //error password
  const [errorPassword, setErrorPassword] = useState(null);//user password dont mathc with data base
  const [errorPC, setErrorPC] = useState(null);
  const [errorP1, setErrorP1] = useState(null);
  const [errorP2, setErrorP2] = useState(null);
  const [passwordC, setPasswordC] = useState("");
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");

  useEffect(() => {
    getUser();
    setIconName(soundPreferences ? "volume-up" : "volume-mute");
  }, []);

  useEffect(() => {
    getUser();
    setIconName(soundPreferences ? "volume-up" : "volume-mute");
  }, [isFocused]);

  const soundPress = () => {
    if (soundPreferences) {
      setIconName("volume-mute");
      changeSound();
      saveSoundAsyncStorage(false);
    } else {
      setIconName("volume-up");
      changeSound();
      saveSoundAsyncStorage(true);
    }
  };

  const saveSoundAsyncStorage = async (boolean) => {
    try {
      await AsyncStorage.setItem('AsyncSound', String(boolean));
      console.log("sonido:" + await AsyncStorage.getItem('AsyncSound'));
    } catch (e) {
      console.log(e);
    }
  }

  const getUser = async () => {
    await apiAxios.get(`/usere_getData/${userId}`).then(response => {
      setUser(response.data);
      setEditedUser(response.data);
    })
      .catch(error => {
        console.error(error);
      });
  }

  const updateUser = () => {
    validateModal() ? saveChanges() : null;
  }

  const validateModal = () => {
    const name = editedUser.name.trim();
    const address = editedUser.address.trim();
    const phone = editedUser.phone.trim();

    if (name == "") {
      setErrorName("Campo vacío.");
      return false;
    }

    if (name.length < 4 || name.length > 100) {
      setErrorName("El nombre debe tener entre 4 y 100 caracteres.");
      return false;
    }
    setErrorName(null);

    if (address == "") {
      setErrorAddress("Campo vacío.");
      return false;
    }

    if (address.length < 4 || address.length > 100) {
      setErrorAddress("La dirección debe tener entre 4 y 100 caracteres.");
      return false;
    }
    setErrorAddress(null);

    if (phone == "") {
      setErrorPhone("Campo vacío.");
      return false
    }
    if (phone.length < 10 || phone.length > 12) {
      setErrorPhone("El teléfono debe tener entre 10 y 12 caracteres.");
      return false;
    }
    setErrorPhone(null);
    return true;
  }


  const saveChanges = async () => {
    try {
      const response = await apiAxios.post('/usere_update', editedUser);
      if (response.status == 200) {
        console.log(response.data);
        setOpenModal(false);
        getUser();
      }
    } catch (error) {
      //console.error(error);
      setErrorPhone("El número de teléfono ya esta en uso.");
    }
  }

  const eraseErrors = () => {
    setEditedUser(user);
    setErrorPhone(null);
    setErrorName(null);
    setErrorAddress(null);
  }

  const updatePassword = () => {
    validateModalPassword() ? savePassword() : null;
  }

  const validateModalPassword = () => {
    const pC = passwordC.trim();
    const p1 = password1.trim();
    const p2 = password2.trim();

    if (pC == "") {
      setErrorPC("Campo vacío.");
      return false;
    }

    if (pC.length < 8 || pC.length > 16) {
      setErrorPC("La contraseña tener entre 8 y 16 caracteres.");
      return false;
    }
    setErrorPC(null);

    if (p1 == "") {
      setErrorP1("Campo vacío.");
      return false;
    }

    if (p1.length < 8 || p1.length > 16) {
      setErrorP1("La nueva contraseña tener entre 8 y 16 caracteres.");
      return false;
    }
    setErrorP1(null);

    if (p2 == "") {
      setErrorP2("Campo vacío.");
      return false;
    }

    if (p2.length < 8 || p2.length > 16) {
      setErrorP2("La nueva contraseña tener entre 8 y 16 caracteres.");
      return false;
    }

    if (p1 !== p2) {
      setErrorP2("No coincide con la nueva contraseña.");
      return false;
    }
    setErrorP2(null);
    return true;
  }


  const savePassword = async () => {
    try {
      const config = {
        headers: { 'Content-Type': 'multipart/form-data' }
      };
      const data = new FormData();
      data.append("id", userId);
      data.append("c_password", passwordC);
      data.append("n_password", password1);
      const response = await apiAxios.post('/usere_updatePassword', data, config);
      if (response.status == 200) {
        playSoundSuccess();
        //console.log(response.data);
        setOpenModalPassword(false);
        eraseErrorsPassword();
      } 
    } catch (error) {
      if (error.response.status === 422) {
        setErrorPC("La contraseña actual no es válida.");
      }else console.error(error);
    }
  }

  const eraseErrorsPassword = () => {
    setPassword1("");
    setPasswordC("");
    setPassword2("");
    setErrorPassword(null);
    setErrorP1(null);
    setErrorP2(null);
    setErrorPC(null);
  }

  return (
    <VStack width="100%" height="100%" bg={bg}>
      <HStack background={darkBlue} h="200px" w="100%">
        <Box w="50%">
          <Image
            source={{ uri: "https://www.pngall.com/wp-content/uploads/8/Car-Tire.png" }}
            alt="Image"
            width="100%"
            height="100%"
            style={{
              left: -90
            }}
          />
        </Box>
        <Box w="70%" justifyContent="center" alignItems="center" style={{
          left: -90
        }}>
          <Text fontWeight={"bold"} textAlign={"center"} fontSize={24} color="#FFFFFF">{user.name}</Text>
        </Box>
      </HStack>
      <Box h="50px"></Box>
      <VStack w="100%" h="50%" alignItems="center" justifyContent="center" p={2}>


        <Box background={"#ECF0EF"} rounded={"md"} w={"60%"} h={"10%"} alignItems={"center"} justifyContent={"center"}>
          <Text fontSize="lg" ellipsizeMode='tail' >Correo electronico:</Text>
        </Box>
        <Text fontSize="lg" fontWeight={"semibold"} ellipsizeMode='tail' marginBottom={5}>{user.email}</Text>

        <Box background={"#ECF0EF"} rounded={"md"} w={"60%"} h={"10%"} alignItems={"center"} justifyContent={"center"}>
          <Text fontSize="lg" >Teléfono:</Text>
        </Box>
        <Text fontSize="lg" fontWeight={"semibold"} marginBottom={5}>{user.phone}</Text>

        <Box background={"#ECF0EF"} rounded={"md"} w={"60%"} h={"10%"} alignItems={"center"} justifyContent={"center"}>
          <Text fontSize="lg" >Dirección:</Text>
        </Box>
        <Text fontSize="lg" fontWeight={"semibold"} marginLeft={5} marginRight={5} marginBottom={5} textAlign={"center"} >{user.address}</Text>


        <Center marginTop={4} marginBottom={4}>
          <HStack space={10}>
            <TouchableOpacity onPress={() => { modalOpen(true); }}>
              <Icon name="user-edit" size={50} color="#000000" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { modalOpenPassword(true) }}>
              <IconMC name="shield-key" size={50} color="#000000" />
            </TouchableOpacity>
          </HStack>
        </Center>
      </VStack>

      <HStack w="100%" bg={input} space={5} h="10%" alignItems="center" justifyContent="center" marginTop={5}>
        <Text fontSize="lg" color={title}>Preferencias</Text>
        <Center >
          <TouchableOpacity onPress={soundPress}>
            <Icon name={iconName} size={40} color="#fff" />
          </TouchableOpacity>
        </Center>
      </HStack>


      <Modal isOpen={openModal} onClose={() => { setOpenModal(false), eraseErrors() }} safeAreaTop={true}>
        <Modal.Content maxWidth="350">
          <Modal.CloseButton />
          <Modal.Header>Editar perfil</Modal.Header>
          <Modal.Body>
            {editedUser && (
              <>
                <FormControl>
                  <FormControl.Label>Nombre</FormControl.Label>
                  <Input
                    value={editedUser.name}
                    onChangeText={(value) => {
                      setEditedUser((prev) => ({ ...prev, name: value }));
                      setErrorName(null);
                    }}
                  />
                  {errorName != null && <Text fontSize="sm" color="red.500">{errorName}</Text>}
                </FormControl>
                <FormControl>
                  <FormControl.Label>Teléfono</FormControl.Label>
                  <Input
                    keyboardType="numeric"
                    value={editedUser.phone}
                    onChangeText={(value) => {
                      setEditedUser((prev) => ({ ...prev, phone: value }));
                      setErrorPhone(null);
                    }}
                  />
                  {errorPhone != null && <Text fontSize="sm" color="red.500">{errorPhone}</Text>}
                </FormControl>
                <FormControl mt="3">
                  <FormControl.Label>Dirección</FormControl.Label>
                  <Input value={editedUser.address}
                    onChangeText={(value) => {
                      setEditedUser((prev) => ({ ...prev, address: value }));
                      setErrorAddress(null);
                    }}
                  />
                  {errorAddress != null && <Text fontSize="sm" color="red.500">{errorAddress}</Text>}
                </FormControl>
              </>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button.Group space={2}>
              <Button
                variant="ghost"
                colorScheme="blueGray"
                onPress={() => {
                  setOpenModal(false);
                  eraseErrors();
                }}
              >
                Cerrar
              </Button>
              <Button onPress={updateUser} bg={darkBlue}>Guardar</Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>


      <Modal isOpen={openModalPassword} onClose={() => { setOpenModalPassword(false),eraseErrorsPassword() }} safeAreaTop={true}>
        <Modal.Content maxWidth="350">
          <Modal.CloseButton />
          <Modal.Header>Cambiar contraseña</Modal.Header>
          <Modal.Body>
            <FormControl mt="3">
              <FormControl.Label>Constraseña actual</FormControl.Label>
              <Input value={passwordC}
                onChangeText={(value) => {
                  setPasswordC(value);
                  setErrorPC(null);
                }}
              />
              {errorPC != null && <Text fontSize="sm" color="red.500">{errorPC}</Text>}
            </FormControl>
            <FormControl mt="3">
              <FormControl.Label>Nueva contraseña</FormControl.Label>
              <Input value={password1}
                onChangeText={(value) => {
                  setPassword1(value);
                  setErrorP1(null);
                }}
              />
              {errorP1 != null && <Text fontSize="sm" color="red.500">{errorP1}</Text>}
            </FormControl>
            <FormControl mt="3">
              <FormControl.Label>Repite la constraseña</FormControl.Label>
              <Input value={password2}
                onChangeText={(value) => {
                  setPassword2(value);
                  setErrorP2(null);
                }}
              />
              {errorP2 != null && <Text fontSize="sm" color="red.500">{errorP2}</Text>}
            </FormControl>
            {errorPassword != null && <Text fontSize="sm" color="red.500">{errorPassword}</Text>}
          </Modal.Body>
          <Modal.Footer>
            <Button.Group space={2}>
              <Button
                variant="ghost"
                colorScheme="blueGray"
                onPress={() => {
                  setOpenModalPassword(false);
                  eraseErrorsPassword();
                }}
              >
                Cerrar
              </Button>
              <Button bg={darkBlue} onPress={updatePassword}>Confirmar</Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </VStack >
  );
}