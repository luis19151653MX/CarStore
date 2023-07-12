import React, { useEffect, useState, useContext } from "react";
import { useNavigation } from '@react-navigation/native';
import { Center, Text, useColorModeValue, Box, Image, ScrollView, VStack, Button, Pressable, HStack, Actionsheet, useDisclose } from "native-base";
import { MyContext } from "../../context/AppContext";
import Title from "../sharecomponents/Title";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useIsFocused } from '@react-navigation/native';

export default function ShoppingCar() {
  const bg = useColorModeValue("ligthmode.bg", "darkmode.bg");
  const title = "ligthmode.bg";
  const accent = "ligthmode.accent";
  const input = "ligthmode.input";
  const darkBlue = "ligthmode.darkBlue";
  const darkBlueIcon = "rgb(37, 150, 190)";
  const cancel = "ligthmode.red";

  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const { isOpen, onOpen, onClose } = useDisclose();

  //Buttons
  const [isP, setIsP] = useState(false);
  const [isPc, setIsPc] = useState(false);
  const [isPadd, setIsPadd] = useState(false);

  const { apiAxios, userId, playSoundDelete, playSoundSuccess } = useContext(MyContext);

  const [listSC, setListSC] = useState([]);
  const [selectList, setSelectList] = useState({});
  const [shoppingCarId, setShoppingCarId] = useState(null);
  const [total, setTotal] = useState(null);

  useEffect(() => {
    getListSC();
  }, [isFocused]);

  const navigateCatalog = () => {
    navigation.navigate("Catalog");
  }
  const navigateProductView = (IdProduct) => {
    navigation.navigate("Product", { IdProduct });
  }
  const navigatePurchase = () => {
    navigation.navigate("Purchase");
  }

  const getListSC = async () => {
    try {
      const config = {
        headers: { 'Content-Type': 'multipart/form-data' }
      };
      const data = new FormData();
      data.append("IdUserE", userId);
      const response = await apiAxios.post("/usere_getShoppingCar", data, config);

      setListSC(response.data);
      if (response.data.length > 0) {
        //console.log("id del carrito: " + response.data[0].IdShoppingCar);
        //console.log(response.data[0]);
        setShoppingCarId(response.data[0].IdShoppingCar);
        await getTotal(response.data[0].IdShoppingCar); // Llamada a getTotal aquí
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getTotal = async (idSC) => {
    try {
      const config = {
        headers: { 'Content-Type': 'multipart/form-data' }
      };
      const data = new FormData();
      data.append("id", idSC);
      const response = await apiAxios.post("/shoppingCar_getTotal", data, config);
      //console.log("Total del carrito: " + response.data);
      setTotal(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteListSC = async (id) => {
    await apiAxios.put(`/listShoppingCar_changueVisibility/${id}`).then(
      response => {
        if (response.status === 200) {
          getListSC();
          playSoundDelete();
        }
      })
      .catch(error => {
        console.error(error);
      });
  }

  const updateQuantity = async () => {
    await apiAxios.put(`/listShoppingCar_updateQuantity/${selectList.id}/${selectList.quantity}`).then(
      response => {
        if (response.status === 200) {
          getListSC();
          playSoundSuccess();
        }
      })
      .catch(error => {
        console.error(error);
      });
  }

  const plusQuantity = () => {
    const newQuantity = selectList.quantity + 1;
    if (selectList.quantity < 5)
      setSelectList({ ...selectList, quantity: newQuantity });
  }
  const minusQuantity = () => {
    const newQuantity = selectList.quantity - 1;
    if (selectList.quantity > 1)
      setSelectList({ ...selectList, quantity: newQuantity });
  }

  async function payment() {
    const config = {
      headers: { 'Content-Type': 'multipart/form-data' }
    };
    const data = new FormData();
    data.append("id", shoppingCarId);
    data.append("total", total);
    await apiAxios.post("/shoppingCar_pay", data, config).then(
      response => {
        if (response.status === 200) {
          playSoundSuccess();
          navigatePurchase();
        }
      })
      .catch(error => {
        console.error(error);
      });
  }

  return (
    <VStack width="100%" height="100%" bg={bg}>
      <Title screenTitle="Carrito de compras" />
      <Box h="5%"></Box>
      {
        listSC.length != 0 ? (
          <VStack w="100%" h="85%" space={3}>
            <ScrollView w="100%" h="80%">
              <Center justifyContent="center" mr={10} ml={10} >
                <VStack w="100%">
                  {
                    listSC.map((list) => (
                      <Pressable onPress={() => { navigateProductView(list.IdProduct) }} key={`lscp--${list.id}`} >
                        {({ isPressed }) => {
                          return (
                            <Box h="150px"
                              my={2}
                              bg={isPressed ? accent : bg}
                              style={{
                                transform: [
                                  {
                                    scale: isPressed ? 0.96 : 1,
                                  },
                                ],
                              }}
                              p={.5}
                              rounded="8"
                              shadow={8}
                              borderWidth="1"
                              borderColor={darkBlue}>
                              <HStack alignItems="center" h="100%">
                                <VStack w="60%" h="100%">
                                  <Image
                                    source={{ uri: list.image }}
                                    alt="Car"
                                    resizeMode="contain"
                                    style={{ width: "100%", height: "100%" }}
                                  />
                                </VStack>

                                <VStack w="40%" h="100%" alignItems="center" justifyContent="center">
                                  <Box >
                                    <Text fontSize="lg" fontWeight="semibold" color={isPressed ? title : null}>{list.modelCar}</Text>
                                  </Box>
                                  <Box>
                                    <Text color={isPressed ? title : null}>$ {list.price * list.quantity} MXN</Text>
                                  </Box>
                                  <Box >
                                    <Text color={isPressed ? title : null}>Cantidad: {list.quantity}</Text>
                                  </Box>
                                  <Box>
                                    {""}
                                  </Box>
                                  <HStack space={3} alignItems="center">
                                    <Icon name="tooltip-edit" size={40} color={isPressed ? "#fff" : darkBlueIcon} onPress={() => { onOpen(), setSelectList(list) }} />
                                    <Icon name="delete" size={43} color={isPressed ? "#fff" : darkBlueIcon} onPress={() => deleteListSC(list.id)} />
                                  </HStack>
                                </VStack>
                              </HStack>
                            </Box>
                          );
                        }}
                      </Pressable>
                    ))
                  }
                </VStack>
              </Center>
            </ScrollView>
            <Center h="10%" w="100%" ml={20}>
              <Pressable h="100%" w="100%" onPress={payment}>
                {({ isPressed }) => {
                  return (
                    <Box
                      bgColor={darkBlue}
                      style={{
                        transform: [{ scale: isPressed ? 1.05 : 1 }],
                        opacity: isPressed ? 0.95 : 1,
                      }}
                      borderTopLeftRadius="full"
                      shadow={20}
                      h="100%"
                      w="100%"
                      alignItems="center" justifyContent="center"
                    >
                      <Text color={title} fontSize="2xl" fontWeight="semibold">Pagar</Text>
                      <Text color={title} fontSize="2xl">${total} MXN</Text>
                    </Box>
                  );
                }}
              </Pressable>
            </Center>
          </VStack>
        ) : (
          <Center height="100%" justifyContent="center">
            <Button bgColor="ligthmode.accent" rounded={2} onPress={navigateCatalog} h={10} _text={{ fontSize: "lg" }} onPressIn={() => setIsP(true)}
              onPressOut={() => setIsP(false)}
              style={{
                opacity: isP ? 0.8 : 1,
              }}  >
              Visitar el catálogo
            </Button>
          </Center>
        )
      }
      {
        selectList && (
          <Actionsheet isOpen={isOpen} onClose={() => { onClose() }}
            header="Modificar"
          >
            <Actionsheet.Content h="300px" >
              <Center h="250px" >
                <HStack h="100px" w="100%" alignItems="center" justifyContent="center" space={3}>
                  <VStack w="40%" >
                    <Text fontSize="2xl" fontWeight={"bold"} textAlign="left" >{selectList.modelCar}</Text>
                    <Text fontSize="xl" fontWeight={"semibold"}>Total: ${selectList.price * selectList.quantity}</Text>
                  </VStack>
                  <HStack space={3} w="40%">
                    <Icon name="minus-box" size={40} color={darkBlueIcon} onPress={() => minusQuantity()} />
                    <Text fontSize="2xl" fontWeight={"bold"} >{selectList.quantity}</Text>
                    <Icon name="plus-box" size={40} color={darkBlueIcon} onPress={() => plusQuantity()} />
                  </HStack>
                </HStack>

                <HStack h="100px" alignItems="center" justifyContent="center" space={3}>

                  <Button
                    bgColor={cancel}
                    shadow={8}
                    _text={{ fontSize: "xl" }}
                    onPress={onClose}
                    onPressIn={() => setIsPc(true)}
                    onPressOut={() => setIsPc(false)}
                    style={{
                      opacity: isPc ? 0.5 : 1,
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button
                    bgColor={darkBlue}
                    shadow={8}
                    _text={{ fontSize: "xl" }}
                    onPress={() => { onClose(), updateQuantity() }}
                    onPressIn={() => setIsPadd(true)}
                    onPressOut={() => setIsPadd(false)}
                    style={{
                      opacity: isPadd ? 0.5 : 1,
                    }}
                  >
                    Guardar cambios
                  </Button>
                </HStack>
              </Center>
            </Actionsheet.Content>
          </Actionsheet>
        )
      }

    </VStack>
  );
}