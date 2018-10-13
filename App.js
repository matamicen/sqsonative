import React from 'react';
import { StyleSheet, Text, View, TextInput, Button, SafeAreaView } from 'react-native';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
//import peopleReducer from './src/reducers/peopleReducer';

import thunk from "redux-thunk"
//import AppContainer from "./src/containers/AppContainer";

// agregado nuevo
import AppReducer from './src/reducers/AppReducer';
import AppWithNavigationState2 from './src/components/MainNavigator';

// fin agregado nuevo

const createStoreWithMidddleware = applyMiddleware(thunk)(createStore);


//const store = createStoreWithMidddleware(peopleReducer);
//const store = createStoreWithMidddleware(AppReducer);

export default class App extends React.Component {

   store = createStoreWithMidddleware(AppReducer);
   //store = createStore(AppReducer);



  render() { console.disableYellowBox = true


    return (
    <SafeAreaView style={styles.safeArea}>
      <Provider store={this.store}>
    
    <AppWithNavigationState2 />
      </Provider>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({

  safeArea: {
    flex: 1,
    backgroundColor: '#ddd'
  }
})
