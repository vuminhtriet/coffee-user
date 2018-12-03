import React, { Component } from 'react'
import {
  FlatList,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  Alert,
  PermissionsAndroid
} from 'react-native'
import { ListItem } from 'react-native-elements'
import { withNavigation } from 'react-navigation'
import { SCREENS } from '../../../common/screens'

const { width } = Dimensions.get('window')
const ITEM_WITDH = 200
// (width - 10) / 2
const ITEM_HEIGHT = 202

class DashboardPopularShops extends Component {
  constructor(props) {
    super(props)
    this.state = {
    }
    this.requestLocationPermission = this.requestLocationPermission.bind(this)
  }

  componentDidMount(){
    this.requestLocationPermission()
  }

  // componentWillUpdate(){
  //   this.requestLocationPermission()
  // }

  componentWillUnmount() {
    // navigator.geolocation.clearWatch(this.watchId)
  }

  async requestLocationPermission() {
    const { getUserLocation } = this.props
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          'title': 'Cho phép định vị',
          'message': 'Drinkaway cần truy cập vào vị trí của bạn để hỗ trợ tìm kiếm quán cafe.'
        }
      )
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        // this.watchId = navigator.geolocation.watchPosition(
        navigator.geolocation.getCurrentPosition(
          (position) => {
            this.setState({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              error: null,
            })
            getUserLocation(this.state.latitude,this.state.longitude)
            console.log(position)
          },
          (error) => {
            this.setState({ error: error.message })
            console.log(error)
          },
          { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
          // { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000, distanceFilter: 10 },
        )
      } else {
        console.log("Permission denied")
      }
    } catch (err) {
      console.warn(err)
    }
  }

  onPress = () => {
    // const { navigation } = this.props
    // navigation.navigate(SCREENS.NearbyShop)
    this.requestLocationPermission()
  }

  render() {
    const { refreshing } = this.state
    const { location, latlng } = this.props

    return (
      <View style={{
        width: '100%',
        backgroundColor: '#B8805A',
        paddingTop: 1,
        paddingBottom: 1
      }}>
        <View key='header'
          style={{ width: '100%', flexDirection: 'row', height: 30, alignItems: 'center', 
          backgroundColor: '#B8805A' }}
        >
        <View style={{ flex: 1 }}>
          <TouchableOpacity onPress={this.onPress}>
            <ListItem
            // onPress={this.onPress}
            leftIcon={{ name: 'location-on', type: 'material-icons', color: 'white' }}
            title={location}
            titleStyle={{ color: 'white' }}
            hideChevron
            containerStyle={{ borderBottomWidth: 0, borderTopWidth: 0 }}
            />
          </TouchableOpacity>
        </View>
        </View>
      </View>)
  }
}

export default withNavigation(DashboardPopularShops)
