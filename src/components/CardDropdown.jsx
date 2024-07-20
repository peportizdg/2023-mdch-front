import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useCardList } from '../hooks/cards'; // Import the hook

const CardDropdown = ({ selectedCard, setSelectedCard }) => {
  const { data: cards, isLoading, isError, refetch } = useCardList();
  const [value, setValue] = useState(selectedCard);
  const [isFocus, setIsFocus] = useState(false);

  useEffect(() => {
    setValue(selectedCard);
  }, [selectedCard]);
  // Handle the error state
  if (isError) {
    Alert.alert('Error', 'Failed to load cards');
    return null; // or return an empty View
  }

  // Handle loading state
  if (isLoading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  // Transform the fetched data into the format expected by Dropdown
  const data = cards.map(card => ({
    key: card.id, // Ensure you use the correct field for the key
    label: card.cardName, // Ensure you use the correct field for the label
    value: card.id, // or another unique value for the item
  }));

  return (
    <View style={styles.container}>
      <Dropdown
        style={[styles.dropdown, isFocus && { borderColor: '#E86DC3' }]}
        itemTextStyle={{ color: 'black' }}
        itemContainerStyle={{ borderColor: 'gray' }}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={data}
        maxHeight={250}
        labelField="label"
        valueField="value"
        placeholder={!isFocus ? 'Select card' : '...'}
        value={value}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={item => {
          setValue(item.value);
          setSelectedCard(item.value);
          setIsFocus(false);
        }}
        renderLeftIcon={() => (
          <AntDesign
            style={styles.icon}
            color={isFocus ? '#E86DC3' : 'black'}
            name="creditcard"
            size={20}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 16,
  },
  dropdown: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: 'absolute',
    backgroundColor: 'white',
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
    color: 'gray',
  },
  selectedTextStyle: {
    fontSize: 16,
    color: 'black',
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});

export default CardDropdown;
