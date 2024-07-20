import React from 'react';
import { Text, StyleSheet, TouchableOpacity, Alert, View, Animated } from 'react-native';
import { ListItem, Icon } from '@rneui/themed';
import DatePicker from 'react-native-date-picker';
import CardDropdown from '../components/CardDropdown';
import ScreenTemplate from '../components/ScreenTemplate';
import { AppInput } from '../components/AppInput';
import BudgetFilledMeter from '../components/BudgetFilledMeter';
import { useExpenseEditionForm } from '../hooks/expenses';
import { useActiveBudgetByDateAndCategory } from '../hooks/budgets';

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


const ModifyExpenseScreen = ({navigation, route}) => {
  const [concept, setConcept] = React.useState(route.params?.selectedItem?.concept || "");
  const [amount, setAmount] = React.useState(route.params?.selectedItem?.amount?.toString() || "");
  const [date, setDate] = React.useState(new Date(route.params?.selectedItem?.date) || new Date());
  const [paymentMethod, setPaymentMethod] = React.useState(route.params?.selectedItem?.paymentMethod || "CASH"); 
  const [selectedCard, setSelectedCard] = React.useState(route.params?.selectedItem?.cardId || "");
  const [cuotas, setCuotas] = React.useState(route.params?.selectedItem?.cuotas || "");

  const [dateModalOpen, setDateModalOpen] = React.useState(false);
  const [conceptHasError, setConceptError] = React.useState(false);
  const [amountHasError, setAmountError] = React.useState(false);
  
  const { isPending: isPendingActiveBudgets, data: activeBudget } = useActiveBudgetByDateAndCategory(date, route.params.selectedCategory.category);
  const { isPending: isPendingForm, mutate: sendForm } = useExpenseEditionForm();
  const loading = isPendingActiveBudgets || isPendingForm;

  const handleSubmit = async () => {
    if(checkForErrors()){
      Alert.alert("Validation error", "Please correct selected fields and try again.");
      return;
    }
    let editedExpense = {
      expenseId: route.params.selectedItem.id,
      request: {
        concept,
        amount,
        date: date.toISOString().substring(0, 10),
        category: route.params.selectedCategory.category,
        iconId: route.params.selectedCategory.iconId,
        paymentMethod,
        cardId: selectedCard,
        cuotas,
      }
    };

  
    console.log('Edited Expense:', editedExpense);
  
    sendForm(editedExpense);
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
      <ScreenTemplate.Content style={{paddingHorizontal: 15}}>
        <Text style={{
          fontFamily: 'Roboto-Medium',
          fontSize: 28,
          fontWeight: '500',
          color: '#333',
          marginBottom: 30,
          marginTop: 30,
        }}>Modify Expense</Text>

        <Text>Category</Text>
        <ListItem containerStyle={{marginBottom: 20}}>
          <Icon name={iconFactory(route.params.selectedCategory.iconId)} type="entypo" />
          <ListItem.Content>
            <ListItem.Title>{route.params.selectedCategory.category}</ListItem.Title>
          </ListItem.Content>
        </ListItem>
        
        <Text>Name</Text>
        <AppInput.Concept
          value={concept}
          onChangeText={setConcept}
          errorMessage={conceptHasError? "Concept may only contain letters or numbers" : null}
          onEndEditing={checkConceptError}
        />

        <Text>Amount</Text>
        <AppInput.Amount
          value={amount}
          onChangeText={setAmount}
          errorMessage={amountHasError? "Amount must be positive and limited to cent precision" : null}
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
        <Text>Payment Method</Text>
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

        {activeBudget? (
          <BudgetFilledMeter 
            name={activeBudget.name}
            startFilled={activeBudget.currentAmount}
            limit={activeBudget.limitAmount}
            add={amount}
          />
        ) : null}

        <TouchableOpacity style={styles.saveButton} onPress={handleSubmit}>
          <Text style={styles.saveButtonText}>Modify</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.cancelButton} onPress={handleBack}>
          <Text style={styles.cancelButtonText}>Back</Text>
        </TouchableOpacity>
        
      </ScreenTemplate.Content>

    </ScreenTemplate>
  );
};

const styles = StyleSheet.create({
  header: {
    fontFamily: 'Roboto-Medium',
    fontSize: 28,
    fontWeight: '500',
    color: '#333',
    marginBottom: 30,
    marginTop: 18,
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
  cuotasLabel: {
    fontSize: 14,
    color: 'black',
    marginBottom: 5,
  },
});

export default ModifyExpenseScreen;
