// EditBudgetScreen.jsx

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useEditBudgetForm } from '../hooks/budgets';
import ScreenTemplate from '../components/ScreenTemplate';
import { AppInput } from '../components/AppInput';
import DatePicker from 'react-native-date-picker';


const EditBudgetScreen = ({ route, navigation }) => {
  const { selectedBudget } = route.params;
  const { mutate: editBudget, isLoading, isError, error } = useEditBudgetForm();

  const [editedBudgetName, setEditedBudgetName] = useState(selectedBudget.name);
  const [editedBudgetAmount, setEditedBudgetAmount] = useState(String(selectedBudget.limitAmount));
  const [editedStartDate, setNewStartDate] = useState(new Date(selectedBudget.creationDate));
  const [editedEndDate, setNewEndDate] = useState(new Date(selectedBudget.limitDate));

  const [nameHasError, setNameError] = useState(false);
  const [amountHasError, setAmountError] = useState(false);

  const [startDateOpen, setStartDateOpen] = useState(false);
  const [endDateOpen, setEndDateOpen] = useState(false);

  const handleEditBudget = () => {
    if (checkForErrors()) {
      Alert.alert("Validation error", "Please correct selected fields and try again.");
      return;
    }

    const editedBudget = {
      budgetId: selectedBudget.id,
      request: {
        name: editedBudgetName,
        limitAmount: parseFloat(editedBudgetAmount),
        startingDate: editedStartDate,
        limitDate: editedEndDate,
      }
    };

    editBudget(editedBudget);
    navigation.navigate('budget-list');
  };

  const checkForErrors = () => {
    let nameErr = checkNameError();
    let amountErr = checkAmountError();
    return nameErr || amountErr;
  };

  const checkNameError = () => {
    let regex = /^[A-Za-z\d\s]+$/;
    let isValid = regex.test(editedBudgetName);
    setNameError(!isValid);
    return !isValid;
  };

  const checkAmountError = () => {
    let regex = /^[\d]{1,12}((\.)(\d){1,2})?$/;
    let isValid = regex.test(editedBudgetAmount);
    setAmountError(!isValid);
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
        }}>Edit Budget</Text>

        <Text>Name</Text>
        <AppInput.Budget
          value={editedBudgetName}
          onChangeText={setEditedBudgetName}
          errorMessage={nameHasError ? "Concept may only contain letters or numbers" : null}
          onEndEditing={checkNameError}
        />

        <Text>Budget Max</Text>
        <AppInput.Amount
          value={editedBudgetAmount}
          onChangeText={setEditedBudgetAmount}
          errorMessage={amountHasError ? "Amount must be positive and limited to cent precision" : null}
          onEndEditing={checkAmountError}
        />

        <Text>Starting date</Text>
        <AppInput.Date
          value={editedStartDate}
          onPress={() => setStartDateOpen(true)}
        />
        <DatePicker
            modal
            mode="date"
            open={startDateOpen}
            date={editedStartDate}
            onConfirm={(selectedDate) => {
              setStartDateOpen(false);
              setNewStartDate(selectedDate);
            }}
            onCancel={() => {
                setStartDateOpen(false);
            }}
            maximumDate={new Date()}
          />


        <Text>Ending date</Text>
        <AppInput.Date
          value={editedEndDate}
          onPress={() => setEndDateOpen(true)}
        />
        <DatePicker
            modal
            mode="date"
            open={endDateOpen}
            date={editedEndDate}
            onConfirm={(selectedDate) => {
              setEndDateOpen(false);
              setNewEndDate(selectedDate);
            }}
            onCancel={() => {
                setEndDateOpen(false);
            }}
            minimumDate={editedStartDate || new Date()} // Ensure minimumDate is before or equal to maximumDate
            maximumDate={new Date('2100-12-31')} // Allow dates far into the future
          />


        <TouchableOpacity style={styles.saveButton} onPress={handleEditBudget}>
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

export default EditBudgetScreen;
