import React from "react";
import { Text } from "react-native";

import ScreenTemplate from "../components/ScreenTemplate";
import BackButton from "../components/BackButton";
import CardList from "../components/CardList";

const CardScreen = ({ navigation, route }) => {

  const handleCardSelection = (card) => {
    navigation.navigate("card-info", {
      selectedCard: card
    });
  };
  const handleAddCard = () => {
    navigation.navigate("card-add");
  };

  return (
    <ScreenTemplate>
      <ScreenTemplate.Logo />

      <ScreenTemplate.Content style={{ paddingHorizontal: 15 }}>

        <Text style={{
          fontFamily: 'Roboto-Medium',
          fontSize: 28,
          fontWeight: '500',
          color: '#333',
          marginBottom: 30,
          marginTop: 30,
        }}>Cards</Text>

        <CardList 
          onAdd={handleAddCard}
          onSelection={handleCardSelection}
        />

        <BackButton />

      </ScreenTemplate.Content>
    </ScreenTemplate>
  );
};

export default CardScreen;
