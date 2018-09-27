export const loginOverTime = (err) =>{
  if (err.response.data.message=='登录状态已失效') {
    this.$router.push({path:"/login"})
    console.log('fjkasdgghfkjlashdfjkashdjksahdkjashdjkash')
    Toast({
      message: '登录失效，请重新登录',
      position: '',
      duration: 5000
    })
  }
}
