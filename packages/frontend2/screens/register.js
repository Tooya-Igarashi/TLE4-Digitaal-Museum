import {
    StyleSheet, Text, TextInput, TouchableOpacity,
    View, ActivityIndicator, ScrollView
} from "react-native";
import {useState} from "react";
import Octicons from "react-native-vector-icons/Octicons";

const API_URL = process.env.EXPO_PUBLIC_API_URL;
const API_KEY = process.env.EXPO_PUBLIC_API_KEY;

const MIN_USERNAME = 3;
const MAX_USERNAME = 20;
const MIN_PASSWORD = 8;

function validate({username, email, password, passwordConfirm}) {
    const errors = {};

    if (!username) {
        errors.username = "Gebruikersnaam is verplicht.";
    } else if (username.length < MIN_USERNAME) {
        errors.username = `Minimaal ${MIN_USERNAME} tekens.`;
    } else if (username.length > MAX_USERNAME) {
        errors.username = `Maximaal ${MAX_USERNAME} tekens.`;
    }

    if (!email) {
        errors.email = "E-mailadres is verplicht.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.email = "Geen geldig e-mailadres.";
    }

    if (!password) {
        errors.password = "Wachtwoord is verplicht.";
    } else if (password.length < MIN_PASSWORD) {
        errors.password = `Minimaal ${MIN_PASSWORD} tekens.`;
    } else if (!/[A-Z]/.test(password)) {
        errors.password = "Moet minimaal 1 hoofdletter bevatten.";
    } else if (!/[0-9]/.test(password)) {
        errors.password = "Moet minimaal 1 cijfer bevatten.";
    }

    if (!passwordConfirm) {
        errors.passwordConfirm = "Herhaal je wachtwoord.";
    } else if (password !== passwordConfirm) {
        errors.passwordConfirm = "Wachtwoorden komen niet overeen.";
    }

    return errors;
}

function FieldError({message}) {
    if (!message) return null;
    return <Text style={styles.fieldError}>{message}</Text>;
}

function PasswordStrength({password}) {
    if (!password) return null;

    let strength = 0;
    if (password.length >= MIN_PASSWORD) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    const labels = ["Zwak", "Matig", "Goed", "Sterk"];
    const colors = ["#e74c3c", "#e67e22", "#f1c40f", "#2ecc71"];

    return (
        <View style={styles.strengthWrapper}>
            <View style={styles.strengthBars}>
                {[0, 1, 2, 3].map((i) => (
                    <View
                        key={i}
                        style={[
                            styles.strengthBar,
                            {backgroundColor: i < strength ? colors[strength - 1] : "#1e3a52"},
                        ]}
                    />
                ))}
            </View>
            <Text style={[styles.strengthLabel, {color: colors[strength - 1] || "#8ab4cc"}]}>
                {strength > 0 ? labels[strength - 1] : ""}
            </Text>
        </View>
    );
}

export default function RegisterScreen({navigation}) {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState("");

    const handleRegister = async () => {
        setServerError("");
        const validation = validate({username, email, password, passwordConfirm});
        setErrors(validation);
        if (Object.keys(validation).length > 0) return;

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
                setServerError(data.message || "Registreren mislukt.");
                return;
            }

            navigation.replace("Profiel", {
                userId: data.user.id,
                accessToken: data.accessToken,
            });
        } catch (err) {
            setServerError("Kan geen verbinding maken met de server.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">

            {serverError ? (
                <Text style={styles.serverError}>{serverError}</Text>
            ) : null}

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
                    <Text style={styles.charCount}>{username.length}/{MAX_USERNAME}</Text>
                </View>
                <FieldError message={errors.username}/>
            </View>

            {/* Email */}
            <View style={styles.fieldWrapper}>
                <View style={[styles.formInputWrapper, errors.email && styles.inputError]}>
                    <Octicons name="mail" size={20} color="#051923"/>
                    <TextInput
                        cursorColor={"#051923"}
                        style={styles.inputText}
                        value={email}
                        onChangeText={(v) => {
                            setEmail(v);
                            setErrors((e) => ({...e, email: undefined}));
                        }}
                        placeholder="Email-adres"
                        autoCapitalize="none"
                        keyboardType="email-address"
                    />
                </View>
                <FieldError message={errors.email}/>
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
                        <Octicons name={showPassword ? "eye-closed" : "eye"} size={20} color="#051923"/>
                    </TouchableOpacity>
                </View>
                <PasswordStrength password={password}/>
                <FieldError message={errors.password}/>
            </View>

            {/* Password confirm */}
            <View style={styles.fieldWrapper}>
                <View style={[styles.formInputWrapper, errors.passwordConfirm && styles.inputError]}>
                    <Octicons name="shield-check" size={20} color="#051923"/>
                    <TextInput
                        cursorColor={"#051923"}
                        style={styles.inputText}
                        value={passwordConfirm}
                        onChangeText={(v) => {
                            setPasswordConfirm(v);
                            setErrors((e) => ({...e, passwordConfirm: undefined}));
                        }}
                        secureTextEntry={!showPasswordConfirm}
                        placeholder="Herhaal wachtwoord"
                    />
                    <TouchableOpacity onPress={() => setShowPasswordConfirm((v) => !v)}>
                        <Octicons name={showPasswordConfirm ? "eye-closed" : "eye"} size={20} color="#051923"/>
                    </TouchableOpacity>
                </View>
                <FieldError message={errors.passwordConfirm}/>
            </View>

            {/* Submit */}
            <View style={styles.btnWrapper}>
                <TouchableOpacity
                    style={[styles.btn, loading && styles.btnDisabled]}
                    onPress={handleRegister}
                    disabled={loading}
                >
                    {loading
                        ? <ActivityIndicator color="#051923"/>
                        : <Text style={styles.btnText}>Registreren</Text>
                    }
                </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                <Text style={styles.loginLink}>Al een account? Log hier in</Text>
            </TouchableOpacity>

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        width: "100%",
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 40,
        paddingHorizontal: 20,
    },
    serverError: {
        color: "#c0392b",
        fontSize: 12,
        fontFamily: "Montserrat_600SemiBold",
        marginBottom: 16,
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
    fieldError: {
        color: "#c0392b",
        fontSize: 11,
        fontFamily: "Montserrat_600SemiBold",
        marginBottom: 6,
        marginLeft: 4,
    },
    strengthWrapper: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginBottom: 4,
        marginLeft: 4,
    },
    strengthBars: {
        flexDirection: "row",
        gap: 4,
    },
    strengthBar: {
        width: 32,
        height: 4,
        borderRadius: 2,
    },
    strengthLabel: {
        fontSize: 11,
        fontFamily: "Montserrat_600SemiBold",
    },
    btnWrapper: {
        padding: 20,
    },
    btn: {
        backgroundColor: "#F5F5F5",
        borderRadius: 5,
        paddingHorizontal: 80,
        paddingVertical: 14,
        borderWidth: 1,
    },
    btnDisabled: {
        opacity: 0.6,
    },
    btnText: {
        color: "#051923",
        fontSize: 14,
        fontFamily: "Montserrat_600SemiBold",
    },
    loginLink: {
        color: "#4a6080",
        fontSize: 12,
        fontFamily: "Montserrat_600SemiBold",
        textDecorationLine: "underline",
        marginTop: 10,
    },
});