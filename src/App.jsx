import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import ResetPasswordScreen from './screens/ResetPasswordScreen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { AuthenticationProvider } from './context/AuthenticationProvider';
import { DrawerNavigation } from './navigation/DrawerNavigation';
import messaging from '@react-native-firebase/messaging';
import { useEffect } from 'react';

const Stack = createStackNavigator();
const queryClient = new QueryClient();
const linking = {
  prefixes: [
    "extra://"
  ],
  config: {
    screens: {
      "reset-password": "reset-password/:token"
    }
  }
}; 


const App = () => {

  async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
  
    if (enabled) {
      console.log('Authorization status:', authStatus);
    }
  }
  
  const getToken = async () => {
    const token = await messaging().getToken();
    console.log('Token:', token);
  }
  useEffect(() => {
    requestUserPermission();
    getToken();
  }, []);

  return (
    <AuthenticationProvider>
    <QueryClientProvider client={queryClient}>
    <SafeAreaProvider>

    <NavigationContainer linking={linking}>
      <Stack.Navigator initialRouteName='drawer'>
        <Stack.Screen 
          name="drawer"
          component={DrawerNavigation}
          options={{headerShown: false}}
        />
        <Stack.Screen 
          name="reset-password"
          component={ResetPasswordScreen}
          options={{
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>

    </SafeAreaProvider>
    </QueryClientProvider>
    </AuthenticationProvider>
  );
};

export default App;
