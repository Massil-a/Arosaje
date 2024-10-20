import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TextInput, Text, Alert, Pressable, FlatList, Modal } from 'react-native';
import HeaderTitle from '../../components/HeaderTitle';
import * as Location from 'expo-location';
import { CheckBox } from '@rneui/themed';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Load from '../../components/Loading';
import DonneesPersonnelles from '../optnav/donnees';
import axios from 'axios';

interface InscriptionScreenProps {
    setIsModalVisible: (isVisible: boolean, type: string) => void;
}

interface Suggestion {
    place_id: string;
    display_name: string;
    address: {
        city: string;
        postcode: string;
    };
}

type AddressSuggestion = {
    place_id: string;
    display_name: string;
};

export default function InscriptionScreen({ setIsModalVisible }: InscriptionScreenProps) {
    const [step, setStep] = useState(1);
    const [lastName, setLastName] = useState('');
    const [firstName, setFirstName] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [cityName, setCityName] = useState('');
    const [addressValid, setAddressValid] = useState(true);
    const [cityValid, setCityValid] = useState(true);
    const [citySuggestions, setCitySuggestions] = useState([]);
    const [addressSuggestions, setAddressSuggestions] = useState([]);
    const [isConsentChecked, setIsConsentChecked] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [isDonneesVisible, setIsDonneesVisible] = useState(false);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    const phoneRegex = /^\d{10}$/;

    const apiUrl = process.env.EXPO_PUBLIC_API_IP;

    const handleNext = () => {
        if (step === 1 && lastName && firstName && email) {
            if (!emailRegex.test(email)) {
                Alert.alert('Erreur', 'Veuillez saisir une adresse e-mail valide.');
            } else {
                setStep(2);
            }
        } else if (step === 2 && password && confirmPassword && password === confirmPassword && passwordRegex.test(password)) {
            setStep(3);
        } else if (step === 3 && phone && phoneRegex.test(phone)) {
            setStep(4);
        } else if (step === 4 && address && cityName && addressValid && cityValid) {
            setStep(5);
        }
    };

    const handleConfirm = () => {
        if (step === 5 && isConsentChecked) {
            const userData = {
                lastName,
                firstName,
                email,
                address,
                phone,
                cityName,
                password
            };

            fetch(`${apiUrl}/user/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            })
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                });
            Alert.alert("Bienvenue", "Inscription réussi, veuillez vous connectez");
            setIsModalVisible(false, 'inscription');
        } else {
            Alert.alert("Échec", "Inscription échoué. Veuillez accepter les termes et conditions.");
        }
    };

    const handleAutoLocation = async () => {
        setIsLoading(true);
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            console.error('Permission to access location was denied');
            setIsLoading(false);
            return;
        }

        let location = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = location.coords;

        let address = await Location.reverseGeocodeAsync({ latitude, longitude });
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

            setAddress(addressPart);
            setCityName(cityPart);
            setAddressValid(true);
            setCityValid(true);
        }
        setIsLoading(false);
    };

    const fetchSuggestions = async (input: string, type: string) => {
        const response = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${input}&addressdetails=1&countrycodes=fr`);
        const data = response.data.map((item: any) => ({
            place_id: item.place_id,
            display_name: item.display_name,
            lat: item.lat,
            lon: item.lon
        }));

        if (type === 'address') {
            setAddressSuggestions(data);
        } else {
            setCitySuggestions(data);
        }
    };

    const validateCity = async () => {
        if (!cityName) return;
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${cityName}&addressdetails=1&countrycodes=fr`);
        const data = await response.json();
        setCityValid(data.length > 0);
        setCitySuggestions(data); // Mettre à jour les suggestions de ville
    };

    const validateAddress = async () => {
        if (!address || !cityName) return;
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${address},${cityName}&addressdetails=1&countrycodes=fr`);
        const data = await response.json();
        setAddressValid(data.length > 0);
        setAddressSuggestions(data); // Mettre à jour les suggestions d'adresse
    };

    const renderSuggestion = ({ item }: { item: AddressSuggestion }) => (
        <Pressable
            style={styles.suggestion}
            onPress={() => {
                const parts = item.display_name.split(', ');
                let addressPart = parts[0];
                let cityPart = `${parts[2]}, ${parts[6]}`;

                // Si le premier caractère de la première partie est un chiffre, c'est probablement un numéro de rue
                if (/\d/.test(parts[0][0])) {
                    addressPart = `${parts[0]} ${parts[1]}`;
                    cityPart = `${parts[3]}, ${parts[8]}`;
                }

                setAddress(addressPart);
                setCityName(cityPart);
                setAddressSuggestions([]);
                setCitySuggestions([]);
            }}
        >
            <Text>{item.display_name}</Text>
        </Pressable>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <HeaderTitle title='Inscription' />
            </View>
            {step === 1 && (
                <>
                    <View style={styles.textInput}>
                        <Text style={styles.textSizeInput}>Nom:</Text>
                        <TextInput placeholder="Nom" value={lastName} onChangeText={setLastName} style={styles.input} />
                        <Text style={styles.textSizeInput}>Prénom:</Text>
                        <TextInput placeholder="Prénom" value={firstName} onChangeText={setFirstName} style={styles.input} />
                        <Text style={styles.textSizeInput}>Email:</Text>
                        <TextInput
                            value={email}
                            onChangeText={setEmail}
                            style={styles.input}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            autoCorrect={false}
                            textContentType="emailAddress"
                            onBlur={() => {
                                if (email && !emailRegex.test(email)) {
                                    Alert.alert('Erreur', 'Veuillez saisir une adresse e-mail valide.');
                                }
                            }}
                            placeholder="Email"
                        />
                    </View>
                    <View style={styles.fixedDetailsBtn}>
                        <View style={styles.selectorContainer}>
                            <Pressable style={styles.selectorButton} onPress={handleNext}>
                                <Text style={{ color: '#FFF', fontSize: 18, fontWeight: 'bold', }}>Suivant</Text>
                            </Pressable>
                        </View>
                    </View>
                </>
            )}
            {step === 2 && (
                <>
                    <View style={styles.textInput}>
                        <Text style={styles.textSizeInput}>Mot de passe:</Text>
                        <TextInput
                            placeholder="Mot de passe"
                            value={password}
                            onChangeText={setPassword}
                            autoCapitalize='words'
                            secureTextEntry={true}
                            style={styles.input}
                        />
                        <Text style={styles.textSizeInput}>Confirmation du Mot de passe:</Text>
                        <TextInput
                            placeholder="Confirmation du mot de passe"
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            secureTextEntry={true}
                            style={styles.input}
                        />
                        <Text style={[styles.textInput, { color: 'red', textAlign: 'center' }]}>Le mot de passe doit contenir au moins 8 caractères, dont au moins une lettre majuscule, une lettre minuscule, un chiffre et un caractère spécial (@$!%*?&).</Text>
                    </View>
                    <View style={styles.fixedDetailsBtn}>
                        <View style={styles.selectorContainer}>
                            <Pressable style={styles.selectorButton} onPress={handleNext}>
                                <Text style={{ color: '#FFF', fontSize: 18, fontWeight: 'bold', }}>Suivant</Text>
                            </Pressable>
                        </View>
                    </View>
                </>
            )}
            {step === 3 && (
                <>
                    <View style={styles.textInput}>
                        <Text style={styles.textSizeInput}>Téléphone:</Text>
                        <TextInput
                            placeholder="Téléphone"
                            value={phone}
                            onChangeText={setPhone}
                            style={styles.input}
                            keyboardType="phone-pad"
                            onBlur={() => {
                                if (phone.length === 0) {
                                    setPhone('');
                                }
                            }}
                            returnKeyType="done"
                        />
                    </View>
                    <View style={styles.fixedDetailsBtn}>
                        <View style={styles.selectorContainer}>
                            <Pressable style={styles.selectorButton} onPress={handleNext}>
                                <Text style={{ color: '#FFF', fontSize: 18, fontWeight: 'bold', }}>Suivant</Text>
                            </Pressable>
                        </View>
                    </View>
                </>
            )}
            {step === 4 && (
                <>
                    <View style={styles.textInput}>
                    <Text style={styles.textSizeInput}>Addresse:</Text>
                        <TextInput
                            placeholder="Addresse"
                            value={address}
                            onChangeText={(text) => {
                                setAddress(text);
                                fetchSuggestions(text, 'address');
                            }}
                            style={[styles.input, !addressValid && styles.invalidInput]}
                            onBlur={validateAddress}
                            editable={true}
                        />
                        <FlatList
                            data={addressSuggestions}
                            keyExtractor={(item) => item.place_id}
                            renderItem={renderSuggestion}
                            style={styles.suggestionList}
                        />
                        <Text style={styles.textSizeInput}>Ville:</Text>
                        <TextInput
                            placeholder="Ville"
                            value={cityName}
                            onChangeText={(text) => {
                                setCityName(text);
                                fetchSuggestions(text, 'city');
                            }}
                            style={[styles.input, !cityValid && styles.invalidInput]}
                            onBlur={validateCity}
                            editable={false}
                        />
                        {/*<FlatList
                            data={citySuggestions}
                            keyExtractor={(item) => item.place_id}
                            renderItem={renderSuggestion}
                            style={styles.suggestionList}
                        />*/}
                        <Text style={[styles.textInput, { color: 'red', textAlign: 'center' }]}>Pour utiliser la localisation automatique, veillez à être a l'endroit oû ce trouve vos plantes.</Text>
                        {isLoading && <Load />}
                    </View>
                    <View style={styles.fixedDetailsBtn}>
                        <View style={styles.selectorContainer}>
                            <Pressable style={styles.autoLocationButton} onPress={handleAutoLocation} disabled={isLoading}>
                                <Text style={{ color: '#FFF', fontSize: 18, fontWeight: 'bold', }}>Localisation automatique</Text>
                                <Ionicons name="search-outline" size={24} color="white" />
                            </Pressable>
                        </View>
                        <View style={styles.selectorContainer}>
                            <Pressable style={styles.selectorButton} onPress={handleNext} disabled={isLoading}>
                                <Text style={{ color: '#FFF', fontSize: 18, fontWeight: 'bold', }}>Suivant</Text>
                            </Pressable>
                        </View>
                    </View>
                </>
            )}
            {step === 5 && (
                <>
                    <View style={styles.textInput}>
                        <Text style={styles.textSizeInput}>Nom: {lastName}</Text>
                        <Text style={styles.textSizeInput}>Prénom: {firstName}</Text>
                        <Text style={styles.textSizeInput}>Email: {email}</Text>
                        <Text style={styles.textSizeInput}>Addresse: {address}</Text>
                        <Text style={styles.textSizeInput}>Ville: {cityName}</Text>
                        <Text style={styles.textSizeInput}>Téléphone: {phone}</Text>
                    </View>
                    <View style={styles.consentContainer}>
                        <CheckBox
                            checked={isConsentChecked}
                            onPress={() => setIsConsentChecked(!isConsentChecked)}
                            title="J'accepte les termes et conditions"
                            textStyle={{color: 'red'}}
                            checkedColor='#668F80'
                            uncheckedColor='#668F80'
                            center
                        />
                    </View>
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={isDonneesVisible}
                        onRequestClose={() => setIsDonneesVisible(false)}
                    >
                        <View style={styles.modalContainer}></View>
                        <DonneesPersonnelles closeModal={() => setIsDonneesVisible(false)} />
                    </Modal>

                    <View style={styles.fixedDetailsBtn}>
                        <View style={styles.selectorContainer}>
                            <Pressable style={styles.selectorButton} onPress={() => setIsDonneesVisible(true)}>
                                <Text style={{ color: '#FFF', fontSize: 18, fontWeight: 'bold', }}>Politique de Confidentialité</Text>
                            </Pressable>
                        </View>
                        <View style={styles.selectorContainer}>
                            <Pressable style={[styles.selectorButton, { backgroundColor: '#fff', borderWidth: 1, borderColor: '#668F80' }]} onPress={() => setStep(1)}>
                                <Text style={{ color: '#668F80', fontSize: 18, fontWeight: 'bold', }}>Modifier</Text>
                            </Pressable>
                        </View>
                        <View style={styles.selectorContainer}>
                            <Pressable style={styles.selectorButton} onPress={handleConfirm}>
                                <Text style={{ color: '#FFF', fontSize: 18, fontWeight: 'bold', }}>Confirmer</Text>
                            </Pressable>
                        </View>
                    </View>
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
        paddingBottom: 10,
    },
    header: {
        height: 100,
        backgroundColor: '#668F80',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        paddingTop: 20,
    },
    input: {
        backgroundColor: '#F0F0F0',
        height: 50,
        width: '90%',
        margin: 10,
        padding: 10,
        borderRadius: 5,
    },
    textSizeInput: {
        fontSize: 16
    },
    textInput: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 15,
    },
    invalidInput: {
        borderColor: 'red',
        borderWidth: 2,
    },
    fixedDetailsBtn: {
        position: 'absolute',
        bottom: 10,
        width: '100%',
        alignItems: 'center',
    },
    selectorContainer: {
        flexDirection: 'row',
        marginBottom: 20,
        backgroundColor: '#E0E0E0',
        borderRadius: 25,
        overflow: 'hidden',
        width: '90%',
        alignItems: 'center',
    },
    selectorButton: {
        flex: 1,
        paddingVertical: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#668F80',
    },
    autoLocationButton: {
        flex: 1,
        paddingVertical: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#668F80',
    },
    suggestion: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    suggestionList: {
        width: '90%',
        maxHeight: 150,
    },
    consentContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 20,
        padding: 20,
        justifyContent: 'center',
    },
    checkbox: {
        width: 24,
        height: 24,
        marginRight: 10,
    },
    modalContainer: {
        paddingTop: 25,
        paddingBottom: 25,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '80%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    modalText: {
        fontSize: 16,
        marginBottom: 10,
    },
    closeButton: {
        color: '#007BFF',
        marginTop: 20,
    },
});
