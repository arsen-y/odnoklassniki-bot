;(function (_0x597109, _0x384d0b) {
  const _0xbdaf04 = a28_0x1b8a,
    _0x27e739 = _0x597109()
  while (!![]) {
    try {
      const _0x421b07 =
        (parseInt(_0xbdaf04(0x18e)) / 0x1) * (parseInt(_0xbdaf04(0x186)) / 0x2) +
        (-parseInt(_0xbdaf04(0x164)) / 0x3) * (-parseInt(_0xbdaf04(0x192)) / 0x4) +
        -parseInt(_0xbdaf04(0x170)) / 0x5 +
        -parseInt(_0xbdaf04(0x17d)) / 0x6 +
        (-parseInt(_0xbdaf04(0x183)) / 0x7) * (-parseInt(_0xbdaf04(0x184)) / 0x8) +
        (parseInt(_0xbdaf04(0x17e)) / 0x9) * (parseInt(_0xbdaf04(0x155)) / 0xa) +
        (parseInt(_0xbdaf04(0x180)) / 0xb) * (-parseInt(_0xbdaf04(0x162)) / 0xc)
      if (_0x421b07 === _0x384d0b) break
      else _0x27e739['push'](_0x27e739['shift']())
    } catch (_0x2931d6) {
      _0x27e739['push'](_0x27e739['shift']())
    }
  }
})(a28_0x16b1, 0x6c741)
function a28_0x16b1() {
  const _0xf9e952 = [
    'getContext',
    'remove',
    'normal-captcha-',
    'then',
    'naturalHeight',
    'getBase64ViaCanvas',
    'drawImage',
    'getElementsByTagName',
    'normal-captcha-container-',
    'in-progress',
    '1316676tWfGvY',
    '1395EUNFnD',
    'normalSources',
    '11nbGWfr',
    '1px',
    'location',
    '287336UgzGIi',
    '56XFlmvv',
    'storage',
    '1238hBadoE',
    'width',
    'data:image/',
    'singleNodeValue',
    'iframe',
    'call',
    'self',
    'taintedImageBase64',
    '762sgnfKW',
    'local',
    'runtime',
    'height',
    '12KWQFhp',
    'indexOf',
    'normal-captcha-answer-',
    'createElement',
    'set',
    '39990FZkVex',
    'isCaptchaWidgetRegistered',
    'canvas',
    'FIRST_ORDERED_NODE_TYPE',
    'body',
    'replace',
    'length',
    'image/png',
    'get',
    'host',
    'getBase64',
    'forEach',
    'form',
    '4818156azSIUr',
    'getAll',
    '130167vRfLpw',
    'getBase64FromSrc',
    'top',
    'image-reader',
    'input',
    'complete',
    'children',
    'catch',
    'getBase64FromTaintedImage',
    'href',
    'src',
    'now',
    '2219210nngNGZ',
    'image',
    'toDataURL',
  ]
  a28_0x16b1 = function () {
    return _0xf9e952
  }
  return a28_0x16b1()
}
let normalHunterInterval = setInterval(function () {
    const _0x108ac8 = a28_0x1b8a
    Config[_0x108ac8(0x163)]()
      [_0x108ac8(0x176)]((_0xf170ad) => {
        const _0x145a48 = _0x108ac8
        let _0x176a90 = new URL(location[_0x145a48(0x16d)])[_0x145a48(0x15e)],
          _0x5ae0c7 = null
        _0xf170ad[_0x145a48(0x17f)][_0x145a48(0x160)]((_0x553f20) => {
          const _0x569508 = _0x145a48
          _0x553f20[_0x569508(0x15e)] == _0x176a90 &&
            _0x553f20[_0x569508(0x171)][_0x569508(0x15b)] &&
            _0x553f20[_0x569508(0x168)]['length'] &&
            getElementByXpath(_0x553f20[_0x569508(0x171)]) &&
            getElementByXpath(_0x553f20[_0x569508(0x168)]) &&
            (_0x5ae0c7 = _0x553f20)
        })
        if (!_0x5ae0c7) return
        if (window[_0x145a48(0x156)]('normal', 0x0)) return
        getNormalCaptchaWidgetInfo(_0x5ae0c7, function (_0x5159ee) {
          registerCaptchaWidget(_0x5159ee)
        })
      })
      [_0x108ac8(0x16b)]((_0x4d52d7) => {
        clearInterval(normalHunterInterval)
      })
  }, 0x7d0),
  getElementByXpath = function (_0x10dcb5) {
    const _0x15fc0a = a28_0x1b8a
    return document['evaluate'](_0x10dcb5, document, null, XPathResult[_0x15fc0a(0x158)], null)[_0x15fc0a(0x189)]
  },
  getNormalCaptchaWidgetInfo = function (_0x49aae2, _0x389880) {
    const _0x1e6505 = a28_0x1b8a
    let _0x105496 = getElementByXpath(_0x49aae2[_0x1e6505(0x171)]),
      _0x26fa93 = getElementByXpath(_0x49aae2[_0x1e6505(0x168)]),
      _0x333557 = _0x26fa93['closest'](_0x1e6505(0x161))
    if (_0x105496['getAttribute'](_0x1e6505(0x167)) == _0x1e6505(0x17c)) return
    _0x105496['setAttribute'](_0x1e6505(0x167), _0x1e6505(0x17c)),
      ImageReader[_0x1e6505(0x15f)](_0x105496, function (_0x1ac2e2) {
        const _0x2a955f = _0x1e6505
        if (!_0x105496['id']) _0x105496['id'] = _0x2a955f(0x175) + Date[_0x2a955f(0x16f)]()
        if (!_0x26fa93['id']) _0x26fa93['id'] = _0x2a955f(0x194) + Date[_0x2a955f(0x16f)]()
        if (_0x333557 && !_0x333557['id']) _0x333557['id'] = _0x2a955f(0x17b) + Date[_0x2a955f(0x16f)]()
        _0x389880({
          captchaType: 'normal',
          widgetId: 0x0,
          imageId: _0x105496['id'],
          inputId: _0x26fa93['id'],
          containerId: _0x333557 ? _0x333557['id'] : undefined,
          base64: _0x1ac2e2,
        })
      })
  }
function a28_0x1b8a(_0x56a3fe, _0x13e859) {
  const _0x16b1c6 = a28_0x16b1()
  return (
    (a28_0x1b8a = function (_0x1b8a24, _0x129d06) {
      _0x1b8a24 = _0x1b8a24 - 0x153
      let _0x363335 = _0x16b1c6[_0x1b8a24]
      return _0x363335
    }),
    a28_0x1b8a(_0x56a3fe, _0x13e859)
  )
}
const ImageReader = {
  getBase64: function (_0x47f5dd, _0x21cc6e) {
    const _0x1bdec6 = a28_0x1b8a
    if (_0x47f5dd[_0x1bdec6(0x16e)][_0x1bdec6(0x193)](_0x1bdec6(0x188)) == -0x1)
      try {
        this[_0x1bdec6(0x178)](_0x47f5dd, _0x21cc6e)
      } catch (_0x429736) {
        this[_0x1bdec6(0x16c)](_0x47f5dd, _0x21cc6e)
      }
    else this[_0x1bdec6(0x165)](_0x47f5dd, _0x21cc6e)
  },
  getBase64FromSrc: function (_0x2a4a27, _0x59f8b8) {
    const _0x55bc86 = a28_0x1b8a
    let _0x21e253 = decodeURI(_0x2a4a27['src'])[_0x55bc86(0x15a)](/\s+/g, '')
    _0x59f8b8(this['removeDataPrefix'](_0x21e253))
  },
  getBase64ViaCanvas: function (_0x1864ac, _0xf8744c) {
    const _0x3a54f3 = a28_0x1b8a
    let _0x105c9a = document[_0x3a54f3(0x153)](_0x3a54f3(0x157))
    ;(_0x105c9a[_0x3a54f3(0x187)] = _0x1864ac['naturalWidth']), (_0x105c9a['height'] = _0x1864ac['naturalHeight'])
    let _0x5f3805 = _0x105c9a[_0x3a54f3(0x173)]('2d')
    _0x5f3805[_0x3a54f3(0x179)](_0x1864ac, 0x0, 0x0, _0x1864ac['naturalWidth'], _0x1864ac[_0x3a54f3(0x177)])
    let _0x5efe92 = _0x105c9a[_0x3a54f3(0x172)](_0x3a54f3(0x15c))
    _0xf8744c(this['removeDataPrefix'](_0x5efe92))
  },
  getBase64FromTaintedImage: function (_0x2807fa, _0x3f8ece) {
    const _0x560dc0 = a28_0x1b8a
    chrome[_0x560dc0(0x190)]['sendMessage'](
      { command: 'loadTaintedImageInBackgroundFrame', img_src: _0x2807fa[_0x560dc0(0x16e)] },
      function (_0x5f7c80) {
        const _0x4155f5 = _0x560dc0
        if (_0x5f7c80 === undefined) {
          let _0x5bd119 = document[_0x4155f5(0x153)](_0x4155f5(0x18a))
          ;(_0x5bd119[_0x4155f5(0x16e)] = _0x2807fa[_0x4155f5(0x16e)]),
            (_0x5bd119[_0x4155f5(0x187)] = _0x4155f5(0x181)),
            (_0x5bd119[_0x4155f5(0x191)] = _0x4155f5(0x181)),
            (_0x5bd119['name'] = _0x2807fa[_0x4155f5(0x16e)]),
            document[_0x4155f5(0x159)]['appendChild'](_0x5bd119)
        }
      },
    )
    let _0xc6563d = setInterval(function () {
      const _0x1d5e0d = _0x560dc0
      chrome[_0x1d5e0d(0x185)]['local'][_0x1d5e0d(0x15d)](_0x1d5e0d(0x18d), function (_0x1e2e64) {
        const _0x1818b8 = _0x1d5e0d
        _0x1e2e64[_0x1818b8(0x18d)] &&
          (_0x3f8ece(_0x1e2e64[_0x1818b8(0x18d)]),
          clearInterval(_0xc6563d),
          chrome['storage'][_0x1818b8(0x18f)][_0x1818b8(0x174)]('taintedImageBase64'))
      })
    }, 0xc8)
  },
  removeDataPrefix: function (_0x61f476) {
    return _0x61f476['replace'](/^data:image\/(png|jpg|jpeg|pjpeg|gif|bmp|pict|tiff);base64,/i, '')
  },
}
$(document)['ready'](function () {
  const _0x15f236 = a28_0x1b8a
  if (
    window[_0x15f236(0x166)] != window[_0x15f236(0x18c)] &&
    document[_0x15f236(0x159)] &&
    document['body'][_0x15f236(0x16a)][_0x15f236(0x15b)] == 0x1 &&
    document[_0x15f236(0x17a)]('img')['length'] == 0x1
  ) {
    let _0x2ee3b9 = document[_0x15f236(0x17a)]('img')[0x0]
    if (_0x2ee3b9[_0x15f236(0x16e)] != window[_0x15f236(0x182)]['href']) return
    let _0x5b8141 = function () {
      ImageReader['getBase64'](this, (_0x1c4b04) => {
        const _0x521f48 = a28_0x1b8a
        chrome[_0x521f48(0x185)][_0x521f48(0x18f)][_0x521f48(0x154)]({ taintedImageBase64: _0x1c4b04 })
      })
    }
    _0x2ee3b9[_0x15f236(0x169)] ? _0x5b8141[_0x15f236(0x18b)](_0x2ee3b9) : (_0x2ee3b9['onload'] = _0x5b8141)
  }
})
