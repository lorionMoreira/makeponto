import axios from 'axios';
import { useContext, useEffect, useState } from 'react';

import { StyleSheet, Text, View } from 'react-native';
import { AuthContext } from '../store/auth-context';
import Button from '../components/ui/Button';
import { disableSomeHour , disableAll} from '../util/welcome';
function MoreOptionsScreen({ navigation }) {
  const [fetchedMessage, setFetchedMesssage] = useState({});

  const authCtx = useContext(AuthContext);
  const token = authCtx.token;

  useEffect(() => {
    axios.get('https://myec2lorion.zapto.org/api/records/settings', {
      headers: {
        Authorization: `${token}`  // Include the token in the Authorization header
      }
    })
    .then((response) => {
      setFetchedMesssage(response.data);
      console.log(response.data)
    });
  }, [token]);


  function btnChangeOneHour() {
    navigation.navigate('ChangeOneHour'); 
  }
  function btnDisableSomeHour() {
    navigation.navigate('DisableSomeHour'); 
  }
  return (
    <View style={styles.rootContainer}>
      <Text style={styles.title}>O sistema está conectado</Text>
      <View style={styles.buttonsContainer}>
        <View style={styles.button}>
          <Button onPress={btnDisableSomeHour}>
            Desabilitar um horário
          </Button>
        </View>
        <View style={styles.button}>
          <Button onPress={btnChangeOneHour}>
            Mudar 1° horário
          </Button>
        </View>
      </View>
    </View>
  );
}

export default MoreOptionsScreen;

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  title: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 1,
  },
  buttonsContainer: {
    flex: 2, // This allocates 2 parts of the space to the buttons
    width: '100%', // Ensures the buttons container uses the full width available
    
  },
  button: {
    marginBottom: 20, // Adds a margin to the bottom of each button
  }
});