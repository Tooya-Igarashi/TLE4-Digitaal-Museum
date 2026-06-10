import {StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import {useEffect, useState} from "react";
import Octicons from "react-native-vector-icons/Octicons";

export default function LoginScreen() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [userName, setUserName] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleAddPress = () => {
    }

    return (
        <View style={styles.container}>
            <View style={styles.formInputWrapper}>
                <Octicons name='person' size={20} color='#051923'/>
                <TextInput
                    cursorColor={'#051923'}
                    style={styles.loginInputText}
                    value={userName}
                    onChangeText={setUserName}
                    placeholder='Gebruikersnaam'
                />
            </View>
            <View style={styles.formInputWrapper}>
                <Octicons name='mail' size={20} color='#051923'/>
                <TextInput
                    cursorColor={'#051923'}
                    style={styles.loginInputText}
                    value={email}
                    onChangeText={setEmail}
                    placeholder='Email-adres'
                />
            </View>
            <View style={styles.formInputWrapper}>
                <Octicons name='shield-lock' size={20} color='#051923'/>

                <TextInput
                    cursorColor={'#051923'}
                    style={styles.loginInputText}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={true}
                    placeholder='Wachtwoord'
                />
            </View>
            <View style={styles.loginBtn}>
                <TouchableOpacity style={styles.loginBtnWrapper} onPress={handleAddPress}>
                    <Text style={styles.loginBtnText}>Inloggen</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    formInputWrapper: {
        width: '80%',
        height: 'auto',
        backgroundColor: 'transparent',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: 'black',
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        margin: 10,
    },
    loginInputText: {
        width: '100%',
        height: 'auto',
        color: '#4a6080',
        fontSize: 10,
        fontFamily: 'Montserrat_600SemiBold',
        marginLeft: 10,
    },
    loginBtnWrapper: {
        backgroundColor: '#F5F5F5',
        borderRadius: 5,
        paddingHorizontal: 80,
        paddingVertical: 14,
        borderWidth: 1,
    },
    loginBtn: {
        padding: 20,
    },
    loginBtnText: {
        color: '#051923',
        fontSize: 14,
        fontFamily: 'Montserrat_600SemiBold',
    }
});