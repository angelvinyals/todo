//footer.js

import React, { Component } from 'react';

import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';

class Footer extends Component {	
  	render() {
  		console.log('RENDER footer inside ....')
	    return (
	    	<View style={styles.container}>
	    		<View style={styles.filters}>
		    		<TouchableOpacity  style={styles.filter}>
		    			<Text>All</Text>
		    		</TouchableOpacity>
		    		<TouchableOpacity  style={styles.filter}>
		    			<Text>Active</Text>
		    		</TouchableOpacity>
		    		<TouchableOpacity  style={styles.filter}>
		    			<Text>Completed</Text>
		    		</TouchableOpacity>
		    	</View>
	    	</View>
	    );
  	}
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  filters:{
  	flexDirection:"row"
  },
  filter:{
  	padding:8,
  	borderRadius:5,
  	borderWidth:1,
  	borderColor: "transparent"
  }
});



export default Footer;