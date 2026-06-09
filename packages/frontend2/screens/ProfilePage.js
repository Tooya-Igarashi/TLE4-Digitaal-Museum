import {useEffect, useState} from 'react';
import {View, Text, StyleSheet, ScrollView, ActivityIndicator, Image} from 'react-native';

const UsersScreen = () => {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/users`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': process.env.EXPO_PUBLIC_API_KEY,
                },
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            const data = await response.json();
            setUsers(data);
        } catch (err) {
            setError(err.message);
            console.error('Failed to fetch users:', err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Users</Text>

            {loading && <ActivityIndicator size="large" color="#4db6e6"/>}
            {error && <Text style={styles.error}>Error: {error}</Text>}

            <ScrollView style={styles.list}>
                {users.map((user) => (
                    <View key={user._id} style={styles.card}>

                        {/* Avatar */}
                        <View style={styles.avatar}>
                            {user.avatar ? (
                                <Image
                                    source={{uri: user.avatar}}
                                    style={styles.avatarImg}
                                />
                            ) : (
                                <Text style={styles.avatarPlaceholder}>👤</Text>
                            )}
                        </View>

                        {/* User info */}
                        <Text style={styles.username}>{user.username}</Text>
                        <Text style={styles.email}>{user.email}</Text>
                        <Text style={styles.role}>Rol: {user.role}</Text>
                        <Text style={styles.desc}>{user.description}</Text>
                        <Text style={styles.premium}>
                            Premium: {user.premium ? "🟡 Ja" : "⚪ Nee"}
                        </Text>

                    </View>
                ))}
            </ScrollView>
        </View>
    );
};

export default UsersScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0d1b24',
        paddingTop: 50,
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#d0e8ef',
        marginBottom: 20,
    },
    list: {
        marginTop: 10,
    },
    card: {
        backgroundColor: '#1f2f38',
        padding: 16,
        borderRadius: 12,
        marginBottom: 14,
        borderWidth: 1,
        borderColor: '#2f4a55',
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#2a3c45',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
    },
    avatarImg: {
        width: 80,
        height: 80,
        borderRadius: 40,
    },
    avatarPlaceholder: {
        fontSize: 40,
    },
    username: {
        fontSize: 18,
        fontWeight: '700',
        color: '#ffffff',
        marginBottom: 4,
    },
    email: {
        fontSize: 13,
        color: '#9bbcc7',
        marginBottom: 4,
    },
    role: {
        fontSize: 13,
        color: '#d0e8ef',
        marginBottom: 6,
    },
    desc: {
        fontSize: 13,
        color: '#c7dbe4',
        marginBottom: 6,
    },
    premium: {
        fontSize: 13,
        color: '#ffd27f',
        fontWeight: '600',
    },
    error: {
        color: '#ff6b6b',
        marginBottom: 10,
        fontSize: 16,
    },
});
