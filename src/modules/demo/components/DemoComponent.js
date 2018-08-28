import React, { Component } from 'react'
import {
  FlatList,
  Text,
  View
} from 'react-native'
import styles from '../styles/styles'

export default class DemoComponent extends Component {
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
    this.setState({
      refreshing: true
    }, () => {
      const { getCoins, isLoading } = this.props
      !isLoading && getCoins({
        refresh: true,
        callback: () => {
          this.setState({
            refreshing: false
          })
        }
      })
    })
  }

  onLoadMore () {
    const { getCoins, offset, isLoading } = this.props
    !isLoading && getCoins({ offset: offset })
  }

  componentWillMount () {
    const { getCoins, isLoading } = this.props

    !isLoading && getCoins({})
  }

  keyExtractor (item) {
    return item.id
  }

  renderItem ({ index, item }) {
    return (
      <View style={styles.itemContainer}>
        <Text>{ `${index} - ` }</Text>
        <Text>{ `${item.name} : ` }</Text>
        <Text>{ item.price_usd } $</Text>
      </View>
    )
  }

  render () {
    const { refreshing } = this.state
    const { coins, offset } = this.props

    return (
      <FlatList
        data={coins}
        refreshing={refreshing}
        extraData={{ coins, offset }}
        keyExtractor={this.keyExtractor}
        renderItem={this.renderItem}
        onRefresh={this.onRefresh}
        onEndReached={this.onLoadMore}
        onEndReachedThreshold={1}
      />
    )
  }
}
