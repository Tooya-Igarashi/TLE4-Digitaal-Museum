import {StatusBar} from 'expo-status-bar';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

export default function HomePage({onNavigateToProfile}) {
    const insets = useSafeAreaInsets();

    return (
        <View style={[styles.container, {paddingBottom: insets.bottom}]}>
            <StatusBar style="light"/>

            <View style={styles.content}>
                <Text style={styles.title}>Digitaal Museum</Text>
                <Text style={styles.subtitle}>Explore and share digital art</Text>

                <TouchableOpacity
                    style={styles.profileButton}
                    onPress={onNavigateToProfile}
                >
                    <Text style={styles.profileButtonText}>Go to Profile →</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#08202A',
    },
    topBar: {
        height: 54,
        backgroundColor: '#0B4D66',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 18,
    },
    topIcon: {
        color: '#fff',
        fontSize: 24,
        width: 30,
        textAlign: 'center',
    },
    logo: {
        color: '#d0e8ef',
        fontSize: 20,
        fontWeight: '700',
        letterSpacing: 1,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 18,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#d0e8ef',
        marginBottom: 12,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: '#9ab8c7',
        textAlign: 'center',
        marginBottom: 32,
    },
    profileButton: {
        backgroundColor: '#ff6fb1',
        paddingVertical: 14,
        paddingHorizontal: 32,
        borderRadius: 8,
    },
    profileButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
    },
    bottomNav: {
        position: 'absolute',
        left: 0,
        right: 0,
        backgroundColor: '#061922',
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 16,
        borderTopWidth: 1,
        borderTopColor: '#0f3545',
    },
    bottomIcon: {
        color: '#fff',
        fontSize: 26,
    },
});