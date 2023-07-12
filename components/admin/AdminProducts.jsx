import React, { useContext, useState, useEffect } from "react";
import { Select, Modal, Spacer, Text, VStack, FlatList, Box, FormControl, Input, Image, useColorModeValue, HStack, Button, Center } from "native-base";
import { MyContext } from "../../context/AppContext";
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useIsFocused } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native';
import Title from "../sharecomponents/Title";

export default function AdminProductos() {
    const bg = useColorModeValue("ligthmode.bg", "darkmode.bg");
    const darkBlue = "#0E7490";
    const isFocused = useIsFocused();


    const { apiAxios } = useContext(MyContext);
    const [products, setProducts] = useState([]);

    //modal
    const [openModal, setOpenModal] = useState(false);
    const modalOpen = () => { setOpenModal(true); };

    const [openModal2, setOpenModal2] = useState(false);
    const modalOpen2 = () => { setOpenModal2(true); };

    //edit
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [editedProduct, setEditedProduct] = useState("");

    //validation
    const [errorModalCar, setErrorModalCar] = useState(null);
    const [errorDescription, setErrorDescription] = useState(null);
    const [errorStock, setErrorStock] = useState(null);
    const [errorPrice, setErrorPrice] = useState(null);
    const [errorMark, setErrorMark] = useState(null);
    const [errorCategory, setErrorCategory] = useState(null);
    const [errorYear, setErrorYear] = useState(null);
    const [errorImage, setErrorImage] = useState(null);


    useEffect(() => {
        getProducts();
    }, [])

    useEffect(() => {
        getProducts();
    }, [isFocused]);

    //store
    const [storeProduct, setStoreProduct] = useState({
        modelCar: '',
        description: '',
        stock: '',
        price: '',
        mark: '',
        category: '',
        year_created: '',
        image: ''
    });

    const getProducts = async () => {
        await apiAxios.get('/index_products').then(response => {
            setProducts(response.data);
        })
            .catch(error => {
                console.error(error);
            });
    }

    const storeProducts = async () => {
        try {
            if (storeProduct.modelCar === "") {
                setErrorModalCar("Campo vacío.");
            } else if (storeProduct.description === "") {
                setErrorDescription("Campo vacío.");
            } else if (storeProduct.stock === "") {
                setErrorStock("Campo vacío");
            } else if (parseFloat(storeProduct.stock) <= 0) {
                setErrorStock("El stock debe ser mayor a 0.");
            } else if (storeProduct.price === "") {
                setErrorPrice("Campo vacío.");
            } else if (parseFloat(storeProduct.price) <= 0) {
                setErrorPrice("El precio debe ser mayor a 0.");
            } else if (storeProduct.mark === "") {
                setErrorMark("Campo vacío.");
            } else if (storeProduct.category === "") {
                setErrorCategory("Campo vacío.");
            } else if (storeProduct.year_created === "") {
                setErrorYear("Campo vacío.");
            } else if (storeProduct.image === "") {
                setErrorImage("Campo vacío.");
            } else {
                const response = await apiAxios.post('/products_store', storeProduct);
                console.log(response.data);
                setStoreProduct({
                    modelCar: '',
                    description: '',
                    stock: '',
                    price: '',
                    mark: '',
                    category: '',
                    year_created: '',
                    image: ''
                });
                getProducts();
                if (response.status >= 200 && response.status < 300) {
                    setOpenModal(false);
                }
            }

        } catch (error) {
            console.error(error);
        }
    };

    //edit
    const openModalWithProduct = (productId) => {
        const product = products.find((p) => p.id === productId);
        setSelectedProduct(product);
        setEditedProduct({ ...product });
        setOpenModal2(true);
        console.log(product);
    };

    const saveChanges = async () => {
        try {
            if (editedProduct.modelCar === "") {
                setErrorModalCar("Campo vacío.");
            } else if (editedProduct.description === "") {
                setErrorDescription("Campo vacío.");
            } else if (isNaN(parseFloat(editedProduct.stock))) {
                setErrorStock("Campo vacío");
            } else if (parseFloat(editedProduct.stock) <= 0) {
                setErrorStock("El stock debe ser mayor a 0.");
            } else if (editedProduct.price === "") {
                setErrorPrice("Campo vacío.");
            } else if (parseFloat(editedProduct.price) <= 0) {
                setErrorPrice("El precio debe ser mayor a 0.");
            } else if (editedProduct.mark === "") {
                setErrorMark("Campo vacío.");
            } else if (editedProduct.category === "") {
                setErrorCategory("Campo vacío.");
            } else if (editedProduct.year_created === "") {
                setErrorYear("Campo vacío.");
            } else if (editedProduct.image === "") {
                setErrorImage("Campo vacío.");
            } else {
                const response = await apiAxios.post('/products_update', editedProduct);
                console.log(response.data);
                getProducts();
                if (response.status >= 200 && response.status < 300) {
                    setOpenModal2(false);
                }
         }
        } catch (error) {
            console.error(error);
        }
    };

    return (

        <VStack width="100%" height="100%" bg={bg}>
            <Box h="70px"></Box>
            <Title screenTitle="Productos" />


            <Button onPress={modalOpen} titleButton="nuevo producto" bg="#0E7490" marginBottom={5}
                marginTop={5} marginLeft={20} margin={20} size={"lg"}
                leftIcon={<Icon name="plus" size={12} color="white" />}>
                Nuevo producto
            </Button>

            <Modal isOpen={openModal} onClose={() => setOpenModal(false)} safeAreaTop={true}>
                <Modal.Content maxWidth="350">
                    <Modal.CloseButton />
                    <Modal.Header>Agregar nuevo producto</Modal.Header>
                    <Modal.Body>
                        <FormControl>
                            <FormControl.Label>Modelo del carro</FormControl.Label>
                            <Input value={storeProduct.modelCar}
                                onChangeText={(value) => {
                                    if (value === "") {
                                        setErrorModalCar("Campo vacío.")
                                    } else {
                                        setStoreProduct((prev) => ({ ...prev, modelCar: value }));
                                        setErrorModalCar("");
                                    }
                                }} />
                            {errorModalCar !== "" && <Text fontSize="sm" color="red.500">{errorModalCar}</Text>}
                        </FormControl>
                        <FormControl mt="3">
                            <FormControl.Label>Descripción</FormControl.Label>
                            <Input value={storeProduct.description}
                                onChangeText={(value) => {
                                    if (value === "") {
                                        setErrorDescription("Campo vacío.")
                                    } else {
                                        setStoreProduct((prev) => ({ ...prev, description: value }));
                                        setErrorDescription("");
                                    }
                                }} />
                            {errorDescription !== "" && <Text fontSize="sm" color="red.500">{errorDescription}</Text>}
                        </FormControl>
                        <FormControl mt="3">
                            <FormControl.Label>Stock</FormControl.Label>
                            <Input keyboardType="numeric" value={storeProduct.stock}
                                onChangeText={(value) => {
                                    if (value === "") {
                                        setErrorStock("Campo vacío.")
                                    } else {
                                        setStoreProduct((prev) => ({ ...prev, stock: value }));
                                        setErrorStock("");
                                    }
                                }} />
                            {errorStock !== "" && <Text fontSize="sm" color="red.500">{errorStock}</Text>}
                        </FormControl>
                        <FormControl mt="3">
                            <FormControl.Label>Price</FormControl.Label>
                            <Input keyboardType="numeric" value={storeProduct.price}
                                onChangeText={(value) => {
                                    if (value === "") {
                                        setErrorPrice("Campo vacío.")
                                    } else {
                                        setStoreProduct((prev) => ({ ...prev, price: value }));
                                        setErrorPrice("");
                                    }
                                }} />
                            {errorPrice !== "" && <Text fontSize="sm" color="red.500">{errorPrice}</Text>}
                        </FormControl>
                        <FormControl mt="3">
                            <FormControl.Label>Marca</FormControl.Label>
                            <Select
                                placeholder="Selecciona una marca..."
                                selectedValue={storeProduct.mark}
                                onValueChange={(value) => {
                                    if (value === "") {
                                        setErrorMark("Campo vacío.")
                                    } else {
                                        setStoreProduct((prev) => ({ ...prev, mark: value }));
                                        setErrorMark("");
                                    }
                                }}
                            >
                                <Select.Item label="Audi" value="Audi" />
                                <Select.Item label="Chevrolet" value="Chevrolet" />
                                <Select.Item label="Mercedes Benz" value="Mercedes Benz" />
                                <Select.Item label="Toyota" value="Toyota" />
                                <Select.Item label="Volkswagen" value="Volkswagen" />
                            </Select>
                            {errorMark !== "" && <Text fontSize="sm" color="red.500">{errorMark}</Text>}
                        </FormControl>
                        <FormControl mt="3">
                            <FormControl.Label>Categoría</FormControl.Label>
                            <Select
                                placeholder="Selecciona una categoría..."
                                selectedValue={storeProduct.category}
                                onValueChange={(value) => {
                                    if (value === "") {
                                        setErrorCategory("Campo vacío.")
                                    } else {
                                        setStoreProduct((prev) => ({ ...prev, category: value }));
                                        setErrorCategory("");
                                    }
                                }}
                            >
                                <Select.Item label="Automóvil" value="1" />
                                <Select.Item label="Camioneta" value="2" />
                            </Select>
                            {errorCategory !== "" && <Text fontSize="sm" color="red.500">{errorCategory}</Text>}
                        </FormControl>
                        <FormControl mt="3">
                            <FormControl.Label>Año</FormControl.Label>
                            <Input keyboardType="numeric" value={storeProduct.year_created}
                                onChangeText={(value) => {
                                    if (value === "") {
                                        setErrorYear("Campo vacío.")
                                    } else {
                                        setStoreProduct((prev) => ({ ...prev, year_created: value }));
                                        setErrorYear("");
                                    }
                                }} />
                            {errorYear !== "" && <Text fontSize="sm" color="red.500">{errorYear}</Text>}
                        </FormControl>
                        <FormControl mt="3">
                            <FormControl.Label>Imagen</FormControl.Label>
                            <Input value={storeProduct.image}
                                onChangeText={(value) => {
                                    if (value === "") {
                                        setErrorImage("Campo vacío.")
                                    } else {
                                        setStoreProduct((prev) => ({ ...prev, image: value }));
                                        setErrorImage("");
                                    }
                                }} />
                            {errorImage !== "" && <Text fontSize="sm" color="red.500">{errorImage}</Text>}
                        </FormControl>
                        {storeProduct.image !== "" && <Image resizeMode="contain" source={{ uri: storeProduct.image }} style={{ width: '100%', aspectRatio: 1.6 }} alt={"Imagen no encontrada..."} />}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button.Group space={2}>
                            <Button variant="ghost" colorScheme="blueGray" onPress={() => {
                                setOpenModal(false);
                            }}>
                                Cerrar
                            </Button>
                            <Button onPress={() => {
                                storeProducts();
                            }} background={darkBlue}>
                                Guardar
                            </Button>
                        </Button.Group>
                    </Modal.Footer>
                </Modal.Content>
            </Modal>

            <VStack w="100%" h="70%">
                {products !== 0 ? (
                    <FlatList key={products.id} style={{ height: "100%" }} data={products} renderItem={({
                        item: products
                    }) => <Box borderBottomWidth="1" _dark={{
                        borderColor: { darkBlue }
                    }} borderColor={darkBlue} pl={["0", "4"]} pr={["0", "5"]} py="18">
                            <HStack marginLeft={10} space={[2, 3]} justifyContent="space-between">
                                <Image h={75} w={75} resizeMode="contain"
                                    source={{
                                        uri: products.image
                                    }} alt="Image" />
                                <VStack justifyContent={"center"}>
                                    <Text bold>
                                        {products.modelCar}
                                    </Text>
                                    <Text>
                                        $ {products.price} MXN
                                    </Text>
                                </VStack>
                                <Spacer />
                                <HStack alignItems={"center"} marginRight={10}>
                                    <TouchableOpacity onPress={() => {
                                        openModalWithProduct(products.id);
                                        modalOpen2(true);
                                    }}>
                                        <Icon
                                            name="edit"
                                            color={"#0E7490"}
                                            size={33}

                                        />
                                    </TouchableOpacity>

                                </HStack>
                            </HStack>
                        </Box>
                    } keyExtractor={products => products.id} />
                )
                    :
                    (
                        <Center>
                            <VStack space={2} alignItems="center">
                                <Icon name="sad-tear" size={100} color={darkBlue} />
                                <Text fontSize="3xl">Sin resultados</Text>
                            </VStack>
                        </Center>
                    )
                }

                <Modal isOpen={openModal2} onClose={() => setOpenModal2(false)} safeAreaTop={true}>
                    <Modal.Content maxWidth="350">
                        <Modal.CloseButton />
                        <Modal.Header>Editar un producto</Modal.Header>
                        <Modal.Body>
                            {editedProduct && (
                                <>
                                    <FormControl>
                                        <FormControl.Label>Modelo del carro</FormControl.Label>
                                        <Input
                                            value={editedProduct.modelCar}
                                            onChangeText={(value) => {

                                                setEditedProduct((prev) => ({ ...prev, modelCar: value }));
                                                setErrorModalCar("");

                                            }}
                                        />
                                        {errorModalCar !== "" && <Text fontSize="sm" color="red.500">{errorModalCar}</Text>}
                                    </FormControl>
                                    <FormControl>
                                        <FormControl.Label>Descripción</FormControl.Label>
                                        <Input
                                            value={editedProduct.description}
                                            onChangeText={(value) => {
                                                setEditedProduct((prev) => ({ ...prev, description: value }));
                                                setErrorDescription("");
                                            }}
                                        />
                                        {errorDescription !== "" && <Text fontSize="sm" color="red.500">{errorDescription}</Text>}
                                    </FormControl>
                                    <FormControl mt="3">
                                        <FormControl.Label>Stock</FormControl.Label>
                                        <Input keyboardType="numeric"
                                            value={editedProduct.stock.toString()}
                                            onChangeText={(value) => {
                                                if (isNaN(value)) {
                                                    setErrorStock("Campo vacío.");
                                                } else {
                                                    setEditedProduct((prev) => ({ ...prev, stock: value }));
                                                    setErrorStock("");
                                                }
                                            }} />
                                        {errorStock !== "" && <Text fontSize="sm" color="red.500">{errorStock}</Text>}
                                    </FormControl>
                                    <FormControl mt="3">
                                        <FormControl.Label>Price</FormControl.Label>
                                        <Input keyboardType="numeric"
                                            value={editedProduct.price.toString()}
                                            onChangeText={(value) => {
                                                if (isNaN(value)) {
                                                    setErrorStock("Campo vacío.");
                                                } else {
                                                setEditedProduct((prev) => ({ ...prev, price: value }));
                                                setErrorPrice("");
                                            }}} />
                                        {errorPrice !== "" && <Text fontSize="sm" color="red.500">{errorPrice}</Text>}
                                    </FormControl>
                                    <FormControl mt="3">
                                        <FormControl.Label>Marca</FormControl.Label>
                                        <Select
                                            selectedValue={editedProduct.mark}
                                            onValueChange={(value) => {
                                                setEditedProduct((prev) => ({ ...prev, mark: value }));
                                                setErrorMark("");
                                            }}
                                        >
                                            <Select.Item label="Audi" value="Audi" />
                                            <Select.Item label="Chevrolet" value="Chevrolet" />
                                            <Select.Item label="Mercedes Benz" value="Mercedes Benz" />
                                            <Select.Item label="Toyota" value="Toyota" />
                                            <Select.Item label="Volkswagen" value="Volkswagen" />
                                        </Select>
                                        {errorMark !== "" && <Text fontSize="sm" color="red.500">{errorMark}</Text>}
                                    </FormControl>
                                    <FormControl mt="3">
                                        <FormControl.Label>Categoría</FormControl.Label>
                                        <Select
                                            selectedValue={editedProduct.category.toString()}
                                            onValueChange={(value) => {
                                                setEditedProduct((prev) => ({ ...prev, category: parseFloat(value), }));
                                                setErrorCategory("");
                                            }}
                                        >
                                            <Select.Item label="Automóvil" value="1" />
                                            <Select.Item label="Camioneta" value="2" />
                                        </Select>
                                        {errorCategory !== "" && <Text fontSize="sm" color="red.500">{errorCategory}</Text>}
                                    </FormControl>
                                    <FormControl mt="3">
                                        <FormControl.Label>Año</FormControl.Label>
                                        <Input keyboardType="numeric" value={editedProduct.year_created.toString()}
                                            onChangeText={(value) => {
                                                if (isNaN(value)) {
                                                    setErrorStock("Campo vacío.");
                                                } else {
                                                setEditedProduct((prev) => ({ ...prev, year_created: value }));
                                                setErrorYear("");
                                            }}} />
                                        {errorYear !== "" && <Text fontSize="sm" color="red.500">{errorYear}</Text>}
                                    </FormControl>
                                    <FormControl mt="3">
                                        <FormControl.Label>Imagen</FormControl.Label>
                                        <Input value={editedProduct.image}
                                            onChangeText={(value) => {
                                                setEditedProduct((prev) => ({ ...prev, image: value }));
                                                setErrorImage("");
                                            }} />
                                    </FormControl>
                                    {errorImage !== "" && <Text fontSize="sm" color="red.500">{errorImage}</Text>}
                                    {editedProduct.image !== "" && <Image resizeMode="contain" source={{ uri: editedProduct.image }} style={{ width: '100%', aspectRatio: 1.6 }} alt={"Imagen no encontrada..."} />}

                                </>
                            )}
                        </Modal.Body>
                        <Modal.Footer>
                            <Button.Group space={2}>
                                <Button
                                    variant="ghost"
                                    colorScheme="blueGray"
                                    onPress={() => {
                                        setOpenModal2(false);
                                    }}
                                >
                                    Cerrar
                                </Button>
                                <Button onPress={saveChanges}>Guardar</Button>
                            </Button.Group>
                        </Modal.Footer>
                    </Modal.Content>
                </Modal>
            </VStack>
        </VStack >

    );
}