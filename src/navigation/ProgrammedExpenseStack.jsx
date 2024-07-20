import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import ProgrammedExpensesScreen from '../screens/ProgrammedExpensesScreen';
import AddProgrammedExpenseScreen from '../screens/AddProgrammedExpenseScreen';
import ProgrammedExpenseInfoScreen from '../screens/ProgrammedExpenseInfoScreen';
import CategorySelectionScreen from '../screens/CategorySelectionScreen';
import NewCategoryScreen from '../screens/NewCategoryScreen';
import EditProgrammedExpenseScreen from '../screens/EditProgrammedExpenseScreen'; 

const Stack = createStackNavigator();

const ProgrammedExpenseStack = (props) => {
  return (
    <Stack.Navigator initialRouteName='ProgrammedExpense-list'>
      <Stack.Screen 
        name='programmedExpense-list'
        component={ProgrammedExpensesScreen}
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen 
        name='programmedExpense-add'
        component={AddProgrammedExpenseScreen}
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen 
        name='programmedExpense-info'
        component={ProgrammedExpenseInfoScreen}
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen 
        name="edit-programmedExpense-screen" 
        component={EditProgrammedExpenseScreen}
        options={{
          headerShown: false
        }}
      />
        <Stack.Screen 
        name="edit-programmedExpense-screen/category-list"
        component={CategorySelectionScreen}
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen
        name="edit-programmedExpense-screen/category-add"
        component={NewCategoryScreen}
        options={{
          headerShown: false
        }}
      />
        <Stack.Screen 
        name="programmedExpense-add/categories-list"
        component={CategorySelectionScreen}
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen 
        name="programmedExpense-add/categories-add"
        component={NewCategoryScreen}
        options={{
          headerShown: false
        }}
      />
    </Stack.Navigator>
    
  );
};

export default ProgrammedExpenseStack;
