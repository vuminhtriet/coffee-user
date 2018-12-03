import React, { Component } from 'react'
import {
  View,
  TouchableOpacity,
  Text,
  Dimensions
} from 'react-native'
import { Icon } from 'react-native-elements'
import ProductItem from '../../../common/components/widgets/ProductItem'
import GridView from '../../../common/components/widgets/GridView'
import SubHeader from '../../../common/components/elements/SubHeader'

const { width } = Dimensions.get('window')
const NUMBER_OF_ITEM = 2
const ITEM_WITDH = (width) / NUMBER_OF_ITEM
const ITEM_HEIGHT = 285

export default class CategoryList extends Component {
  itemComponent ({ index, item: { item } }) {
    return <ProductItem
      item={item}
      index={index}
      itemWith={ITEM_WITDH}
      itemHeight={ITEM_HEIGHT}
    />
  }

  render () {
    const { products } = this.props

    return (
      <View
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: '#ffffff',
          marginBottom: 5,
          paddingBottom: 5
        }}
      >
        <SubHeader
          onLeftComponent={
            <View style={{ marginLeft: 12 }}>
              <TouchableOpacity
                onPress={this.onSort}
              >
                <Text style={{ fontSize: 16 }}>Sort by popularity</Text>
              </TouchableOpacity>
            </View>
          }
          onRightComponent={
            <TouchableOpacity
              style={{ marginRight: 12, display: 'flex', flexDirection: 'row', justifyContent: 'center' }}
              onPress={this.onFilter}
            >
              <Icon
                name={'sort'}
                size={26}
                color='black'
                containerStyle={{}}
              />
              <Text style={{ fontSize: 16, lineHeight: 26 }}>Filter</Text>
            </TouchableOpacity>
          }
        />
        <GridView
          data={products}
          numberOfColumns={NUMBER_OF_ITEM}
          itemComponent={this.itemComponent}
          itemWith={ITEM_WITDH}
          itemHeight={ITEM_HEIGHT}
        />
      </View>
    )
  }
}
