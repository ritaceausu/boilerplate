import firebase from '@firebase/app'
import '@firebase/firestore'
import '@firebase/auth'

module.exports = {
  args: {
    config: '/firebase/config'
  },
  fn: args => {
    if (window.FIREBASE) {
      return []
    }

    window.firebase = firebase
    window.FIREBASE = firebase.initializeApp(args.config, 'app')

    return {
      op: 'add',
      path: '/firebase/init',
      value: true
    }
  }
}