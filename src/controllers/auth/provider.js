module.exports = {
  args: {
    name: '/auth/provider'
  },
  fn: ({ name }, lib) => {

    let provider
    if (name === 'facebook') {
      provider = new firebase.auth.FacebookAuthProvider()
    } else if (name === 'google') {
      provider = new firebase.auth.GoogleAuthProvider();
    }

    sessionStorage.setItem('attemptWithProvider', lib.get('/time/ms'))
    FIREBASE.auth().signInWithRedirect(provider)

    return []
  }
}