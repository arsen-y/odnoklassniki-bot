function a11_0x5d45(_0x27b976, _0x48ba9f) {
  const _0x3f7450 = a11_0x3f74()
  return (
    (a11_0x5d45 = function (_0x5d4540, _0x31c41f) {
      _0x5d4540 = _0x5d4540 - 0x141
      let _0x1403e7 = _0x3f7450[_0x5d4540]
      return _0x1403e7
    }),
    a11_0x5d45(_0x27b976, _0x48ba9f)
  )
}
const a11_0x39a5b2 = a11_0x5d45
function a11_0x3f74() {
  const _0xb45111 = [
    '40719880KKRrRi',
    '137395hshkBt',
    'captchakey',
    'closest',
    'getHelper',
    '150NLMWFL',
    '21fVtIkS',
    '2NxGnRg',
    'val',
    'capy',
    'register',
    'css',
    'parent',
    'inputId',
    'find',
    'enabledForCapyPuzzle',
    'append',
    'click',
    'disposable',
    'dataset',
    '1490720jGGSlY',
    'href',
    'Capy\x20Puzzle',
    '1178942IgidTb',
    'CapyTaskProxyless',
    'input[name=capy_challengekey]',
    '180368CdwJxD',
    '2047905NVBtpB',
    '2317362fhNVAZ',
    '.captcha-solver',
    'form',
    'autoSolveCapyPuzzle',
    'input[name=capy_answer]',
  ]
  a11_0x3f74 = function () {
    return _0xb45111
  }
  return a11_0x3f74()
}
;(function (_0xe38ed8, _0x43daed) {
  const _0x366d05 = a11_0x5d45,
    _0x220ab4 = _0xe38ed8()
  while (!![]) {
    try {
      const _0x53595e =
        -parseInt(_0x366d05(0x157)) / 0x1 +
        (parseInt(_0x366d05(0x147)) / 0x2) * (-parseInt(_0x366d05(0x15c)) / 0x3) +
        -parseInt(_0x366d05(0x15a)) / 0x4 +
        (parseInt(_0x366d05(0x141)) / 0x5) * (-parseInt(_0x366d05(0x145)) / 0x6) +
        (parseInt(_0x366d05(0x146)) / 0x7) * (-parseInt(_0x366d05(0x154)) / 0x8) +
        -parseInt(_0x366d05(0x15b)) / 0x9 +
        parseInt(_0x366d05(0x161)) / 0xa
      if (_0x53595e === _0x43daed) break
      else _0x220ab4['push'](_0x220ab4['shift']())
    } catch (_0x1fe9f8) {
      _0x220ab4['push'](_0x220ab4['shift']())
    }
  }
})(a11_0x3f74, 0x92f68),
  CaptchaProcessors[a11_0x39a5b2(0x14a)]({
    captchaType: 'capy',
    canBeProcessed: function (_0x214c43, _0x558c88) {
      const _0x580042 = a11_0x39a5b2
      if (!_0x558c88[_0x580042(0x14f)]) return ![]
      if (!_0x214c43[_0x580042(0x142)]) return ![]
      return !![]
    },
    attachButton: function (_0x32194f, _0x1a5fd1, _0x255d27) {
      const _0x10b67e = a11_0x39a5b2
      let _0x1a1e0f = this[_0x10b67e(0x144)](_0x32194f)
      if (_0x1a1e0f[_0x10b67e(0x14e)](_0x10b67e(0x15d))['length'] !== 0x0) return
      _0x255d27[_0x10b67e(0x14b)]({ width: _0x1a1e0f['outerWidth']() + 'px' }),
        (_0x255d27[0x0][_0x10b67e(0x153)][_0x10b67e(0x152)] = !![]),
        _0x1a1e0f[_0x10b67e(0x150)](_0x255d27)
    },
    clickButton: function (_0x470c3e, _0x346190, _0x4f5714) {
      const _0x1f8225 = a11_0x39a5b2
      if (_0x346190[_0x1f8225(0x15f)]) _0x4f5714[_0x1f8225(0x151)]()
    },
    getName: function () {
      const _0x497bcc = a11_0x39a5b2
      return _0x497bcc(0x156)
    },
    getParams: function (_0xcef8e6, _0x1dbcac) {
      const _0x12329d = a11_0x39a5b2
      return {
        method: _0x12329d(0x149),
        url: location[_0x12329d(0x155)],
        captchakey: _0xcef8e6[_0x12329d(0x142)],
        apiServer: _0xcef8e6['apiServer'],
      }
    },
    getParamsV2: function (_0xa3852c, _0x2deafd) {
      const _0x5c8f63 = a11_0x39a5b2
      return { type: _0x5c8f63(0x158), websiteURL: location['href'], websiteKey: _0xa3852c[_0x5c8f63(0x142)] }
    },
    onSolved: function (_0x2ba5fa, _0x199ab0) {
      const _0x19b4f0 = a11_0x39a5b2
      let _0x4e7e2e = this[_0x19b4f0(0x144)](_0x2ba5fa)
      _0x4e7e2e[_0x19b4f0(0x14e)]('input[name=capy_captchakey]')['val'](_0x199ab0[_0x19b4f0(0x142)]),
        _0x4e7e2e[_0x19b4f0(0x14e)](_0x19b4f0(0x159))[_0x19b4f0(0x148)](_0x199ab0['challengekey']),
        _0x4e7e2e['find'](_0x19b4f0(0x160))['val'](_0x199ab0['answer'])
    },
    getForm: function (_0xf7eeb0) {
      const _0x1bced4 = a11_0x39a5b2
      return this[_0x1bced4(0x144)](_0xf7eeb0)[_0x1bced4(0x143)](_0x1bced4(0x15e))
    },
    getCallback: function (_0x59719d) {
      return null
    },
    getHelper: function (_0x5a9ebc) {
      const _0x3dc42a = a11_0x39a5b2
      let _0x4245c1 = $('#' + _0x5a9ebc[_0x3dc42a(0x14d)])
      return _0x4245c1[_0x3dc42a(0x14c)]()
    },
  })
