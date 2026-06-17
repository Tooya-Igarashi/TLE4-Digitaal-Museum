import React, {useEffect, useRef} from 'react';
import {Modal, View, TouchableOpacity, Animated, ScrollView, Text, StyleSheet, Dimensions} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');

export default function ImageDetailModal({item, visible, onClose}) {
    const scaleAnim = useRef(new Animated.Value(0.9)).current;

    useEffect(() => {
        if (visible) {
            Animated.spring(scaleAnim, {
                toValue: 1,
                friction: 7,
                tension: 40,
                useNativeDriver: true,
            }).start();
        } else {
            scaleAnim.setValue(0.9);
        }
    }, [visible]);

    if (!item) return null;

    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
            <View style={styles.modalOverlay}>
                <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                    <Ionicons name="close-outline" size={32} color="#F5F5F5"/>
                </TouchableOpacity>

                <Animated.View style={[styles.modalContent, {transform: [{scale: scaleAnim}]}]}>
                    <Animated.Image source={{uri: item.image}} style={styles.fullImage} resizeMode="contain"/>

                    <View style={styles.descriptionContainer}>
                        <ScrollView style={styles.modalDescriptionScroll} showsVerticalScrollIndicator={false}>
                            <Text style={styles.modalDescriptionText}>{item.description}</Text>
                        </ScrollView>
                    </View>
                </Animated.View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(5, 12, 20, 0.95)',
        justifyContent: 'center',
        alignItems: 'center'
    },
    closeButton: {
        position: 'absolute',
        top: 50,
        right: 20,
        zIndex: 10,
        padding: 8
    },
    modalContent: {
        width: SCREEN_WIDTH,
        alignItems: 'center'
    },
    fullImage: {
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT * 0.60
    },
    descriptionContainer: {
        width: SCREEN_WIDTH,
        paddingHorizontal: 24,
        marginTop: 20
    },
    modalDescriptionScroll: {
        maxHeight: SCREEN_HEIGHT * 0.18
    },
    modalDescriptionText: {
        color: '#F5F5F5',
        fontSize: 14,
        lineHeight: 22,
        textAlign: 'center',
        fontFamily: 'Montserrat_400Regular'
    },
});