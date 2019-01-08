import React, { Component, PureComponent } from 'react'
import {
  View,
  Modal,
  Dimensions,
  TouchableOpacity,
  Text
} from 'react-native'
import { Icon } from 'react-native-elements'
import BookList from '../containers/BookList'
import BookDetail from '../containers/BookDetail'
import SubHeader from '../../../common/components/elements/SubHeader'
import ModalWrapper from '../../../common/components/elements/Modal'
import UserBookFilter from '../components/UserBookFilter'
import OptionFilter from '../components/OptionFilter'
import StatusFilter from '../components/StatusFilter'
import { BOOK_OPTION_LIST, BOOK_STATUS_LIST } from '../../../common/models'
const { height } = Dimensions.get('window')

const OPTION = BOOK_OPTION_LIST.find(item => item.type === 1)

const STATUS = BOOK_STATUS_LIST.find(item => item.type === 1)

export default class BookManagement extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      modalVisible: false,
      id: null,
      chosenStatus: STATUS || {},
      chosenOption: OPTION || {},
      showOption: false,
      showStatus: false
    }
  }

  onRefresh = () => {
    const { getOrders, id, token } = this.props
    const { chosenOption, chosenStatus } = this.state
    id && token && getOrders(id, token, chosenOption.value, chosenStatus.value)
  }

  openModal = (id) => {
    this.setState({
      modalVisible: true,
      id: id
    })
  }

  toggleOption = () => {
    const { showOption } = this.state
    this.setState({
      showOption: !showOption
    })
  }

  toggleStatus = () => {
    const { showStatus } = this.state
    this.setState({
      showStatus: !showStatus
    })
  }

  closeModal = () => {
    this.setState({
      modalVisible: false,
      id: null
    })
  }

  closeFilter = () => {
    this.setState({ showStatus: false, showOption: false })
  }

  componentDidMount() {
    const { getOrders, id, token } = this.props
    const { chosenOption, chosenStatus } = this.state
    id && token && getOrders(id, token, chosenOption.value, chosenStatus.value)
  }

  getOrders = () => {
    const { id, token, getOrders } = this.props
    const { chosenOption, chosenStatus } = this.state
    getOrders(id, token, chosenOption.value, chosenStatus.value)
  }

  // onSortType = () => {
  //   const { openSort } = this.state
  //   this.setState({
  //     openSort: !openSort
  //   })
  // }

  onSortStatus = (code) => {
    const { id, token, getOrders } = this.props
    const { chosenStatus, showStatus, chosenOption } = this.state
    if (chosenStatus.id === code) {
      return false
    }
    else {
      const newchosenStatus = BOOK_STATUS_LIST.find(item => item.id === code)
      this.setState({ refreshing: true, showStatus: !showStatus }, async () => {
        getOrders(id, token, chosenOption.value, newchosenStatus.value)
        this.setState({ refreshing: false, chosenStatus: newchosenStatus })
      })
    }
  }

  onSortOption = (code) => {
    const { id, token, getOrders } = this.props
    const { chosenOption, showOption, chosenStatus } = this.state
    if (chosenOption.id === code) {
      return false
    }
    else {
      const newchosenOption = BOOK_OPTION_LIST.find(item => item.id === code)
      this.setState({ refreshing: true, showOption: !showOption }, async () => {
        getOrders(id, token, newchosenOption.value, chosenStatus.value)
        this.setState({ refreshing: false, chosenOption: newchosenOption })
      })
    }
  }

  chooseStatus = (item) => {
    const { chosenStatus } = this.state
    this.setState({ chosenStatus: item })
  }

  chooseOption = (item) => {
    const { chosenOption } = this.state
    this.setState({ chosenOption: item })
  }

  render() {
    const { orders } = this.props
    const { modalVisible, id, chosenOption, chosenStatus, showOption, showStatus } = this.state

    return (
      <View
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: '#ffffff',
          flex: 1,
          paddingBottom: 5
        }}>

        <SubHeader
          onLeftComponent={
            <View style={{ marginLeft: 12 }}>
              <TouchableOpacity
                onPress={this.toggleOption}
              >
                <Text style={{ fontSize: 16 }}>Sắp xếp theo {chosenOption.title.toLowerCase()}</Text>
              </TouchableOpacity>
            </View>
          }
          onRightComponent={
            <TouchableOpacity
              style={{ marginRight: 12, display: 'flex', flexDirection: 'row', justifyContent: 'center' }}
              onPress={this.toggleStatus}
            >
              <Icon
                name={'sort'}
                size={26}
                color='black'
                containerStyle={{}}
              />
              <Text style={{ fontSize: 16, lineHeight: 26 }}>Bộ lọc</Text>
            </TouchableOpacity>
          }
        />

        <BookList
          itemPress={this.openModal}
          data={orders}
          onRefresh={this.onRefresh}
        />

        <Modal
          animationType='slide'
          transparent={false}
          visible={modalVisible && id !== null}
        >
          <View style={{ width: '100%', flex: 1 }}>
            <BookDetail
              id={id}
              onBack={this.closeModal}
              getOrders={this.getOrders} />
          </View>
        </Modal>

        {/* <ModalWrapper
          animationType='slide'
          transparent={false}
          visible={openSort}
        >
          <UserBookFilter
            toggleFilter={this.onSortType}
            getOrders={this.getOrders}
            chooseOption={this.chooseOption}
            chosenOption={chosenOption}
            chooseStatus={this.chooseStatus}
            chosenStatus={chosenStatus}
          />
        </ModalWrapper> */}

        <Modal
          animationType='none'
          transparent
          visible={showStatus}
        >
          <StatusFilter
            chosenStatus={chosenStatus}
            chooseStatus={this.chooseStatus}
            closeModal={this.closeFilter}
            onSort={this.onSortStatus}
          />
        </Modal>

        <Modal
          animationType='none'
          transparent
          visible={showOption}
        >
          <OptionFilter
            chosenOption={chosenOption}
            chooseOption={this.chooseOption}
            closeModal={this.closeFilter}
            onSort={this.onSortOption}
          />
        </Modal>

      </View>
    )
  }
}
