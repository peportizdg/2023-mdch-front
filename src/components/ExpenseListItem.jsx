import { Button, ListItem, Icon } from "@rneui/themed";

const ExpenseListItem = ({data, onEdit, onDelete}) => {
  return <ListItem.Swipeable
    leftWidth={70}
    rightWidth={70}
    containerStyle={{ borderBottomWidth: 1, }}
    leftContent={(reset) => (
      <Button
        containerStyle={{
          flex: 1,
          justifyContent: "center",
          backgroundColor: "#f4f4f4",
        }}
        type="clear"
        icon={{
          name: "file-document-edit-outline",
          type: "material-community",
        }}
        onPress={() => {
          reset();
          onEdit(data);
        } } />
    )}
    rightContent={(reset) => (
      <Button
        containerStyle={{
          flex: 1,
          justifyContent: "center",
          backgroundColor: "#d15c54",
        }}
        type="clear"
        icon={{ name: "delete-outline", color: "white" }}
        onPress={() => {
          reset();
          onDelete(data.id);
        } } />
    )}
  >
    <Icon name={iconFactory(data.iconId)} type="entypo" />
    <ListItem.Content>
      <ListItem.Title style={{ fontSize: 17 }} numberOfLines={1}>{data.concept}</ListItem.Title>
      <ListItem.Subtitle style={{ fontSize: 13 }} numberOfLines={1}>{data.category}</ListItem.Subtitle>
    </ListItem.Content>
    <ListItem.Content right>
      <Icon name={data.paymentMethod === 'CASH' ? 'credit' : 'credit-card'} type="entypo" />
    </ListItem.Content>
    <ListItem.Content center>
      <ListItem.Title right numberOfLines={1}>
      {data.amount} {data.paymentMethod === 'CARD' && `(${data.cuotas})`}
      </ListItem.Title>
      <ListItem.Subtitle style={{ fontSize: 12 }} right numberOfLines={1}>{data.date}</ListItem.Subtitle>
    </ListItem.Content>
  </ListItem.Swipeable>;
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

export default ExpenseListItem;
