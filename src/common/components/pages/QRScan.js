import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity
} from 'react-native'
import Camera from 'react-native-camera'

export default class QRScan extends Component {
  constructor (props) {
    super(props)
    this._onPressCancel = this._onPressCancel.bind(this)
    this._onBarCodeRead = this._onBarCodeRead.bind(this)
  }
  _onPressCancel () {
    if (this.props.onCancel) {
      this.props.onCancel()
    }
  }

  _onBarCodeRead (result) {
    if (this.barCodeFlag) {
      this.barCodeFlag = false
      setTimeout(() => {
        if (!this.barCodeFlag && !this.done) {
          this.done = true
          this.props.onSucess(result.data)
        }
      }, 1000)
    }
  }

  render () {
    const { cancelButtonVisible = false, cancelButtonTitle = 'cancel' } = this.props
    let cancelButton = null
    this.barCodeFlag = true
    this.done = false
    if (cancelButtonVisible) {
      cancelButton = (
        <View style={styles.FRCancelButton}>
          <TouchableOpacity onPress={this._onPressCancel} style={styles.cancelButton}>
            <Text style={styles.cancelButtonText}>{cancelButtonTitle}</Text>
          </TouchableOpacity>
        </View>
      )
    }

    return (
      (!this.done ? <Camera
        barcodeScannerEnabled={this.props.enableScanning}
        onBarCodeRead={this._onBarCodeRead}
        style={styles.camera}>
        <View style={styles.rectangleContainer}>
          <View style={styles.rectangle} />
        </View>
        {cancelButton}
      </Camera> : null)
    )
  }
}

const styles = StyleSheet.create({

  camera: {
    flex: 1,
    height: null,
    alignItems: 'center'
  },

  rectangleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent'
  },

  rectangle: {
    height: 0.5,
    width: 250,
    borderBottomWidth: 0.5,
    borderColor: 'red',
    backgroundColor: 'transparent'
  },
  FRCancelButton: {
    alignSelf: 'stretch',
    backgroundColor: '#121E30',
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 20
  },
  cancelButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: '#23375d',
    borderRadius: 3,
    padding: 15,
    alignSelf: 'stretch',
    width: null,
    minHeight: 55,
    bottom: 10
  },
  cancelButtonText: {
    fontSize: 17,
    fontWeight: '500',
    color: '#FFF'
  }
})
