
module.exports = {
  args: {
    init: '/firebase/init',
    state: '/firebase/auth/state'
  },
  fn: ({ init, state }, { get }) => {
    if (init && state === 'stale') {
      FIREBASE.auth().signInAnonymously()
    }
    return []
  }
}