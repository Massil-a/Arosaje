var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Modal } from 'react-native';
import BigButtonDown from '../../components/BigButtonDown';
import ListDash from '../../components/ListDash';
import InformationsPersonnelles from '../optnav/infoperso';
import SecuriteCompte from '../optnav/secucompte';
import Notification from '../optnav/notif';
import Botaniste from '../optnav/botaniste';
import Question from '../optnav/question';
import Donnees from '../optnav/donnees';
import InfoLeg from '../optnav/infoleg';
import Restart from './logout';
const Stack = createNativeStackNavigator();
function OptionsScreen({}) {
    return (<NavigationContainer independent={true}>
      <Stack.Navigator initialRouteName="Options" screenOptions={{
            headerStyle: {
                backgroundColor: '#668F80',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
                color: '#FFF',
                fontSize: 24,
                fontWeight: 'bold',
            },
        }}>
        <Stack.Screen name="Options" component={OptionsContent}/>
        <Stack.Screen name="Informations personnelles" component={InformationsPersonnelles} options={{
            headerBackTitleVisible: false
        }}/>
        <Stack.Screen name="Sécurité du compte" component={SecuriteCompte} options={{
            headerBackTitleVisible: false
        }}/>
        <Stack.Screen name="Notifications" component={Notification} options={{
            headerBackTitleVisible: false
        }}/>
        <Stack.Screen name="Devenir botaniste" component={Botaniste} options={{
            headerBackTitleVisible: false
        }}/>
        <Stack.Screen name="Questions" component={Question} options={{
            headerBackTitleVisible: false
        }}/>
        <Stack.Screen name="Mes données" // @ts-ignore 
     component={Donnees} options={{
            headerBackTitleVisible: false
        }}/>
        <Stack.Screen name="Informations légales" component={InfoLeg} options={{
            headerBackTitleVisible: false
        }}/>
      </Stack.Navigator>
    </NavigationContainer>);
}
function OptionsContent({}) {
    const navigation = useNavigation();
    const [modalType, setModalType] = useState('');
    const setModalVisible = (isVisible, modalType) => {
        if (isVisible) {
            setModalType(modalType);
        }
        else {
            setModalType('');
        }
    };
    const checkUserToken = () => __awaiter(this, void 0, void 0, function* () {
        const userToken = yield AsyncStorage.getItem('userToken');
        if (!userToken) {
            setModalVisible(true, 'index');
        }
    });
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            checkUserToken();
        });
        return unsubscribe;
    }, []);
    const handleLogout = () => __awaiter(this, void 0, void 0, function* () {
        yield AsyncStorage.removeItem('userToken');
        yield AsyncStorage.removeItem('userId');
        yield AsyncStorage.removeItem('role');
        yield AsyncStorage.removeItem('email');
        yield AsyncStorage.removeItem('password');
        setModalVisible(true, 'index');
    });
    return (<View style={styles.container}>
      <View style={styles.fixedDetails}>
        <ListDash buttonText="Informations personnelles" onPress={() => navigation.navigate('Informations personnelles')}/>
        <View style={styles.separatorDetails}/>
        <ListDash buttonText="Sécurité du compte" onPress={() => navigation.navigate('Sécurité du compte')}/>
        <View style={styles.separatorDetails}/>
        <ListDash buttonText="Notifications" onPress={() => navigation.navigate('Notifications')}/>
        <View style={styles.separatorDetails}/>
        {/*<ListDash buttonText="Devenir botaniste" onPress={() => navigation.navigate('Devenir botaniste')} />
        <View style={styles.separatorDetails}/>*/}
        <ListDash buttonText="Questions" onPress={() => navigation.navigate('Questions')}/>
        <View style={styles.separatorDetails}/>
        <ListDash buttonText="Mes données" onPress={() => navigation.navigate('Mes données')}/>
        <View style={styles.separatorDetails}/>
        <ListDash buttonText="Informations légales" onPress={() => navigation.navigate('Informations légales')}/>
        <View style={styles.separatorDetails}/>
      </View>
      <BigButtonDown buttonText="Déconnecter" onPress={handleLogout}/>
      <Modal visible={modalType === 'index'} animationType="slide" transparent={true}>
          <Restart setIsModalVisible={(isVisible, type) => setModalVisible(isVisible, type)}/>
        </Modal>
    </View>);
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    headerTitleContainer: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 50,
        alignItems: 'center',
    },
    fixedDetails: {
        marginTop: 30,
        alignItems: 'flex-start',
    },
    scrollViewContent: {
        paddingTop: 20,
    },
    body: {
        flex: 1,
        width: '100%',
        paddingHorizontal: 20,
        backgroundColor: '#FFF',
    },
    separatorDetails: {
        height: 1,
        backgroundColor: '#E8E8E8',
        width: '95%',
        marginVertical: 5,
        alignSelf: 'center',
    },
    selectorOptions: {
        padding: 10,
        color: '#BDBDBD',
    },
    selectorOptionsText: {
        fontSize: 14,
    }
});
export default OptionsScreen;
