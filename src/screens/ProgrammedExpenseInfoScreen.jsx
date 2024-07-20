import React from "react";
import { Icon } from "@rneui/themed";
import { Text, TouchableOpacity, Alert , StyleSheet, View} from "react-native";
import ScreenTemplate from "../components/ScreenTemplate";
import { ScrollView } from "react-native";
import { useDeleteProgrammedExpense } from "../hooks/programmedExpense";

const iconFactory = (id) => {
  switch (id) {
    case 1:
      return "aircraft";
    case 2:
      return "drink";
    case 3:
      return "key";
    case 4:
      return "shopping-cart";
    case 5:
      return "clapperboard";
    case 6:
      return "squared-plus";
    case 7:
      return "man";
    case 8:
      return "open-book";
    default:
      return "credit";
  }
};

const ProgrammedExpenseInfoScreen = ({ navigation, route }) => {
  const { selectedProgrammedExpense } = route.params;
  const { mutate: deleteProgrammedExpense } = useDeleteProgrammedExpense();

  const handleEditProgrammedExpense = () => {
    navigation.navigate("edit-programmedExpense-screen", {selectedProgrammedExpense});
  };

  const handleDelete = () => {
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this programmedExpense?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: () => {
            deleteProgrammedExpense(route.params.selectedProgrammedExpense.id, {
              onSuccess: () => {
                navigation.goBack();
              },
              onError: (error) => {
                // Log the error for debugging purposes
                console.error("Error deleting programmed Expense:", error);
              }
            });
          },
          style: "destructive",
        },
      ]
    );
  };

  return (
    <ScreenTemplate>
      <ScreenTemplate.Content style={{ paddingHorizontal: 15 }}>
        <ScrollView>
        <Text style={styles.title}>Programmed Expense: </Text>
          <Text style={styles.titleValue}>{selectedProgrammedExpense.concept}</Text>

          <View style={styles.infoContainer}>
            <Icon name="money" type="font-awesome" style={styles.icon} />
            <Text style={styles.label}>   Amount:</Text>
            <Text style={styles.value}>{selectedProgrammedExpense.amount}</Text>
          </View>

          <View style={styles.infoContainer}>
            <Icon name="calendar" type="font-awesome" style={styles.icon} />
            <Text style={styles.label}>   Date:</Text>
            <Text style={styles.value}>{selectedProgrammedExpense.date}</Text>
          </View>

          <View style={styles.infoContainer}>
            <Icon name="folder" type="font-awesome" style={styles.icon} />
            <Text style={styles.label}>   Category:</Text>
            <Icon name={iconFactory(selectedProgrammedExpense.iconId)} type="entypo" />
            <Text style={styles.value}>{selectedProgrammedExpense.category}</Text>
          </View>

          <View style={styles.infoContainer}>
            <Icon name="credit-card" type="font-awesome" style={styles.icon} />
            <Text style={styles.label}>   Payment Method:</Text>
            <Text style={styles.value}>{selectedProgrammedExpense.paymentMethod}</Text>
          </View>

          <View style={styles.infoContainer}>
            <Icon name="repeat" type="font-awesome" style={styles.icon} />
            <Text style={styles.label}>   Periodicity:</Text>
            <Text style={styles.value}>{selectedProgrammedExpense.periodicity} days</Text>
          </View>

          <View style={styles.infoContainer}>
            <Icon name="calendar" type="font-awesome" style={styles.icon} />
            <Text style={styles.label}>   End Date:</Text>
            <Text style={styles.value}>{selectedProgrammedExpense.endDate}</Text>
</View>

          <TouchableOpacity
            style={{
              backgroundColor: "red",
              borderRadius: 5,
              padding: 10,
              alignItems: "center",
              marginTop: 10,
            }}
            onPress={handleDelete}
          >
            <Text
              style={{
                color: "white",
                fontSize: 16,
                fontWeight: "bold",
              }}
            >
              Delete Programmed Expense
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              backgroundColor: "#E86DC3",
              borderRadius: 5,
              padding: 10,
              alignItems: "center",
              marginTop: 5,
            }}
            onPress={handleEditProgrammedExpense}
          
          >
            <Text
              style={{
                color: "white",
                fontSize: 16,
                fontWeight: "bold",
              }}
            >
              Edit Programmed Expense
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              backgroundColor: "grey",
              borderRadius: 5,
              padding: 10,
              alignItems: "center",
              marginTop: 10,
            }}
            onPress={() => navigation.goBack()}
          >
            <Text
              style={{
                color: "white",
                fontSize: 16,
                fontWeight: "bold",
              }}
            >
              Back
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </ScreenTemplate.Content>
    </ScreenTemplate>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  title: {
    fontFamily: 'Roboto-Medium',
    fontSize: 28,
    fontWeight: '500',
    color: 'black',
    marginTop: 40,
    textAlign: 'center',
  },
  titleValue: {
    fontFamily: 'Roboto-Bold', // Set to bold font
    fontSize: 28,
    color: '#E86DC3',
    textAlign: 'center',
    textDecorationLine: 'underline', // Add underline
  },
  infoContainer: {
    marginTop: 20,
    flexDirection: 'row',
    marginBottom: 30,
  },
  label: {
    fontFamily: 'Roboto-Medium',
    fontSize: 18,
    fontWeight: '500',
    color: 'gray',
    flex: 1,
  },
  value: {
    fontFamily: 'Roboto-Regular',
    fontSize: 18,
    color: 'black',
    flex: 2,
  },
});
export default ProgrammedExpenseInfoScreen;
