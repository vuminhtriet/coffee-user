import I18n from 'i18n-js'
import React from 'react'
import {
  StackNavigator,
  TabNavigator,
  TabBarBottom
} from 'react-navigation'
import { View, Animated, Easing, Dimensions } from 'react-native'
import { Icon, Badge } from 'react-native-elements'
import LoadingPage from '../screens/LoadingPage'
import DemoPage from '../screens/DemoPage'
import AuthenticatePage from '../screens/AuthenticatePage'
import DashboardPage from '../screens/DashboardPage'
import ShopPage from '../screens/ShopPage'
import ShopInformationPage from '../screens/ShopInformationPage'
import ProductManagementPage from '../screens/ProductManagementPage'
import ProcessingCartPage from '../screens/ProcessingCartPage'
import OrderManagementPage from '../screens/OrderManagementPage'
import BookManagementPage from '../screens/BookManagementPage'
import UserPage from '../screens/UserPage'
import UserInformationPage from '../screens/UserInformationPage'
import CategoryPage from '../screens/CategoryPage'
import CategoryProductPage from '../screens/CategoryProductPage'
import ProductDetailPage from '../screens/ProductDetailPage'
import FlashSalePage from '../screens/FlashSalePage'
import ProductsPage from '../screens/ProductsPage'
import CategoryManagementPage from '../screens/CategoryManagementPage'
import AddProductPage from '../screens/AddProductPage'
import PopularProductPage from '../screens/PopularProductPage'
import PopularShopPage from '../screens/PopularShopPage'
import NearbyShopPage from '../screens/NearbyShopPage'
import BoughtProductsPage from '../screens/BoughtProductsPage'
import CartPage from '../screens/CartPage'
import StoreDetailPage from '../screens/StoreDetailPage'
import UserCartPage from '../screens/UserCartPage'
import ChatHistoryPage from '../screens/ChatHistoryPage'
import ChatDetailPage from '../screens/ChatDetailPage'
import UserOrderManagementPage from '../screens/UserOrderManagementPage'
import UserBookManagementPage from '../screens/UserBookManagementPage'
import EditProductPage from '../screens/EditProductPage'
import StoreCategoryProductPage from '../screens/StoreCategoryProductPage'
import SearchProductPage from '../screens/SearchProductPage'
import SearchShopPage from '../screens/SearchShopPage'
import SearchPage from '../screens/SearchPage'
import TabbarIcon from './components/elements/TabbarIcon'
import ShopPaymentMethodPage from '../screens/ShopPaymentMethodPage'
import ShopShippingTypePage from '../screens/ShopShippingTypePage'
import UserPaymentMethodPage from '../screens/UserPaymentMethodPage'
import BookDetailPage from '../screens/BookDetailPage'
import BookConfirmPage from '../screens/BookConfirmPage'
const { width, height } = Dimensions.get('window')

export const SCREENS = {
  Loading: 'Loading',
  DemoPage: 'DemoPage',
  AuthenticatePage: 'AuthenticatePage',
  TabStack: 'TabStack',
  HomeStack: 'HomeStack',
  StoreStack: 'StoreStack',
  CartStack: 'CartStack',
  ShopStack: 'ShopStack',
  AccountStack: 'AccountStack',
  Dashboard: 'Dashboard',
  ShopPage: 'ShopPage',
  ShopInformation: 'ShopInformation',
  ProductManagement: 'ProductManagement',
  ProcessingCart: 'ProcessingCart',
  OrderManagement: 'OrderManagement',
  BookManagement: 'BookManagement',
  UserSetting: 'UserSetting',
  UserInformation: 'UserInformation',
  BoughtProductPage: 'BoughtProductPage',
  UserOrderManagement: 'UserOrderManagement',
  UserBookManagement: 'UserBookManagement',
  ShopPaymentMethod: 'ShopPaymentMethod',
  ShopShippingType: 'ShopShippingType',
  UserPaymentMethod: 'UserPaymentMethod',
  // Products:
  Category: 'Category',
  CategoryProduct: 'CategoryProduct',
  Products: 'Products',
  ProductDetail: 'ProductDetail',
  FlashSale: 'FlashSale',
  CategoryManagement: 'CategoryManagement',
  AddProductPage: 'AddProductPage',
  PopularProduct: 'PopularProductPage',
  PopularShop: 'PopularShopPage',
  NearbyShop: 'NearbyShopPage',
  EditProductPage: 'EditProductPage',
  UserCart: 'UserCartPage',
  SearchProductPage: 'SearchProductPage',
  SearchPage: 'SearchPage',

  // Cart:
  Cart: 'CartPage',

  //Book:
  BookDetailPage: 'BookDetailPage',
  BookConfirmPage: 'BookConfirmPage',

  // Store:
  StoreDetail: 'StoreDetailPage',
  StoreCategoryProduct: 'StoreCategoryProductPage',
  SearchShopPage: 'SearchShopPage',

  // Chat
  ChatHistoryPage: 'ChatHistoryPage',
  ChatDetailPage: 'ChatDetailPage'
}

const defaultStackConfig = {
  headerMode: 'none',
  transitionConfig: () => ({
    transitionSpec: {
      duration: 0,
      timing: Animated.timing,
      easing: Easing.step0
    }
  })
}

const defaultTabConfig = {
  animationEnabled: false,
  tabBarPosition: 'bottom',
  swipeEnabled: false,
  tabBarOptions: {
    activeTintColor: '#6F4E37',
    labelStyle: {
      fontSize: 14,
      marginBottom: 2,
      fontWeight: '300',
      lineHeight: 19
    },
    style: {
      backgroundColor: '#F5F5F5',
      shadowOffset: { width: 0, height: -2 },
      shadowOpacity: 0.1,
      shadowColor: '#000',
      shadowRadius: 2,
      height: 64
    }
  },
  initialLayout: {
    width,
    height
  },
  tabBarComponent: ({ jumpToIndex, ...props, navigation }) => (
    <TabBarBottom
      {...props}
      jumpToIndex={index => {
        jumpToIndex(index)
      }}
    />
  )
}

const cartTabIcon = ({ focused = false, tintColor }) => (
  <View style={{ display: 'flex', flexDirection: 'row' }}>
    <Icon
      name='shopping-basket'
      type='font-awesome'
      size={focused ? 28 : 24}
      color={focused ? tintColor : '#cccc'}
    />
    <Badge
      value={3}
      containerStyle={{ backgroundColor: 'red', marginTop: 10 }}
      textStyle={{ color: 'white', fontSize: 12, fontWeight: 'bold' }}
    />
  </View>
)

export default ({ token = undefined, store = {} }) => {
  let ShopStack = null
  let AccountStack = null
  let HomeStack = StackNavigator({
    [SCREENS.Dashboard]: {
      screen: DashboardPage
    }
  }, defaultStackConfig)
  // const StoreStack = StackNavigator({
  //   [SCREENS.SignupPage]: {
  //     screen: DemoPage
  //   }
  // }, defaultStackConfig)
  const CartStack = StackNavigator({
    [SCREENS.UserCart]: {
      screen: UserCartPage
    }
  }, defaultStackConfig)

  const ChatStack = StackNavigator({
    [SCREENS.ChatHistoryPage]: {
      screen: ChatHistoryPage
    },
    [SCREENS.ChatDetailPage]: {
      screen: ChatDetailPage
    }
  }, defaultStackConfig)

  // Login and do not login flow
  if (!token) {
    ShopStack = StackNavigator({
      [SCREENS.ShopPage]: {
        screen: ShopPage
      },
      [SCREENS.AuthenticatePage]: {
        screen: AuthenticatePage
      }
    }, defaultStackConfig)
    AccountStack = StackNavigator({
      [SCREENS.UserSetting]: {
        screen: UserPage
      },
      [SCREENS.AuthenticatePage]: {
        screen: AuthenticatePage
      }
    }, defaultStackConfig)
  } else {
    ShopStack = StackNavigator({
      [SCREENS.ShopPage]: {
        screen: ShopPage
      },
      [SCREENS.ShopInformation]: {
        screen: ShopInformationPage
      },
      [SCREENS.ShopPaymentMethod]: {
        screen: ShopPaymentMethodPage
      },
      [SCREENS.ShopShippingType]: {
        screen: ShopShippingTypePage
      },
      [SCREENS.CategoryManagement]: {
        screen: CategoryManagementPage
      },
      [SCREENS.AddProductPage]: {
        screen: AddProductPage
      },
      [SCREENS.ProductManagement]: {
        screen: ProductManagementPage
      },
      [SCREENS.ProcessingCart]: {
        screen: ProcessingCartPage
      },
      [SCREENS.OrderManagement]: {
        screen: OrderManagementPage
      },
      [SCREENS.BookManagement]: {
        screen: BookManagementPage
      },
      [SCREENS.EditProductPage]: {
        screen: EditProductPage
      }
    }, defaultStackConfig)
    AccountStack = StackNavigator({
      [SCREENS.UserSetting]: {
        screen: UserPage
      },
      [SCREENS.UserInformation]: {
        screen: UserInformationPage
      },
      [SCREENS.UserPaymentMethod]: {
        screen: UserPaymentMethodPage
      },
      [SCREENS.BoughtProductPage]: {
        screen: BoughtProductsPage
      },
      [SCREENS.UserOrderManagement]: {
        screen: UserOrderManagementPage
      },
      [SCREENS.UserBookManagement]: {
        screen: UserBookManagementPage
      }
    }, defaultStackConfig)
  }

  const TabNavigation = TabNavigator(
    {
      [SCREENS.HomeStack]: {
        screen: HomeStack,
        navigationOptions: {
          tabBarLabel: 'Trang chủ',
          tabBarIcon: ({ tintColor, focused }) => (
            <Icon
              name='home'
              type='ant-design'
              size={focused ? 28 : 24}
              color={focused ? tintColor : '#cccc'}
            />
          )
        }
      },
      // [SCREENS.StoreStack]: {
      //   screen: StoreStack,
      //   navigationOptions: {
      //     tabBarLabel: 'Stores',
      //     tabBarIcon: ({ tintColor, focused }) => (
      //       <Icon
      //         name='building'
      //         type='font-awesome'
      //         size={focused ? 28 : 24}
      //         color={focused ? tintColor : '#cccc'}
      //       />
      //     )
      //   }
      // },
      // [SCREENS.CartStack]: {
      //   screen: CartStack,
      //   navigationOptions: {
      //     tabBarLabel: 'Giỏ hàng',
      //     tabBarIcon: ({ tintColor, focused }) => (
      //       <TabbarIcon
      //         tintColor={tintColor}
      //         focused={focused}
      //       />
      //   )}
      // },
      [SCREENS.ShopStack]: {
        screen: ShopStack,
        navigationOptions: {
          tabBarLabel: 'Quán của tôi',
          tabBarIcon: ({ tintColor, focused }) => (
            <Icon
              name='shop'
              type='entypo'
              size={focused ? 28 : 24}
              color={focused ? tintColor : '#cccc'}
            />
          )
        }
      },
      [SCREENS.AccountStack]: {
        screen: AccountStack,
        navigationOptions: {
          tabBarLabel: 'Tài khoản',
          tabBarIcon: ({ tintColor, focused }) => (
            <Icon
              name='user-circle'
              type='font-awesome'
              size={focused ? 28 : 24}
              color={focused ? tintColor : '#cccc'}
            />
          )
        }
      }
    }, defaultTabConfig)
  const AppNavigator = StackNavigator({
    [SCREENS.Loading]: {
      screen: LoadingPage
    },
    [SCREENS.TabStack]: {
      screen: TabNavigation
    },
    [SCREENS.AuthenticatePage]: {
      screen: AuthenticatePage
    },
    [SCREENS.DemoPage]: {
      screen: DemoPage
    },
    [SCREENS.Category]: {
      screen: CategoryPage
    },
    [SCREENS.CategoryProduct]: {
      screen: CategoryProductPage
    },
    [SCREENS.Products]: {
      screen: ProductsPage
    },
    [SCREENS.ProductDetail]: {
      screen: ProductDetailPage
    },
    [SCREENS.FlashSale]: {
      screen: FlashSalePage
    },
    [SCREENS.StoreDetail]: {
      screen: StoreDetailPage
    },
    [SCREENS.StoreCategoryProduct]: {
      screen: StoreCategoryProductPage
    },
    [SCREENS.PopularProduct]: {
      screen: PopularProductPage
    },
    [SCREENS.PopularShop]: {
      screen: PopularShopPage
    },
    [SCREENS.NearbyShop]: {
      screen: NearbyShopPage
    },
    [SCREENS.ChatHistoryPage]: {
      screen: ChatHistoryPage
    },
    [SCREENS.ChatDetailPage]: {
      screen: ChatDetailPage
    },
    [SCREENS.SearchProductPage]: {
      screen: SearchProductPage
    },
    [SCREENS.SearchShopPage]: {
      screen: SearchShopPage
    },
    [SCREENS.SearchPage]: {
      screen: SearchPage
    },
    [SCREENS.BookDetailPage]: {
      screen: BookDetailPage
    },
    [SCREENS.BookConfirmPage]: {
      screen: BookConfirmPage
    }
  }, defaultStackConfig)

  return <AppNavigator />
}
