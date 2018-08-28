import axios from 'axios'
import { connect } from 'react-redux'
import DemoComponent from '../components/DemoComponent'
import { loading } from '../../../common/effects'
import { getCoins, appendCoins } from '../actions'
import { delay } from '../../../common/utils/async'
import { LIMIT, MODULE_NAME } from '../models'

const mapDispatchToProps = (dispatch, props) => ({
  getCoins: ({ offset = 0, limit = LIMIT, refresh = false, callback = undefined }) => {
    try {
      loading(dispatch, async () => {
        await delay(0)
        const url = `https://api.coinmarketcap.com/v1/ticker/`
        const result = await axios({
          method: 'GET',
          url,
          params: {
            limit,
            start: offset
          }
        })

        if (!refresh) {
          dispatch(appendCoins({ coins: result.data, offset: (offset + limit) }))
        } else {
          dispatch(getCoins({ coins: result.data, offset: (offset + limit) }))
        }
        callback && callback()
      })
    } catch (error) {
    }
  }
})

const mapStateToProps = state => ({
  coins: state[MODULE_NAME].coins,
  offset: state[MODULE_NAME].offset,
  isLoading: state.common.isLoading
})

export default connect(mapStateToProps, mapDispatchToProps)(DemoComponent)
