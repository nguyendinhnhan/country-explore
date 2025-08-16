import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Country } from '../types/Country';

interface CountryListItemProps {
  country: Country;
  onPress: () => void;
  onFavoritePress?: () => void;
  isFavorite?: boolean;
  showFavoriteButton?: boolean;
}

export default function CountryListItem({
  country,
  onPress,
  onFavoritePress,
  isFavorite = false,
  showFavoriteButton = true,
}: CountryListItemProps) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Image
        source={{ uri: country.flags.png }}
        style={styles.flag}
        resizeMode="cover"
      />
      
      <View style={styles.infoContainer}>
        <Text style={styles.countryName} numberOfLines={1}>
          {country.name.common}
        </Text>
        <Text style={styles.region}>
          {country.region}
        </Text>
      </View>

      {showFavoriteButton && onFavoritePress && (
        <TouchableOpacity
          onPress={onFavoritePress}
          style={styles.favoriteButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons
            name={isFavorite ? "star" : "star-outline"}
            size={20}
            color={isFavorite ? "#FFD700" : "#8E8E93"}
          />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  flag: {
    width: 50,
    height: 34,
    borderRadius: 6,
    marginRight: 16,
  },
  infoContainer: {
    flex: 1,
  },
  countryName: {
    fontSize: 17,
    fontWeight: '600',
    color: '#000',
    marginBottom: 2,
  },
  region: {
    fontSize: 15,
    color: '#8E8E93',
  },
  favoriteButton: {
    padding: 8,
    marginLeft: 8,
  },
});
