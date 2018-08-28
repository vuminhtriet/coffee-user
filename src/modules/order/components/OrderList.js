import React, { Component } from 'react'
import {
  FlatList,
  Text,
  View,
  TouchableOpacity
} from 'react-native'
import { Card, Button } from 'react-native-elements'
import { ORDER_STATUS } from '../models'

export default class OrderList extends Component {
  constructor (props) {
    super(props)
    this.state = {
      refreshing: false
    }

    this.onRefresh = this.onRefresh.bind(this)
    this.onLoadMore = this.onLoadMore.bind(this)
    this.renderItem = this.renderItem.bind(this)
    this.keyExtractor = this.keyExtractor.bind(this)
  }

  onRefresh () {
  }

  onLoadMore () {
  }

  keyExtractor (item) {
    return item.id
  }

  renderItem ({ index, item }) {
    const { itemPress } = this.props
    return (
      <Card
        containerStyle={{ width: undefined, height: 180, margin: 5 }}
        wrapperStyle={{ flexDirection: 'column', height: '100%' }}
      >
        <TouchableOpacity
          onPress={() => itemPress(item, index)}
          style={{
            position: 'absolute',
            zIndex: 999,
            right: -10,
            top: 0,
            width: 120,
            height: 60}}
          >
          <Button
            backgroundColor='green'
            onPress={() => itemPress(item, index)}
            buttonStyle={{ padding: 5, borderRadius: 5 }}
            icon={{name: 'pencil', type: 'foundation', buttonStyle: { marginLeft: 0 }}}
            title='Detail'
          />
        </TouchableOpacity>
        <Text style={{marginBottom: 0, textAlign: 'left', fontWeight: 'bold'}}>
          {`${item.title}`}
        </Text>
        <Text style={{marginLeft: 5, textAlign: 'left'}}>
          {`Cartid: ${item.id}`}
        </Text>
        <Text style={{marginLeft: 5, textAlign: 'left'}}>
          {`Date: ${item.date}`}
        </Text>
        <Text style={{marginLeft: 5, textAlign: 'left'}}>
          {`Customer: ${item.user.name}`}
        </Text>
        <Text style={{marginLeft: 5, textAlign: 'left'}}>
          {`Total amount: ${item.total} USD (2 items)`}
        </Text>
        <Text style={{marginLeft: 5, textAlign: 'left'}}>
          <Text style={{marginBottom: 0, textAlign: 'left', fontWeight: 'bold'}}>
            Status:
          </Text>
          {` ${ORDER_STATUS[item.status]} `}
        </Text>
      </Card>
    )
  }

  render () {
    const { refreshing, numColumns } = this.state
    const { data } = this.props

    return (
      <View
        style={{
          width: '100%',
          height: undefined
        }}>
        <FlatList
          key={numColumns}
          data={data}
          refreshing={refreshing}
          extraData={{ data }}
          keyExtractor={this.keyExtractor}
          renderItem={this.renderItem}
          onRefresh={this.onRefresh}
          onEndReached={this.onLoadMore}
          onEndReachedThreshold={1}
        />
      </View>)
  }
}
