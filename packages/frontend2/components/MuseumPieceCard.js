import React from 'react';
import {View, Text, TouchableOpacity, Image, StyleSheet, Dimensions} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import {LinearGradient} from 'expo-linear-gradient';

const {width: SCREEN_WIDTH} = Dimensions.get('window');

export default function PieceCard({
                                      item,
                                      index,
                                      isFavorite,
                                      onOpenImage,
                                      onToggleFavorite,
                                      onArtistPress,
                                      onLocationPress,
                                  }) {
    const isEven = index % 2 === 0;
    const gradientStart = isEven ? {x: 0.3, y: 0} : {x: 1, y: 1};
    const gradientEnd = isEven ? {x: 1, y: 0.3} : {x: 0, y: 0};
    const rotation = isEven ? '5deg' : '-5deg';

    const renderImageSection = () => (
        <TouchableOpacity
            style={styles.imageWrapper}
            activeOpacity={0.9}
            onPress={() => onOpenImage(item)}
        >
            <View style={[styles.imageBackground, {transform: [{rotate: rotation}]}]}/>
            <View style={{transform: [{rotate: rotation}]}}>
                <Image source={{uri: item.image}} style={styles.pieceImage} resizeMode="cover"/>
                <Ionicons name="expand-outline" size={22} color="#F5F5F5" style={styles.expandIcon}/>
                <TouchableOpacity onPress={() => onToggleFavorite(item._id)}>
                    <Ionicons
                        name={isFavorite ? 'star' : 'star-outline'}
                        size={22}
                        color="#F5F5F5"
                        style={styles.starIcon}
                    />
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );

    const renderInfoSection = () => (
        <View style={styles.pieceInfo}>
            <Text style={styles.pieceDescription} numberOfLines={5}>
                {item.description}
            </Text>
            {item.date && (
                <View style={styles.metaRow}>
                    <Ionicons name="calendar-outline" size={12} color="#8ab4cc"/>
                    <Text style={styles.metaText}>
                        {new Date(item.date).toLocaleDateString('nl-NL', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                        })}
                    </Text>
                </View>
            )}
            {(item.graffitiStyle?.name || item.graffitiStyle?.graffitiStyleName) && (
                <View style={styles.metaRow}>
                    <Ionicons name="color-palette-outline" size={12} color="#8ab4cc"/>
                    <Text style={styles.styleChip}>
                        {item.graffitiStyle?.name ?? item.graffitiStyle?.graffitiStyleName}
                    </Text>
                </View>
            )}
            <TouchableOpacity onPress={() => onArtistPress(item)}>
                <Text style={styles.artistLabel}>
                    Ontworpen door <Text style={styles.artistName}>{item.user?.username || '—'}</Text>
                </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.locationRow} onPress={() => onLocationPress(item)}>
                <Text style={styles.locationText}>Locatie</Text>
                <Ionicons name="map-outline" size={22} color="#F5F5F5"/>
            </TouchableOpacity>
        </View>
    );

    return (
        <LinearGradient
            colors={['rgba(245,245,245,0.50)', 'rgba(0,100,148,0.70)', 'rgba(0,31,46,1)']}
            locations={[0.2, 0.6, 1]}
            start={gradientStart}
            end={gradientEnd}
            style={styles.pieceCard}
        >
            {isEven ? (
                <>
                    {renderImageSection()}
                    {renderInfoSection()}
                </>
            ) : (
                <>
                    {renderInfoSection()}
                    {renderImageSection()}
                </>
            )}
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    pieceCard: {
        flexDirection: 'row',
        minHeight: 100,
        marginTop: 20,
        marginBottom: 10,
        overflow: 'visible',
    },
    imageWrapper: {
        width: SCREEN_WIDTH * 0.45,
        height: 180,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    imageBackground: {
        position: 'absolute',
        width: 180,
        height: 180,
        backgroundColor: '#1E5C7E',
        borderRadius: 6,
        elevation: 6,
    },
    pieceImage: {
        width: 150,
        height: 150,
    },
    expandIcon: {
        position: 'absolute',
        top: 0,
        right: 0,
        zIndex: 10,
        backgroundColor: 'rgba(0,0,0,0.4)',
        padding: 4,
        borderRadius: 4,
    },
    starIcon: {
        position: 'absolute',
        top: -30,
        right: 0,
        zIndex: 10,
        padding: 4,
    },
    pieceInfo: {
        flex: 1,
        padding: 14,
        justifyContent: 'space-between',
    },
    pieceDescription: {
        color: '#F5F5F5',
        fontSize: 12,
        lineHeight: 18,
        fontFamily: 'Montserrat_400Regular',
        marginBottom: 8,
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginBottom: 4,
    },
    metaText: {
        color: '#8ab4cc',
        fontSize: 10,
        fontFamily: 'Montserrat_400Regular',
    },
    styleChip: {
        color: '#F5F5F5',
        fontSize: 10,
        fontFamily: 'Montserrat_600SemiBold',
        backgroundColor: 'rgba(30,92,126,0.6)',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
        overflow: 'hidden',
    },
    artistLabel: {
        color: '#F5F5F5',
        fontSize: 10,
        marginBottom: 8,
    },
    artistName: {
        color: '#FFFF00',
        fontFamily: 'Montserrat_600SemiBold',
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    locationText: {
        color: '#F5F5F5',
        fontSize: 10,
        marginRight: 4,
    },
});