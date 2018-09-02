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

  state = {value: ''}

  handleChange = (text) => {
    console.log('...inside handleChangein HEADER')
    this.setState({value: text});
  }

  handleSubmit = (event) => {
    console.log('...inside handleSubmit in HEADER')
    if(!this.state.value) return
    event.preventDefault();
    console.log('text submitted: ' + this.state.value)  
    this.props.onAddItem(this.state.value)  
    this.setState({value: ''});
  }

  render() {
    console.log('render Header...')
    return (
      <View  style={styles.header}>
        <TouchableOpacity onPress={this.props.onToggleAllComplete}>
          <Text style={styles.toogleIcon}>{String.fromCharCode(10003)}</Text>
        </TouchableOpacity>
      	<TextInput
          value= {this.state.value}
          onChangeText={this.handleChange}
          onSubmitEditing = {this.handleSubmit}
          placeholder= "What needs to be done?"
          blurOnSubmit={false}
          returnKeyType= "done"
          style={styles.input}
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