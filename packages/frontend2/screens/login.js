import {
    StyleSheet, Text, TextInput, TouchableOpacity,
    View, ActivityIndicator,
} from "react-native";
import {useState} from "react";
import Octicons from "react-native-vector-icons/Octicons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = process.env.EXPO_PUBLIC_API_URL;
const API_KEY = process.env.EXPO_PUBLIC_API_KEY;

const MAX_USERNAME = 20;

// OWASP password rules
const OWASP = [
    {test: (p) => p.length >= 8, label: "Minimaal 8 tekens"},
    {test: (p) => p.length <= 64, label: "Maximaal 64 tekens"},
    {test: (p) => /[A-Z]/.test(p), label: "Minimaal 1 hoofdletter"},
    {test: (p) => /[a-z]/.test(p), label: "Minimaal 1 kleine letter"},
    {test: (p) => /[0-9]/.test(p), label: "Minimaal 1 cijfer"},
    {test: (p) => /[^A-Za-z0-9]/.test(p), label: "Minimaal 1 speciaal teken (!@#$...)"},
];

function OWASPChecklist({password}) {
    if (!password) return null;
    return (
        <View style={styles.owaspList}>
            {OWASP.map((rule, i) => {
                const passed = rule.test(password);
                return (
                    <View key={i} style={styles.owaspRow}>
                        <Octicons
                            name={passed ? "check-circle" : "x-circle"}
                            size={13}
                            color={passed ? "#2ecc71" : "#e74c3c"}
                        />
                        <Text style={[styles.owaspText, {color: passed ? "#2ecc71" : "#e74c3c"}]}>
                            {rule.label}
                        </Text>
                    </View>
                );
            })}
        </View>
    );
}

export default function LoginScreen({navigation}) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState("");

    const validate = () => {
        const e = {};

        if (!username) {
            e.username = "Gebruikersnaam is verplicht.";
        } else if (username.length > MAX_USERNAME) {
            e.username = `Maximaal ${MAX_USERNAME} tekens.`;
        }

        if (!password) {
            e.password = "Wachtwoord is verplicht.";
        } else {
            const failed = OWASP.filter((r) => !r.test(password));
            if (failed.length > 0) {
                e.password = failed[0].label; // show first failing rule
            }
        }

        return e;
    };

    const handleLogin = async () => {
        setServerError("");
        const e = validate();
        setErrors(e);
        if (Object.keys(e).length > 0) return;

        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": API_KEY,
                },
                body: JSON.stringify({username, password}),
            });

            const data = await response.json();

            await AsyncStorage.setItem(
                'accessToken',
                data.accessToken
            );

            await AsyncStorage.setItem(
                'userId',
                data.user.id
            );

            if (!response.ok) {
                setServerError(data.message || "Inloggen mislukt.");
                return;
            }

            navigation.replace("Main", {
                screen: "Profile",
                params: {
                    userId: data.user.id,
                    accessToken: data.accessToken,
                },
            });
        } catch (err) {
            setServerError("Kan geen verbinding maken met de server.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>

            {serverError ? <Text style={styles.serverError}>{serverError}</Text> : null}

            {/* Username */}
            <View style={styles.fieldWrapper}>
                <View style={[styles.formInputWrapper, errors.username && styles.inputError]}>
                    <Octicons name="person" size={20} color="#051923"/>
                    <TextInput
                        cursorColor={"#051923"}
                        style={styles.inputText}
                        value={username}
                        onChangeText={(v) => {
                            setUsername(v);
                            setErrors((e) => ({...e, username: undefined}));
                        }}
                        placeholder="Gebruikersnaam"
                        autoCapitalize="none"
                        maxLength={MAX_USERNAME}
                    />
                    <Text style={[
                        styles.charCount,
                        username.length >= MAX_USERNAME && styles.charCountMax
                    ]}>
                        {username.length}/{MAX_USERNAME}
                    </Text>
                </View>
                {errors.username ? <Text style={styles.fieldError}>{errors.username}</Text> : null}
            </View>

            {/* Password */}
            <View style={styles.fieldWrapper}>
                <View style={[styles.formInputWrapper, errors.password && styles.inputError]}>
                    <Octicons name="shield-lock" size={20} color="#051923"/>
                    <TextInput
                        cursorColor={"#051923"}
                        style={styles.inputText}
                        value={password}
                        onChangeText={(v) => {
                            setPassword(v);
                            setErrors((e) => ({...e, password: undefined}));
                        }}
                        secureTextEntry={!showPassword}
                        placeholder="Wachtwoord"
                    />
                    <TouchableOpacity onPress={() => setShowPassword((v) => !v)}>
                        <Octicons
                            name={showPassword ? "eye-closed" : "eye"}
                            size={20}
                            color="#051923"
                        />
                    </TouchableOpacity>
                </View>
                {errors.password ? <Text style={styles.fieldError}>{errors.password}</Text> : null}
                <OWASPChecklist password={password}/>
            </View>

            <View style={styles.loginBtn}>
                <TouchableOpacity
                    style={[styles.loginBtnWrapper, loading && styles.loginBtnDisabled]}
                    onPress={handleLogin}
                    disabled={loading}
                >
                    {loading
                        ? <ActivityIndicator color="#051923"/>
                        : <Text style={styles.loginBtnText}>Inloggen</Text>
                    }
                </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={() => navigation.navigate("RegisterPage")}>
                <Text style={styles.registerLink}>Nog geen account? Registreer hier</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: "100%",
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 20,
    },
    serverError: {
        color: "#c0392b",
        fontSize: 12,
        fontFamily: "Montserrat_600SemiBold",
        marginBottom: 12,
        textAlign: "center",
    },
    fieldWrapper: {
        width: "80%",
        marginBottom: 4,
    },
    formInputWrapper: {
        backgroundColor: "transparent",
        borderRadius: 5,
        borderWidth: 1,
        borderColor: "black",
        flexDirection: "row",
        alignItems: "center",
        padding: 15,
        marginBottom: 4,
    },
    inputError: {
        borderColor: "#c0392b",
    },
    inputText: {
        flex: 1,
        color: "#4a6080",
        fontSize: 10,
        fontFamily: "Montserrat_600SemiBold",
        marginLeft: 10,
    },
    charCount: {
        fontSize: 10,
        color: "#4a6080",
        fontFamily: "Montserrat_600SemiBold",
    },
    charCountMax: {
        color: "#c0392b",
    },
    fieldError: {
        color: "#c0392b",
        fontSize: 11,
        fontFamily: "Montserrat_600SemiBold",
        marginLeft: 4,
        marginBottom: 4,
    },
    owaspList: {
        marginLeft: 4,
        marginBottom: 8,
        gap: 3,
    },
    owaspRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    owaspText: {
        fontSize: 11,
        fontFamily: "Montserrat_600SemiBold",
    },
    loginBtnWrapper: {
        backgroundColor: "#F5F5F5",
        borderRadius: 5,
        paddingHorizontal: 80,
        paddingVertical: 14,
        borderWidth: 1,
    },
    loginBtnDisabled: {opacity: 0.6},
    loginBtn: {padding: 20},
    loginBtnText: {
        color: "#051923",
        fontSize: 14,
        fontFamily: "Montserrat_600SemiBold",
    },
    registerLink: {
        color: "#4a6080",
        fontSize: 12,
        fontFamily: "Montserrat_600SemiBold",
        textDecorationLine: "underline",
        marginTop: 10,
    },
});