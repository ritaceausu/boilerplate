import jsonmvc from 'jsonmvc'
import time from 'jsonmvc-module-time'
import ui from 'jsonmvc-module-ui'
import jsonmvcLoad from 'jsonmvc-util-load'
import jsonmvcChanges from 'jsonmvc-util-changes'

if (process.env.NODE_ENV === 'production') {
  require('./assets/js/google-analytics.js')
}

/**
 * Setup system
 */
let context = require.context('./', true, /\.js|yml|pug/)

function getFiles(context) {
  return context.keys().reduce((acc, x) => {
    if (x !== './app.js') {
      acc[x] = context(x)
    }
    return acc
  }, {})
}

let appModule = jsonmvcLoad({
  name: 'app',
  files: getFiles(context)
})

appModule.data.schema = {}

let modules = [
  time,
  ui,
  appModule
]

require('./assets/css/styles.css')

let instance = jsonmvc(modules)

if (module.hot) {
  module.hot.accept(context.id, () => {
    let context = require.context('./', true, /\.js|yml|pug/)
    let files = getFiles(context)

    let module = jsonmvcLoad({
      name: 'app',
      files: files
    })

    let changes = jsonmvcChanges(instance, module)
    instance.update(changes)
  })
}

db.on('/err', x => console.log('DB error', x))