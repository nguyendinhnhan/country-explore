import { Ionicons } from '@expo/vector-icons';
import React, { useState, useEffect } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Country } from '../types/Country';
import { ThemedText } from './ThemedText';
import { Colors } from '../constants/Colors';
import { useThemeColor } from '../hooks';

interface CountryListItemProps {
  country: Country;
  onPress: (country: Country) => void;
  onFavoritePress: (country: Country) => void;
  isFavorite: boolean;
  note: string;
  onNoteChange: (cc3: string, note: string) => void;
}

function CountryListItem({
  country,
  onPress,
  onFavoritePress,
  isFavorite = false,
  note = '',
  onNoteChange,
}: CountryListItemProps) {
  const textColor = useThemeColor({}, 'text');
  const iconColor = useThemeColor({}, 'icon');
  const itemColor = useThemeColor({}, 'item');
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [localNote, setLocalNote] = useState(note);

  const handlePress = () => onPress(country);

  const handleFavoritePress = () => onFavoritePress(country);

  const handleNoteSubmit = () => {
    setIsEditingNote(false);
    if (localNote !== note) {
      onNoteChange(country.cca3, localNote);
    }
  };

  const handleNotePress = () => {
    if (isFavorite) {
      setIsEditingNote(true);
    }
  };

  useEffect(() => {
    setLocalNote(note);
  }, [note]);

  if (!country) {
    return null;
  }

  return (
    <View style={[styles.wrapper, { backgroundColor: itemColor }]}>
      <TouchableOpacity
        style={styles.container}
        onPress={handlePress}
        testID="country-item"
      >
        <Image
          source={{ uri: country.flags.png }}
          style={styles.flag}
          resizeMode="cover"
        />

        <View style={styles.infoContainer}>
          <ThemedText type="defaultSemiBold" numberOfLines={1}>
            {country.name.common}
          </ThemedText>
          <ThemedText type="headline">{country.region}</ThemedText>
        </View>

        <TouchableOpacity
          onPress={handleFavoritePress}
          style={styles.favoriteButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          testID="favorite-button"
        >
          <Ionicons
            name={isFavorite ? 'star' : 'star-outline'}
            size={20}
            color={isFavorite ? Colors.favoriteColor : iconColor}
            testID="favorite-icon"
          />
        </TouchableOpacity>
      </TouchableOpacity>

      {/* Note input - only show when favorited */}
      {isFavorite && (
        <View style={styles.noteContainer}>
          {isEditingNote ? (
            <TextInput
              style={[styles.noteInput, { color: textColor }]}
              placeholder="Add a note about this country..."
              value={localNote}
              onChangeText={setLocalNote}
              onSubmitEditing={handleNoteSubmit}
              onBlur={handleNoteSubmit}
              autoFocus
              autoCorrect={false}
              autoCapitalize="none"
              returnKeyType="done"
              maxLength={100}
              testID="note-input"
            />
          ) : (
            <TouchableOpacity
              style={styles.noteDisplayContainer}
              onPress={handleNotePress}
              testID="note-display"
            >
              <Ionicons name="create-outline" size={16} color={iconColor} />
              <Text style={[styles.noteDisplay, { color: iconColor }]}>
                {localNote || 'Tap to add a note...'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
}

export default React.memo(CountryListItem, (prevProps, nextProps) => {
  return (
    prevProps.country.cca3 === nextProps.country.cca3 &&
    prevProps.isFavorite === nextProps.isFavorite &&
    prevProps.note === nextProps.note
  );
});

const styles = StyleSheet.create({
  wrapper: {
    marginVertical: 4,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
    elevation: 5,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  flag: {
    width: 72,
    height: 46,
    borderRadius: 6,
    marginRight: 16,
  },
  infoContainer: {
    flex: 1,
  },
  countryName: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 2,
  },
  favoriteButton: {
    padding: 8,
    marginLeft: 8,
  },
  noteContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  noteInput: {
    fontSize: 14,
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
    fontStyle: 'italic',
    marginLeft: 8,
    flex: 1,
  },
});
