import axios from 'axios';
import { useContext, useEffect, useState } from 'react';

import { StyleSheet, Text, View, FlatList, Dimensions  } from 'react-native';
import { AuthContext } from '../store/auth-context';
import Button from '../components/ui/Button';
import { disableSomeHour , disableOrEnableAll} from '../util/welcome';
function WelcomeScreen({ navigation }) {
  const [fetchedMessage, setFetchedMesssage] = useState({});
  const [data, setData] = useState([]);
  const [btnDisable, setBtnDisable] = useState(true); 

  const authCtx = useContext(AuthContext);
  const token = authCtx.token;

  useEffect(() => {
    const fetchData = async () => {
      axios.get('https://myec2lorion.zapto.org/api/records/settings', {
        headers: {
          Authorization: `${token}`  // Include the token in the Authorization header
        }
      })
      .then((response) => {
        setData(pairData(response.data));
        console.log('response.data')
        console.log(response.data)
      });
    };
    fetchData();
    const intervalId = setInterval(fetchData, 5000); // Fetch data every 5 seconds

    return () => clearInterval(intervalId); // Cleanup interval on unmount
  }, [token]);

  const fetchData = async () => {
    axios.get('https://myec2lorion.zapto.org/api/records/settings', {
      headers: {
        Authorization: `${token}`  // Include the token in the Authorization header
      }
    })
    .then((response) => {
      setData(pairData(response.data));
      console.log('response.data')
      console.log(response.data)
    });
  };


  function btnDisableOneHour() {
    disableSomeHour('https://myec2lorion.zapto.org/api/records/disable/time1', token)
        .then(volta => {
            console.log("volta1");
            console.log(volta);
        })
        .catch(error => {
            console.error("Error:", error);
    });
 }
  function btnDelayOneHour() {
    disableSomeHour('https://myec2lorion.zapto.org/api/records/disable/');
  }

  function btnDisableOrEnableAll() {
    const endpoint = btnDisable
      ? 'https://myec2lorion.zapto.org/api/records/disable-all'
      : 'https://myec2lorion.zapto.org/api/records/enable-all';

    disableOrEnableAll(endpoint, token)
        .then(volta => {
            console.log("volta2");
            console.log(volta);
        })
        .catch(error => {
            console.error("Error:", error);
    });
    fetchData();
  }

  function btnMoreOptions() {
    navigation.navigate('MoreOptions'); 
  }
  /*
  const data = [
    { id: 1, status: 1, default_time: '08:35:00', override_time: null, type: 'time1' },
    { id: 2, status: 1, default_time: '12:00:00', override_time: null, type: 'time2' },
    { id: 3, status: 1, default_time: '13:00:00', override_time: null, type: 'time3' },
    { id: 4, status: 1, default_time: '17:00:00', override_time: null, type: 'time4' },
  ];
  */
  const pairData = (data) => {
    const pairedData = [];
    for (let i = 0; i < data.length; i += 2) {
      pairedData.push(data.slice(i, i + 2));
    }
    return pairedData;
  };

  const renderItem = ({ item }) => (
    <View style={styles.row}>
      {item.map((card) => (
        <View style={styles.card} key={card.id}>
          <Text style={styles.id}>ID: {card.id}</Text>
          <Text style={[styles.status, { color: card.status ? 'green' : 'red' }]}>Status: {card.status ? 'Active' : 'Inactive'}</Text>
          <Text style={styles.defaultTime}>Default Time: {card.defaultTime}</Text>
          {card.overrideTime && <Text style={styles.overrideTime}>Override Time: {card.overrideTime}</Text>}
          <Text style={styles.type}>Type: {card.type}</Text>
        </View>
      ))}
    </View>
  );

  return (
    <View style={styles.rootContainer}>
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={(item, index) => index.toString()}
    />
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
          <Button onPress={btnDisableOrEnableAll} style={styles.button}>
          {btnDisable ? "Desabilitar todos" : "Habilitar todos"}
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
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 10,
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    marginVertical: 10,
    marginLeft: 10,
    width: (Dimensions.get('window').width / 3) - 20, // Half the screen width minus padding
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 3,
  },
  id: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  status: {
    fontSize: 14,
    marginVertical: 5,
  },
  defaultTime: {
    fontSize: 14,
    marginVertical: 5,
  },
  overrideTime: {
    fontSize: 14,
    marginVertical: 5,
    color: 'gray',
  },
  type: {
    fontSize: 14,
    marginVertical: 5,
    fontStyle: 'italic',
  },
});
