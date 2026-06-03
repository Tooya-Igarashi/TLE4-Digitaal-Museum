import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

export default function ArtistsScreen() {
    return (
        <View style={styles.container}>
            <Text>Artists</Text>
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