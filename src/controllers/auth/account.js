
import stream from 'jsonmvc-helper-stream'
import observer from 'jsonmvc-helper-observer'

function getUser(result) {
  console.log(result)
  let p = result.additionalUserInfo.profile
  let profile = {
    email: p.email,
    firstName: p.given_name,
    lastName: p.family_name,
    locale: p.locale,
    fullName: p.name,
    timezone: p.timezone,
    gender: p.gender === 'male' ? 1 : p.gender === 'female' ? 2 : 0,
    picture: p.picture
  }

  profile = Object.keys(profile).reduce((acc, x) => {
    if (profile[x]) {
      acc[x] = profile[x]
    }
    return acc
  }, {})

  let session = {
    google: {
      token: result.credential.accessToken,
      uid: result.user.providerData[0].uid
    }
  }

  return {
    uid: result.user.uid,
    profile,
    session
  }
}

function createUser(db, { uid, profile, session }) {
  let user = {
    id: uid,
    profile
  }

  let meta = {
    created: {
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      userId: uid
    }
  }

  let providers = {
    google: {
      uid: session.google.uid,
      token: session.google.token
    }
  }

  let batch = db.batch()

  batch.set(db.doc('users/' + uid), user)

  Object.keys(meta).forEach(x => {
    batch.set(db.collection(`users/${uid}/meta`).doc(x), meta[x])
  })

  Object.keys(providers).forEach(x => {
    batch.set(db.collection(`users/${uid}/providers`).doc(x), providers[x])
  })

  return batch.commit()
}

function updateSession(db, user) {
  return db
    .doc(`users/${user.uid}/providers/google`)
    .update(user.session.google)
}

module.exports = {
  args: {
    init: '/firebase/init'
  },
  fn: stream
    .filter(({ init }) => init === true)
    .chain((x, lib) => observer(o => {
      let db = FIREBASE.firestore()

      FIREBASE.auth().getRedirectResult().then(function (result) {
        if (!result.user) {
          return
        }

        let user = getUser(result)
        db
          .doc('users/' + user.uid)
          .get()
          .then(x => {
            console.log('Updating session', x.data())
            return updateSession(db, user)
          })
          .catch(e => {
            if (e.code === 'not-found') {
              console.log('Creating user')
              return createUser(db, user)
            } else {
              console.error('User retrieve failed', e)
              return e
            }
          })
          .then(x => {
            console.log('Finished user registration', x)
          })
          .catch(e => {
            console.error('User registration failed', e)
          })

      }).catch(error => {
        let code = error.code

        // @TODO: Handle all these cases:
        // auth/account-exists-with-different-credential
        // auth/auth-domain-config-required
        // auth/credential-already-in-use
        // auth/email-already-in-use
        // auth/operation-not-allowed
        // auth/operation-not-supported-in-this-environment
        // auth/timeout
        // See https://firebase.google.com/docs/reference/js/firebase.auth.Auth#getRedirectResult

        console.error('Err', error)
      })
    }))
}