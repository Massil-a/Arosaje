var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TextInput, Pressable, KeyboardAvoidingView, Platform, FlatList, Keyboard } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as Location from 'expo-location';
import axios from 'axios';
import BigButtonDown from '../../components/BigButtonDown';
import Loading from '../../components/Loading';
export default function PubLoca() {
    const navigation = useNavigation();
    const route = useRoute();
    const [localisation, setLocalisation] = useState('');
    const [locCompleted, setLocCompleted] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [region, setRegion] = useState({
        latitude: 48.8566,
        longitude: 2.3522,
    });
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [cityName, setCityName] = useState('');
    const [citySuggestions, setCitySuggestions] = useState([]);
    useEffect(() => {
        loadLocalisation();
    }, []);
    const loadLocalisation = () => __awaiter(this, void 0, void 0, function* () {
        try {
            const savedLocalisation = yield AsyncStorage.getItem('savedLocalisation');
            const savedCityName = yield AsyncStorage.getItem('savedCityName');
            if (savedLocalisation && savedCityName) {
                setLocalisation(savedLocalisation);
                setCityName(savedCityName);
                setLocCompleted(true);
                setIsEditing(false);
            }
        }
        catch (error) {
            console.error('Erreur lors du chargement de la localisation:', error);
        }
    });
    const saveLocalisation = () => __awaiter(this, void 0, void 0, function* () {
        try {
            yield AsyncStorage.setItem('savedLocalisation', localisation);
            yield AsyncStorage.setItem('savedCityName', cityName);
        }
        catch (error) {
            console.error('Erreur lors de la sauvegarde de la localisation:', error);
        }
    });
    const handleValidation = () => {
        if (localisation.trim() !== '' && cityName.trim() !== '') {
            setLocCompleted(true);
            setIsEditing(false);
            saveLocalisation();
            navigation.navigate('Publier', { locValid: true, localisation: localisation, cityName: cityName });
        }
        else {
            navigation.navigate('Publier', { locValid: false, localisation: '', cityName: '' });
        }
    };
    const clearLocalisation = () => __awaiter(this, void 0, void 0, function* () {
        try {
            if (!isEditing) {
                yield AsyncStorage.removeItem('savedLocalisation');
                yield AsyncStorage.removeItem('savedCityName');
                setLocalisation('');
                setCityName('');
                setLocCompleted(false);
            }
        }
        catch (error) {
            console.error('Erreur lors de la suppression de la localisation sauvegardée:', error);
        }
    });
    const editLocalisation = () => {
        setIsEditing(true);
        if (isEditing) {
            setIsEditing(false);
        }
    };
    const handleAutoLocation = () => __awaiter(this, void 0, void 0, function* () {
        setLoading(true);
        let { status } = yield Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            console.error('Permission to access location was denied');
            setLoading(false);
            return;
        }
        let location = yield Location.getCurrentPositionAsync({});
        const { latitude, longitude } = location.coords;
        setRegion({
            latitude,
            longitude,
        });
        let address = yield Location.reverseGeocodeAsync({ latitude, longitude });
        if (address.length > 0) {
            const { street, city, region, postalCode } = address[0];
            const fullAddress = `${street}, ${city}, ${postalCode}, ${region}`;
            const parts = fullAddress.split(', ');
            let addressPart = parts[0];
            let cityPart = `${parts[1]}, ${parts[2]}`;
            if (/\d/.test(parts[0][0])) {
                addressPart = `${parts[0]} ${parts[1]}`;
                cityPart = `${parts[2]}, ${parts[3]}`;
            }
            setLocalisation(addressPart);
            setCityName(cityPart);
            setLocCompleted(true);
            setIsEditing(false);
            saveLocalisation();
        }
        setLoading(false);
    });
    const fetchSuggestions = (input) => __awaiter(this, void 0, void 0, function* () {
        const response = yield axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${input}&addressdetails=1&countrycodes=fr`);
        setSuggestions(response.data);
    });
    const fetchCitySuggestions = (input) => __awaiter(this, void 0, void 0, function* () {
        const response = yield axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${input}&addressdetails=1&countrycodes=fr`);
        setCitySuggestions(response.data);
    });
    const handleSelectSuggestion = (suggestion) => {
        const { lat, lon, display_name } = suggestion;
        setRegion({
            latitude: parseFloat(lat),
            longitude: parseFloat(lon),
        });
        const parts = display_name.split(', ');
        let addressPart = parts[0];
        let cityPart = `${parts[2]}, ${parts[6]}`;
        // Si le premier caractère de la première partie est un chiffre, c'est probablement un numéro de rue
        if (/\d/.test(parts[0][0])) {
            addressPart = `${parts[0]} ${parts[1]}`;
            cityPart = `${parts[3]}, ${parts[8]}`;
        }
        setLocalisation(addressPart);
        setCityName(cityPart);
        setSuggestions([]);
        setCitySuggestions([]);
    };
    return (<KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      {loading && <Loading />}
      {!loading && (<>
          {locCompleted ? (<>
              <Text style={styles.text}>Ville : {cityName}</Text>
              <Text style={styles.text}>Addresse : {localisation}</Text>
            </>) : null}
          <Pressable onPress={handleAutoLocation} style={styles.autoButton}>
            <Text style={styles.buttonText}>Localisation automatique</Text>
          </Pressable>
          <Pressable onPress={editLocalisation} style={styles.manualButton}>
            <Text style={styles.buttonText}>Localisation manuelle</Text>
          </Pressable>
          {isEditing && (<>
              <TextInput style={styles.input} placeholder="Entrez l'adresse" value={localisation} onChangeText={text => {
                    setLocalisation(text);
                    fetchSuggestions(text);
                }} textAlignVertical="top" returnKeyType="done" onSubmitEditing={Keyboard.dismiss}/>
              <FlatList data={suggestions} keyExtractor={(item) => item.place_id} renderItem={({ item }) => (<Pressable onPress={() => handleSelectSuggestion(item)}>
                    <Text style={styles.suggestion}>{item.display_name}</Text>
                  </Pressable>)}/>
              <TextInput style={styles.input} placeholder="Entrez la ville" value={cityName} onChangeText={text => {
                    setCityName(text);
                    fetchCitySuggestions(text);
                }} textAlignVertical="top" returnKeyType="done" onSubmitEditing={Keyboard.dismiss} editable={false}/>
              {/*<FlatList
                  data={citySuggestions}
                  keyExtractor={(item) => item.place_id}
                  renderItem={({ item }) => (
                    <Pressable onPress={() => handleSelectSuggestion(item)}>
                      <Text style={styles.suggestion}>{item.display_name}</Text>
                    </Pressable>
                  )}
                />*/}
            </>)}
          {/*<View style={styles.mapContainer}>
              <OpenLayersMap latitude={region.latitude} longitude={region.longitude} />
            </View>*/}
          <Pressable onPress={clearLocalisation} style={styles.clearButtonContainer}>
            <Text style={styles.clearButton}>Vider la localisation</Text>
          </Pressable>
          <BigButtonDown buttonText="Valider" onPress={handleValidation}/>
        </>)}
    </KeyboardAvoidingView>);
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 5,
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
    },
    mapContainer: {
        width: '90%',
        height: 200,
        marginBottom: 10,
    },
    input: {
        height: 40,
        width: '90%',
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
        borderRadius: 10,
    },
    text: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 20,
    },
    autoButton: {
        backgroundColor: '#668F80',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
    },
    manualButton: {
        backgroundColor: '#668F80',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
    },
    buttonText: {
        color: '#FFF',
        fontSize: 16,
    },
    clearButtonContainer: {
        marginTop: 20,
        marginBottom: 100,
    },
    clearButton: {
        fontSize: 16,
        color: 'red',
        marginTop: 20,
    },
    suggestion: {
        padding: 10,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        marginBottom: 20,
    },
});
