import React, { PureComponent } from 'react'
import {
  Text,
  View
} from 'react-native'
import {
  Card,
  FormLabel,
  Avatar,
  Divider
} from 'react-native-elements'

export default class Details extends PureComponent {
  constructor(props) {
    super(props)
  }

  renderItem = (item) => {
    const images = [...item.product.images]
    const isExistedCover = images.find(elem => elem.type === 2)
    const imageCover = isExistedCover
      ? isExistedCover
      : images.length > 0
        ? images[0]
        : null
    return (
      <View
        key={item.id}
        style={{
          width: undefined,
          height: undefined,
          flexDirection: 'row',
          margin: 15,
          paddingLeft: 5
        }}
      >
        <Avatar
          large
          source={imageCover
            ? { uri: imageCover.fullUrl }
            : require('../../../assets/placeholder.png')
          }
        />
        <View
          style={{
            flex: 1,
            height: 80,
            flexDirection: 'column',
            paddingHorizontal: 20,
            paddingVertical: 0
          }}
        >
          <Text style={{ fontWeight: 'bold' }}>
            {item.product.name}
          </Text>
          <Text style={{
            fontSize: 16,
            color: '#E44C4C',
            fontWeight: 'bold'
          }}>
            {item.unitAmount}
          </Text>
          <Text>
            Options: {item.productVariation ? `${item.productVariation.name}` : 'This variation is unavailable'}
          </Text>
        </View>
        <View
          style={{
            height: 80,
            width: 45,
            alignContent: 'center',
            alignItems: 'center',
            flexDirection: 'row'
          }}
        >
          <Text style={{ fontWeight: 'bold' }}>
            x{` ${item.quantity}`}
          </Text>
        </View>
      </View>
    )
  }

  render() {
    const { details, subTotalAmount, totalItem } = this.props
    return (
      <Card containerStyle={{
        margin: 0,
        padding: 0,
        width: undefined,
        height: undefined
      }}>
        <FormLabel
          containerStyle={{ padding: 0, margin: 0 }}
          labelStyle={{ color: '#6F4E37', padding: 0, fontSize: 16 }}>
          Order details
        </FormLabel>
        {details && details.map(item => {
          return this.renderItem(item)
        })}
        <Divider
          style={{
            backgroundColor: '#9C9C9C',
            height: 1,
            width: '120%',
            marginLeft: -20
          }} />
        <View
          style={{
            height: 50,
            width: undefined,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 15
          }}
        >
          <Text
            style={{
              width: undefined,
              fontWeight: 'bold',
              paddingLeft: 5
            }}
          >
            Subtotal ({`${totalItem}`} items)
          </Text>
          <Text
            style={{
              flex: 1,
              fontWeight: 'bold',
              textAlign: 'right'
            }}
          >
            {`${subTotalAmount}`}
          </Text>
        </View>
      </Card>
    )
  }
}
