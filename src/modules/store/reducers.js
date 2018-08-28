import { handleActions } from 'redux-actions'

import * as actions from './actions'

const defaultState = {
  // stores: [

  // ],
  // detail: {
  //   id: 1,
  //   name: 'SHOP TINHDAUAZ.VN - CÔNG TY TNHH KINH DOANH THƯƠNG MẠI VÀ XUẤT NHẬP KHẨU A-Z',
  //   email: "abc@gmail.com",
  //   slogan: "",
  //   description: "",
  //   website: "www.abcshopabc.com",
  //   facebookUrl: "www.facebook.com/abc",
  //   establishedYear: "",
  //   registeredDate: new Date(),
  //   workingTime: "8 AM - 10 PM",
  //   numberOfFollowers: 5,
  //   numberOfProducts: 120004,
  //   responseRate: "less than 1 hour",
  //   prepareTime: "",
  //   totalRating: 3.1,
  //   status: 1,
  //   type: 1,
  //   userId: 1,
  //   addresses: [
  //     {
  //       id: 1,
  //       title: "",
  //       contactName: "Shop ABC",
  //       regionCodePhone: "+84",
  //       phoneNumber: "(+84) 968 540 045",
  //       fullAddress: "285 DTH, NY, USA",
  //       companyName: "",
  //       lat: 0,
  //       lng: 0,
  //       isDefault: true,
  //       shopId: 1,
  //       userId: 1,
  //       cityId: 1,
  //       countryId: 1
  //     }
  //   ],
  //   shopPaymentMethods: [
  //     {
  //       id: 1,
  //       accountName: "",
  //       accountNumber: "",
  //       swiffCode: "",
  //       bankName: "",
  //       branchName: "",
  //       QRCodeImage: "",
  //       paymentAddress: "",
  //       note: "",
  //       status: 1,
  //       userId: 1,
  //       shopId: 1,
  //       paymentTypeId: 1,
  //       paymentType: {
  //         id: 1,
  //         name: "COD"
  //       }
  //     },
  //     {
  //       id: 2,
  //       accountName: "TANGTRET",
  //       accountNumber: "256489266251335",
  //       swiffCode: "TANGTRET",
  //       bankName: "TANGTRET",
  //       branchName: "TANGTRET",
  //       QRCodeImage: "",
  //       paymentAddress: "",
  //       note: "",
  //       status: 1,
  //       userId: 1,
  //       shopId: 1,
  //       paymentTypeId: 2,
  //       paymentType: {
  //         id: 2,
  //         name: "Bank transfer"
  //       }
  //     },
  //     {
  //       id: 3,
  //       accountName: "TANGTRET",
  //       accountNumber: "256489266251335",
  //       swiffCode: "TANGTRET",
  //       bankName: "TANGTRET",
  //       branchName: "TANGTRET",
  //       QRCodeImage: "",
  //       paymentAddress: "",
  //       note: "",
  //       status: 1,
  //       userId: 1,
  //       shopId: 1,
  //       paymentTypeId: 2,
  //       paymentType: {
  //         id: 2,
  //         name: "Bank transfer"
  //       }
  //     },
  //     {
  //       id: 4,
  //       accountName: "",
  //       accountNumber: "256489266251335",
  //       swiffCode: "",
  //       bankName: "",
  //       branchName: "",
  //       QRCodeImage: "url QRCode",
  //       paymentAddress: "",
  //       note: "",
  //       status: 1,
  //       userId: 1,
  //       shopId: 1,
  //       paymentTypeId: 3,
  //       paymentType: {
  //         id: 3,
  //         name: "ETH payment"
  //       }
  //     }
  //   ],
  //   shopShippingTypes: [
  //     {
  //       id: 1,
  //       description: "256489266251335",
  //       shopId: 1,
  //       shippingTypeId: 1,
  //       shippingType: {
  //         id: 1,
  //         name: "By air"
  //       }
  //     },
  //     {
  //       id: 2,
  //       description: "256489266251335",
  //       shopId: 1,
  //       shippingTypeId: 1,
  //       shippingType: {
  //         id: 1,
  //         name: "By air"
  //       }
  //     },
  //     {
  //       id: 3,
  //       description: "256489266251335",
  //       shopId: 1,
  //       shippingTypeId: 2,
  //       shippingType: {
  //         id: 2,
  //         name: "By post"
  //       }
  //     },
  //     {
  //       id: 4,
  //       description: "256489266251335",
  //       shopId: 1,
  //       shippingTypeId: 2,
  //       shippingType: {
  //         id: 2,
  //         name: "By post"
  //       }
  //     }
  //   ],
  //   products: [
  //     {
  //       id: 1,
  //       title: 'Product 99%',
  //       price: '60 USD',
  //       salePrice: '30 USD',
  //       status: 'In stock',
  //       star: 2,
  //       reviewer: 3,
  //       image: 'https://cf.shopee.vn/file/4cfaa96f3edd5fe112bd1c0c005b3129_tn'
  //     },
  //     {
  //       id: 2,
  //       title: 'Product pro',
  //       price: '60 USD',
  //       salePrice: undefined,
  //       status: 'In stock',
  //       star: 2,
  //       reviewer: 3,
  //       image: 'https://cf.shopee.vn/file/43fc83640cff81e5f68f736dcee673bc_tn'
  //     },
  //     {
  //       id: 3,
  //       title: 'Product galaxy',
  //       price: '60 USD',
  //       salePrice: undefined,
  //       status: 'In stock',
  //       star: 2,
  //       reviewer: 3,
  //       image: 'https://cf.shopee.vn/file/43fc83640cff81e5f68f736dcee673bc_tn'
  //     },
  //     {
  //       id: 4,
  //       title: 'Product 99%',
  //       price: '60 USD',
  //       salePrice: '30 USD',
  //       status: 'In stock',
  //       star: 5,
  //       reviewer: 3,
  //       image: 'https://cf.shopee.vn/file/4cfaa96f3edd5fe112bd1c0c005b3129_tn'
  //     },
  //     {
  //       id: 5,
  //       title: 'Product pro',
  //       price: '60 USD',
  //       salePrice: undefined,
  //       status: 'In stock',
  //       star: 2,
  //       reviewer: 3,
  //       image: 'https://cf.shopee.vn/file/43fc83640cff81e5f68f736dcee673bc_tn'
  //     }
  //   ],
  //   privateCategories: [
  //     {
  //       id: 1,
  //       name: 'Bla Bla',
  //       products: 100
  //     }, {
  //       id: 2,
  //       name: 'Bla Bla 2',
  //       products: 20
  //     }
  //   ]
  // }
  stores: [],
  detail: null,
  categoryProducts: []
}

const handlers = {
  [actions.setStoreProducts]: (state, action) => ({
    ...state,
    ...{ products: action.payload }
  }),
  [actions.setStoreCategories]: (state, action) => ({
    ...state,
    ...{ categories: action.payload }
  }),
  [actions.setStoreInformation]: (state, action) => ({
    ...state,
    ...{ detail: action.payload }
  }),
  [actions.getCategoryProducts]: (state, action) => ({
    ...state,
    ...{ categoryProducts: action.payload }
  })
}

export default handleActions(handlers, defaultState)
