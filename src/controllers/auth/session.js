
import stream from 'jsonmvc-helper-stream'
import observer from 'jsonmvc-helper-observer'

module.exports = {
  args: {
    init: '/firebase/init'
  },
  fn: stream
    .filter(({ init }) => init === true)
    .chain((x, lib) => observer(o => {
      let db = FIREBASE.firestore()
      let routes = lib.get('/router/default')

      FIREBASE.auth().onAuthStateChanged(user => {
        if (!user) {
          o.next([{
            op: 'add',
            path: '/router/location',
            value: routes.visitor
          }, {
            op: 'remove',
            path: '/user'
          }])
          return
        }

        if (user.isAnonymous) {
          console.log('The annonymus user was initiated', user.uid)
          return
        }

        let ref = db.doc('users/' + user.uid)

        let meta = db.collection('users/' + user.uid + '/meta')
        let providers = db.collection('users/' + user.uid + '/providers')
        let admin = db.collection('users/' + user.uid + '/admin')

        function updatePath(path) {
          return x => {
            if (x.docs.length > 0) {
              x.docs.forEach(y => {
                o.next({
                  op: 'add',
                  path: path + '/' + y.id,
                  value: y.data()
                })
              })
            } else {
              o.next({
                op: 'remove',
                path
              })
            }
          }
        }

        function link(doc, path) {
          doc.onSnapshot(updatePath(path), e => {
            console.error(e)
          })
        }

        link(meta, '/user/meta')
        link(providers, '/user/providers')
        link(admin, '/user/admin')

        ref.get().then(x => {
          if (x.exists) {
            let result = x.data()

            if (!result) {
              // Waiting for the creation process to succeed
              setTimeout(initUser, 50)
              return
            }

            ref.onSnapshot(x => {
              o.next({
                op: 'add',
                path: '/user/profile',
                value: result.profile
              })
            })

            o.next([{
              op: 'add',
              path: '/firebase/auth/state',
              value: 'succesful'
            }, {
              op: 'add',
              path: '/user/profile',
              value: result.profile
            }, {
              op: 'add',
              path: '/user/id',
              value: result.id
            }, {
              op: 'add',
              path: '/router/location',
              value: result.isAdmin ? routes.admin : routes.user
            }])
          } else {
            o.next({
              op: 'remove',
              path: '/user'
            })
          }
        })
      })
    }))
}