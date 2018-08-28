import { handleActions } from 'redux-actions'

import * as actions from './actions'

const defaultState = {
  categoryName: 'Cat cat',
  products: [
    {
      id: 1,
      title: 'Product 99%',
      price: '60 USD',
      salePrice: '30 USD',
      status: 'In stock',
      star: 2,
      reviewer: 3,
      image: 'https://cf.shopee.vn/file/4cfaa96f3edd5fe112bd1c0c005b3129_tn'
    },
    {
      id: 2,
      title: 'Product pro',
      price: '60 USD',
      salePrice: undefined,
      status: 'In stock',
      star: 2,
      reviewer: 3,
      image: 'https://cf.shopee.vn/file/43fc83640cff81e5f68f736dcee673bc_tn'
    },
    {
      id: 3,
      title: 'Product galaxy',
      price: '60 USD',
      salePrice: undefined,
      status: 'In stock',
      star: 2,
      reviewer: 3,
      image: 'https://cf.shopee.vn/file/43fc83640cff81e5f68f736dcee673bc_tn'
    },
    {
      id: 4,
      title: 'Product 99%',
      price: '60 USD',
      salePrice: '30 USD',
      status: 'In stock',
      star: 5,
      reviewer: 3,
      image: 'https://cf.shopee.vn/file/4cfaa96f3edd5fe112bd1c0c005b3129_tn'
    },
    {
      id: 5,
      title: 'Product pro',
      price: '60 USD',
      salePrice: undefined,
      status: 'In stock',
      star: 2,
      reviewer: 3,
      image: 'https://cf.shopee.vn/file/43fc83640cff81e5f68f736dcee673bc_tn'
    }
  ]
}

const handlers = {
  [actions.getProducts]: (state, action) => ({
    ...state,
    ...{ products: action.payload }
  })
}

export default handleActions(handlers, defaultState)
