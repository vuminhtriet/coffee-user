import React, { Component, PureComponent } from 'react'
import {
  ScrollView,
  View,
  Platform,
  Modal
} from 'react-native'
import { ListItem, List } from 'react-native-elements'
import { ifIphoneX } from 'react-native-iphone-x-helper'
import HeaderTitle from '../../../common/components/elements/HeaderTitle'
import StyleFilter from '../containers/StyleFilter'
import PriceFilter from '../containers/PriceFilter'
import LocationFilter from '../containers/LocationFilter'
import SubMenuFilter from './SubMenuFilter'

const FILTER_LIST = [
  {
    id: 1,
    title: 'Phong cách quán'
  },
  {
    id: 2,
    title: 'Vị trí'
  },
  {
    id: 3,
    title: 'Giá'
  },
]

class FilterItem extends PureComponent {
  _onPress = () => {
    const { toggleModal, id } = this.props
    toggleModal(id)
  }

  render() {
    const { title, id } = this.props
    return (
      <ListItem
        key={id}
        title={title}
        containerStyle={{ borderBottomColor: '#e1e6ea' }}
        onPress={this._onPress}
      />
    )
  }
}

export default class ProductFilterList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      refreshing: false,
      showStyle: false,
      showLocation: false,
      showPrice: false
    }
  }

  openModal = (id) => {
    const { showStyle, showLocation, showPrice } = this.state
    switch (id) {
      case 1:
        this.setState({ showStyle: !showStyle })
        break;
      case 2:
        this.setState({ showLocation: !showLocation })
        break;
      case 3:
        this.setState({ showPrice: !showPrice })
        break;
      default:
        break;
    }
  }

  closeModal = () => {
    this.setState({ showStyle: false, showLocation: false, showPrice: false })
  }

  render() {
    const { 
      toggleFilter, 
      chosenStyle,
      chooseStyle, 
      chosenPrice, 
      choosePrice,
      chooseLocation,
      chosenLocation,
      resetFilter,
      onFilter
    } = this.props
    const { showStyle, showLocation, showPrice } = this.state
    return (
      <View style={{
        width: '100%',
        height: '100%',
        flexDirection: 'column',
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
        <View style={{ width: '100%' }}>
          <HeaderTitle onBack={toggleFilter} title={`Chọn bộ lọc`} />
        </View>

        <ScrollView>
          <List containerStyle={{ margin: 0, borderTopWidth: 0 }}>
            {FILTER_LIST.map(item => (
              <FilterItem
                title={item.title}
                id={item.id}
                toggleModal={this.openModal}
              />
            ))}
          </List>
          {/* </Card> */}
        </ScrollView>

        <SubMenuFilter resetFilter={resetFilter} applyFilter={onFilter} />

        <Modal
          animationType='none'
          transparent
          visible={showStyle}
        >
          <StyleFilter
            chosenStyle={chosenStyle}
            chooseStyle={chooseStyle}
            closeModal={this.closeModal}
          />
        </Modal>

        <Modal
          animationType='none'
          transparent
          visible={showLocation}
        >
          <LocationFilter
            chosenLocation={chosenLocation}
            chooseLocation={chooseLocation}
            closeModal={this.closeModal}
          />
        </Modal>

        <Modal
          animationType='none'
          transparent
          visible={showPrice}
        >
          <PriceFilter
            chosenPrice={chosenPrice}
            choosePrice={choosePrice}
            closeModal={this.closeModal}
          />
        </Modal>
      </View>)
  }
}
