import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

const BigButtonDown = ({ buttonText }: { buttonText: string }) => {
  return (
    <View style={styles.fixedDetailsBtn}>
    <View style={styles.selectorContainer}>
      <TouchableOpacity style={styles.selectorButton}>
        <Text style={{ color: '#FFF', fontSize: 14, fontWeight: 'bold' }}>
            {buttonText}
        </Text>
      </TouchableOpacity>
    </View>
    </View>
  );
};

const styles = StyleSheet.create({
    fixedDetailsBtn: {
        paddingTop : 100,
        marginTop: 100,
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
});

export default BigButtonDown;