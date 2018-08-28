import React, { PureComponent } from 'react'
import { View, Animated, Dimensions, Easing } from 'react-native'
import componentStyles from '../../styles/widgets/ProgressBar'
const { width } = Dimensions.get('window')

let instance = null
class ProgressBarComponent extends PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      isShow: false,
      blocking: props.blocking || DEFAULT_BLOCKING_MODE
    }
    this.unMount = false
    this.progress = new Animated.Value(0)
  }

  componentWillReceiveProps (nextProps) {
    const { show: nextShow } = nextProps
    const { show, blocking } = this.props

    if (show !== nextShow) {
      if (!nextShow) {
        this.hide()
      } else if (nextShow) {
        Animated.timing(
          this.progress
        ).stop()
        this.progress = new Animated.Value(0)
        return this.show(blocking)
      }
    }
  }

  componentDidMount () {
    const { global } = this.props
    if (global) {
      instance = this
    }
  }

  componentWillUnmount () {
    this.unMount = true
    const { global } = this.props
    if (global) {
      instance = null
    }
    Animated.timing(
      this.progress
    ).stop()
  }

  show (blocking) {
    this.progress.setValue(0)
    !this.unMount && this.setState({
      isShow: true,
      blocking,
      onProcess: true
    })
    Animated.timing(this.progress, {
      easing: Easing.bezier(0.04, 0.9, 0.11, 0.9),
      duration: ANIMATED_DURATION,
      toValue: ANIMATION_TO_VALUE,
      useNativeDriver: true
    }).start()
  }

  hide () {
    Animated.timing(this.progress, {
      easing: Easing.inOut(Easing.ease),
      duration: FAST_ANIMATED_DURATION,
      toValue: 1,
      useNativeDriver: true
    }).start(() => {
      !this.unMount && this.setState({
        isShow: false,
        blocking: DEFAULT_BLOCKING_MODE
      })
    })
  }

  render () {
    const { isShow, blocking } = this.state
    const fillWidth = this.progress.interpolate({
      inputRange: [0, 1],
      outputRange: [ -width, 0 ]
    })

    if (!isShow) {
      return null
    }
    return (
      <View style={componentStyles.background} onLayout={this.onLayout}>
        {isShow && blocking && <View style={componentStyles.overlay} />}
        <Animated.View style={[componentStyles.fill, { transform: [{ translateX: fillWidth }] }]} />
      </View>
    )
  }
}

const ANIMATED_DURATION = 12000
const FAST_ANIMATED_DURATION = 100
const ANIMATION_TO_VALUE = 0.98
const DEFAULT_BLOCKING_MODE = true

const ProgressBar = {
  Component: ProgressBarComponent,
  show (blocking = DEFAULT_BLOCKING_MODE) {
    instance && instance.show(blocking)
  },
  hide () {
    instance && instance.hide()
  }
}

export default ProgressBar
