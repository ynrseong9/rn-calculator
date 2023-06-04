import React, {useCallback, useState} from 'react';
import {
  Pressable,
  SafeAreaView,
  StatusBar,
  Text,
  View,
  useColorScheme,
  useWindowDimensions,
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';

import {executeCalculator} from './NativeCalculatorUtils';

export type TypeCalcAction =
  | 'plus'
  | 'minus'
  | 'multiply'
  | 'divide'
  | 'clear'
  | 'equal';

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const screenSize = useWindowDimensions();
  const buttonSize = screenSize.width / 4;

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const [resultNum, setResultNum] = useState('');
  const [inputtNum, setInputtNum] = useState('');
  const [tempNum, setTempNum] = useState(0);
  const [lastAction, setLastAction] = useState<Exclude<
    TypeCalcAction,
    'clear' | 'equal'
  > | null>(null);

  const onPressNumber = useCallback<(pressed: number) => void>(
    pressed => {
      if (resultNum !== '') {
        setResultNum('');
      }

      setInputtNum(prevState => {
        const nextNum = parseInt(`${prevState}${pressed}`, 10);

        return nextNum.toString();
      });
    },
    [resultNum],
  );

  const onPressAction = useCallback<(action: TypeCalcAction) => Promise<void>>(
    async pressed => {
      if (pressed === 'clear') {
        setInputtNum('');
        setTempNum(0);
        setResultNum('');
        return;
      }

      if (pressed === 'equal') {
        if (tempNum !== 0 && lastAction !== null) {
          const result = await executeCalculator(
            lastAction,
            tempNum,
            parseInt(inputtNum, 10),
          );

          setResultNum(result.toString());
          setTempNum(0);
        }
        return;
      }

      setLastAction(pressed);

      if (resultNum !== '') {
        setTempNum(parseInt(resultNum, 10));
        setResultNum('');
        setInputtNum('');
      } else if (tempNum === 0) {
        setTempNum(parseInt(inputtNum, 10));
        setInputtNum('');
      } else {
        const result = await executeCalculator(
          pressed,
          tempNum,
          parseInt(inputtNum, 10),
        );
        setResultNum(result.toString());
      }
    },
    [inputtNum, lastAction, resultNum, tempNum],
  );

  return (
    <SafeAreaView style={{flex: 1}}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <View style={{flex: 1}}>
        <View
          style={{
            flex: 1,
            alignItems: 'flex-end',
            justifyContent: 'center',
          }}>
          <Text style={{fontSize: 48, padding: 48}}>
            {resultNum ? resultNum : inputtNum}
          </Text>
        </View>

        <View style={{flex: 2, flexDirection: 'row'}}>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 4,
            }}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map(number => (
              <Pressable
                key={number}
                style={{
                  width: buttonSize - 4,
                  height: buttonSize - 4,
                  borderRadius: (buttonSize - 4) / 2,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'gray',
                }}
                onPress={() => onPressNumber(number)}>
                <Text style={{fontSize: 24}}>{number}</Text>
              </Pressable>
            ))}
          </View>
          <View style={{paddingHorizontal: 12}}>
            {[
              {label: '+', action: 'plus'},
              {label: '-', action: 'minus'},
              {label: '*', action: 'multiply'},
              {label: '/', action: 'divide'},
              {label: 'C', action: 'clear'},
              {label: '=', action: 'equal'},
            ].map(action => {
              return (
                <Pressable
                  key={action.action}
                  style={{
                    width: screenSize.width / 6,
                    height: screenSize.width / 6,
                    borderRadius: screenSize.width / 6 / 2,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'lightgray',
                  }}
                  onPress={() =>
                    onPressAction(action.action as TypeCalcAction)
                  }>
                  <Text style={{fontSize: 24}}>{action.label}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

export default App;
