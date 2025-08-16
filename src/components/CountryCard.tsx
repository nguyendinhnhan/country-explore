import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Country } from '../types/Country';

interface CountryCardProps {
  country: Country;
  onPress: () => void;
  onFavoritePress?: () => void;
  isFavorite?: boolean;
  showFavoriteButton?: boolean;
}

export default function CountryCard({
  country,
  onPress,
  onFavoritePress,
  isFavorite = false,
  showFavoriteButton = true,
}: CountryCardProps) {
  const formatPopulation = (population: number) => {
    if (population >= 1000000) {
      return `${(population / 1000000).toFixed(1)}M`;
    } else if (population >= 1000) {
      return `${(population / 1000).toFixed(0)}K`;
    }
    return population.toString();
  };

  const getCapital = () => {
    if (!country.capital || country.capital.length === 0) {
      return 'N/A';
    }
    return country.capital[0];
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.flagContainer}>
        <Image
          source={{ uri: country.flags.png }}
          style={styles.flag}
          resizeMode="cover"
        />
      </View>

      <View style={styles.infoContainer}>
        <View style={styles.headerRow}>
          <Text style={styles.countryName} numberOfLines={1}>
            {country.name.common}
          </Text>
          {showFavoriteButton && onFavoritePress && (
            <TouchableOpacity
              onPress={onFavoritePress}
              style={styles.favoriteButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons
                name={isFavorite ? 'heart' : 'heart-outline'}
                size={20}
                color={isFavorite ? '#FF3B30' : '#8E8E93'}
              />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.detailsRow}>
          <View style={styles.detailItem}>
            <Ionicons name="location-outline" size={14} color="#8E8E93" />
            <Text style={styles.detailText}>{country.region}</Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="business-outline" size={14} color="#8E8E93" />
            <Text style={styles.detailText}>{getCapital()}</Text>
          </View>
        </View>

        <View style={styles.populationRow}>
          <Ionicons name="people-outline" size={14} color="#8E8E93" />
          <Text style={styles.populationText}>
            {formatPopulation(country.population)} people
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 6,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  flagContainer: {
    marginRight: 16,
  },
  flag: {
    width: 60,
    height: 40,
    borderRadius: 6,
  },
  infoContainer: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  countryName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    flex: 1,
  },
  favoriteButton: {
    padding: 4,
  },
  detailsRow: {
    flexDirection: 'row',
    marginBottom: 6,
    gap: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  detailText: {
    fontSize: 14,
    color: '#3C3C43',
    marginLeft: 4,
    flex: 1,
  },
  populationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  populationText: {
    fontSize: 14,
    color: '#8E8E93',
    marginLeft: 4,
  },
});
