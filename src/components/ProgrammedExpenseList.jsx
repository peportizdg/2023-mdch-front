import { ScrollView, RefreshControl } from "react-native";
import { useProgrammedExpenseList } from "../hooks/programmedExpense";
import { ListItem, Icon } from "@rneui/themed";
import LinearGradient from "react-native-linear-gradient";


const ProgrammedExpenseList = ({ onAdd, onSelection }) => {
  const { isPending: loading, data: programmedExpenses, isRefetching, refetch} = useProgrammedExpenseList();
  
  return (
    <ScrollView
      style={{ height: 370 }}
      refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}
    >
      <ListItem
        linearGradientProps={{
          colors: ["#FFFFFF", "#E86DC3"],
          start: { x: 0.9, y: 0 },
          end: { x: -0.7, y: 0 },
        }}
        ViewComponent={LinearGradient}
        bottomDivider
        onPress={onAdd}
      >
        <Icon name="add" type="ionicon" />
        <ListItem.Content>
          <ListItem.Title>Program new Expense</ListItem.Title>
        </ListItem.Content>
        <ListItem.Chevron />
      </ListItem>

      {programmedExpenses?.map((programmed, index) => (
        <ListItem key={index} bottomDivider onPress={() => onSelection(programmed)}>
          <Icon name={iconFactory(programmed.iconId)} type="entypo" />
          <ListItem.Content>
            <ListItem.Title>{programmed.name}</ListItem.Title>
            <ListItem.Subtitle>{programmed.category}</ListItem.Subtitle>
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem>
      ))}

    </ScrollView>
  );
};

const iconFactory = (id) => {
  switch (id) {
    case 1:
      return "aircraft"
    case 2:
      return "drink"
    case 3:
      return "key"
    case 4:
      return "shopping-cart"
    case 5:
      return "clapperboard"
    case 6:
      return "squared-plus"
    case 7:
      return "man"
    case 8:
      return "open-book"
    default:
      return "credit"
  }
};

export default ProgrammedExpenseList;
