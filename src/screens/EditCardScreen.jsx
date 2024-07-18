// EditCardScreen.jsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useEditCardForm } from '../hooks/cards';
import ScreenTemplate from '../components/ScreenTemplate';
import { AppInput } from '../components/AppInput';


const EditCardScreen = ({ route, navigation }) => {
  const { selectedCard } = route.params;
  const { mutate: editCard, isLoading, isError, error } = useEditCardForm();

  const [editedCardName, setEditedCardName] = useState(selectedCard.cardName);
  const [editedCardLimit, setEditedCardLimit] = useState(String(selectedCard.cardLimit));

  const [cardNameHasError, setCardNameError] = useState(false);
  const [cardLimitHasError, setCardLimitError] = useState(false);


  const handleEditCard = () => {
    if (checkForErrors()) {
      Alert.alert("Validation error", "Please correct selected fields and try again.");
      return;
    }

    const editedCard = {
      cardId: selectedCard.id,
      request: {
        cardName: editedCardName,
        cardLimit: parseFloat(editedCardLimit),
      }
    };

    editCard(editedCard);
    navigation.navigate('card-list');
  };

  const checkForErrors = () => {
    let nameErr = checkCardNameError();
    let amountErr = checkCardLimitError();
    return nameErr || amountErr;
  };

  const checkCardNameError = () => {
    let regex = /^[A-Za-z\d\s]+$/;
    let isValid = regex.test(editedCardName);
    setCardNameError(!isValid);
    return !isValid;
  };

  const checkCardLimitError = () => {
    let numericLimit = parseInt(editedCardLimit, 10);
    let isValid = Number.isInteger(numericLimit) && numericLimit > 0;
    setCardLimitError(!isValid);
    return !isValid;
  };

  // Handle errors
  if (isError) {
    Alert.alert("Error", error.message);
  }

  return (
    <ScreenTemplate loading={isLoading}>
      <ScreenTemplate.Scrollable style={{ paddingHorizontal: 15 }}>
        <Text style={{
          fontFamily: 'Roboto-Medium',
          fontSize: 28,
          fontWeight: '500',
          color: '#333',
          marginBottom: 30,
          marginTop: 30,
        }}>Edit Card</Text>

        <Text>Card name</Text>
        <AppInput.CardName
          value={editedCardName}
          onChangeText={setEditedCardName}
          errorMessage={cardNameHasError ? "Card name may only contain letters or numbers" : null}
          onEndEditing={checkCardNameError}
        />

        <Text>Card limit</Text>
        <AppInput.Limit
          value={editedCardLimit}
          onChangeText={setEditedCardLimit}
          errorMessage={cardLimitHasError ? "Limit must be positive and limited to integer" : null}
          onEndEditing={checkCardLimitError}
        />

        <TouchableOpacity style={styles.saveButton} onPress={handleEditCard}>
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>

      </ScreenTemplate.Scrollable>
    </ScreenTemplate>
  );
};

const styles = {
  saveButton: {
    backgroundColor: '#E86DC3',
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 20,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: 'grey',
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
};

export default EditCardScreen;
