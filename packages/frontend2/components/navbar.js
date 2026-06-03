import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';

export default function Navbar() {
    const navigation = useNavigation();

    return (
        <View style={styles.navbar}>
            <TouchableOpacity onPress={() => navigation.navigate('Home')}>
                <Text style={[styles.link]}>Home</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Map')}>
                <Text style={[styles.link]}>Map</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('DigitalMuseum')}>
                <Text style={[styles.link]}>Digital Museum</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Artists')}>
                <Text style={[styles.link]}>Artists</Text>
            </TouchableOpacity>

        </View>
    );
}

const styles = StyleSheet.create({
    navbar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 12,
        backgroundColor: '#051923',
        borderTopWidth: 1,
    },
    link: {
        fontSize: 16,
    }
});