import React, { Component } from 'react'
import {
  FlatList,
  Text,
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions
} from 'react-native'
import { Avatar, Divider, CheckBox, Button, Icon } from 'react-native-elements'
import DefaultPage from '../../../common/hocs/defaultPage'
import HeaderTitle from '../../../common/components/elements/HeaderTitle'
import { getTop2ActivePrice, getFirstImgUrl } from '../../../common/utils/productUtils'
const { height } = Dimensions.get('window')

const primaryColor = "#6F4E37";
const darkGrey = "#bdc3c7";

function showPrices (price, index, currencyUnits) {
  const cashUnit = price.cashUnitId ? currencyUnits.find(item => item.id === price.cashUnitId) : null
  const electricUnit = price.electricUnitId ? currencyUnits.find(item => item.id === price.electricUnitId) : null
  return (
    <View
      key={index}
      style={{ display: 'flex', flexDirection: 'row' }}
    >
      {
        cashUnit && electricUnit
          ? <Text style={{ fontSize: 14, color: '#6F4E37', fontWeight: 'bold' }} numberOfLines={1}>
            {price.cashValue}<Text style={{ fontSize: 10 }}>{cashUnit ? cashUnit.code : ''}</Text> + {price.electricValue}<Text style={{ fontSize: 10 }}>{electricUnit ? electricUnit.code : ''}</Text>
          </Text>
          : cashUnit && !price.electricValue
            ? <Text style={{ fontSize: 14, color: '#6F4E37', fontWeight: 'bold' }} numberOfLines={1}>{price.cashValue}<Text style={{ fontSize: 10 }}>{cashUnit ? cashUnit.code : ''}</Text></Text>
            : electricUnit && !price.cashValue
              ? <Text style={{ fontSize: 14, color: '#6F4E37', fontWeight: 'bold' }} numberOfLines={1}>{price.electricValue}<Text style={{ fontSize: 10 }}>{electricUnit ? electricUnit.code : ''}</Text></Text>
              : null
      }
    </View>
  )
}


export default class ChooseProduct extends Component {
  constructor(props) {
    super(props)
    this.state = {
      refreshing: false,
      datas: []
    }
  }

  async getProductList() {
    const { getShopProducts, user, token } = this.props
    const result = await getShopProducts(user.shop)
    if (result) {
      this.setState({ datas: result })
    }
  }

  componentDidMount() {
    this.getProductList()
  }

  keyExtractor(item) {
    return item.id
  }

  onRefresh = () => {
  }

  onLoadMore = () => {
  }

  onSelectProduct = (item) => {
    item.checked = !item.checked
    this.setState({ datas: this.state.datas })
  }

  onSendProductLink = () => {
    let choosenProductIds = []
    this.state.datas.forEach(item => {
      if (item.checked)
        choosenProductIds.push(item.id)
    })
    this.props.onChooseProduct(choosenProductIds)
  }

  renderItem = ({ index, item }) => {
    const { currencyUnits} = this.props
    const { images } = item
    const fullUrl = getFirstImgUrl(images)
    return (
      <View>
        <TouchableOpacity style={styles.itemContainer} onPress={() => this.onSelectProduct(item)}>
          {item.checked
            ? (
              <Icon type='ionicon' name="ios-checkbox" size={22} color={primaryColor}></Icon>
            )
            : (
              <Icon type='ionicon' name="ios-square-outline" size={22} color={darkGrey}></Icon>
            )}
          {fullUrl
            ? <Image
              style={{ height: 40, width: 40, marginLeft: 10 }}
              source={{ uri: fullUrl }}
            /> : <Image
              style={{ height: 40, width: 40, marginLeft: 10 }}
              source={require('../../../assets/placeholder.png')}
            />
          }
          <View style={styles.contentContainer}>
            <Text style={styles.productDesciption}>
              {item.name}
            </Text>
            <View style={{ marginBottom: 0, marginTop: 3 }}>
            {item.productPrices && getTop2ActivePrice(item.productPrices).map((price, index) => showPrices(price, index, currencyUnits))}
            </View>
          </View>
        </TouchableOpacity>
        <Divider style={styles.itemDivider} />
      </View>
    )
  }

  render() {
    const { refreshing, datas } = this.state
    const { offset, onCancelChooseProduct } = this.props

    return (
      <DefaultPage style={{ width: '100%', height: '100%', display: 'flex', flex: 1, flexDirection: 'column' }}>
        <HeaderTitle
          title='Choose Product'
          onBack={onCancelChooseProduct} />
        <View style={styles.productList}>
          <FlatList
            data={datas}
            refreshing={refreshing}
            extraData={{ datas, offset }}
            keyExtractor={this.keyExtractor}
            renderItem={this.renderItem}
            onRefresh={this.onRefresh}
            onEndReached={this.onLoadMore}
            onEndReachedThreshold={1}
          />
        </View>
        <Button
          style={{ width: '100%', height: 30, marginTop: 10 }}
          title='Send Production Link'
          backgroundColor={primaryColor}
          color='white'
          onPress={this.onSendProductLink} />
      </DefaultPage>
    )
  }
}


const styles = StyleSheet.create({
  productList: {
    height: '80%'
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 8,
    marginLeft: 10,
    marginRight: 10
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginLeft: 10,
  },
  productDesciption: {
    color: 'black'
  },
  itemDivider: {
    backgroundColor: '#9C9C9C'
  }
})