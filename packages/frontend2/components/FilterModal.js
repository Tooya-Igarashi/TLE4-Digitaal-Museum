import React, {useState, useEffect, useRef} from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Animated,
    Modal,
    StyleSheet,
    Dimensions,
    Platform
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

const {height: SCREEN_HEIGHT} = Dimensions.get('window');
const MONTHS_NL = ['Januari', 'Februari', 'Maart', 'April', 'Mei', 'Juni', 'Juli', 'Augustus', 'September', 'Oktober', 'November', 'December'];

export default function FilterModal({
                                        visible,
                                        onClose,
                                        graffitiStyles,
                                        activeFilters,
                                        onApply,
                                        onReset,
                                    }) {
    const filterSlideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

    // Lokale 'pending' states
    const [pendingYearMin, setPendingYearMin] = useState(2000);
    const [pendingYearMax, setPendingYearMax] = useState(new Date().getFullYear());
    const [pendingMonths, setPendingMonths] = useState([]);
    const [pendingStyles, setPendingStyles] = useState([]);
    const [pendingArtistSort, setPendingArtistSort] = useState(null);

    useEffect(() => {
        if (visible) {
            setPendingYearMin(activeFilters.yearMin ?? 2000);
            setPendingYearMax(activeFilters.yearMax ?? new Date().getFullYear());
            setPendingMonths([...activeFilters.months]);
            setPendingStyles([...activeFilters.styles]);
            setPendingArtistSort(activeFilters.artistSort);

            Animated.timing(filterSlideAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }).start();
        } else {
            Animated.timing(filterSlideAnim, {
                toValue: SCREEN_HEIGHT,
                duration: 300,
                useNativeDriver: true,
            }).start();
        }
    }, [visible, activeFilters]);

    const handleApply = () => {
        onApply({
            yearMin: pendingYearMin,
            yearMax: pendingYearMax,
            months: pendingMonths,
            styles: pendingStyles,
            artistSort: pendingArtistSort,
        });
    };

    const handleReset = () => {
        setPendingYearMin(2000);
        setPendingYearMax(new Date().getFullYear());
        setPendingMonths([]);
        setPendingStyles([]);
        setPendingArtistSort(null);
        onReset();
    };

    const toggleMonth = (idx) => {
        setPendingMonths((prev) =>
            prev.includes(idx) ? prev.filter((m) => m !== idx) : [...prev, idx]
        );
    };

    const toggleStyle = (name) => {
        setPendingStyles((prev) =>
            prev.includes(name) ? prev.filter((s) => s !== name) : [...prev, name]
        );
    };

    return (
        <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
            <View style={styles.filterOverlay}>
                <TouchableOpacity style={styles.filterBackdrop} activeOpacity={1} onPress={onClose}/>

                <Animated.View style={[styles.filterPanel, {transform: [{translateY: filterSlideAnim}]}]}>
                    <View style={styles.filterHeader}>
                        <Text style={styles.filterTitle}>Filteren</Text>
                        <TouchableOpacity onPress={handleReset}>
                            <Text style={styles.filterResetText}>Wissen</Text>
                        </TouchableOpacity>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false} style={styles.filterScroll}>
                        <Text style={styles.filterSectionTitle}>Gepubliceerd in</Text>
                        <View style={styles.filterYearRow}>
                            <View style={styles.filterYearBox}>
                                <TextInput
                                    style={styles.filterYearInput}
                                    value={String(pendingYearMin)}
                                    keyboardType="numeric"
                                    maxLength={4}
                                    onChangeText={(t) => setPendingYearMin(Number(t) || 2000)}
                                />
                            </View>
                            <Text style={styles.filterYearDashText}>–</Text>
                            <View style={styles.filterYearBox}>
                                <TextInput
                                    style={styles.filterYearInput}
                                    value={String(pendingYearMax)}
                                    keyboardType="numeric"
                                    maxLength={4}
                                    onChangeText={(t) => setPendingYearMax(Number(t) || new Date().getFullYear())}
                                />
                            </View>
                        </View>

                        <View style={styles.filterMonthGrid}>
                            {MONTHS_NL.map((m, idx) => {
                                const active = pendingMonths.includes(idx);
                                return (
                                    <TouchableOpacity
                                        key={m}
                                        style={[styles.filterMonthChip, active && styles.filterMonthChipActive]}
                                        onPress={() => toggleMonth(idx)}
                                    >
                                        <Text style={[styles.filterMonthText, active && styles.filterMonthTextActive]}>
                                            {m}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>

                        <Text style={styles.filterSectionTitle}>Style</Text>
                        <View style={styles.filterStyleGrid}>
                            {graffitiStyles.map((s) => {
                                const name = s?.name ?? s?.graffitiStyleName ?? String(s);
                                const active = pendingStyles.includes(name);
                                return (
                                    <TouchableOpacity key={name} style={styles.filterCheckRow}
                                                      onPress={() => toggleStyle(name)}>
                                        <View style={[styles.filterCheckbox, active && styles.filterCheckboxActive]}>
                                            {active && <Ionicons name="checkmark" size={12} color="#F5F5F5"/>}
                                        </View>
                                        <Text style={styles.filterCheckLabel}>{name}</Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>

                        <Text style={styles.filterSectionTitle}>Kunstenaars</Text>
                        <View style={styles.filterSortRow}>
                            <TouchableOpacity
                                style={[styles.filterSortBtn, pendingArtistSort === 'az' && styles.filterSortBtnActive]}
                                onPress={() => setPendingArtistSort((p) => (p === 'az' ? null : 'az'))}
                            >
                                <Text
                                    style={[styles.filterSortText, pendingArtistSort === 'az' && styles.filterSortTextActive]}>
                                    A - Z
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.filterSortBtn, pendingArtistSort === 'za' && styles.filterSortBtnActive]}
                                onPress={() => setPendingArtistSort((p) => (p === 'za' ? null : 'za'))}
                            >
                                <Text
                                    style={[styles.filterSortText, pendingArtistSort === 'za' && styles.filterSortTextActive]}>
                                    Z - A
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{height: 20}}/>
                    </ScrollView>

                    <TouchableOpacity style={styles.filterApplyBtn} onPress={handleApply}>
                        <Text style={styles.filterApplyText}>Toon Resultaten</Text>
                    </TouchableOpacity>
                </Animated.View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    filterOverlay: {
        flex: 1,
        justifyContent: 'flex-end'
    },
    filterBackdrop: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(5, 12, 20, 0.7)'
    },
    filterPanel: {
        backgroundColor: '#051923',
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        maxHeight: SCREEN_HEIGHT * 0.9,
        paddingTop: 16,
        paddingHorizontal: 16,
        paddingBottom: Platform.OS === 'ios' ? 24 : 16
    },
    filterHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16
    },
    filterTitle: {
        color: '#F5F5F5',
        fontSize: 16,
        fontFamily: 'Montserrat_600SemiBold',
        flex: 1,
        textAlign: 'center'
    },
    filterResetText: {
        color: '#8ab4cc',
        fontSize: 13,
        fontFamily: 'Montserrat_400Regular'
    },
    filterScroll: {
        marginBottom: 12
    },
    filterSectionTitle: {
        color: '#F5F5F5',
        fontSize: 13,
        fontFamily: 'Montserrat_600SemiBold',
        backgroundColor: '#1E5C7E',
        paddingVertical: 8,
        paddingHorizontal: 12,
        marginTop: 12,
        marginBottom: 12,
        borderRadius: 4
    },
    filterYearRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 16
    },
    filterYearBox: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#1e3a52',
        borderRadius: 6,
        paddingVertical: 6,
        paddingHorizontal: 10
    },
    filterYearInput: {
        color: '#F5F5F5',
        fontSize: 14,
        fontFamily: 'Montserrat_400Regular',
        textAlign: 'center',
        padding: 0
    },
    filterYearDashText: {
        color: '#8ab4cc',
        fontSize: 16
    },
    filterMonthGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 4
    },
    filterMonthChip: {
        borderWidth: 1,
        borderColor: '#1e3a52',
        borderRadius: 6,
        paddingVertical: 8,
        paddingHorizontal: 14,
        minWidth: '22%',
        alignItems: 'center'
    },
    filterMonthChipActive: {
        backgroundColor: '#1E5C7E',
        borderColor: '#1E5C7E'
    },
    filterMonthText: {
        color: '#8ab4cc',
        fontSize: 12,
        fontFamily: 'Montserrat_400Regular'
    },
    filterMonthTextActive: {
        color: '#F5F5F5',
        fontFamily: 'Montserrat_600SemiBold'
    },
    filterStyleGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    filterCheckRow: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '50%',
        paddingVertical: 8,
        gap: 8
    },
    filterCheckbox: {
        width: 18,
        height: 18,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#8ab4cc',
        justifyContent: 'center',
        alignItems: 'center'
    },
    filterCheckboxActive: {
        backgroundColor: '#1E5C7E',
        borderColor: '#1E5C7E'
    },
    filterCheckLabel: {
        color: '#F5F5F5',
        fontSize: 12,
        fontFamily: 'Montserrat_400Regular',
        flexShrink: 1
    },
    filterSortRow: {
        flexDirection: 'row',
        gap: 12
    },
    filterSortBtn: {
        borderWidth: 1,
        borderColor: '#1e3a52',
        borderRadius: 6,
        paddingVertical: 8,
        paddingHorizontal: 24
    },
    filterSortBtnActive: {
        backgroundColor: '#1E5C7E',
        borderColor: '#1E5C7E'
    },
    filterSortText: {
        color: '#8ab4cc',
        fontSize: 13,
        fontFamily: 'Montserrat_400Regular'
    },
    filterSortTextActive: {
        color: '#F5F5F5',
        fontFamily: 'Montserrat_600SemiBold'
    },
    filterApplyBtn: {
        backgroundColor: '#F5F5F5',
        borderRadius: 6,
        paddingVertical: 14,
        alignItems: 'center'
    },
    filterApplyText: {
        color: '#051923',
        fontSize: 14,
        fontFamily: 'Montserrat_600SemiBold'
    },
});