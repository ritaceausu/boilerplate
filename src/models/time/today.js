import moment from 'moment'

module.exports = {
  args: {
    midnight: '/time/midnight'
  },
  fn: ({ midnight }) => {
    return moment(midnight).format('dddd, D MMM YYYY')
  }
}