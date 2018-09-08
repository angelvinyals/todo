import React, { Component } from 'react';

import {
  StyleSheet,
  View,
  Text,
  Switch,
  TouchableOpacity,
  TextInput,
} from 'react-native';

class Row extends Component {
  render() {
  	console.log('render row...')
  	const {key, text, complete, onRemove, onComplete, onUpdate  }= this.props
    
    const editingComponent  = (
      <View style={styles.textWrap}>
        <TextInput
          autofocus
          value= {text}
          onChangeText={onUpdate}
          style={styles.input}
          multiline
        />
      </View>
    )

    const textComponent  = (
      <TouchableOpacity style={styles.textWrap} onLongPress={()=>this.props.onToggleEdit(true)}>
          <Text style={[styles.text, complete && styles.complete]}>{this.props.text}</Text>
      </TouchableOpacity>
    )

    const doneButton = (
      <TouchableOpacity style={styles.done} onPress={()=>this.props.onToggleEdit(false)}>
          <Text style={styles.doneText}>SAVE</Text>
      </TouchableOpacity>
    )

    const removeButton = (
      <TouchableOpacity  onPress={this.props.onRemove}>
          <Text style={styles.destroy}>X</Text>
      </TouchableOpacity>
    )

    return (
      <View style={styles.container}>
      	<Switch
      		value= {complete}
      		onValueChange={onComplete}
      	/>      		
      	{this.props.editing ? editingComponent : textComponent }
        {this.props.editing ? doneButton       : removeButton  }
      </View>
    );
  }
}

const styles = StyleSheet.create({
	container:{
		padding: 10,
		flexDirection: "row",
		alignItems:"flex-start",
		justifyContent: "space-between" 
	},
	text:{
		fontSize: 24,
		color:"#4d4d4d"
	},
  input:{
    height: 100,
    flex: 1,
    fontSize: 24,
    padding: 0,
    color: "#4d4d4d"
  },
	textWrap:{
		flex: 1,
		marginHorizontal:10,
	},
  done:{
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#7be290",
    padding:7
  },
  doneText:{
    color: "#4d4d4d",
    fontSize: 20
  },
	complete:{
		textDecorationLine: "line-through" 
	},
	destroy:{
		fontSize: 20,
		color:"#cc9a9a"
	},

});


export default Row;