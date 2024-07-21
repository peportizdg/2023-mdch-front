import React from 'react';
import { Text, StyleSheet, TouchableOpacity, Alert, View, Animated } from 'react-native';
import { ListItem, Icon } from '@rneui/themed';
import DatePicker from 'react-native-date-picker';
import CardDropdown from '../components/CardDropdown';
import ScreenTemplate from '../components/ScreenTemplate';
import { AppInput } from '../components/AppInput';
import { useEditProgrammedExpenseForm } from '../hooks/programmedExpense';

const iconFactory = (id) => {
  switch (id) {
    case 1:
      return "aircraft"
    case 2:
      return "drink"
    case 3:
      return "key"
    case 4:
      return "shopping-cart"
    case 5:
      return "clapperboard"
    case 6:
      return "squared-plus"
    case 7:
      return "man"
    case 8:
      return "open-book"
    default:
      return "credit"
  }
};

const EditProgrammedExpenseScreen = ({ navigation, route }) => {
  const { selectedProgrammedExpense } = route.params;
  const [concept, setConcept] = React.useState(selectedProgrammedExpense.concept);
  const [amount, setAmount] = React.useState(selectedProgrammedExpense.amount);
  const initialStartDate = selectedProgrammedExpense.date ? new Date(selectedProgrammedExpense.date) : new Date();
  const initialEndDate = selectedProgrammedExpense.endDate ? new Date(selectedProgrammedExpense.endDate) : new Date();
  
  const [date, setStartDate] = React.useState(initialStartDate);
  const [endDate, setEndDate] = React.useState(initialEndDate);
  const [paymentMethod, setPaymentMethod] = React.useState("CASH"); // Default to CASH
  const [selectedCard, setSelectedCard] = React.useState(selectedProgrammedExpense.cardId);
  const [cuotas, setCuotas] = React.useState(null);
  const [periodicity, setPeriodicity] = React.useState(null);
  
  const [nameHasError, setNameError] = React.useState(false);
  const [amountHasError, setAmountError] = React.useState(false);
  const [periodicityHasError, setPeriodicityError] = React.useState(false);
  const [cuotasHasError, setCuotasError] = React.useState(false);

  const [startDateOpen, setStartDateOpen] = React.useState(false);
  const [endDateOpen, setEndDateOpen] = React.useState(false);
  
  const { isPending: loading, mutate: sendForm } = useEditProgrammedExpenseForm();

  const handleSubmit = () => {
    if (checkForErrors()) {
      Alert.alert("Validation error", "Please correct selected fields and try again.");
      return;
    }

    const newProgrammedExpense = {
      programmedExpenseId: selectedProgrammedExpense.id,
      request : {
        concept,
        amount,
        date: date.toISOString().substring(0, 10),
        category: selectedProgrammedExpense.category,
        iconId: selectedProgrammedExpense.iconId,
        paymentMethod,
        cardId: selectedCard,
        cuotas,
        endDate: endDate.toISOString().substring(0, 10),
        periodicity: parseInt(periodicity,10),
      }
    };
    sendForm(newProgrammedExpense);
    navigation.navigate('programmedExpense-list');

  };

  const handleBack = async () => {
    navigation.goBack();
  };

  const checkForErrors = () => {
    let nameErr = checkNameError();
    let amountErr = checkAmountError();
    let cuotasErr = checkCuotasError();
    let periodicityErr = checkPeriodicityError();
    return nameErr || amountErr || cuotasErr || periodicityErr;
  };
  
  const checkNameError = () => {
    if (concept === null) {
      setNameError(false);
      return false;
    }
    let regex = /^[A-Za-z\d\s]+$/;
    let isValid = regex.test(concept);
    setNameError(!isValid);
    return !isValid;
  };
  
  const checkAmountError = () => {
    if (amount === null) {
      setAmountError(false);
      return false;
    }
    let regex = /^[\d]{1,12}((\.)(\d){1,2})?$/;
    let isValid = regex.test(amount);
    setAmountError(!isValid);
    return !isValid;
  };
  
  const checkCuotasError = () => {
    if (paymentMethod === 'CASH' && (cuotas === null || cuotas === '')) {
      setCuotasError(false);
      return false;
    }
    let cuotasValue = parseInt(cuotas, 10);
    let isValid = Number.isInteger(cuotasValue) && cuotasValue >= 0 && cuotasValue <= 120;
    setCuotasError(!isValid);
    return !isValid;
  };
  const checkPeriodicityError = () => {
    if (periodicity === null || periodicity === '') {
      setPeriodicityError(false);
      return false;
    }
    let periodicityValue = parseInt(periodicity, 10);
    let isValid = Number.isInteger(periodicityValue) && periodicityValue >= 0 && periodicityValue <= 365;
    setPeriodicityError(!isValid);
    return !isValid;
  };
  const handleCuotasChange = (value) => {
    const numericValue = value === '' ? null : parseInt(value, 10);
    setCuotas(numericValue);
    checkCuotasError();
  };
  
  const handlePeriodicityChange = (value) => {
    // Convert to integer or set to null if empty
    const numericValue = value === '' ? null : parseInt(value, 10);
    setPeriodicity(numericValue);
    checkPeriodicityError();
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
    <ScreenTemplate loading={loading}>
      <ScreenTemplate.Scrollable style={{paddingHorizontal: 15}}>
        <Text style={{
          fontFamily: 'Roboto-Medium',
          fontSize: 28,
          fontWeight: '500',
          color: '#333',
          marginBottom: 30,
          marginTop: 30,
        }}>Program an Expense</Text>

        <ListItem containerStyle={{marginBottom: 20}}>
          <Icon name={iconFactory(selectedProgrammedExpense.iconId)} type="entypo" />
          <ListItem.Content>
            <ListItem.Title>{selectedProgrammedExpense.category}</ListItem.Title>
          </ListItem.Content>
        </ListItem>
        
        <AppInput.Concept
          value={concept}
          onChangeText={setConcept}
          errorMessage={nameHasError? "Concept may only contain letters or numbers" : null}
          onEndEditing={checkNameError}
        />

        <AppInput.Amount
          value={amount}
          onChangeText={setAmount}
          errorMessage={amountHasError? "Amount must be positive and limited to cent precision" : null}
          onEndEditing={checkAmountError}
        />

        <Text style={{ color: 'black' }}>Starting date</Text>
        <AppInput.Date
          value={date}
          onPress={() => setStartDateOpen(true)}
        />
        <DatePicker
          modal
          mode="date"
          open={startDateOpen}
          date={date}
          onConfirm={(selectedDate) => {
            setStartDateOpen(false);
            setStartDate(selectedDate);
          }}
          onCancel={() => {
            setStartDateOpen(false);
          }}
          maximumDate={endDate}
        />
        
        <AppInput.Periodicity 
          value={periodicity}
          onChangeText={handlePeriodicityChange}
          keyboardType="numeric"
          errorMessage={periodicityHasError ? "Periodicity must be between 0 and 365" : null}
          onEndEditing={checkPeriodicityError}
        />

        <Text style={{ color: 'black' }}>Ending date</Text>
        <AppInput.Date
          value={endDate}
          onPress={() => setEndDateOpen(true)}
        />
        
        <DatePicker
          modal
          mode="date"
          open={endDateOpen}
          date={endDate}
          onConfirm={(selectedDate) => {
            setEndDateOpen(false);
            setEndDate(selectedDate);
          }}
          onCancel={() => {
            setEndDateOpen(false);
          }}
          minimumDate={date}
        />

        {/* Payment Method selector */}
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity
            style={[styles.paymentMethodButton, paymentMethod === 'CASH' ? styles.activeCashPaymentMethod : null]}
            onPress={() => setPaymentMethod('CASH')}
          >
            <Text style={styles.paymentMethodButtonText}>CASH</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.paymentMethodButton, paymentMethod === 'CARD' ? styles.activeCardPaymentMethod : null]}
            onPress={() => setPaymentMethod('CARD')}
          >
            <Text style={styles.paymentMethodButtonText}>CARD</Text>
          </TouchableOpacity>
        </View>

        {/* Card and Cuotas fields */}
        <Animated.View style={{ opacity: fadeAnim }}>
          {paymentMethod === 'CARD' && (
            <View>
           <CardDropdown selectedCard={selectedCard} setSelectedCard={setSelectedCard} />

          <Text style={styles.cuotasLabel}>Cuotas</Text>
              <AppInput.Cuotas
                value={cuotas}
                onChangeText={handleCuotasChange}
                keyboardType="numeric"
                errorMessage={cuotasHasError ? "Cuotas must be between 1 and 120" : null}
              />
            </View>
          )}
        </Animated.View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSubmit}>
          <Text style={styles.primaryButtonText}>SUBMIT</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.cancelButton} onPress={handleBack}>
          <Text style={styles.secondaryButtonText}>BACK</Text>
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
    marginBottom: 10,
  },
  activeCashPaymentMethod: {
    backgroundColor: 'lightgreen',
  },
  activeCardPaymentMethod: {
    backgroundColor: 'lightblue',
  },
  paymentMethodButtonText: {
    fontWeight: 'bold',
    color: '#333',
  },
});

export default EditProgrammedExpenseScreen;
