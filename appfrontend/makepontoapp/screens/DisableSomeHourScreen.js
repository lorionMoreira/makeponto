import axios from 'axios';
import { useContext, useEffect, useState } from 'react';

import { StyleSheet, Text, View } from 'react-native';
import { AuthContext } from '../store/auth-context';
import Button from '../components/ui/Button';
import { Checkbox } from 'react-native-paper';

function DisableSomeHourScreen({ navigation }) {
  
  const [settings, setSettings] = useState([]);

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


  const handleCheckboxChange = (index, newValue) => {
    
    const updatedSettings = settings.map((item, i) => {
        if (i === index) {
            return { ...item, status: newValue };
        }
        return item;
    });

    
    if(newValue){
      axios.post(`https://myec2lorion.zapto.org/api/records/enable/${settings[index].type}`, {
        status: newValue
      },{
        headers: {
          Authorization: `${token}`  // Include the token in the Authorization header
        }
      }
    )
      .then(response => {
          console.log('Status updated successfully:', response.data);
          setSettings(updatedSettings);
      })
      .catch(error => {
          console.error('Error updating status:', error);
      });
    }

    if(!newValue){
      axios.post(`https://myec2lorion.zapto.org/api/records/disable/${settings[index].type}`, {
        status: newValue
      },{
        headers: {
          Authorization: `${token}`  // Include the token in the Authorization header
        }
      })
      .then(response => {
          console.log('Status updated successfully:', response.data);
          setSettings(updatedSettings);
      })
      .catch(error => {
          console.error('Error updating status:', error);
      }); 
    }

  };

  return (
    <View style={styles.container}>
        {settings.map((item, index) => (
            <View key={item.id} style={styles.row}>
                <Text style={styles.label}>{item.type}</Text>
                <Checkbox
                    status={item.status ? 'checked' : 'unchecked'}
                    onPress={() => handleCheckboxChange(index, !item.status)}
                />
            </View>
        ))}
    </View>
);


}

export default DisableSomeHourScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        width: '80%',
    },
    label: {
        fontSize: 16,
    }
});