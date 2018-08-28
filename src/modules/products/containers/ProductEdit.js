import moment from 'moment'
import axios from 'axios'
import { connect } from 'react-redux'
import { uploadProductImage, deleteProductImage } from '../../../common/firebase'
import ProductEdit from '../components/ProductEdit'
import { BASE_URL } from '../../../common/models'
import { loading } from '../../../common/effects'
import { MODULE_NAME as MODULE_SHOP } from '../../shop/models'
import { MODULE_NAME as MODULE_USER } from '../../user/models'
import { MODULE_NAME as MODULE_ORDER } from '../../order/models'
import { MODULE_NAME as MODULE_DASHBOARD } from '../../dashboard/models'
import { mapDispatchToProps as shopSettingHandlers } from '../../shop/containers/ShopSetting'

const mapDispatchToProps = (dispatch, props) => ({
  toggleProduct: async (token, product) => {
    try {
      const result = await loading(dispatch, async () => {
        const url = `${BASE_URL}/api/products/${product.id}`
        const response = await axios({
          url,
          method: 'PATCH',
          headers: {
            Authorization: token
          },
          data: {
            status: product.status === -1 ? 1 : -1
          }
        })
        console.log('response', response)
        if (response && response.data) {
          return true
        }
        return false
      })
      return result
    } catch (err) {
      return false
    }
  },
  editProduct: async (token, pureProduct, product, newImages, deleteImages, editImages, user, shop) => {
    try {
      const result = await loading(dispatch, async () => {
        const url = `${BASE_URL}/api/products/${pureProduct.id}/update-properties`
        const data = {
          id: pureProduct.id,
          metaData: {
            id: pureProduct.id,
            name: product.name,
            weight: product.weight,
            description: product.description,
            isNew: product.isNew === 1,
            publicCategoryId: product.publicCategoryId && product.publicCategoryId.id,
            privateCategoryId: product.privateCategoryId && product.privateCategoryId.id,
            userId: user.id,
            shopId: shop.id,
            updatedAt: moment().format()
          },
          images: [],
          variations: [
            ...product.deleteVariants.map(item => {
              return {
                ...item,
                status: -1
              }
            }),
            ...product.editVariants,
            ...product.newVariants.map(item => {
              return {
                ...item,
                productId: pureProduct.id,
                id: undefined
              }
            })
          ],
          tags: [],
          shippingToCountries: [
            ...product.productCountries,
            ...product.newCountries
          ],
          prices: [
            // New price
            ...product.newPrices.map(item => {
              return {
                productId: pureProduct.id,
                cashValue: item.origin.cash && parseInt(item.origin.cash.value),
                electricValue: item.origin.crypto && parseFloat(item.origin.crypto.value),
                cashUnitId: item.origin.cash && item.origin.cash.unit.id,
                electricUnitId: item.origin.crypto && item.origin.crypto.unit.id,
                status: 1
              }
            }),
            // Edit price
            ...product.editPrices.reduce((all, item) => {
              if (item.flashSale) {
                all.push({
                  ...item.status === -1 ? {
                    ...item,
                    // Default price
                    toDate: null,
                    fromDate: null,
                    offPercent: null,
                    productPriceId: null,
                    isInFlashSales: false
                  } : {
                    id: item.id,
                    productId: pureProduct.id,
                    cashValue: item.origin.cash && parseInt(item.origin.cash.value),
                    electricValue: item.origin.crypto && parseFloat(item.origin.crypto.value),
                    cashUnitId: item.origin.cash && item.origin.cash.unit.id,
                    electricUnitId: item.origin.crypto && item.origin.crypto.unit.id,
                    status: 1,
                    // Default price
                    toDate: null,
                    fromDate: null,
                    offPercent: null,
                    productPriceId: null,
                    isInFlashSales: false
                  }
                })
                if (!item.saleId) {
                  all.push({
                    productId: pureProduct.id,
                    offPercent: item.offPercent,
                    isInFlashSales: true,
                    fromDate: moment().format(),
                    toDate: moment(item.flashSaleDate).format(),
                    cashValue: item.sales.cash && parseInt(item.sales.cash.value),
                    electricValue: item.sales.crypto && parseFloat(item.sales.crypto.value),
                    cashUnitId: item.sales.cash && item.sales.cash.unit.id,
                    electricUnitId: item.sales.crypto && item.sales.crypto.unit.id,
                    productPriceId: item.id,
                    status: 1
                  })
                } else {
                  all.push({
                    ...item.status === -1 ? {
                      ...item
                    } : {
                      id: item.saleId,
                      offPercent: item.offPercent,
                      isInFlashSales: true,
                      fromDate: item.fromDate ? item.fromDate : moment().format(),
                      toDate: moment(item.flashSaleDate).format(),
                      cashValue: item.sales.cash && parseInt(item.sales.cash.value),
                      electricValue: item.sales.crypto && parseFloat(item.sales.crypto.value),
                      cashUnitId: item.sales.cash && item.sales.cash.unit.id,
                      electricUnitId: item.sales.crypto && item.sales.crypto.unit.id,
                      productPriceId: item.id,
                      status: 1
                    }
                  })
                }
              } else {
                all.push({
                  ...item.status === -1 ? {
                    ...item
                  } : {
                    ...item,
                    cashValue: !item.flashSale
                      ? item.origin && item.origin.cash ? parseInt(item.origin.cash.value) : null
                      : item.sales && item.sales.cash ? parseInt(item.sales.cash.value) : null,
                    electricValue: !item.flashSale
                      ? item.origin && item.origin.crypto ? parseFloat(item.origin.crypto.value) : null
                      : item.sales && item.sales.crypto ? parseFloat(item.sales.crypto.value) : null,
                    cashUnitId: !item.flashSale
                      ? item.origin && item.origin.cash ? item.origin.cash.unit.id : null
                      : item.sales && item.sales.cash ? item.sales.cash.unit.id : null,
                    electricUnitId: !item.flashSale
                      ? item.origin && item.origin.crypto ? item.origin.crypto.unit.id : null
                      : item.sales && item.sales.crypto ? item.sales.crypto.unit.id : null,
                    status: 1,
                    // Default price
                    toDate: null,
                    fromDate: null,
                    offPercent: null,
                    productPriceId: null,
                    isInFlashSales: false
                  }
                })
              }
              return all
            }, [])
          ]
        }
        console.log('data', data)
        const response = await axios({
          url,
          method: 'PATCH',
          headers: {
            Authorization: token
          },
          data
        })
        if (response && response.data) {
          // Delete old images
          await Promise.all(deleteImages.map(item => {
            return deleteProductImage(item.url)
              .then(response => {
                return axios({
                  url: `${BASE_URL}/api/images/${item.id}`,
                  method: 'DELETE',
                  headers: {
                    Authorization: token
                  }
                })
              }).catch(err => {
                console.log('DELETE IMAGE ERROR', err.response)
              })
          }))
          // Edited
          await Promise.all(editImages.map(item => {
            return axios({
              url: `${BASE_URL}/api/images/${item.id}`,
              method: 'PUT',
              headers: {
                Authorization: token
              },
              data: {
                ...item
              }
            }).catch(err => {
              console.log('editImages IMAGE ERROR', err.response)
            })
          }))
          // // Instal new images
          console.log('newImages', newImages)
          await Promise.all(newImages.map(item => {
            return uploadProductImage(pureProduct.id, item.fileName, item.resized
              ? item.resized.uri : item.fileUri)
              .then(response => {
                return axios({
                  url: `${BASE_URL}/api/images`,
                  method: 'POST',
                  headers: {
                    Authorization: token
                  },
                  data: {
                    url: response.ref,
                    type: item.type,
                    fullUrl: response.downloadURL,
                    size: response.totalBytes,
                    productId: pureProduct.id,
                    createdAt: moment().format()
                  }
                })
              })
              .catch(err => {
                console.log('UPLOAD IMAGE ERROR', err.response)
              })
          }))
          return true
        }
      })
      return result
    } catch (err) {
      console.log('err', err)
      return false
    }
  },
  editProductOld: async (token, pureProduct, product, newImages, deleteImages, editImages, user, shop) => {
    try {
      const result = await loading(dispatch, async () => {
        const url = `${BASE_URL}/api/products/${pureProduct.id}`
        const response = await axios({
          url,
          method: 'PATCH',
          headers: {
            Authorization: token
          },
          data: {
            ...pureProduct,
            name: product.name,
            description: product.description,
            weight: product.weight,
            isNew: product.isNew === 1,
            publicCategoryId: product.publicCategoryId && product.publicCategoryId.id,
            privateCategoryId: product.privateCategoryId && product.privateCategoryId.id,
            userId: user.id,
            shopId: shop.id
          }
        })
        if (response && response.data) {
          const { id: productId } = response.data
          // Delete old images
          await Promise.all(deleteImages.map(item => {
            return deleteProductImage(item.url)
              .then(response => {
                return axios({
                  url: `${BASE_URL}/api/images/${item.id}`,
                  method: 'DELETE',
                  headers: {
                    Authorization: token
                  }
                })
              }).catch(err => {
                console.log('DELETE IMAGE ERROR', err.response)
              })
          }))
          // Edited
          await Promise.all(editImages.map(item => {
            return axios({
              url: `${BASE_URL}/api/images/${item.id}`,
              method: 'PUT',
              headers: {
                Authorization: token
              },
              data: {
                ...item
              }
            }).catch(err => {
              console.log('editImages IMAGE ERROR', err.response)
            })
          }))
          // Instal new images
          await Promise.all(newImages.map(item => {
            return uploadProductImage(productId, item.fileName, item.resized
              ? item.resized.uri : item.fileUri)
              .then(response => {
                return axios({
                  url: `${BASE_URL}/api/images`,
                  method: 'POST',
                  headers: {
                    Authorization: token
                  },
                  data: {
                    url: response.ref,
                    type: item.type,
                    fullUrl: response.downloadURL,
                    size: response.totalBytes,
                    productId,
                    createdAt: moment().format()
                  }
                })
              })
              .catch(err => {
                console.log('UPLOAD IMAGE ERROR', err.response)
              })
          }))

          // Delete old countries
          await axios({
            url: `${BASE_URL}/api/products/${productId}/countries`,
            method: 'DELETE',
            headers: {
              Authorization: token
            }
          }).catch(error => console.log('delete old countries', error.response))
          // Install new countries
          await Promise.all(product.productCountries.map(item => {
            return axios({
              url: `${BASE_URL}/api/products/${productId}/countries`,
              method: 'POST',
              headers: {
                Authorization: token
              },
              data: {
                ...item,
                id: undefined
              }
            }).catch(error => console.log(error.response))
          }))
          // Delete old productVariations
          // await axios({
          //   url: `${BASE_URL}/api/products/${productId}/productVariations`,
          //   method: 'DELETE',
          //   headers: {
          //     Authorization: token
          //   }
          // }).catch(error => console.log('delete old productVariations', error.response))
          await Promise.all(product.deleteVariants.map(item => {
            return axios({
              url: `${BASE_URL}/api/products/${productId}/productVariations/${item.id}`,
              method: 'PUT',
              headers: {
                Authorization: token
              },
              data: {
                ...item
              }
            }).catch(error => console.log(error.response))
          }))
          // Install new productVariations
          await Promise.all(product.newVariants.map(item => {
            return axios({
              url: `${BASE_URL}/api/products/${productId}/productVariations`,
              method: 'POST',
              headers: {
                Authorization: token
              },
              data: {
                ...item,
                productId: productId,
                id: undefined
              }
            }).catch(error => console.log(error.response))
          }))

          // PRICE NOTED
          await Promise.all(product.newPrices.map(async item => {
            const url = `${BASE_URL}/api/products/${productId}/productPrices`
            if (item.flashSale) {
              const newProductPrice = await axios({
                url: `${BASE_URL}/api/products/${productId}/productPrices`,
                method: 'POST',
                headers: {
                  Authorization: token
                },
                data: {
                  // isInFlashSales: true,
                  cashValue: item.origin.cash && item.origin.cash.value,
                  electricValue: item.origin.crypto && item.origin.crypto.value,
                  cashUnitId: item.origin.cash && item.origin.cash.unit.id,
                  electricUnitId: item.origin.crypto && item.origin.crypto.unit.id,
                  status: 1
                }
              }).catch(error => console.log('Flash sale error step 1', error.response))
              if (newProductPrice.data) {
                return axios({
                  url: `${BASE_URL}/api/products/${productId}/productPrices`,
                  method: 'POST',
                  headers: {
                    Authorization: token
                  },
                  data: {
                    offPercent: item.offPercent,
                    isInFlashSales: true,
                    fromDate: moment().format(),
                    toDate: moment(`${item.flashSaleDate}:00`).format(),
                    cashValue: item.sales.cash && item.sales.cash.value,
                    electricValue: item.sales.crypto && item.sales.crypto.value,
                    cashUnitId: item.sales.cash && item.sales.cash.unit.id,
                    electricUnitId: item.sales.crypto && item.sales.crypto.unit.id,
                    productPriceId: newProductPrice.data.id,
                    status: 1
                  }
                }).catch(error => console.log('Flash sale error step 2', error.response))
              }
              return true
            }
            return axios({
              url,
              method: 'POST',
              headers: {
                Authorization: token
              },
              data: {
                // isInFlashSales: true,
                cashValue: item.origin.cash && item.origin.cash.value,
                electricValue: item.origin.crypto && item.origin.crypto.value,
                cashUnitId: item.origin.cash && item.origin.cash.unit.id,
                electricUnitId: item.origin.crypto && item.origin.crypto.unit.id,
                status: 1
              }
            }).catch(error => console.log('Flash sale error step 1', error.response))
          }))
          // Edit productPrice
          await Promise.all(product.editPrices.map(async item => {
            if (item.flashSale) {
              await axios({
                url: `${BASE_URL}/api/products/${productId}/productPrices/${item.id}`,
                method: 'PUT',
                headers: {
                  Authorization: token
                },
                data: {
                  // isInFlashSales: true,
                  ...item.status === 0 ? {
                    ...item
                  } : {
                    cashValue: item.origin.cash && item.origin.cash.value,
                    electricValue: item.origin.crypto && item.origin.crypto.value,
                    cashUnitId: item.origin.cash && item.origin.cash.unit.id,
                    electricUnitId: item.origin.crypto && item.origin.crypto.unit.id,
                    status: item.status
                  }
                }
              }).catch(error => console.log('Flash sale error step 1', error.response))
              if (!item.saleId) {
                return axios({
                  url: `${BASE_URL}/api/products/${productId}/productPrices`,
                  method: 'POST',
                  headers: {
                    Authorization: token
                  },
                  data: {
                    offPercent: item.offPercent,
                    isInFlashSales: true,
                    fromDate: moment().format(),
                    toDate: moment(`${item.flashSaleDate}:00`).format(),
                    cashValue: item.sales.cash && item.sales.cash.value,
                    electricValue: item.sales.crypto && item.sales.crypto.value,
                    cashUnitId: item.sales.cash && item.sales.cash.unit.id,
                    electricUnitId: item.sales.crypto && item.sales.crypto.unit.id,
                    productPriceId: item.id,
                    status: 1
                  }
                }).catch(error => console.log('Flash sale error step 2', error.response))
              } else {
                return axios({
                  url: `${BASE_URL}/api/products/${productId}/productPrices/${item.saleId}`,
                  method: 'PUT',
                  headers: {
                    Authorization: token
                  },
                  data: {
                    ...item.status === 0 ? {
                      ...item
                    } : {
                      offPercent: item.offPercent,
                      isInFlashSales: true,
                      fromDate: moment().format(),
                      toDate: moment(`${item.flashSaleDate}:00`).format(),
                      cashValue: item.sales.cash && item.sales.cash.value,
                      electricValue: item.sales.crypto && item.sales.crypto.value,
                      cashUnitId: item.sales.cash && item.sales.cash.unit.id,
                      electricUnitId: item.sales.crypto && item.sales.crypto.unit.id,
                      productPriceId: item.id,
                      status: item.status
                    }
                  }
                }).catch(error => console.log('Flash sale error step 2', error.response))
              }
            }
            return axios({
              url: `${BASE_URL}/api/products/${productId}/productPrices/${item.id}`,
              method: 'PUT',
              headers: {
                Authorization: token
              },
              data: {
                ...item.status === 0 ? {
                  ...item
                } : {
                  isInFlashSales: item.flashSale,
                  cashValue: !item.flashSale
                    ? item.origin && item.origin.cash ? item.origin.cash.value : null
                    : item.sales && item.sales.cash ? item.sales.cash.value : null,
                  electricValue: !item.flashSale
                    ? item.origin && item.origin.crypto ? item.origin.crypto.value : null
                    : item.sales && item.sales.crypto ? item.sales.crypto.value : null,
                  cashUnitId: !item.flashSale
                    ? item.origin && item.origin.cash ? item.origin.cash.unit.id : null
                    : item.sales && item.sales.cash ? item.sales.cash.unit.id : null,
                  electricUnitId: !item.flashSale
                    ? item.origin && item.origin.crypto ? item.origin.crypto.unit.id : null
                    : item.sales && item.sales.crypto ? item.sales.crypto.unit.id : null,
                  status: 1
                }
              }
            }).catch(error => console.log(error.response))
          }))
          return true
        }
        return false
      })
      return result
    } catch (e) {
      console.log(e.response)
      return false
    }
  },
  ...shopSettingHandlers(dispatch, props)
})

const mapStateToProps = state => ({
  countries: state.common.countries.sort((next, pre) => {
    return !next.name - pre.name
  }),
  user: state[MODULE_USER].user,
  token: state[MODULE_USER].token,
  shop: state[MODULE_SHOP].shop,
  units: state.common.units || [],
  privateCategories: state[MODULE_SHOP].shopCategories,
  publicCategories: state[MODULE_DASHBOARD].categories
})

export default connect(mapStateToProps, mapDispatchToProps)(ProductEdit)
