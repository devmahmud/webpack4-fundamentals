(()=>{var e={73:(e,t)=>{t.Q6="color: red;",t.iN="color:  blue;",t.i8=e=>`color: ${e};`},582:e=>{e.exports=e=>{const t=`Button: ${e}`,r=document.createElement("button");return r.innerText=t,r}}},t={};function r(o){var n=t[o];if(void 0!==n)return n.exports;var c=t[o]={exports:{}};return e[o](c,c.exports,r),c.exports}r.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return r.d(t,{a:t}),t},r.d=(e,t)=>{for(var o in t)r.o(t,o)&&!r.o(e,o)&&Object.defineProperty(e,o,{enumerable:!0,get:t[o]})},r.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"==typeof window)return window}}(),r.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),(()=>{var e;r.g.importScripts&&(e=r.g.location+"");var t=r.g.document;if(!e&&t&&(t.currentScript&&(e=t.currentScript.src),!e)){var o=t.getElementsByTagName("script");o.length&&(e=o[o.length-1].src)}if(!e)throw new Error("Automatic publicPath is not supported in this browser");e=e.replace(/#.*$/,"").replace(/\?.*$/,"").replace(/\/[^\/]+$/,"/"),r.p=e})(),(()=>{"use strict";var e=r(73);const t=document.createElement("div");t.innerText="Top of Footer",t.style=e.Q6;const o=document.createElement("div");o.innerText="Bottom of Footer",o.style=e.iN;const n=document.createElement("footer");n.appendChild(t),n.appendChild(o);var c=r(582),i=r.n(c);const a=r.p+"d3dae4189855b3a72ff91f574ec888bb.png",d=i()("My first button!"),p=((e,t=100,r=100)=>{const o=document.createElement("img");return o.src=e,o.width=r,o.height=t,o})(a);d.style=(0,e.i8)("magenta"),document.body.appendChild(d),document.body.appendChild(n),document.body.appendChild(p)})()})();