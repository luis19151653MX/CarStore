import React, { useEffect, useState, useContext } from "react";
import { useNavigation } from '@react-navigation/native';
import { Center, Text, useColorModeValue, Box, Image, ScrollView, VStack, Button, Pressable, HStack } from "native-base";
import { MyContext } from "../../context/AppContext";
import Title from "../sharecomponents/Title";
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useIsFocused } from '@react-navigation/native';

export default function Favorites() {
  const bg = useColorModeValue("ligthmode.bg", "darkmode.bg");
  const title = "ligthmode.bg";
  const accent = "ligthmode.accent";
  const darkBlue = "ligthmode.darkBlue";
  const navigation = useNavigation();
  const [favorites, setFavorites] = useState([]);
  const { apiAxios,userId,playSoundDelete  } = useContext(MyContext);
  const isFocused = useIsFocused();
  const [sound, setSound] = useState();
  const [isP, setIsP] = useState(false);

  useEffect(() => {
    getFavorites();
  }, []);

  useEffect(() => {
    getFavorites();
  }, [isFocused]);

  useEffect(() => {
    return sound
      ? () => {
        console.log('Unloading Sound');
        sound.unloadAsync();
      }
      : undefined;
  }, [sound]);

  const getFavorites = async () => {
    const config = {
      headers: { 'Content-Type': 'multipart/form-data' }
    };
    const data = new FormData();
    data.append("idUserE", userId);

    await apiAxios.post("/usere_getFavorites", data, config).then(
      response => {
        setFavorites(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }

  const navigateCatalog = () => {
    navigation.navigate("Catalog");
  }
  const navigateProductView = (IdProduct) => {
    navigation.navigate("Product", { IdProduct });
  }

  //(listfavorite.id)
  const deleteFavorite = async (id) => {
    const config = {
      headers: { 'Content-Type': 'multipart/form-data' }
    };
    const data = new FormData();
    data.append("id", id);

    await apiAxios.post("/favorites_removeFavorite", data, config).then(
      response => {
        if (response.status === 200) {
          playSoundDelete();
          getFavorites();
        }
      })
      .catch(error => {
        console.error(error);
      });
  }

  return (
    <VStack width="100%" height="100%" bg={bg}>
      <Title screenTitle="Favoritos" />
      <Box h="50px"></Box>
      {
        favorites.length != 0 ? (

          <ScrollView w="100%" h="100%">
            <Center justifyContent="center" mr={10} ml={10} >
              <VStack w="100%">
                {
                  favorites.map((favorite) => (
                    <Pressable onPress={() => { navigateProductView(favorite.IdProduct) }} key={`fav-${favorite.id}`} >
                      {({ isHovered, isFocused, isPressed }) => {
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
                                  source={{ uri: favorite.image }}
                                  alt="Image"
                                  resizeMode="contain"
                                  style={{ width: "100%", height: "100%" }}
                                />
                              </VStack>

                              <VStack w="40%" h="100%" alignItems="center" justifyContent="center">
                                <Box >
                                  <Text fontSize="lg" fontWeight={"semibold"} color={isPressed ? title : null}>{favorite.modelCar}</Text>
                                </Box>
                                <Box>
                                  <Text color={isPressed ? title : null}>$ {favorite.price} MXN</Text>
                                </Box>
                                <Box>
                                  {""}
                                </Box>
                                <Box >
                                  <Center >
                                    <Icon name="heart-broken" size={40} color={isPressed ? "#fff" : "#0E7490"} onPress={() => deleteFavorite(favorite.id)} />
                                  </Center>
                                </Box>
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
        ) : (
          <Center height="100%" justifyContent="center">
            <Button bgColor="ligthmode.accent" rounded={2} onPress={navigateCatalog} h={10} _text={{ fontSize: "lg" }} onPressIn={() => setIsP(true)}
                onPressOut={() => setIsP(false)}
                style={{
                  opacity: isP ? 0.8 : 1,
                }} >
              Visitar el catálogo
            </Button>
          </Center>
        )
      }
    </VStack>
  );
}