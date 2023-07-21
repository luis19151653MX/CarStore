import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, FlatList, TextInput } from 'react-native';
import dbRealtime from '../../firebase/firebase';

const Chat = () => {
  const [username, setUsername] = useState('username');
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState([]);

  useEffect(() => {
    const databaseRef = dbRealtime.ref('messages');
    databaseRef.on('value', (snapshot) => {
      const data = snapshot.val();
      const messageArray = data ? Object.values(data) : [];
      setMessages(messageArray);
    });

    return () => {
      databaseRef.off();
    };
  }, []);

  const submit = (e) => {
    e.preventDefault();
    dbRealtime.ref('messages').push({
      username,
      message,
    });
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
      <Text style={{ fontFamily: 'YsabeauSC-Regular', fontSize: 30, color: '#fff' }}>Chat v1</Text>
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
});

export default Chat;
