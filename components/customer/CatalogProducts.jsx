import React, { useContext, useState, useEffect } from "react";
import { Actionsheet, ScrollView, Text, VStack, Box, Divider, Input, Radio, Image, useColorModeValue, HStack, Button, useDisclose, Center } from "native-base";
import { MyContext } from "../../context/AppContext";
import Title from "../sharecomponents/Title";
import Icon from 'react-native-vector-icons/MaterialIcons';
import IconF from 'react-native-vector-icons/FontAwesome5';
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity } from "react-native";

export default function CatalogProducts() {

    const navigation = useNavigation();

    const bg = useColorModeValue("ligthmode.bg", "darkmode.bg");
    const darkBlue = "#0E7490";

    const { apiAxios } = useContext(MyContext);
    const [products, setProducts] = useState([]);
    const {
        isOpen,
        onOpen,
        onClose
    } = useDisclose();

    useEffect(() => {
        getProducts();
    }, [])

    //filter by name and by category
    const [searchText, setSearchText] = useState('');
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [carType, setCarType] = useState(null);
    const [filteredProductsByCarType, setFilteredProductsByCarType] = useState([]);
    //filter by price
    const [selectedPriceFilter, setSelectedPriceFilter] = useState(null);


    const filterProducts = (products, searchText, selectedCategory, selectedPriceFilter) => {
        let filteredProducts = products.filter((product) => {
            const modelCar = product.modelCar || "";
            const category = product.category || "";
            return (
                modelCar.toLowerCase().includes(searchText.toLowerCase()) &&
                (selectedCategory === "all" || parseInt(category) === parseInt(selectedCategory))
            );
        });
        if (selectedPriceFilter === "asc") {
            filteredProducts = filteredProducts.sort((a, b) => a.price - b.price);
        } else if (selectedPriceFilter === "desc") {
            filteredProducts = filteredProducts.sort((a, b) => b.price - a.price);
        }

        return filteredProducts;
    };

    const handleSelectedCategory = (nextValue) => {
        onClose();
        setSelectedCategory(nextValue);
        setCarType(nextValue === "1" ? "automóvil" : (nextValue === "0" ? "camioneta" : null));

    };

    useEffect(() => {
        setFilteredProductsByCarType(
            filterProducts(products, searchText, selectedCategory, selectedPriceFilter)
        );
    }, [products, searchText, selectedCategory, selectedPriceFilter]);


    const getProducts = async () => {
        await apiAxios.get('/index_products').then(response => {
            setProducts(response.data);
        })
            .catch(error => {
                console.error(error);
            });
    }

    //navegation
    const navigateProductView = (IdProduct) => {
        navigation.navigate("Product", { IdProduct });
    }

    return (
        <VStack width="100%" height="100%" bg={bg}>
            <Title screenTitle="Catálogo" />
            <Box h="50px"></Box>
            <HStack w="100%" h="45px" alignItems="center">
                <Box w="70%">
                    <Input
                        variant="rounded"
                        fontSize="md"
                        placeholder="Ingresa el modelo"
                        value={searchText}
                        onChangeText={(text) => { setSearchText(text); console.log(text) }}
                        focusBorderColor={darkBlue}
                        InputLeftElement={
                            <Icon
                                name="search"
                                color={darkBlue}
                                size={24}
                                style={{ marginLeft: 8, marginRight: 8 }}
                            />
                        }
                    />
                </Box>
                <Box w="2%"></Box>
                <Box >
                    <TouchableOpacity >
                        <Button onPress={onOpen} fontSize="md" leftIcon={
                            <Icon name="filter-alt" size={25} color="white" />
                        }>
                            Filtros
                        </Button>
                    </TouchableOpacity>
                </Box>
            </HStack>
            <Actionsheet isOpen={isOpen} onClose={onClose}
                header="Filtros"
            >
                <Actionsheet.Content>
                    <HStack w="100%" p="2">
                        <VStack w="50%">
                            <HStack space={2} alignItems="center">
                                <IconF name="car" size={25} color={darkBlue} />
                                <Text>Categoría</Text>
                            </HStack>
                            <Box>
                                <Radio.Group
                                    defaultValue="all"
                                    name="category"
                                    value={selectedCategory}
                                    onChange={handleSelectedCategory}
                                >
                                    <Radio
                                        value="all"
                                        borderColor="#164E63"
                                        size="md"
                                        margin={2}>Todas</Radio>
                                    <Radio
                                        value="1"
                                        borderColor="#164E63"
                                        size="md"
                                        margin={2}>Automóvil</Radio>
                                    <Radio
                                        value="2"
                                        borderColor="#164E63"
                                        size="md"
                                        margin={2}>Camioneta</Radio>
                                </Radio.Group>
                            </Box>
                        </VStack>
                        <VStack w="50%">
                            <HStack space={2} alignItems="center">
                                <IconF name="dollar-sign" size={25} color={darkBlue} />
                                <Text>Precio</Text>
                            </HStack>
                            <Box>
                                <Radio.Group
                                    defaultValue={null}
                                    name="priceFilter"
                                    value={selectedPriceFilter}
                                    onChange={(nextValue) => { setSelectedPriceFilter(nextValue), onClose() }}
                                >
                                    <Radio
                                        margin={2}
                                        borderColor="#164E63"
                                        size="md"
                                        value="asc"
                                        isChecked={selectedPriceFilter === "asc"}
                                        onChange={(e) => setSelectedPriceFilter(e.currentTarget.value)}
                                    >
                                        Menor precio
                                    </Radio>
                                    <Radio
                                        margin={2}
                                        borderColor="#164E63"
                                        size="md"
                                        value="desc"
                                        isChecked={selectedPriceFilter === "desc"}
                                        onChange={(e) => setSelectedPriceFilter(e.currentTarget.value)}
                                    >
                                        Mayor precio
                                    </Radio>
                                </Radio.Group>
                            </Box>
                        </VStack>
                    </HStack>
                </Actionsheet.Content>
            </Actionsheet>
            <Divider my={2}></Divider>
            <VStack>
            </VStack>

            <ScrollView w="100%">

                <VStack w="100%">
                    {filteredProductsByCarType.length !== 0 ? (
                        filteredProductsByCarType.map((product) => (
                            <TouchableOpacity key={product.id} onPress={() => { navigateProductView(product.id) }}>
                                <Box
                                    height="280px"
                                    key={`cp-${product.id}`}
                                    overflow="hidden"
                                    alignItems="center"
                                    borderColor={darkBlue}
                                    borderWidth="1"
                                    rounded="xl"
                                    marginBottom={6}
                                    marginLeft={10}
                                    marginRight={10}

                                >
                                    {
                                        <Image
                                            style={{ width: '100%', aspectRatio: 1.6 }}
                                            resizeMode="contain"
                                            source={{ uri: `${product.image}` }}
                                            alt="image"
                                        />
                                    }
                                    <Text fontSize="xl" fontWeight={"bold"}>{product.modelCar}</Text>
                                    <Text fontSize="md" fontWeight={"bold"}>$ {product.price} MXN</Text>
                                </Box>
                            </TouchableOpacity>
                        ))
                    )
                        :
                        (
                            <Center>
                                <VStack space={2} alignItems="center">
                                    <IconF name="sad-tear" size={100} color={darkBlue} />
                                    <Text fontSize="3xl">Sin resultados</Text>
                                </VStack>
                            </Center>
                        )
                    }

                </VStack>


            </ScrollView>

        </VStack>
    );
}