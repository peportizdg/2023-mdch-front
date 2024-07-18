import React from "react";
import { Text, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import ScreenTemplate from "../components/ScreenTemplate";
import { ProgressChart } from "react-native-chart-kit";
import { ScrollView } from "react-native";
import { useDeleteCard, getCardLimitStatus } from "../hooks/cards";

const CardInfoScreen = ({ navigation, route }) => {
  const { selectedCard } = route.params;
  const { mutate: deleteCard } = useDeleteCard();
  const { data: monthlyExpenses, isLoading, isError } = getCardLimitStatus(selectedCard.id);

  const handleEditCard = () => {
    navigation.navigate("card-edit", {
      selectedCard,
    });
  };

  const handleDelete = () => {
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this card?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: () => {
            deleteCard(route.params.selectedCard.id, {
              onSuccess: () => {
                navigation.goBack();
              },
              onError: (error) => {
                console.error("Error deleting card:", error);
              },
            });
          },
          style: "destructive",
        },
      ]
    );
  };

  if (isLoading) {
    return <ActivityIndicator size="large" color="#E86DC3" />;
  }

  if (isError) {
    return <Text>Error loading card limit status</Text>;
  }
  if(monthlyExpenses == null){
    expenses = 0;
  }
  else{
    expenses = monthlyExpenses;
  }

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
              marginTop: 50,
            }}
          >
            Card name: {selectedCard.cardName}
          </Text>
          <Text
            style={{
              fontFamily: "Roboto-Medium",
              fontSize: 20,
              fontWeight: "500",
              color: "#333",
              marginBottom: 10,
            }}
          >
            Card Limit: {selectedCard.cardLimit}
          </Text>
          <Text
            style={{
              fontFamily: "Roboto-Medium",
              fontSize: 20,
              fontWeight: "500",
              color: "#333",
              marginBottom: 10,
            }}
          >
            Card Monthly expenses: {expenses}
          </Text>

          <ProgressChart
            data={{
              labels: ["Limit status"], // optional
              data: [ expenses / selectedCard.cardLimit],
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
              Delete Card
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
            onPress={handleEditCard}
          >
            <Text
              style={{
                color: "white",
                fontSize: 16,
                fontWeight: "bold",
              }}
            >
              Edit Card
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

export default CardInfoScreen;

