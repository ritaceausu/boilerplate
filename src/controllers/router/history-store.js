module.exports = {
  args: {
    page: '/router/location'
  },
  fn: ({ page }, lib) => {
    let history = lib.get('/router/history')

    window.scroll(0, 0);

    let patch = []

    if (!history) {
      patch.push({
        op: 'add',
        path: '/router/history',
        value: []
      })
    }

    patch.push({
      op: 'add',
      path: '/router/history/-',
      value: page
    })

    return patch
  }
}