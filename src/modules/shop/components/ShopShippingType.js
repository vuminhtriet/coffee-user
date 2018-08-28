import React, { Component } from 'react'
import {
  View,
  FlatList
} from 'react-native'
import { ListItem } from 'react-native-elements'

export default class ShopShippingType extends Component {
  constructor(props) {
    super(props)
    this.state = {
      refreshing: false
    }
  }

  keyExtractor = (item, index) => {
    return index
  }

  onRefresh = () => {

  }

  onLoadMore = () => {

  }

  deleteShopShippingType = async (shippingId) => {
    const {
      token,
      shopId,
      deleteShopShippingType
    } = this.props
    await deleteShopShippingType(token, shopId, shippingId)
  }

  render() {
    const { shopShippingTypes, shippingTypes } = this.props
    const { refreshing } = this.state
    return (
      <View
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: '#ffffff',
          padding: 10,
          flex: 1
        }}
      >
        <FlatList
          key='data'
          data={shopShippingTypes}
          refreshing={refreshing}
          keyExtractor={(item, index) => this.keyExtractor(item, index)}
          renderItem={({ item }) => {
            const shippingType = shippingTypes.find(elem => elem.id === item.shippingTypeId)
            if (!shippingType) {
              return null
            }
            return (
              <ListItem
                key={item.id}
                title={shippingType.name}
                subtitle={item.description}
                rightIcon={{ name: 'delete', color: '#E44C4C', type: 'material-community' }}
                onPressRightIcon={() => this.deleteShopShippingType(item.id)}
                containerStyle={{ borderBottomWidth: 0, borderTopWidth: 0 }}
              />
            )
          }}
          onRefresh={this.onRefresh}
          onEndReached={this.onLoadMore}
          onEndReachedThreshold={1}
        />
      </View>
    )
  }
}
