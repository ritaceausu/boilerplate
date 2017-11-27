module.exports = {
  args: {
    timeout: '/firebase/auth/timeout'
  },
  fn: ({ timeout }, lib) => {
    let attemptAt = sessionStorage.getItem('attemptWithProvider')
    let now = lib.get('/time/ms')

    if (attemptAt) {
      sessionStorage.removeItem('attemptWithProvider')
      if (now - attemptAt < timeout) {
        return {
          op: 'add',
          path: '/firebase/auth/state',
          value: 'pending'
        }
      } 
    }

    return {
      op: 'add',
      path: '/firebase/auth/state',
      value: 'stale'
    }
  }
}
