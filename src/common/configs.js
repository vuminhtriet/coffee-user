import { DEV_MODE, RELEASE_MODE } from './models'

function configuration (mode = DEV_MODE) {
  switch (mode) {
    case DEV_MODE:
      return {
      }
    case RELEASE_MODE:
      return {
      }
  }
}
export const config = configuration(DEV_MODE)

export const PAGE_SIZE = 10
