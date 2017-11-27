module.exports = {
  args: {
    page: '/router/page',
    section: '/router/section'
  },
  fn: ({ section, page }, lib) => {
    let ignore = lib.get('/router/ignore')
    let location = lib.get('/router/location')

    if (!section || !page) {
      return []
    }

    if (ignore.indexOf(location) !== -1) {
      return []
    }


    history.replaceState(null, null, window.location.origin + '/' + section + '/' + page)

    return []
  }
}