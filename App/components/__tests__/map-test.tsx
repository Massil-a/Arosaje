import React from 'react';
import { render } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import ActuMap from '../../app/actunav/actumap';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';

jest.mock('@react-native-async-storage/async-storage', () => ({
    setItem: jest.fn(),
    getItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
}));

// Mock du module expo-location
jest.mock('expo-location');

describe('ActuMap', () => {
  it('renders correctly', async () => {
    const { toJSON } = render(
      <NavigationContainer>
        <ActuMap />
      </NavigationContainer>
    );
    expect(toJSON()).toMatchSnapshot();
  });
});