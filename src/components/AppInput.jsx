import React from "react";
import { Input } from "@rneui/themed";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';

const AppInput = () => {

};

const EmailInput = (props) => {

  return(
    <Input 
      value={props.value}
      onChangeText={props.onChangeText}
      placeholder={props.placeholder || 'Email'}
      containerStyle={{
        width: '100%',
        paddingHorizontal: 0,
      }}
      inputContainerStyle={{
        borderBottomColor: '#ccc',
        borderBottomWidth: 1,
        height: 35,
      }}
      inputStyle={{
        fontSize: 15,
      }}
      leftIcon={
        <MaterialIcons
          name="alternate-email"
          size={20}
          color="#666"
          style={{marginRight: 5}}
        />
      }
      placeholderTextColor={"#c4c4c4"}
      keyboardType='email-address'
      errorMessage={props.errorMessage}
      maxLength={320}
      onEndEditing={props.onEndEditing}
    />
  );
};
AppInput.Email = EmailInput;

const SecureInput = (props) => {
  const [pass_visible, set_pass_visible] = React.useState(false);

  return (
    <Input 
      label={props.label}
      value={props.value}
      onChangeText={props.onChangeText}
      placeholder={props.placeholder || 'Password'}
      containerStyle={{
        width: '100%',
        paddingHorizontal: 0,
      }}
      inputContainerStyle={{
        borderBottomColor: '#ccc',
        borderBottomWidth: 1,
        height: 35,
      }}
      inputStyle={{
        fontSize: 15,
      }}
      placeholderTextColor={"#c4c4c4"}
      leftIcon={
        <Ionicons
          name="lock-closed-outline"
          size={20}
          color="#666"
          style={{marginRight: 5}}
        />
      }
      rightIcon={
        <Ionicons
          name={pass_visible? "eye-off-outline": "eye-outline"}
          size={20}
          color="#666"
          style={{marginRight: 5}}
          onPress={() => set_pass_visible(!pass_visible)}
        />
      }
      secureTextEntry={!pass_visible}
      errorMessage={props.errorMessage}
      maxLength={50}
      onEndEditing={props.onEndEditing}
    />
  );
};
AppInput.Secure = SecureInput;

const NameInput = (props) => {
  return(
    <Input 
      value={props.value}
      onChangeText={props.onChangeText}
      placeholder={props.placeholder || 'Name'}
      containerStyle={{
        width: '100%',
        paddingHorizontal: 0,
      }}
      inputContainerStyle={{
        borderBottomColor: '#ccc',
        borderBottomWidth: 1,
        height: 35,
      }}
      inputStyle={{
        fontSize: 15,
      }}
      leftIcon={
        <MaterialIcons
          name="person-outline"
          size={20}
          color="#666"
          style={{marginRight: 5}}
        />
      }
      placeholderTextColor={"#c4c4c4"}
      errorMessage={props.errorMessage}
      maxLength={99}
      onEndEditing={props.onEndEditing}
    />
  );
};
AppInput.Name = NameInput;


const ConceptInput = (props) => {
  return(
    <Input 
      value={props.value}
      onChangeText={props.onChangeText}
      placeholder={props.placeholder || 'Concept'}
      containerStyle={{
        width: '100%',
        paddingHorizontal: 0,
      }}
      inputContainerStyle={{
        borderBottomColor: '#ccc',
        borderBottomWidth: 1,
        height: 35,
      }}
      inputStyle={{
        fontSize: 15,
      }}
      leftIcon={
        <MaterialIcons
          name="person-outline"
          size={20}
          color="#666"
          style={{marginRight: 5}}
        />
      }
      placeholderTextColor={"#c4c4c4"}
      errorMessage={props.errorMessage}
      maxLength={99}
      onEndEditing={props.onEndEditing}
    />
  );
};
AppInput.Concept = ConceptInput;

const AmountInput = (props) => {
  return(
    <Input 
      value={props.value}
      onChangeText={props.onChangeText}
      placeholder={props.placeholder || 'Amount'}
      containerStyle={{
        width: '100%',
        paddingHorizontal: 0,
      }}
      inputContainerStyle={{
        borderBottomColor: '#ccc',
        borderBottomWidth: 1,
        height: 35,
      }}
      inputStyle={{
        fontSize: 15,
      }}
      leftIcon={
        <MaterialIcons
          name="attach-money"
          size={20}
          color="#666"
          style={{marginRight: 5}}
        />
      }
      placeholderTextColor={"#c4c4c4"}
      errorMessage={props.errorMessage}
      maxLength={12}
      onEndEditing={props.onEndEditing}
      keyboardType="decimal-pad"
    />
  );
};
AppInput.Amount = AmountInput;

const CuotasInput = (props) => {
  return(
    <Input 
      value={props.value}
      onChangeText={props.onChangeText}
      placeholder={props.placeholder || 'Cuotas'}
      containerStyle={{
        width: '100%',
        paddingHorizontal: 0,
      }}
      inputContainerStyle={{
        borderBottomColor: '#ccc',
        borderBottomWidth: 1,
        height: 35,
      }}
      inputStyle={{
        fontSize: 15,
      }}
      leftIcon={
        <MaterialIcons
          name="credit-score"
          size={20}
          color="#666"
          style={{marginRight: 5}}
        />
      }
      placeholderTextColor={"#c4c4c4"}
      errorMessage={props.errorMessage}
      maxLength={12}
      onEndEditing={props.onEndEditing}
      keyboardType="decimal-pad"
    />
  );
};
AppInput.Cuotas = CuotasInput;

const DateInput = props => {
  return(
    <Input 
      value={props.value.toLocaleDateString('es-AR')}
      placeholder={props.placeholder || 'DD-MM-YYYY'}
      onPressOut={props.onPress}
      containerStyle={{
        width: '100%',
        paddingHorizontal: 0,
      }}
      inputContainerStyle={{
        borderBottomColor: '#ccc',
        borderBottomWidth: 1,
        height: 35,
      }}
      inputStyle={{
        fontSize: 15,
      }}
      leftIcon={
        <MaterialIcons
          name="calendar-today"
          size={20}
          color="#666"
          style={{marginRight: 5}}
        />
      }
      rightIcon={
        <MaterialIcons
          name="edit-calendar"
          size={20}
          color="#E86DC3"
          style={{marginLeft: 5}}
          onPress={props.onPress}
        />
      }
      placeholderTextColor={"#c4c4c4"}
      disabled={true}
      keyboardType="decimal-pad"
    />
  );
};
AppInput.Date = DateInput;

const CategoryInput = props => {
  return(
    <Input 
      value={props.value}
      onChangeText={props.onChangeText}
      placeholder={props.placeholder || 'Category'}
      containerStyle={{
        width: '100%',
        paddingHorizontal: 0,
      }}
      inputContainerStyle={{
        borderBottomColor: '#ccc',
        borderBottomWidth: 1,
        height: 35,
      }}
      inputStyle={{
        fontSize: 15,
      }}
      leftIcon={
        <MaterialIcons
          name="category"
          size={20}
          color="#666"
          style={{marginRight: 5}}
        />
      }
      rightIcon={props.rightIcon}
      placeholderTextColor={"#c4c4c4"}
      errorMessage={props.errorMessage}
      maxLength={49}
      onEndEditing={props.onEndEditing}
    />
  );
};
AppInput.Category = CategoryInput;

const BudgetNameInput = props => {
  return(
    <Input 
      value={props.value}
      onChangeText={props.onChangeText}
      placeholder={props.placeholder || 'Budget name'}
      containerStyle={{
        width: '100%',
        paddingHorizontal: 0,
      }}
      inputContainerStyle={{
        borderBottomColor: '#ccc',
        borderBottomWidth: 1,
        height: 35,
      }}
      inputStyle={{
        fontSize: 15,
      }}
      leftIcon={
        <MaterialIcons
          name="category"
          size={20}
          color="#666"
          style={{marginRight: 5}}
        />
      }
      rightIcon={props.rightIcon}
      placeholderTextColor={"#c4c4c4"}
      errorMessage={props.errorMessage}
      maxLength={49}
      onEndEditing={props.onEndEditing}
    />
  );
};
AppInput.Budget = BudgetNameInput;

const CardNameInput = (props) => {
  return (
    <Input 
      value={props.value}
      onChangeText={props.onChangeText}
      placeholder={props.placeholder || 'Card Name'}
      containerStyle={{
        width: '100%',
        paddingHorizontal: 0,
      }}
      inputContainerStyle={{
        borderBottomColor: '#ccc',
        borderBottomWidth: 1,
        height: 35,
      }}
      inputStyle={{
        fontSize: 15,
      }}
      leftIcon={
        <MaterialIcons
          name="credit-card"
          size={20}
          color="#666"
          style={{marginRight: 5}}
        />
      }
      placeholderTextColor={"#c4c4c4"}
      errorMessage={props.errorMessage}
      maxLength={50}
      onEndEditing={props.onEndEditing}
    />
  );
};
AppInput.CardName = CardNameInput;

const LimitInput = (props) => {
  return (
    <Input 
      value={props.value}
      onChangeText={props.onChangeText}
      placeholder={props.placeholder || 'Limit'}
      containerStyle={{
        width: '100%',
        paddingHorizontal: 0,
      }}
      inputContainerStyle={{
        borderBottomColor: '#ccc',
        borderBottomWidth: 1,
        height: 35,
      }}
      inputStyle={{
        fontSize: 15,
      }}
      leftIcon={
        <MaterialIcons
          name="attach-money"
          size={20}
          color="#666"
          style={{marginRight: 5}}
        />
      }
      placeholderTextColor={"#c4c4c4"}
      errorMessage={props.errorMessage}
      maxLength={12}
      keyboardType="decimal-pad"
      onEndEditing={props.onEndEditing}
    />
  );
};
AppInput.Limit = LimitInput;


const PeriodicityInput = (props) => {
  return(
    <Input 
      value={props.value}
      onChangeText={props.onChangeText}
      placeholder={props.placeholder || 'Periodicity'}
      containerStyle={{
        width: '100%',
        paddingHorizontal: 0,
      }}
      inputContainerStyle={{
        borderBottomColor: '#ccc',
        borderBottomWidth: 1,
        height: 35,
      }}
      inputStyle={{
        fontSize: 15,
      }}
      leftIcon={
        <MaterialIcons
          name="today"
          size={20}
          color="#666"
          style={{marginRight: 5}}
        />
      }
      placeholderTextColor={"#c4c4c4"}
      errorMessage={props.errorMessage}
      maxLength={12}
      onEndEditing={props.onEndEditing}
      keyboardType="decimal-pad"
    />
  );
};
AppInput.Periodicity = PeriodicityInput;

export { AppInput };
