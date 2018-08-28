import React, { Component, PureComponent } from 'react'
import {
  FlatList,
  View,
  TouchableOpacity,
  Text
} from 'react-native'
import {
  ListItem,
  CheckBox
} from 'react-native-elements'
import HeaderTitle from '../../../common/components/elements/HeaderTitle'
import SubHeader from '../../../common/components/elements/SubHeader'

class CategoryItem extends PureComponent {
  _onPress = () => {
    const { chooseCategory, id } = this.props
    console.log(id);
    chooseCategory(id)
  }

  render() {
    const { id, name, isChecked } = this.props
    return (
      <ListItem
        key={id}
        title={name}
        rightIcon={{
          name: 'check',
          color: 'green'
        }}
        hideChevron={isChecked ? false : true}
        onPress={this._onPress}
      />
    )
  }
}

export default class CategoryFilter extends Component {
  constructor(props) {
    super(props)
    this.state = {
      refreshing: false
    }
  }

  _keyExtractor = (item) => item.id

  _renderItem = ({ item }) => {
    const { chosenCategories, chooseCategory } = this.props
    console.log(chosenCategories);
    return (
      <CategoryItem
        id={item.id}
        name={item.name}
        isChecked={chosenCategories.includes(item.id)}
        chooseCategory={chooseCategory}
      />
    )
  }

  _onLoadMore = () => {

  }

  _onRefresh = () => {

  }

  render() {
    const { refreshing } = this.state
    const { categories, onFilter, closeModal, chosenCategories } = this.props
    return (
      <View
        style={{
          width: '100%',
          height: '100%',
          flexDirection: 'column',
          backgroundColor: '#fff'
        }}
      >
        <View style={{ width: '100%', height: 40 }}>
          <HeaderTitle title='Category' />
        </View>
        <SubHeader
          onLeftComponent={
            <View>
              <CheckBox
                title='All'
                checkedIcon='dot-circle-o'
                uncheckedIcon='circle-o'
                checked={true}
                containerStyle={{ backgroundColor: '#fff', borderBottomColor: '#000' }}
              />
            </View>
          }
          onRightComponent={
            <TouchableOpacity
              style={{ marginRight: 12, display: 'flex', flexDirection: 'row', justifyContent: 'center' }}
              onPress={closeModal}
            >
              <Text style={{ fontSize: 16, lineHeight: 26 }}>Done</Text>
            </TouchableOpacity>
          }
        />

        <FlatList
          data={categories}
          refreshing={refreshing}
          extraData={chosenCategories.length}
          renderItem={this._renderItem}
          keyExtractor={this._keyExtractor}
          onRefresh={this._onRefresh}
          onEndReached={this._onLoadMore}
          onEndReachedThreshold={0.3}
        />
      </View>)
  }
}
