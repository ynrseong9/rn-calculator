import {NativeModules} from 'react-native/types';

export const executeCalculator = (
  action: 'plus' | 'minus' | 'multiply' | 'divide',
  numA: number,
  numB: number,
): Promise<number> => {
  return NativeModules.CalculatorModule.executeCalc(action, numA, numB);
};
