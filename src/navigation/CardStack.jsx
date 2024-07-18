import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import CardScreen from '../screens/CardScreen';
import AddCardScreen from '../screens/AddCardScreen';
import CardInfoScreen from '../screens/CardInfoScreen';
import EditCardScreen from '../screens/EditCardScreen';

const Stack = createStackNavigator();

const CardStack = (props) => {
  return (
    <Stack.Navigator initialRouteName='card-list'>
      <Stack.Screen 
        name='card-list'
        component={CardScreen}
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen 
        name='card-add'
        component={AddCardScreen}
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen
        name='card-info'
        component={CardInfoScreen}
        options={{
          headerShown: false
        }}
    />
    <Stack.Screen
        name='card-edit'
        component={EditCardScreen}
        options={{
          headerShown: false
        }}
    />
    </Stack.Navigator>
  );
};
export default CardStack;
