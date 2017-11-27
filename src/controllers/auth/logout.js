module.exports = {
  args: {
    init: '/session/logout'
  },
  fn: ({ init }) => {

    if (!init) {
      return []
    }

    FIREBASE.auth().signOut()

    // @TODO: Create a signing out Please wait screen
    return {
      op: 'remove',
      path: '/user'
    }
  }
}