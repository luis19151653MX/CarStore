import React, { useEffect,useState } from 'react';
import { StyleSheet, View,Text,FlatList, TextInput} from 'react-native';
import { Pusher, PusherEvent } from '@pusher/pusher-websocket-react-native';

const pusher = Pusher.getInstance();
const Chat = () => {
    const [username, setUsername] = useState('username');
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    let allMessages = [];

    useEffect(() => {
        const initPusher = async () => {
          await pusher.init({
            apiKey: "deaf374f1a1f96ddfe30",
            cluster: "us2",
          });
    
          await pusher.connect();
          await pusher.subscribe({
            channelName: "chat", // Cambiar a tu nombre de canal
            onEvent: (event) => {
              console.log(`Event received: ${event}`);
              // Manejar el mensaje recibido aquí y actualizar el estado de los mensajes
              setMessages((prevMessages) => [...prevMessages, event]);
            },
          });
        };
    
        initPusher();
      }, []);
    
      const submit = (e) => {
        e.preventDefault();
        // Tu lógica para enviar el mensaje va aquí
        // Por ejemplo, podrías agregar el mensaje al array de mensajes
        setMessages([...messages, { username, message }]);
        // Limpiar el campo de mensaje después de enviar
        setMessage('');
      };
    
      const renderItem = ({ item }) => (
        <View style={{ paddingVertical: 10 }}>
          <Text style={{ fontWeight: 'bold' }}>{item.username}</Text>
          <Text style={{ marginBottom: 5, fontSize: 12 }}>{item.message}</Text>
        </View>
      );

  return (
    <View style={styles.container}>
      <Text  style={{ fontFamily:'YsabeauSC-Regular',fontSize: 30,color:"#fff" }}>Chat v1</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10, borderBottomWidth: 1 }}>
        <TextInput
          style={{ flex: 1, fontSize: 18, fontWeight: 'bold' }}
          value={username}
          onChangeText={setUsername}
          placeholder="Enter your username"
        />
      </View>
      <FlatList
        style={{ flex: 1, backgroundColor: 'white' }}
        data={messages}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
      <View style={{ padding: 10, borderTopWidth: 1 }}>
        <TextInput
          style={{ borderWidth: 1, borderRadius: 5, padding: 10 }}
          placeholder="Write a message"
          value={message}
          onChangeText={setMessage}
          onSubmitEditing={submit}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#144c65',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 300,
    height: 300,
  }
});

export default Chat;