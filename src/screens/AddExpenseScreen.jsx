import React from 'react';
import { Text, StyleSheet, TouchableOpacity, Alert, View } from 'react-native';
import { ListItem, Icon } from '@rneui/themed';
import DatePicker from 'react-native-date-picker';

import ScreenTemplate from '../components/ScreenTemplate';
import { AppInput } from '../components/AppInput';
import BudgetFilledMeter from '../components/BudgetFilledMeter';
import { useActiveBudgetByDateAndCategory } from '../hooks/budgets';
import { useExpenseCreationForm } from '../hooks/expenses';

const iconFactory = (id) => {
  switch (id) {
    case 1:
      return "aircraft";
    case 2:
      return "drink";
    case 3:
      return "key";
    case 4:
      return "shopping-cart";
    case 5:
      return "clapperboard";
    case 6:
      return "squared-plus";
    case 7:
      return "man";
    case 8:
      return "open-book";
    default:
      return "credit";
  }
};

const AddExpenseScreen = ({ navigation, route }) => {
  const [concept, setConcept] = React.useState("");
  const [amount, setAmount] = React.useState("");
  const [date, setDate] = React.useState(new Date());
  const [paymentMethod, setPaymentMethod] = React.useState("CASH"); // Default to CASH

  const [dateModalOpen, setDateModalOpen] = React.useState(false);
  const [conceptHasError, setConceptError] = React.useState(false);
  const [amountHasError, setAmountError] = React.useState(false);

  // Fetch cards list and handle card selection
  // const [cards, setCards] = React.useState([]);
  // const [selectedCard, setSelectedCard] = React.useState(null);

  const { isPending: isPendingActiveBudgets, data: activeBudget } = useActiveBudgetByDateAndCategory(date, route.params.selectedCategory.category);
  const { isPending: isPendingForm, mutate: sendForm } = useExpenseCreationForm();

  const loading = isPendingActiveBudgets || isPendingForm;

  const handleSubmit = async () => {
    if (checkForErrors()) {
      Alert.alert("Validation error", "Please correct selected fields and try again.");
      return;
    }
    let newExpense = {
      concept,
      amount,
      date: date.toISOString().substring(0, 10),
      category: route.params.selectedCategory.category,
      iconId: route.params.selectedCategory.iconId,
      paymentMethod,
      // cardId, // Uncomment when implemented
      // cuotas, // Uncomment when implemented
    };

    sendForm(newExpense);
  };

  const handleBack = async () => {
    navigation.goBack();
  };

  const checkForErrors = () => {
    let nameErr = checkConceptError();
    let amountErr = checkAmountError();
    return nameErr || amountErr;
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
        }}>Create Expense</Text>

        <Text>Category</Text>
        <ListItem containerStyle={{ marginBottom: 20 }}>
          <Icon name={iconFactory(route.params.selectedCategory.iconId)} type="entypo" />
          <ListItem.Content>
            <ListItem.Title>{route.params.selectedCategory.category}</ListItem.Title>
          </ListItem.Content>
        </ListItem>

        <Text>Name</Text>
        <AppInput.Concept
          value={concept}
          onChangeText={setConcept}
          errorMessage={conceptHasError ? "Concept may only contain letters or numbers" : null}
          onEndEditing={checkConceptError}
        />

        <Text>Amount</Text>
        <AppInput.Amount
          value={amount}
          onChangeText={setAmount}
          errorMessage={amountHasError ? "Amount must be positive and limited to cent precision" : null}
          onEndEditing={checkAmountError}
        />

        <Text>Date</Text>
        <AppInput.Date
          value={date}
          onPress={() => setDateModalOpen(true)}
        />

        <DatePicker
          modal
          mode="date"
          open={dateModalOpen}
          date={date}
          onConfirm={(selectedDate) => {
            setDateModalOpen(false);
            setDate(selectedDate);
          }}
          onCancel={() => {
            setDateModalOpen(false);
          }}
          maximumDate={new Date()}
        />

        {/* Payment Method selector */}
        <Text>Payment Method</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity
            style={[styles.paymentMethodButton, paymentMethod === 'CASH' ? styles.activePaymentMethod : null]}
            onPress={() => setPaymentMethod('CASH')}
          >
            <Text style={styles.paymentMethodButtonText}>CASH</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.paymentMethodButton, paymentMethod === 'CARD' ? styles.activePaymentMethod : null]}
            onPress={() => setPaymentMethod('CARD')}
          >
            <Text style={styles.paymentMethodButtonText}>CARD</Text>
          </TouchableOpacity>
        </View>

        {/* Add Card Dropdown (to be implemented) */}

        {activeBudget ? (
          <BudgetFilledMeter
            name={activeBudget.name}
            startFilled={activeBudget.currentAmount}
            limit={activeBudget.limitAmount}
            add={amount}
          />
        ) : null}

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

export default AddExpenseScreen;
