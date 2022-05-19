import _get from 'lodash.get'
import { Dictionary, DottedPaths } from './types'

export function getIn<T extends Dictionary> (
  obj: T, key: DottedPaths<T>, defaultValue: any = undefined
): string {
  // @ts-ignore
  return _get(obj, key as string, defaultValue)
}
