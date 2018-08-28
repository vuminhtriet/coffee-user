import React, { Component, PureComponent } from 'react'
import {
  FlatList,
  View
} from 'react-native'
import { Card, Button, ListItem, Rating, FormInput, Icon } from 'react-native-elements'
import { withNavigation } from 'react-navigation';
import { SCREENS } from '../../../common/screens';

class BoughtProductItem extends PureComponent {
  _navigateProductScreen = () => {
    const { navigateProductScreen, id } = this.props
    navigateProductScreen({ id })
  }

  render() {
    const {
      id,
      logoUrl,
      name,
      description
    } = this.props
    return (
      <ListItem
        key={id}
        avatar={
          logoUrl
            ? { uri: logoUrl }
            : require('../../../assets/images/yarn.png')}
        title={name}
        subtitle={`${description}`}
        rightIcon={{
          name: 'more'
        }}
        onPress={this._navigateProductScreen}
      />
    )
  }
}

class BoughtProductList extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      refreshing: false,
      explain: undefined,
      rating: 0,
      text: ''
    }

    this.submit = this.submit.bind(this)
    this.showMore = this.showMore.bind(this)
    this.ratingCompleted = this.ratingCompleted.bind(this)
  }

  async submit() {
    const { user, submit, token } = this.props
    const { rating, text, explain } = this.state
    await submit(token, user, explain, { rating, text })
    this.setState({
      rating: 0,
      text: '',
      explain: undefined
    })
  }

  showMore(id) {
    const { explain } = this.state
    this.setState({
      rating: 0,
      text: '',
      explain: explain === id ? undefined : id
    })
  }

  _onRefresh = () => {
    const { user, getProducts } = this.props
    getProducts(user)
  }

  _onLoadMore = () => {

  }

  _keyExtractor = (item) => item.id

  ratingCompleted(rating) {
    this.setState({
      rating
    })
  }

  componentDidMount() {
    const { user, getProducts } = this.props
    getProducts(user)
  }

  navigateProductScreen = (item) => {
    const { navigation} = this.props
    navigation.navigate(SCREENS.ProductDetail, { productItem: item })
  }

  _renderItem = ({ item }) => {
    const { explain, rating } = this.state
    const isExistLogo = item.images && item.images.length > 0 && item.images.find(elem => elem.type === 2)
    const logo = isExistLogo || (item.images && item.images.length > 0)
      ? item.images[0]
      : null
    // return [
    //   <ListItem
    //     key='item'
    //     avatar={logo
    //       ? { uri: logo.fullUrl }
    //       : require('../../../assets/images/yarn.png')}
    //     title={item.name}
    //     subtitle={`${item.description}`}
    //     rightIcon={{
    //       name: 'more'
    //     }}
    //     onPress={() => this.showMore(item.id)}
    //   />,
    //   explain === item.id
    //     ? (
    //       <Card
    //         key='detail'
    //         title='Your rating'
    //       >
    //         <Rating
    //           showRating
    //           fractions={0}
    //           type='custom'
    //           startingValue={rating}
    //           imageSize={40}
    //           onFinishRating={this.ratingCompleted}
    //           ratingImage={require('../../../assets/images/star.png')}
    //           ratingColor='#FF6A00'
    //           ratingBackgroundColor='transparent'
    //           style={{ paddingVertical: 10 }}
    //         />
    //         <FormInput
    //           multiline
    //           containerStyle={{ minHeight: 60, marginVertical: 10 }}
    //           style={{
    //             height: undefined
    //           }}
    //           placeholder='Enter your review'
    //           numberOfLines={5}
    //           onChangeText={(text) => this.setState({
    //             text
    //           })}
    //         />
    //         <Button title='Submit' onPress={this.submit} />
    //       </Card>
    //     ) : null
    // ]
    return (
      <BoughtProductItem
        id={item.id}
        logoUrl={logo && logo.fullUrl}
        name={item.name}
        description={item.description}
        navigateProductScreen={this.navigateProductScreen}
      />
    )
  }

  render() {
    const { refreshing, numColumns } = this.state
    const { products } = this.props

    return (
      <View
        style={{
          width: '100%',
          height: undefined
        }}>
        <FlatList
          key={numColumns}
          data={products}
          refreshing={refreshing}
          extraData={{ ...products }}
          keyExtractor={this._keyExtractor}
          renderItem={this._renderItem}
          onRefresh={this._onRefresh}
          onEndReached={this._onLoadMore}
          onEndReachedThreshold={1}
        />
      </View>)
  }
}

export default withNavigation(BoughtProductList)