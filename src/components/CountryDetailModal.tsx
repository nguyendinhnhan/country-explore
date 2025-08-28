import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  Dimensions,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Image } from 'expo-image';
import { Country } from '../types/Country';
import {
  formatPopulation,
  getCapital,
  getLanguages,
  getCurrencies,
} from '../utils/countryFormatters';
import { useThemeColor } from '../hooks';
import { Colors } from '../constants/Colors';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';
import useCountryDetails from '../hooks/useCountryDetails';
import LoadingState from './LoadingState';

interface CountryDetailModalProps {
  country: Country;
  onClose: () => void;
  onFavoritePress: () => void;
  isFavorite: boolean;
}

const { width: screenWidth } = Dimensions.get('window');

export default function CountryDetailModal({
  country,
  onClose,
  onFavoritePress,
  isFavorite = false,
}: CountryDetailModalProps) {
  const background = useThemeColor({}, 'background');
  const itemColor = useThemeColor({}, 'item');
  const iconColor = useThemeColor({}, 'icon');

  const { details, loading } = useCountryDetails(country?.cca3, {
    initialData: country,
  });

  return (
    <Modal
      visible
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={[styles.container, { backgroundColor: background }]}>
        {/* Header */}
        <View
          style={[
            styles.header,
            {
              backgroundColor: itemColor,
            },
          ]}
        >
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={24} color={Colors.primaryColor} />
          </TouchableOpacity>

          <ThemedText type="subtitle">Country Details</ThemedText>

          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={onFavoritePress}
          >
            <Ionicons
              name={isFavorite ? 'star' : 'star-outline'}
              size={24}
              color={isFavorite ? Colors.favoriteColor : Colors.primaryColor}
            />
          </TouchableOpacity>
        </View>
        {loading ? (
          <LoadingState />
        ) : (
          <ScrollView
            style={styles.content}
            showsVerticalScrollIndicator={false}
          >
            {/* Flag and Basic Info */}
            <View style={[styles.flagSection, { backgroundColor: itemColor }]}>
              <Image
                source={{ uri: details.flags.png }}
                placeholder={require('../../assets/images/react-logo.png')}
                style={styles.flagLarge}
                contentFit="contain"
              />
              <ThemedText type="title" style={styles.textCenter}>
                {details.name.common}
              </ThemedText>
              <ThemedText style={[styles.textCenter, { color: iconColor }]}>
                {details.name.official}
              </ThemedText>
            </View>

            {/* Info Cards */}
            <ThemedView style={styles.infoGrid}>
              <InfoCard
                icon="location-outline"
                title="Region"
                value={details.region}
              />
              <InfoCard
                icon="business-outline"
                title="Capital"
                value={getCapital(details)}
              />
              <InfoCard
                icon="people-outline"
                title="Population"
                value={formatPopulation(details.population)}
              />
              <InfoCard
                icon="chatbubble-outline"
                title="Languages"
                value={getLanguages(details)}
              />
              <InfoCard
                icon="card-outline"
                title="Currency"
                value={getCurrencies(details)}
              />
            </ThemedView>
          </ScrollView>
        )}
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
  const itemColor = useThemeColor({}, 'item');
  const iconColor = useThemeColor({}, 'icon');

  return (
    <View style={[styles.infoCard, { backgroundColor: itemColor }]}>
      <View style={styles.infoCardHeader}>
        <Ionicons name={icon} size={20} color={Colors.primaryColor} />
        <Text style={[styles.infoCardTitle, { color: iconColor }]}>
          {title}
        </Text>
      </View>
      <ThemedText type="defaultSemiBold" numberOfLines={2}>
        {value}
      </ThemedText>
      {subtitle && (
        <Text style={[styles.infoCardSubtitle, { color: iconColor }]}>
          {subtitle}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(128, 128, 128, 0.25)',
  },
  closeButton: {
    padding: 8,
  },
  favoriteButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  flagSection: {
    alignItems: 'center',
    paddingVertical: 32,
    marginBottom: 16,
  },
  flagLarge: {
    width: screenWidth * 0.6,
    height: screenWidth * 0.6 * 0.6,
    borderRadius: 12,
    marginBottom: 12,
  },
  textCenter: {
    textAlign: 'center',
  },
  infoGrid: {
    paddingHorizontal: 16,
    gap: 12,
  },
  infoCard: {
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
    marginLeft: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoCardSubtitle: {
    fontSize: 14,
    marginTop: 4,
  },
});
