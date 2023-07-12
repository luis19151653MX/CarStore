import React, { useContext, useState, useEffect } from "react";
import { ScrollView, Text, Center, Button, VStack, Box, Image, useColorModeValue, HStack, Actionsheet, useDisclose } from "native-base";
import { MyContext } from "../../context/AppContext";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon2 from 'react-native-vector-icons/Fontisto';
import { useIsFocused } from '@react-navigation/native';
import { TouchableOpacity } from "react-native-gesture-handler";

export default function ViewProduct({ route }) {
    const bg = useColorModeValue("ligthmode.bg", "darkmode.bg");
    const darkBlue = "ligthmode.darkBlue";
    const cancel = "ligthmode.red";
    const title = "ligthmode.bg";
    const text = "#fff";
    const darkBlueIcon = "rgb(37, 150, 190)";

    const isFocused = useIsFocused();
    const { isOpen, onOpen, onClose } = useDisclose();

    const [isPc, setIsPc] = useState(false);
    const [isPadd, setIsPadd] = useState(false);

    const { apiAxios, userId, playSoundAdd, playSoundDelete, playSoundSuccess } = useContext(MyContext);
    const { IdProduct } = route.params || { IdProduct: 2 };
    const [product, setProduct] = useState({});
    const [nameIconHeart, setNameIconHeart] = useState("");
    const [isFavorite, setIsFavorite] = useState();
    const [quantity, setQuantity] = useState(1);


    useEffect(() => {
        getProduct();
    }, []);

    useEffect(() => {
        getProduct();
        setQuantity(1);
    }, [isFocused]);

    useEffect(() => {
        setIconFavorites();
    }, [product]);

    const getProduct = async () => {
        const id = IdProduct;
        await apiAxios.get(`/index_product/${id}`).then(response => {
            setProduct(response.data);
        })
            .catch(error => {
                console.error(error);
            });
    }

    const setIconFavorites = async () => {
        const config = {
            headers: { 'Content-Type': 'multipart/form-data' }
        };
        const data = new FormData();
        data.append("IdProduct", product.id);
        data.append("IdUserE", userId);
        await apiAxios.post("/favorites_isFavorite", data, config).then(
            response => {
                if (response.data == 1) {
                    setNameIconHeart("heart-minus");
                    setIsFavorite(true);
                } else {
                    setNameIconHeart("heart-plus");
                    setIsFavorite(false);
                }
            })
            .catch(error => {
                console.error(error);
            });
    }

    const clickHeart = () => {
        isFavorite ? removeFavorite() : addFavorite();
    }

    const addFavorite = async () => {
        const config = {
            headers: { 'Content-Type': 'multipart/form-data' }
        };
        const data = new FormData();
        data.append("IdUserE", userId);
        data.append("IdProduct", product.id);
        await apiAxios.post("/favorites_addFavorite", data, config).then(
            response => {
                if (response.status === 201) {
                    playSoundAdd();
                    setNameIconHeart("heart-minus");
                    setIsFavorite(true);
                }
            })
            .catch(error => {
                console.error(error);
            });
    }

    const removeFavorite = async () => {
        const config = {
            headers: { 'Content-Type': 'multipart/form-data' }
        };
        const data = new FormData();
        data.append("IdUserE", userId);
        data.append("IdProduct", product.id);
        await apiAxios.post("/favorites_removeFavoriteView", data, config).then(
            response => {
                if (response.status === 200) {
                    playSoundDelete();
                    setNameIconHeart("heart-plus");
                    setIsFavorite(false);
                }
            })
            .catch(error => {
                console.error(error);
            });
    }

    const AddShoppingCar = async () => {
        const config = {
            headers: { 'Content-Type': 'multipart/form-data' }
        };
        const data = new FormData();
        data.append("IdUserE", userId);
        data.append("IdProduct", product.id);
        data.append("quantity", quantity);
        await apiAxios.post("/listShoppingCar_addShoppingCar", data, config).then(
            response => {
                if (response.status === 200) {
                    playSoundSuccess();
                }
            })
            .catch(error => {
                console.error(error);
            });
    }


    const plusQuantity = () => {
        if (quantity < 5)
            setQuantity(quantity + 1);
    }
    const minusQuantity = () => {
        if (quantity > 1)
            setQuantity(quantity - 1);
    }

    return (
        <VStack width="100%" height="100%" bg={bg}>
            <HStack w="100%" h="40%">
                <Image
                    source={{ uri: `${product.image}` }}
                    alt="car"
                    marginTop={5}
                    marginBottom={5}
                    style={{ width: '100%', aspectRatio: 1.6 }}
                    resizeMode="contain"
                />
            </HStack>
            <HStack w="100%" h="15%">
                <Box
                    w="100%"
                    height="100%"
                    alignItems="center"
                    borderTopLeftRadius="3xl"
                    borderTopRightRadius="3xl"
                    backgroundColor={darkBlue}
                    justifyContent={"center"}
                >
                    <Text fontSize="2xl" color={title} fontWeight={"bold"}>{product.modelCar}</Text>
                    <Text fontSize="lg" color={title} fontWeight={"bold"}>$ {product.price} MXN</Text>
                </Box>
            </HStack>

            <HStack w="100%" h="45%" backgroundColor={darkBlue} p={2}>
                <ScrollView w="80%">
                    <VStack space={5}>
                        <HStack space={10}>
                            <Text fontSize="md" color={text} fontWeight={"bold"} >Año: {product.year_created}</Text>
                            <Text fontSize="md" color={text} fontWeight={"bold"} >Marca: {product.mark}</Text>
                        </HStack>
                        <Text fontSize="md" color={text} textAlign="justify" >{product.description}</Text>
                    </VStack>
                </ScrollView>
                <VStack w="20%" h="100%" alignItems="center" justifyContent="center" space={10}>
                    <TouchableOpacity onPress={() => clickHeart()} >
                        <Icon name={nameIconHeart} size={40} color={text}/>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={onOpen} >
                    <Icon2 name="shopping-basket-add" size={40} color={text}  />
                    </TouchableOpacity>
                </VStack>
            </HStack>
            <Actionsheet isOpen={isOpen} onClose={() => { onClose(), setQuantity(1) }}
                header="Agregar al carrito"
            >
                <Actionsheet.Content h="300px" >
                    <Center h="250px" >
                        <HStack h="100px" w="100%" alignItems="center" justifyContent="center" space={3}>
                            <VStack w="40%" >
                                <Text fontSize="2xl" fontWeight={"bold"} textAlign="left" >{product.modelCar}</Text>
                                <Text fontSize="xl" fontWeight={"semibold"}>Total: ${product.price * quantity}</Text>
                            </VStack>
                            <HStack space={3} w="40%">
                                <Icon name="minus-box" size={40} color={darkBlueIcon} onPress={() => minusQuantity()} />
                                <Text fontSize="2xl" fontWeight={"bold"} >{quantity}</Text>
                                <Icon name="plus-box" size={40} color={darkBlueIcon} onPress={() => plusQuantity()} />
                            </HStack>
                        </HStack>

                        <HStack h="100px" alignItems="center" justifyContent="center" space={3}>

                            <Button
                                bgColor={cancel}
                                onPress={onClose}
                                onPressIn={() => setIsPc(true)}
                                onPressOut={() => setIsPc(false)}
                                style={{
                                    opacity: isPc ? 0.5 : 1,
                                }}
                                shadow={8}
                                _text={{ fontSize: "xl" }}

                            >
                                Cancelar
                            </Button>
                            <Button
                                bgColor={darkBlue}
                                shadow={8}
                                _text={{ fontSize: "xl" }}
                                onPress={() => { AddShoppingCar(), onClose() }}
                                onPressIn={() => setIsPadd(true)}
                                onPressOut={() => setIsPadd(false)}
                                style={{
                                    opacity: isPadd ? 0.5 : 1,
                                }}
                            >
                                Agregar al carrito
                            </Button>
                        </HStack>
                    </Center>
                </Actionsheet.Content>
            </Actionsheet>
        </VStack>
    );
}