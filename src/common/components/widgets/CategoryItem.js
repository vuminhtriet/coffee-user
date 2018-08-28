import React, { PureComponent } from 'react'
import {
  Text,
  Image,
  View,
  TouchableOpacity
} from 'react-native'
import { withNavigation } from 'react-navigation'
import { SCREENS } from '../../screens'

class CategoryItem extends PureComponent {
  onPress = () => {
    const { navigation, id } = this.props
    navigation.navigate(SCREENS.CategoryProduct, { categoryId: id })
  }

  render() {
    const {
      image,
      name,
      totalProduct,
      itemWidth,
      itemHeight
    } = this.props
    return (
      <TouchableOpacity
        style={{
          width: itemWidth,
          height: itemHeight,
          flexDirection: 'column',
          padding: 5
        }}
        onPress={this.onPress}
      >
        <Image
          style={{ height: 120, width: '100%' }}
          source={image ? { uri: image } : require('../../../assets/placeholder.png')}
        />
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ marginBottom: 0, textAlign: 'center' }}>
            {`${name}`}
          </Text>
          <Text style={{ marginBottom: 0, textAlign: 'center', color: '#aaa5a5' }}>
            {`${totalProduct} products`}
          </Text>
        </View>
      </TouchableOpacity>
    )
  }
}

export default withNavigation(CategoryItem)
