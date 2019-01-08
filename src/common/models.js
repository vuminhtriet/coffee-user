export const DEFAULT_LANGUAGE = 'en'

export const SUPPORT_LANGUAGE = [
  { value: 'en', name: 'English ' },
  { value: 'ja', name: '日本語' },
  { value: 'cn', name: '中文' }
]

export const SETTING_KEYS = {
  language: 'LANGUAGE'
}

export const DEV_MODE = 'DEV_MODE'
export const RELEASE_MODE = 'RELEASE_MODE'

export const SETTING_STORE = 'state'
export const DATA_STORE = 'data'

export const BASE_URL = 'http://188.166.183.113:5001'

export const TEST_URL = 'https://drink2.herokuapp.com'

export const GOOGLE_URL = 'https://maps.googleapis.com'

export const API_KEY = 'AIzaSyBGvkfSkkoYyz7nvbD9PQ2sCwYEqajIe0Q'

export const CART_STATUS = {
  SHOPPING: 0,
  TO_BE_CONFIRMED: 1,
  WAITING_FOR_PAYMENT_PROOF: 2,
  READY_TO_CHECKOUT: 3,
  CHECKED_OUT: 4,
  DELETED: -1,
  REJECT: -2
}

export const ORDER_STATUS = {
  IN_PROGRESS: 1,
  COMPLETE: 2,
  RETURN: 2,
  DELETED: -1,
  CANCEL_BY_SHOP: -2,
  CANCEL_BY_BUYER: -3,
  CANCEL_ON_REQUEST_BY_SHOP: -4,
  CANCEL_ON_REQUEST_BY_BUYER: -5
}

export const SHIPPING_STATUS = {
  PACKING: 1,
  SHIPPED: 2,
  DELIVERIED: 3,
  RETURN: 4
}

export const PAYMENT_STATUS = {
  TO_BE_CONFIRMED: 1,
  PAID: 2,
  REFUND: 3,
  SUBMITTED: 4,
  INVALID: -1
}

export const PAYMENT_TYPE = {
  COD: 0,
  BANK: 1,
  ELECTRIC: 2,
  NOTE: 3
}

export const CART_STATUS_MAP = {
  0: 'New',
  1: 'Waiting for being confirmed by shop',
  2: 'Waiting for payment proof',
  3: 'Ready to checkout',
  4: 'Checked out',
  '-1': 'Deleted',
  '-2': 'Rejected by shop'
}

export const ORDER_STATUS_MAP = {
  1: 'In progress',
  2: 'Complete',
  3: 'Return',
  '-1': 'Deleted',
  '-2': 'Cancel by shop',
  '-3': 'Cancel by buyer',
  '-4': 'Cancel on request by shop',
  '-5': 'Cancel on request by buyer'
}

export const SHIPPING_STATUS_MAP = {
  1: 'Packing',
  2: 'Shipped',
  3: 'Deliveried',
  4: 'Return'
}

export const PAYMENT_STATUS_MAP = {
  1: 'Unpaid',
  4: 'Proof Submitted',
  2: 'Paid',
  3: 'Refund',
  '-1': 'Invalid'
}

export const PAYMENT_TYPE_MAP = {
  0: 'COD',
  1: 'Bank transfer',
  2: 'Electric transfer',
  3: 'Note'
}
export const STRING_DELIMITER = '$-$'

export const ROOT_STORAGE_PATH = 'gs://toptrade-5cbbe.appspot.com'

export const PRODUCT_SORT_LIST = [
  {
    id: 1,
    title: 'Độ phổ biến',
    value: 'avgRating DESC',
    type: 1
  },
  {
    id: 2,
    title: 'Thứ tự chữ cái',
    value: 'productName ASC',
    type: 0
  },
  {
    id: 3,
    title: 'Giá cao',
    value: 'productPrice DESC',
    type: 0
  },
  {
    id: 4,
    title: 'Giá thấp',
    value: 'productPrice ASC',
    type: 0
  },
]

export const SHOP_SORT_LIST = [
  {
    id: 1,
    title: 'Độ phổ biến',
    value: 'avgRating DESC',
    type: 1
  },
  {
    id: 2,
    title: 'Thứ tự chữ cái',
    value: 'shopName ASC',
    type: 0
  },
  {
    id: 3,
    title: 'Cũ nhất',
    value: 'dateCreatedAt ASC',
    type: 0
  },
  {
    id: 4,
    title: 'Mới nhất',
    value: 'dateCreatedAt DESC',
    type: 0
  },
]

export const BOOK_OPTION_LIST = [
  {
    id: 1,
    title: 'Ngày đặt gần nhất',
    value: 'orderTime DESC',
    type: 1
  },
  {
    id: 2,
    title: 'Ngày đặt xa nhất',
    value: 'orderTime ASC',
    type: 0
  },
  {
    id: 3,
    title: 'Ngày tạo gần nhất',
    value: 'dateCreatedAt DESC',
    type: 0
  },
  {
    id: 4,
    title: 'Ngày tạo xa nhất',
    value: 'dateCreatedAt ASC',
    type: 0
  },
  {
    id: 5,
    title: 'Số người nhiều nhất',
    value: 'customerAmount DESC',
    type: 0
  },
  {
    id: 6,
    title: 'Số người ít nhất',
    value: 'customerAmount ASC',
    type: 0
  }
]

export const BOOK_STATUS_LIST = [
  {
    id: 1,
    title: 'Trạng thái: Chưa xác nhận',
    value: 0,
    type: 0
  },
  {
    id: 2,
    title: 'Trạng thái: Xác nhận',
    value: 2,
    type: 0
  },
  {
    id: 3,
    title: 'Trạng thái: Đã hủy',
    value: 1,
    type: 0
  },
  {
    id: 4,
    title: 'Trạng thái: Đã tới',
    value: 3,
    type: 0
  },
  {
    id: 5,
    title: 'Tất cả',
    value: 4,
    type: 1
  },
]

export const POINT_SORT_LIST = [
  {
    id: 1,
    title: 'Điểm nhiều nhất',
    value: 'point DESC',
    type: 1
  },
  {
    id: 2,
    title: 'Điểm ít nhất',
    value: 'point ASC',
    type: 0
  }
]

export const DETAIL_POINT_SORT_LIST = [
  {
    id: 1,
    title: 'Điểm nhiều nhất',
    value: 'point DESC',
    type: 1
  },
  {
    id: 2,
    title: 'Điểm ít nhất',
    value: 'point ASC',
    type: 0
  },
  {
    id: 3,
    title: 'Ngày tạo gần nhất',
    value: 'dateCreatedAt DESC',
    type: 0
  },
  {
    id: 4,
    title: 'Ngày tạo xa nhất',
    value: 'dateCreatedAt ASC',
    type: 0
  },
]