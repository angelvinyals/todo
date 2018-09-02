//header.js

import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,

} from 'react-native';

class Header extends Component {
  state = {
    value: ""
  }

  handleAddItem = () =>{
    console.log('Header.. inside handleAddItem....')    
  }

  handleOnchange = (text) =>{
    console.log('Header.. inside handleOnchange....')
    console.log('value: ', text)
    this.setState( prevState => ({
      value: prevState.value + text
    }));
    console.log('value after:', this.state.value)
  }

  render() {
    console.log('render Header...')
    return (
      <View  style={styles.header}>
      	<TextInput
          value= {this.props.value}
          onChangeText={(text) => this.setState({text})}
        />
      </View>

    );
  }
}

const styles = StyleSheet.create({
  header:{
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  toggleIcon:{
    fontSize:30,
    color: "red"
  },
	input: {
	    flex:1,
      marginLeft:16,
      height:50,
  },
});


export default Header;