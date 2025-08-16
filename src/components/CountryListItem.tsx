import { Ionicons } from '@expo/vector-icons';
import React, { useState, useCallback } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Country } from '../types/Country';

interface CountryListItemProps {
  country: Country;
  onPress: () => void;
  onFavoritePress?: () => void;
  isFavorite?: boolean;
  showFavoriteButton?: boolean;
  note?: string;
  onNoteChange?: (note: string) => void;
}

// In React 19, memo is less critical for simple components, but still useful for FlatList items
function CountryListItem({
  country,
  onPress,
  onFavoritePress,
  isFavorite = false,
  showFavoriteButton = true,
  note = '',
  onNoteChange,
}: CountryListItemProps) {
  const [isEditingNote, setIsEditingNote] = useState(false);

  const handleNoteSubmit = useCallback(() => {
    setIsEditingNote(false);
  }, []);

  const handleNotePress = useCallback(() => {
    if (isFavorite) {
      setIsEditingNote(true);
    }
  }, [isFavorite]);

  const handleNoteChange = useCallback(
    (text: string) => {
      onNoteChange?.(text);
    },
    [onNoteChange]
  );

  const handleFavoritePress = useCallback(() => {
    onFavoritePress?.();
  }, [onFavoritePress]);

  return (
    <View style={styles.wrapper}>
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
          <Text style={styles.region}>{country.region}</Text>
        </View>

        {showFavoriteButton && onFavoritePress && (
          <TouchableOpacity
            onPress={handleFavoritePress}
            style={styles.favoriteButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons
              name={isFavorite ? 'star' : 'star-outline'}
              size={20}
              color={isFavorite ? '#FFD700' : '#8E8E93'}
            />
          </TouchableOpacity>
        )}
      </TouchableOpacity>

      {/* Note input - only show when favorited */}
      {isFavorite && (
        <View style={styles.noteContainer}>
          {isEditingNote ? (
            <TextInput
              style={styles.noteInput}
              placeholder="Add a note about this country..."
              value={note}
              onChangeText={handleNoteChange}
              onSubmitEditing={handleNoteSubmit}
              onBlur={handleNoteSubmit}
              autoFocus
              returnKeyType="done"
              maxLength={100}
            />
          ) : (
            <TouchableOpacity
              style={styles.noteDisplayContainer}
              onPress={handleNotePress}
            >
              <Ionicons name="create-outline" size={16} color="#8E8E93" />
              <Text style={styles.noteDisplay}>
                {note || 'Tap to add a note...'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
}

export default CountryListItem;

const styles = StyleSheet.create({
  wrapper: {
    marginHorizontal: 16,
    marginVertical: 4,
    backgroundColor: '#FFFFFF',
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
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
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
  noteContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  noteInput: {
    fontSize: 14,
    color: '#3C3C43',
    minHeight: 28,
    textAlignVertical: 'center',
  },
  noteDisplayContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 28,
  },
  noteDisplay: {
    fontSize: 14,
    color: '#8E8E93',
    fontStyle: 'italic',
    marginLeft: 8,
    flex: 1,
  },
});
