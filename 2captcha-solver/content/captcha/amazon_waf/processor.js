function a5_0x165e(_0x50e248, _0x3bc7f2) {
  const _0x7423b5 = a5_0x7423()
  return (
    (a5_0x165e = function (_0x165efd, _0x45df26) {
      _0x165efd = _0x165efd - 0xc7
      let _0x4ba360 = _0x7423b5[_0x165efd]
      return _0x4ba360
    }),
    a5_0x165e(_0x50e248, _0x3bc7f2)
  )
}
const a5_0x52ed0d = a5_0x165e
;(function (_0x3a4398, _0x54908d) {
  const _0x45ff8d = a5_0x165e,
    _0x1c8d90 = _0x3a4398()
  while (!![]) {
    try {
      const _0x5512bf =
        (parseInt(_0x45ff8d(0xe0)) / 0x1) * (-parseInt(_0x45ff8d(0xe8)) / 0x2) +
        (-parseInt(_0x45ff8d(0xe9)) / 0x3) * (-parseInt(_0x45ff8d(0xdc)) / 0x4) +
        -parseInt(_0x45ff8d(0xef)) / 0x5 +
        parseInt(_0x45ff8d(0xf0)) / 0x6 +
        -parseInt(_0x45ff8d(0xd6)) / 0x7 +
        parseInt(_0x45ff8d(0xd8)) / 0x8 +
        (parseInt(_0x45ff8d(0xd1)) / 0x9) * (parseInt(_0x45ff8d(0xc9)) / 0xa)
      if (_0x5512bf === _0x54908d) break
      else _0x1c8d90['push'](_0x1c8d90['shift']())
    } catch (_0x4fa5bd) {
      _0x1c8d90['push'](_0x1c8d90['shift']())
    }
  }
})(a5_0x7423, 0x3ca7d),
  CaptchaProcessors[a5_0x52ed0d(0xe1)]({
    captchaType: a5_0x52ed0d(0xcb),
    canBeProcessed: function (_0x1d9b74, _0x4c4bfd) {
      const _0x42ff45 = a5_0x52ed0d
      if (!_0x4c4bfd[_0x42ff45(0xf3)]) return ![]
      if (!_0x1d9b74['sitekey']) return ![]
      return !![]
    },
    attachButton: function (_0x13cf5b, _0x3e131e, _0x541243) {
      const _0x189074 = a5_0x52ed0d
      let _0x59ee5c = this[_0x189074(0xc8)](_0x13cf5b)
      if (_0x59ee5c[_0x189074(0xdf)]('.captcha-solver')[_0x189074(0xe5)] !== 0x0) return
      _0x541243[_0x189074(0xd0)]({ width: _0x59ee5c[_0x189074(0xee)]() + 'px' }),
        (_0x541243[0x0][_0x189074(0xeb)][_0x189074(0xed)] = !![]),
        _0x59ee5c[_0x189074(0xcf)](_0x541243)
    },
    clickButton: function (_0x11aeff, _0x3b666d, _0x3d3335) {
      const _0x3019c1 = a5_0x52ed0d
      if (_0x3b666d[_0x3019c1(0xf1)]) _0x3d3335[_0x3019c1(0xce)]()
    },
    getName: function (_0x48af40, _0x1a6cff) {
      const _0x4fdfaa = a5_0x52ed0d
      return _0x4fdfaa(0xe7)
    },
    getParams: function (_0x43107f, _0xfc239a) {
      const _0x4bb813 = a5_0x52ed0d
      return {
        method: 'amazon_waf',
        sitekey: _0x43107f[_0x4bb813(0xe4)],
        pageurl: location[_0x4bb813(0xd5)],
        context: _0x43107f['context'],
        challenge_script: _0x43107f[_0x4bb813(0xe3)],
        captcha_script: _0x43107f[_0x4bb813(0xd2)],
        iv: _0x43107f['iv'],
      }
    },
    getParamsV2: function (_0x2d1687, _0xddbc50) {
      const _0x46b66d = a5_0x52ed0d
      return {
        type: _0x46b66d(0xdb),
        websiteURL: location[_0x46b66d(0xd5)],
        websiteKey: _0x2d1687[_0x46b66d(0xe4)],
        context: _0x2d1687[_0x46b66d(0xc7)],
        challenge_script: _0x2d1687[_0x46b66d(0xe3)],
        captcha_script: _0x2d1687[_0x46b66d(0xd2)],
        iv: _0x2d1687['iv'],
      }
    },
    onSolved: function (_0x14e0b9, _0x1a1f68) {
      const _0xb95b24 = a5_0x52ed0d
      let _0x1f970b = this['getHelper'](_0x14e0b9)
      const _0x35634b = _0x1f970b['find']('challenge.input')
      _0x35634b[_0xb95b24(0xe5)] && _0x35634b[_0xb95b24(0xd3)](_0x1a1f68[_0xb95b24(0xcd)])
      !_0x1f970b[_0xb95b24(0xdf)](_0xb95b24(0xd9))[_0xb95b24(0xe5)] && $(_0xb95b24(0xe6))['appendTo'](_0x1f970b)
      _0x1f970b[_0xb95b24(0xdf)](_0xb95b24(0xd4))[_0xb95b24(0xd3)](_0x1a1f68['captcha_voucher']),
        _0x1f970b[_0xb95b24(0xdf)]('input[name=amazon_waf_existing_token]')['val'](_0x1a1f68[_0xb95b24(0xd7)])
      let _0x49bf6a = document[_0xb95b24(0xde)](_0xb95b24(0xf2))
      ;(_0x49bf6a[_0xb95b24(0xea)] = chrome[_0xb95b24(0xe2)][_0xb95b24(0xec)](_0xb95b24(0xdd))),
        document[_0xb95b24(0xcc)][_0xb95b24(0xcf)](_0x49bf6a)
    },
    getForm: function (_0x2ceb65) {
      const _0x1ea249 = a5_0x52ed0d
      return this[_0x1ea249(0xc8)](_0x2ceb65)[_0x1ea249(0xca)]('form')
    },
    getCallback: function (_0x4afb1f) {
      return null
    },
    getHelper: function (_0x58aa0e) {
      const _0x5cb7f6 = a5_0x52ed0d
      let _0x5e3cd8 = $('#' + _0x58aa0e[_0x5cb7f6(0xda)])
      return _0x5e3cd8['parent']()
    },
  })
function a5_0x7423() {
  const _0x344996 = [
    'click',
    'append',
    'css',
    '808713xwvtcU',
    'captcha_script',
    'val',
    'input[name=amazon_waf_captcha_voucher]',
    'href',
    '3041906uYNtxU',
    'existing_token',
    '1269192kgEptm',
    '.twocaptcha-amazon_waf-helper',
    'inputId',
    'AmazonTaskProxyless',
    '4dtLwUM',
    'content/captcha/amazon_waf/validate.js',
    'createElement',
    'find',
    '7XiUOCg',
    'register',
    'runtime',
    'challenge_script',
    'sitekey',
    'length',
    '\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<div\x20class=\x22twocaptcha-amazon_waf-helper\x22>\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<input\x20type=\x22hidden\x22\x20name=\x22amazon_waf_captcha_voucher\x22>\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<input\x20type=\x22hidden\x22\x20name=\x22amazon_waf_existing_token\x22>\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20</div>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20',
    'Amazon\x20WAF',
    '29674ZZeayU',
    '137337IFOreD',
    'src',
    'dataset',
    'getURL',
    'disposable',
    'outerWidth',
    '1984180rIPKVj',
    '1023342mphpXU',
    'autoSolveAmazonWaf',
    'script',
    'enabledForAmazonWaf',
    'context',
    'getHelper',
    '90mEDbft',
    'closest',
    'amazon_waf',
    'body',
    'captcha_voucher',
  ]
  a5_0x7423 = function () {
    return _0x344996
  }
  return a5_0x7423()
}
