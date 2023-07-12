import React from "react";
import { Text, Box, Image, HStack } from "native-base";

export default function Title(props) {
  const darkBlue = "ligthmode.darkBlue";
  const title = "ligthmode.bg";
  return (
    <Box
      w="90%"
      h="65px"
      background={darkBlue}
      rounded="full"
      left="-30px"
    >
      <HStack w="100%" h="100%" alignItems="center">
        <Box w="81%">
          <Text fontWeight={"bold"} textAlign={"left"} fontSize={22} color={title} marginLeft={12}>{props.screenTitle}</Text>
        </Box>
        <Box w="19%" h="100%">
          <Image
            source={{ uri: "https://www.pngall.com/wp-content/uploads/8/Car-Tire.png" }}
            alt="Image"
            resizeMode="contain"
            style={{ width: "100%", height: "100%" }}
          />
        </Box>
      </HStack>
    </Box>
  );
}