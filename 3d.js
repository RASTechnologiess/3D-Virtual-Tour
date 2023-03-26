// Sketchfab Viewer API: customize annotation appearance
var version = '1.12.1';
var uid = '20486ab494af4b328eb99cfaa8487354';
var iframe = document.getElementById('api-frame');
if (!iframe) {
  console.log('no target');
}
if (!window.Sketchfab) {
  console.log('no Sketchfab library');
}
var client = new window.Sketchfab(version, iframe);
var imgBLogo;

// Code to create textureimage for pastille from svg
function computePastilles(wCanvas, hCanvas, bgColor, bgBorderColor, fgColor, fgBorderColor, text, numHotspot, wPastille, hPastille) {
  var wSize = wPastille / 10.0;
  var col = wCanvas / wSize;
  var row = hCanvas / wSize;
  var padding = 2;
  var w = wSize - padding;
  var cx;
  var cy = w * 0.5;
  //var cy = 24;

  var ty = cy + 8;
  var pastille = '';
  var num = 0;
  for (var i = 0; i < row; i++) {
    cx = wSize * 0.5;
    for (var k = 0; k < col; k++) {
      num++;
      var letters = text === 0 ? num : text[num];
      var circle = "<circle cx=\"".concat(cx, "\"\n            cy=\"").concat(cy, "\"\n            r=\"20\"\n            fill=\"").concat(bgColor, "\"\n            stroke=\"").concat(bgBorderColor, "\"\n            stroke-width=\"2\"/>");
      var textVG = "<text font-size=\"26\"\n          stroke=\"".concat(fgBorderColor, "\"\n          fill=\"").concat(fgColor, "\"\n          font-family=\"sans-serif\"\n          text-anchor=\"middle\"\n          alignment-baseline=\"baseline\"\n          x=\"").concat(cx, "\"\n          y=\"").concat(ty, "\">").concat(letters, "</text>");
      pastille += circle + textVG;
      cx += wSize;
    }
    cy += wSize;
    ty += wSize;
  }
  var s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  s.setAttribute('version', '1.1');
  s.setAttribute('baseProfile', 'full');
  s.setAttribute('width', wPastille);
  s.setAttribute('height', hPastille);
  s.setAttribute('viewBox', "0 0 ".concat(wPastille, " ").concat(hPastille));
  s.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  s.innerHTML = pastille;
  // make it base64
  var svg64 = btoa(s.outerHTML);
  var b64Start = 'data:image/svg+xml;base64,';
  var image64 = b64Start + svg64;
  var textureOptions = {
    url: image64,
    colNumber: col,
    padding: padding,
    iconSize: w
  };
  return textureOptions;
}
function getNewPastilleURL(bgColor, bgBorderColor, fgColor, fgBorderColor, text, numHotspot, w, h) {
  var imageData;
  imageData = computePastilles(w, h, bgColor, bgBorderColor, fgColor, fgBorderColor, text, numHotspot, w, h);
  return imageData;
}
function actionSkfb() {
  // initialize
  var error = function error() {
    console.error('Sketchfab API error');
  };
  var success = function success(api) {
    api.start(function () {
      /////////////////
      api.addEventListener('viewerready', function () {
        var url = '';
        document.getElementById('white').addEventListener('click', function () {
          //url = getNewPastilleURL('rgba(255,255,255,0.75)', 'black', 'black', 'none', 0, 50, 512, 256);
          url = getNewPastilleURL('rgba(0,0,0,0.50)', 'white', 'white', 'none', 0, 50, 512, 256);
          api.setAnnotationsTexture(url, function () {});
        });
        document.getElementById('100').addEventListener('click', function () {
          url = getNewPastilleURL('rgba(255,255,255,0.75)', 'black', 'black', 'none', 0, 100, 512, 512);
          api.setAnnotationsTexture(url, function () {});
        });
        document.getElementById('200').addEventListener('click', function () {
          url = getNewPastilleURL('rgba(255,255,255,0.75)', 'black', 'black', 'none', 0, 200, 512, 1024);
          api.setAnnotationsTexture(url, function () {});
        });

        // start on 1 so "aa....
        document.getElementById('text').addEventListener('click', function () {
          url = getNewPastilleURL('rgba(255,255,255,1.0)', 'black', 'black', 'none', 'aabcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 50, 512, 256);
          api.setAnnotationsTexture(url, function () {});
        });
        document.getElementById('discreet').addEventListener('click', function () {
          url = getNewPastilleURL('rgba(255,255,255,0.0)', 'black', 'black', 'none', 0, 50, 512, 256);
          api.setAnnotationsTexture(url, function () {});
        });
        document.getElementById('invisible').addEventListener('click', function () {
          url = getNewPastilleURL('rgba(0,0,0,0)', 'rgba(0,0,0,0)', 'rgba(0,0,0,0)', 'rgba(0,0,0,0)', 0, 50, 512, 256);
          api.setAnnotationsTexture(url, function () {});
        });
        document.getElementById('red').addEventListener('click', function () {
          url = getNewPastilleURL('rgba(255,0,0,1.0)', 'BLUE', 'green', 'white', 0, 50, 512, 256);
          api.setAnnotationsTexture(url, function () {});
        });
        document.getElementById('logos').addEventListener('click', function () {
          api.setAnnotationsTexture({
            url: imgBLogo,
            padding: 2,
            iconSize: 48,
            colNumber: 10
          }, function () {});
        });
      });
    });
  };
  client.init(uid, {
    success: success,
    error: error,
    autostart: 1,
    preload: 0,
    ui_infos: 0,
    ui_inspector: 0,
    ui_settings: 0,
    ui_vr: 0
  });
}
imgBLogo = '';
actionSkfb();

//////////////////////////////////
// GUI Code
//////////////////////////////////
function initGui() {
  var controls = document.getElementById('controls');
  var buttonsText = "\n        <button id=\"white\">white</button>\n        <button id=\"100\">100</button>\n        <button id=\"200\">200</button>\n        <button id=\"text\">text</button>\n        <button id=\"red\">red</button>\n        <button id=\"invisible\">invisible</button>\n        <button id=\"discreet\">discreet</button>\n        <button id=\"logos\">logos</button>\n       ";
  controls.innerHTML = buttonsText;
}
initGui();

//////////////////////////////////
// GUI Code end
//////////////////////////////////
