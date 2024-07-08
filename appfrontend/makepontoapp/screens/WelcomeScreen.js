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
      <Button onPress={btnDisableOneHour}>
        Cancelar 1
      </Button>
      <Button onPress={btnDelayOneHour}>
        Atrasar 1 hora
      </Button>
      <Button onPress={btnDisableAll}>
        Desabilitar todos
      </Button>
      <Button onPress={btnMoreOptions}>
        Mais opções
      </Button>

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
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
});
