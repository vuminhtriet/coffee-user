import React, { Component } from 'react'
import {
  View
} from 'react-native'
import DefaultPage from '../common/hocs/defaultPage'
import HeaderTitle from '../common/components/elements/HeaderTitle'
import BookDetail from '../modules/order/containers/BookDetail'
import BookConfirm from '../modules/order/containers/BookConfirm'
import { TEST_URL } from '../common/models'
import axios from 'axios'

export default class BookDetailPage extends Component {
  constructor (props) {
    super(props)
    this.state = {
      order: null,
      loading: true
    }
  }

  componentWillMount() {
    const { navigation } = this.props
    const shop = navigation.getParam('shop', {})
    const memberId = navigation.getParam('memberId', {})

    const filter = {
      "where":{
       "memberId": memberId,
       "shopId": shop.id
      }
    }

    // const url = `${TEST_URL}/api/categories?filter[where][shopId]=${id}`
    const url = `${TEST_URL}/api/orders?filter=${JSON.stringify(filter)}`

    this.setState({ loading: true }, () => {
      axios({
        url,
        timeout: 5000
      })
        .then(response => {
          const data = response.data[0]
          this.setState({
            order: data,
            loading: false
          })
        })
        .catch(e => {
          this.setState({ order: null, loading: false })
        })
    })
  }

  render () {
    const { order } = this.state
    const { navigation } = this.props
    const shop = navigation.getParam('shop', {})
    const memberId = navigation.getParam('memberId', {})
    return (
      <DefaultPage
        blocking={false}
        styles={{ flexDirection: 'column' }}
      >
        <View style={{ width: '100%' }}>
          <HeaderTitle
            title='Đặt chỗ'
            onBack={() => navigation.goBack()} />
        </View>
        { order
        ?<View style={{ width: '100%', flex: 1 }}>
          {/* <BookDetail
            navigation={navigation}
            shop={shop}
          /> */}
          <BookConfirm
            navigation={navigation}
            shopId={shop.id}
            memberId={memberId}
          />
        </View>
        :<View style={{ width: '100%', flex: 1 }}>
          {/* <BookConfirm
            navigation={navigation}
            shopId={shop.id}
            memberId={memberId}
          /> */}
          <BookDetail
            navigation={navigation}
            shop={shop}
          />
        </View>}
      </DefaultPage>
    )
  }
}
