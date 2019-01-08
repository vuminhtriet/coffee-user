import { createAction } from 'redux-actions'

export const setUserLanguage = createAction('setUserLanguage')
export const updateSetting = createAction('updateSetting')
export const updateSettingProperties = createAction('updateSettingProperties')

export const notification = createAction('notification')

export const loadStart = createAction('loading_start')
export const loadEnd = createAction('loading_end')

export const fetchStart = createAction('api_fetchStart')
export const fetchSuccess = createAction('api_fetchSuccess')
export const fetchFailure = createAction('api_fetchFailure')

export const setCountries = createAction('setCountries')
export const setPaymentTypes = createAction('setPaymentTypes')
export const setUnits = createAction('setUnits')
export const setCategories = createAction('setCategories')
export const setShippingTypes = createAction('setShippingTypes')
export const setCities = createAction('setCities')

export const setUserLatLng = createAction('setUserLatLng')
export const setUserLocation = createAction('setUserLocation')

export const setStyle = createAction('setStyle')
export const setBrand = createAction('setBrand')
