import React from "react";
import { Text } from "react-native";
import ScreenTemplate from "../components/ScreenTemplate";
import BackButton from "../components/BackButton";
import ProgrammedExpenseList from "../components/ProgrammedExpenseList";

const ProgrammedExpensesScreen = ({ navigation, route }) => {

  const handleProgrammedExpenseSelection = (expense) => {
    navigation.navigate("programmed-expense-info", {
      selectedProgrammedExpense: expense
    });
  };

  const handleAddProgrammedExpense = () => {
    navigation.navigate("programmed-expense-add");
  };

  return (
    <ScreenTemplate >
      <ScreenTemplate.Logo />

      <ScreenTemplate.Content style={{ paddingHorizontal: 15 }}>

        <Text style={{
          fontFamily: 'Roboto-Medium',
          fontSize: 28,
          fontWeight: '500',
          color: '#333',
          marginBottom: 30,
          marginTop: 30,
        }}>Programmed Expenses</Text>

        <ProgrammedExpenseList 
          onAdd={handleAddProgrammedExpense}
          onSelection={handleProgrammedExpenseSelection}
        />

        <BackButton />

      </ScreenTemplate.Content>
    </ScreenTemplate>
  );
};

export default ProgrammedExpensesScreen;
