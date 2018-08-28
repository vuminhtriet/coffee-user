import React, { Component } from 'react'
import {
  ScrollView,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native'
import { Card, ListItem, Icon, Divider} from 'react-native-elements'
import DefaultPage from '../../../common/hocs/defaultPage'
import HeaderTitle from '../../../common/components/elements/HeaderTitle'

export default class FilterHistory extends Component {
  constructor(props) {
    super(props)
    this.state = {
      refreshing: false
    }
  }

  onUpdateFilter = (value) => {
    const { updateHistoryFilter, historyFilter } = this.props
    let newHistoryFilter = {...historyFilter, ...value}
    updateHistoryFilter(newHistoryFilter)
  }

  render() {
    const { closeHistoryFilter, historyFilter } = this.props
    return (
      <DefaultPage style={{ width: '100%', height: '100%', flexDirection: 'column' }}>
        <View style={{ width: '100%' }}>
          <HeaderTitle
            title='Choose a filter'
            onBack={closeHistoryFilter} />
        </View>
        <View style={styles.container}>
          <TouchableOpacity style={styles.itemContainer}
            onPress={()=>this.onUpdateFilter({unreadMsg: !historyFilter.unreadMsg})}>
            <View style={styles.textContainer}><Text >Unread messages</Text></View>   
            {historyFilter.unreadMsg && <Icon name='check' color='green'/>}
          </TouchableOpacity>
          <Divider style={styles.itemDivider} />

          <TouchableOpacity style={styles.itemContainer}
            onPress={()=>this.onUpdateFilter({readMsg: !historyFilter.readMsg})}>
            <View style={styles.textContainer}><Text >Read messages</Text></View>   
            {historyFilter.readMsg && <Icon name='check' color='green'/>}
          </TouchableOpacity>
          <Divider style={styles.itemDivider} />

          <TouchableOpacity style={styles.itemContainer}
            onPress={()=>this.onUpdateFilter({fromStore: !historyFilter.fromStore})}>
            <View style={styles.textContainer}><Text >Message from stores</Text></View>   
            {historyFilter.fromStore && <Icon name='check' color='green'/>}
          </TouchableOpacity>
          <Divider style={styles.itemDivider} />

          <TouchableOpacity style={styles.itemContainer}
            onPress={()=>this.onUpdateFilter({fromUser: !historyFilter.fromUser})}>
            <View style={styles.textContainer}><Text >Message from customers</Text></View>   
            {historyFilter.fromUser && <Icon name='check' color='green'/>}
          </TouchableOpacity>
        </View>

        {/* <ScrollView contentContainerStyle={{ flex: 1 }} >
          <Card containerStyle={{
            margin: 0,
            width: undefined,
            height: undefined
          }}>
            <ListItem
              title='Unread messages'
              containerStyle={{ alignItems: 'center', height:50}}
              wrapperStyle={{ alignItems: 'center' }}
              rightIcon={{
                color: historyFilter.unreadMsg
                  ? 'green' : undefined,
                  name: 'check'
              }}
              hideChevron={!historyFilter.readMsg}
              onPress={()=>this.onUpdateFilter({unreadMsg: !historyFilter.unreadMsg})}
            />
            <ListItem
              title='Read messages'
              containerStyle={{height:50}}
              rightIcon={
                historyFilter.readMsg
                  ? { name: 'check', color: 'green' }
                  : undefined
              }
              hideChevron={!historyFilter.readMsg}
              onPress={()=>this.onUpdateFilter({readMsg: !historyFilter.readMsg})}
            />
            <ListItem
              title='Message from stores'
              rightIcon={
                historyFilter.fromStore
                  ? { name: 'check', color: 'green' }
                  : undefined
              }
              hideChevron={!historyFilter.fromStore}
              onPress={()=>this.onUpdateFilter({fromStore: !historyFilter.fromStore})}
            />
            <ListItem
              title='Message from customers'
              rightIcon={
                historyFilter.fromUser
                  ? { name: 'check', color: 'green' }
                  : undefined
              }
              hideChevron={!historyFilter.fromUser}
              onPress={()=>this.onUpdateFilter({fromUser: !historyFilter.fromUser})}
            />
          </Card>
        </ScrollView> */}

      </DefaultPage>)
  }
}

const styles = StyleSheet.create({
  container: {
    marginLeft: 30,
    marginRight: 30
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 40
  },
  textContainer: {
    flex: 1
  },
  itemDivider: {
    backgroundColor: '#9C9C9C', 
    height: 1
  }
})