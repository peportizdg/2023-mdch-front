import { useMemo, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { PieChart } from "react-native-chart-kit";
import { Avatar, Icon, ListItem } from '@rneui/themed';

import { colorGradientSample } from '../utils/colors';
import ScreenTemplate from '../components/ScreenTemplate';
import { useSumOfExpenses } from '../hooks/expenses';
import FilterButton from '../components/Filter';


const PieScreen = ({navigation, route}) => {
  const [filterData, setFilterData] = useState({});

  const { isPending: loading, data: sumOfExpenses } = useSumOfExpenses(filterData);

  const chartData = useMemo(() => {
    if(sumOfExpenses == undefined){
      return undefined;
    }

    let colorSamples = colorGradientSample("#E86DC3", "#EAEAEA", sumOfExpenses.length);
    return sumOfExpenses.map((exp, index) => ({
      index: index,
      category: exp.category,
      amount: exp.amount,
      color: colorSamples[index]
    }));
  }, [sumOfExpenses]);

  const chartConfig = {
    color: () => `rgb(${Math.floor(Math.random() * 255)}, 255, 146)`,
  };
  
  const renderItem = ({ item }) => (
    <ListItem  key={item.index} bottomDivider>
      <Avatar rounded containerStyle={{ backgroundColor: item.color || 'defaultColor' }}/>
      <ListItem.Content >
        <ListItem.Title numberOfLines={1} style={{ fontSize: 18 }}>{item.category}</ListItem.Title>
      </ListItem.Content>
      <ListItem.Content right>
        <ListItem.Title right numberOfLines={1}>${item.amount.toFixed(0)}</ListItem.Title>
      </ListItem.Content>
    </ListItem>
  );

  return (
    <ScreenTemplate loading={loading}>
      <ScreenTemplate.Logo />

      <ScreenTemplate.Content >

        <FilterButton onDone={setFilterData} />

        {chartData && chartData.length ? (
          <>
            <PieChart
              data={chartData}
              width={340}
              height={200}
              chartConfig={chartConfig}
              accessor="amount"
              backgroundColor="transparent"
              paddingLeft="90"
              absolute
              hasLegend={false}
            />
            <FlatList
              style={{height: 300, borderTopWidth: 0.5, borderBottomWidth: 0.5, borderColor: '#d9d9d9', overflow: 'hidden'}}
              data={chartData}
              renderItem={renderItem}
              showsVerticalScrollIndicator={true}
            />
          </>
          ) : (
            <Text style={{
              marginTop: '50%',
              fontSize: 20,
              textAlign: 'center',
            }}>
              There is no expenses data available for selected parameters. Please try again
            </Text>
          )
        }

      </ScreenTemplate.Content>
    </ScreenTemplate>
  );
};

const styles = StyleSheet.create({

  addExpenseButtonContainer: {
    height: 37,
    width: '80%',
    marginLeft: '10%',
    marginTop: '1%',
    backgroundColor: '#ed93d2',
    borderRadius: 10,
  },

  button: {
    backgroundColor: '#E86DC3',
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

  listItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
    color: 'black',
    position: 'absolute'
  },
  listItemTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    color: 'black',
  },
  listItemTitle: {
    marginLeft: 10,
    color: 'black',

  },


  // Scrollview

  textForNoData: {
    marginTop: '50%',
    fontSize: 20,
    textAlign: 'center',
  },
});

export default PieScreen;
