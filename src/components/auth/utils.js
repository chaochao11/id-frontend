/**
 * @description 检查用户账户是否符合预期的格式
 * @param {string} account 用户账户
 * @returns {boolean} TRUE 符合预期 FALSE 不符合预期
 */
const checkAccountIsPassMuster = function checkAccountIsPassMuster(account) {
  if (!account) {
    return false;
  }
  const phoneReg = /^((1[3-8][0-9])+\d{8})$/;
  const mailReg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
  if (checkAccountIsPhoneOrEmail(account) && (!mailReg.test(account) || !account)) {
    return false;
  } else if (!checkAccountIsPhoneOrEmail(account) && (!phoneReg.test(account) || !account)) {
    return false;
  } else {
    return true;
  }
};

/**
 * @description 检查用户账户是手机号码还是邮箱
 * @param {string} account 用户账户
 * @returns {boolean} TRUE 邮箱；FALSE 手机号码
 */
const checkAccountIsPhoneOrEmail = function checkAccountIsPhoneOrEmail(account) {
  const diffReg = /@/;
  return diffReg.test(account);
};

export {
  checkAccountIsPassMuster,
  checkAccountIsPhoneOrEmail,
};
