import React, { Suspense } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Country } from '../types/Country';

// Lazy load the CountryDetailModal component
const CountryDetailModalComponent = React.lazy(
  () => import('./CountryDetailModal')
);

interface LazyCountryDetailModalProps {
  country: Country | null;
  visible: boolean;
  onClose: () => void;
  onFavoritePress?: () => void;
  isFavorite?: boolean;
}

// Loading fallback component for the lazy-loaded modal
const ModalLoadingFallback = () => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color="#007AFF" />
  </View>
);

export default function LazyCountryDetailModal(
  props: LazyCountryDetailModalProps
) {
  if (!props.visible || !props.country) {
    return null;
  }

  return (
    <Suspense fallback={<ModalLoadingFallback />}>
      <CountryDetailModalComponent {...props} />
    </Suspense>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});
