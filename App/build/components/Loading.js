import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
const Loading = () => (<View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#668F80"/>
    </View>);
const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
export default Loading;
