import React from 'react'
import {
  View
} from 'react-native'
import { Icon, Badge } from 'react-native-elements'
import { connect } from 'react-redux'
import { MODULE_NAME as MODULE_PRODUCT_DETAIL } from '../../../modules/productDetails/models'

const TabBarIcon = ({ focused, tintColor, totalItem }) => {
  return ([
    <Icon
      key='icon'
      name='shopping-bag'
      type='font-awesome'
      size={focused ? 28 : 24}
      color={focused ? tintColor : '#cccc'}
    />
    //   <View
    //     key='badge'
    //     style={{
    //       width: 60,
    //       height: 60,
    //       paddingTop: 10,
    //       alignItems: 'flex-end',
    //       position: 'absolute',
    //       zIndex: 100
    //     }}
    // >
    //     <Badge
    //       key='badge'
    //       value={totalItem}
    //       containerStyle={{
    //         backgroundColor: '#FC4655',
    //         width: 25,
    //         padding: 1
    //       }}
    //       textStyle={{ color: '#FFFFFF', fontSize: 9 }}
    //   />
    //   </View>
  ])
}

const mapStateToProps = state => {
  return {
    totalItem: state[MODULE_PRODUCT_DETAIL].cartSummary.totalItem
  }
}

export default connect(mapStateToProps)(TabBarIcon)
