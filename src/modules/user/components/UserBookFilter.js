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
import OptionFilter from '../components/OptionFilter'
import StatusFilter from '../components/StatusFilter'

const FILTER_LIST = [
  {
    id: 1,
    title: 'Trạng thái'
  },
  {
    id: 2,
    title: 'Sắp xếp'
  }
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

export default class BookFilterList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      refreshing: false,
      showOption: false,
      showStatus: false
    }
  }

  openModal = (id) => {
    const { showOption, showStatus } = this.state
    switch (id) {
      case 1:
        this.setState({ showStatus: !showStatus })
        break;
      case 2:
        this.setState({ showOption: !showOption })
        break;
      default:
        break;
    }
  }

  closeModal = () => {
    this.setState({ showStatus: false, showOption: false })
  }

  render() {
    const { 
      toggleFilter,
      chooseOption, 
      chosenOption,
      chooseStatus,
      chosenStatus,
      getOrders
    } = this.props
    const { showStatus, showOption } = this.state
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
          <HeaderTitle onBack={getOrders()} title={`Chọn bộ lọc`} />
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

        <Modal
          animationType='none'
          transparent
          visible={showStatus}
        >
          <StatusFilter
            chosenStatus={chosenStatus}
            chooseStatus={chooseStatus}
            closeModal={this.closeModal}
            getOrders={getOrders}
          />
        </Modal>

        <Modal
          animationType='none'
          transparent
          visible={showOption}
        >
          <OptionFilter
            chosenOption={chosenOption}
            chooseOption={chooseOption}
            closeModal={this.closeModal}
            getOrders={getOrders}
          />
        </Modal>
      </View>)
  }
}
