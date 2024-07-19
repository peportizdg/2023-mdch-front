import React from "react";
import { Text, TouchableOpacity, Alert } from "react-native";
import ScreenTemplate from "../components/ScreenTemplate";
import { ListItem, Icon } from "@rneui/themed";
import { ProgressChart } from "react-native-chart-kit";
import { ScrollView } from "react-native";
import { useDeleteProgrammedExpense } from "../hooks/programmedExpense";


const ProgrammedExpenseInfoScreen = ({ navigation, route }) => {
  const { selectedProgrammedExpense } = route.params;
  const { mutate: deleteProgrammedExpense } = useDeleteProgrammedExpense();

  const handleEditProgrammedExpense = () => {
    navigation.navigate("edit-programmedExpense-screen", {
      selectedProgrammedExpense
    });
  };

  const handleDelete = () => {const handleEditProgrammedExpense = (item) => {
    navigation.navigate("Edit ProgrammedExpense Modal", {
      screen: "edit-programmedExpense-modal",
      params: {
      },
    });
  };
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
          <Text
            style={{
              fontFamily: "Roboto-Medium",
              fontSize: 28,
              fontWeight: "500",
              color: "#333",
              marginBottom: 30,
              marginTop: 30,
            }}
          >
            {selectedProgrammedExpense.name}
          </Text>

          <Text
              style={{
                color: "black",
                fontSize: 16,
                fontWeight: "bold",
              }}
            >Category</Text>
          <ListItem>
            <Icon name={iconFactory(selectedProgrammedExpense.iconId)} type="entypo" />
            <ListItem.Content>
              <ListItem.Title>{selectedProgrammedExpense.category}</ListItem.Title>
            </ListItem.Content>
          </ListItem>

          <Text
              style={{
                color: "black",
                fontSize: 16,
                fontWeight: "bold",
              }}
            >Starting Date</Text>
          <ListItem>
            <Icon name="arrow-expand-right" type="material-community" />
            <ListItem.Content>
              <ListItem.Title>{selectedProgrammedExpense.creationDate}</ListItem.Title>
            </ListItem.Content>
          </ListItem>

          <Text
              style={{
                color: "black",
                fontSize: 16,
                fontWeight: "bold",
              }}
            >Ending date</Text>
          <ListItem>
            <Icon name="arrow-expand-left" type="material-community" />
            <ListItem.Content>
              <ListItem.Title>{selectedProgrammedExpense.limitDate}</ListItem.Title>
            </ListItem.Content>
          </ListItem>

          <Text
              style={{
                color: "black",
                fontSize: 16,
                fontWeight: "bold",
              }}
            >Programmed Expense Amount</Text>
          <ListItem>
            <Icon name="credit" type="entypo" />
            <ListItem.Content>
              <ListItem.Title>{selectedProgrammedExpense.limitAmount}</ListItem.Title>
            </ListItem.Content>
          </ListItem>

          <Text
              style={{
                color: "black",
                fontSize: 16,
                fontWeight: "bold",
              }}
            >Amount spent so far</Text>
          <ListItem>
            <Icon name="credit" type="entypo" />
            <ListItem.Content>
              <ListItem.Title>{selectedProgrammedExpense.currentAmount}</ListItem.Title>
            </ListItem.Content>
          </ListItem>

          <ProgressChart
            data={{
              labels: ["Spent"], // optional
              data: [
                parseFloat(selectedProgrammedExpense.currentAmount) /
                  parseFloat(selectedProgrammedExpense.limitAmount),
              ],
            }}
            width={330}
            height={150}
            radius={50}
            chartConfig={{
              color: (opacity = 1) => `rgba(232, 109, 195, ${opacity})`,
              backgroundGradientFrom: "#ffffff",
              backgroundGradientTo: "#ffffff",
            }}
            hideLegend={true}
          />

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
              marginTop: 10,
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

export default ProgrammedExpenseInfoScreen;
