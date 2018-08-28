import React, { Component } from 'react'
import {
  FlatList,
  Text,
  View,
  Modal,
  TouchableOpacity,
  TextInput,
  Button,
  Dimensions
} from 'react-native'
import { Avatar, Divider, SearchBar } from 'react-native-elements'
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import FilterHistory from './FilterHistory'
import HistoryItem from './HistoryItem'
import { STRING_DELIMITER } from '../models'
import { SCREENS } from '../../../common/screens'
import styles from '../styles/chatHistoryStyles'
import { timestampToDatetime } from '../../../common/utils/format'
import HeaderTitle from '../../../common/components/elements/HeaderTitle'
const { height } = Dimensions.get('window')

export default class ChatHistory extends Component {
  constructor(props) {
    super(props)
    this.state = {
      refreshing: false,
      openFilter: false,
      showNewConversation: false,
    }

    this.onRefresh = this.onRefresh.bind(this)
    this.onLoadMore = this.onLoadMore.bind(this)
    this.keyExtractor = this.keyExtractor.bind(this)
  }

  componentDidMount() {
    const { loadConversations, user, navigation } = this.props
    this.unsubscribe = loadConversations(user.id + '')
  }

  componentWillUnmount() {
    if (this.unsubscribe)
      this.unsubscribe()
    const { setConversations } = this.props
    setConversations([])
  }

  onRefresh() {
  }

  onLoadMore() {
    //Load more chat
  }

  keyExtractor(item) {
    return item.id
  }

  onSearchChangeText = (text) => {
    this.updateFilter(text)
  }

  onSearchClearText = () => {
    this.updateFilter('')
  }

  updateFilter = (text) => {
    const { historyFilter, updateHistoryFilter } = this.props
    let newHistoryFilter = { ...historyFilter, ...{ userFilter: text } }
    updateHistoryFilter(newHistoryFilter)
  }

  onFilterMessage = () => {
    const { openFilter } = this.state
    this.setState({
      openFilter: !openFilter
    })
  }
  closeHistoryFilter = () => {
    const { openFilter } = this.state
    this.setState({
      openFilter: false
    })
  }

  openChatDetail = (item) => {
    const { navigation } = this.props
    navigation.navigate(SCREENS.ChatDetailPage, { conversationId: item.id })
  }

  openNewChat = () => {
    const { navigation, user } = this.props
    const conversationId = user.id + STRING_DELIMITER + this.state.newChatUserId
    this.setState({ showNewConversation: false })
    navigation.navigate(SCREENS.ChatDetailPage, { conversationId: conversationId })
  }

  onCloseChat = () => {
    const { navigation } = this.props
    navigation.goBack()
  }

  render() {
    const { refreshing, showNewConversation, openFilter } = this.state
    const { user, token, displayConversations, historyFilter, updateHistoryFilter, getUserInfo, userList, navigation } = this.props
    const offset = 0;
    return (
      <View>
        <HeaderTitle
          title='Chat'
          onBack={this.onCloseChat} />
        <View
          style={{ flexDirection: 'row', alignItems: 'center' }}
        >
          <SearchBar
            lightTheme
            round
            platform="ios"
            onChangeText={(text) => this.onSearchChangeText(text)}
            onClearText={this.onSearchClearText}
            placeholder='Enter username to search'
            containerStyle={styles.searchContainerStyle}
            inputStyle={styles.searchInputStyle} />
          <MaterialIcon
            name={'sort'}
            size={26}
            onPress={this.onFilterMessage} />
          {/* <TouchableOpacity onPress={() => this.setState({ showNewConversation: true })}>
            <Text style={{ marginRight: 20 }}>
              New
            </Text>
          </TouchableOpacity> */}
        </View>
        <Divider style={{ backgroundColor: '#9C9C9C', height: 1 }} />
        <FlatList
          data={displayConversations}
          refreshing={refreshing}
          keyExtractor={this.keyExtractor}
          renderItem={(item, index) => <HistoryItem
            item={item.item}
            index={index}
            openChatDetail={this.openChatDetail}
            user={user}
            token={token}
            getUserInfo={getUserInfo}
            userList={userList}
            navigation={navigation}
          />}
          onRefresh={this.onRefresh}
          onEndReached={this.onLoadMore}
          onEndReachedThreshold={1}
        />
        <Modal
          animationType='slide'
          transparent={false}
          visible={openFilter}
        >
          <View style={{ width: '100%', height }}>
            <FilterHistory
              closeHistoryFilter={this.closeHistoryFilter}
              historyFilter={historyFilter}
              updateHistoryFilter={updateHistoryFilter} />
          </View>
        </Modal>
        <Modal
          animationType='slide'
          transparent={false}
          visible={showNewConversation}
        >
          <View style={{ width: '100%' }}>
            <Text>Input new user to chat</Text>
            <TextInput
              style={{ height: 40 }}
              placeholder="Type here to translate!"
              underlineColorAndroid='transparent'
              onChangeText={(text) => this.setState({ newChatUserId: text })}
            />
            <Button
              onPress={() => this.openNewChat()}
              title='Close'>
            </Button>
          </View>
        </Modal>
      </View>
    )
  }
}