import React from 'react';
import {View, TextInput, ScrollView, TouchableOpacity, Text, StyleSheet} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function SearchBar({
                                      searchQuery,
                                      onSearchChange,
                                      onSubmit,
                                      searchHistory,
                                      onHistoryTap,
                                      onClearHistory
                                  }) {
    return (
        <View style={styles.searchContainer}>
            <View style={styles.searchBar}>
                <Ionicons name="search-outline" size={20} color="#8ab4cc" style={styles.searchIcon}/>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Zoek op jaar, maand, stijl of artiest..."
                    placeholderTextColor="#52796f"
                    value={searchQuery}
                    onChangeText={onSearchChange}
                    onSubmitEditing={onSubmit}
                    returnKeyType="search"
                />
                {searchQuery.length > 0 && (
                    <TouchableOpacity onPress={() => onSearchChange('')}>
                        <Ionicons name="close-circle" size={18} color="#8ab4cc"/>
                    </TouchableOpacity>
                )}
            </View>

            {searchHistory.length > 0 && (
                <View style={styles.historyWrapper}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}
                                contentContainerStyle={styles.historyScroll}>
                        {searchHistory.map((item, index) => (
                            <TouchableOpacity key={index} style={styles.historyChip} onPress={() => onHistoryTap(item)}>
                                <Ionicons name="time-outline" size={12} color="#8ab4cc"/>
                                <Text style={styles.historyText}>{item}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                    <TouchableOpacity onPress={onClearHistory} style={styles.clearHistoryBtn}>
                        <Text style={styles.clearHistoryText}>Wis</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    searchContainer: {
        paddingHorizontal: 16,
        marginTop: 10
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
        borderWidth: 1,
        borderColor: '#1e3a52',
        borderRadius: 8,
        paddingHorizontal: 12,
        height: 45
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        paddingVertical: 6,
        color: '#051923',
        fontSize: 14,
        fontFamily: 'Montserrat_400Regular'
    },
    historyWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8
    },
    historyScroll: {
        gap: 6,
        paddingRight: 40
    },
    historyChip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(30, 92, 126, 0.3)',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 14,
        gap: 4
    },
    historyText: {
        color: '#8ab4cc',
        fontSize: 11,
        fontFamily: 'Montserrat_400Regular'
    },
    clearHistoryBtn: {
        position: 'absolute',
        right: 0,
        backgroundColor: '#051923',
        paddingLeft: 8,
        height: '100%',
        justifyContent: 'center'
    },
    clearHistoryText: {
        color: '#e63946',
        fontSize: 11,
        fontFamily: 'Montserrat_600SemiBold'
    },
});