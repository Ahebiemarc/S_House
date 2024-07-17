import 'react-native-gesture-handler'; // Importer ce module en premier
import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
//import type {PropsWithChildren} from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  useColorScheme,
} from 'react-native';

import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';
import RootNavigator from './src/application/navigations/Root.navigation';
import { GestureHandlerRootView } from 'react-native-gesture-handler';



function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <GestureHandlerRootView style={[backgroundStyle, {flex:1}]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
        
      />

      <NavigationContainer>
            <RootNavigator />
      </NavigationContainer>
      
    </GestureHandlerRootView>
  );
}



export default App;
