import React, { PureComponent } from 'react'
import { NavigationActions, StackActions } from 'react-navigation'
import { View, StyleSheet, ActivityIndicator } from 'react-native'

let instance = null
class ModalLoadingComponent extends PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      show: false,
      rotation: false
    }
    instance = this
  }

  componentWillReceiveProps (nextProps) {
    const { active, navigation } = this.props
    if (active !== nextProps.active && nextProps.active) {
      const resetAction = StackActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({ routeName: nextProps.mainPage })]
      })
      navigation.dispatch(resetAction)
    }
  }

  componentWillUnmount () {}

  hide () {
    this.setState({
      show: false
    })
  }

  show () {
    const { show } = this.state
    if (!show) {
      this.setState({
        show: true
      })
    }
  }

  render () {
    const { show } = this.state
    if (!show) {
      return null
    }

    return (
      <View style={styles.container}>
        <View style={styles.overlay} />
        <ActivityIndicator color='#6F4E37' size='large' />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent',
    zIndex: 2
  },
  overlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.8)',
    opacity: 0.4,
    left: 0,
    top: 0
  },
  image: {
    width: 200,
    height: 200,
    alignSelf: 'center'
  }
})

const ModalLoading = {
  Component: ModalLoadingComponent,
  show () {
    instance && instance.show()
  },
  hide () {
    instance && instance.hide()
  }
}

export default ModalLoading
