import React from 'react';
import { ScrollView, RefreshControl, TouchableOpacity, Text, Alert } from 'react-native';
import { ListItem, Icon } from '@rneui/themed';
import LinearGradient from 'react-native-linear-gradient';
import { useCardList } from '../hooks/cards';

const CardList = ({ onAdd, onSelection }) => {
  const { data: cards, isLoading, isError, refetch } = useCardList();

  // Function to handle manual refresh of cards
  const handleRefresh = async () => {
    try {
      await refetch();
    } catch (error) {
      Alert.alert('Error', 'Failed to refresh cards');
    }
  };

  return (
    <ScrollView
      style={{ height: 370 }}
      refreshControl={<RefreshControl refreshing={isLoading} onRefresh={handleRefresh} />}
    >
      {/* Add new card button */}
      <ListItem
        linearGradientProps={{
          colors: ['#FFFFFF', '#E86DC3'],
          start: { x: 0.9, y: 0 },
          end: { x: -0.7, y: 0 },
        }}
        ViewComponent={LinearGradient}
        bottomDivider
        onPress={onAdd}
      >
        <Icon name="add" type="ionicon" />
        <ListItem.Content>
          <ListItem.Title>Add new card</ListItem.Title>
        </ListItem.Content>
        <ListItem.Chevron />
      </ListItem>

      {/* List of cards */}
      {cards?.map((card, index) => (
        <ListItem key={index} bottomDivider onPress={() => onSelection(card)}>
          {/* Assuming a default icon for credit cards */}
          <Icon name="credit-card" type="entypo" />
          <ListItem.Content>
            <ListItem.Title>{card.cardName}</ListItem.Title>
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem>
      ))}

      {/* Placeholder if no cards */}
      {!isLoading && cards?.length === 0 && (
        <TouchableOpacity style={{ padding: 15, alignItems: 'center' }} onPress={onAdd}>
          <Text>Add your first card</Text>
        </TouchableOpacity>
      )}

    </ScrollView>
  );
};

export default CardList;
