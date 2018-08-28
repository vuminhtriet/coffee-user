import { AsyncStorage } from 'react-native'

const getState = async (store = 'state') => {
  try {
    let savedState = await AsyncStorage.getItem(`@${store}`)
    if (savedState) {
      return JSON.parse(savedState)
    }
    return {}
  } catch (error) {
    return {}
  }
}

const saveState = (state, store = 'state') => {
  return AsyncStorage.setItem(store, JSON.stringify(state))
}

class Storage {
  constructor () {
    this.cache = {}
    this.store = 'state'
  }

  init (store = 'state') {
    this.store = store
    return new Promise(async (resolve, reject) => {
      this.cache = await getState(this.store)
      resolve()
    })
  }

  getStoreName () {
    return this.store
  }

  async changeStore (store) {
    if (store !== this.store) {
      this.store = store
      this.cache = await getState(store)
    }
  }

  getCurrentStore () {
    return this.cache || {}
  }

  get (property) {
    return this.cache[property] || undefined
  }

  async set (property, value) {
    if (this.cache[property] === value) {
      return
    }
    this.cache[property] = value
    await saveState(this.cache, this.store)
    return true
  }

  async setAll (values) {
    this.cache = { ...this.cache, ...values }
    await saveState(this.cache, this.store)
    return this.cache
  }

  async remove (property) {
    delete this.cache[property]
    await saveState(this.cache, this.store)
    return true
  }
}

export default new Storage()
