import axios from 'axios';
import { useContext, useEffect, useState } from 'react';

import { StyleSheet, Text, View } from 'react-native';
import { AuthContext } from '../store/auth-context';
import Button from '../components/ui/Button';
import { disableSomeHour , disableAll} from '../util/welcome';
function WelcomeScreen({ navigation }) {
  const [fetchedMessage, setFetchedMesssage] = useState({});

  const authCtx = useContext(AuthContext);
  const token = authCtx.token;

  useEffect(() => {
    axios.get('http://myec2dinamic.zapto.org:8080/api/records/settings', {
      headers: {
        Authorization: `${token}`  // Include the token in the Authorization header
      }
    })
    .then((response) => {
      setFetchedMesssage(response.data);
      console.log(response.data)
    });
  }, [token]);

  function btnDisableOneHour() {
    disableSomeHour('http://myec2dinamic.zapto.org:8080/api/records/disable/time1', token)
        .then(volta => {
            console.log("volta");
            console.log(volta);
        })
        .catch(error => {
            console.error("Error:", error);
    });
 }
  function btnDelayOneHour() {
    disableSomeHour('http://myec2dinamic.zapto.org:8080/api/records/disable/');
  }

  function btnDisableAll() {
    disableAll('http://myec2dinamic.zapto.org:8080/api/records/disable-all', token)
        .then(volta => {
            console.log("volta");
            console.log(volta);
        })
        .catch(error => {
            console.error("Error:", error);
    });
  }

  function btnMoreOptions() {
    navigation.navigate('MoreOptions'); 
  }

  return (
    <View style={styles.rootContainer}>
      <Text style={styles.title}>O sistema está conectado</Text>
      <View style={styles.buttonsContainer}>
        <View style={styles.button}>
          <Button onPress={btnDisableOneHour} style={styles.button}>
            Cancelar 1° hora
          </Button>
        </View>
        <View style={styles.button}>
          <Button onPress={btnDelayOneHour} style={styles.button}>
            Atrasar 1 hora
          </Button>
        </View>
        <View style={styles.button}>
          <Button onPress={btnDisableAll} style={styles.button}>
            Desabilitar todos
          </Button>
        </View>
        <Button onPress={btnMoreOptions} style={styles.button}>
          Mais opções
        </Button>
      </View>
    </View>
  );
}

export default WelcomeScreen;

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
