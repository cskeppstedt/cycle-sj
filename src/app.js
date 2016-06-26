import Cycle from '@cycle/core'
import { h, h1, p, makeDOMDriver } from '@cycle/dom'
import { makeJSONPDriver } from '@cycle/jsonp'
import Rx from 'rx'
import toMb from './to-mb'

const USER_URL = 'http://www.ombord.info/api/jsonp/user/'
const INTERVAL_MS = 10000 // timer interval in milliseconds

function main (responses) {
  const request$ = Rx.Observable
    .timer(0, INTERVAL_MS)
    .map(_ => USER_URL)

  const remainingMb = ({data_total_used, data_total_limit}) => (
    toMb(parseInt(data_total_limit, 10) - parseInt(data_total_used, 10))
  )

  const vtree$ = responses.JSONP
    .filter((res$) => res$.request === USER_URL)
    .mergeAll()
    .startWith({loadingText: 'Loading...'})
    .map((data) =>
      h('div.container', data.loadingText
        ? h1(data.loadingText)
        : [
          h1(`${data.mac} (${data.ip})`),
          p(`Data download used: ${toMb(data.data_download_used)}`),
          p(`Data upload used: ${toMb(data.data_upload_used)}`),
          p(`Data total used: ${toMb(data.data_total_used)}`),
          p(`Data total limit: ${toMb(data.data_total_limit)}`),
          p(`Remaining data: ${remainingMb(data)}`)
        ]
      )
    )

  return {
    DOM: vtree$,
    JSONP: request$
  }
}

Cycle.run(main, {
  DOM: makeDOMDriver('#application'),
  JSONP: makeJSONPDriver()
})
