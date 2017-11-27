
const model = {
  args: {
    hh: '/time/hh'
  },
  fn: args => {
    if (!args.hh) {
      return
    }

    return args.hh - (args.hh % (60 * 60 * 1000 * 24))
  }
}

export default model