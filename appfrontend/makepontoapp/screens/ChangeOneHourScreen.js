import axios from 'axios';
import { useContext, useEffect, useState } from 'react';

import { StyleSheet, Text, View,TextInput, Alert  } from 'react-native';
import { AuthContext } from '../store/auth-context';
import Button from '../components/ui/Button';


function ChangeOneHourScreen({ navigation }) {
  
  const [settings, setSettings] = useState([]);
  const [inputText, setInputText] = useState('');

  const authCtx = useContext(AuthContext);
  const token = authCtx.token;

  useEffect(() => {
    axios.get('https://myec2lorion.zapto.org/api/records/settings', {
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


  const handleSend = () => {
    if (validateTime(inputText)) {
      let myurl = `https://myec2lorion.zapto.org/api/records/change/${settings[0].type}?overrideTime=${inputText}`
      console.log(myurl)
      axios.post(myurl, {},{
        headers: {
          Authorization: `${token}`  // Include the token in the Authorization header
        }
      })
      .then(response => {
          console.log('Status updated successfully:', response.data);
          setSettings(response.data);
      })
      .catch(error => {
          console.error('Error updating status:', error);
      }); 
    } else {
      Alert.alert('Invalid Time', 'Please enter a valid time in the format HH:MM:SS where hours are 00-23, minutes and seconds are 00-59.');
    }
  };

  const validateTime = (time) => {
    const pattern = /^([01]?[0-9]|2[0-3]):([0-5]?[0-9]):([0-5]?[0-9])$/;
    if (!pattern.test(time)) {
        return false;
    }
    const parts = time.split(':');
    const hours = parseInt(parts[0], 10);
    const minutes = parseInt(parts[1], 10);
    const seconds = parseInt(parts[2], 10);
    if (hours > 23 || minutes > 59 || seconds > 59) {
        return false;
    }
    return true;
};

  const handleInitialPreferences = () => {
    // dont implement yet
    
  };

  const handleInputChange = (text) => {
    // Regular expression to match and format input to time format (HH:MM:SS)
    let newText = text.replace(/[^0-9]/g, '');
    if (newText.length > 2) {
      newText = newText.substring(0, 2) + ':' + newText.substring(2);
    }
    if (newText.length > 5) {
      newText = newText.substring(0, 5) + ':' + newText.substring(5, 7);
    }
    setInputText(newText.substring(0, 8)); // Ensure string is no longer than the length for HH:MM:SS
  };



  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        onChangeText={handleInputChange}
        value={inputText}
        placeholder="HH:MM:SS"
        keyboardType="numeric"
      />
      <View style={styles.fullWidthButtonContainer}>
        <Button onPress={handleSend} style={styles.button}>
          Enviar
        </Button>
      </View>

      <View style={styles.fullWidthButtonContainer}>
        <Button onPress={handleInitialPreferences} style={styles.button}>
          Padrão
        </Button>
      </View>
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
  },
  fullWidthButtonContainer: {
    width: '100%', // Ensure the container for each button is full width
    marginBottom: 20,
  }
});