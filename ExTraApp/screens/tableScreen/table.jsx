import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, Alert, ScrollView } from 'react-native';
import { fetchWithTimeout } from '../../utils/fetchingUtils';
import { styles } from './style';
import ExpenseModal from './ExpenseModal'; // Import the ExpenseModal component
import LoadingOverlay from '../../components/loading/loading';

const ExampleData = [
  {id: 1,  concept: 'Example 1',  amount: 10000.00, date: '2023-09-20', category: 'travel', iconId: 1},
  {id: 2,  concept: 'Example 2',  amount: 10000.00, date: '2023-09-20', category: 'travel', iconId: 1},
  {id: 3,  concept: 'Example 3',  amount: 10000.00, date: '2023-09-20', category: 'travel', iconId: 1},
  {id: 4,  concept: 'Example 4',  amount: 10000.00, date: '2023-09-20', category: 'travel', iconId: 1},
  {id: 5,  concept: 'Example 5',  amount: 10000.00, date: '2023-09-20', category: 'travel', iconId: 1},
  {id: 6,  concept: 'Example 6',  amount: 10000.00, date: '2023-09-20', category: 'travel', iconId: 1},
  {id: 7,  concept: 'Example 7',  amount: 10000.00, date: '2023-09-20', category: 'travel', iconId: 1},
  {id: 8,  concept: 'Example 8',  amount: 10000.00, date: '2023-09-20', category: 'travel', iconId: 1},
  {id: 9,  concept: 'Example 9',  amount: 10000.00, date: '2023-09-20', category: 'travel', iconId: 1},
  {id: 10, concept: 'Example 10', amount: 10000.00, date: '2023-09-20', category: 'travel', iconId: 1},
  {id: 11, concept: 'Example 11', amount: 10000.00, date: '2023-09-20', category: 'travel', iconId: 1},
  {id: 12, concept: 'Example 12', amount: 10000.00, date: '2023-09-20', category: 'travel', iconId: 1},
  {id: 13, concept: 'Example 13', amount: 10000.00, date: '2023-09-20', category: 'travel', iconId: 1},
  {id: 14, concept: 'Example 14', amount: 10000.00, date: '2023-09-20', category: 'travel', iconId: 1},
  {id: 15, concept: 'Example 15', amount: 10000.00, date: '2023-09-20', category: 'travel', iconId: 1},
  {id: 16, concept: 'Example 16', amount: 10000.00, date: '2023-09-20', category: 'travel', iconId: 1},
  {id: 17, concept: 'Example 17', amount: 10000.00, date: '2023-09-20', category: 'travel', iconId: 1},
  {id: 18, concept: 'Example 18', amount: 10000.00, date: '2023-09-20', category: 'travel', iconId: 1},
  {id: 19, concept: 'Example 19', amount: 10000.00, date: '2023-09-20', category: 'travel', iconId: 1},
  {id: 20, concept: 'Example 20', amount: 10000.00, date: '2023-09-20', category: 'travel', iconId: 1},
  {id: 21, concept: 'Example 21', amount: 10000.00, date: '2023-09-20', category: 'travel', iconId: 1},
  {id: 22, concept: 'Example 22', amount: 10000.00, date: '2023-09-20', category: 'travel', iconId: 1},
  {id: 23, concept: 'Example 23', amount: 10000.00, date: '2023-09-20', category: 'travel', iconId: 1},
  {id: 24, concept: 'Example 24', amount: 10000.00, date: '2023-09-20', category: 'travel', iconId: 1},
  {id: 25, concept: 'Example 25', amount: 10000.00, date: '2023-09-20', category: 'travel', iconId: 1},
  {id: 26, concept: 'Example 26', amount: 10000.00, date: '2023-09-20', category: 'travel', iconId: 1},
  {id: 27, concept: 'Example 27', amount: 10000.00, date: '2023-09-20', category: 'travel', iconId: 1},
  {id: 28, concept: 'Example 28', amount: 10000.00, date: '2023-09-20', category: 'travel', iconId: 1},
];


const Table = ({navigation}) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const fetchExpensesList = async () => {
    let response = await fetchWithTimeout("http://localhost:8080/getMyExpenses", {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      }
    });
    let responseBody = await response.json();

    // OK
    if(response.ok){
      setExpenses(response);
      return;
    }
    
    // UNAUTHORIZED
    if(response.status == 401){
      Alert.alert(
        "Session Expired", 
        "Please log in again to continue",
        [{text: 'OK', onPress: () => navigation.navigate('Login')}]
      );
      return;
    }

    // OTHER ERROR
    Alert.alert("API Error", responseBody.message);
  };

  const postExpenseToApi = async (newExpense) => {
    let response = await fetchWithTimeout("http://localhost:8080/addExpense", {
      method: 'POST',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'Content-Type':'application/json'
      },
      body: JSON.stringify(newExpense)
    });
    let responseBody = await response.json();

    // OK
    if(response.ok){
      Alert.alert("Success", "Expense added successfully!");
      return;
    }

    // UNAUTHORIZED
    if(response.status == 401){
      Alert.alert(
        "Session Expired", 
        "Please log in again to continue",
        () => navigation.navigate('Login')
      );
      return;
    }

    // OTHER ERROR
    Alert.alert("API Error", responseBody.message);
  };

  const handleSaveExpense = async (newExpense) => {
    toggleModal(); // Close the modal after saving
    try {
      setLoading(true);
      await postExpenseToApi(newExpense);
      await fetchExpensesList();
      setLoading(false);

    } catch (error) {
      setLoading(false);
      Alert.alert("Connection Error", "There was an error connecting to API");
    }
  };

  const handleFocusScreen = async () => {
    await fetchExpensesList();
    setLoading(false);
  };


  React.useEffect(() => {
    try{
      setLoading(true);
      handleFocusScreen();
    } catch (error) {
      setLoading(false);
      Alert.alert("Connection Error", "There was an error connecting to API");
    }
  },[navigation]);

  return (
    <View style={styles.appContainer}>
      <View style={styles.container}>
        <LoadingOverlay 
          shown={loading}
        />
        <View style={styles.logoContainer}>
          <Image style={styles.logo} source={require('./../../img/logo.png')} />
        </View>
        <View style={styles.bottomContainer}>
          <TouchableOpacity style={styles.button} onPress={toggleModal}>
            <Text style={styles.buttonText}>Add Expense</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.tableContainer}>

          <View style={styles.tableHeader}>
            <View style={styles.headerCellContainer}>
              <Text style={styles.headerCell}>Concept</Text>
            </View>
            <View style={styles.headerCellContainer}>
              <Text style={styles.headerCell}>Category</Text>
            </View>
            <View style={styles.headerCellContainer}>
              <Text style={styles.headerCell}>Amount</Text>
            </View>
            <View style={styles.headerCellContainer}>
              <Text style={styles.headerCell}>Date</Text>
            </View>
          </View>

          <ScrollView contentContainerStyle={styles.tableBody}>
            {/* { ! expenses ? expenses.map((item) => ( */}
            { ExampleData? ExampleData.map((item) => (
              <View key={item.id} style={styles.row}>
                <View style={styles.cellContainer}>
                  <Text style={styles.cell}>{item.concept}</Text>
                </View>
                <View style={styles.cellContainer}>
                  <Text style={styles.cell}>{item.category}</Text>
                </View>
                <View style={styles.cellContainer}>
                  <Text style={styles.cell}>{item.amount}</Text>
                </View>
                <View style={styles.cellContainer}>
                  <Text style={styles.cell}>{item.date}</Text>
                </View>
              </View>
            )) : null}
          </ScrollView>
          
        </View>
      </View>
      <ExpenseModal isVisible={isModalVisible} onClose={toggleModal} onSave={handleSaveExpense} />
    </View>
  );
};

export default Table;