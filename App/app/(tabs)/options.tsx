import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import BigButtonDown from '../../components/BigButtonDown';
import ListDash from '../../components/ListDash';
import HeaderTitle from '../../components/HeaderTitle';

export default function OptionsScreen() {

  return (
    <View style={styles.container}>
      <View style={styles.header}>
      <HeaderTitle title="Options" />
      </View>
      
      <View style={styles.fixedDetails}>
        <ListDash buttonText="Informations personnelles" />
        <View style={styles.separatorDetails}/>
        <ListDash buttonText="Sécurité du compte" />
        <View style={styles.separatorDetails}/>
        <ListDash buttonText="Notifications" />
        <View style={styles.separatorDetails}/>
        <ListDash buttonText="Devenir botaniste" />
        <View style={styles.separatorDetails}/>
        <ListDash buttonText="Questions" />
        <View style={styles.separatorDetails}/>
        <ListDash buttonText="Mes données" />
        <View style={styles.separatorDetails}/>
        <ListDash buttonText="Informations légales" />
        <View style={styles.separatorDetails}/>
      </View>
      <BigButtonDown buttonText="Déconnecter" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF', 
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
    alignSelf : 'center',
  },
  selectorOptions: {
    padding : 10,
    color : '#BDBDBD',
  },
  selectorOptionsText: {
    fontSize : 14,
  }
});
