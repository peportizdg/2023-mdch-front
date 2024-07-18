import React from "react";
import ScreenTemplate from "../components/ScreenTemplate";
import { Text, TouchableOpacity, StyleSheet, Alert } from "react-native";

import { AppInput } from "../components/AppInput";
import { Icon } from "@rneui/themed";
import { Picker } from "../components/Picker";

const NewCategoryScreen = ({navigation, route}) => {
  const [categoryName, setCategoryName] = React.useState("");
  const [custIcon, setCustIcon] = React.useState({value: 0, iconName: 'credit', iconType: 'entypo'});
  const [isIconPickerVisible, setIconPickerVisible] = React.useState(false);
  const [nameHasError, setNameError] = React.useState(false);

  const handleCreate = () => {
    if(checkCustomCategoryError()){
      Alert.alert("Validation error", "Please correct selected fields and try again.");
      return;
    }
    const targetScreen = route.name.split("/")[0];

    navigation.navigate(targetScreen, {
      selectedCategory: {
        category: categoryName,
        iconId: custIcon.value
      },
      selectedItem: route.params?.selectedItem
    });
  }

  const handleBack = () => {
    navigation.goBack();
  };

  const checkCustomCategoryError = () => {
    let regex = /^[A-Za-z\d\s]+$/;
    let isValid = regex.test(categoryName);
    setNameError(!isValid);
    return !isValid;
  };

  return (
    <ScreenTemplate>
      <ScreenTemplate.Content style={{paddingHorizontal: 15}}>
        <Text style={{
          fontFamily: 'Roboto-Medium',
          fontSize: 28,
          fontWeight: '500',
          color: '#333',
          marginBottom: 30,
          marginTop: 30,
        }}>Create new Category</Text>
        
        <Text>Name</Text>
        <AppInput.Category
          value={categoryName}
          onChangeText={setCategoryName}
          errorMessage={nameHasError? "Concept may only contain letters or numbers" : null}
          onEndEditing={checkCustomCategoryError}
          rightIcon={
            <Icon
              name={custIcon.iconName}
              type={custIcon.iconType}
              size={24}
              color='black'
              onPress={() => setIconPickerVisible(true)}
            />
          }
        />

        <Picker.Icon 
          visible={isIconPickerVisible}
          value={custIcon}
          onChange={setCustIcon}
          onDone={() => setIconPickerVisible(false)}
          onCancel={() => setIconPickerVisible(false)}
        />

        <TouchableOpacity style={styles.saveButton} onPress={handleCreate}>
          <Text style={styles.saveButtonText}>Create</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.cancelButton} onPress={handleBack}>
          <Text style={styles.cancelButtonText}>Back</Text>
        </TouchableOpacity>
        
      </ScreenTemplate.Content>

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
});


export default NewCategoryScreen;
