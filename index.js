!function(e){var t={};function n(r){if(t[r])return t[r].exports;var o=t[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)n.d(r,o,function(t){return e[t]}.bind(null,o));return r},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="/public",n(n.s=0)}([function(e,t,n){e.exports=n(1)},function(e,t,n){"use strict";n.r(t);var r,o=!(!(r=document.createElement("canvas")).getContext||!r.getContext("2d")),i=!!window.requestAnimationFrame;function a(e){return document.getElementById(e).getContext("2d",{alpha:!1})}function u(e){var t=document.getElementById("hero-title"),n=document.getElementById("wave-strip-color-computer");return function(){var r=t.clientWidth,o=t.clientHeight,i=Math.floor(o/2);e.canvas.width=r,e.canvas.height=o,e.canvas.style.height="".concat(o,"px");var a=window.getComputedStyle(n);e.fillStyle=a.backgroundColor,e.fillRect(0,0,r,o),e.beginPath(),e.moveTo(0,i);for(var u=8+Math.ceil(16*Math.random());u<r-8;u+=8+Math.ceil(16*Math.random()))e.lineTo(u,Math.ceil(o*Math.random()));e.lineTo(r-1,i),e.lineWidth=4,e.strokeStyle=a.color,e.stroke()}}!function(e){if(o&&i){var t=u(a(e));!function e(){t(),window.requestAnimationFrame(e)}()}}("wave-strip")}]);
//# sourceMappingURL=index.js.map