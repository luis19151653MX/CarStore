
import { Box } from "native-base";
import { Text, View, StyleSheet } from 'react-native';

export default function Main() {
    return (
        <View style={styles.container}>
            <Box _text={{ fontFamily: 'YsabeauSC-Regular', fontSize: "2xl", color: "emerald.500" }}>Main</Box>
            <Text style={{ fontSize: 30 }}>Platform Default</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
  