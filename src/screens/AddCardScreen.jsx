import React from 'react';
import { Text, StyleSheet, TouchableOpacity, Alert, View } from 'react-native';
import ScreenTemplate from '../components/ScreenTemplate';
import { AppInput } from '../components/AppInput';
import { useCardCreationForm } from '../hooks/cards';


const AddCardScreen = ({ navigation, route }) => {

  const[cardName, setCardName] = React.useState("");
  const[cardLimit, setCardLimit] = React.useState("");

  const [cardNameHasError, setCardNameError] = React.useState(false);
  const [cardLimitHasError, setCardLimitError] = React.useState(false);

  const { isPending: loading, mutate: sendForm } = useCardCreationForm();



  const handleSubmit = async () => {
    if (checkForErrors()) {
      Alert.alert("Validation error", "Please correct selected fields and try again.");
      return;
    }
    let newCard = {
      cardName: cardName,
      cardLimit: cardLimit,
    };

    sendForm(newCard);
  };

  const handleBack = async () => {
    navigation.goBack();
  };

const checkForErrors = () => {
  let cardNameHasError = checkCardNameError();
  let cardLimitHasError = checkCardLimitError();
  return cardNameHasError || cardLimitHasError;
};

const checkCardNameError = () => {
  let regex = /^[A-Za-z\d\s]+$/;
  let isValid = regex.test(cardName);
  setCardNameError(!isValid);
  return !isValid;
};

const checkCardLimitError = () => {
  let numericLimit = parseInt(cardLimit, 10);
  let isValid = Number.isInteger(numericLimit) && numericLimit > 0;
  setCardLimitError(!isValid);
  return !isValid;
};

  return (
    <ScreenTemplate loading={loading}>
      <ScreenTemplate.Scrollable style={{ paddingHorizontal: 15 }}>
        <Text style={{
          fontFamily: 'Roboto-Medium',
          fontSize: 28,
          fontWeight: '500',
          color: '#333',
          marginBottom: 30,
          marginTop: 30,
        }}>Add a new card</Text>
        <AppInput.CardName
        value={cardName}
        onChangeText={setCardName}
        errorMessage={cardNameHasError ? "Invalid card name" : ""}
        onEndEditing={checkCardNameError}
        />
        <AppInput.Limit
        value={cardLimit}
        onChangeText={setCardLimit}
        errorMessage={cardLimitHasError ? "Invalid card limit" : ""}
        onEndEditing={checkCardLimitError}
        />

        <TouchableOpacity style={styles.saveButton} onPress={handleSubmit}>
          <Text style={styles.saveButtonText}>Create</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.cancelButton} onPress={handleBack}>
          <Text style={styles.cancelButtonText}>Back</Text>
        </TouchableOpacity>

      </ScreenTemplate.Scrollable>

    </ScreenTemplate>
  );
};

const styles = StyleSheet.create({
  saveButton: {
    backgroundColor: '#E86DC3',
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 20,
    borderWidth: 1,
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
  paymentMethodButton: {
    backgroundColor: '#DDD',
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 15,
    marginRight: 10,
  },
  activePaymentMethod: {
    backgroundColor: '#4CAF50', // Example active color
  },
  paymentMethodButtonText: {
    fontWeight: 'bold',
    color: '#333',
  },
});

export default AddCardScreen;
