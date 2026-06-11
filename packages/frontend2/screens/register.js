import {StyleSheet, Text, TextInput, TouchableOpacity, View, ActivityIndicator} from "react-native";
import {useState} from "react";
import Octicons from "react-native-vector-icons/Octicons";

const API_URL = process.env.EXPO_PUBLIC_API_URL;
const API_KEY = process.env.EXPO_PUBLIC_API_KEY;

export default function RegisterScreen({navigation}) {

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleRegister = async () => {
        setError("");

        if (!username || !email || !password || !passwordConfirm) {
            setError("Vul alle velden in.");
            return;
        }
        if (password !== passwordConfirm) {
            setError("Wachtwoorden komen niet overeen.");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/auth/signup`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": API_KEY,
                },
                body: JSON.stringify({username, email, password}),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || "Registreren mislukt.");
                return;
            }

            // Direct ingelogd na registratie, ga naar profiel
            navigation.replace("DigitalMuseum", {
                userId: data.user.id,
                accessToken: data.accessToken,
            });

        } catch (err) {
            setError("Kan geen verbinding maken met de server.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>

            {error ? (
                <Text style={styles.errorText}>{error}</Text>
            ) : null}

            <View style={styles.formInputWrapper}>
                <Octicons name='person' size={20} color='#051923'/>
                <TextInput
                    cursorColor={'#051923'}
                    style={styles.loginInputText}
                    value={username}
                    onChangeText={setUsername}
                    placeholder='Gebruikersnaam'
                    autoCapitalize="none"
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
                    autoCapitalize="none"
                    keyboardType="email-address"
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

            <View style={styles.formInputWrapper}>
                <Octicons name='shield-check' size={20} color='#051923'/>
                <TextInput
                    cursorColor={'#051923'}
                    style={styles.loginInputText}
                    value={passwordConfirm}
                    onChangeText={setPasswordConfirm}
                    secureTextEntry={true}
                    placeholder='Herhaal wachtwoord'
                />
            </View>

            <View style={styles.loginBtn}>
                <TouchableOpacity
                    style={[styles.loginBtnWrapper, loading && styles.loginBtnDisabled]}
                    onPress={handleRegister}
                    disabled={loading}
                >
                    {loading
                        ? <ActivityIndicator color='#051923'/>
                        : <Text style={styles.loginBtnText}>Registreren</Text>
                    }
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
    errorText: {
        color: '#c0392b',
        fontSize: 12,
        fontFamily: 'Montserrat_600SemiBold',
        marginBottom: 10,
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
    loginBtnDisabled: {
        opacity: 0.6,
    },
    loginBtn: {
        padding: 20,
    },
    loginBtnText: {
        color: '#051923',
        fontSize: 14,
        fontFamily: 'Montserrat_600SemiBold',
    },
    loginLink: {
        color: '#4a6080',
        fontSize: 12,
        fontFamily: 'Montserrat_600SemiBold',
        textDecorationLine: 'underline',
        marginTop: 10,
    },
});