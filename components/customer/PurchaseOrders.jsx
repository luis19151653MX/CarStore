import React, { useContext, useState, useEffect } from "react";
import { Center, Text, useColorModeValue, ScrollView, Box, HStack, VStack, Button, Modal, Divider, Image } from "native-base";
import { useIsFocused } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { MyContext } from "../../context/AppContext";
import Title from "../sharecomponents/Title";
import Icon from 'react-native-vector-icons/FontAwesome5';
import { TouchableOpacity } from "react-native-gesture-handler";

export default function Purchase({ route }) {
  const bg = useColorModeValue("ligthmode.bg", "darkmode.bg");
  const darkBlue = "ligthmode.darkBlue";
  const navigation = useNavigation();

  const { apiAxios } = useContext(MyContext);
  const { userId } = useContext(MyContext);
  const isFocused = useIsFocused();
  const [isP, setIsP] = useState(false);

  const [purchase, setPurchase] = useState([]);
  const [listProduct, setListProduct] = useState([]);

  const [idShoppingCar, setIdShoppingCar] = useState(null);
  const [dateModal, setDateModal] = useState("2023-09-26");
  const [totalModal, setTotalModal] = useState(0);

  //Modal
  const [openModal, setOpenModal] = useState(false);

  const modalOpen = () => {
    setOpenModal(true);
  };

  useEffect(() => {
    getPurchase();
  }, [isFocused]);

  useEffect(() => {
    getPurchase();
  }, []);

  useEffect(() => {
    getListProduct();
  }, [idShoppingCar]);

  const getPurchase = async () => {
    const config = {
      headers: { 'Content-Type': 'multipart/form-data' }
    };
    const data = new FormData();
    data.append("idUserE", userId);

    await apiAxios.post(`/buyUser_index`, data, config).then(response => {
      setPurchase(response.data);
    })
      .catch(error => {
        console.error(error);
      });
  }

  const getListProduct = async () => {
    const config = {
      headers: { 'Content-Type': 'multipart/form-data' }
    };
    const data = new FormData();
    data.append("idShopping", idShoppingCar);

    await apiAxios.post(`/listShoppingCar_index`, data, config).then(response => {
      setListProduct(response.data);
      console.log(idShoppingCar);
      console.log(response.data);
    })
      .catch(error => {
        console.error(error)
      });
  }

  const navigateCatalog = () => {
    navigation.navigate("Catalog");
  }


  return (
    <VStack width="100%" height="100%" bg={bg}>

      <Title screenTitle="Órdenes de compra" />


      {
        purchase.length !== 0 ? (
          <ScrollView w="100%" h="100%">
            <Center width="100%" height="100%" bg={bg}>

              {
                purchase.map((purchaseItem) => (
                  <ScrollView key={purchaseItem.id} marginTop={10}>
                    <Box
                      borderColor={darkBlue}
                      borderWidth="1"
                      p="7"
                      rounded="xl"
                      w={350}
                      key={`purchase-${purchaseItem.id}`}
                    >
                      <HStack>
                        <VStack>
                          <Text>Fecha: {purchaseItem.date_created} </Text>
                          <Text>Total: $ {purchaseItem.total} MXN </Text>
                          <Text>Método de pago: Paypal </Text>
                          <Text style={purchaseItem.status === 1 ? { color: "#DEC33A" } : { color: "#22A00D" }}>Estado: {purchaseItem.status == 1 ? "pendiente" : "entregado"} </Text>

                        </VStack>

                        <VStack marginLeft={16} justifyContent={"center"}>
                          <TouchableOpacity onPress={() => { setIdShoppingCar(purchaseItem.IdShoppingCar), setDateModal(purchaseItem.date_created), setTotalModal(purchaseItem.total), modalOpen() }}>
                            <Icon
                              name="info-circle"
                              color={"#0E7490"}
                              size={50}

                            />
                          </TouchableOpacity>
                        </VStack>
                      </HStack>
                    </Box>


                    <Modal isOpen={openModal} onClose={() => setOpenModal(false)} safeAreaTop={true}>
                      <Modal.Content maxWidth="350">
                        <Modal.CloseButton />
                        <Modal.Header>Detalles de compra</Modal.Header>
                        <Modal.Body >
                          <Text>Fecha: {dateModal}</Text>
                          <Divider my={3}></Divider>
                          <Text>Paquetería: ESTAFETA</Text>
                          <Text>Costo de envió: $20.00 MXN </Text>
                          <Divider my={3}></Divider>
                          <Text>Total: $ {totalModal} MXN </Text>
                          <Text>Método de pago: Paypal </Text>
                          <Divider my={3}></Divider>
                          <Text textAlign="center" fontWeight="bold">Productos </Text>
                          <ScrollView>
                            {
                              listProduct.length !== 0 ? (
                                listProduct.map((listProductItem, index) => (
                                  <VStack key={`prmp-${index}`}>
                                    <Divider my={4}></Divider>
                                    <Text>Modelo de carro: {listProductItem.modelCar}</Text>
                                    <Text>Cantidad: {listProductItem.quantity} </Text>
                                    <Text>Importe: $ {listProductItem.price * listProductItem.quantity} MXN</Text>
                                    {
                                      <Image
                                        style={{ width: '100%', aspectRatio: 1.6 }}
                                        resizeMode="contain"
                                        source={{ uri: `${listProductItem.image}` }}
                                        alt="image"
                                      />
                                    }

                                  </VStack>
                                ))
                              ) : null
                            }

                          </ScrollView>
                        </Modal.Body>
                        <Modal.Footer>
                          <Button.Group space={2}>
                            <Button onPress={() => {
                              setOpenModal(false);
                            }}
                              onPressIn={() => setIsP(true)}
                              onPressOut={() => setIsP(false)}
                              style={{
                                opacity: isP ? 0.6 : 1,
                              }}
                              background={darkBlue}>
                              Cerrar
                            </Button>
                          </Button.Group>
                        </Modal.Footer>
                      </Modal.Content>
                    </Modal>
                  </ScrollView>
                ))
              }

            </Center>
          </ScrollView>
        ) : (
          <Center height="100%" justifyContent="center">
            <Button bgColor="ligthmode.accent" onPress={navigateCatalog} rounded={2} h={10} _text={{ fontSize: "lg" }}  >
              Visitar el catálogo
            </Button>
          </Center>
        )
      }

    </VStack >
  );
}