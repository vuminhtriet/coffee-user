import React, { Component } from 'react'
import {
  ScrollView,
  View,
  Modal
} from 'react-native'
import DefaultPage from '../../../common/hocs/defaultPage'
import StoreImages from './StoreImages'
import StoreTitle from './StoreTitle'
import StoreContact from './StoreContact'
import StoreSummary from './StoreSummary'
import StorePayment from './StorePayment'
import StoreShipping from './StoreShipping'
import StoreRatingAndComment from './StoreRatingAndComment'
import StoreSubMenu from '../../store/containers/StoreSubMenu'
import WriteReview from '../../store/containers/WriteReview'

export default class StoreInformation extends Component {

  constructor(props) {
    super(props)

    this.state = {
      showWriteReview: false,
    }
  }

  onToggleWriteReview = () => {
    const { getStoreInformation } = this.props
    const { showWriteReview } = this.state
    this.setState({ showWriteReview: !showWriteReview })
  }

  onToggleBackWriteReview = () => {
    const { getStoreInformation, detail } = this.props
    const { showWriteReview } = this.state
    getStoreInformation(detail.id)
    this.setState({ showWriteReview: !showWriteReview })
  }

  render () {
    const { detail, shippingTypes, paymentTypes, navigation } = this.props
    const { showWriteReview } = this.state
    return (
      <DefaultPage
        blocking={false}
        style={{ flexDirection: 'column' }}
      >
        <View style={{ flex: 1 }}>
          {/* {detail && */}
            <ScrollView style={{ marginBottom: 70 }}>
              <StoreImages images={detail.shopFeaturedImages} />
              <StoreTitle shop={detail} />
              <StoreContact shop={detail} />
              <StoreSummary shop={detail} />
              <StoreRatingAndComment
                ratings={detail.reviewShops}
                totalRatingValue={detail.avgRating}
                totalUserRating={detail.numRating}
                newestRatings={detail.reviewShops && detail.reviewShops.sort(function(a,b){
                  return new Date(b.date) - new Date(a.date);
                }).slice(0, 2)}
                shopId={detail && detail.id}
                images={detail.shopFeaturedImages}
                shopName={detail.shopName}
                navigation={navigation}
              />
              {/* <StoreReview shop={detail} /> */}
              {/* <StorePayment shop={detail} paymentTypes={paymentTypes} />
              <StoreShipping shop={detail} shippingTypes={shippingTypes} /> */}
            </ScrollView>
          {/* } */}
          
          <StoreSubMenu
            onToggleWriteReview={this.onToggleWriteReview}
            navigation={navigation}
            shopInfo={detail}
          />

          <Modal
            animationType='slide'
            transparent={true}
            visible={showWriteReview}
          >
            <WriteReview
              shopId={detail && detail.id}
              onBack={this.onToggleBackWriteReview}
              onButtonBack={this.onToggleWriteReview}
              images={detail.shopFeaturedImages}
              shopName={detail.shopName}
              ratings={detail.reviewShops}
            />
          </Modal>
        </View>
      </DefaultPage>
    )
  }
}
