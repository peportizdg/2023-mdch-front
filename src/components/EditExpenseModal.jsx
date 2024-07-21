// ExpenseModal.js
import React from 'react';
import { View, Text, Modal, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import DatePicker from 'react-native-date-picker';
import { AppInput } from './AppInput';


const EditExpenseModal = ({ isVisible, onClose, onSave, selectedExpense }) => {
  const [concept, setConcept] = React.useState("");
  const [amount, setAmount] = React.useState("");
  const [date, setDate] = React.useState(new Date());
  const [conceptError, setConceptError] = React.useState(false);
  const [amountError, setAmountError] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    setConcept(selectedExpense.concept);
    setAmount(selectedExpense.amount + "");
    setDate(selectedExpense.date? new Date(selectedExpense.date) : new Date);
  }, [selectedExpense]);

  const checkErrors = () => {
    if (checkConceptError() || checkAmountError()) {
      throw new Error();
    }
  };

  const checkConceptError = () => {
    let regex = /^[A-Za-z\d\s]+$/;
    let isValid = regex.test(concept);
    setConceptError(!isValid);
    return !isValid;
  };

  const checkAmountError = () => {
    let regex = /^[\d]{1,12}((\.)(\d){1,2})?$/;
    let isValid = regex.test(amount);
    setAmountError(!isValid);
    return !isValid;
  };


  const handleSave = () => {
    try {
      checkErrors();
      onSave({ 
        id: selectedExpense.id,
        concept, 
        amount,
        date
      });
      resetFields();
      onClose();
    } catch (e) {
      Alert.alert('Validation error', 'Please check fields and try again');
    }
  };

  const handleCancel = () => {
    // Resets form fields
    resetFields();

    // Calls onClose callback
    onClose();
  };

  const resetFields = () => {
    setConcept(null);
    setAmount(null);
    setDate(new Date());
  };

  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
  Animated.timing(fadeAnim, {
    toValue: paymentMethod === 'CARD' ? 1 : 0,
    duration: 300,
    useNativeDriver: true,
  }).start();
}, [paymentMethod]);

  React.useEffect(() => {
    if (paymentMethod === 'CARD') {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [paymentMethod]);


  return (
    <Modal visible={isVisible} onRequestClose={onClose} transparent>
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Edit Expense</Text>

          <AppInput.Concept 
            value={concept}
            onChangeText={setConcept}
            onEndEditing={checkConceptError}
            errorMessage={conceptError? "Concept may only contain letters or numbers" : null}
          />

          <AppInput.Amount 
            value={amount}
            onChangeText={setAmount}
            onEndEditing={checkAmountError}
            errorMessage={amountError? "Amount must be positive and limited to cent precision" : null}
          />

          <AppInput.Date 
            value={date}
            onPress={() => setOpen(true)}
          />

          <DatePicker
            modal
            mode="date"
            open={open}
            date={date}
            onConfirm={(selectedDate) => {
              setOpen(false);
              setDate(selectedDate);
            }}
            onCancel={() => {
              setOpen(false);
            }}
            maximumDate={new Date()}
          />

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    display: 'flex',
    flexDirection: 'column',

    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',

    justifyContent: 'center',
    alignItems: 'center',
  },

  modalContainer: {
    display: 'flex',
    flexDirection: 'column',

    width: '90%',

    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
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
});

export default EditExpenseModal;