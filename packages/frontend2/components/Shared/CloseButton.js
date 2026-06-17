import React from "react";
import {View, TouchableOpacity, StyleSheet, Dimensions} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import {useSafeAreaInsets} from "react-native-safe-area-context";

const {width: SCREEN_WIDTH} = Dimensions.get("window");

export default function CloseButton({onPress}) {
    const insets = useSafeAreaInsets();

    return (
        <View style={[styles.closeContainer, {paddingBottom: insets.bottom + 10}]}>
            <TouchableOpacity style={styles.closeButton} onPress={onPress}>
                <Ionicons name="close" size={28} color="#fff"/>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    closeContainer: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: 90,
        borderTopLeftRadius: 200,
        borderTopRightRadius: 200,
        backgroundColor: "#006494",
        alignItems: "center",
        justifyContent: "flex-start",
        paddingTop: 14,
    },
    closeButton: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: "rgba(255,255,255,0.15)",
        borderWidth: 2,
        borderColor: "rgba(255,255,255,0.3)",
        alignItems: "center",
        justifyContent: "center",
    },
});