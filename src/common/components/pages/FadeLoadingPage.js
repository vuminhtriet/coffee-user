import React, { PureComponent } from 'react'
// import { NavigationActions } from 'react-navigation'
// import { SCREENS } from '../../screens'
import { View, Animated, Easing, StyleSheet } from 'react-native'

export default class FadeLoadingPage extends PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      rotation: false
    }
    this.progress = new Animated.Value(0)
  }

  componentDidMount () {
    // const { navigation } = this.props
    this.show()
    // init && setTimeout(() => {
    //   const resetAction = NavigationActions.reset({
    //     index: 0,
    //     actions: [NavigationActions.navigate({ routeName: SCREENS.TabStack })]
    //   })
    //   navigation.dispatch(resetAction)
    // }, 10000)
  }

  componentWillUnmount () {
    Animated.timing(
      this.progress
    ).stop()
  }

  show (start = 0, end = ANIMATION_TO_VALUE) {
    this.progress.setValue(start)
    Animated.timing(this.progress, {
      easing: Easing.inOut(Easing.ease),
      duration: ANIMATED_DURATION,
      toValue: end,
      useNativeDriver: true
    }).start(() => {
      const { rotation } = this.state
      this.setState({
        rotation: !rotation
      }, () => {
        this.show()
      })
    })
  }

  render () {
    // const { rotation } = this.state
    // const opacity = this.progress.interpolate({
    //   inputRange: [0, 1],
    //   outputRange: rotation ? [1, 0.1] : [0.1, 1]
    // })
    return (
      <View style={styles.container}>
        <Animated.Image
          resizeMode={'cover'}
          style={[styles.image]}
          source={require('../../../assets/splash.png')}
        />
      </View>
    )
  }
}

const ANIMATED_DURATION = 2000
const ANIMATION_TO_VALUE = 0.98

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    backgroundColor: '#E4574C'
  },
  image: {
    width: '100%',
    height: '100%',
    alignSelf: 'center'
  }
})
