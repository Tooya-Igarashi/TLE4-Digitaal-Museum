import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

export default function DigitalMuseumScreen() {
    return (
        <View style={styles.container}>
            <Text>Digital Museum</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});