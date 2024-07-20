import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Icon, Overlay, Button, ListItem } from '@rneui/themed';
import DatePicker from 'react-native-date-picker';
import { Picker } from './Picker';
import { useUserCategories } from '../hooks/categories';
import { Dialog } from '@rneui/base';


/**
 * Recibe ```textInputValue```, ```onChangeTextInput```, ```
 */
const FilterModal = props => {
  const [categories, setCategories] = React.useState([]);
  const [from, setFrom] = React.useState(new Date());
  const [until, setUntil] = React.useState(new Date());

  const [isStartingDateModalOpen, setOpenStartingDateModal] = React.useState(false);
  const [isEndingDateModalOpen, setOpenEndingDateModal] = React.useState(false);

  const { isPending: loading, data: userCategories } = useUserCategories();

  const handleSubmit = () => {
    console.log('Filtro: ' + from + ' ' + until + ' ' + categories);
    let data = {
      from,
      until,
      categories
    };

    props.onDone(data);
  };

  const handleCancel = () => {
    props.onCancel();
  };

  if(loading){
    return(
      <Dialog>
        <Dialog.Loading />
      </Dialog>
    );
  }

  return (
    <Overlay isVisible={props.visible}>
      <View style={{height:'70%', width: 300}}>

        <View style={{...styles.middleSection}}>

          <View style={styles.categoryFilterContainer}>

            <View style={styles.autocompleteContainer}>

              <Picker.Text.Multiple 
                value={categories}
                onChange={setCategories}
                data={userCategories}
              />
            </View>

          </View>

          <View style={styles.dateButtonContainer}>
            <ListItem bottomDivider topDivider onPress={() => setOpenStartingDateModal(true)}>
              <Icon name="arrow-expand-right" type="material-community" color="grey" />
              <ListItem.Content>
                <ListItem.Title>From {from.toLocaleDateString('es-AR')}</ListItem.Title>
              </ListItem.Content>
              <ListItem.Chevron />
            </ListItem>
          </View>

          <View style={styles.dateButtonContainer}>
            <ListItem bottomDivider topDivider onPress={() => setOpenEndingDateModal(true)}>
              <Icon name="arrow-expand-left" type="material-community" color="grey" />
              <ListItem.Content>
                <ListItem.Title>Until {until.toLocaleDateString('es-AR')}</ListItem.Title>
              </ListItem.Content>
              <ListItem.Chevron />
            </ListItem>
          </View>
          
          <View>
            {/* <Button title="Starting date" onPress={() => setOpenStartingDateModal(true)} /> */}
            <DatePicker
              modal
              date={from}
              maximumDate={until}
              open={isStartingDateModalOpen}
              onConfirm={(date) => {
                setOpenStartingDateModal(false)
                setFrom(date)
              }}
              onCancel={() => setOpenStartingDateModal(false)}
              mode='date'
              locale='en-US'
            />
          </View>

          <View>
            {/* <Button title="Ending date" onPress={() => setOpenEndingDateModal(true)} /> */}
            <DatePicker 
              modal
              date={until}
              minimumDate={from}
              open={isEndingDateModalOpen}
              onConfirm={(date) => {
                setOpenEndingDateModal(false)
                setUntil(date)
              }}
              onCancel={() => setOpenEndingDateModal(false)}
              mode='date'
              locale='en-US'
            />
          </View>
        </View>

        <View style={{...styles.bottomSection}}>
          
          <Button
            title="Done"
            buttonStyle={{
              borderColor: 'black',
              backgroundColor: '#E86DC3',
              borderRadius: 10,
            }}
            type="outline"
            raised
            titleStyle={{ color: 'white' }}
            containerStyle={{
              width: 200,
              marginHorizontal: 50,
              marginVertical: 10,
              borderRadius: 10,
            }}
            onPress={handleSubmit}
          />
          
          <Button
            title="Cancel"
            buttonStyle={{
              borderColor: '#a1a1a1',
              borderRadius: 10,
            }}
            type="outline"
            raised
            titleStyle={{ color: '#696969' }}
            containerStyle={{
              borderRadius: 10,
              width: 200,
              marginHorizontal: 50,
              marginVertical: 10,
            }}
            onPress={handleCancel}
          />
          
        </View>

      </View>
    </Overlay>
  );
};

const FilterButton = (props) => {
  const [visible, setVisible] = useState(false);

  const toggleFilterModal = () => {
    setVisible(!visible);
  };

  return (
    <>
      <View style={styles.filterButtonContainer}>
        <TouchableOpacity style={styles.filterButton} onPress={toggleFilterModal}>
          <Text style={styles.buttonText}>Filter</Text>
        </TouchableOpacity>
      </View>

      <FilterModal 
        visible={visible} 
        onDone={props.onDone} 
        onCancel={toggleFilterModal}
      />

    </>
  );
};


const styles = StyleSheet.create({

  filterButtonContainer: {
    height: 35,
    width: '90%',
    marginLeft: '5%',
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 10,
    backgroundColor: '#e86dc3',
  },

  filterButton: {
    backgroundColor: '#e86dc3',
    paddingBottom: '2.5%',
    paddingTop: '2.5%',
    alignItems: 'center',
    borderRadius: 10,
  },
  
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },

  // Middle Section

  middleSection: {
      marginVertical: 10,
      paddingVertical: 15,
  },

  categoryFilterContainer: {
      position: 'relative',
      height: 100,
      zIndex: 1
  },

  autocompleteContainer: {
      position: 'absolute',
      width: 300,
      zIndex: 2
  },

  dateButtonContainer: {
      marginHorizontal: '4%',
      marginTop: 10
  },

  // Bottom section

  bottomSection: {
      marginTop: 30,
  },
});

export default FilterButton;
