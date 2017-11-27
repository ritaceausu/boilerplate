module.exports = {
  args: {
    page: '/router/location'
  },
  fn: ({ page }) => {

    if (!page) {
      return
    }

    let parts = page.split('-')

    if (!parts || !parts[0]) {
      return
    }

    let section = parts[0]

    return parts[0]
  }
}