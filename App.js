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

export const STORAGE_KEY = '@mobileTodo:items';

export default class App extends React.Component {
  state = {
    items:[],
    allComplete: false,
    isReady: false,
    filter: "ALL",
  }  

  componentDidMount() {
    SplashScreen.preventAutoHide();
  }

  _cacheResourcesAsync = async () => {
    console.log('APP.. inside _cacheResourcesAsync....')
    SplashScreen.hide();
    const valueObject= await this._retrieveData(STORAGE_KEY);
    if (valueObject ){
      console.log('APP.. inside _cacheResourcesAsync.... valueObject:',valueObject)
      this.setState({ 
        items: valueObject,
        isReady: true 
      })
      return
    }    
    console.log('_cacheResourcesAsync....NO DATA')
    this.setState({
      items:[
        {
          key: Date.now(),
          text: 'dades falses.no tretes de  AsyncStorage',
          complete:false
        },
        {
          key: '123',
          text: 'prova2',
          complete:true
        },
      ],
      isReady: true
    })
  }

  handleAddItem = async(textsubmit) =>{
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
    //console.log('APP.. going to _storeData')
    await this._storeData(STORAGE_KEY,newItems)

    const valueObject= await this._retrieveData(STORAGE_KEY);
    console.log('value of item in AsyncStorage:', valueObject)
    
    this.setState({
      items:newItems,      
    });    
  }

  _retrieveData = async (key) => {
    console.log('APP.. inside _retrieveData')
    try {
      const value = await AsyncStorage.getItem(key);
      if (value !== null) {
        console.log(value)
        return JSON.parse(value) 
      }       
    } catch (error) {
      // Error retrieving data
      alert(error);
    }
  }

  _storeData = async (key, dataObject) => {
    console.log('APP.. inside _storeData')
    try {
      await AsyncStorage.setItem(key, JSON.stringify(dataObject));
    } catch (error) {
      // Error saving data
      alert(error);
    }
  }

  _mergeData = async (key, dataObjectToMerge) => {
    console.log('APP.. inside _mergeData')
    console.log('key:',  key)
    console.log('dataObjectToMerge:', dataObjectToMerge)
    try {
      await AsyncStorage.mergeItem(key, JSON.stringify(dataObjectToMerge));
    } catch (error) {
      // Error saving data
      alert(error);
    }
  }

  handleToggleAllComplete = async() => {
    console.log('APP.. inside handleToggleAllComplete....')
    const complete= !this.state.allComplete
    console.log('complete:', complete)
    const newItems= this.state.items.map(item=>({
      ...item,
      complete,
     }))
    //console.log('APP.. going to _storeData')
    await this._storeData(STORAGE_KEY,newItems)

    const valueObject= await this._retrieveData(STORAGE_KEY);
    console.log('value of item in AsyncStorage:')
    console.table(valueObject)

    // Correct
    this.setState({
      items:newItems,
      allComplete: complete,
    });
  }

  handleToggleComplete = async(id, complete) => {
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

    await this._storeData(STORAGE_KEY,newItems)

    const valueObject= await this._retrieveData(STORAGE_KEY);
    console.log('value of item in AsyncStorage:')
    console.table(valueObject)
    
    this.setState({
      items:newItems,
    });
  }

handleRemove = async(id) => {
  console.log('APP.. inside handleRemove....')
  console.log('id: ', id)
  const newItems= this.state.items.filter(item=>{
    return item.key !== id 
  })

  await this._storeData(STORAGE_KEY,newItems)

  const valueObject= await this._retrieveData(STORAGE_KEY);
  console.log('value of item in AsyncStorage:')
  console.table(valueObject)

  this.setState({
    items:newItems,
  });
}

handleFilter = (type) => {
  console.log('APP.. inside handleFilter....')
  console.log('type: ', type)
 
  this.setState({
    filter: type
  })
}

_filterItems= (filter, items) => {
  if(filter==="ALL")        return items
  if(filter==="ACTIVE")    {return items.filter(item => !item.complete)} 
  if(filter==="COMPLETED") {return items.filter(item =>  item.complete)} 
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
        count={this.handleCount}
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
          count={this.state.items.filter(item => !item.complete).length}
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
