import React from 'react';
import { Text, StyleSheet, TouchableOpacity, Alert, View, Animated } from 'react-native';
import { ListItem, Icon } from '@rneui/themed';
import DatePicker from 'react-native-date-picker';
import ScreenTemplate from '../components/ScreenTemplate';
import { AppInput } from '../components/AppInput';
import { useProgrammedExpenseCreationForm } from '../hooks/programmedExpense';
import CardDropdown from '../components/CardDropdown';

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


const AddProgrammedExpenseScreen = ({navigation, route}) => {
  const [concept, setConcept] = React.useState("");
  const [amount, setAmount] = React.useState("");
  const [date, setStartDate] = React.useState(new Date());
  const [endDate, setEndDate] = React.useState(new Date());
  const [paymentMethod, setPaymentMethod] = React.useState("CASH"); // Default to CASH
  const [selectedCard, setSelectedCard] = React.useState("");
  const [cuotas, setCuotas] = React.useState("");
  const [periodicity, setPeriodicity] = React.useState(1);

  
  const [nameHasError, setNameError] = React.useState(false);
  const [amountHasError, setAmountError] = React.useState(false);

  const [startDateOpen, setStartDateOpen] = React.useState(false);
  const [endDateOpen, setEndDateOpen] = React.useState(false);
  
  const { isPending: loading, mutate: sendForm } = useProgrammedExpenseCreationForm();


  const handleSubmit = async () => {
    if(checkForErrors()){
      Alert.alert("Validation error", "Please correct selected fields and try again.");
      return;
    }
    let newProgrammedExpense = {
      concept,
      amount,
      date: date.toISOString().substring(0, 10),
      category: route.params.selectedCategory.category,
      iconId: route.params.selectedCategory.iconId,
      paymentMethod,
      cardId: selectedCard,
      cuotas,
      endDate: endDate.toISOString().substring(0, 10),
      periodicity
    };

    sendForm(newProgrammedExpense);
  };

  const handleBack = async () => {
    navigation.goBack();
  };

  const checkForErrors = () => {
    let nameErr = checkNameError();
    let amountErr = checkAmountError();
    return nameErr || amountErr;
  };

  const checkNameError = () => {
    let regex = /^[A-Za-z\d\s]+$/;
    let isValid = regex.test(concept);
    setNameError(!isValid);
    return !isValid;
  };

  const checkAmountError = () => {
    let regex = /^[\d]{1,12}((\.)(\d){1,2})?$/;
    let isValid = regex.test(amount);
    setAmountError(!isValid);
    return !isValid;
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
          <Icon name={iconFactory(route.params.selectedCategory.iconId)} type="entypo" />
          <ListItem.Content>
            <ListItem.Title>{route.params.selectedCategory.category}</ListItem.Title>
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
                        onChangeText={setPeriodicity}
                        keyboardType="numeric"
                        errorMessage={cuotas && (parseInt(periodicity) < 1 || parseInt(periodicity) > 365) ? "Periodicity must be between 0 and 365" : null} />
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
                onChangeText={setCuotas}
                keyboardType="numeric"
                errorMessage={cuotas && (parseInt(cuotas) < 1 || parseInt(cuotas) > 120) ? "Cuotas must be between 1 and 120" : null}
              />
            </View>
          )}
        </Animated.View>

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

export default AddProgrammedExpenseScreen;
