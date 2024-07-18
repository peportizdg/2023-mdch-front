import React from "react";
import { Text, TouchableOpacity, Alert } from "react-native";
import ScreenTemplate from "../components/ScreenTemplate";
import { ListItem, Icon } from "@rneui/themed";
import { ProgressChart } from "react-native-chart-kit";
import { ScrollView } from "react-native";
import { useDeleteBudget } from "../hooks/budgets";

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

const BudgetInfoScreen = ({ navigation, route }) => {
  const { selectedBudget } = route.params;
  const { mutate: deleteBudget } = useDeleteBudget();

  const handleEditBudget = () => {
    navigation.navigate("edit-budget-screen", {
      selectedBudget
    });
  };

  const handleDelete = () => {const handleEditBudget = (item) => {
    navigation.navigate("Edit Budget Modal", {
      screen: "edit-budget-modal",
      params: {
      },
    });
  };
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this budget?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: () => {
            deleteBudget(route.params.selectedBudget.id, {
              onSuccess: () => {
                navigation.goBack();
              },
              onError: (error) => {
                // Log the error for debugging purposes
                console.error("Error deleting budget:", error);
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
            {selectedBudget.name}
          </Text>

          <Text
              style={{
                color: "black",
                fontSize: 16,
                fontWeight: "bold",
              }}
            >Category</Text>
          <ListItem>
            <Icon name={iconFactory(selectedBudget.iconId)} type="entypo" />
            <ListItem.Content>
              <ListItem.Title>{selectedBudget.category}</ListItem.Title>
            </ListItem.Content>
          </ListItem>

          <Text
              style={{
                color: "black",
                fontSize: 16,
                fontWeight: "bold",
              }}
            >Starting date</Text>
          <ListItem>
            <Icon name="arrow-expand-right" type="material-community" />
            <ListItem.Content>
              <ListItem.Title>{selectedBudget.creationDate}</ListItem.Title>
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
              <ListItem.Title>{selectedBudget.limitDate}</ListItem.Title>
            </ListItem.Content>
          </ListItem>

          <Text
              style={{
                color: "black",
                fontSize: 16,
                fontWeight: "bold",
              }}
            >Budget amount</Text>
          <ListItem>
            <Icon name="credit" type="entypo" />
            <ListItem.Content>
              <ListItem.Title>{selectedBudget.limitAmount}</ListItem.Title>
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
              <ListItem.Title>{selectedBudget.currentAmount}</ListItem.Title>
            </ListItem.Content>
          </ListItem>

          <ProgressChart
            data={{
              labels: ["Spent"], // optional
              data: [
                parseFloat(selectedBudget.currentAmount) /
                  parseFloat(selectedBudget.limitAmount),
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
              Delete Budget
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
            onPress={handleEditBudget}
          
          >
            <Text
              style={{
                color: "white",
                fontSize: 16,
                fontWeight: "bold",
              }}
            >
              Edit Budget
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

export default BudgetInfoScreen;
