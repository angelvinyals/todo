import React from 'react';
import { StyleSheet, Text, View, Image, Platform, FlatList, Keyboard, } from 'react-native'
import { Asset, SplashScreen } from 'expo'
import Header from './components/header'
import Footer from './components/footer'
import Row from './components/row'

export default class App extends React.Component {
  state = {
    items:[
      {
        key: Date.now(),
        text: 'primer missatge',
        complete:false
      },
      {
        key: '123',
        text: 'segons missatge',
        complete:true
      },
    ],
    allComplete: false,
    isReady: false,
  }
  

  componentDidMount() {
    SplashScreen.preventAutoHide();
  }

  _cacheResourcesAsync = async () => {
    SplashScreen.hide();
    const images = [
      require('./assets/images/expo-icon.png'),
      require('./assets/images/slack-icon.png'),
    ];

    const cacheImages = images.map((image) => {
      return Asset.fromModule(image).downloadAsync();
    });

    await Promise.all(cacheImages);
    this.setState({ isReady: true });
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
    this.setState({
      items:newItems,
      
    });    
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
   this.setState({
    items:newItems,
  });
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
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <FlatList
            data={this.state.items}
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
        <Footer />
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
