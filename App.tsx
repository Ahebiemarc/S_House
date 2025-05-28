import 'react-native-gesture-handler'; // Importer ce module en premier
import {NavigationContainer } from '@react-navigation/native';
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
import { AuthProvider } from './src/application/providers/AuthContext';
import { DefaultTheme, PaperProvider } from 'react-native-paper';
import { PostProvider } from './src/application/providers/PostContext';
import { FavoritesProvider } from './src/application/providers/FavoritesContext';
import { UserProvider } from './src/application/providers/UserContext';
import { ChatProvider } from './src/application/providers/ChatContext';


// Thème pour react-native-paper (optionnel)
const theme = {
  ...DefaultTheme,
  roundness: 8,
  colors: {
    ...DefaultTheme.colors,
    primary: '#6200ee',
    accent: '#03dac4',
  },
};

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <GestureHandlerRootView style={[backgroundStyle, {flex:1}]}>
      <PaperProvider theme={theme}>
          <StatusBar
            barStyle={isDarkMode ? 'light-content' : 'dark-content'}
            backgroundColor={backgroundStyle.backgroundColor}
            
          />
          <AuthProvider>
           <UserProvider>
            <PostProvider>
                <FavoritesProvider>
                  <ChatProvider>
                    <NavigationContainer>
                        <RootNavigator />
                    </NavigationContainer>
                  </ChatProvider>
                </FavoritesProvider>
              </PostProvider>
           </UserProvider>
            
          </AuthProvider>
      </PaperProvider>
      
      
    </GestureHandlerRootView>
  );
}



export default App;
