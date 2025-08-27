import React, { memo } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Region } from '@/src/types/Country';
import { useThemeColor } from '@/src/hooks';

interface RegionFilterProps {
  regions: Region[];
  selectedRegion: Region;
  onRegionChange: (region: Region) => void;
}

function RegionFilter({
  regions,
  selectedRegion,
  onRegionChange,
}: RegionFilterProps) {
  const handlePress = (region: Region) => onRegionChange(region);

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.regionContainer}
      contentContainerStyle={styles.regionContent}
    >
      {regions.map((region) => (
        <RegionItem
          key={region}
          region={region}
          isActive={selectedRegion === region}
          onPress={handlePress}
        />
      ))}
    </ScrollView>
  );
}

export default memo(RegionFilter);

interface RegionItemProps {
  region: Region;
  isActive: boolean;
  onPress: (region: Region) => void;
}

/**
 * Few regions — no need for memoization
 * RegionItem renders with RegionFilter
 */
const RegionItem = ({ region, isActive, onPress }: RegionItemProps) => {
  const tintColor = useThemeColor({}, 'tint');
  const tintContrastColor = useThemeColor({}, 'tintContrast');
  const textColor = useThemeColor({}, 'text');
  const itemColor = useThemeColor({}, 'item');

  const handlePress = () => onPress(region);

  return (
    <TouchableOpacity
      testID={`region-${region}`}
      style={[
        styles.regionButton,
        {
          backgroundColor: isActive ? tintColor : itemColor,
          borderColor: tintColor,
        },
      ]}
      onPress={handlePress}
    >
      <Text
        style={[
          styles.regionText,
          { color: isActive ? tintContrastColor : textColor },
        ]}
      >
        {region}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  regionContainer: {
    marginHorizontal: -16,
  },
  regionContent: {
    paddingHorizontal: 16,
    gap: 8,
  },

  /** RegionItem */
  regionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 0.5,
    marginRight: 8,
  },
  regionText: {
    fontSize: 14,
    fontWeight: '500',
  },
});
