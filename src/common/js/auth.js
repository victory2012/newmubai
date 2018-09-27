export const checkPermisstion = (number) => {

  let auth = JSON.parse(localStorage.getItem('auth'))
  // let auth = localStorage.getItem('auth')
  console.log(auth)
  let flag = false
  auth && auth.forEach((item) => {
    if (item === number) {
      flag = true
    }
  });
  return flag;
};
