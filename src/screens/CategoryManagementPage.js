import React, { Component } from 'react'
import {
  View,
  Text,
  TouchableOpacity
} from 'react-native'
// import { Button } from 'react-native-elements'
import { SCREENS } from '../common/screens'
import DefaultPage from '../common/hocs/defaultPage'
import HeaderTitle from '../common/components/elements/HeaderTitle'
// import BorderButton from '../common/components/elements/BorderButton'
import CategoryList from '../modules/shop/containers/CategoryList'

export default class CategoryManagementPage extends Component {
  constructor (props) {
    super(props)
    this.state = {
      addCategoryModal: false
    }
    this.goBack = this.goBack.bind(this)
    this.openAddCategory = this.openAddCategory.bind(this)
  }
  goBack () {
    const { navigation } = this.props
    navigation.goBack()
  }

  openAddCategory () {
    const { addCategoryModal } = this.state
    this.setState({
      addCategoryModal: !addCategoryModal
    })
  }

  render () {
    const { addCategoryModal } = this.state
    return (
      <DefaultPage
        blocking={false}
        styles={{ flexDirection: 'column' }}
      >
        <View style={{ width: '100%' }}>
          <HeaderTitle
            title='Danh mục quán'
            onBack={this.goBack}
            rightIcon={
              // <BorderButton
              //   inStyle={{
              //     position: 'absolute',
              //     right: 5,
              //     zIndex: 1,
              //     height: 30,
              //     borderColor: '#FFFFFF'
              //   }}
              //   title='+ Add'
              //   onPress={this.openAddCategory}
              // />
              <TouchableOpacity
                style={{
                  position: 'absolute',
                  right: 10,
                  zIndex: 1,
                  height: 30,
                  borderColor: '#FFFFFF',
                  justifyContent: 'center'
                }}
                onPress={this.openAddCategory}
              >
                <Text style={{ color: '#FFFFFF', fontSize: 18 }}>+ Thêm</Text>
              </TouchableOpacity>
            }
          />
        </View>
        <View style={{ width: '100%', flex: 1 }}>
          <CategoryList
            addCategoryModal={addCategoryModal}
            openAddCategory={this.openAddCategory}
          />
        </View>
      </DefaultPage>
    )
  }
}
