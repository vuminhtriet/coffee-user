import moment from 'moment'
import { Alert, Platform } from 'react-native'
import stacktraceParser from 'stacktrace-parser'
import { setJSExceptionHandler, setNativeExceptionHandler } from 'react-native-exception-handler'

// registering the error handler (maybe u can do this in the index.android.js or index.ios.js)
setJSExceptionHandler((error, isFatal) => {
  // This is your custom global error handler
  // You do stuff like show an error dialog
  // or hit google analytics to track crashes
  // or hit a custom api to inform the dev team.
  if (isFatal) {
    Alert.alert(
        'Unexpected error occurred',
        `
        Error: ${(isFatal) ? 'Fatal:' : ''} ${error.name} ${error.message}
        We have reported this to our team ! Please close the app and start again!
        `,
      [{
        text: 'Close',
        onPress: () => {
        }
      }]
    )
  }
})
setNativeExceptionHandler(errorString => {
  // This is your custom global error handler
  // You do stuff like show an error dialog
  // or hit google analytics to track crashes
  // or hit a custom api to inform the dev team.
  Alert.alert(
    ' Unexpected error occurred',
      `
      Error: ${errorString}
      We have reported this to our team ! Please close the app and start again!
      `,
    [{
      text: 'Close',
      onPress: () => {
      }
    }]
  )
}, false)

export const LogLevel = {
  FATAL: 5,
  ERROR: 4,
  WARNING: 3,
  INFO: 2,
  DEBUG: 1
}

export function getLogLevelLabel (logLevel) {
  switch (logLevel) {
    case LogLevel.FATAL: return 'FATAL'
    case LogLevel.ERROR: return 'ERROR'
    case LogLevel.WARNING: return 'WARNING'
    case LogLevel.INFO: return 'INFO'
    case LogLevel.DEBUG: return 'DEBUG'
  }
  return '--'
}

class Logger {
  async fatal (message) {
    await this._log(LogLevel.FATAL, message)
  }

  async error (message) {
    await this._log(LogLevel.ERROR, message)
  }

  async warning (message) {
    await this._log(LogLevel.WARNING, message)
  }

  async info (message) {
    await this._log(LogLevel.INFO, message)
  }

  async debug (message) {
    await this._log(LogLevel.DEBUG, message)
  }

  async _log (level, message) {
    if (level >= this._writableLogLevel) {
      const content = `${this.getTimestamp()} ${getLogLevelLabel(level)} ${message}`
      await this._writeLog(content)
    }
  }

  init () {
    this.initGlobalErrorLogging()
  }

  getTimestamp () {
    return moment(new Date()).utcOffset(true).format('YYYY-MM-DD HH:mm:ssZZ')
  }

  generateFileKeyForNow () {
    return moment(new Date()).utcOffset(true).format('YYYY-MM-DD')
  }

  async _writeLog (content) {
    //TODO: Write to file or something
  }

  async readLogFile (logPath) {
    //TODO: Read file
  }

  parseErrorStack = error => {
    if (!error || !error.stack) {
      return []
    }
    return Array.isArray(error.stack) ? error.stack : stacktraceParser.parse(error.stack)
  }

  initGlobalErrorLogging () {
    if (ErrorUtils) {
      const globalHandler = ErrorUtils.getGlobalHandler && ErrorUtils.getGlobalHandler()
      if (globalHandler) {
        ErrorUtils.setGlobalHandler((error, isFatal) => {
          this.writeGlobalLog(isFatal, error.message, this.parseErrorStack(error))
        })
      }
    }
  }

  writeGlobalLog (fatal, message, stackTrace) {
    let errorString = `ERROR: ${message} \nSTACKSTRACE:\n`
    if (stackTrace && Array.isArray(stackTrace)) {
      const stackMessages = stackTrace.map(stackTraceItem => {
        const file = stackTraceItem.file !== undefined ? stackTraceItem.file : '-'
        const methodName = stackTraceItem.methodName && stackTraceItem.methodName !== '<unknown>'
          ? stackTraceItem.methodName
          : '-'
        const lineNumber = stackTraceItem.lineNumber !== undefined ? stackTraceItem.lineNumber.toString() : '-'
        const column = stackTraceItem.column !== undefined ? stackTraceItem.column.toString() : '-'
        return `File: ${file}, Method: ${methodName}, LineNumber: ${lineNumber}, Column: ${column}`
      })
      errorString += stackMessages.join('\n')
    }

    if (fatal) {
      //this._writeLog(`${this.getTimestamp()} RNFatal ${errorString}`)
      return this.renderError(`RNFatal ${errorString}`)
    }
    return this.renderError(`RNError ${errorString}`)
    //this._writeLog(`${this.getTimestamp()} RNError ${errorString}`)
  }

  renderError (error) {
    __DEV__ && console.log(`!!!-----------------------START-----------------------!!! \n ${error} \n !!!----------------------END------------------------!!!`)
  }
}

const logger = new Logger()
export default logger
