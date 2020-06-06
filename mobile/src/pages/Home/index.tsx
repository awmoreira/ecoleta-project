import React, { useEffect, useState } from 'react';
import { View, Image, ImageBackground, Text, StyleSheet } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { Feather as Icon } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import RNPickerSelect from 'react-native-picker-select';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
  },

  main: {
    flex: 1,
    justifyContent: 'center',
  },

  title: {
    color: '#322153',
    fontSize: 32,
    fontFamily: 'Ubuntu_700Bold',
    maxWidth: 260,
    marginTop: 64,
  },

  description: {
    color: '#6C6C80',
    fontSize: 16,
    marginTop: 16,
    fontFamily: 'Roboto_400Regular',
    maxWidth: 260,
    lineHeight: 24,
  },

  footer: {},

  select: {
    marginBottom: 10,
  },

  input: {
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  },

  button: {
    backgroundColor: '#34CB79',
    height: 60,
    flexDirection: 'row',
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
    marginTop: 8,
  },

  buttonIcon: {
    height: 60,
    width: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  buttonText: {
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center',
    color: '#FFF',
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
  },
});

interface IBGEUFResponse {
  sigla: string;
}

interface IBGECityResponse {
  nome: string;
}

const Home: React.FC = () => {
  const navigation = useNavigation();
  const [uf, setUf] = useState('0');
  const [ufs, setUfs] = useState<string[]>([]);
  const [city, setCity] = useState('0');
  const [citys, setCitys] = useState<string[]>([]);

  useEffect(() => {
    axios
      .get<IBGEUFResponse[]>(
        'https://servicodados.ibge.gov.br/api/v1/localidades/estados'
      )
      .then((resp) => {
        const ufInitials = resp.data.map((uf) => uf.sigla);

        setUfs(ufInitials);
      });
  }, []);

  useEffect(() => {
    axios
      .get<IBGECityResponse[]>(
        `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`
      )
      .then((resp) => {
        const cityNames = resp.data.map((city) => city.nome);

        setCitys(cityNames);
      });
  }, [uf]);

  function handlePoints() {
    navigation.navigate('Points', { uf, city });
  }

  return (
    <ImageBackground
      source={require('../../assets/home-background.png')}
      imageStyle={{ width: 274, height: 368 }}
      style={styles.container}
    >
      <View style={styles.main}>
        <Image source={require('../../assets/logo.png')} />
        <Text style={styles.title}>Seu marketplace de coleta de resíduos</Text>
        <Text style={styles.description}>
          Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.
        </Text>
      </View>

      <View style={styles.footer}>
        <View style={styles.select}>
          <RNPickerSelect
            placeholder={{ label: 'Selecione o estado', value: 0 }}
            onValueChange={(value) => setUf(value)}
            items={ufs.map((uf) => ({ label: uf, value: uf }))}
            style={pickerSelectStyles}
            value={uf}
          />

          <RNPickerSelect
            placeholder={{ label: 'Selecione a cidade', value: 0 }}
            onValueChange={(value) => setCity(value)}
            items={citys.map((city) => ({ label: city, value: city }))}
            style={pickerSelectStyles}
            value={city}
          />
        </View>

        <RectButton style={styles.button} onPress={handlePoints}>
          <View style={styles.buttonIcon}>
            <Icon name="arrow-right" color="#FFF" size={24} />
          </View>
          <Text style={styles.buttonText}>Entrar</Text>
        </RectButton>
      </View>
    </ImageBackground>
  );
};

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    borderRadius: 10,
    marginBottom: 8,
    height: 60,
    backgroundColor: '#FFF',
    paddingHorizontal: 24,
  },
  inputAndroid: {
    fontSize: 16,
    borderRadius: 10,
    marginBottom: 8,
    height: 60,
    backgroundColor: '#FFF',
    paddingHorizontal: 24,
  },
});

export default Home;
