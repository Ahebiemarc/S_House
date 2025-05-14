// src/application/navigations/SharedElementNavigator.tsx

import React from 'react';
import { createSharedElementStackNavigator } from 'react-navigation-shared-element';
import { SharedElementStackParamList } from '../../domain/types/route.types';
import DetailsAddPost from '../../presentation/screens/DetailsAddPost.screen';
import LocationAddPost from '../../presentation/screens/LocationAddPost.screen';
import MapAddPost from '../../presentation/screens/MapAddPost.screen';

// Utilise maintenant SharedElementStackParamList
const Stack = createSharedElementStackNavigator<SharedElementStackParamList>();

const SharedElementNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="DetailsAddPost">
      <Stack.Screen
        name="DetailsAddPost"
        component={DetailsAddPost}
        options={{ title: 'Informations Propriété' }}
      />
      <Stack.Screen
        name="LocationAddPost"
        component={LocationAddPost}
        options={{ title: 'Localisation' }}
      />
      <Stack.Screen
        name="MapAddPost"
        component={MapAddPost}
        options={{ title: 'Sélectionner sur la Carte' }}
      />
    </Stack.Navigator>
  );
};

export default SharedElementNavigator;
