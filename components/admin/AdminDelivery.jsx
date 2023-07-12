import React, { useEffect, useState, useContext } from "react";
import { useColorModeValue, Box, VStack, Text, ScrollView, HStack, Modal, Divider, Button, Center, Image, FormControl, Input } from "native-base";
import { MyContext } from "../../context/AppContext";
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useIsFocused } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons';
import Title from "../sharecomponents/Title";
import { TouchableOpacity } from 'react-native';

export default function AdminDelivery() {
  const bg = useColorModeValue("#ffffff", "#000000");
  const darkBlue = "#0E7490";
  const Tab = createMaterialTopTabNavigator();
  const { apiAxios, playSoundSuccess } = useContext(MyContext);
  const inputColor = "#33919C";


  function PendingPackages() {
    const isFocused = useIsFocused();
    const [textNoBuys, setTextNoBuys] = useState("");
    const [pendingBuys, setPendingBuys] = useState([]);
    const [pendingProducts, setPendingProducts] = useState([]);
    //USer password
    const [IdShoppingCar, setIdShoppingCar] = useState(0);
    const [idBuy, setIdBuy] = useState(0);
    const [showFormPassword, setShowFormPassword] = useState(false);
    const [errorPassword, setErrorPassword] = useState("");
    const [userPassword, setUserPassword] = useState("");

    //Modal
    const [openModal, setOpenModal] = useState(false);
    const modalOpen = () => {
      setOpenModal(true);
    };
    //modalbuttons
    const [isPressedClose, setIsPressedClose] = useState(false);
    const [isPressedDeliver, setIsPressedDeliver] = useState(false);

    useEffect(() => {
      getPendingBuys();
    }, [isFocused]);

    const getPendingBuys = async () => {
      await apiAxios.get("/buyUser_getPendingBuys").then(response => {
        setPendingBuys(response.data);
        if (response.data.length == 0)
          setTextNoBuys("Sin pedidos por entregar")
        else setTextNoBuys("");
      })
        .catch(error => {
          console.error(error);
        });
    }

    const getPendingProducts = async (id) => {
      await apiAxios.get(`/buyUser_getBuyProducts/${id}`).then(response => {
        setPendingProducts(response.data);
        setIdShoppingCar(id);
      })
        .catch(error => {
          console.error(error);
        });
    }

    //password deliver
    const deliverWithPassword = async () => {

      if (userPassword.length >= 8 && userPassword.length <= 16) {
        setErrorPassword("");
        const config = {
          headers: { 'Content-Type': 'multipart/form-data' }
        };
        const data = new FormData();
        data.append("IdShoppingCar", IdShoppingCar);
        data.append("password", userPassword);
        await apiAxios.post("/buyUser_deliver", data, config).then(
          response => {
            if (response.status != 200) {
              setErrorPassword("Contraseña incorrecta");
            } else {
              setOpenModal(false);
              setUserPassword("");
              setErrorPassword("");
              setShowFormPassword(false);
              //change status 2
              changeStatusToDeliver();
              setIdShoppingCar(0);

            }
          })
          .catch(error => {
            console.error(error);
          });
      } else {
        setErrorPassword("La contraseña debe tener entre 8 y 16 caracteres.")
      }
    }

    //change status 2
    const changeStatusToDeliver = async () => {
      await apiAxios.put(`/buyUser_changeStatus/${idBuy}`).then(
        response => {
          if (response.status === 200) {
            getPendingBuys();
            setIdBuy(0);
            playSoundSuccess();
          }
        })
        .catch(error => {
          console.error(error);
        });
    }

    return (
      <VStack width="100%" height="100%" bg={bg}>
        <ScrollView w="100%">
          <Center  >
            {
              pendingBuys.length !== 0 ? (
                pendingBuys.map((pending) => (
                  <ScrollView key={pending.id} marginTop={10}>
                    <Box
                      borderColor={darkBlue}
                      borderWidth="1"
                      p="7"
                      rounded="xl"
                      w={350}
                      key={`pb-${pending.id}`}
                    >
                      <HStack >
                        <VStack w="70%" >
                          <Text fontSize={"lg"}>
                            <Text style={{ fontWeight: 'bold' }} color={darkBlue} >Fecha: </Text>{pending.date_created}
                          </Text>
                          <Text fontSize={"lg"}>
                            <Text style={{ fontWeight: 'bold' }} color={darkBlue} >Cliente: </Text>{pending.name}
                          </Text>
                          <Text fontSize={"lg"}>
                            <Text style={{ fontWeight: 'bold' }} color={darkBlue} >Dirección: </Text>{pending.address}
                          </Text>
                          <Text fontSize={"lg"}>
                            <Text style={{ fontWeight: 'bold' }} color={darkBlue}  >Teléfono: </Text>{pending.phone}
                          </Text>
                          <Text fontSize={"lg"}>
                            <Text style={{ fontWeight: 'bold' }} color={darkBlue}  >Total: $ </Text>{pending.total} MXN</Text>
                          <Text fontSize={"lg"}>
                            <Text style={{ fontWeight: 'bold' }} color={darkBlue}  >Método de pago: </Text>Paypal
                          </Text>
                          <Box bg={pending.status === 1 ? "#DEC33A" : "#22A00D"}>
                            <Text fontSize={"lg"}>Estado: {pending.status == 1 ? "Pendiente" : "Entregado"} </Text>
                          </Box>
                        </VStack>

                        <VStack w="30%" justifyContent={"center"} alignItems={"center"} >
                          <TouchableOpacity onPress={() => { getPendingProducts(pending.IdShoppingCar), setIdBuy(pending.id), modalOpen() }}>
                            <Icon2 name="truck-delivery" color={darkBlue} size={80} />
                          </TouchableOpacity>

                        </VStack>
                      </HStack>
                    </Box>

                  </ScrollView>
                ))
              ) : (
                <Center height="100%" justifyContent="center">
                  <Text fontWeight={"bold"} textAlign={"center"} fontSize={19} marginLeft={10}>{textNoBuys}</Text>
                </Center>
              )
            }
          </Center>
        </ScrollView>
        <Modal isOpen={openModal} onClose={() => { setOpenModal(false), setUserPassword(""), setErrorPassword(""), setShowFormPassword(false) }} safeAreaTop={true}>
          <Modal.Content maxWidth="350">
            <Modal.CloseButton />
            <Modal.Header>Detalles de compra</Modal.Header>
            <Modal.Body >
              <Text>Fecha: {pendingProducts.length > 0 ? pendingProducts[0].date_created : ''}</Text>
              <Divider my={3}></Divider>
              <Text>Paquetería: ESTAFETA</Text>
              <Text>Costo de envió: $20.00 MXN </Text>
              <Divider my={3}></Divider>
              <Text>Total: $ {pendingProducts.length > 0 ? pendingProducts[0].total : ''}MXN </Text>
              <Text>Método de pago: Paypal </Text>
              <Divider my={3}></Divider>
              <Text textAlign="center" fontWeight="bold">Productos </Text>
              <ScrollView>
                {
                  pendingProducts.length !== 0 ? (
                    pendingProducts.map((pendingP, index) => (
                      <VStack key={`pPs-${index}`}>
                        <Divider my={4}></Divider>
                        <Text>Modelo de carro: {pendingP.modelCar}</Text>
                        <Text>Cantidad: {pendingP.quantity} </Text>
                        <Text>Importe: $ {pendingP.price * pendingP.quantity} MXN</Text>
                        {
                          <Image
                            style={{ width: '100%', aspectRatio: 1.6 }}
                            resizeMode="contain"
                            source={{ uri: `${pendingP.image}` }}
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
              {
                showFormPassword && (
                  <HStack>
                    <FormControl mt="3">
                      <FormControl.Label>Contraseña </FormControl.Label>
                      <Input
                        secureTextEntry={true}
                        onChangeText={(value) => setUserPassword(value)}
                      />
                      {errorPassword !== "" && <Text fontSize="sm" color="red.500">{errorPassword}</Text>}
                    </FormControl>
                  </HStack>
                )
              }
              <HStack w="100%" space={5} justifyContent="flex-end">
                <Button
                  background={inputColor}
                  _text={{ fontSize: "md" }}
                  onPress={() => { setOpenModal(false), setUserPassword(""), setErrorPassword(""), setShowFormPassword(false) }}
                  onPressIn={() => setIsPressedClose(true)}
                  onPressOut={() => setIsPressedClose(false)}
                  style={{
                    transform: [{ scale: isPressedClose ? 1.1 : 1 }],
                    opacity: isPressedClose ? 0.8 : 1,
                  }}>
                  Cerrar
                </Button>
                <Button
                  background={darkBlue}
                  _text={{ fontSize: "md" }}
                  onPress={() => { showFormPassword ? deliverWithPassword() : setShowFormPassword(true) }}
                  onPressIn={() => setIsPressedDeliver(true)}
                  onPressOut={() => setIsPressedDeliver(false)}
                  style={{
                    transform: [{ scale: isPressedDeliver ? 1.1 : 1 }],
                    opacity: isPressedDeliver ? 0.8 : 1,
                  }}>
                  {showFormPassword ? "Confirmar" : "Entregar"}
                </Button>
              </HStack>

            </Modal.Footer>
          </Modal.Content>
        </Modal>
      </VStack>
    );
  }

  function DeliveryPackages() {
    const isFocused = useIsFocused();
    const [textNoBuys, setTextNoBuys] = useState("");
    const [deliveryBuys, setDeliveryBuys] = useState([]);
    const [deliveryProducts, setDeliveryProducts] = useState([]);

    //Modal
    const [openModal, setOpenModal] = useState(false);
    const modalOpen = () => {
      setOpenModal(true);
    };
    //modalbuttons
    const [isPressedClose, setIsPressedClose] = useState(false);

    useEffect(() => {
      getDeliveryBuys();
    }, [isFocused]);

    const getDeliveryBuys = async () => {
      await apiAxios.get("/buyUser_getDeliveryBuys").then(response => {
        setDeliveryBuys(response.data);
        if (response.data.length == 0)
          setTextNoBuys("Sin pedidos entregados")
        else setTextNoBuys("");
      })
        .catch(error => {
          console.error(error);
        });
    }

    const getDeliveryProducts = async (id) => {
      await apiAxios.get(`/buyUser_getBuyProducts/${id}`).then(response => {
        setDeliveryProducts(response.data);
      })
        .catch(error => {
          console.error(error);
        });
    }

    return (
      <VStack width="100%" height="100%" bg={bg}>
        <ScrollView>
          <Center  >
            {
              deliveryBuys.length !== 0 ? (
                deliveryBuys.map((delivery) => (
                  <ScrollView key={delivery.id} marginTop={10}>
                    <Box
                      borderColor={darkBlue}
                      borderWidth="1"
                      p="7"
                      rounded="xl"
                      w={350}
                      key={`db-${delivery.id}`}
                    >
                      <HStack>
                        <VStack>
                          <Text>Fecha: {delivery.date_created} </Text>
                          <Text>Total: $ {delivery.total} MXN </Text>
                          <Text>Método de pago: Paypal </Text>
                          <Box bg={delivery.status === 1 ? "#DEC33A" : "#22A00D"}>
                            <Text >Estado: {delivery.status == 1 ? "Pendiente" : "Entregado"} </Text>
                          </Box>
                        </VStack>

                        <VStack marginLeft={16} justifyContent={"center"}>
                          <TouchableOpacity onPress={() => { getDeliveryProducts(delivery.IdShoppingCar), modalOpen() }}>
                            <Icon name="info-circle" color={darkBlue} size={50} />
                          </TouchableOpacity>

                        </VStack>
                      </HStack>
                    </Box>

                  </ScrollView>
                ))
              ) : (
                <Center height="100%" justifyContent="center">
                  <Text fontWeight={"bold"} textAlign={"center"} fontSize={19} marginLeft={10}>{textNoBuys}</Text>
                </Center>
              )
            }
          </Center>
        </ScrollView>
        <Modal isOpen={openModal} onClose={() => setOpenModal(false)} safeAreaTop={true}>
          <Modal.Content maxWidth="350">
            <Modal.CloseButton />
            <Modal.Header>Detalles de compra</Modal.Header>
            <Modal.Body >
              <Text>Fecha: {deliveryProducts.length > 0 ? deliveryProducts[0].date_created : ''}</Text>
              <Divider my={3}></Divider>
              <Text>Paquetería: ESTAFETA</Text>
              <Text>Costo de envió: $20.00 MXN </Text>
              <Divider my={3}></Divider>
              <Text>Total: $ {deliveryProducts.length > 0 ? deliveryProducts[0].total : ''}MXN </Text>
              <Text>Método de pago: Paypal </Text>
              <Divider my={3}></Divider>
              <Text textAlign="center" fontWeight="bold">Productos </Text>
              <ScrollView>
                {
                  deliveryProducts.length !== 0 ? (
                    deliveryProducts.map((deliveryP, index) => (
                      <VStack key={`dPs-${index}`}>
                        <Divider my={4}></Divider>
                        <Text>Modelo de carro: {deliveryP.modelCar}</Text>
                        <Text>Cantidad: {deliveryP.quantity} </Text>
                        <Text>Importe: $ {deliveryP.price * deliveryP.quantity} MXN</Text>
                        {
                          <Image
                            style={{ width: '100%', aspectRatio: 1.6 }}
                            resizeMode="contain"
                            source={{ uri: `${deliveryP.image}` }}
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
              <HStack w="100%" justifyContent="flex-end">
                <Button
                  background={inputColor}
                  _text={{ fontSize: "md" }}
                  onPress={() => { setOpenModal(false); }}
                  onPressIn={() => setIsPressedClose(true)}
                  onPressOut={() => setIsPressedClose(false)}
                  style={{
                    transform: [{ scale: isPressedClose ? 1.1 : 1 }],
                    opacity: isPressedClose ? 0.8 : 1,
                  }}>
                  Cerrar
                </Button>
              </HStack>
            </Modal.Footer>
          </Modal.Content>
        </Modal>
      </VStack>
    );
  }

  return (
    <VStack width="100%" height="100%" bg={bg}>
      <Box h="70px"></Box>
      <Title screenTitle="Pedidos" />
      <Box h="30px"></Box>
      <Tab.Navigator initialRouteName="adminPendingPackages">
        <Tab.Screen name="adminPendingPackages" component={PendingPackages}
          options={{
            title: 'Pendientes',
          }} />
        <Tab.Screen name="adminDeliveryPackages" component={DeliveryPackages}
          options={{
            title: 'Entregados',
          }} />

      </Tab.Navigator>

    </VStack >
  );
}
