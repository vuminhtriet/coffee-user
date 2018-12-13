import React, { Component, PureComponent } from 'react'
import {
  ScrollView,
  View,
  Platform,
  TouchableOpacity
} from 'react-native'
import { ListItem, List, Card, CheckBox } from 'react-native-elements'
import { ifIphoneX } from 'react-native-iphone-x-helper'
import HeaderTitle from '../../../common/components/elements/HeaderTitle'
import { DETAIL_POINT_SORT_LIST } from '../../../common/models';

class SortItem extends PureComponent {
  _onPress = () => {
    const { id, onSort } = this.props
    onSort(id)
  }

  render() {
    const { id, title, isChecked } = this.props
    return (
      <ListItem
        key={id}
        title={title}
        leftIcon={{
          name: isChecked ? 'dot-circle-o' : 'circle-o',
          type: 'font-awesome',
          color: isChecked ? '#67B6F4' : '#000'
        }}
        onPress={this._onPress}
        hideChevron={true}
        containerStyle={{ borderBottomWidth: 0, borderTopWidth: 0 }}
      />
    )
  }
}

export default class ProductSortList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      refreshing: false
    }
  }

  render() {
    const { toggleSort, sortType, onSort } = this.props
    return (
      <View style={{
        width: '100%',
        height: '100%',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        ...Platform.select({
          ios: ifIphoneX({
            paddingTop: 32
          }, {
              paddingTop: 20
            }),
          android: {
            paddingTop: 0
          }
        })
      }}>
        <TouchableOpacity
          onPress={toggleSort}
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backgroundColor: '#000',
            opacity: 0.2
          }}
        />
        <Card
          title='Tìm theo:'
          containerStyle={{
            width: '80%',
            height: '80%',
            borderRadius: 5
          }}
          titleStyle={{ textAlign: 'left' }}
        >
          {
            DETAIL_POINT_SORT_LIST.map((item) => (
              <SortItem
                id={item.id}
                title={item.title}
                value={item.value}
                isChecked={item.id === sortType.id}
                onSort={onSort}
              />
            ))
          }
        </Card>
      </View>)
  }
}
