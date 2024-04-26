/* eslint-disable @typescript-eslint/no-explicit-any */
import {snakeCase} from 'change-case/keys'

export default function transformToSnakeCase(object:any) {
    return snakeCase(object)
}