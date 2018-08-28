export const MODULE_NAME = 'order'
export const PAYMENT_METHODS = {
  cod: {
    title: 'COD',
    name: 'attach-money'
  },
  crypto: {
    title: 'Bitcoin',
    name: 'bitcoin',
    type: 'material-community'
  },
  bank: {
    title: 'Bank',
    name: 'bank',
    type: 'material-community'
  }
}

export const CART_STATUS = {
  0: 'Shopping',
  1: 'Waiting for being confirmed',
  2: 'Confirmed cart',
  3: 'Rejected cart',
  4: 'In order cart',
  5: 'Required change'
}

export const ORDER_STATUS = {
  1: 'In progressing',
  2: 'Successfull',
  3: 'Return'
}

export const SHIPING_STATUS = {
  0: 'Packaging',
  1: 'Shipping',
  2: 'Deliveried',
  3: 'Return'
}

export const PAYMENT_STATUS = {
  0: 'Waiting for payment confirm',
  1: 'Paid',
  2: 'Waiting for re-payment',
  3: 'Refund'
}
