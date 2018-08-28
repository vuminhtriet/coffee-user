import React, { Component } from 'react'
import {
  Image,
  StyleSheet
} from 'react-native'
import * as firebase from '../../../common/firebase'

export default class ImageStorage extends Component {
  constructor (props) {
    super(props)
    this.state = {
      uri: ''
    }
  }

  componentDidMount () {
    const imageURL = this.props.imageURL
    const displayPath = firebase.getDownloadLink(imageURL, (uri) => {
      this.setState({uri: uri})
    })
  }

  render () {
    return (
      <Image
        style={styles.messageImage}
        source={{ uri: this.state.uri }}
      />
    )
  }
}

const styles = StyleSheet.create({
  messageImage: {
    width: 100,
    height: 100,
    borderRadius: 10
  }
})
