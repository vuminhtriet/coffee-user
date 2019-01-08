import React, { PureComponent } from 'react'
import {
  Text,
  Image,
  View,
  TouchableOpacity
} from 'react-native'
import { ListItem } from 'react-native-elements'
import { connect } from 'react-redux'
import axios from 'axios'
import { withNavigation } from 'react-navigation'
import { TEST_URL } from '../../../common/models'
import { SCREENS } from '../../screens'

class StyleItem extends PureComponent {

  constructor(props) {
    super(props)

    this.state = {
      count: null,
    }
  }

  onPress = () => {
    const { navigation, id, name } = this.props
    navigation.navigate(SCREENS.StyleShop, { styleId: id, styleName: name })
  }

  componentDidMount() {
    // const { navigation, id, shopId } = this.props
    // // const url = `${TEST_URL}/api/categories/${id}/products/count`
    // const url = `${TEST_URL}/api/products?filter[where][categoryId]=${id}&filter[where][shopId]=${shopId}`

    // this.setState({ loading: true }, () => {
    //   axios({
    //     url,
    //     timeout: 5000
    //   })
    //     .then(response => {
    //       const item = response.data
    //       this.setState({
    //         count: item.length,
    //         loading: false
    //       })
    //     })
    //     .catch(e => {
    //       this.setState({ count: null })
    //     })
    // })
    
  }

  render() {
    const {
      index,
      image,
      name,
      totalShop,
      itemWidth,
      itemHeight
    } = this.props
    const { count } = this.state

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
          <Text style={{ marginBottom: 0, textAlign: 'center', fontWeight: 'bold', 
          fontSize: 15 }}>
            {`${name}`}
          </Text>
          <Text style={{ marginBottom: 0, textAlign: 'center', color: '#aaa5a5' }}>
            {`${totalShop} quán cafe`}
          </Text>
        </View>
      </TouchableOpacity>
    )
  }
}

export default withNavigation(StyleItem)
