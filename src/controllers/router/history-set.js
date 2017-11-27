module.exports = {
  args: {
    defaultLocation: '/router/default/visitor',
  },
  fn: ({ defaultLocation }, lib) => {

    let location = lib.get('/router/location')

    let pathname = window.location.pathname
    let parts = pathname.split('/')

    parts.shift()

    if (!location) {
      return {
        op: 'add',
        path: '/router/location',
        value: defaultLocation
      }
    } else {
      return []
    }
  }
}