import React, { Component } from 'react'
import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet
} from 'react-native'

export default class FastMessage extends Component {
  constructor(props) {
    super(props)
  }

  keyExtractor(item) {
    return item.id
  }

  sendFastMessage = (item) => {
    this.props.sendMessage(item.text);
  }

  renderItem = ({ index, item }) => {
    return (
      <TouchableOpacity style={styles.qcItem} onPress={() => this.sendFastMessage(item)}>
        <Text style={styles.qcText}>{item.text}</Text>
      </TouchableOpacity>
    );
  }

  render() {
    const data = [
      {
        id: 1,
        text: "Is this item in stock ?"
      },
      {
        id: 2,
        text: "Can I have a cheaper price ?"
      },
      {
        id: 3,
        text: "What color do you have ?"
      }
    ]
    return (
      <FlatList
        style={styles.qcContainer}
        data={data}
        keyExtractor={this.keyExtractor}
        renderItem={this.renderItem}
        horizontal={true}
      />
    )
  }
}

const styles = StyleSheet.create({
  qcContainer: {
    backgroundColor: 'white',
    paddingLeft: 10
  },
  qcItem: {
    margin: 4,
    padding: 4,
    borderRadius: 6,
    backgroundColor: '#DFE6E9'
  },
  qcText: {
    fontSize: 10,
  }
})
