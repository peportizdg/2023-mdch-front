import React from 'react';
import { View, Text, TouchableOpacity, Image, Alert } from 'react-native';
import { styles } from './style';
import { TextInput, HelperText } from 'react-native-paper';
import LoadingOverlay from '../../components/loading/loading';
import * as EmailValidator from 'email-validator';
import ValidatedTextInput from '../../components/validatedTextInput/validatedTextInput';

const ForgottenPassword = ({ navigation, route }) => {
  const [email, setEmail] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const navigateToSignUp = () => {
    navigation.navigate('SignUp'); // Navigate to the 'SignUp' screen
  };

  const navigateToLogin = () => {
    navigation.navigate('Login');
  };

  const postForgottenPasswordFormToApi = async () => {
    if(formHasErrors()){
      Alert.alert('Invalid Fields', "One or more required fields are invalid. Please correct these errors and try again.");
      return;
    }

    setLoading(true);
    let response = await fetch("http://localhost:8080/auth/forgotten", {
      method: 'POST',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'Content-Type':'application/json',
      },
      body: JSON.stringify({
        email: email
      })
    });
    setLoading(false);

    if(response.ok){
      navigateToLogin();
    }
  };

  const formHasErrors = () => {
    return emailHasErrors(email);
  }

  const emailHasErrors = (emailInput) => {
    return !EmailValidator.validate(emailInput);
  };

  return (
    <View style={styles.appContainer}>
      <View style={styles.container}>
        <LoadingOverlay 
          shown={loading}
        />

        <View style={styles.logoContainer}>
          <Image style={styles.logo} source={require('./../../img/logo.png')} />
        </View>

        <View style={styles.bottomContainer}></View>

        <View>
          <ValidatedTextInput 
            label="Email"
            value={email}
            onChangeText={setEmail}
            hasError={emailHasErrors}
            validationErrorMessage="Email address is invalid"
          />

          <TouchableOpacity style={styles.button} onPress={postForgottenPasswordFormToApi}>
            <Text style={styles.buttonText}>Confirm</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={navigateToLogin}>
            <Text style={{ textAlign: 'center' }}>Back to login</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={navigateToSignUp}>
            <Text style={{ textAlign: 'center' }}>Don't have an account? Sign up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default ForgottenPassword;