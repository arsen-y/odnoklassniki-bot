function a22_0x5994() {
  const _0x1e80c7 = [
    'after',
    '1624475sYeUAt',
    '1017068JEnCNj',
    'KeyCaptcha',
    '1iJfINu',
    'keycaptcha',
    'sessionId',
    'KeyCaptchaTaskProxyless',
    '1116624AkRjfz',
    'length',
    'captchaFieldId',
    'find',
    'src',
    'attr',
    '15LWDnVV',
    'remove',
    '718135tugUHz',
    '//backs.keycaptcha.com/swfs/cap.js',
    '427724LxLPsZ',
    'val',
    'register',
    '3040450zLVxPJ',
    '1541099JQbnBa',
    'userId',
    'closest',
    '27SsVBkh',
    'autoSolveKeycaptcha',
    '24fHblns',
    'string',
    'form',
    'containerId',
  ]
  a22_0x5994 = function () {
    return _0x1e80c7
  }
  return a22_0x5994()
}
function a22_0x305e(_0x19dbdf, _0x4ee5df) {
  const _0x59945a = a22_0x5994()
  return (
    (a22_0x305e = function (_0x305e20, _0x2e695a) {
      _0x305e20 = _0x305e20 - 0x69
      let _0x4133e3 = _0x59945a[_0x305e20]
      return _0x4133e3
    }),
    a22_0x305e(_0x19dbdf, _0x4ee5df)
  )
}
const a22_0x2eb0c4 = a22_0x305e
;(function (_0x2e37e4, _0x57603f) {
  const _0x2df1fa = a22_0x305e,
    _0x4acd11 = _0x2e37e4()
  while (!![]) {
    try {
      const _0x5f2c39 =
        (-parseInt(_0x2df1fa(0x7e)) / 0x1) * (-parseInt(_0x2df1fa(0x6d)) / 0x2) +
        (parseInt(_0x2df1fa(0x69)) / 0x3) * (-parseInt(_0x2df1fa(0x7c)) / 0x4) +
        (-parseInt(_0x2df1fa(0x7b)) / 0x5) * (-parseInt(_0x2df1fa(0x76)) / 0x6) +
        -parseInt(_0x2df1fa(0x71)) / 0x7 +
        -parseInt(_0x2df1fa(0x82)) / 0x8 +
        (-parseInt(_0x2df1fa(0x74)) / 0x9) * (-parseInt(_0x2df1fa(0x70)) / 0xa) +
        parseInt(_0x2df1fa(0x6b)) / 0xb
      if (_0x5f2c39 === _0x57603f) break
      else _0x4acd11['push'](_0x4acd11['shift']())
    } catch (_0x36edef) {
      _0x4acd11['push'](_0x4acd11['shift']())
    }
  }
})(a22_0x5994, 0xd1e90),
  CaptchaProcessors[a22_0x2eb0c4(0x6f)]({
    captchaType: a22_0x2eb0c4(0x7f),
    div: null,
    params: null,
    canBeProcessed: function (_0x496abc, _0x48d0d9) {
      const _0xf2bfe6 = a22_0x2eb0c4
      if (!_0x48d0d9['enabledForKeycaptcha']) return ![]
      if (!_0x496abc[_0xf2bfe6(0x84)]) return ![]
      return !![]
    },
    attachButton: function (_0x13d1b2, _0x1ea21a, _0x17431c) {
      const _0x5b3ab7 = a22_0x2eb0c4
      $('#' + _0x13d1b2[_0x5b3ab7(0x79)])[_0x5b3ab7(0x7a)](_0x17431c)
    },
    clickButton: function (_0x1d473e, _0x5ddc6e, _0x48046a) {
      const _0x3331a0 = a22_0x2eb0c4
      if (_0x5ddc6e[_0x3331a0(0x75)]) _0x48046a['click']()
    },
    getName: function (_0x403ef2, _0x378387) {
      const _0xa568d2 = a22_0x2eb0c4
      return _0xa568d2(0x7d)
    },
    getParams: function (_0x245ae1, _0x25b167) {
      const _0x36217c = a22_0x2eb0c4
      return {
        method: _0x36217c(0x7f),
        url: location['href'],
        s_s_c_user_id: _0x245ae1['userId'],
        s_s_c_session_id: _0x245ae1[_0x36217c(0x80)],
        s_s_c_web_server_sign: _0x245ae1['webServerSign'],
        s_s_c_web_server_sign2: _0x245ae1['webServerSign2'],
      }
    },
    getParamsV2: function (_0x18e932, _0x3f7d6c) {
      const _0x2436bd = a22_0x2eb0c4
      return {
        type: _0x2436bd(0x81),
        websiteURL: location['href'],
        s_s_c_user_id: _0x18e932[_0x2436bd(0x72)],
        s_s_c_session_id: _0x18e932[_0x2436bd(0x80)],
        s_s_c_web_server_sign: _0x18e932['webServerSign'],
        s_s_c_web_server_sign2: _0x18e932['webServerSign2'],
      }
    },
    onSolved: function (_0xdb6482, _0x3847c9) {
      const _0x5566b4 = a22_0x2eb0c4
      $('#' + _0xdb6482['containerId'])[_0x5566b4(0x6a)](),
        this['removeScript'](),
        $('#' + _0xdb6482[_0x5566b4(0x84)])[_0x5566b4(0x6e)](_0x3847c9)
    },
    getForm: function (_0x445bef) {
      const _0x4db86a = a22_0x2eb0c4
      return $('#' + _0x445bef[_0x4db86a(0x84)])[_0x4db86a(0x73)](_0x4db86a(0x78))
    },
    getCallback: function (_0x918ee1) {
      return null
    },
    removeScript: function () {
      const _0x3a0ea2 = a22_0x2eb0c4
      let _0x5efeb2 = _0x3a0ea2(0x6c),
        _0x5a6539 = $('body')[_0x3a0ea2(0x85)]('script')
      for (let _0x108035 = 0x0; _0x108035 < _0x5a6539[_0x3a0ea2(0x83)]; _0x108035++) {
        let _0xc85d4c = _0x5a6539['eq'](_0x108035)[_0x3a0ea2(0x87)](_0x3a0ea2(0x86))
        if (typeof _0xc85d4c == _0x3a0ea2(0x77) && _0xc85d4c['indexOf'](_0x5efeb2)) {
          _0x5a6539['eq'](_0x108035)[_0x3a0ea2(0x6a)]()
          break
        }
      }
    },
  })
