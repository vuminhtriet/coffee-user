import React, { Component } from 'react'
import {
  FlatList,
  View
} from 'react-native'

export default class GridView extends Component {
  constructor (props) {
    super(props)
  }

  _keyExtractor = item => item.id

  render () {
    const {
      style,
      data,
      refreshing,
      numberOfColumns,
      itemComponent,
      onRefresh,
      onLoadMore
    } = this.props

    return (
      <View
        style={{
          width: '100%',
          backgroundColor: '#ffffff',
          marginBottom: 5,
          paddingBottom: 5,
          ...style
        }}
      >
        <FlatList
          data={data}
          refreshing={refreshing}
          extraData={{}}
          keyExtractor={this._keyExtractor}
          renderItem={(item, index) => itemComponent({ item, index })}
          onRefresh={onRefresh}
          onEndReached={onLoadMore}
          onEndReachedThreshold={0.3}
          numColumns={numberOfColumns}
          contentContainerStyle={{
            flexDirection: 'column',
            width: '100%',
            justifyContent: 'center'
          }}
        />
      </View>
    )
  }
}
