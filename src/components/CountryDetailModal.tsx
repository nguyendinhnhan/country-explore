import React from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Modal,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Country } from '../types/Country';

interface CountryDetailModalProps {
  country: Country | null;
  visible: boolean;
  onClose: () => void;
  onFavoritePress?: () => void;
  isFavorite?: boolean;
}

const { width: screenWidth } = Dimensions.get('window');

export default function CountryDetailModal({
  country,
  visible,
  onClose,
  onFavoritePress,
  isFavorite = false,
}: CountryDetailModalProps) {
  if (!country) return null;

  const formatPopulation = (population: number) => {
    if (population >= 1000000) {
      return `${(population / 1000000).toFixed(1)} million`;
    } else if (population >= 1000) {
      return `${(population / 1000).toFixed(0)} thousand`;
    }
    return population.toLocaleString();
  };

  const formatArea = (area?: number) => {
    if (!area) return 'N/A';
    return `${area.toLocaleString()} km²`;
  };

  const getCapital = () => {
    if (!country.capital || country.capital.length === 0) {
      return 'N/A';
    }
    return country.capital.join(', ');
  };

  const getLanguages = () => {
    if (!country.languages) return 'N/A';
    return Object.values(country.languages).join(', ');
  };

  const getCurrencies = () => {
    if (!country.currencies) return 'N/A';
    return Object.values(country.currencies)
      .map(currency => `${currency.name} (${currency.symbol})`)
      .join(', ');
  };

  const getTimezones = () => {
    if (!country.timezones || country.timezones.length === 0) return 'N/A';
    return country.timezones.slice(0, 3).join(', ') + 
           (country.timezones.length > 3 ? '...' : '');
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
          >
            <Ionicons name="close" size={24} color="#007AFF" />
          </TouchableOpacity>
          
          <Text style={styles.headerTitle}>Country Details</Text>
          
          {onFavoritePress && (
            <TouchableOpacity
              style={styles.favoriteButton}
              onPress={onFavoritePress}
            >
              <Ionicons
                name={isFavorite ? "star" : "star-outline"}
                size={24}
                color={isFavorite ? "#FFD700" : "#007AFF"}
              />
            </TouchableOpacity>
          )}
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Flag and Basic Info */}
          <View style={styles.flagSection}>
            <Image
              source={{ uri: country.flags.png }}
              style={styles.flagLarge}
              resizeMode="contain"
            />
            <Text style={styles.countryName}>{country.name.common}</Text>
            <Text style={styles.officialName}>{country.name.official}</Text>
          </View>

          {/* Info Cards */}
          <View style={styles.infoGrid}>
            <InfoCard
              icon="location-outline"
              title="Region"
              value={country.region}
              subtitle={country.subregion}
            />
            <InfoCard
              icon="business-outline"
              title="Capital"
              value={getCapital()}
            />
            <InfoCard
              icon="people-outline"
              title="Population"
              value={formatPopulation(country.population)}
            />
            <InfoCard
              icon="resize-outline"
              title="Area"
              value={formatArea(country.area)}
            />
            <InfoCard
              icon="chatbubble-outline"
              title="Languages"
              value={getLanguages()}
            />
            <InfoCard
              icon="card-outline"
              title="Currency"
              value={getCurrencies()}
            />
            <InfoCard
              icon="time-outline"
              title="Timezones"
              value={getTimezones()}
            />
            {country.borders && country.borders.length > 0 && (
              <InfoCard
                icon="git-network-outline"
                title="Borders"
                value={`${country.borders.length} countries`}
              />
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

interface InfoCardProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  value: string;
  subtitle?: string;
}

function InfoCard({ icon, title, value, subtitle }: InfoCardProps) {
  return (
    <View style={styles.infoCard}>
      <View style={styles.infoCardHeader}>
        <Ionicons name={icon} size={20} color="#007AFF" />
        <Text style={styles.infoCardTitle}>{title}</Text>
      </View>
      <Text style={styles.infoCardValue} numberOfLines={2}>
        {value}
      </Text>
      {subtitle && (
        <Text style={styles.infoCardSubtitle}>{subtitle}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E7',
  },
  closeButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#000',
  },
  favoriteButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  flagSection: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 32,
    marginBottom: 16,
  },
  flagLarge: {
    width: screenWidth * 0.6,
    height: (screenWidth * 0.6) * 0.6,
    borderRadius: 12,
    marginBottom: 20,
  },
  countryName: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000',
    textAlign: 'center',
    marginBottom: 4,
  },
  officialName: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
  },
  infoGrid: {
    paddingHorizontal: 16,
    gap: 12,
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
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
  infoCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoCardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8E8E93',
    marginLeft: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoCardValue: {
    fontSize: 17,
    fontWeight: '500',
    color: '#000',
    lineHeight: 22,
  },
  infoCardSubtitle: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 4,
  },
});
