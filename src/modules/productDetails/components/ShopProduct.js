import React, { Component } from 'react'
import {
  View,
  TouchableOpacity,
  Text,
  Dimensions,
  FlatList
} from 'react-native'
import GridView from '../../../common/components/widgets/GridView'
import ProductItem from '../../../common/components/widgets/ProductItem'

const { width } = Dimensions.get('window')
const NUMBER_OF_ITEM = 2
const ITEM_WITDH = (width - 20) / NUMBER_OF_ITEM
const ITEM_HEIGHT = 300

export default class ShopProduct extends Component {
  componentDidMount () {
    // const { shopProduct, getShopProducts } = this.props
    // shopInfo && shopInfo.id && getShopProducts(shopInfo.id)
  }

  keyExtractor = (item, index) => {
    return index
  }

  render () {
    const { shopProduct, currencyUnits } = this.props

    return (
      <View style={{
        marginTop: 7,
        paddingTop: 7,
        paddingBottom: 100,
        width: '100%',
        paddingLeft: 10,
        paddingRight: 10,
        backgroundColor: '#fff'
      }}>
        <View style={{ display: 'flex', flexDirection: 'row', height: 32 }}>
          <Text style={{ fontSize: 18, color: '#6F4E37' }}>From the same shop</Text>
          {/* <TouchableOpacity
            onPress={() => {}}
            style={{
              position: 'absolute',
              zIndex: 999,
              right: 0,
              top: 0,
              width: 100,
              height: 26,
              borderRadius: 3,
              borderColor: '#6F4E37',
              borderWidth: 1,
              display: 'flex',
              justifyContent: 'center',
              alignContent: 'center'
            }}
          >
            <Text style={{ color: 'red', textAlign: 'center' }}>View All</Text>
          </TouchableOpacity> */}
        </View>
        {/* <GridView
          data={products}
          numberOfColumns={NUMBER_OF_ITEM}
          itemComponent={(item, index) => <ProductItem
            currencyUnits={currencyUnits}
            item={item.item.item}
            index={index}
            itemWith={ITEM_WITDH}
            itemHeight={ITEM_HEIGHT}
          />}
        /> */}
        <FlatList
          key='data'
          data={shopProduct}
          horizontal
          // refreshing={refreshing}
          // extraData={{ coins, offset }}
          keyExtractor={(item, index) => this.keyExtractor(item, index)}
          renderItem={(item, index) => <ProductItem
            currencyUnits={currencyUnits}
            item={item.item}
            itemWith={ITEM_WITDH}
            itemHeight={ITEM_HEIGHT}
          />}
          // onRefresh={this.onRefresh}
          // onEndReached={this.onLoadMore}
          // onEndReachedThreshold={1}
        />
      </View>
    )
  }
}
