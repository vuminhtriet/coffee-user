import React, { Component } from 'react'
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet
} from 'react-native'

import { Avatar, Divider } from 'react-native-elements'
import { timestampToDatetime, getInitials } from '../../../common/utils/format'
import { SCREENS } from '../../../common/screens'
import { STRING_DELIMITER } from '../models'

export default class HistoryItem extends Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  componentDidMount () {
    this.getOpponentInfo()
  }

  async getOpponentInfo () {
    const { item, getUserInfo, token, userList } = this.props
    const currentUserId = this.props.user.id
    const memberIds = item.id.split(STRING_DELIMITER)
    const opponentUserId = currentUserId == memberIds[0] ? memberIds[1] : memberIds[0]
    if (userList[opponentUserId + '']) {
      this.setState({opponentUser: userList[opponentUserId + '']})
      return
    }
    const result = await getUserInfo(token, opponentUserId)
    if (result) {
      this.setState({opponentUser: result})
    }
  }

  openShopDetail = () => {
    const { navigation } = this.props
    const { opponentUser } = this.state
    if (opponentUser && opponentUser.shop) {
      navigation.navigate(SCREENS.StoreDetail, { id: opponentUser.shop.id })
    }
  }

  render () {
    const { item, openChatDetail, getUserInfo } = this.props
    const { opponentUser } = this.state
    const currentUserId = this.props.user.id
    const memberIds = item.id.split(STRING_DELIMITER)
    const opponentUserId = currentUserId == memberIds[0] ? memberIds[1] : memberIds[0]
    const isChatWithShop = opponentUserId == memberIds[1]
    const readStatus = item.readStatus ? item.readStatus[currentUserId] : true
    let userTextStyle = styles.userText
    let messageTextStyle = styles.messageText
    let dateTextStyle = styles.dateText
    const unReadStyle = styles.unRead

    if (!readStatus) {
      userTextStyle = StyleSheet.flatten([userTextStyle, unReadStyle])
      messageTextStyle = StyleSheet.flatten([messageTextStyle, unReadStyle])
      dateTextStyle = StyleSheet.flatten([dateTextStyle, unReadStyle])
    }

    let text = item.message
    const isSend = item.sender == currentUserId
    switch (item.messageType) {
      case 2:
        text = isSend ? 'You send a picture' : 'You receive a picture'
        break
      case 3:
        text = isSend ? 'You send a product link' : 'You receive a product link'
        break
    }

    let name = ''
    let title = ''
    let userAvatar = 'https://cdn1.iconfinder.com/data/icons/user-pictures/101/malecostume-512.png'
    if (opponentUser != null) {
      name = opponentUser.displayName
      if (isChatWithShop && opponentUser.shop && opponentUser.shop.name) {
        name = opponentUser.shop.name
      }
      if (opponentUser.images && opponentUser.images.length > 0) {
        userAvatar =  opponentUser.images[0].fullUrl
      }
      title = getInitials(name)
    }

    return (
      <View>
        <TouchableOpacity style={styles.itemContainer} onPress={() => openChatDetail(item)}>
          <Avatar
            small
            rounded
            title={title}
            source={{ uri: userAvatar }}
            activeOpacity={0.7}
            onPress={() => this.openShopDetail()}
          />
          <View style={styles.contentContainer}>
            <Text style={userTextStyle}>
              {`${name}`}
            </Text>
            <Text style={messageTextStyle}>
              {text}
            </Text>
          </View>
          <View>
            <Text style={dateTextStyle}>
              {timestampToDatetime(item.createdAt)}
            </Text>
          </View>
        </TouchableOpacity>
        <Divider style={styles.itemDivider} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginLeft: 6,
    marginBottom: 8
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginLeft: 10
  },
  userText: {
    color: 'gray',
    fontSize: 14
  },
  messageText: {
    color: 'gray',
    fontSize: 12
  },
  dateText: {
    color: 'gray',
    fontSize: 12,
    marginRight: 10
  },
  unRead: {
    color: 'black'
  },
  itemDivider: {
    backgroundColor: '#9C9C9C',
    marginLeft: 50
  }
})
