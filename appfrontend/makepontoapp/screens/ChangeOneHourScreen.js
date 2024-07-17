import axios from 'axios';
import { useContext, useEffect, useState } from 'react';

import { StyleSheet, Text, View,TextInput, Alert  } from 'react-native';
import { AuthContext } from '../store/auth-context';
import Button from '../components/ui/Button';
import { Checkbox } from 'react-native-paper';

function ChangeOneHourScreen({ navigation }) {
  
  const [settings, setSettings] = useState([]);

  const authCtx = useContext(AuthContext);
  const token = authCtx.token;

  useEffect(() => {
    axios.get('http://myec2dinamic.zapto.org:8080/api/records/settings', {
      headers: {
        Authorization: `${token}`  // Include the token in the Authorization header
      }
    })
    .then((response) => {
      setSettings(response.data);
      console.log(response.data)
    })
    .catch(error => {
      console.error('Error fetching settings:', error);
    });
  }, [token]);


  const [inputText, setInputText] = useState('');

  const handleSend = () => {
    // Handle the send action, e.g., sending data to a server
    Alert.alert('Send Action', `Sending data: ${inputText}`);
  };

  const handleInitialPreferences = () => {
    // Handle setting initial preferences, e.g., resetting state or fetching data
    Alert.alert('Initial Preferences', 'Setting initial preferences...');
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        onChangeText={setInputText}
        value={inputText}
        placeholder="Enter your text here"
      />
      <Button onPress={handleSend} style={styles.button}>
        Enviar
      </Button>

      <Button onPress={handleInitialPreferences} style={styles.button}>
        Padrão
      </Button>
    </View>
);


}

export default ChangeOneHourScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  input: {
    width: '100%',
    marginBottom: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 5,
  },
  button: {
    marginBottom: 20, // Adds a margin to the bottom of each button
  }
});