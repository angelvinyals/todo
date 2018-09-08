import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  Image, 
  Platform, 
  FlatList, 
  Keyboard,  
  AsyncStorage  
} from 'react-native'
import { Asset, SplashScreen } from 'expo'
import Header from './components/header'
import Footer from './components/footer'
import Row from './components/row'

const filterItems= (filter, items) => {
  if(filter==="ALL") return items
  if(filter==="ACTIVE") {
    return items.filter(item => !item.complete)
    } 
  if(filter==="COMPLETED") {
    return items.filter(item => item.complete)
    } 
}

export default class App extends React.Component {
  state = {
    items:[],
    allComplete: false,
    isReady: false,
    filter: "ALL",
    count:2,
  }
  
  componentDidMoun(){
    SplashScreen.preventAutoHide();    
  }

  _cacheResourcesAsync = async () => {
    try {
      const value = await AsyncStorage.getItem('@todo:ITEMS');
       console.log('value: ',value);
      if (value !== null) {
        // We have data!!
        SplashScreen.hide();
        await this.setState({
          items: value,
          isReady: true
        })
      }
    } catch (error) {
       // Error retrieving data
       console.log('error in _cacheResourcesAsync:', error)
    }
    
  }

  handleAddItem = (textsubmit) =>{
    console.log('APP.. inside handleAddItem....')
    console.log('textsubmit:', textsubmit)
    const newItems = [
      ...this.state.items,
      {
        key: Date.now(),
        text: textsubmit,
        complete:false
      }
    ]
    this._storeData(newItems)
    this.setState({
      items:newItems,      
    })
  }

  _storeData = async (items) => {
    console.log('_storeData')
    console.log('items: ', items )
  try {
    await AsyncStorage.setItem('@todo:ITEMS', JSON.stringify(items));    
  } catch (error) {
    // Error saving data
    console.log('error saving data _storeData:', error)
  }
}

  handleToggleAllComplete = () => {
    console.log('APP.. inside handleToggleAllComplete....')
    const complete= !this.state.allComplete
    console.log('complete:', complete)
    const newItems= this.state.items.map(item=>({
      ...item,
      complete,
     }))
    console.table(newItems)
    this._storeData(newItems)
    // Correct
    this.setState({
      items:newItems,
      allComplete: complete,
    });
  }

  handleToggleComplete = (id, complete) => {
    console.log('APP.. inside handleToggleComplete....')
    console.log('id: ', id)
    console.log('complete: ', complete)
    const newItems= this.state.items.map(item=>{
      if (item.key !== id) return item
      return {
        ...item,
        complete
      }
    })
     console.table(newItems)
     this.setState({
      items:newItems,
    });
  }

  handleRemove = (id) => {
    console.log('APP.. inside handleRemove....')
    console.log('id: ', id)
    const newItems= this.state.items.filter(item=>{
      return item.key !== id 
    })
     console.table(newItems)
     this._storeData(newItems)
     this.setState({
      items:newItems,
    })    
  }

  handleClearComplete = () => {
    console.log('APP.. inside handleClearComplete....')
    const newItems= this.state.items.filter(item=>{
      return item.complete === false 
    })
     console.table(newItems)
     this._storeData(newItems)
     this.setState({
      items:newItems,
    })
  }

  handleFilter = (type) => {
    console.log('APP.. inside handleFilter....')
    console.log('type: ', type)
   
    this.setState({
      filter: type
    })
  }

  _filterItems= (filter, items) => {
    console.log('APP.. inside _filterItems....')
    console.log('filter:',filter)
    console.log('items:',items)
    if(filter==="ALL") return items
    if(filter==="ACTIVE") {
      return items.filter(item => !item.complete)
      } 
    if(filter==="COMPLETED") {
      return items.filter(item => item.complete)
      } 
  }

  renderSeparator = () => (
    <View
      style={{
        height: 1,
        width: "86%",
        backgroundColor: "#CED0CE",
        marginLeft: "14%"
      }}
    />
  )
  

  renderHeader = () => {
    console.log('APP.. inside renderHeader...')
    return (
      <Header 
        onAddItem = {this.handleAddItem}
        onToggleAllComplete = {this.handleToggleAllComplete}
      />
    )
  }

  render() {
    console.log('render... app begins')
    if (!this.state.isReady) {
      console.log('load splash image because is not Ready')
      return (
        <View style={{ flex: 1 }}>
          <Image
            source={require('./assets/images/splash.png')}
            onLoad={this._cacheResourcesAsync}
          />
        </View>
      );
    }
    console.log('render... is  Ready')
    const itemsFiltered= this._filterItems(this.state.filter, this.state.items)
    console.log('itemsFiltered:', itemsFiltered)
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <FlatList
            data={itemsFiltered}
            renderItem={({item}) => 
              <Row 
                id={item.key}
                text={item.text}
                complete={item.complete}
                onComplete={(complete) => this.handleToggleComplete(item.key, complete)}
                onRemove={() => this.handleRemove(item.key)}
              />
            }
            keyExtractor={item => item.key.toString()}
            ItemSeparatorComponent={this.renderSeparator}
            ListHeaderComponent={this.renderHeader}
          />
        </View>
        <Footer
          onFilter= {this.handleFilter}
          filter={this.state.filter}
          count={this._filterItems('ACTIVE',this.state.items).length}
          clearCompleted={this.handleClearComplete}
        />
      </View>
    );
  }
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f1fa',
    ...Platform.select({
      ios: { paddingTop: 30 },
      android: { paddingTop: 16}
    })
  },
  content: {
    flex: 1,
  },
  list:{
    backgroundColor:'white',
  },
  separator:{
    borderWidth: 1,
    borderColor: "#F5f5f5",
  }
});
