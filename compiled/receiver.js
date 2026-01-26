/**
 * chroma.js - JavaScript library for color conversions
 *
 * Copyright (c) 2011-2019, Gregor Aisch
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice, this
 * list of conditions and the following disclaimer.
 *
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 * this list of conditions and the following disclaimer in the documentation
 * and/or other materials provided with the distribution.
 *
 * 3. The name Gregor Aisch may not be used to endorse or promote products
 * derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL GREGOR AISCH OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT,
 * INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING,
 * BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY
 * OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 * NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
 * EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * -------------------------------------------------------
 *
 * chroma.js includes colors from colorbrewer2.org, which are released under
 * the following license:
 *
 * Copyright (c) 2002 Cynthia Brewer, Mark Harrower,
 * and The Pennsylvania State University.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
 * either express or implied. See the License for the specific
 * language governing permissions and limitations under the License.
 *
 * ------------------------------------------------------
 *
 * Named colors are taken from X11 Color Names.
 * http://www.w3.org/TR/css3-color/#svg-color
 *
 * @preserve
 */

!function(r,e){"object"==typeof exports&&"undefined"!=typeof module?module.exports=e():"function"==typeof define&&define.amd?define(e):r.chroma=e()}(this,function(){"use strict";for(var t=function(r,e,t){return void 0===e&&(e=0),void 0===t&&(t=1),r<e?e:t<r?t:r},e={},r=0,n=["Boolean","Number","String","Function","Array","Date","RegExp","Undefined","Null"];r<n.length;r+=1){var a=n[r];e["[object "+a+"]"]=a.toLowerCase()}var Y=function(r){return e[Object.prototype.toString.call(r)]||"object"},f=Math.PI,o={clip_rgb:function(r){r._clipped=!1,r._unclipped=r.slice(0);for(var e=0;e<=3;e++)e<3?((r[e]<0||255<r[e])&&(r._clipped=!0),r[e]=t(r[e],0,255)):3===e&&(r[e]=t(r[e],0,1));return r},limit:t,type:Y,unpack:function(e,r){return void 0===r&&(r=null),3<=e.length?Array.prototype.slice.call(e):"object"==Y(e[0])&&r?r.split("").filter(function(r){return void 0!==e[0][r]}).map(function(r){return e[0][r]}):e[0]},last:function(r){if(r.length<2)return null;var e=r.length-1;return"string"==Y(r[e])?r[e].toLowerCase():null},PI:f,TWOPI:2*f,PITHIRD:f/3,DEG2RAD:f/180,RAD2DEG:180/f},b={format:{},autodetect:[]},c=o.last,i=o.clip_rgb,l=o.type,u=function(){for(var r=[],e=arguments.length;e--;)r[e]=arguments[e];if("object"===l(r[0])&&r[0].constructor&&r[0].constructor===this.constructor)return r[0];var t=c(r),n=!1;if(!t){n=!0,b.sorted||(b.autodetect=b.autodetect.sort(function(r,e){return e.p-r.p}),b.sorted=!0);for(var a=0,f=b.autodetect;a<f.length;a+=1){var o=f[a];if(t=o.test.apply(o,r))break}}if(!b.format[t])throw new Error("unknown format: "+r);var u=b.format[t].apply(null,n?r:r.slice(0,-1));this._rgb=i(u),3===this._rgb.length&&this._rgb.push(1)};u.prototype.toString=function(){return"function"==l(this.hex)?this.hex():"["+this._rgb.join(",")+"]"};var A=u,h=function(){for(var r=[],e=arguments.length;e--;)r[e]=arguments[e];return new(Function.prototype.bind.apply(h.Color,[null].concat(r)))};h.Color=A,h.version="2.0.3";var N=h,d=o.unpack,s=Math.max,p=function(){for(var r=[],e=arguments.length;e--;)r[e]=arguments[e];var t=d(r,"rgb"),n=t[0],a=t[1],f=t[2],o=1-s(n/=255,s(a/=255,f/=255)),u=o<1?1/(1-o):0;return[(1-n-o)*u,(1-a-o)*u,(1-f-o)*u,o]},g=o.unpack,v=function(){for(var r=[],e=arguments.length;e--;)r[e]=arguments[e];var t=(r=g(r,"cmyk"))[0],n=r[1],a=r[2],f=r[3],o=4<r.length?r[4]:1;return 1===f?[0,0,0,o]:[1<=t?0:255*(1-t)*(1-f),1<=n?0:255*(1-n)*(1-f),1<=a?0:255*(1-a)*(1-f),o]},m=o.unpack,y=o.type;A.prototype.cmyk=function(){return p(this._rgb)},N.cmyk=function(){for(var r=[],e=arguments.length;e--;)r[e]=arguments[e];return new(Function.prototype.bind.apply(A,[null].concat(r,["cmyk"])))},b.format.cmyk=v,b.autodetect.push({p:2,test:function(){for(var r=[],e=arguments.length;e--;)r[e]=arguments[e];if(r=m(r,"cmyk"),"array"===y(r)&&4===r.length)return"cmyk"}});var w=o.unpack,k=o.last,M=function(r){return Math.round(100*r)/100},_=function(){for(var r=[],e=arguments.length;e--;)r[e]=arguments[e];var t=w(r,"hsla"),n=k(r)||"lsa";return t[0]=M(t[0]||0),t[1]=M(100*t[1])+"%",t[2]=M(100*t[2])+"%","hsla"===n||3<t.length&&t[3]<1?(t[3]=3<t.length?t[3]:1,n="hsla"):t.length=3,n+"("+t.join(",")+")"},x=o.unpack,E=function(){for(var r=[],e=arguments.length;e--;)r[e]=arguments[e];var t=(r=x(r,"rgba"))[0],n=r[1],a=r[2];t/=255,n/=255,a/=255;var f,o,u=Math.min(t,n,a),c=Math.max(t,n,a),i=(c+u)/2;return c===u?(f=0,o=Number.NaN):f=i<.5?(c-u)/(c+u):(c-u)/(2-c-u),t==c?o=(n-a)/(c-u):n==c?o=2+(a-t)/(c-u):a==c&&(o=4+(t-n)/(c-u)),(o*=60)<0&&(o+=360),3<r.length&&void 0!==r[3]?[o,f,i,r[3]]:[o,f,i]},P=o.unpack,F=o.last,O=Math.round,j=function(){for(var r=[],e=arguments.length;e--;)r[e]=arguments[e];var t=P(r,"rgba"),n=F(r)||"rgb";return"hsl"==n.substr(0,3)?_(E(t),n):(t[0]=O(t[0]),t[1]=O(t[1]),t[2]=O(t[2]),("rgba"===n||3<t.length&&t[3]<1)&&(t[3]=3<t.length?t[3]:1,n="rgba"),n+"("+t.slice(0,"rgb"===n?3:4).join(",")+")")},G=o.unpack,q=Math.round,L=function(){for(var r,e=[],t=arguments.length;t--;)e[t]=arguments[t];var n,a,f,o=(e=G(e,"hsl"))[0],u=e[1],c=e[2];if(0===u)n=a=f=255*c;else{var i=[0,0,0],l=[0,0,0],h=c<.5?c*(1+u):c+u-c*u,d=2*c-h,s=o/360;i[0]=s+1/3,i[1]=s,i[2]=s-1/3;for(var b=0;b<3;b++)i[b]<0&&(i[b]+=1),1<i[b]&&(i[b]-=1),6*i[b]<1?l[b]=d+6*(h-d)*i[b]:2*i[b]<1?l[b]=h:3*i[b]<2?l[b]=d+(h-d)*(2/3-i[b])*6:l[b]=d;n=(r=[q(255*l[0]),q(255*l[1]),q(255*l[2])])[0],a=r[1],f=r[2]}return 3<e.length?[n,a,f,e[3]]:[n,a,f,1]},R=/^rgb\(\s*(-?\d+),\s*(-?\d+)\s*,\s*(-?\d+)\s*\)$/,I=/^rgba\(\s*(-?\d+),\s*(-?\d+)\s*,\s*(-?\d+)\s*,\s*([01]|[01]?\.\d+)\)$/,B=/^rgb\(\s*(-?\d+(?:\.\d+)?)%,\s*(-?\d+(?:\.\d+)?)%\s*,\s*(-?\d+(?:\.\d+)?)%\s*\)$/,C=/^rgba\(\s*(-?\d+(?:\.\d+)?)%,\s*(-?\d+(?:\.\d+)?)%\s*,\s*(-?\d+(?:\.\d+)?)%\s*,\s*([01]|[01]?\.\d+)\)$/,D=/^hsl\(\s*(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)%\s*,\s*(-?\d+(?:\.\d+)?)%\s*\)$/,S=/^hsla\(\s*(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)%\s*,\s*(-?\d+(?:\.\d+)?)%\s*,\s*([01]|[01]?\.\d+)\)$/,$=Math.round,z=function(r){var e;if(r=r.toLowerCase().trim(),b.format.named)try{return b.format.named(r)}catch(r){}if(e=r.match(R)){for(var t=e.slice(1,4),n=0;n<3;n++)t[n]=+t[n];return t[3]=1,t}if(e=r.match(I)){for(var a=e.slice(1,5),f=0;f<4;f++)a[f]=+a[f];return a}if(e=r.match(B)){for(var o=e.slice(1,4),u=0;u<3;u++)o[u]=$(2.55*o[u]);return o[3]=1,o}if(e=r.match(C)){for(var c=e.slice(1,5),i=0;i<3;i++)c[i]=$(2.55*c[i]);return c[3]=+c[3],c}if(e=r.match(D)){var l=e.slice(1,4);l[1]*=.01,l[2]*=.01;var h=L(l);return h[3]=1,h}if(e=r.match(S)){var d=e.slice(1,4);d[1]*=.01,d[2]*=.01;var s=L(d);return s[3]=+e[4],s}};z.test=function(r){return R.test(r)||I.test(r)||B.test(r)||C.test(r)||D.test(r)||S.test(r)};var T=z,U=o.type;A.prototype.css=function(r){return j(this._rgb,r)},N.css=function(){for(var r=[],e=arguments.length;e--;)r[e]=arguments[e];return new(Function.prototype.bind.apply(A,[null].concat(r,["css"])))},b.format.css=T,b.autodetect.push({p:5,test:function(r){for(var e=[],t=arguments.length-1;0<t--;)e[t]=arguments[t+1];if(!e.length&&"string"===U(r)&&T.test(r))return"css"}});var V=o.unpack;b.format.gl=function(){for(var r=[],e=arguments.length;e--;)r[e]=arguments[e];var t=V(r,"rgba");return t[0]*=255,t[1]*=255,t[2]*=255,t},N.gl=function(){for(var r=[],e=arguments.length;e--;)r[e]=arguments[e];return new(Function.prototype.bind.apply(A,[null].concat(r,["gl"])))},A.prototype.gl=function(){var r=this._rgb;return[r[0]/255,r[1]/255,r[2]/255,r[3]]};var W=o.unpack,X=function(){for(var r=[],e=arguments.length;e--;)r[e]=arguments[e];var t,n=W(r,"rgb"),a=n[0],f=n[1],o=n[2],u=Math.min(a,f,o),c=Math.max(a,f,o),i=c-u,l=100*i/255,h=u/(255-i)*100;return 0===i?t=Number.NaN:(a===c&&(t=(f-o)/i),f===c&&(t=2+(o-a)/i),o===c&&(t=4+(a-f)/i),(t*=60)<0&&(t+=360)),[t,l,h]},H=o.unpack,J=Math.floor,K=function(){for(var r,e,t,n,a,f,o=[],u=arguments.length;u--;)o[u]=arguments[u];var c,i,l,h=(o=H(o,"hcg"))[0],d=o[1],s=o[2];s*=255;var b=255*d;if(0===d)c=i=l=s;else{360===h&&(h=0),360<h&&(h-=360),h<0&&(h+=360);var p=J(h/=60),g=h-p,v=s*(1-d),m=v+b*(1-g),y=v+b*g,w=v+b;switch(p){case 0:c=(r=[w,y,v])[0],i=r[1],l=r[2];break;case 1:c=(e=[m,w,v])[0],i=e[1],l=e[2];break;case 2:c=(t=[v,w,y])[0],i=t[1],l=t[2];break;case 3:c=(n=[v,m,w])[0],i=n[1],l=n[2];break;case 4:c=(a=[y,v,w])[0],i=a[1],l=a[2];break;case 5:c=(f=[w,v,m])[0],i=f[1],l=f[2]}}return[c,i,l,3<o.length?o[3]:1]},Q=o.unpack,Z=o.type;A.prototype.hcg=function(){return X(this._rgb)},N.hcg=function(){for(var r=[],e=arguments.length;e--;)r[e]=arguments[e];return new(Function.prototype.bind.apply(A,[null].concat(r,["hcg"])))},b.format.hcg=K,b.autodetect.push({p:1,test:function(){for(var r=[],e=arguments.length;e--;)r[e]=arguments[e];if(r=Q(r,"hcg"),"array"===Z(r)&&3===r.length)return"hcg"}});var rr=o.unpack,er=o.last,tr=Math.round,nr=function(){for(var r=[],e=arguments.length;e--;)r[e]=arguments[e];var t=rr(r,"rgba"),n=t[0],a=t[1],f=t[2],o=t[3],u=er(r)||"auto";void 0===o&&(o=1),"auto"===u&&(u=o<1?"rgba":"rgb");var c="000000"+((n=tr(n))<<16|(a=tr(a))<<8|(f=tr(f))).toString(16);c=c.substr(c.length-6);var i="0"+tr(255*o).toString(16);switch(i=i.substr(i.length-2),u.toLowerCase()){case"rgba":return"#"+c+i;case"argb":return"#"+i+c;default:return"#"+c}},ar=/^#?([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,fr=/^#?([A-Fa-f0-9]{8})$/,or=function(r){if(r.match(ar)){4!==r.length&&7!==r.length||(r=r.substr(1)),3===r.length&&(r=(r=r.split(""))[0]+r[0]+r[1]+r[1]+r[2]+r[2]);var e=parseInt(r,16);return[e>>16,e>>8&255,255&e,1]}if(r.match(fr)){9===r.length&&(r=r.substr(1));var t=parseInt(r,16);return[t>>24&255,t>>16&255,t>>8&255,Math.round((255&t)/255*100)/100]}throw new Error("unknown hex color: "+r)},ur=o.type;A.prototype.hex=function(r){return nr(this._rgb,r)},N.hex=function(){for(var r=[],e=arguments.length;e--;)r[e]=arguments[e];return new(Function.prototype.bind.apply(A,[null].concat(r,["hex"])))},b.format.hex=or,b.autodetect.push({p:4,test:function(r){for(var e=[],t=arguments.length-1;0<t--;)e[t]=arguments[t+1];if(!e.length&&"string"===ur(r)&&[3,4,6,7,8,9].includes(r.length))return"hex"}});var cr=o.unpack,ir=o.TWOPI,lr=Math.min,hr=Math.sqrt,dr=Math.acos,sr=function(){for(var r=[],e=arguments.length;e--;)r[e]=arguments[e];var t,n=cr(r,"rgb"),a=n[0],f=n[1],o=n[2],u=lr(a/=255,f/=255,o/=255),c=(a+f+o)/3,i=0<c?1-u/c:0;return 0===i?t=NaN:(t=(a-f+(a-o))/2,t/=hr((a-f)*(a-f)+(a-o)*(f-o)),t=dr(t),f<o&&(t=ir-t),t/=ir),[360*t,i,c]},br=o.unpack,pr=o.limit,gr=o.TWOPI,vr=o.PITHIRD,mr=Math.cos,yr=function(){for(var r=[],e=arguments.length;e--;)r[e]=arguments[e];var t,n,a,f=(r=br(r,"hsi"))[0],o=r[1],u=r[2];return isNaN(f)&&(f=0),isNaN(o)&&(o=0),360<f&&(f-=360),f<0&&(f+=360),(f/=360)<1/3?n=1-((a=(1-o)/3)+(t=(1+o*mr(gr*f)/mr(vr-gr*f))/3)):f<2/3?a=1-((t=(1-o)/3)+(n=(1+o*mr(gr*(f-=1/3))/mr(vr-gr*f))/3)):t=1-((n=(1-o)/3)+(a=(1+o*mr(gr*(f-=2/3))/mr(vr-gr*f))/3)),[255*(t=pr(u*t*3)),255*(n=pr(u*n*3)),255*(a=pr(u*a*3)),3<r.length?r[3]:1]},wr=o.unpack,kr=o.type;A.prototype.hsi=function(){return sr(this._rgb)},N.hsi=function(){for(var r=[],e=arguments.length;e--;)r[e]=arguments[e];return new(Function.prototype.bind.apply(A,[null].concat(r,["hsi"])))},b.format.hsi=yr,b.autodetect.push({p:2,test:function(){for(var r=[],e=arguments.length;e--;)r[e]=arguments[e];if(r=wr(r,"hsi"),"array"===kr(r)&&3===r.length)return"hsi"}});var Mr=o.unpack,Nr=o.type;A.prototype.hsl=function(){return E(this._rgb)},N.hsl=function(){for(var r=[],e=arguments.length;e--;)r[e]=arguments[e];return new(Function.prototype.bind.apply(A,[null].concat(r,["hsl"])))},b.format.hsl=L,b.autodetect.push({p:2,test:function(){for(var r=[],e=arguments.length;e--;)r[e]=arguments[e];if(r=Mr(r,"hsl"),"array"===Nr(r)&&3===r.length)return"hsl"}});var _r=o.unpack,xr=Math.min,Ar=Math.max,Er=function(){for(var r=[],e=arguments.length;e--;)r[e]=arguments[e];var t,n,a,f=(r=_r(r,"rgb"))[0],o=r[1],u=r[2],c=xr(f,o,u),i=Ar(f,o,u),l=i-c;return a=i/255,0===i?(t=Number.NaN,n=0):(n=l/i,f===i&&(t=(o-u)/l),o===i&&(t=2+(u-f)/l),u===i&&(t=4+(f-o)/l),(t*=60)<0&&(t+=360)),[t,n,a]},Pr=o.unpack,Fr=Math.floor,Or=function(){for(var r,e,t,n,a,f,o=[],u=arguments.length;u--;)o[u]=arguments[u];var c,i,l,h=(o=Pr(o,"hsv"))[0],d=o[1],s=o[2];if(s*=255,0===d)c=i=l=s;else{360===h&&(h=0),360<h&&(h-=360),h<0&&(h+=360);var b=Fr(h/=60),p=h-b,g=s*(1-d),v=s*(1-d*p),m=s*(1-d*(1-p));switch(b){case 0:c=(r=[s,m,g])[0],i=r[1],l=r[2];break;case 1:c=(e=[v,s,g])[0],i=e[1],l=e[2];break;case 2:c=(t=[g,s,m])[0],i=t[1],l=t[2];break;case 3:c=(n=[g,v,s])[0],i=n[1],l=n[2];break;case 4:c=(a=[m,g,s])[0],i=a[1],l=a[2];break;case 5:c=(f=[s,g,v])[0],i=f[1],l=f[2]}}return[c,i,l,3<o.length?o[3]:1]},jr=o.unpack,Gr=o.type;A.prototype.hsv=function(){return Er(this._rgb)},N.hsv=function(){for(var r=[],e=arguments.length;e--;)r[e]=arguments[e];return new(Function.prototype.bind.apply(A,[null].concat(r,["hsv"])))},b.format.hsv=Or,b.autodetect.push({p:2,test:function(){for(var r=[],e=arguments.length;e--;)r[e]=arguments[e];if(r=jr(r,"hsv"),"array"===Gr(r)&&3===r.length)return"hsv"}});var qr=18,Lr=.95047,Rr=1,Ir=1.08883,Br=.137931034,Cr=.206896552,Dr=.12841855,Sr=.008856452,$r=o.unpack,Yr=Math.pow,zr=function(r){return(r/=255)<=.04045?r/12.92:Yr((r+.055)/1.055,2.4)},Tr=function(r){return Sr<r?Yr(r,1/3):r/Dr+Br},Ur=function(r,e,t){return r=zr(r),e=zr(e),t=zr(t),[Tr((.4124564*r+.3575761*e+.1804375*t)/Lr),Tr((.2126729*r+.7151522*e+.072175*t)/Rr),Tr((.0193339*r+.119192*e+.9503041*t)/Ir)]},Vr=function(){for(var r=[],e=arguments.length;e--;)r[e]=arguments[e];var t=$r(r,"rgb"),n=t[0],a=t[1],f=t[2],o=Ur(n,a,f),u=o[0],c=o[1],i=116*c-16;return[i<0?0:i,500*(u-c),200*(c-o[2])]},Wr=o.unpack,Xr=Math.pow,Hr=function(r){return 255*(r<=.00304?12.92*r:1.055*Xr(r,1/2.4)-.055)},Jr=function(r){return Cr<r?r*r*r:Dr*(r-Br)},Kr=function(){for(var r=[],e=arguments.length;e--;)r[e]=arguments[e];var t,n,a,f=(r=Wr(r,"lab"))[0],o=r[1],u=r[2];return n=(f+16)/116,t=isNaN(o)?n:n+o/500,a=isNaN(u)?n:n-u/200,n=Rr*Jr(n),t=Lr*Jr(t),a=Ir*Jr(a),[Hr(3.2404542*t-1.5371385*n-.4985314*a),Hr(-.969266*t+1.8760108*n+.041556*a),Hr(.0556434*t-.2040259*n+1.0572252*a),3<r.length?r[3]:1]},Qr=o.unpack,Zr=o.type;A.prototype.lab=function(){return Vr(this._rgb)},N.lab=function(){for(var r=[],e=arguments.length;e--;)r[e]=arguments[e];return new(Function.prototype.bind.apply(A,[null].concat(r,["lab"])))},b.format.lab=Kr,b.autodetect.push({p:2,test:function(){for(var r=[],e=arguments.length;e--;)r[e]=arguments[e];if(r=Qr(r,"lab"),"array"===Zr(r)&&3===r.length)return"lab"}});var re=o.unpack,ee=o.RAD2DEG,te=Math.sqrt,ne=Math.atan2,ae=Math.round,fe=function(){for(var r=[],e=arguments.length;e--;)r[e]=arguments[e];var t=re(r,"lab"),n=t[0],a=t[1],f=t[2],o=te(a*a+f*f),u=(ne(f,a)*ee+360)%360;return 0===ae(1e4*o)&&(u=Number.NaN),[n,o,u]},oe=o.unpack,ue=function(){for(var r=[],e=arguments.length;e--;)r[e]=arguments[e];var t=oe(r,"rgb"),n=t[0],a=t[1],f=t[2],o=Vr(n,a,f),u=o[0],c=o[1],i=o[2];return fe(u,c,i)},ce=o.unpack,ie=o.DEG2RAD,le=Math.sin,he=Math.cos,de=function(){for(var r=[],e=arguments.length;e--;)r[e]=arguments[e];var t=ce(r,"lch"),n=t[0],a=t[1],f=t[2];return isNaN(f)&&(f=0),[n,he(f*=ie)*a,le(f)*a]},se=o.unpack,be=function(){for(var r=[],e=arguments.length;e--;)r[e]=arguments[e];var t=(r=se(r,"lch"))[0],n=r[1],a=r[2],f=de(t,n,a),o=f[0],u=f[1],c=f[2],i=Kr(o,u,c);return[i[0],i[1],i[2],3<r.length?r[3]:1]},pe=o.unpack,ge=function(){for(var r=[],e=arguments.length;e--;)r[e]=arguments[e];var t=pe(r,"hcl").reverse();return be.apply(void 0,t)},ve=o.unpack,me=o.type;A.prototype.lch=function(){return ue(this._rgb)},A.prototype.hcl=function(){return ue(this._rgb).reverse()},N.lch=function(){for(var r=[],e=arguments.length;e--;)r[e]=arguments[e];return new(Function.prototype.bind.apply(A,[null].concat(r,["lch"])))},N.hcl=function(){for(var r=[],e=arguments.length;e--;)r[e]=arguments[e];return new(Function.prototype.bind.apply(A,[null].concat(r,["hcl"])))},b.format.lch=be,b.format.hcl=ge,["lch","hcl"].forEach(function(t){return b.autodetect.push({p:2,test:function(){for(var r=[],e=arguments.length;e--;)r[e]=arguments[e];if(r=ve(r,t),"array"===me(r)&&3===r.length)return t}})});var ye={aliceblue:"#f0f8ff",antiquewhite:"#faebd7",aqua:"#00ffff",aquamarine:"#7fffd4",azure:"#f0ffff",beige:"#f5f5dc",bisque:"#ffe4c4",black:"#000000",blanchedalmond:"#ffebcd",blue:"#0000ff",blueviolet:"#8a2be2",brown:"#a52a2a",burlywood:"#deb887",cadetblue:"#5f9ea0",chartreuse:"#7fff00",chocolate:"#d2691e",coral:"#ff7f50",cornflower:"#6495ed",cornflowerblue:"#6495ed",cornsilk:"#fff8dc",crimson:"#dc143c",cyan:"#00ffff",darkblue:"#00008b",darkcyan:"#008b8b",darkgoldenrod:"#b8860b",darkgray:"#a9a9a9",darkgreen:"#006400",darkgrey:"#a9a9a9",darkkhaki:"#bdb76b",darkmagenta:"#8b008b",darkolivegreen:"#556b2f",darkorange:"#ff8c00",darkorchid:"#9932cc",darkred:"#8b0000",darksalmon:"#e9967a",darkseagreen:"#8fbc8f",darkslateblue:"#483d8b",darkslategray:"#2f4f4f",darkslategrey:"#2f4f4f",darkturquoise:"#00ced1",darkviolet:"#9400d3",deeppink:"#ff1493",deepskyblue:"#00bfff",dimgray:"#696969",dimgrey:"#696969",dodgerblue:"#1e90ff",firebrick:"#b22222",floralwhite:"#fffaf0",forestgreen:"#228b22",fuchsia:"#ff00ff",gainsboro:"#dcdcdc",ghostwhite:"#f8f8ff",gold:"#ffd700",goldenrod:"#daa520",gray:"#808080",green:"#008000",greenyellow:"#adff2f",grey:"#808080",honeydew:"#f0fff0",hotpink:"#ff69b4",indianred:"#cd5c5c",indigo:"#4b0082",ivory:"#fffff0",khaki:"#f0e68c",laserlemon:"#ffff54",lavender:"#e6e6fa",lavenderblush:"#fff0f5",lawngreen:"#7cfc00",lemonchiffon:"#fffacd",lightblue:"#add8e6",lightcoral:"#f08080",lightcyan:"#e0ffff",lightgoldenrod:"#fafad2",lightgoldenrodyellow:"#fafad2",lightgray:"#d3d3d3",lightgreen:"#90ee90",lightgrey:"#d3d3d3",lightpink:"#ffb6c1",lightsalmon:"#ffa07a",lightseagreen:"#20b2aa",lightskyblue:"#87cefa",lightslategray:"#778899",lightslategrey:"#778899",lightsteelblue:"#b0c4de",lightyellow:"#ffffe0",lime:"#00ff00",limegreen:"#32cd32",linen:"#faf0e6",magenta:"#ff00ff",maroon:"#800000",maroon2:"#7f0000",maroon3:"#b03060",mediumaquamarine:"#66cdaa",mediumblue:"#0000cd",mediumorchid:"#ba55d3",mediumpurple:"#9370db",mediumseagreen:"#3cb371",mediumslateblue:"#7b68ee",mediumspringgreen:"#00fa9a",mediumturquoise:"#48d1cc",mediumvioletred:"#c71585",midnightblue:"#191970",mintcream:"#f5fffa",mistyrose:"#ffe4e1",moccasin:"#ffe4b5",navajowhite:"#ffdead",navy:"#000080",oldlace:"#fdf5e6",olive:"#808000",olivedrab:"#6b8e23",orange:"#ffa500",orangered:"#ff4500",orchid:"#da70d6",palegoldenrod:"#eee8aa",palegreen:"#98fb98",paleturquoise:"#afeeee",palevioletred:"#db7093",papayawhip:"#ffefd5",peachpuff:"#ffdab9",peru:"#cd853f",pink:"#ffc0cb",plum:"#dda0dd",powderblue:"#b0e0e6",purple:"#800080",purple2:"#7f007f",purple3:"#a020f0",rebeccapurple:"#663399",red:"#ff0000",rosybrown:"#bc8f8f",royalblue:"#4169e1",saddlebrown:"#8b4513",salmon:"#fa8072",sandybrown:"#f4a460",seagreen:"#2e8b57",seashell:"#fff5ee",sienna:"#a0522d",silver:"#c0c0c0",skyblue:"#87ceeb",slateblue:"#6a5acd",slategray:"#708090",slategrey:"#708090",snow:"#fffafa",springgreen:"#00ff7f",steelblue:"#4682b4",tan:"#d2b48c",teal:"#008080",thistle:"#d8bfd8",tomato:"#ff6347",turquoise:"#40e0d0",violet:"#ee82ee",wheat:"#f5deb3",white:"#ffffff",whitesmoke:"#f5f5f5",yellow:"#ffff00",yellowgreen:"#9acd32"},we=o.type;A.prototype.name=function(){for(var r=nr(this._rgb,"rgb"),e=0,t=Object.keys(ye);e<t.length;e+=1){var n=t[e];if(ye[n]===r)return n.toLowerCase()}return r},b.format.named=function(r){if(r=r.toLowerCase(),ye[r])return or(ye[r]);throw new Error("unknown color name: "+r)},b.autodetect.push({p:5,test:function(r){for(var e=[],t=arguments.length-1;0<t--;)e[t]=arguments[t+1];if(!e.length&&"string"===we(r)&&ye[r.toLowerCase()])return"named"}});var ke=o.unpack,Me=function(){for(var r=[],e=arguments.length;e--;)r[e]=arguments[e];var t=ke(r,"rgb");return(t[0]<<16)+(t[1]<<8)+t[2]},Ne=o.type,_e=function(r){if("number"==Ne(r)&&0<=r&&r<=16777215)return[r>>16,r>>8&255,255&r,1];throw new Error("unknown num color: "+r)},xe=o.type;A.prototype.num=function(){return Me(this._rgb)},N.num=function(){for(var r=[],e=arguments.length;e--;)r[e]=arguments[e];return new(Function.prototype.bind.apply(A,[null].concat(r,["num"])))},b.format.num=_e,b.autodetect.push({p:5,test:function(){for(var r=[],e=arguments.length;e--;)r[e]=arguments[e];if(1===r.length&&"number"===xe(r[0])&&0<=r[0]&&r[0]<=16777215)return"num"}});var Ae=o.unpack,Ee=o.type,Pe=Math.round;A.prototype.rgb=function(r){return void 0===r&&(r=!0),!1===r?this._rgb.slice(0,3):this._rgb.slice(0,3).map(Pe)},A.prototype.rgba=function(t){return void 0===t&&(t=!0),this._rgb.slice(0,4).map(function(r,e){return e<3?!1===t?r:Pe(r):r})},N.rgb=function(){for(var r=[],e=arguments.length;e--;)r[e]=arguments[e];return new(Function.prototype.bind.apply(A,[null].concat(r,["rgb"])))},b.format.rgb=function(){for(var r=[],e=arguments.length;e--;)r[e]=arguments[e];var t=Ae(r,"rgba");return void 0===t[3]&&(t[3]=1),t},b.autodetect.push({p:3,test:function(){for(var r=[],e=arguments.length;e--;)r[e]=arguments[e];if(r=Ae(r,"rgba"),"array"===Ee(r)&&(3===r.length||4===r.length&&"number"==Ee(r[3])&&0<=r[3]&&r[3]<=1))return"rgb"}});var Fe=Math.log,Oe=function(r){var e,t,n,a=r/100;return n=a<66?(e=255,t=-155.25485562709179-.44596950469579133*(t=a-2)+104.49216199393888*Fe(t),a<20?0:.8274096064007395*(n=a-10)-254.76935184120902+115.67994401066147*Fe(n)):(e=351.97690566805693+.114206453784165*(e=a-55)-40.25366309332127*Fe(e),t=325.4494125711974+.07943456536662342*(t=a-50)-28.0852963507957*Fe(t),255),[e,t,n,1]},je=o.unpack,Ge=Math.round,qe=function(){for(var r=[],e=arguments.length;e--;)r[e]=arguments[e];for(var t,n=je(r,"rgb"),a=n[0],f=n[2],o=1e3,u=4e4;.4<u-o;){var c=Oe(t=.5*(u+o));c[2]/c[0]>=f/a?u=t:o=t}return Ge(t)};A.prototype.temp=A.prototype.kelvin=A.prototype.temperature=function(){return qe(this._rgb)},N.temp=N.kelvin=N.temperature=function(){for(var r=[],e=arguments.length;e--;)r[e]=arguments[e];return new(Function.prototype.bind.apply(A,[null].concat(r,["temp"])))},b.format.temp=b.format.kelvin=b.format.temperature=Oe;var Le=o.type;A.prototype.alpha=function(r,e){return void 0===e&&(e=!1),void 0!==r&&"number"===Le(r)?e?(this._rgb[3]=r,this):new A([this._rgb[0],this._rgb[1],this._rgb[2],r],"rgb"):this._rgb[3]},A.prototype.clipped=function(){return this._rgb._clipped||!1},A.prototype.darken=function(r){void 0===r&&(r=1);var e=this.lab();return e[0]-=qr*r,new A(e,"lab").alpha(this.alpha(),!0)},A.prototype.brighten=function(r){return void 0===r&&(r=1),this.darken(-r)},A.prototype.darker=A.prototype.darken,A.prototype.brighter=A.prototype.brighten,A.prototype.get=function(r){var e=r.split("."),t=e[0],n=e[1],a=this[t]();if(n){var f=t.indexOf(n);if(-1<f)return a[f];throw new Error("unknown channel "+n+" in mode "+t)}return a};var Re=o.type,Ie=Math.pow;A.prototype.luminance=function(a){if(void 0===a||"number"!==Re(a))return Be.apply(void 0,this._rgb.slice(0,3));if(0===a)return new A([0,0,0,this._rgb[3]],"rgb");if(1===a)return new A([255,255,255,this._rgb[3]],"rgb");var r=this.luminance(),f=20,o=function(r,e){var t=r.interpolate(e,.5,"rgb"),n=t.luminance();return Math.abs(a-n)<1e-7||!f--?t:a<n?o(r,t):o(t,e)},e=(a<r?o(new A([0,0,0]),this):o(this,new A([255,255,255]))).rgb();return new A(e.concat([this._rgb[3]]))};var Be=function(r,e,t){return.2126*(r=Ce(r))+.7152*(e=Ce(e))+.0722*(t=Ce(t))},Ce=function(r){return(r/=255)<=.03928?r/12.92:Ie((r+.055)/1.055,2.4)},De={},Se=o.type,$e=function(r,e,t){void 0===t&&(t=.5);for(var n=[],a=arguments.length-3;0<a--;)n[a]=arguments[a+3];var f=n[0]||"lrgb";if(De[f]||n.length||(f=Object.keys(De)[0]),!De[f])throw new Error("interpolation mode "+f+" is not defined");return"object"!==Se(r)&&(r=new A(r)),"object"!==Se(e)&&(e=new A(e)),De[f](r,e,t).alpha(r.alpha()+t*(e.alpha()-r.alpha()))};A.prototype.mix=A.prototype.interpolate=function(r,e){void 0===e&&(e=.5);for(var t=[],n=arguments.length-2;0<n--;)t[n]=arguments[n+2];return $e.apply(void 0,[this,r,e].concat(t))},A.prototype.premultiply=function(r){void 0===r&&(r=!1);var e=this._rgb,t=e[3];return r?(this._rgb=[e[0]*t,e[1]*t,e[2]*t,t],this):new A([e[0]*t,e[1]*t,e[2]*t,t],"rgb")},A.prototype.saturate=function(r){void 0===r&&(r=1);var e=this.lch();return e[1]+=qr*r,e[1]<0&&(e[1]=0),new A(e,"lch").alpha(this.alpha(),!0)},A.prototype.desaturate=function(r){return void 0===r&&(r=1),this.saturate(-r)};var Ye=o.type;A.prototype.set=function(r,e,t){void 0===t&&(t=!1);var n=r.split("."),a=n[0],f=n[1],o=this[a]();if(f){var u=a.indexOf(f);if(-1<u){if("string"==Ye(e))switch(e.charAt(0)){case"+":case"-":o[u]+=+e;break;case"*":o[u]*=+e.substr(1);break;case"/":o[u]/=+e.substr(1);break;default:o[u]=+e}else{if("number"!==Ye(e))throw new Error("unsupported value for Color.set");o[u]=e}var c=new A(o,a);return t?(this._rgb=c._rgb,this):c}throw new Error("unknown channel "+f+" in mode "+a)}return o};De.rgb=function(r,e,t){var n=r._rgb,a=e._rgb;return new A(n[0]+t*(a[0]-n[0]),n[1]+t*(a[1]-n[1]),n[2]+t*(a[2]-n[2]),"rgb")};var ze=Math.sqrt,Te=Math.pow;De.lrgb=function(r,e,t){var n=r._rgb,a=n[0],f=n[1],o=n[2],u=e._rgb,c=u[0],i=u[1],l=u[2];return new A(ze(Te(a,2)*(1-t)+Te(c,2)*t),ze(Te(f,2)*(1-t)+Te(i,2)*t),ze(Te(o,2)*(1-t)+Te(l,2)*t),"rgb")};De.lab=function(r,e,t){var n=r.lab(),a=e.lab();return new A(n[0]+t*(a[0]-n[0]),n[1]+t*(a[1]-n[1]),n[2]+t*(a[2]-n[2]),"lab")};var Ue=function(r,e,t,n){var a,f,o,u,c,i,l,h,d,s,b,p;return"hsl"===n?(o=r.hsl(),u=e.hsl()):"hsv"===n?(o=r.hsv(),u=e.hsv()):"hcg"===n?(o=r.hcg(),u=e.hcg()):"hsi"===n?(o=r.hsi(),u=e.hsi()):"lch"!==n&&"hcl"!==n||(n="hcl",o=r.hcl(),u=e.hcl()),"h"===n.substr(0,1)&&(c=(a=o)[0],l=a[1],d=a[2],i=(f=u)[0],h=f[1],s=f[2]),isNaN(c)||isNaN(i)?isNaN(c)?isNaN(i)?p=Number.NaN:(p=i,1!=d&&0!=d||"hsv"==n||(b=h)):(p=c,1!=s&&0!=s||"hsv"==n||(b=l)):p=c+t*(c<i&&180<i-c?i-(c+360):i<c&&180<c-i?i+360-c:i-c),void 0===b&&(b=l+t*(h-l)),new A([p,b,d+t*(s-d)],n)},Ve=function(r,e,t){return Ue(r,e,t,"lch")};De.lch=Ve,De.hcl=Ve;De.num=function(r,e,t){var n=r.num(),a=e.num();return new A(n+t*(a-n),"num")};De.hcg=function(r,e,t){return Ue(r,e,t,"hcg")};De.hsi=function(r,e,t){return Ue(r,e,t,"hsi")};De.hsl=function(r,e,t){return Ue(r,e,t,"hsl")};De.hsv=function(r,e,t){return Ue(r,e,t,"hsv")};var We=o.clip_rgb,Xe=Math.pow,He=Math.sqrt,Je=Math.PI,Ke=Math.cos,Qe=Math.sin,Ze=Math.atan2,rt=function(r){for(var e=1/r.length,t=[0,0,0,0],n=0,a=r;n<a.length;n+=1){var f=a[n]._rgb;t[0]+=Xe(f[0],2)*e,t[1]+=Xe(f[1],2)*e,t[2]+=Xe(f[2],2)*e,t[3]+=f[3]*e}return t[0]=He(t[0]),t[1]=He(t[1]),t[2]=He(t[2]),.9999999<t[3]&&(t[3]=1),new A(We(t))},et=o.type,tt=Math.pow,nt=function(i){var u="rgb",c=N("#ccc"),e=0,l=[0,1],h=[],d=[0,0],s=!1,b=[],t=!1,p=0,g=1,n=!1,v={},m=!0,y=1,a=function(r){if((r=r||["#fff","#000"])&&"string"===et(r)&&N.brewer&&N.brewer[r.toLowerCase()]&&(r=N.brewer[r.toLowerCase()]),"array"===et(r)){1===r.length&&(r=[r[0],r[0]]),r=r.slice(0);for(var e=0;e<r.length;e++)r[e]=N(r[e]);for(var t=h.length=0;t<r.length;t++)h.push(t/(r.length-1))}return f(),b=r},w=function(r){return r},k=function(r,e){var t,n;if(null==e&&(e=!1),isNaN(r)||null===r)return c;e?n=r:n=s&&2<s.length?function(r){if(null==s)return 0;for(var e=s.length-1,t=0;t<e&&r>=s[t];)t++;return t-1}(r)/(s.length-2):g!==p?(r-p)/(g-p):1;e||(n=w(n)),1!==y&&(n=tt(n,y)),n=d[0]+n*(1-d[0]-d[1]),n=Math.min(1,Math.max(0,n));var a=Math.floor(1e4*n);if(m&&v[a])t=v[a];else{if("array"===et(b))for(var f=0;f<h.length;f++){var o=h[f];if(n<=o){t=b[f];break}if(o<=n&&f===h.length-1){t=b[f];break}if(o<n&&n<h[f+1]){n=(n-o)/(h[f+1]-o),t=N.interpolate(b[f],b[f+1],n,u);break}}else"function"===et(b)&&(t=b(n));m&&(v[a]=t)}return t},f=function(){return v={}};a(i);var M=function(r){var e=N(k(r));return t&&e[t]?e[t]():e};return M.classes=function(r){if(null==r)return s;if("array"===et(r))l=[(s=r)[0],r[r.length-1]];else{var e=N.analyze(l);s=0===r?[e.min,e.max]:N.limits(e,"e",r)}return M},M.domain=function(r){if(!arguments.length)return l;p=r[0],g=r[r.length-1],h=[];var e=b.length;if(r.length===e&&p!==g)for(var t=0,n=Array.from(r);t<n.length;t+=1){var a=n[t];h.push((a-p)/(g-p))}else for(var f=0;f<e;f++)h.push(f/(e-1));return l=[p,g],M},M.mode=function(r){return arguments.length?(u=r,f(),M):u},M.range=function(r,e){return a(r),M},M.out=function(r){return t=r,M},M.spread=function(r){return arguments.length?(e=r,M):e},M.correctLightness=function(r){return null==r&&(r=!0),n=r,f(),w=n?function(r){for(var e=k(0,!0).lab()[0],t=k(1,!0).lab()[0],n=t<e,a=k(r,!0).lab()[0],f=e+(t-e)*r,o=a-f,u=0,c=1,i=20;.01<Math.abs(o)&&0<i--;)n&&(o*=-1),r+=o<0?.5*(c-(u=r)):.5*(u-(c=r)),a=k(r,!0).lab()[0],o=a-f;return r}:function(r){return r},M},M.padding=function(r){return null!=r?("number"===et(r)&&(r=[r,r]),d=r,M):d},M.colors=function(e,t){arguments.length<2&&(t="hex");var r=[];if(0===arguments.length)r=b.slice(0);else if(1===e)r=[M(.5)];else if(1<e){var n=l[0],a=l[1]-n;r=function(r,e,t){for(var n=[],a=r<e,f=t?a?e+1:e-1:e,o=r;a?o<f:f<o;a?o++:o--)n.push(o);return n}(0,e,!1).map(function(r){return M(n+r/(e-1)*a)})}else{i=[];var f=[];if(s&&2<s.length)for(var o=1,u=s.length,c=1<=u;c?o<u:u<o;c?o++:o--)f.push(.5*(s[o-1]+s[o]));else f=l;r=f.map(function(r){return M(r)})}return N[t]&&(r=r.map(function(r){return r[t]()})),r},M.cache=function(r){return null!=r?(m=r,M):m},M.gamma=function(r){return null!=r?(y=r,M):y},M.nodata=function(r){return null!=r?(c=N(r),M):c},M};var at=function(r){var e,t,n,a,f,o,u;if(2===(r=r.map(function(r){return new A(r)})).length)e=r.map(function(r){return r.lab()}),f=e[0],o=e[1],a=function(e){var r=[0,1,2].map(function(r){return f[r]+e*(o[r]-f[r])});return new A(r,"lab")};else if(3===r.length)t=r.map(function(r){return r.lab()}),f=t[0],o=t[1],u=t[2],a=function(e){var r=[0,1,2].map(function(r){return(1-e)*(1-e)*f[r]+2*(1-e)*e*o[r]+e*e*u[r]});return new A(r,"lab")};else if(4===r.length){var c;n=r.map(function(r){return r.lab()}),f=n[0],o=n[1],u=n[2],c=n[3],a=function(e){var r=[0,1,2].map(function(r){return(1-e)*(1-e)*(1-e)*f[r]+3*(1-e)*(1-e)*e*o[r]+3*(1-e)*e*e*u[r]+e*e*e*c[r]});return new A(r,"lab")}}else if(5===r.length){var i=at(r.slice(0,3)),l=at(r.slice(2,5));a=function(r){return r<.5?i(2*r):l(2*(r-.5))}}return a},ft=function(r,e,t){if(!ft[t])throw new Error("unknown blend mode "+t);return ft[t](r,e)},ot=function(a){return function(r,e){var t=N(e).rgb(),n=N(r).rgb();return N.rgb(a(t,n))}},ut=function(n){return function(r,e){var t=[];return t[0]=n(r[0],e[0]),t[1]=n(r[1],e[1]),t[2]=n(r[2],e[2]),t}};ft.normal=ot(ut(function(r){return r})),ft.multiply=ot(ut(function(r,e){return r*e/255})),ft.screen=ot(ut(function(r,e){return 255*(1-(1-r/255)*(1-e/255))})),ft.overlay=ot(ut(function(r,e){return e<128?2*r*e/255:255*(1-2*(1-r/255)*(1-e/255))})),ft.darken=ot(ut(function(r,e){return e<r?e:r})),ft.lighten=ot(ut(function(r,e){return e<r?r:e})),ft.dodge=ot(ut(function(r,e){return 255===r?255:255<(r=e/255*255/(1-r/255))?255:r})),ft.burn=ot(ut(function(r,e){return 255*(1-(1-e/255)/(r/255))}));for(var ct=ft,it=o.type,lt=o.clip_rgb,ht=o.TWOPI,dt=Math.pow,st=Math.sin,bt=Math.cos,pt=Math.floor,gt=Math.random,vt=Math.log,mt=Math.pow,yt=Math.floor,wt=Math.abs,kt=function(r,e){void 0===e&&(e=null);var t={min:Number.MAX_VALUE,max:-1*Number.MAX_VALUE,sum:0,values:[],count:0};return"object"===Y(r)&&(r=Object.values(r)),r.forEach(function(r){e&&"object"===Y(r)&&(r=r[e]),null==r||isNaN(r)||(t.values.push(r),t.sum+=r,r<t.min&&(t.min=r),r>t.max&&(t.max=r),t.count+=1)}),t.domain=[t.min,t.max],t.limits=function(r,e){return Mt(t,r,e)},t},Mt=function(r,e,t){void 0===e&&(e="equal"),void 0===t&&(t=7),"array"==Y(r)&&(r=kt(r));var n=r.min,a=r.max,f=r.values.sort(function(r,e){return r-e});if(1===t)return[n,a];var o=[];if("c"===e.substr(0,1)&&(o.push(n),o.push(a)),"e"===e.substr(0,1)){o.push(n);for(var u=1;u<t;u++)o.push(n+u/t*(a-n));o.push(a)}else if("l"===e.substr(0,1)){if(n<=0)throw new Error("Logarithmic scales are only possible for values > 0");var c=Math.LOG10E*vt(n),i=Math.LOG10E*vt(a);o.push(n);for(var l=1;l<t;l++)o.push(mt(10,c+l/t*(i-c)));o.push(a)}else if("q"===e.substr(0,1)){o.push(n);for(var h=1;h<t;h++){var d=(f.length-1)*h/t,s=yt(d);if(s===d)o.push(f[s]);else{var b=d-s;o.push(f[s]*(1-b)+f[s+1]*b)}}o.push(a)}else if("k"===e.substr(0,1)){var p,g=f.length,v=new Array(g),m=new Array(t),y=!0,w=0,k=null;(k=[]).push(n);for(var M=1;M<t;M++)k.push(n+M/t*(a-n));for(k.push(a);y;){for(var N=0;N<t;N++)m[N]=0;for(var _=0;_<g;_++)for(var x=f[_],A=Number.MAX_VALUE,E=void 0,P=0;P<t;P++){var F=wt(k[P]-x);F<A&&(A=F,E=P),m[E]++,v[_]=E}for(var O=new Array(t),j=0;j<t;j++)O[j]=null;for(var G=0;G<g;G++)null===O[p=v[G]]?O[p]=f[G]:O[p]+=f[G];for(var q=0;q<t;q++)O[q]*=1/m[q];y=!1;for(var L=0;L<t;L++)if(O[L]!==k[L]){y=!0;break}k=O,200<++w&&(y=!1)}for(var R={},I=0;I<t;I++)R[I]=[];for(var B=0;B<g;B++)R[p=v[B]].push(f[B]);for(var C=[],D=0;D<t;D++)C.push(R[D][0]),C.push(R[D][R[D].length-1]);C=C.sort(function(r,e){return r-e}),o.push(C[0]);for(var S=1;S<C.length;S+=2){var $=C[S];isNaN($)||-1!==o.indexOf($)||o.push($)}}return o},Nt={analyze:kt,limits:Mt},_t=Math.sqrt,xt=Math.atan2,At=Math.abs,Et=Math.cos,Pt=Math.PI,Ft={cool:function(){return nt([N.hsl(180,1,.9),N.hsl(250,.7,.4)])},hot:function(){return nt(["#000","#f00","#ff0","#fff"]).mode("rgb")}},Ot={OrRd:["#fff7ec","#fee8c8","#fdd49e","#fdbb84","#fc8d59","#ef6548","#d7301f","#b30000","#7f0000"],PuBu:["#fff7fb","#ece7f2","#d0d1e6","#a6bddb","#74a9cf","#3690c0","#0570b0","#045a8d","#023858"],BuPu:["#f7fcfd","#e0ecf4","#bfd3e6","#9ebcda","#8c96c6","#8c6bb1","#88419d","#810f7c","#4d004b"],Oranges:["#fff5eb","#fee6ce","#fdd0a2","#fdae6b","#fd8d3c","#f16913","#d94801","#a63603","#7f2704"],BuGn:["#f7fcfd","#e5f5f9","#ccece6","#99d8c9","#66c2a4","#41ae76","#238b45","#006d2c","#00441b"],YlOrBr:["#ffffe5","#fff7bc","#fee391","#fec44f","#fe9929","#ec7014","#cc4c02","#993404","#662506"],YlGn:["#ffffe5","#f7fcb9","#d9f0a3","#addd8e","#78c679","#41ab5d","#238443","#006837","#004529"],Reds:["#fff5f0","#fee0d2","#fcbba1","#fc9272","#fb6a4a","#ef3b2c","#cb181d","#a50f15","#67000d"],RdPu:["#fff7f3","#fde0dd","#fcc5c0","#fa9fb5","#f768a1","#dd3497","#ae017e","#7a0177","#49006a"],Greens:["#f7fcf5","#e5f5e0","#c7e9c0","#a1d99b","#74c476","#41ab5d","#238b45","#006d2c","#00441b"],YlGnBu:["#ffffd9","#edf8b1","#c7e9b4","#7fcdbb","#41b6c4","#1d91c0","#225ea8","#253494","#081d58"],Purples:["#fcfbfd","#efedf5","#dadaeb","#bcbddc","#9e9ac8","#807dba","#6a51a3","#54278f","#3f007d"],GnBu:["#f7fcf0","#e0f3db","#ccebc5","#a8ddb5","#7bccc4","#4eb3d3","#2b8cbe","#0868ac","#084081"],Greys:["#ffffff","#f0f0f0","#d9d9d9","#bdbdbd","#969696","#737373","#525252","#252525","#000000"],YlOrRd:["#ffffcc","#ffeda0","#fed976","#feb24c","#fd8d3c","#fc4e2a","#e31a1c","#bd0026","#800026"],PuRd:["#f7f4f9","#e7e1ef","#d4b9da","#c994c7","#df65b0","#e7298a","#ce1256","#980043","#67001f"],Blues:["#f7fbff","#deebf7","#c6dbef","#9ecae1","#6baed6","#4292c6","#2171b5","#08519c","#08306b"],PuBuGn:["#fff7fb","#ece2f0","#d0d1e6","#a6bddb","#67a9cf","#3690c0","#02818a","#016c59","#014636"],Viridis:["#440154","#482777","#3f4a8a","#31678e","#26838f","#1f9d8a","#6cce5a","#b6de2b","#fee825"],Spectral:["#9e0142","#d53e4f","#f46d43","#fdae61","#fee08b","#ffffbf","#e6f598","#abdda4","#66c2a5","#3288bd","#5e4fa2"],RdYlGn:["#a50026","#d73027","#f46d43","#fdae61","#fee08b","#ffffbf","#d9ef8b","#a6d96a","#66bd63","#1a9850","#006837"],RdBu:["#67001f","#b2182b","#d6604d","#f4a582","#fddbc7","#f7f7f7","#d1e5f0","#92c5de","#4393c3","#2166ac","#053061"],PiYG:["#8e0152","#c51b7d","#de77ae","#f1b6da","#fde0ef","#f7f7f7","#e6f5d0","#b8e186","#7fbc41","#4d9221","#276419"],PRGn:["#40004b","#762a83","#9970ab","#c2a5cf","#e7d4e8","#f7f7f7","#d9f0d3","#a6dba0","#5aae61","#1b7837","#00441b"],RdYlBu:["#a50026","#d73027","#f46d43","#fdae61","#fee090","#ffffbf","#e0f3f8","#abd9e9","#74add1","#4575b4","#313695"],BrBG:["#543005","#8c510a","#bf812d","#dfc27d","#f6e8c3","#f5f5f5","#c7eae5","#80cdc1","#35978f","#01665e","#003c30"],RdGy:["#67001f","#b2182b","#d6604d","#f4a582","#fddbc7","#ffffff","#e0e0e0","#bababa","#878787","#4d4d4d","#1a1a1a"],PuOr:["#7f3b08","#b35806","#e08214","#fdb863","#fee0b6","#f7f7f7","#d8daeb","#b2abd2","#8073ac","#542788","#2d004b"],Set2:["#66c2a5","#fc8d62","#8da0cb","#e78ac3","#a6d854","#ffd92f","#e5c494","#b3b3b3"],Accent:["#7fc97f","#beaed4","#fdc086","#ffff99","#386cb0","#f0027f","#bf5b17","#666666"],Set1:["#e41a1c","#377eb8","#4daf4a","#984ea3","#ff7f00","#ffff33","#a65628","#f781bf","#999999"],Set3:["#8dd3c7","#ffffb3","#bebada","#fb8072","#80b1d3","#fdb462","#b3de69","#fccde5","#d9d9d9","#bc80bd","#ccebc5","#ffed6f"],Dark2:["#1b9e77","#d95f02","#7570b3","#e7298a","#66a61e","#e6ab02","#a6761d","#666666"],Paired:["#a6cee3","#1f78b4","#b2df8a","#33a02c","#fb9a99","#e31a1c","#fdbf6f","#ff7f00","#cab2d6","#6a3d9a","#ffff99","#b15928"],Pastel2:["#b3e2cd","#fdcdac","#cbd5e8","#f4cae4","#e6f5c9","#fff2ae","#f1e2cc","#cccccc"],Pastel1:["#fbb4ae","#b3cde3","#ccebc5","#decbe4","#fed9a6","#ffffcc","#e5d8bd","#fddaec","#f2f2f2"]},jt=0,Gt=Object.keys(Ot);jt<Gt.length;jt+=1){var qt=Gt[jt];Ot[qt.toLowerCase()]=Ot[qt]}var Lt=Ot;return N.average=function(r,a){void 0===a&&(a="lrgb");var e=r.length;if(r=r.map(function(r){return new A(r)}),"lrgb"===a)return rt(r);for(var t=r.shift(),f=t.get(a),o=[],u=0,c=0,n=0;n<f.length;n++)if(f[n]=f[n]||0,o.push(isNaN(f[n])?0:1),"h"===a.charAt(n)&&!isNaN(f[n])){var i=f[n]/180*Je;u+=Ke(i),c+=Qe(i)}var l=t.alpha();r.forEach(function(r){var e=r.get(a);l+=r.alpha();for(var t=0;t<f.length;t++)if(!isNaN(e[t]))if(o[t]++,"h"===a.charAt(t)){var n=e[t]/180*Je;u+=Ke(n),c+=Qe(n)}else f[t]+=e[t]});for(var h=0;h<f.length;h++)if("h"===a.charAt(h)){for(var d=Ze(c/o[h],u/o[h])/Je*180;d<0;)d+=360;for(;360<=d;)d-=360;f[h]=d}else f[h]=f[h]/o[h];return l/=e,new A(f,a).alpha(.99999<l?1:l,!0)},N.bezier=function(r){var e=at(r);return e.scale=function(){return nt(e)},e},N.blend=ct,N.cubehelix=function(o,u,c,i,l){void 0===o&&(o=300),void 0===u&&(u=-1.5),void 0===c&&(c=1),void 0===i&&(i=1),void 0===l&&(l=[0,1]);var h,d=0;"array"===it(l)?h=l[1]-l[0]:(h=0,l=[l,l]);var e=function(r){var e=ht*((o+120)/360+u*r),t=dt(l[0]+h*r,i),n=(0!==d?c[0]+r*d:c)*t*(1-t)/2,a=bt(e),f=st(e);return N(lt([255*(t+n*(-.14861*a+1.78277*f)),255*(t+n*(-.29227*a-.90649*f)),255*(t+n*(1.97294*a)),1]))};return e.start=function(r){return null==r?o:(o=r,e)},e.rotations=function(r){return null==r?u:(u=r,e)},e.gamma=function(r){return null==r?i:(i=r,e)},e.hue=function(r){return null==r?c:("array"===it(c=r)?0==(d=c[1]-c[0])&&(c=c[1]):d=0,e)},e.lightness=function(r){return null==r?l:(h="array"===it(r)?(l=r)[1]-r[0]:(l=[r,r],0),e)},e.scale=function(){return N.scale(e)},e.hue(c),e},N.mix=N.interpolate=$e,N.random=function(){for(var r="#",e=0;e<6;e++)r+="0123456789abcdef".charAt(pt(16*gt()));return new A(r,"hex")},N.scale=nt,N.analyze=Nt.analyze,N.contrast=function(r,e){r=new A(r),e=new A(e);var t=r.luminance(),n=e.luminance();return n<t?(t+.05)/(n+.05):(n+.05)/(t+.05)},N.deltaE=function(r,e,t,n){void 0===t&&(t=1),void 0===n&&(n=1),r=new A(r),e=new A(e);for(var a=Array.from(r.lab()),f=a[0],o=a[1],u=a[2],c=Array.from(e.lab()),i=c[0],l=c[1],h=c[2],d=_t(o*o+u*u),s=_t(l*l+h*h),b=f<16?.511:.040975*f/(1+.01765*f),p=.0638*d/(1+.0131*d)+.638,g=d<1e-6?0:180*xt(u,o)/Pt;g<0;)g+=360;for(;360<=g;)g-=360;var v=164<=g&&g<=345?.56+At(.2*Et(Pt*(g+168)/180)):.36+At(.4*Et(Pt*(g+35)/180)),m=d*d*d*d,y=_t(m/(m+1900)),w=p*(y*v+1-y),k=d-s,M=o-l,N=u-h,_=(f-i)/(t*b),x=k/(n*p);return _t(_*_+x*x+(M*M+N*N-k*k)/(w*w))},N.distance=function(r,e,t){void 0===t&&(t="lab"),r=new A(r),e=new A(e);var n=r.get(t),a=e.get(t),f=0;for(var o in n){var u=(n[o]||0)-(a[o]||0);f+=u*u}return Math.sqrt(f)},N.limits=Nt.limits,N.valid=function(){for(var r=[],e=arguments.length;e--;)r[e]=arguments[e];try{return new(Function.prototype.bind.apply(A,[null].concat(r))),!0}catch(r){return!1}},N.scales=Ft,N.colors=ye,N.brewer=Lt,N});

/*

	This file is part of OpenWebRX,
	an open-source SDR receiver software with a web UI.
	Copyright (c) 2013-2015 by Andras Retzler <randras@sdr.hu>
	Copyright (c) 2019-2021 by Jakob Ketterl <dd5jfk@darc.de>
	Copyright (c) 2022-2024 by Marat Fayzullin <luarvique@gmail.com>

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as
    published by the Free Software Foundation, either version 3 of the
    License, or (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.

"""

*/

is_firefox = navigator.userAgent.indexOf("Firefox") >= 0;

var bandwidth;
var center_freq;
var fft_size;
var fft_compression = "none";
var fft_codec;
var waterfall_setup_done = 0;
var secondary_fft_size;
var tuning_step_default = 1;
var tuning_step = 1;
var spectrum = null;
var bandplan = null;
var scanner = null;
var bookmarks = null;
var audioEngine = null;
var wf_data = null;

function zoomInOneStep() {
    zoom_set(zoom_level + 1);
}

function zoomOutOneStep() {
    zoom_set(zoom_level - 1);
}

function zoomInTotal() {
    zoom_set(zoom_levels.length - 1);
}

function zoomOutTotal() {
    zoom_set(0);
}

function tuneBySteps(steps) {
    steps = Math.round(steps);
    if (steps != 0) {
        UI.setOffsetFrequency(UI.getOffsetFrequency() + steps * tuning_step);
    }
}

function tuneBySquelch(dir) {
    // Must have a copy of the last received waterfall
    if (wf_data == null) return;

    // Get current squelch threshold from the slider
    // (why do we need to subtract ~13dB here to make FFT match the S-meter?)
    var $slider = $('#openwebrx-panel-receiver .openwebrx-squelch-slider');
    var squelch = $slider.val() - 13.0;

    // Start from the current offset within the waterfall
    var f = UI.getOffsetFrequency();

    // Scan up or down the waterfall
    dir = tuning_step * (dir>=0? 1 : -1);
    for(f += dir ; ; f += dir) {
        var i = Math.round(wf_data.length * (f / bandwidth + 0.5));
        if (i < 0 || i >= wf_data.length) {
            break;
        } else if (wf_data[i] >= squelch) {
            UI.setOffsetFrequency(f);
            break;
        }
    }
}

function monitorLevels(data) {
    if (wf_data == null || wf_data.length != data.length) {
        wf_data = data;
    } else {
        for (var j = 0 ; j < data.length ; j++) {
            if (data[j] >= wf_data[j]) {
                wf_data[j] = data[j];
            } else {
                wf_data[j] += (data[j] - wf_data[j]) / 5.0;
            }
        }
    }
}

function jumpBySteps(steps) {
    steps = Math.round(steps);
    if (steps != 0) {
        var key = UI.getDemodulatorPanel().getMagicKey();
        var f = center_freq + steps * bandwidth / 4;
        ws.send(JSON.stringify({
            "type": "setfrequency", "params": { "frequency": f, "key": key }
        }));
    }
}

function setSmeterRelativeValue(value) {
    if (value < 0) value = 0;
    if (value > 1.0) value = 1.0;
    var $meter = $("#openwebrx-smeter");
    var $bar = $meter.find(".openwebrx-smeter-bar");
    $bar.css({transform: 'translate(' + ((value - 1) * 100) + '%) translateZ(0)'});
    if (value > 0.9) {
        // red
        $bar.css({background: 'linear-gradient(to top, #ff5939 , #961700)'});
    } else if (value > 0.7) {
        // yellow
        $bar.css({background: 'linear-gradient(to top, #fff720 , #a49f00)'});
    } else {
        // red
        $bar.css({background: 'linear-gradient(to top, #22ff2f , #008908)'});
    }
}

function setSquelchSliderBackground(val) {
    var $slider = $('#openwebrx-panel-receiver .openwebrx-squelch-slider');
    var min = Number($slider.attr('min'));
    var max = Number($slider.attr('max'));
    var sliderPosition = $slider.val();
    var relative = (val - min) / (max - min);
    // use a brighter color when squelch is open
    var color = val >= sliderPosition ? '#22ff2f' : '#008908';
    // we don't use the gradient, but separate the colors discretely using css tricks
    var style = 'linear-gradient(90deg, ' + color + ', ' + color + ' ' + relative * 100 + '%, #B6B6B6 ' + relative * 100 + '%)';
    $slider.css('--track-background', style);
}

function getLogSmeterValue(value) {
    return 10 * Math.log10(value);
}

function setSmeterAbsoluteValue(value) //the value that comes from `csdr squelch_and_smeter_cc`
{
    var logValue = getLogSmeterValue(value);
    var levels = Waterfall.getRange();
    var percent = (logValue - (levels.min - 20)) / ((levels.max + 20) - (levels.min - 20));
    setSquelchSliderBackground(logValue);
    setSmeterRelativeValue(percent);
    $("#openwebrx-smeter-db").html(logValue.toFixed(1) + " dB");
}

function typeInAnimation(element, timeout, what, onFinish) {
    if (!what) {
        onFinish();
        return;
    }
    element.innerHTML += what[0];
    window.setTimeout(function () {
        typeInAnimation(element, timeout, what.substring(1), onFinish);
    }, timeout);
}


// ========================================================
// ================  DEMODULATOR ROUTINES  ================
// ========================================================

function getDemodulators() {
    return [ UI.getDemodulator() ].filter(function(d) { return !!d; });
}

function mkenvelopes(visible_range) //called from mkscale
{
    var demodulators = getDemodulators();
    scale_ctx.clearRect(0, 0, scale_ctx.canvas.width, 22); //clear the upper part of the canvas (where filter envelopes reside)
    for (var i = 0; i < demodulators.length; i++) {
        demodulators[i].envelope.draw(visible_range);
    }
    if (demodulators.length) {
        var bandpass = demodulators[0].getBandpass();
        secondary_demod_waterfall_set_zoom(bandpass.low_cut, bandpass.high_cut);
    }
}

function waterfallWidth() {
    return $('body').width();
}


// ========================================================
// ===================  SCALE ROUTINES  ===================
// ========================================================

var scale_ctx;
var scale_canvas;

function scale_setup() {
    scale_canvas = $("#openwebrx-scale-canvas")[0];
    scale_ctx = scale_canvas.getContext("2d");
    scale_canvas.addEventListener("mousedown", scale_canvas_mousedown, false);
    scale_canvas.addEventListener("mousemove", scale_canvas_mousemove, false);
    scale_canvas.addEventListener("mouseup", scale_canvas_mouseup, false);
    scale_canvas.addEventListener("wheel", scale_canvas_mousewheel, false);
    scale_canvas.addEventListener("touchmove", process_touch, false);
    scale_canvas.addEventListener("touchend", process_touch, false);
    scale_canvas.addEventListener("touchstart", process_touch, false);
    resize_scale();
    var frequency_container = $("#openwebrx-frequency-container");
    frequency_container.on("mousemove", frequency_container_mousemove, false);
}

var scale_canvas_drag_params = {
    mouse_down: false,
    mouse2_down: false,
    drag: false,
    start_x: 0,
    key_modifiers: {shiftKey: false, altKey: false, ctrlKey: false}
};

function scale_canvas_mousedown(evt) {
    // Left button only
    if (evt.button == 0) {
        scale_canvas_drag_params.mouse_down = true;
        scale_canvas_drag_params.drag = false;
        scale_canvas_drag_params.start_x = evt.pageX;
        scale_canvas_drag_params.key_modifiers.shiftKey = evt.shiftKey;
        scale_canvas_drag_params.key_modifiers.altKey = evt.altKey;
        scale_canvas_drag_params.key_modifiers.ctrlKey = evt.ctrlKey;
    } else {
        // Other buttons
        scale_canvas_drag_params.mouse2_down = true;
    }

    evt.preventDefault();
}

function scale_offset_freq_from_px(x, visible_range) {
    if (typeof visible_range === "undefined") visible_range = get_visible_freq_range();

    var f = (visible_range.start + visible_range.bw * (x / waterfallWidth())) - center_freq;

    if (tuning_step <= 0) {
        return f;
    } else {
        f = Math.round((center_freq + f) / tuning_step) * tuning_step;
        return f - center_freq;
    }
}

function scale_canvas_mousemove(evt) {
    var event_handled = false;
    var i;
    var demodulators = getDemodulators();
    if (scale_canvas_drag_params.mouse_down && !scale_canvas_drag_params.drag && Math.abs(evt.pageX - scale_canvas_drag_params.start_x) > canvas_drag_min_delta)
    //we can use the main drag_min_delta thing of the main canvas
    {
        scale_canvas_drag_params.drag = true;
        //call the drag_start for all demodulators (and they will decide if they're dragged, based on X coordinate)
        for (i = 0; i < demodulators.length; i++) event_handled |= demodulators[i].envelope.drag_start(evt.pageX, scale_canvas_drag_params.key_modifiers);
        scale_canvas.style.cursor = "move";
    }
    else if (scale_canvas_drag_params.drag) {
        //call the drag_move for all demodulators (and they will decide if they're dragged)
        for (i = 0; i < demodulators.length; i++) event_handled |= demodulators[i].envelope.drag_move(evt.pageX);
        if (!event_handled) demodulators[0].set_offset_frequency(scale_offset_freq_from_px(evt.pageX));
    }
}

function frequency_container_mousemove(evt) {
    var frequency = center_freq + scale_offset_freq_from_px(evt.pageX);
    UI.getDemodulatorPanel().setMouseFrequency(frequency);
}

function scale_canvas_end_drag(x) {
    scale_canvas.style.cursor = "default";
    scale_canvas_drag_params.drag = false;
    scale_canvas_drag_params.mouse_down = false;
    var event_handled = false;
    var demodulators = getDemodulators();
    for (var i = 0; i < demodulators.length; i++) event_handled |= demodulators[i].envelope.drag_end();
    if (!event_handled) {
        demodulators[0].set_offset_frequency(scale_offset_freq_from_px(x));
        UI.toggleScanner(false);
    }
}

function scale_canvas_mouseup(evt) {
    if (evt.button == 0)
        scale_canvas_end_drag(evt.pageX);
    else
        scale_canvas_drag_params.mouse2_down = false;
}

function scale_canvas_mousewheel(evt) {
    var dir = (evt.deltaY / Math.abs(evt.deltaY)) > 0;
    var adjustWidth = scale_canvas_drag_params.mouse2_down || evt.shiftKey;
    var demodulators = getDemodulators();
    var event_handled = false;
    for (var i = 0; i < demodulators.length; i++) event_handled |= demodulators[i].envelope.wheel(evt.pageX, dir, adjustWidth);
    // If not handled by demodulators, default to tuning or zooming
    if (!event_handled) canvas_mousewheel(evt);
}

function scale_px_from_freq(f, range) {
    return Math.round(((f - range.start) / range.bw) * waterfallWidth());
}

function get_visible_freq_range() {
    if (!bandwidth) return false;
    var fcalc = function (x) {
        var canvasWidth = waterfallWidth() * zoom_levels[zoom_level];
        return Math.round(((-zoom_offset_px + x) / canvasWidth) * bandwidth) + (center_freq - bandwidth / 2);
    };
    var out = {
        start: fcalc(0),
        center: fcalc(waterfallWidth() / 2),
        end: fcalc(waterfallWidth()),
    }
    out.bw = out.end - out.start;
    out.hps = out.bw / waterfallWidth();
    return out;
}

var scale_markers_levels = [
    {
        "large_marker_per_hz": 10000000, //large
        "estimated_text_width": 70,
        "format": "{x} MHz",
        "pre_divide": 1000000,
        "decimals": 0
    },
    {
        "large_marker_per_hz": 5000000,
        "estimated_text_width": 70,
        "format": "{x} MHz",
        "pre_divide": 1000000,
        "decimals": 0
    },
    {
        "large_marker_per_hz": 1000000,
        "estimated_text_width": 70,
        "format": "{x} MHz",
        "pre_divide": 1000000,
        "decimals": 0
    },
    {
        "large_marker_per_hz": 500000,
        "estimated_text_width": 70,
        "format": "{x} MHz",
        "pre_divide": 1000000,
        "decimals": 1
    },
    {
        "large_marker_per_hz": 100000,
        "estimated_text_width": 70,
        "format": "{x} MHz",
        "pre_divide": 1000000,
        "decimals": 1
    },
    {
        "large_marker_per_hz": 50000,
        "estimated_text_width": 70,
        "format": "{x} MHz",
        "pre_divide": 1000000,
        "decimals": 2
    },
    {
        "large_marker_per_hz": 10000,
        "estimated_text_width": 70,
        "format": "{x} MHz",
        "pre_divide": 1000000,
        "decimals": 2
    },
    {
        "large_marker_per_hz": 5000,
        "estimated_text_width": 70,
        "format": "{x} MHz",
        "pre_divide": 1000000,
        "decimals": 3
    },
    {
        "large_marker_per_hz": 1000,
        "estimated_text_width": 70,
        "format": "{x} MHz",
        "pre_divide": 1000000,
        "decimals": 1
    }
];
var scale_min_space_bw_texts = 50;
var scale_min_space_bw_small_markers = 7;

function get_scale_mark_spacing(range) {
    var out = {};
    var fcalc = function (freq) {
        out.numlarge = (range.bw / freq);
        out.large = waterfallWidth() / out.numlarge; 	//distance between large markers (these have text)
        out.ratio = 5; 														//(ratio-1) small markers exist per large marker
        out.small = out.large / out.ratio; 								//distance between small markers
        if (out.small < scale_min_space_bw_small_markers) return false;
        if (out.small / 2 >= scale_min_space_bw_small_markers && freq.toString()[0] !== "5") {
            out.small /= 2;
            out.ratio *= 2;
        }
        out.smallbw = freq / out.ratio;
        return true;
    };
    for (var i = scale_markers_levels.length - 1; i >= 0; i--) {
        var mp = scale_markers_levels[i];
        if (!fcalc(mp.large_marker_per_hz)) continue;
        //console.log(mp.large_marker_per_hz);
        //console.log(out);
        if (out.large - mp.estimated_text_width > scale_min_space_bw_texts) break;
    }
    out.params = mp;
    return out;
}

var range;

function mkscale() {
    //clear the lower part of the canvas (where frequency scale resides; the upper part is used by filter envelopes):
    range = get_visible_freq_range();
    if (!range) return;
    mkenvelopes(range); //when scale changes we will always have to redraw filter envelopes, too
    scale_ctx.clearRect(0, 22, scale_ctx.canvas.width, scale_ctx.canvas.height - 22);
    scale_ctx.strokeStyle = "#fff";
    scale_ctx.font = "bold 11px sans-serif";
    scale_ctx.textBaseline = "top";
    scale_ctx.fillStyle = "#fff";
    var spacing = get_scale_mark_spacing(range);
    //console.log(spacing);
    var marker_hz = Math.ceil(range.start / spacing.smallbw) * spacing.smallbw;
    var text_h_pos = 22 + 10 + ((is_firefox) ? 3 : 0);
    var text_to_draw = '';
    var ftext = function (f) {
        text_to_draw = format_frequency(spacing.params.format, f, spacing.params.pre_divide, spacing.params.decimals);
    };
    var last_large;
    var x;
    while ((x = scale_px_from_freq(marker_hz, range)) <= window.innerWidth) {
        scale_ctx.beginPath();
        scale_ctx.moveTo(x, 22);
        if (marker_hz % spacing.params.large_marker_per_hz === 0) {  //large marker
            if (typeof first_large === "undefined") var first_large = marker_hz;
            last_large = marker_hz;
            scale_ctx.lineWidth = 3.5;
            scale_ctx.lineTo(x, 22 + 11);
            ftext(marker_hz);
            var text_measured = scale_ctx.measureText(text_to_draw);
            scale_ctx.textAlign = "center";
            //advanced text drawing begins
            if (zoom_level === 0 && (range.start + spacing.smallbw * spacing.ratio > marker_hz) && (x < text_measured.width / 2)) { //if this is the first overall marker when zoomed out...                  and if it would be clipped off the screen...
                if (scale_px_from_freq(marker_hz + spacing.smallbw * spacing.ratio, range) - text_measured.width >= scale_min_space_bw_texts) { //and if we have enough space to draw it correctly without clipping
                    scale_ctx.textAlign = "left";
                    scale_ctx.fillText(text_to_draw, 0, text_h_pos);
                }
            }
            else if (zoom_level === 0 && (range.end - spacing.smallbw * spacing.ratio < marker_hz) && (x > window.innerWidth - text_measured.width / 2)) { //     if this is the last overall marker when zoomed out...                 and if it would be clipped off the screen...
                if (window.innerWidth - text_measured.width - scale_px_from_freq(marker_hz - spacing.smallbw * spacing.ratio, range) >= scale_min_space_bw_texts) { //and if we have enough space to draw it correctly without clipping
                    scale_ctx.textAlign = "right";
                    scale_ctx.fillText(text_to_draw, window.innerWidth, text_h_pos);
                }
            }
            else scale_ctx.fillText(text_to_draw, x, text_h_pos); //draw text normally
        }
        else {  //small marker
            scale_ctx.lineWidth = 2;
            scale_ctx.lineTo(x, 22 + 8);
        }
        marker_hz += spacing.smallbw;
        scale_ctx.stroke();
    }
    if (zoom_level !== 0) { // if zoomed, we don't want the texts to disappear because their markers can't be seen
        // on the left side
        scale_ctx.textAlign = "center";
        var f = first_large - spacing.smallbw * spacing.ratio;
        x = scale_px_from_freq(f, range);
        ftext(f);
        var w = scale_ctx.measureText(text_to_draw).width;
        if (x + w / 2 > 0) scale_ctx.fillText(text_to_draw, x, 22 + 10);
        // on the right side
        f = last_large + spacing.smallbw * spacing.ratio;
        x = scale_px_from_freq(f, range);
        ftext(f);
        w = scale_ctx.measureText(text_to_draw).width;
        if (x - w / 2 < window.innerWidth) scale_ctx.fillText(text_to_draw, x, 22 + 10);
    }
}

function resize_scale() {
    var ratio = window.devicePixelRatio || 1;
    var w = window.innerWidth;
    var h = 47;
    scale_canvas.style.width = w + "px";
    scale_canvas.style.height = h + "px";
    w *= ratio;
    h *= ratio;
    scale_canvas.width = w;
    scale_canvas.height = h;
    scale_ctx.scale(ratio, ratio);
    mkscale();
    bandplan.draw();
    bookmarks.position();
}

function format_frequency(format, freq_hz, pre_divide, decimals) {
    var out = format.replace("{x}", (freq_hz / pre_divide).toFixed(decimals));
    var at = out.indexOf(".") + 4;
    while (decimals > 3) {
        out = out.substr(0, at) + "," + out.substr(at);
        at += 4;
        decimals -= 3;
    }
    return out;
}

var canvas_drag = false;
var canvas_drag_min_delta = 1;
var canvas_mouse_down = false;
var canvas_mouse2_down = 0;
var canvas_drag_last_x;
var canvas_drag_last_y;
var canvas_drag_start_x;
var canvas_drag_start_y;

var touch_id1 = -1;
var touch_id2 = -1;
var touch_zoom0;
var touch_dst0;

function process_touch(evt) {
    var t0 = null;
    var type = "";

    switch(evt.type)
    {
        case "touchstart":
            // Detect first finger
            if (touch_id1 < 0) {
                t0 = evt.changedTouches[0];
                touch_id1 = t0.identifier;
                type = "mousedown";
            }

            // Detect second finger
            if ((touch_id1 >= 0) && (touch_id2 < 0)) {
                for (var j=0 ; j<evt.changedTouches.length ; ++j) {
                    if (evt.changedTouches[j].identifier != touch_id1) {
                        var t2 = evt.changedTouches[j];
                        // Find the existing first finger
                        for (var i=0 ; i<evt.touches.length ; ++i) {
                            // If both fingers found...
                            if (evt.touches[i].identifier == touch_id1) {
                                // Initialize initial distance & zoom level
                                var t1 = evt.touches[i];
                                touch_zoom0 = zoom_level;
                                touch_dst0  = Math.abs(t2.clientX - t1.clientX);
                                touch_id2   = t2.identifier;
                                break;
                            }
                        }
                        break;
                    }
                }
            }
            break;

        case "touchmove":
            // Check if first finger moved
            if (touch_id1 >= 0) {
                for (var j=0 ; j<evt.changedTouches.length ; ++j) {
                    if (evt.changedTouches[j].identifier == touch_id1) {
                        t0 = evt.changedTouches[j];
                        type = "mousemove";
                        break;
                    }
                }
            }

            // If using two fingers...
            if ((touch_id1 >= 0) && (touch_id2 >= 0) && (touch_dst0 > 0)) {
                var t1 = null;
                var t2 = null;
                // If first finger changed...
                if (t0 != null) {
                    // Reuse found first finger
                    t1 = t0;
                    // Find the second finger
                    for (var j=0 ; j<evt.touches.length ; ++j) {
                        if (evt.touches[j].identifier == touch_id2) {
                            t2 = evt.touches[j];
                            break;
                        }
                    }
                } else for (var j=0 ; j<evt.changedTouches.length ; ++j) {
                    if (evt.changedTouches[j].identifier == touch_id2) {
                        // Second finger change found
                        t2 = evt.changedTouches[j];
                        // Find the first finger
                        for (var i=0 ; i<evt.touches.length ; ++i) {
                            if (evt.touches[i].identifier == touch_id1) {
                                t1 = evt.touches[i];
                                break;
                            }
                        }
                    }
                }
                // If both fingers found...
                if ((t1 != null) && (t2 != null)) {
                    // Zoom by distance ratio
                    var dst = Math.abs(t2.clientX - t1.clientX);
                    if (dst >= touch_dst0) {
                        zoom_set(touch_zoom0 + Math.round(dst / touch_dst0) - 1);
                    } else {
                        zoom_set(touch_zoom0 - Math.round(touch_dst0 / dst) + 1);
                    }
                    // Cancel mouse movement
                    t0 = null;
                }
            }
            break;

        case "touchend":
            // Check if first finger went up
            if (touch_id1 >= 0) {
                for (var j=0 ; j<evt.changedTouches.length ; ++j) {
                    if (evt.changedTouches[j].identifier == touch_id1) {
                        t0 = (touch_id2<0)? evt.changedTouches[j] : null;
                        touch_id1 = -1;
                        touch_id2 = -1;
                        type = "mouseup";
                        break;
                    }
                }
            }

            // Check if second finger went up
            if (touch_id2 >= 0) {
                for (var j=0 ; j<evt.changedTouches.length ; ++j) {
                    if (evt.changedTouches[j].identifier == touch_id2) {
                        t0 = null;
                        touch_id1 = -1;
                        touch_id2 = -1;
                        break;
                    }
                }
            }
    }

    // If first finger has changed its state, simulate mouse event
    if (t0 != null) {
        var mouseEvt = document.createEvent("MouseEvent");

        mouseEvt.initMouseEvent(type,
            true, true, window, 1, t0.screenX, t0.screenY,
            t0.clientX, t0.clientY, false, false, false,
            false, 0/*left*/, null);

        t0.target.dispatchEvent(mouseEvt);
        evt.preventDefault();
    }
}

function canvas_mousedown(evt) {
    if (evt.button > 0) {
        if (canvas_mouse2_down == 0)
            canvas_mouse2_down = evt.button;
    } else {
        canvas_mouse_down = true;
        canvas_drag = false;
        canvas_drag_last_x = canvas_drag_start_x = evt.pageX;
        canvas_drag_last_y = canvas_drag_start_y = evt.pageY;
    }

    evt.preventDefault(); //don't show text selection mouse pointer
}

function canvas_mousemove(evt) {
    if (!waterfall_setup_done) return;
    var relativeX = get_relative_x(evt);
    if (!canvas_mouse_down) {
        UI.getDemodulatorPanel().setMouseFrequency(UI.getFrequency(relativeX));
    } else {
        if (!canvas_drag && Math.abs(evt.pageX - canvas_drag_start_x) > canvas_drag_min_delta) {
            canvas_drag = true;
            canvas_container.style.cursor = "move";
        }
        if (canvas_drag) {
            var deltaX = canvas_drag_last_x - evt.pageX;
            var dpx = range.hps * deltaX;

            if (
                !(zoom_center_rel + dpx > (bandwidth / 2 - waterfallWidth() * (1 - zoom_center_where) * range.hps)) &&
                !(zoom_center_rel + dpx < -bandwidth / 2 + waterfallWidth() * zoom_center_where * range.hps)
            ) {
                zoom_center_rel += dpx;
            }
            resize_canvases(false);
            mkscale();
            bandplan.draw();
            bookmarks.position();

            canvas_drag_last_x = evt.pageX;
            canvas_drag_last_y = evt.pageY;
        }
    }
}

function canvas_container_mouseleave() {
    canvas_end_drag();
}

function canvas_mouseup(evt) {
    if (evt.button > 0) {
        if (evt.button == canvas_mouse2_down)
            canvas_mouse2_down = 0;
    } else {
        if (!waterfall_setup_done) return;
        var relativeX = get_relative_x(evt);

        if (!canvas_drag) {
            var f = UI.getOffsetFrequency(relativeX);
            // For CW, move offset 800Hz below the actual carrier
            if (UI.getModulation() === 'cw') f = f - 800;
            UI.setOffsetFrequency(f);
            UI.toggleScanner(false);
        } else {
            canvas_end_drag();
        }
        canvas_mouse_down = false;
    }
}

function canvas_end_drag() {
    canvas_container.style.cursor = "crosshair";
    canvas_mouse_down = false;
}

function zoom_center_where_calc(screenposX) {
    return screenposX / waterfallWidth();
}

function get_relative_x(evt) {
    var relativeX = evt.offsetX || evt.layerX;
    if ($(evt.target).closest(canvas_container).length) return relativeX;
    // compensate for the frequency scale, since that is not resized by the browser.
    var relatives = $(evt.target).closest('#openwebrx-frequency-container').map(function(){
        return evt.pageX - this.offsetLeft;
    });
    if (relatives.length) relativeX = relatives[0];

    return relativeX - zoom_offset_px;
}

function canvas_mousewheel(evt) {
    if (!waterfall_setup_done) return;
    var relativeX = get_relative_x(evt);
    var dir = (evt.deltaY / Math.abs(evt.deltaY)) > 0;

    // Zoom when mouse button down, tune otherwise
    // (optionally, invert this behavior)
    var zoom_me = (canvas_mouse2_down > 0) || evt.shiftKey?
        !UI.getWheelSwap() : UI.getWheelSwap();
    if (zoom_me) {
        zoom_step(dir, relativeX, zoom_center_where_calc(evt.pageX));
    } else {
        tuneBySteps(dir? -1:1);
    }

    evt.preventDefault();
}


var zoom_max_level_hps = 33; //Hz/pixel
var zoom_levels_count = 14;

function get_zoom_coeff_from_hps(hps) {
    var shown_bw = (window.innerWidth * hps);
    return bandwidth / shown_bw;
}

var zoom_levels = [1];
var zoom_level = 0;
var zoom_offset_px = 0;
var zoom_center_rel = 0;
var zoom_center_where = 0;

var smeter_level = 0;

function mkzoomlevels() {
    zoom_levels = [1];
    var maxc = get_zoom_coeff_from_hps(zoom_max_level_hps);
    if (maxc < 1) return;
    // logarithmic interpolation
    var zoom_ratio = Math.pow(maxc, 1 / zoom_levels_count);
    for (var i = 1; i < zoom_levels_count; i++)
        zoom_levels.push(Math.pow(zoom_ratio, i));
}

function zoom_step(out, where, onscreen) {
    if ((out && zoom_level === 0) || (!out && zoom_level >= zoom_levels_count - 1)) return;
    if (out) --zoom_level;
    else ++zoom_level;

    zoom_center_rel = UI.getOffsetFrequency(where);
    //console.log("zoom_step || zlevel: "+zoom_level.toString()+" zlevel_val: "+zoom_levels[zoom_level].toString()+" zoom_center_rel: "+zoom_center_rel.toString());
    zoom_center_where = onscreen;
    //console.log(zoom_center_where, zoom_center_rel, where);
    resize_canvases(true);
    mkscale();
    bandplan.draw();
    bookmarks.position();
}

function zoom_set(level) {
    if (!(level >= 0 && level <= zoom_levels.length - 1)) return;
    level = parseInt(level);
    zoom_level = level;
    //zoom_center_rel=UI.getOffsetFrequency(-canvases[0].offsetLeft+waterfallWidth()/2); //zoom to screen center instead of demod envelope
    var demodulator = UI.getDemodulator();
    zoom_center_rel = demodulator != null? demodulator.get_offset_frequency() : 0;
    zoom_center_where = 0.5 + (zoom_center_rel / bandwidth); //this is a kind of hack
    resize_canvases(true);
    mkscale();
    bandplan.draw();
    bookmarks.position();
}

function zoom_calc() {
    var winsize = waterfallWidth();
    var canvases_new_width = winsize * zoom_levels[zoom_level];
    zoom_offset_px = -((canvases_new_width * (0.5 + zoom_center_rel / bandwidth)) - (winsize * zoom_center_where));
    if (zoom_offset_px > 0) zoom_offset_px = 0;
    if (zoom_offset_px < winsize - canvases_new_width)
        zoom_offset_px = winsize - canvases_new_width;
}

var networkSpeedMeasurement;
var currentprofile = {
    toString: function() {
        return this['sdr_id'] + '|' + this['profile_id'];
    }
};

var COMPRESS_FFT_PAD_N = 10; //should be the same as in csdr.c

function on_ws_recv(evt) {
    if (typeof evt.data === 'string') {
        // text messages
        networkSpeedMeasurement.add(evt.data.length);

        if (evt.data.substr(0, 16) === "CLIENT DE SERVER") {
            params = Object.fromEntries(
                evt.data.slice(17).split(' ').map(function(param) {
                    var args = param.split('=');
                    return [args[0], args.slice(1).join('=')]
                })
            );
            var versionInfo = 'Unknown server';
            if (params.server && params.server === 'openwebrx' && params.version) {
                versionInfo = 'OpenWebRX+ version: ' + params.version;
            }
            divlog('Server acknowledged WebSocket connection, ' + versionInfo);
        } else {
            try {
                var json = JSON.parse(evt.data);
                switch (json.type) {
                    case "config":
                        var config = json['value'];

                        // Configure waterfall min/max levels, etc
                        Waterfall.configure(config);

                        if ('waterfall_colors' in config)
                            UI.setDefaultWfTheme(config['waterfall_colors']);

                        var initial_demodulator_params = {};
                        if ('start_mod' in config)
                            initial_demodulator_params['mod'] = config['start_mod'];
                        if ('start_offset_freq' in config)
                            initial_demodulator_params['offset_frequency'] = config['start_offset_freq'];
                        if ('initial_squelch_level' in config)
                            initial_demodulator_params['squelch_level'] = Number.isInteger(config['initial_squelch_level']) ? config['initial_squelch_level'] : -150;

                        if ('samp_rate' in config)
                            bandwidth = config['samp_rate'];
                        if ('center_freq' in config)
                            center_freq = config['center_freq'];
                        if ('fft_size' in config) {
                            fft_size = config['fft_size'];
                            waterfall_clear();
                        }
                        if ('audio_compression' in config) {
                            var audio_compression = config['audio_compression'];
                            audioEngine.setCompression(audio_compression);
                            divlog("Audio stream is " + ((audio_compression === "adpcm") ? "compressed" : "uncompressed") + ".");
                        }
                        if ('fft_compression' in config) {
                            fft_compression = config['fft_compression'];
                            divlog("FFT stream is " + ((fft_compression === "adpcm") ? "compressed" : "uncompressed") + ".");
                        }
                        if ('max_clients' in config)
                            $('#openwebrx-bar-clients').progressbar().setMaxClients(config['max_clients']);

                        waterfall_init();

                        var demodulatorPanel = UI.getDemodulatorPanel();

                        demodulatorPanel.setCenterFrequency(center_freq);
                        demodulatorPanel.setInitialParams(initial_demodulator_params);

                        if ('squelch_auto_margin' in config)
                            demodulatorPanel.setSquelchMargin(config['squelch_auto_margin']);

                        bookmarks.loadLocalBookmarks();

                        if ('sdr_id' in config || 'profile_id' in config) {
                            currentprofile['sdr_id'] = config['sdr_id'] || currentprofile['sdr_id'];
                            currentprofile['profile_id'] = config['profile_id'] || currentprofile['profile_id'];
                            $('#openwebrx-sdr-profiles-listbox').val(currentprofile.toString());

                            UI.toggleScanner(false);
                            tuning_step_reset();
                            waterfall_clear();
                            zoom_set(0);
                        }

                        if ('sdr_id' in config || 'profile_id' in config || 'waterfall_levels' in config) {
                            Waterfall.setDefaultRange();
                        }

                        if ('tuning_precision' in config)
                            demodulatorPanel.setTuningPrecision(config['tuning_precision']);

                        if ('tuning_step' in config) {
                            tuning_step_default = config['tuning_step'];
                            tuning_step_reset();
                        }

                        if ('allow_audio_recording' in config) {
                            var x = config['allow_audio_recording'];
                            $('.openwebrx-record-button').css('display', x? '':'none');
                        }

                        if ('allow_chat' in config) {
                            var x = config['allow_chat'];
                            $('#openwebrx-chat-inputs').css('display', x? '':'none');
                            $('#openwebrx-chat-label').html(x? 'Chat':'Log');
                        }

                        if ('receiver_gps' in config) {
                            Utils.setReceiverPos(config['receiver_gps']);
                        }

                        if ('flight_url' in config) {
                            Utils.setFlightUrl(config['flight_url']);
                        }

                        if ('modes_url' in config) {
                            Utils.setIcaoUrl(config['modes_url']);
                        }

                        if ('callsign_url' in config) {
                            Utils.setCallsignUrl(config['callsign_url']);
                        }

                        if ('vessel_url' in config) {
                            Utils.setVesselUrl(config['vessel_url']);
                        }

                        // Load user interface settings from local storage
                        UI.loadSettings();
                        Chat.loadSettings();

                        // Initialize keyboard shortcuts
                        Shortcuts.init(document.body);

                        break;
                    case "secondary_config":
                        var s = json['value'];
                        secondary_fft_size = s['secondary_fft_size'] || secondary_fft_size;
                        secondary_bw = s['secondary_bw'] || secondary_bw;
                        if_samp_rate = s['if_samp_rate'] || if_samp_rate;
                        if (if_samp_rate) secondary_demod_init_canvases();
                        break;
                    case "receiver_details":
                        $('.webrx-top-container').header().setDetails(json['value']);
                        break;
                    case "smeter":
                        smeter_level = json['value'];
                        setSmeterAbsoluteValue(smeter_level);
                        break;
                    case "cpuusage":
                        $('#openwebrx-bar-server-cpu').progressbar().setUsage(json['value']);
                        break;
                    case "temperature":
                        $('#openwebrx-bar-server-cpu').progressbar().setTemp(json['value']);
                        break;
                    case "clients":
                        $('#openwebrx-bar-clients').progressbar().setClients(json['value']);
                        break;
                    case "bands":
                        // Feed bandplan display with data
                        bandplan.update(json['value']);
                        break;
                    case "profiles":
                        var listbox = $("#openwebrx-sdr-profiles-listbox");
                        listbox.html(json['value'].map(function (profile) {
                            return '<option value="' + profile['id'] + '">' + profile['name'] + "</option>";
                        }).join(""));
                        $('#openwebrx-sdr-profiles-listbox').val(currentprofile.toString());
                        // this is a bit hacky since it only makes sense if the error is actually "no sdr devices"
                        // the only other error condition for which the overlay is used right now is "too many users"
                        // so there shouldn't be a problem here
                        if (Object.keys(json['value']).length) {
                            $('#openwebrx-error-overlay').hide();
                        }
                        break;
                    case "features":
                        Modes.setFeatures(json['value']);
                        $('#openwebrx-panel-metadata-wfm').metaPanel().each(function() {
                            this.setEnabled(!!json.value.rds);
                        });
                        break;
                    case "metadata":
                        $('.openwebrx-meta-panel').metaPanel().each(function(){
                            this.update(json['value']);
                        });
                        break;
                    case "dial_frequencies":
                        var as_bookmarks = json['value'].map(function (d) {
                            return {
                                name: d['mode'].toUpperCase(),
                                modulation: d['mode'],
                                frequency: d['frequency'],
                                underlying: d['underlying']
                            };
                        });
                        bookmarks.replace_bookmarks(as_bookmarks, 'dial_frequencies');
                        break;
                    case "bookmarks":
                        bookmarks.replace_bookmarks(json['value'], "server");
                        break;
                    case "sdr_error":
                        divlog(json['value'], true);
                        var $overlay = $('#openwebrx-error-overlay');
                        $overlay.find('.errormessage').text(json['value']);
                        $overlay.show();
                        UI.getDemodulatorPanel().stopDemodulator();
                        break;
                    case "demodulator_error":
                        divlog(json['value'], true);
                        break;
                    case 'secondary_demod':
                        var value = json['value'];
                        var panels = ['wsjt', 'packet', 'pocsag', 'page', 'sstv', 'fax', 'ism', 'hfdl', 'adsb', 'dsc', 'cwskimmer'].map(function(id) {
                            return $('#openwebrx-panel-' + id + '-message')[id + 'MessagePanel']();
                        });
                        panels.push($('#openwebrx-panel-js8-message').js8());
                        if (!panels.some(function(panel) {
                            if (!panel.supportsMessage(value)) return false;
                            panel.pushMessage(value);
                            return true;
                        })) {
                            secondary_demod_push_data(value);
                        }
                        break;
                    case 'log_message':
                        divlog(json['value'], true);
                        break;
                    case 'chat_message':
                        Chat.recvMessage(json['name'], json['text'], json['color']);
                        break;
                    case 'backoff':
                        divlog("Server is currently busy: " + json['reason'], true);
                        var $overlay = $('#openwebrx-error-overlay');
                        $overlay.find('.errormessage').text(json['reason']);
                        $overlay.show();
                        // set a higher reconnection timeout right away to avoid additional load
                        reconnect_timeout = 16000;
                        break;
                    case 'modes':
                        Modes.setModes(json['value']);
                        break;
                    default:
                        console.warn('received message of unknown type: ' + json['type']);
                }
            } catch (e) {
                // don't lose exception
                console.error(e)
            }
        }
    } else if (evt.data instanceof ArrayBuffer) {
        // binary messages
        networkSpeedMeasurement.add(evt.data.byteLength);

        var type = new Uint8Array(evt.data, 0, 1)[0];
        var data = evt.data.slice(1);

        var waterfall_i16;
        var waterfall_f32;
        var i;

        switch (type) {
            case 1:
                // FFT data
                if (fft_compression === "none") {
                    waterfall_f32 = new Float32Array(data);
                } else if (fft_compression === "adpcm") {
                    fft_codec.reset();

                    waterfall_i16 = fft_codec.decode(new Uint8Array(data));
                    waterfall_f32 = new Float32Array(waterfall_i16.length - COMPRESS_FFT_PAD_N);
                    for (i = 0; i < waterfall_i16.length; i++) waterfall_f32[i] = waterfall_i16[i + COMPRESS_FFT_PAD_N] / 100;
                }
                // Feed waterfall display with data
                waterfall_add(waterfall_f32);
                // Feed spectrum display with data
                spectrum.update(waterfall_f32);
                // Feed scanner with data
                scanner.update(waterfall_f32);
                // Monitor waterfall levels for squelch-based tuning
                monitorLevels(waterfall_f32);
                break;
            case 2:
                // audio data
                audioEngine.pushAudio(data);
                break;
            case 3:
                // secondary FFT
                if (fft_compression === "none") {
                    secondary_demod_waterfall_add(new Float32Array(data));
                } else if (fft_compression === "adpcm") {
                    fft_codec.reset();

                    waterfall_i16 = fft_codec.decode(new Uint8Array(data));
                    waterfall_f32 = new Float32Array(waterfall_i16.length - COMPRESS_FFT_PAD_N);
                    for (i = 0; i < waterfall_i16.length; i++) waterfall_f32[i] = waterfall_i16[i + COMPRESS_FFT_PAD_N] / 100;
                    secondary_demod_waterfall_add(waterfall_f32);
                }
                break;
            case 4:
                // hd audio data
                audioEngine.pushHdAudio(data);
                break;
            default:
                console.warn('unknown type of binary message: ' + type)
        }
    }
}

function on_ws_opened() {
    $('#openwebrx-error-overlay').hide();
    ws.send("SERVER DE CLIENT client=openwebrx.js type=receiver");
    divlog("WebSocket opened to " + ws.url);
    if (!networkSpeedMeasurement) {
        networkSpeedMeasurement = new Measurement();
        networkSpeedMeasurement.report(60000, 1000, function(rate){
            $('#openwebrx-bar-network-speed').progressbar().setSpeed(rate);
        });
    } else {
        networkSpeedMeasurement.reset();
    }
    reconnect_timeout = false;
    ws.send(JSON.stringify({
        "type": "connectionproperties",
        "params": {
            "output_rate": audioEngine.getOutputRate(),
            "hd_output_rate": audioEngine.getHdOutputRate()
        }
    }));
}

var was_error = 0;

function divlog(what, is_error) {
    is_error = !!is_error;
    was_error |= is_error;
    if (is_error) {
        what = "<span class=\"webrx-error\">" + what + "</span>";
        toggle_panel("openwebrx-panel-log", true); //show panel if any error is present
    }
    $('#openwebrx-messages')[0].innerHTML += what + "<br />";
    var nano = $('#openwebrx-log-scroll');
    nano.nanoScroller();
    nano.nanoScroller({scroll: 'bottom'});
}

var volumeBeforeMute = 100.0;
var mute = false;

// Optimalise these if audio lags or is choppy:
var audio_buffer_maximal_length_sec = 1; //actual number of samples are calculated from sample rate

function onAudioStart(apiType){
    divlog('Web Audio API succesfully initialized, using ' + apiType  + ' API, sample rate: ' + audioEngine.getSampleRate() + " Hz");

    hideOverlay();

    // canvas_container is set after waterfall_init() has been called. we cannot initialize before.
    //if (canvas_container) synchronize_demodulator_init();

    //hide log panel in a second (if user has not hidden it yet)
    window.setTimeout(function () {
        toggle_panel("openwebrx-panel-log", !!was_error);
    }, 2000);

    // Load audio settings from local storage
    UI.loadAudioSettings();
}

var reconnect_timeout = false;

function on_ws_closed() {
    var demodulatorPanel = UI.getDemodulatorPanel();
    demodulatorPanel.stopDemodulator();
    demodulatorPanel.resetInitialParams();
    if (reconnect_timeout) {
        // max value: roundabout 8 and a half minutes
        reconnect_timeout = Math.min(reconnect_timeout * 2, 512000);
    } else {
        // initial value: 1s
        reconnect_timeout = 1000;
    }
    divlog("WebSocket has closed unexpectedly. Attempting to reconnect in " + reconnect_timeout / 1000 + " seconds...", 1);

    setTimeout(open_websocket, reconnect_timeout);
}

function on_ws_error() {
    divlog("WebSocket error.", 1);
}

var ws;

function open_websocket() {
    var protocol = window.location.protocol.match(/https/) ? 'wss' : 'ws';

    var href = window.location.href;
    var index = href.lastIndexOf('/');
    if (index > 0) {
        href = href.substr(0, index + 1);
    }
    href = href.split("://")[1];
    href = protocol + "://" + href;
    if (!href.endsWith('/')) {
        href += '/';
    }
    var ws_url = href + "ws/";

    if (!("WebSocket" in window))
        divlog("Your browser does not support WebSocket, which is required for WebRX to run. Please upgrade to a HTML5 compatible browser.");
    ws = new WebSocket(ws_url);
    ws.onopen = on_ws_opened;
    ws.onmessage = on_ws_recv;
    ws.onclose = on_ws_closed;
    ws.binaryType = "arraybuffer";
    window.onbeforeunload = function () { //http://stackoverflow.com/questions/4812686/closing-websocket-correctly-html5-javascript
        ws.onclose = function () {
        };
        ws.close();
    };
    ws.onerror = on_ws_error;
}

var canvas_context;
var canvases = [];
var canvas_default_height = 200;
var canvas_container;
var canvas_actual_line = -1;

function add_canvas() {
    var new_canvas = document.createElement("canvas");
    new_canvas.width = fft_size;
    new_canvas.height = canvas_default_height;
    canvas_actual_line = canvas_default_height;
    new_canvas.openwebrx_top = -canvas_default_height;
    new_canvas.style.transform = 'translate(0, ' + new_canvas.openwebrx_top.toString() + 'px)';
    canvas_context = new_canvas.getContext("2d");
    canvas_container.appendChild(new_canvas);
    canvases.push(new_canvas);
    while (canvas_container && canvas_container.clientHeight + canvas_default_height * 2 < canvases.length * canvas_default_height) {
        var c = canvases.shift();
        if (!c) break;
        canvas_container.removeChild(c);
    }
}


function init_canvas_container() {
    canvas_container = $("#webrx-canvas-container")[0];
    canvas_container.addEventListener("mouseleave", canvas_container_mouseleave, false);
    canvas_container.addEventListener("mousemove", canvas_mousemove, false);
    canvas_container.addEventListener("mouseup", canvas_mouseup, false);
    canvas_container.addEventListener("mousedown", canvas_mousedown, false);
    canvas_container.addEventListener("wheel", canvas_mousewheel, false);
    canvas_container.addEventListener("touchmove", process_touch, false);
    canvas_container.addEventListener("touchend", process_touch, false);
    canvas_container.addEventListener("touchstart", process_touch, false);
    var frequency_container = $("#openwebrx-frequency-container");
    frequency_container.on("wheel", canvas_mousewheel, false);
}

function shift_canvases() {
    canvases.forEach(function (p) {
        p.style.transform = 'translate(0, ' + (p.openwebrx_top++).toString() + 'px)';
    });
}

function resize_canvases(zoom) {
    if (typeof zoom === "undefined") zoom = false;
    if (!zoom) mkzoomlevels();
    zoom_calc();
    $('#webrx-canvas-container').css({
        width: waterfallWidth() * zoom_levels[zoom_level] + 'px',
        left: zoom_offset_px + "px"
    });
}

function waterfall_init() {
    init_canvas_container();
    resize_canvases();
    scale_setup();
    mkzoomlevels();
    waterfall_setup_done = 1;
}

function waterfall_add(data) {
    if (!waterfall_setup_done) return;
    var w = fft_size;

    // measure waterfall min/max levels, if necessary
    Waterfall.measureRange(data);

    // create new canvas if the current one is full (or there isn't one)
    if (canvas_actual_line <= 0) add_canvas();

    // add line to waterfall image
    var oneline_image = canvas_context.createImageData(w, 1);
    Waterfall.drawLine(oneline_image.data, data);

    // draw image
    canvas_context.putImageData(oneline_image, 0, --canvas_actual_line);
    shift_canvases();
}

function waterfall_clear() {
    //delete all canvases
    while (canvases.length) {
        var x = canvases.shift();
        x.parentNode.removeChild(x);
    }
    canvas_actual_line = -1;
}

function openwebrx_resize() {
    resize_canvases();
    resize_scale();
}

function initProgressBars() {
    $(".openwebrx-progressbar").each(function(){
        var bar = $(this).progressbar();
        if ('setSampleRate' in bar) {
            bar.setSampleRate(audioEngine.getSampleRate());
        }
    })
}

function audioReporter(stats) {
    if (typeof(stats.buffersize) !== 'undefined') {
         $('#openwebrx-bar-audio-buffer').progressbar().setBuffersize(stats.buffersize);
    }

    if (typeof(stats.audioByteRate) !== 'undefined') {
        $('#openwebrx-bar-audio-speed').progressbar().setSpeed(stats.audioByteRate * 8);
    }

    if (typeof(stats.audioRate) !== 'undefined') {
        $('#openwebrx-bar-audio-output').progressbar().setAudioRate(stats.audioRate);
    }
}

function openwebrx_init() {
    // Name used by map links to tune receiver
    frames.name = 'openwebrx-rx';

    audioEngine = new AudioEngine(audio_buffer_maximal_length_sec, audioReporter);
    var $overlay = $('#openwebrx-autoplay-overlay');
    $overlay.on('click', function(){
        audioEngine.resume();
    });
    audioEngine.onStart(onAudioStart);
    if (!audioEngine.isAllowed()) {
        $('body').append($overlay);
        $overlay.show();
    }
    fft_codec = new ImaAdpcmCodec();
    initProgressBars();
    open_websocket();
    secondary_demod_init();
    digimodes_init();
    initSpectrum();
    initPanels();
    $('#openwebrx-panel-receiver').demodulatorPanel();
    window.addEventListener('resize', openwebrx_resize);
    bookmarks = new BookmarkBar();
    initSliders();

    // Initialize waterfall colors
    UI.setWfTheme('default');

    // Create bookmark scanner
    scanner = new Scanner(bookmarks, 1000);

    // Create bandplan ribbon display
    bandplan = new Bandplan(document.getElementById('openwebrx-bandplan-canvas'));

    // Create and run clock
    clock = new Clock($('#openwebrx-clock-utc'));
}

function initSliders() {
    $('#openwebrx-panel-receiver').on('wheel', 'input[type=range]', function(ev){
        var $slider = $(this);
        if (!$slider.attr('step') || $slider.attr('disabled')) return;
        var val = Number($slider.val());
        var step = Number($slider.attr('step'));
        if (ev.originalEvent.deltaY > 0) {
            step *= -1;
        }
        $slider.val(val + step);
        $slider.trigger('change');
    });

    // Enable continuous waterfall color adjustment by pressing the
    // right mouse button on AUTO
    $('#openwebrx-waterfall-colors-auto').on('contextmenu', function() {
        Waterfall.toggleContinuousRange();
        return false;
    });

    // Enable scanner by pressing the right mouse button on SQUELCH
    $('.openwebrx-squelch-auto').on('contextmenu', function() {
        UI.toggleScanner();
        return false;
    });
}

function digimodes_init() {
    // initialze DMR timeslot muting
    $('.openwebrx-dmr-timeslot-panel').click(function (e) {
        $(e.currentTarget).toggleClass("muted");
        update_dmr_timeslot_filtering();
    // don't mute when the location icon is clicked
    }).find('.location').click(function(e) {
        e.stopPropagation();
    });

    $('.openwebrx-meta-panel').metaPanel();
}

function update_dmr_timeslot_filtering() {
    var filter = $('.openwebrx-dmr-timeslot-panel').map(function (index, el) {
        return (!$(el).hasClass("muted")) << index;
    }).toArray().reduce(function (acc, v) {
        return acc | v;
    }, 0);
    UI.getDemodulator().setDmrFilter(filter);
}

function hideOverlay() {
    var $overlay = $('#openwebrx-autoplay-overlay');
    $overlay.css('opacity', 0);
    $overlay.on('transitionend', function() {
        $overlay.hide();
    });
}

var rt = function (s, n) {
    return s.replace(/[a-zA-Z]/g, function (c) {
        return String.fromCharCode((c <= "Z" ? 90 : 122) >= (c = c.charCodeAt(0) + n) ? c : c - 26);
    });
};

// ========================================================
// =======================  PANELS  =======================
// ========================================================

function panel_displayed(el){
    return !(el.style && el.style.display && el.style.display === 'none') && !(el.movement && el.movement === 'collapse');
}

function toggle_panel(what, on) {
    var item = $('#' + what)[0];
    if (!item) return;
    var displayed = panel_displayed(item);
    if (typeof on !== "undefined" && displayed === on) {
        return;
    }
    if (displayed) {
        item.movement = 'collapse';
        item.style.transform = "perspective(600px) rotateX(90deg)";
        item.style.transitionProperty = 'transform';
    } else {
        item.movement = 'expand';
        item.style.display = null;
        setTimeout(function(){
            item.style.transitionProperty = 'transform';
            item.style.transform = 'perspective(600px) rotateX(0deg)';
        }, 20);
    }
    item.style.transitionDuration = "600ms";
    item.style.transitionDelay = "0ms";
}

function first_show_panel(panel) {
    panel.style.transitionDuration = 0;
    panel.style.transitionDelay = 0;
    var rotx = (Math.random() > 0.5) ? -90 : 90;
    var roty = 0;
    if (Math.random() > 0.5) {
        var rottemp = rotx;
        rotx = roty;
        roty = rottemp;
    }
    if (rotx !== 0 && Math.random() > 0.5) rotx = 270;
    panel.style.transform = "perspective(600px) rotateX(%1deg) rotateY(%2deg)"
        .replace("%1", rotx.toString()).replace("%2", roty.toString());
    window.setTimeout(function () {
        panel.style.transitionDuration = "600ms";
        panel.style.transitionDelay = (Math.floor(Math.random() * 500)).toString() + "ms";
        panel.style.transform = "perspective(600px) rotateX(0deg) rotateY(0deg)";
    }, 1);
}

function initPanels() {
    $('#openwebrx-panels-container').find('.openwebrx-panel').each(function(){
        var el = this;
        el.openwebrxPanelTransparent = (!!el.dataset.panelTransparent);
        el.addEventListener('transitionend', function(ev){
            if (ev.target !== el) return;
            el.style.transitionDuration = null;
            el.style.transitionDelay = null;
            el.style.transitionProperty = null;
            if (el.movement && el.movement === 'collapse') {
                el.style.display = 'none';
            }
            delete el.movement;
        });
        if (panel_displayed(el)) first_show_panel(el);
    });

    // Apply nano-scroller to all panels that have 'nano' class
    $('.nano').nanoScroller();
}

function initSpectrum() {
    var canvas = document.getElementById('openwebrx-spectrum-canvas');

    // Assume spectrum display behaving like the waterfall
    canvas.addEventListener("mousedown", canvas_mousedown, false);
    canvas.addEventListener("mousemove", canvas_mousemove, false);
    canvas.addEventListener("mouseup", canvas_mouseup, false);
    canvas.addEventListener("wheel", canvas_mousewheel, false);
    canvas.addEventListener("touchmove", process_touch, false);
    canvas.addEventListener("touchend", process_touch, false);
    canvas.addEventListener("touchstart", process_touch, false);

    // Create spectrum display
    spectrum = new Spectrum(canvas, 150);
}

/*
  _____  _       _                     _
 |  __ \(_)     (_)                   | |
 | |  | |_  __ _ _ _ __ ___   ___   __| | ___  ___
 | |  | | |/ _` | | '_ ` _ \ / _ \ / _` |/ _ \/ __|
 | |__| | | (_| | | | | | | | (_) | (_| |  __/\__ \
 |_____/|_|\__, |_|_| |_| |_|\___/ \__,_|\___||___/
            __/ |
           |___/
*/

var secondary_demod_fft_offset_db = 18; //need to calculate that later
var secondary_demod_canvases_initialized = false;
var secondary_demod_channel_freq = 1000;
var secondary_demod_waiting_for_set = false;
var secondary_demod_low_cut;
var secondary_demod_high_cut;
var secondary_demod_mousedown = false;
var secondary_demod_canvas_width;
var secondary_demod_canvas_left;
var secondary_demod_canvas_container;
var secondary_demod_current_canvas_actual_line;
var secondary_demod_current_canvas_context;
var secondary_demod_current_canvas_index;
var secondary_demod_canvases;
var secondary_bw = 31.25;
var if_samp_rate;

function secondary_demod_create_canvas() {
    var new_canvas = document.createElement("canvas");
    new_canvas.width = secondary_fft_size;
    new_canvas.height = $(secondary_demod_canvas_container).height();
    new_canvas.style.width = $(secondary_demod_canvas_container).width() + "px";
    new_canvas.style.height = $(secondary_demod_canvas_container).height() + "px";
    secondary_demod_current_canvas_actual_line = new_canvas.height - 1;
    $(secondary_demod_canvas_container).children().last().before(new_canvas);
    return new_canvas;
}

function secondary_demod_remove_canvases() {
    $(secondary_demod_canvas_container).children("canvas").remove();
}

function secondary_demod_init_canvases() {
    secondary_demod_remove_canvases();
    secondary_demod_canvases = [];
    secondary_demod_canvases.push(secondary_demod_create_canvas());
    secondary_demod_canvases.push(secondary_demod_create_canvas());
    secondary_demod_canvases[0].openwebrx_top = -$(secondary_demod_canvas_container).height();
    secondary_demod_canvases[1].openwebrx_top = 0;
    secondary_demod_canvases_update_top();
    secondary_demod_current_canvas_context = secondary_demod_canvases[0].getContext("2d");
    secondary_demod_current_canvas_actual_line = $(secondary_demod_canvas_container).height() - 1;
    secondary_demod_current_canvas_index = 0;
    secondary_demod_canvases_initialized = true;
    mkscale(); //so that the secondary waterfall zoom level will be initialized
}

function secondary_demod_canvases_update_top() {
    for (var i = 0; i < 2; i++) {
        secondary_demod_canvases[i].style.transform = 'translate(0, ' + secondary_demod_canvases[i].openwebrx_top + 'px)';
    }
}

function secondary_demod_swap_canvases() {
    secondary_demod_canvases[0 + !secondary_demod_current_canvas_index].openwebrx_top -= $(secondary_demod_canvas_container).height() * 2;
    secondary_demod_current_canvas_index = 0 + !secondary_demod_current_canvas_index;
    secondary_demod_current_canvas_context = secondary_demod_canvases[secondary_demod_current_canvas_index].getContext("2d");
    secondary_demod_current_canvas_actual_line = $(secondary_demod_canvas_container).height() - 1;
}

function secondary_demod_init() {
    secondary_demod_canvas_container = $("#openwebrx-digimode-canvas-container")[0];
    $(secondary_demod_canvas_container)
        .mousemove(secondary_demod_canvas_container_mousemove)
        .mouseup(secondary_demod_canvas_container_mouseup)
        .mousedown(secondary_demod_canvas_container_mousedown)
        .mouseenter(secondary_demod_canvas_container_mousein)
        .mouseleave(secondary_demod_canvas_container_mouseleave);
    ['wsjt', 'packet', 'pocsag', 'page', 'sstv', 'fax', 'ism', 'hfdl', 'adsb', 'dsc'].forEach(function(id){
        $('#openwebrx-panel-' + id + '-message')[id + 'MessagePanel']();
    })
    $('#openwebrx-panel-js8-message').js8();
}

function secondary_demod_push_data(x) {
    x = Array.from(x).filter(function (y) {
        var c = y.charCodeAt(0);
        return (c === 10 || (c >= 32 && c <= 126));
    }).map(function (y) {
        if (y === "&") return "&amp;";
        if (y === "<") return "&lt;";
        if (y === ">") return "&gt;";
        if (y === " ") return "&nbsp;";
        if (y === "\n") return "<br />";
        return y;
    }).join("");

    $("#openwebrx-cursor-blink").before(x);

    var nano = $('#openwebrx-digimode-content');
    nano.nanoScroller();
    nano.nanoScroller({scroll: 'bottom'});
}

function secondary_demod_waterfall_add(data) {
    var w = secondary_fft_size;

    // add line to waterfall image
    var oneline_image = secondary_demod_current_canvas_context.createImageData(w, 1);
    Waterfall.drawLine(oneline_image.data, data, secondary_demod_fft_offset_db);

    // draw image
    secondary_demod_current_canvas_context.putImageData(oneline_image, 0, secondary_demod_current_canvas_actual_line--);
    secondary_demod_canvases.map(function (x) { x.openwebrx_top += 1; });

    secondary_demod_canvases_update_top();
    if (secondary_demod_current_canvas_actual_line < 0) secondary_demod_swap_canvases();
}

function secondary_demod_update_marker() {
    var width = Math.max((secondary_bw / if_samp_rate) * secondary_demod_canvas_width, 5);
    var center_at = ((secondary_demod_channel_freq - secondary_demod_low_cut) / if_samp_rate) * secondary_demod_canvas_width;
    var left = center_at - width / 2;
    $("#openwebrx-digimode-select-channel").width(width).css("left", left + "px")
}

function secondary_demod_update_channel_freq_from_event(evt) {
    if (typeof evt !== "undefined") {
        var relativeX = (evt.offsetX) ? evt.offsetX : evt.layerX;
        secondary_demod_channel_freq = secondary_demod_low_cut +
            (relativeX / $(secondary_demod_canvas_container).width()) * (secondary_demod_high_cut - secondary_demod_low_cut);
    }
    if (!secondary_demod_waiting_for_set) {
        secondary_demod_waiting_for_set = true;
        window.setTimeout(function () {
                UI.getDemodulator().set_secondary_offset_freq(Math.floor(secondary_demod_channel_freq));
                secondary_demod_waiting_for_set = false;
            },
            50
        )
        ;
    }
    secondary_demod_update_marker();
}

function secondary_demod_canvas_container_mousein() {
    $("#openwebrx-digimode-select-channel").css("opacity", "0.7"); //.css("border-width", "1px");
}

function secondary_demod_canvas_container_mouseleave() {
    $("#openwebrx-digimode-select-channel").css("opacity", "0");
}

function secondary_demod_canvas_container_mousemove(evt) {
    if (secondary_demod_mousedown) secondary_demod_update_channel_freq_from_event(evt);
}

function secondary_demod_canvas_container_mousedown(evt) {
    if (evt.which === 1) secondary_demod_mousedown = true;
}

function secondary_demod_canvas_container_mouseup(evt) {
    if (evt.which === 1) secondary_demod_mousedown = false;
    secondary_demod_update_channel_freq_from_event(evt);
}


function secondary_demod_waterfall_set_zoom(low_cut, high_cut) {
    if (!secondary_demod_canvases_initialized) return;
    secondary_demod_low_cut = low_cut;
    secondary_demod_high_cut = high_cut;
    var shown_bw = high_cut - low_cut;
    secondary_demod_canvas_width = $(secondary_demod_canvas_container).width() * (if_samp_rate) / shown_bw;
    secondary_demod_canvas_left = (-secondary_demod_canvas_width / 2) - (low_cut / if_samp_rate) * secondary_demod_canvas_width;
    secondary_demod_canvases.map(function (x) {
        $(x).css({
            left: secondary_demod_canvas_left + "px",
            width: secondary_demod_canvas_width + "px"
        });
    });

    // Make sure secondary demod frequency is within bandpass
    var f = secondary_demod_channel_freq;
    if ((f < low_cut) || (f > high_cut)) {
        if ((-f >= low_cut) && (-f <= high_cut)) f = -f;
        else f = Math.floor((low_cut + high_cut) / 2);
        secondary_demod_channel_freq = f;
    }

    secondary_demod_update_channel_freq_from_event();
}

function sdr_profile_changed() {
    var value = $('#openwebrx-sdr-profiles-listbox').val();
    var key = UI.getDemodulatorPanel().getMagicKey();
    ws.send(JSON.stringify({
        "type": "selectprofile", "params": { "profile": value, "key": key }
    }));
}

function tuning_step_changed() {
    tuning_step = parseInt($('#openwebrx-tuning-step-listbox').val());
}

function tuning_step_reset() {
    $('#openwebrx-tuning-step-listbox').val(tuning_step_default);
    tuning_step = tuning_step_default;
}

/*! jQuery v3.2.1 | (c) JS Foundation and other contributors | jquery.org/license */
!function(a,b){"use strict";"object"==typeof module&&"object"==typeof module.exports?module.exports=a.document?b(a,!0):function(a){if(!a.document)throw new Error("jQuery requires a window with a document");return b(a)}:b(a)}("undefined"!=typeof window?window:this,function(a,b){"use strict";var c=[],d=a.document,e=Object.getPrototypeOf,f=c.slice,g=c.concat,h=c.push,i=c.indexOf,j={},k=j.toString,l=j.hasOwnProperty,m=l.toString,n=m.call(Object),o={};function p(a,b){b=b||d;var c=b.createElement("script");c.text=a,b.head.appendChild(c).parentNode.removeChild(c)}var q="3.2.1",r=function(a,b){return new r.fn.init(a,b)},s=/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,t=/^-ms-/,u=/-([a-z])/g,v=function(a,b){return b.toUpperCase()};r.fn=r.prototype={jquery:q,constructor:r,length:0,toArray:function(){return f.call(this)},get:function(a){return null==a?f.call(this):a<0?this[a+this.length]:this[a]},pushStack:function(a){var b=r.merge(this.constructor(),a);return b.prevObject=this,b},each:function(a){return r.each(this,a)},map:function(a){return this.pushStack(r.map(this,function(b,c){return a.call(b,c,b)}))},slice:function(){return this.pushStack(f.apply(this,arguments))},first:function(){return this.eq(0)},last:function(){return this.eq(-1)},eq:function(a){var b=this.length,c=+a+(a<0?b:0);return this.pushStack(c>=0&&c<b?[this[c]]:[])},end:function(){return this.prevObject||this.constructor()},push:h,sort:c.sort,splice:c.splice},r.extend=r.fn.extend=function(){var a,b,c,d,e,f,g=arguments[0]||{},h=1,i=arguments.length,j=!1;for("boolean"==typeof g&&(j=g,g=arguments[h]||{},h++),"object"==typeof g||r.isFunction(g)||(g={}),h===i&&(g=this,h--);h<i;h++)if(null!=(a=arguments[h]))for(b in a)c=g[b],d=a[b],g!==d&&(j&&d&&(r.isPlainObject(d)||(e=Array.isArray(d)))?(e?(e=!1,f=c&&Array.isArray(c)?c:[]):f=c&&r.isPlainObject(c)?c:{},g[b]=r.extend(j,f,d)):void 0!==d&&(g[b]=d));return g},r.extend({expando:"jQuery"+(q+Math.random()).replace(/\D/g,""),isReady:!0,error:function(a){throw new Error(a)},noop:function(){},isFunction:function(a){return"function"===r.type(a)},isWindow:function(a){return null!=a&&a===a.window},isNumeric:function(a){var b=r.type(a);return("number"===b||"string"===b)&&!isNaN(a-parseFloat(a))},isPlainObject:function(a){var b,c;return!(!a||"[object Object]"!==k.call(a))&&(!(b=e(a))||(c=l.call(b,"constructor")&&b.constructor,"function"==typeof c&&m.call(c)===n))},isEmptyObject:function(a){var b;for(b in a)return!1;return!0},type:function(a){return null==a?a+"":"object"==typeof a||"function"==typeof a?j[k.call(a)]||"object":typeof a},globalEval:function(a){p(a)},camelCase:function(a){return a.replace(t,"ms-").replace(u,v)},each:function(a,b){var c,d=0;if(w(a)){for(c=a.length;d<c;d++)if(b.call(a[d],d,a[d])===!1)break}else for(d in a)if(b.call(a[d],d,a[d])===!1)break;return a},trim:function(a){return null==a?"":(a+"").replace(s,"")},makeArray:function(a,b){var c=b||[];return null!=a&&(w(Object(a))?r.merge(c,"string"==typeof a?[a]:a):h.call(c,a)),c},inArray:function(a,b,c){return null==b?-1:i.call(b,a,c)},merge:function(a,b){for(var c=+b.length,d=0,e=a.length;d<c;d++)a[e++]=b[d];return a.length=e,a},grep:function(a,b,c){for(var d,e=[],f=0,g=a.length,h=!c;f<g;f++)d=!b(a[f],f),d!==h&&e.push(a[f]);return e},map:function(a,b,c){var d,e,f=0,h=[];if(w(a))for(d=a.length;f<d;f++)e=b(a[f],f,c),null!=e&&h.push(e);else for(f in a)e=b(a[f],f,c),null!=e&&h.push(e);return g.apply([],h)},guid:1,proxy:function(a,b){var c,d,e;if("string"==typeof b&&(c=a[b],b=a,a=c),r.isFunction(a))return d=f.call(arguments,2),e=function(){return a.apply(b||this,d.concat(f.call(arguments)))},e.guid=a.guid=a.guid||r.guid++,e},now:Date.now,support:o}),"function"==typeof Symbol&&(r.fn[Symbol.iterator]=c[Symbol.iterator]),r.each("Boolean Number String Function Array Date RegExp Object Error Symbol".split(" "),function(a,b){j["[object "+b+"]"]=b.toLowerCase()});function w(a){var b=!!a&&"length"in a&&a.length,c=r.type(a);return"function"!==c&&!r.isWindow(a)&&("array"===c||0===b||"number"==typeof b&&b>0&&b-1 in a)}var x=function(a){var b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u="sizzle"+1*new Date,v=a.document,w=0,x=0,y=ha(),z=ha(),A=ha(),B=function(a,b){return a===b&&(l=!0),0},C={}.hasOwnProperty,D=[],E=D.pop,F=D.push,G=D.push,H=D.slice,I=function(a,b){for(var c=0,d=a.length;c<d;c++)if(a[c]===b)return c;return-1},J="checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",K="[\\x20\\t\\r\\n\\f]",L="(?:\\\\.|[\\w-]|[^\0-\\xa0])+",M="\\["+K+"*("+L+")(?:"+K+"*([*^$|!~]?=)"+K+"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|("+L+"))|)"+K+"*\\]",N=":("+L+")(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|"+M+")*)|.*)\\)|)",O=new RegExp(K+"+","g"),P=new RegExp("^"+K+"+|((?:^|[^\\\\])(?:\\\\.)*)"+K+"+$","g"),Q=new RegExp("^"+K+"*,"+K+"*"),R=new RegExp("^"+K+"*([>+~]|"+K+")"+K+"*"),S=new RegExp("="+K+"*([^\\]'\"]*?)"+K+"*\\]","g"),T=new RegExp(N),U=new RegExp("^"+L+"$"),V={ID:new RegExp("^#("+L+")"),CLASS:new RegExp("^\\.("+L+")"),TAG:new RegExp("^("+L+"|[*])"),ATTR:new RegExp("^"+M),PSEUDO:new RegExp("^"+N),CHILD:new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\("+K+"*(even|odd|(([+-]|)(\\d*)n|)"+K+"*(?:([+-]|)"+K+"*(\\d+)|))"+K+"*\\)|)","i"),bool:new RegExp("^(?:"+J+")$","i"),needsContext:new RegExp("^"+K+"*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\("+K+"*((?:-\\d)?\\d*)"+K+"*\\)|)(?=[^-]|$)","i")},W=/^(?:input|select|textarea|button)$/i,X=/^h\d$/i,Y=/^[^{]+\{\s*\[native \w/,Z=/^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,$=/[+~]/,_=new RegExp("\\\\([\\da-f]{1,6}"+K+"?|("+K+")|.)","ig"),aa=function(a,b,c){var d="0x"+b-65536;return d!==d||c?b:d<0?String.fromCharCode(d+65536):String.fromCharCode(d>>10|55296,1023&d|56320)},ba=/([\0-\x1f\x7f]|^-?\d)|^-$|[^\0-\x1f\x7f-\uFFFF\w-]/g,ca=function(a,b){return b?"\0"===a?"\ufffd":a.slice(0,-1)+"\\"+a.charCodeAt(a.length-1).toString(16)+" ":"\\"+a},da=function(){m()},ea=ta(function(a){return a.disabled===!0&&("form"in a||"label"in a)},{dir:"parentNode",next:"legend"});try{G.apply(D=H.call(v.childNodes),v.childNodes),D[v.childNodes.length].nodeType}catch(fa){G={apply:D.length?function(a,b){F.apply(a,H.call(b))}:function(a,b){var c=a.length,d=0;while(a[c++]=b[d++]);a.length=c-1}}}function ga(a,b,d,e){var f,h,j,k,l,o,r,s=b&&b.ownerDocument,w=b?b.nodeType:9;if(d=d||[],"string"!=typeof a||!a||1!==w&&9!==w&&11!==w)return d;if(!e&&((b?b.ownerDocument||b:v)!==n&&m(b),b=b||n,p)){if(11!==w&&(l=Z.exec(a)))if(f=l[1]){if(9===w){if(!(j=b.getElementById(f)))return d;if(j.id===f)return d.push(j),d}else if(s&&(j=s.getElementById(f))&&t(b,j)&&j.id===f)return d.push(j),d}else{if(l[2])return G.apply(d,b.getElementsByTagName(a)),d;if((f=l[3])&&c.getElementsByClassName&&b.getElementsByClassName)return G.apply(d,b.getElementsByClassName(f)),d}if(c.qsa&&!A[a+" "]&&(!q||!q.test(a))){if(1!==w)s=b,r=a;else if("object"!==b.nodeName.toLowerCase()){(k=b.getAttribute("id"))?k=k.replace(ba,ca):b.setAttribute("id",k=u),o=g(a),h=o.length;while(h--)o[h]="#"+k+" "+sa(o[h]);r=o.join(","),s=$.test(a)&&qa(b.parentNode)||b}if(r)try{return G.apply(d,s.querySelectorAll(r)),d}catch(x){}finally{k===u&&b.removeAttribute("id")}}}return i(a.replace(P,"$1"),b,d,e)}function ha(){var a=[];function b(c,e){return a.push(c+" ")>d.cacheLength&&delete b[a.shift()],b[c+" "]=e}return b}function ia(a){return a[u]=!0,a}function ja(a){var b=n.createElement("fieldset");try{return!!a(b)}catch(c){return!1}finally{b.parentNode&&b.parentNode.removeChild(b),b=null}}function ka(a,b){var c=a.split("|"),e=c.length;while(e--)d.attrHandle[c[e]]=b}function la(a,b){var c=b&&a,d=c&&1===a.nodeType&&1===b.nodeType&&a.sourceIndex-b.sourceIndex;if(d)return d;if(c)while(c=c.nextSibling)if(c===b)return-1;return a?1:-1}function ma(a){return function(b){var c=b.nodeName.toLowerCase();return"input"===c&&b.type===a}}function na(a){return function(b){var c=b.nodeName.toLowerCase();return("input"===c||"button"===c)&&b.type===a}}function oa(a){return function(b){return"form"in b?b.parentNode&&b.disabled===!1?"label"in b?"label"in b.parentNode?b.parentNode.disabled===a:b.disabled===a:b.isDisabled===a||b.isDisabled!==!a&&ea(b)===a:b.disabled===a:"label"in b&&b.disabled===a}}function pa(a){return ia(function(b){return b=+b,ia(function(c,d){var e,f=a([],c.length,b),g=f.length;while(g--)c[e=f[g]]&&(c[e]=!(d[e]=c[e]))})})}function qa(a){return a&&"undefined"!=typeof a.getElementsByTagName&&a}c=ga.support={},f=ga.isXML=function(a){var b=a&&(a.ownerDocument||a).documentElement;return!!b&&"HTML"!==b.nodeName},m=ga.setDocument=function(a){var b,e,g=a?a.ownerDocument||a:v;return g!==n&&9===g.nodeType&&g.documentElement?(n=g,o=n.documentElement,p=!f(n),v!==n&&(e=n.defaultView)&&e.top!==e&&(e.addEventListener?e.addEventListener("unload",da,!1):e.attachEvent&&e.attachEvent("onunload",da)),c.attributes=ja(function(a){return a.className="i",!a.getAttribute("className")}),c.getElementsByTagName=ja(function(a){return a.appendChild(n.createComment("")),!a.getElementsByTagName("*").length}),c.getElementsByClassName=Y.test(n.getElementsByClassName),c.getById=ja(function(a){return o.appendChild(a).id=u,!n.getElementsByName||!n.getElementsByName(u).length}),c.getById?(d.filter.ID=function(a){var b=a.replace(_,aa);return function(a){return a.getAttribute("id")===b}},d.find.ID=function(a,b){if("undefined"!=typeof b.getElementById&&p){var c=b.getElementById(a);return c?[c]:[]}}):(d.filter.ID=function(a){var b=a.replace(_,aa);return function(a){var c="undefined"!=typeof a.getAttributeNode&&a.getAttributeNode("id");return c&&c.value===b}},d.find.ID=function(a,b){if("undefined"!=typeof b.getElementById&&p){var c,d,e,f=b.getElementById(a);if(f){if(c=f.getAttributeNode("id"),c&&c.value===a)return[f];e=b.getElementsByName(a),d=0;while(f=e[d++])if(c=f.getAttributeNode("id"),c&&c.value===a)return[f]}return[]}}),d.find.TAG=c.getElementsByTagName?function(a,b){return"undefined"!=typeof b.getElementsByTagName?b.getElementsByTagName(a):c.qsa?b.querySelectorAll(a):void 0}:function(a,b){var c,d=[],e=0,f=b.getElementsByTagName(a);if("*"===a){while(c=f[e++])1===c.nodeType&&d.push(c);return d}return f},d.find.CLASS=c.getElementsByClassName&&function(a,b){if("undefined"!=typeof b.getElementsByClassName&&p)return b.getElementsByClassName(a)},r=[],q=[],(c.qsa=Y.test(n.querySelectorAll))&&(ja(function(a){o.appendChild(a).innerHTML="<a id='"+u+"'></a><select id='"+u+"-\r\\' msallowcapture=''><option selected=''></option></select>",a.querySelectorAll("[msallowcapture^='']").length&&q.push("[*^$]="+K+"*(?:''|\"\")"),a.querySelectorAll("[selected]").length||q.push("\\["+K+"*(?:value|"+J+")"),a.querySelectorAll("[id~="+u+"-]").length||q.push("~="),a.querySelectorAll(":checked").length||q.push(":checked"),a.querySelectorAll("a#"+u+"+*").length||q.push(".#.+[+~]")}),ja(function(a){a.innerHTML="<a href='' disabled='disabled'></a><select disabled='disabled'><option/></select>";var b=n.createElement("input");b.setAttribute("type","hidden"),a.appendChild(b).setAttribute("name","D"),a.querySelectorAll("[name=d]").length&&q.push("name"+K+"*[*^$|!~]?="),2!==a.querySelectorAll(":enabled").length&&q.push(":enabled",":disabled"),o.appendChild(a).disabled=!0,2!==a.querySelectorAll(":disabled").length&&q.push(":enabled",":disabled"),a.querySelectorAll("*,:x"),q.push(",.*:")})),(c.matchesSelector=Y.test(s=o.matches||o.webkitMatchesSelector||o.mozMatchesSelector||o.oMatchesSelector||o.msMatchesSelector))&&ja(function(a){c.disconnectedMatch=s.call(a,"*"),s.call(a,"[s!='']:x"),r.push("!=",N)}),q=q.length&&new RegExp(q.join("|")),r=r.length&&new RegExp(r.join("|")),b=Y.test(o.compareDocumentPosition),t=b||Y.test(o.contains)?function(a,b){var c=9===a.nodeType?a.documentElement:a,d=b&&b.parentNode;return a===d||!(!d||1!==d.nodeType||!(c.contains?c.contains(d):a.compareDocumentPosition&&16&a.compareDocumentPosition(d)))}:function(a,b){if(b)while(b=b.parentNode)if(b===a)return!0;return!1},B=b?function(a,b){if(a===b)return l=!0,0;var d=!a.compareDocumentPosition-!b.compareDocumentPosition;return d?d:(d=(a.ownerDocument||a)===(b.ownerDocument||b)?a.compareDocumentPosition(b):1,1&d||!c.sortDetached&&b.compareDocumentPosition(a)===d?a===n||a.ownerDocument===v&&t(v,a)?-1:b===n||b.ownerDocument===v&&t(v,b)?1:k?I(k,a)-I(k,b):0:4&d?-1:1)}:function(a,b){if(a===b)return l=!0,0;var c,d=0,e=a.parentNode,f=b.parentNode,g=[a],h=[b];if(!e||!f)return a===n?-1:b===n?1:e?-1:f?1:k?I(k,a)-I(k,b):0;if(e===f)return la(a,b);c=a;while(c=c.parentNode)g.unshift(c);c=b;while(c=c.parentNode)h.unshift(c);while(g[d]===h[d])d++;return d?la(g[d],h[d]):g[d]===v?-1:h[d]===v?1:0},n):n},ga.matches=function(a,b){return ga(a,null,null,b)},ga.matchesSelector=function(a,b){if((a.ownerDocument||a)!==n&&m(a),b=b.replace(S,"='$1']"),c.matchesSelector&&p&&!A[b+" "]&&(!r||!r.test(b))&&(!q||!q.test(b)))try{var d=s.call(a,b);if(d||c.disconnectedMatch||a.document&&11!==a.document.nodeType)return d}catch(e){}return ga(b,n,null,[a]).length>0},ga.contains=function(a,b){return(a.ownerDocument||a)!==n&&m(a),t(a,b)},ga.attr=function(a,b){(a.ownerDocument||a)!==n&&m(a);var e=d.attrHandle[b.toLowerCase()],f=e&&C.call(d.attrHandle,b.toLowerCase())?e(a,b,!p):void 0;return void 0!==f?f:c.attributes||!p?a.getAttribute(b):(f=a.getAttributeNode(b))&&f.specified?f.value:null},ga.escape=function(a){return(a+"").replace(ba,ca)},ga.error=function(a){throw new Error("Syntax error, unrecognized expression: "+a)},ga.uniqueSort=function(a){var b,d=[],e=0,f=0;if(l=!c.detectDuplicates,k=!c.sortStable&&a.slice(0),a.sort(B),l){while(b=a[f++])b===a[f]&&(e=d.push(f));while(e--)a.splice(d[e],1)}return k=null,a},e=ga.getText=function(a){var b,c="",d=0,f=a.nodeType;if(f){if(1===f||9===f||11===f){if("string"==typeof a.textContent)return a.textContent;for(a=a.firstChild;a;a=a.nextSibling)c+=e(a)}else if(3===f||4===f)return a.nodeValue}else while(b=a[d++])c+=e(b);return c},d=ga.selectors={cacheLength:50,createPseudo:ia,match:V,attrHandle:{},find:{},relative:{">":{dir:"parentNode",first:!0}," ":{dir:"parentNode"},"+":{dir:"previousSibling",first:!0},"~":{dir:"previousSibling"}},preFilter:{ATTR:function(a){return a[1]=a[1].replace(_,aa),a[3]=(a[3]||a[4]||a[5]||"").replace(_,aa),"~="===a[2]&&(a[3]=" "+a[3]+" "),a.slice(0,4)},CHILD:function(a){return a[1]=a[1].toLowerCase(),"nth"===a[1].slice(0,3)?(a[3]||ga.error(a[0]),a[4]=+(a[4]?a[5]+(a[6]||1):2*("even"===a[3]||"odd"===a[3])),a[5]=+(a[7]+a[8]||"odd"===a[3])):a[3]&&ga.error(a[0]),a},PSEUDO:function(a){var b,c=!a[6]&&a[2];return V.CHILD.test(a[0])?null:(a[3]?a[2]=a[4]||a[5]||"":c&&T.test(c)&&(b=g(c,!0))&&(b=c.indexOf(")",c.length-b)-c.length)&&(a[0]=a[0].slice(0,b),a[2]=c.slice(0,b)),a.slice(0,3))}},filter:{TAG:function(a){var b=a.replace(_,aa).toLowerCase();return"*"===a?function(){return!0}:function(a){return a.nodeName&&a.nodeName.toLowerCase()===b}},CLASS:function(a){var b=y[a+" "];return b||(b=new RegExp("(^|"+K+")"+a+"("+K+"|$)"))&&y(a,function(a){return b.test("string"==typeof a.className&&a.className||"undefined"!=typeof a.getAttribute&&a.getAttribute("class")||"")})},ATTR:function(a,b,c){return function(d){var e=ga.attr(d,a);return null==e?"!="===b:!b||(e+="","="===b?e===c:"!="===b?e!==c:"^="===b?c&&0===e.indexOf(c):"*="===b?c&&e.indexOf(c)>-1:"$="===b?c&&e.slice(-c.length)===c:"~="===b?(" "+e.replace(O," ")+" ").indexOf(c)>-1:"|="===b&&(e===c||e.slice(0,c.length+1)===c+"-"))}},CHILD:function(a,b,c,d,e){var f="nth"!==a.slice(0,3),g="last"!==a.slice(-4),h="of-type"===b;return 1===d&&0===e?function(a){return!!a.parentNode}:function(b,c,i){var j,k,l,m,n,o,p=f!==g?"nextSibling":"previousSibling",q=b.parentNode,r=h&&b.nodeName.toLowerCase(),s=!i&&!h,t=!1;if(q){if(f){while(p){m=b;while(m=m[p])if(h?m.nodeName.toLowerCase()===r:1===m.nodeType)return!1;o=p="only"===a&&!o&&"nextSibling"}return!0}if(o=[g?q.firstChild:q.lastChild],g&&s){m=q,l=m[u]||(m[u]={}),k=l[m.uniqueID]||(l[m.uniqueID]={}),j=k[a]||[],n=j[0]===w&&j[1],t=n&&j[2],m=n&&q.childNodes[n];while(m=++n&&m&&m[p]||(t=n=0)||o.pop())if(1===m.nodeType&&++t&&m===b){k[a]=[w,n,t];break}}else if(s&&(m=b,l=m[u]||(m[u]={}),k=l[m.uniqueID]||(l[m.uniqueID]={}),j=k[a]||[],n=j[0]===w&&j[1],t=n),t===!1)while(m=++n&&m&&m[p]||(t=n=0)||o.pop())if((h?m.nodeName.toLowerCase()===r:1===m.nodeType)&&++t&&(s&&(l=m[u]||(m[u]={}),k=l[m.uniqueID]||(l[m.uniqueID]={}),k[a]=[w,t]),m===b))break;return t-=e,t===d||t%d===0&&t/d>=0}}},PSEUDO:function(a,b){var c,e=d.pseudos[a]||d.setFilters[a.toLowerCase()]||ga.error("unsupported pseudo: "+a);return e[u]?e(b):e.length>1?(c=[a,a,"",b],d.setFilters.hasOwnProperty(a.toLowerCase())?ia(function(a,c){var d,f=e(a,b),g=f.length;while(g--)d=I(a,f[g]),a[d]=!(c[d]=f[g])}):function(a){return e(a,0,c)}):e}},pseudos:{not:ia(function(a){var b=[],c=[],d=h(a.replace(P,"$1"));return d[u]?ia(function(a,b,c,e){var f,g=d(a,null,e,[]),h=a.length;while(h--)(f=g[h])&&(a[h]=!(b[h]=f))}):function(a,e,f){return b[0]=a,d(b,null,f,c),b[0]=null,!c.pop()}}),has:ia(function(a){return function(b){return ga(a,b).length>0}}),contains:ia(function(a){return a=a.replace(_,aa),function(b){return(b.textContent||b.innerText||e(b)).indexOf(a)>-1}}),lang:ia(function(a){return U.test(a||"")||ga.error("unsupported lang: "+a),a=a.replace(_,aa).toLowerCase(),function(b){var c;do if(c=p?b.lang:b.getAttribute("xml:lang")||b.getAttribute("lang"))return c=c.toLowerCase(),c===a||0===c.indexOf(a+"-");while((b=b.parentNode)&&1===b.nodeType);return!1}}),target:function(b){var c=a.location&&a.location.hash;return c&&c.slice(1)===b.id},root:function(a){return a===o},focus:function(a){return a===n.activeElement&&(!n.hasFocus||n.hasFocus())&&!!(a.type||a.href||~a.tabIndex)},enabled:oa(!1),disabled:oa(!0),checked:function(a){var b=a.nodeName.toLowerCase();return"input"===b&&!!a.checked||"option"===b&&!!a.selected},selected:function(a){return a.parentNode&&a.parentNode.selectedIndex,a.selected===!0},empty:function(a){for(a=a.firstChild;a;a=a.nextSibling)if(a.nodeType<6)return!1;return!0},parent:function(a){return!d.pseudos.empty(a)},header:function(a){return X.test(a.nodeName)},input:function(a){return W.test(a.nodeName)},button:function(a){var b=a.nodeName.toLowerCase();return"input"===b&&"button"===a.type||"button"===b},text:function(a){var b;return"input"===a.nodeName.toLowerCase()&&"text"===a.type&&(null==(b=a.getAttribute("type"))||"text"===b.toLowerCase())},first:pa(function(){return[0]}),last:pa(function(a,b){return[b-1]}),eq:pa(function(a,b,c){return[c<0?c+b:c]}),even:pa(function(a,b){for(var c=0;c<b;c+=2)a.push(c);return a}),odd:pa(function(a,b){for(var c=1;c<b;c+=2)a.push(c);return a}),lt:pa(function(a,b,c){for(var d=c<0?c+b:c;--d>=0;)a.push(d);return a}),gt:pa(function(a,b,c){for(var d=c<0?c+b:c;++d<b;)a.push(d);return a})}},d.pseudos.nth=d.pseudos.eq;for(b in{radio:!0,checkbox:!0,file:!0,password:!0,image:!0})d.pseudos[b]=ma(b);for(b in{submit:!0,reset:!0})d.pseudos[b]=na(b);function ra(){}ra.prototype=d.filters=d.pseudos,d.setFilters=new ra,g=ga.tokenize=function(a,b){var c,e,f,g,h,i,j,k=z[a+" "];if(k)return b?0:k.slice(0);h=a,i=[],j=d.preFilter;while(h){c&&!(e=Q.exec(h))||(e&&(h=h.slice(e[0].length)||h),i.push(f=[])),c=!1,(e=R.exec(h))&&(c=e.shift(),f.push({value:c,type:e[0].replace(P," ")}),h=h.slice(c.length));for(g in d.filter)!(e=V[g].exec(h))||j[g]&&!(e=j[g](e))||(c=e.shift(),f.push({value:c,type:g,matches:e}),h=h.slice(c.length));if(!c)break}return b?h.length:h?ga.error(a):z(a,i).slice(0)};function sa(a){for(var b=0,c=a.length,d="";b<c;b++)d+=a[b].value;return d}function ta(a,b,c){var d=b.dir,e=b.next,f=e||d,g=c&&"parentNode"===f,h=x++;return b.first?function(b,c,e){while(b=b[d])if(1===b.nodeType||g)return a(b,c,e);return!1}:function(b,c,i){var j,k,l,m=[w,h];if(i){while(b=b[d])if((1===b.nodeType||g)&&a(b,c,i))return!0}else while(b=b[d])if(1===b.nodeType||g)if(l=b[u]||(b[u]={}),k=l[b.uniqueID]||(l[b.uniqueID]={}),e&&e===b.nodeName.toLowerCase())b=b[d]||b;else{if((j=k[f])&&j[0]===w&&j[1]===h)return m[2]=j[2];if(k[f]=m,m[2]=a(b,c,i))return!0}return!1}}function ua(a){return a.length>1?function(b,c,d){var e=a.length;while(e--)if(!a[e](b,c,d))return!1;return!0}:a[0]}function va(a,b,c){for(var d=0,e=b.length;d<e;d++)ga(a,b[d],c);return c}function wa(a,b,c,d,e){for(var f,g=[],h=0,i=a.length,j=null!=b;h<i;h++)(f=a[h])&&(c&&!c(f,d,e)||(g.push(f),j&&b.push(h)));return g}function xa(a,b,c,d,e,f){return d&&!d[u]&&(d=xa(d)),e&&!e[u]&&(e=xa(e,f)),ia(function(f,g,h,i){var j,k,l,m=[],n=[],o=g.length,p=f||va(b||"*",h.nodeType?[h]:h,[]),q=!a||!f&&b?p:wa(p,m,a,h,i),r=c?e||(f?a:o||d)?[]:g:q;if(c&&c(q,r,h,i),d){j=wa(r,n),d(j,[],h,i),k=j.length;while(k--)(l=j[k])&&(r[n[k]]=!(q[n[k]]=l))}if(f){if(e||a){if(e){j=[],k=r.length;while(k--)(l=r[k])&&j.push(q[k]=l);e(null,r=[],j,i)}k=r.length;while(k--)(l=r[k])&&(j=e?I(f,l):m[k])>-1&&(f[j]=!(g[j]=l))}}else r=wa(r===g?r.splice(o,r.length):r),e?e(null,g,r,i):G.apply(g,r)})}function ya(a){for(var b,c,e,f=a.length,g=d.relative[a[0].type],h=g||d.relative[" "],i=g?1:0,k=ta(function(a){return a===b},h,!0),l=ta(function(a){return I(b,a)>-1},h,!0),m=[function(a,c,d){var e=!g&&(d||c!==j)||((b=c).nodeType?k(a,c,d):l(a,c,d));return b=null,e}];i<f;i++)if(c=d.relative[a[i].type])m=[ta(ua(m),c)];else{if(c=d.filter[a[i].type].apply(null,a[i].matches),c[u]){for(e=++i;e<f;e++)if(d.relative[a[e].type])break;return xa(i>1&&ua(m),i>1&&sa(a.slice(0,i-1).concat({value:" "===a[i-2].type?"*":""})).replace(P,"$1"),c,i<e&&ya(a.slice(i,e)),e<f&&ya(a=a.slice(e)),e<f&&sa(a))}m.push(c)}return ua(m)}function za(a,b){var c=b.length>0,e=a.length>0,f=function(f,g,h,i,k){var l,o,q,r=0,s="0",t=f&&[],u=[],v=j,x=f||e&&d.find.TAG("*",k),y=w+=null==v?1:Math.random()||.1,z=x.length;for(k&&(j=g===n||g||k);s!==z&&null!=(l=x[s]);s++){if(e&&l){o=0,g||l.ownerDocument===n||(m(l),h=!p);while(q=a[o++])if(q(l,g||n,h)){i.push(l);break}k&&(w=y)}c&&((l=!q&&l)&&r--,f&&t.push(l))}if(r+=s,c&&s!==r){o=0;while(q=b[o++])q(t,u,g,h);if(f){if(r>0)while(s--)t[s]||u[s]||(u[s]=E.call(i));u=wa(u)}G.apply(i,u),k&&!f&&u.length>0&&r+b.length>1&&ga.uniqueSort(i)}return k&&(w=y,j=v),t};return c?ia(f):f}return h=ga.compile=function(a,b){var c,d=[],e=[],f=A[a+" "];if(!f){b||(b=g(a)),c=b.length;while(c--)f=ya(b[c]),f[u]?d.push(f):e.push(f);f=A(a,za(e,d)),f.selector=a}return f},i=ga.select=function(a,b,c,e){var f,i,j,k,l,m="function"==typeof a&&a,n=!e&&g(a=m.selector||a);if(c=c||[],1===n.length){if(i=n[0]=n[0].slice(0),i.length>2&&"ID"===(j=i[0]).type&&9===b.nodeType&&p&&d.relative[i[1].type]){if(b=(d.find.ID(j.matches[0].replace(_,aa),b)||[])[0],!b)return c;m&&(b=b.parentNode),a=a.slice(i.shift().value.length)}f=V.needsContext.test(a)?0:i.length;while(f--){if(j=i[f],d.relative[k=j.type])break;if((l=d.find[k])&&(e=l(j.matches[0].replace(_,aa),$.test(i[0].type)&&qa(b.parentNode)||b))){if(i.splice(f,1),a=e.length&&sa(i),!a)return G.apply(c,e),c;break}}}return(m||h(a,n))(e,b,!p,c,!b||$.test(a)&&qa(b.parentNode)||b),c},c.sortStable=u.split("").sort(B).join("")===u,c.detectDuplicates=!!l,m(),c.sortDetached=ja(function(a){return 1&a.compareDocumentPosition(n.createElement("fieldset"))}),ja(function(a){return a.innerHTML="<a href='#'></a>","#"===a.firstChild.getAttribute("href")})||ka("type|href|height|width",function(a,b,c){if(!c)return a.getAttribute(b,"type"===b.toLowerCase()?1:2)}),c.attributes&&ja(function(a){return a.innerHTML="<input/>",a.firstChild.setAttribute("value",""),""===a.firstChild.getAttribute("value")})||ka("value",function(a,b,c){if(!c&&"input"===a.nodeName.toLowerCase())return a.defaultValue}),ja(function(a){return null==a.getAttribute("disabled")})||ka(J,function(a,b,c){var d;if(!c)return a[b]===!0?b.toLowerCase():(d=a.getAttributeNode(b))&&d.specified?d.value:null}),ga}(a);r.find=x,r.expr=x.selectors,r.expr[":"]=r.expr.pseudos,r.uniqueSort=r.unique=x.uniqueSort,r.text=x.getText,r.isXMLDoc=x.isXML,r.contains=x.contains,r.escapeSelector=x.escape;var y=function(a,b,c){var d=[],e=void 0!==c;while((a=a[b])&&9!==a.nodeType)if(1===a.nodeType){if(e&&r(a).is(c))break;d.push(a)}return d},z=function(a,b){for(var c=[];a;a=a.nextSibling)1===a.nodeType&&a!==b&&c.push(a);return c},A=r.expr.match.needsContext;function B(a,b){return a.nodeName&&a.nodeName.toLowerCase()===b.toLowerCase()}var C=/^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i,D=/^.[^:#\[\.,]*$/;function E(a,b,c){return r.isFunction(b)?r.grep(a,function(a,d){return!!b.call(a,d,a)!==c}):b.nodeType?r.grep(a,function(a){return a===b!==c}):"string"!=typeof b?r.grep(a,function(a){return i.call(b,a)>-1!==c}):D.test(b)?r.filter(b,a,c):(b=r.filter(b,a),r.grep(a,function(a){return i.call(b,a)>-1!==c&&1===a.nodeType}))}r.filter=function(a,b,c){var d=b[0];return c&&(a=":not("+a+")"),1===b.length&&1===d.nodeType?r.find.matchesSelector(d,a)?[d]:[]:r.find.matches(a,r.grep(b,function(a){return 1===a.nodeType}))},r.fn.extend({find:function(a){var b,c,d=this.length,e=this;if("string"!=typeof a)return this.pushStack(r(a).filter(function(){for(b=0;b<d;b++)if(r.contains(e[b],this))return!0}));for(c=this.pushStack([]),b=0;b<d;b++)r.find(a,e[b],c);return d>1?r.uniqueSort(c):c},filter:function(a){return this.pushStack(E(this,a||[],!1))},not:function(a){return this.pushStack(E(this,a||[],!0))},is:function(a){return!!E(this,"string"==typeof a&&A.test(a)?r(a):a||[],!1).length}});var F,G=/^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/,H=r.fn.init=function(a,b,c){var e,f;if(!a)return this;if(c=c||F,"string"==typeof a){if(e="<"===a[0]&&">"===a[a.length-1]&&a.length>=3?[null,a,null]:G.exec(a),!e||!e[1]&&b)return!b||b.jquery?(b||c).find(a):this.constructor(b).find(a);if(e[1]){if(b=b instanceof r?b[0]:b,r.merge(this,r.parseHTML(e[1],b&&b.nodeType?b.ownerDocument||b:d,!0)),C.test(e[1])&&r.isPlainObject(b))for(e in b)r.isFunction(this[e])?this[e](b[e]):this.attr(e,b[e]);return this}return f=d.getElementById(e[2]),f&&(this[0]=f,this.length=1),this}return a.nodeType?(this[0]=a,this.length=1,this):r.isFunction(a)?void 0!==c.ready?c.ready(a):a(r):r.makeArray(a,this)};H.prototype=r.fn,F=r(d);var I=/^(?:parents|prev(?:Until|All))/,J={children:!0,contents:!0,next:!0,prev:!0};r.fn.extend({has:function(a){var b=r(a,this),c=b.length;return this.filter(function(){for(var a=0;a<c;a++)if(r.contains(this,b[a]))return!0})},closest:function(a,b){var c,d=0,e=this.length,f=[],g="string"!=typeof a&&r(a);if(!A.test(a))for(;d<e;d++)for(c=this[d];c&&c!==b;c=c.parentNode)if(c.nodeType<11&&(g?g.index(c)>-1:1===c.nodeType&&r.find.matchesSelector(c,a))){f.push(c);break}return this.pushStack(f.length>1?r.uniqueSort(f):f)},index:function(a){return a?"string"==typeof a?i.call(r(a),this[0]):i.call(this,a.jquery?a[0]:a):this[0]&&this[0].parentNode?this.first().prevAll().length:-1},add:function(a,b){return this.pushStack(r.uniqueSort(r.merge(this.get(),r(a,b))))},addBack:function(a){return this.add(null==a?this.prevObject:this.prevObject.filter(a))}});function K(a,b){while((a=a[b])&&1!==a.nodeType);return a}r.each({parent:function(a){var b=a.parentNode;return b&&11!==b.nodeType?b:null},parents:function(a){return y(a,"parentNode")},parentsUntil:function(a,b,c){return y(a,"parentNode",c)},next:function(a){return K(a,"nextSibling")},prev:function(a){return K(a,"previousSibling")},nextAll:function(a){return y(a,"nextSibling")},prevAll:function(a){return y(a,"previousSibling")},nextUntil:function(a,b,c){return y(a,"nextSibling",c)},prevUntil:function(a,b,c){return y(a,"previousSibling",c)},siblings:function(a){return z((a.parentNode||{}).firstChild,a)},children:function(a){return z(a.firstChild)},contents:function(a){return B(a,"iframe")?a.contentDocument:(B(a,"template")&&(a=a.content||a),r.merge([],a.childNodes))}},function(a,b){r.fn[a]=function(c,d){var e=r.map(this,b,c);return"Until"!==a.slice(-5)&&(d=c),d&&"string"==typeof d&&(e=r.filter(d,e)),this.length>1&&(J[a]||r.uniqueSort(e),I.test(a)&&e.reverse()),this.pushStack(e)}});var L=/[^\x20\t\r\n\f]+/g;function M(a){var b={};return r.each(a.match(L)||[],function(a,c){b[c]=!0}),b}r.Callbacks=function(a){a="string"==typeof a?M(a):r.extend({},a);var b,c,d,e,f=[],g=[],h=-1,i=function(){for(e=e||a.once,d=b=!0;g.length;h=-1){c=g.shift();while(++h<f.length)f[h].apply(c[0],c[1])===!1&&a.stopOnFalse&&(h=f.length,c=!1)}a.memory||(c=!1),b=!1,e&&(f=c?[]:"")},j={add:function(){return f&&(c&&!b&&(h=f.length-1,g.push(c)),function d(b){r.each(b,function(b,c){r.isFunction(c)?a.unique&&j.has(c)||f.push(c):c&&c.length&&"string"!==r.type(c)&&d(c)})}(arguments),c&&!b&&i()),this},remove:function(){return r.each(arguments,function(a,b){var c;while((c=r.inArray(b,f,c))>-1)f.splice(c,1),c<=h&&h--}),this},has:function(a){return a?r.inArray(a,f)>-1:f.length>0},empty:function(){return f&&(f=[]),this},disable:function(){return e=g=[],f=c="",this},disabled:function(){return!f},lock:function(){return e=g=[],c||b||(f=c=""),this},locked:function(){return!!e},fireWith:function(a,c){return e||(c=c||[],c=[a,c.slice?c.slice():c],g.push(c),b||i()),this},fire:function(){return j.fireWith(this,arguments),this},fired:function(){return!!d}};return j};function N(a){return a}function O(a){throw a}function P(a,b,c,d){var e;try{a&&r.isFunction(e=a.promise)?e.call(a).done(b).fail(c):a&&r.isFunction(e=a.then)?e.call(a,b,c):b.apply(void 0,[a].slice(d))}catch(a){c.apply(void 0,[a])}}r.extend({Deferred:function(b){var c=[["notify","progress",r.Callbacks("memory"),r.Callbacks("memory"),2],["resolve","done",r.Callbacks("once memory"),r.Callbacks("once memory"),0,"resolved"],["reject","fail",r.Callbacks("once memory"),r.Callbacks("once memory"),1,"rejected"]],d="pending",e={state:function(){return d},always:function(){return f.done(arguments).fail(arguments),this},"catch":function(a){return e.then(null,a)},pipe:function(){var a=arguments;return r.Deferred(function(b){r.each(c,function(c,d){var e=r.isFunction(a[d[4]])&&a[d[4]];f[d[1]](function(){var a=e&&e.apply(this,arguments);a&&r.isFunction(a.promise)?a.promise().progress(b.notify).done(b.resolve).fail(b.reject):b[d[0]+"With"](this,e?[a]:arguments)})}),a=null}).promise()},then:function(b,d,e){var f=0;function g(b,c,d,e){return function(){var h=this,i=arguments,j=function(){var a,j;if(!(b<f)){if(a=d.apply(h,i),a===c.promise())throw new TypeError("Thenable self-resolution");j=a&&("object"==typeof a||"function"==typeof a)&&a.then,r.isFunction(j)?e?j.call(a,g(f,c,N,e),g(f,c,O,e)):(f++,j.call(a,g(f,c,N,e),g(f,c,O,e),g(f,c,N,c.notifyWith))):(d!==N&&(h=void 0,i=[a]),(e||c.resolveWith)(h,i))}},k=e?j:function(){try{j()}catch(a){r.Deferred.exceptionHook&&r.Deferred.exceptionHook(a,k.stackTrace),b+1>=f&&(d!==O&&(h=void 0,i=[a]),c.rejectWith(h,i))}};b?k():(r.Deferred.getStackHook&&(k.stackTrace=r.Deferred.getStackHook()),a.setTimeout(k))}}return r.Deferred(function(a){c[0][3].add(g(0,a,r.isFunction(e)?e:N,a.notifyWith)),c[1][3].add(g(0,a,r.isFunction(b)?b:N)),c[2][3].add(g(0,a,r.isFunction(d)?d:O))}).promise()},promise:function(a){return null!=a?r.extend(a,e):e}},f={};return r.each(c,function(a,b){var g=b[2],h=b[5];e[b[1]]=g.add,h&&g.add(function(){d=h},c[3-a][2].disable,c[0][2].lock),g.add(b[3].fire),f[b[0]]=function(){return f[b[0]+"With"](this===f?void 0:this,arguments),this},f[b[0]+"With"]=g.fireWith}),e.promise(f),b&&b.call(f,f),f},when:function(a){var b=arguments.length,c=b,d=Array(c),e=f.call(arguments),g=r.Deferred(),h=function(a){return function(c){d[a]=this,e[a]=arguments.length>1?f.call(arguments):c,--b||g.resolveWith(d,e)}};if(b<=1&&(P(a,g.done(h(c)).resolve,g.reject,!b),"pending"===g.state()||r.isFunction(e[c]&&e[c].then)))return g.then();while(c--)P(e[c],h(c),g.reject);return g.promise()}});var Q=/^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/;r.Deferred.exceptionHook=function(b,c){a.console&&a.console.warn&&b&&Q.test(b.name)&&a.console.warn("jQuery.Deferred exception: "+b.message,b.stack,c)},r.readyException=function(b){a.setTimeout(function(){throw b})};var R=r.Deferred();r.fn.ready=function(a){return R.then(a)["catch"](function(a){r.readyException(a)}),this},r.extend({isReady:!1,readyWait:1,ready:function(a){(a===!0?--r.readyWait:r.isReady)||(r.isReady=!0,a!==!0&&--r.readyWait>0||R.resolveWith(d,[r]))}}),r.ready.then=R.then;function S(){d.removeEventListener("DOMContentLoaded",S),
a.removeEventListener("load",S),r.ready()}"complete"===d.readyState||"loading"!==d.readyState&&!d.documentElement.doScroll?a.setTimeout(r.ready):(d.addEventListener("DOMContentLoaded",S),a.addEventListener("load",S));var T=function(a,b,c,d,e,f,g){var h=0,i=a.length,j=null==c;if("object"===r.type(c)){e=!0;for(h in c)T(a,b,h,c[h],!0,f,g)}else if(void 0!==d&&(e=!0,r.isFunction(d)||(g=!0),j&&(g?(b.call(a,d),b=null):(j=b,b=function(a,b,c){return j.call(r(a),c)})),b))for(;h<i;h++)b(a[h],c,g?d:d.call(a[h],h,b(a[h],c)));return e?a:j?b.call(a):i?b(a[0],c):f},U=function(a){return 1===a.nodeType||9===a.nodeType||!+a.nodeType};function V(){this.expando=r.expando+V.uid++}V.uid=1,V.prototype={cache:function(a){var b=a[this.expando];return b||(b={},U(a)&&(a.nodeType?a[this.expando]=b:Object.defineProperty(a,this.expando,{value:b,configurable:!0}))),b},set:function(a,b,c){var d,e=this.cache(a);if("string"==typeof b)e[r.camelCase(b)]=c;else for(d in b)e[r.camelCase(d)]=b[d];return e},get:function(a,b){return void 0===b?this.cache(a):a[this.expando]&&a[this.expando][r.camelCase(b)]},access:function(a,b,c){return void 0===b||b&&"string"==typeof b&&void 0===c?this.get(a,b):(this.set(a,b,c),void 0!==c?c:b)},remove:function(a,b){var c,d=a[this.expando];if(void 0!==d){if(void 0!==b){Array.isArray(b)?b=b.map(r.camelCase):(b=r.camelCase(b),b=b in d?[b]:b.match(L)||[]),c=b.length;while(c--)delete d[b[c]]}(void 0===b||r.isEmptyObject(d))&&(a.nodeType?a[this.expando]=void 0:delete a[this.expando])}},hasData:function(a){var b=a[this.expando];return void 0!==b&&!r.isEmptyObject(b)}};var W=new V,X=new V,Y=/^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,Z=/[A-Z]/g;function $(a){return"true"===a||"false"!==a&&("null"===a?null:a===+a+""?+a:Y.test(a)?JSON.parse(a):a)}function _(a,b,c){var d;if(void 0===c&&1===a.nodeType)if(d="data-"+b.replace(Z,"-$&").toLowerCase(),c=a.getAttribute(d),"string"==typeof c){try{c=$(c)}catch(e){}X.set(a,b,c)}else c=void 0;return c}r.extend({hasData:function(a){return X.hasData(a)||W.hasData(a)},data:function(a,b,c){return X.access(a,b,c)},removeData:function(a,b){X.remove(a,b)},_data:function(a,b,c){return W.access(a,b,c)},_removeData:function(a,b){W.remove(a,b)}}),r.fn.extend({data:function(a,b){var c,d,e,f=this[0],g=f&&f.attributes;if(void 0===a){if(this.length&&(e=X.get(f),1===f.nodeType&&!W.get(f,"hasDataAttrs"))){c=g.length;while(c--)g[c]&&(d=g[c].name,0===d.indexOf("data-")&&(d=r.camelCase(d.slice(5)),_(f,d,e[d])));W.set(f,"hasDataAttrs",!0)}return e}return"object"==typeof a?this.each(function(){X.set(this,a)}):T(this,function(b){var c;if(f&&void 0===b){if(c=X.get(f,a),void 0!==c)return c;if(c=_(f,a),void 0!==c)return c}else this.each(function(){X.set(this,a,b)})},null,b,arguments.length>1,null,!0)},removeData:function(a){return this.each(function(){X.remove(this,a)})}}),r.extend({queue:function(a,b,c){var d;if(a)return b=(b||"fx")+"queue",d=W.get(a,b),c&&(!d||Array.isArray(c)?d=W.access(a,b,r.makeArray(c)):d.push(c)),d||[]},dequeue:function(a,b){b=b||"fx";var c=r.queue(a,b),d=c.length,e=c.shift(),f=r._queueHooks(a,b),g=function(){r.dequeue(a,b)};"inprogress"===e&&(e=c.shift(),d--),e&&("fx"===b&&c.unshift("inprogress"),delete f.stop,e.call(a,g,f)),!d&&f&&f.empty.fire()},_queueHooks:function(a,b){var c=b+"queueHooks";return W.get(a,c)||W.access(a,c,{empty:r.Callbacks("once memory").add(function(){W.remove(a,[b+"queue",c])})})}}),r.fn.extend({queue:function(a,b){var c=2;return"string"!=typeof a&&(b=a,a="fx",c--),arguments.length<c?r.queue(this[0],a):void 0===b?this:this.each(function(){var c=r.queue(this,a,b);r._queueHooks(this,a),"fx"===a&&"inprogress"!==c[0]&&r.dequeue(this,a)})},dequeue:function(a){return this.each(function(){r.dequeue(this,a)})},clearQueue:function(a){return this.queue(a||"fx",[])},promise:function(a,b){var c,d=1,e=r.Deferred(),f=this,g=this.length,h=function(){--d||e.resolveWith(f,[f])};"string"!=typeof a&&(b=a,a=void 0),a=a||"fx";while(g--)c=W.get(f[g],a+"queueHooks"),c&&c.empty&&(d++,c.empty.add(h));return h(),e.promise(b)}});var aa=/[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,ba=new RegExp("^(?:([+-])=|)("+aa+")([a-z%]*)$","i"),ca=["Top","Right","Bottom","Left"],da=function(a,b){return a=b||a,"none"===a.style.display||""===a.style.display&&r.contains(a.ownerDocument,a)&&"none"===r.css(a,"display")},ea=function(a,b,c,d){var e,f,g={};for(f in b)g[f]=a.style[f],a.style[f]=b[f];e=c.apply(a,d||[]);for(f in b)a.style[f]=g[f];return e};function fa(a,b,c,d){var e,f=1,g=20,h=d?function(){return d.cur()}:function(){return r.css(a,b,"")},i=h(),j=c&&c[3]||(r.cssNumber[b]?"":"px"),k=(r.cssNumber[b]||"px"!==j&&+i)&&ba.exec(r.css(a,b));if(k&&k[3]!==j){j=j||k[3],c=c||[],k=+i||1;do f=f||".5",k/=f,r.style(a,b,k+j);while(f!==(f=h()/i)&&1!==f&&--g)}return c&&(k=+k||+i||0,e=c[1]?k+(c[1]+1)*c[2]:+c[2],d&&(d.unit=j,d.start=k,d.end=e)),e}var ga={};function ha(a){var b,c=a.ownerDocument,d=a.nodeName,e=ga[d];return e?e:(b=c.body.appendChild(c.createElement(d)),e=r.css(b,"display"),b.parentNode.removeChild(b),"none"===e&&(e="block"),ga[d]=e,e)}function ia(a,b){for(var c,d,e=[],f=0,g=a.length;f<g;f++)d=a[f],d.style&&(c=d.style.display,b?("none"===c&&(e[f]=W.get(d,"display")||null,e[f]||(d.style.display="")),""===d.style.display&&da(d)&&(e[f]=ha(d))):"none"!==c&&(e[f]="none",W.set(d,"display",c)));for(f=0;f<g;f++)null!=e[f]&&(a[f].style.display=e[f]);return a}r.fn.extend({show:function(){return ia(this,!0)},hide:function(){return ia(this)},toggle:function(a){return"boolean"==typeof a?a?this.show():this.hide():this.each(function(){da(this)?r(this).show():r(this).hide()})}});var ja=/^(?:checkbox|radio)$/i,ka=/<([a-z][^\/\0>\x20\t\r\n\f]+)/i,la=/^$|\/(?:java|ecma)script/i,ma={option:[1,"<select multiple='multiple'>","</select>"],thead:[1,"<table>","</table>"],col:[2,"<table><colgroup>","</colgroup></table>"],tr:[2,"<table><tbody>","</tbody></table>"],td:[3,"<table><tbody><tr>","</tr></tbody></table>"],_default:[0,"",""]};ma.optgroup=ma.option,ma.tbody=ma.tfoot=ma.colgroup=ma.caption=ma.thead,ma.th=ma.td;function na(a,b){var c;return c="undefined"!=typeof a.getElementsByTagName?a.getElementsByTagName(b||"*"):"undefined"!=typeof a.querySelectorAll?a.querySelectorAll(b||"*"):[],void 0===b||b&&B(a,b)?r.merge([a],c):c}function oa(a,b){for(var c=0,d=a.length;c<d;c++)W.set(a[c],"globalEval",!b||W.get(b[c],"globalEval"))}var pa=/<|&#?\w+;/;function qa(a,b,c,d,e){for(var f,g,h,i,j,k,l=b.createDocumentFragment(),m=[],n=0,o=a.length;n<o;n++)if(f=a[n],f||0===f)if("object"===r.type(f))r.merge(m,f.nodeType?[f]:f);else if(pa.test(f)){g=g||l.appendChild(b.createElement("div")),h=(ka.exec(f)||["",""])[1].toLowerCase(),i=ma[h]||ma._default,g.innerHTML=i[1]+r.htmlPrefilter(f)+i[2],k=i[0];while(k--)g=g.lastChild;r.merge(m,g.childNodes),g=l.firstChild,g.textContent=""}else m.push(b.createTextNode(f));l.textContent="",n=0;while(f=m[n++])if(d&&r.inArray(f,d)>-1)e&&e.push(f);else if(j=r.contains(f.ownerDocument,f),g=na(l.appendChild(f),"script"),j&&oa(g),c){k=0;while(f=g[k++])la.test(f.type||"")&&c.push(f)}return l}!function(){var a=d.createDocumentFragment(),b=a.appendChild(d.createElement("div")),c=d.createElement("input");c.setAttribute("type","radio"),c.setAttribute("checked","checked"),c.setAttribute("name","t"),b.appendChild(c),o.checkClone=b.cloneNode(!0).cloneNode(!0).lastChild.checked,b.innerHTML="<textarea>x</textarea>",o.noCloneChecked=!!b.cloneNode(!0).lastChild.defaultValue}();var ra=d.documentElement,sa=/^key/,ta=/^(?:mouse|pointer|contextmenu|drag|drop)|click/,ua=/^([^.]*)(?:\.(.+)|)/;function va(){return!0}function wa(){return!1}function xa(){try{return d.activeElement}catch(a){}}function ya(a,b,c,d,e,f){var g,h;if("object"==typeof b){"string"!=typeof c&&(d=d||c,c=void 0);for(h in b)ya(a,h,c,d,b[h],f);return a}if(null==d&&null==e?(e=c,d=c=void 0):null==e&&("string"==typeof c?(e=d,d=void 0):(e=d,d=c,c=void 0)),e===!1)e=wa;else if(!e)return a;return 1===f&&(g=e,e=function(a){return r().off(a),g.apply(this,arguments)},e.guid=g.guid||(g.guid=r.guid++)),a.each(function(){r.event.add(this,b,e,d,c)})}r.event={global:{},add:function(a,b,c,d,e){var f,g,h,i,j,k,l,m,n,o,p,q=W.get(a);if(q){c.handler&&(f=c,c=f.handler,e=f.selector),e&&r.find.matchesSelector(ra,e),c.guid||(c.guid=r.guid++),(i=q.events)||(i=q.events={}),(g=q.handle)||(g=q.handle=function(b){return"undefined"!=typeof r&&r.event.triggered!==b.type?r.event.dispatch.apply(a,arguments):void 0}),b=(b||"").match(L)||[""],j=b.length;while(j--)h=ua.exec(b[j])||[],n=p=h[1],o=(h[2]||"").split(".").sort(),n&&(l=r.event.special[n]||{},n=(e?l.delegateType:l.bindType)||n,l=r.event.special[n]||{},k=r.extend({type:n,origType:p,data:d,handler:c,guid:c.guid,selector:e,needsContext:e&&r.expr.match.needsContext.test(e),namespace:o.join(".")},f),(m=i[n])||(m=i[n]=[],m.delegateCount=0,l.setup&&l.setup.call(a,d,o,g)!==!1||a.addEventListener&&a.addEventListener(n,g)),l.add&&(l.add.call(a,k),k.handler.guid||(k.handler.guid=c.guid)),e?m.splice(m.delegateCount++,0,k):m.push(k),r.event.global[n]=!0)}},remove:function(a,b,c,d,e){var f,g,h,i,j,k,l,m,n,o,p,q=W.hasData(a)&&W.get(a);if(q&&(i=q.events)){b=(b||"").match(L)||[""],j=b.length;while(j--)if(h=ua.exec(b[j])||[],n=p=h[1],o=(h[2]||"").split(".").sort(),n){l=r.event.special[n]||{},n=(d?l.delegateType:l.bindType)||n,m=i[n]||[],h=h[2]&&new RegExp("(^|\\.)"+o.join("\\.(?:.*\\.|)")+"(\\.|$)"),g=f=m.length;while(f--)k=m[f],!e&&p!==k.origType||c&&c.guid!==k.guid||h&&!h.test(k.namespace)||d&&d!==k.selector&&("**"!==d||!k.selector)||(m.splice(f,1),k.selector&&m.delegateCount--,l.remove&&l.remove.call(a,k));g&&!m.length&&(l.teardown&&l.teardown.call(a,o,q.handle)!==!1||r.removeEvent(a,n,q.handle),delete i[n])}else for(n in i)r.event.remove(a,n+b[j],c,d,!0);r.isEmptyObject(i)&&W.remove(a,"handle events")}},dispatch:function(a){var b=r.event.fix(a),c,d,e,f,g,h,i=new Array(arguments.length),j=(W.get(this,"events")||{})[b.type]||[],k=r.event.special[b.type]||{};for(i[0]=b,c=1;c<arguments.length;c++)i[c]=arguments[c];if(b.delegateTarget=this,!k.preDispatch||k.preDispatch.call(this,b)!==!1){h=r.event.handlers.call(this,b,j),c=0;while((f=h[c++])&&!b.isPropagationStopped()){b.currentTarget=f.elem,d=0;while((g=f.handlers[d++])&&!b.isImmediatePropagationStopped())b.rnamespace&&!b.rnamespace.test(g.namespace)||(b.handleObj=g,b.data=g.data,e=((r.event.special[g.origType]||{}).handle||g.handler).apply(f.elem,i),void 0!==e&&(b.result=e)===!1&&(b.preventDefault(),b.stopPropagation()))}return k.postDispatch&&k.postDispatch.call(this,b),b.result}},handlers:function(a,b){var c,d,e,f,g,h=[],i=b.delegateCount,j=a.target;if(i&&j.nodeType&&!("click"===a.type&&a.button>=1))for(;j!==this;j=j.parentNode||this)if(1===j.nodeType&&("click"!==a.type||j.disabled!==!0)){for(f=[],g={},c=0;c<i;c++)d=b[c],e=d.selector+" ",void 0===g[e]&&(g[e]=d.needsContext?r(e,this).index(j)>-1:r.find(e,this,null,[j]).length),g[e]&&f.push(d);f.length&&h.push({elem:j,handlers:f})}return j=this,i<b.length&&h.push({elem:j,handlers:b.slice(i)}),h},addProp:function(a,b){Object.defineProperty(r.Event.prototype,a,{enumerable:!0,configurable:!0,get:r.isFunction(b)?function(){if(this.originalEvent)return b(this.originalEvent)}:function(){if(this.originalEvent)return this.originalEvent[a]},set:function(b){Object.defineProperty(this,a,{enumerable:!0,configurable:!0,writable:!0,value:b})}})},fix:function(a){return a[r.expando]?a:new r.Event(a)},special:{load:{noBubble:!0},focus:{trigger:function(){if(this!==xa()&&this.focus)return this.focus(),!1},delegateType:"focusin"},blur:{trigger:function(){if(this===xa()&&this.blur)return this.blur(),!1},delegateType:"focusout"},click:{trigger:function(){if("checkbox"===this.type&&this.click&&B(this,"input"))return this.click(),!1},_default:function(a){return B(a.target,"a")}},beforeunload:{postDispatch:function(a){void 0!==a.result&&a.originalEvent&&(a.originalEvent.returnValue=a.result)}}}},r.removeEvent=function(a,b,c){a.removeEventListener&&a.removeEventListener(b,c)},r.Event=function(a,b){return this instanceof r.Event?(a&&a.type?(this.originalEvent=a,this.type=a.type,this.isDefaultPrevented=a.defaultPrevented||void 0===a.defaultPrevented&&a.returnValue===!1?va:wa,this.target=a.target&&3===a.target.nodeType?a.target.parentNode:a.target,this.currentTarget=a.currentTarget,this.relatedTarget=a.relatedTarget):this.type=a,b&&r.extend(this,b),this.timeStamp=a&&a.timeStamp||r.now(),void(this[r.expando]=!0)):new r.Event(a,b)},r.Event.prototype={constructor:r.Event,isDefaultPrevented:wa,isPropagationStopped:wa,isImmediatePropagationStopped:wa,isSimulated:!1,preventDefault:function(){var a=this.originalEvent;this.isDefaultPrevented=va,a&&!this.isSimulated&&a.preventDefault()},stopPropagation:function(){var a=this.originalEvent;this.isPropagationStopped=va,a&&!this.isSimulated&&a.stopPropagation()},stopImmediatePropagation:function(){var a=this.originalEvent;this.isImmediatePropagationStopped=va,a&&!this.isSimulated&&a.stopImmediatePropagation(),this.stopPropagation()}},r.each({altKey:!0,bubbles:!0,cancelable:!0,changedTouches:!0,ctrlKey:!0,detail:!0,eventPhase:!0,metaKey:!0,pageX:!0,pageY:!0,shiftKey:!0,view:!0,"char":!0,charCode:!0,key:!0,keyCode:!0,button:!0,buttons:!0,clientX:!0,clientY:!0,offsetX:!0,offsetY:!0,pointerId:!0,pointerType:!0,screenX:!0,screenY:!0,targetTouches:!0,toElement:!0,touches:!0,which:function(a){var b=a.button;return null==a.which&&sa.test(a.type)?null!=a.charCode?a.charCode:a.keyCode:!a.which&&void 0!==b&&ta.test(a.type)?1&b?1:2&b?3:4&b?2:0:a.which}},r.event.addProp),r.each({mouseenter:"mouseover",mouseleave:"mouseout",pointerenter:"pointerover",pointerleave:"pointerout"},function(a,b){r.event.special[a]={delegateType:b,bindType:b,handle:function(a){var c,d=this,e=a.relatedTarget,f=a.handleObj;return e&&(e===d||r.contains(d,e))||(a.type=f.origType,c=f.handler.apply(this,arguments),a.type=b),c}}}),r.fn.extend({on:function(a,b,c,d){return ya(this,a,b,c,d)},one:function(a,b,c,d){return ya(this,a,b,c,d,1)},off:function(a,b,c){var d,e;if(a&&a.preventDefault&&a.handleObj)return d=a.handleObj,r(a.delegateTarget).off(d.namespace?d.origType+"."+d.namespace:d.origType,d.selector,d.handler),this;if("object"==typeof a){for(e in a)this.off(e,b,a[e]);return this}return b!==!1&&"function"!=typeof b||(c=b,b=void 0),c===!1&&(c=wa),this.each(function(){r.event.remove(this,a,c,b)})}});var za=/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([a-z][^\/\0>\x20\t\r\n\f]*)[^>]*)\/>/gi,Aa=/<script|<style|<link/i,Ba=/checked\s*(?:[^=]|=\s*.checked.)/i,Ca=/^true\/(.*)/,Da=/^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g;function Ea(a,b){return B(a,"table")&&B(11!==b.nodeType?b:b.firstChild,"tr")?r(">tbody",a)[0]||a:a}function Fa(a){return a.type=(null!==a.getAttribute("type"))+"/"+a.type,a}function Ga(a){var b=Ca.exec(a.type);return b?a.type=b[1]:a.removeAttribute("type"),a}function Ha(a,b){var c,d,e,f,g,h,i,j;if(1===b.nodeType){if(W.hasData(a)&&(f=W.access(a),g=W.set(b,f),j=f.events)){delete g.handle,g.events={};for(e in j)for(c=0,d=j[e].length;c<d;c++)r.event.add(b,e,j[e][c])}X.hasData(a)&&(h=X.access(a),i=r.extend({},h),X.set(b,i))}}function Ia(a,b){var c=b.nodeName.toLowerCase();"input"===c&&ja.test(a.type)?b.checked=a.checked:"input"!==c&&"textarea"!==c||(b.defaultValue=a.defaultValue)}function Ja(a,b,c,d){b=g.apply([],b);var e,f,h,i,j,k,l=0,m=a.length,n=m-1,q=b[0],s=r.isFunction(q);if(s||m>1&&"string"==typeof q&&!o.checkClone&&Ba.test(q))return a.each(function(e){var f=a.eq(e);s&&(b[0]=q.call(this,e,f.html())),Ja(f,b,c,d)});if(m&&(e=qa(b,a[0].ownerDocument,!1,a,d),f=e.firstChild,1===e.childNodes.length&&(e=f),f||d)){for(h=r.map(na(e,"script"),Fa),i=h.length;l<m;l++)j=e,l!==n&&(j=r.clone(j,!0,!0),i&&r.merge(h,na(j,"script"))),c.call(a[l],j,l);if(i)for(k=h[h.length-1].ownerDocument,r.map(h,Ga),l=0;l<i;l++)j=h[l],la.test(j.type||"")&&!W.access(j,"globalEval")&&r.contains(k,j)&&(j.src?r._evalUrl&&r._evalUrl(j.src):p(j.textContent.replace(Da,""),k))}return a}function Ka(a,b,c){for(var d,e=b?r.filter(b,a):a,f=0;null!=(d=e[f]);f++)c||1!==d.nodeType||r.cleanData(na(d)),d.parentNode&&(c&&r.contains(d.ownerDocument,d)&&oa(na(d,"script")),d.parentNode.removeChild(d));return a}r.extend({htmlPrefilter:function(a){return a.replace(za,"<$1></$2>")},clone:function(a,b,c){var d,e,f,g,h=a.cloneNode(!0),i=r.contains(a.ownerDocument,a);if(!(o.noCloneChecked||1!==a.nodeType&&11!==a.nodeType||r.isXMLDoc(a)))for(g=na(h),f=na(a),d=0,e=f.length;d<e;d++)Ia(f[d],g[d]);if(b)if(c)for(f=f||na(a),g=g||na(h),d=0,e=f.length;d<e;d++)Ha(f[d],g[d]);else Ha(a,h);return g=na(h,"script"),g.length>0&&oa(g,!i&&na(a,"script")),h},cleanData:function(a){for(var b,c,d,e=r.event.special,f=0;void 0!==(c=a[f]);f++)if(U(c)){if(b=c[W.expando]){if(b.events)for(d in b.events)e[d]?r.event.remove(c,d):r.removeEvent(c,d,b.handle);c[W.expando]=void 0}c[X.expando]&&(c[X.expando]=void 0)}}}),r.fn.extend({detach:function(a){return Ka(this,a,!0)},remove:function(a){return Ka(this,a)},text:function(a){return T(this,function(a){return void 0===a?r.text(this):this.empty().each(function(){1!==this.nodeType&&11!==this.nodeType&&9!==this.nodeType||(this.textContent=a)})},null,a,arguments.length)},append:function(){return Ja(this,arguments,function(a){if(1===this.nodeType||11===this.nodeType||9===this.nodeType){var b=Ea(this,a);b.appendChild(a)}})},prepend:function(){return Ja(this,arguments,function(a){if(1===this.nodeType||11===this.nodeType||9===this.nodeType){var b=Ea(this,a);b.insertBefore(a,b.firstChild)}})},before:function(){return Ja(this,arguments,function(a){this.parentNode&&this.parentNode.insertBefore(a,this)})},after:function(){return Ja(this,arguments,function(a){this.parentNode&&this.parentNode.insertBefore(a,this.nextSibling)})},empty:function(){for(var a,b=0;null!=(a=this[b]);b++)1===a.nodeType&&(r.cleanData(na(a,!1)),a.textContent="");return this},clone:function(a,b){return a=null!=a&&a,b=null==b?a:b,this.map(function(){return r.clone(this,a,b)})},html:function(a){return T(this,function(a){var b=this[0]||{},c=0,d=this.length;if(void 0===a&&1===b.nodeType)return b.innerHTML;if("string"==typeof a&&!Aa.test(a)&&!ma[(ka.exec(a)||["",""])[1].toLowerCase()]){a=r.htmlPrefilter(a);try{for(;c<d;c++)b=this[c]||{},1===b.nodeType&&(r.cleanData(na(b,!1)),b.innerHTML=a);b=0}catch(e){}}b&&this.empty().append(a)},null,a,arguments.length)},replaceWith:function(){var a=[];return Ja(this,arguments,function(b){var c=this.parentNode;r.inArray(this,a)<0&&(r.cleanData(na(this)),c&&c.replaceChild(b,this))},a)}}),r.each({appendTo:"append",prependTo:"prepend",insertBefore:"before",insertAfter:"after",replaceAll:"replaceWith"},function(a,b){r.fn[a]=function(a){for(var c,d=[],e=r(a),f=e.length-1,g=0;g<=f;g++)c=g===f?this:this.clone(!0),r(e[g])[b](c),h.apply(d,c.get());return this.pushStack(d)}});var La=/^margin/,Ma=new RegExp("^("+aa+")(?!px)[a-z%]+$","i"),Na=function(b){var c=b.ownerDocument.defaultView;return c&&c.opener||(c=a),c.getComputedStyle(b)};!function(){function b(){if(i){i.style.cssText="box-sizing:border-box;position:relative;display:block;margin:auto;border:1px;padding:1px;top:1%;width:50%",i.innerHTML="",ra.appendChild(h);var b=a.getComputedStyle(i);c="1%"!==b.top,g="2px"===b.marginLeft,e="4px"===b.width,i.style.marginRight="50%",f="4px"===b.marginRight,ra.removeChild(h),i=null}}var c,e,f,g,h=d.createElement("div"),i=d.createElement("div");i.style&&(i.style.backgroundClip="content-box",i.cloneNode(!0).style.backgroundClip="",o.clearCloneStyle="content-box"===i.style.backgroundClip,h.style.cssText="border:0;width:8px;height:0;top:0;left:-9999px;padding:0;margin-top:1px;position:absolute",h.appendChild(i),r.extend(o,{pixelPosition:function(){return b(),c},boxSizingReliable:function(){return b(),e},pixelMarginRight:function(){return b(),f},reliableMarginLeft:function(){return b(),g}}))}();function Oa(a,b,c){var d,e,f,g,h=a.style;return c=c||Na(a),c&&(g=c.getPropertyValue(b)||c[b],""!==g||r.contains(a.ownerDocument,a)||(g=r.style(a,b)),!o.pixelMarginRight()&&Ma.test(g)&&La.test(b)&&(d=h.width,e=h.minWidth,f=h.maxWidth,h.minWidth=h.maxWidth=h.width=g,g=c.width,h.width=d,h.minWidth=e,h.maxWidth=f)),void 0!==g?g+"":g}function Pa(a,b){return{get:function(){return a()?void delete this.get:(this.get=b).apply(this,arguments)}}}var Qa=/^(none|table(?!-c[ea]).+)/,Ra=/^--/,Sa={position:"absolute",visibility:"hidden",display:"block"},Ta={letterSpacing:"0",fontWeight:"400"},Ua=["Webkit","Moz","ms"],Va=d.createElement("div").style;function Wa(a){if(a in Va)return a;var b=a[0].toUpperCase()+a.slice(1),c=Ua.length;while(c--)if(a=Ua[c]+b,a in Va)return a}function Xa(a){var b=r.cssProps[a];return b||(b=r.cssProps[a]=Wa(a)||a),b}function Ya(a,b,c){var d=ba.exec(b);return d?Math.max(0,d[2]-(c||0))+(d[3]||"px"):b}function Za(a,b,c,d,e){var f,g=0;for(f=c===(d?"border":"content")?4:"width"===b?1:0;f<4;f+=2)"margin"===c&&(g+=r.css(a,c+ca[f],!0,e)),d?("content"===c&&(g-=r.css(a,"padding"+ca[f],!0,e)),"margin"!==c&&(g-=r.css(a,"border"+ca[f]+"Width",!0,e))):(g+=r.css(a,"padding"+ca[f],!0,e),"padding"!==c&&(g+=r.css(a,"border"+ca[f]+"Width",!0,e)));return g}function $a(a,b,c){var d,e=Na(a),f=Oa(a,b,e),g="border-box"===r.css(a,"boxSizing",!1,e);return Ma.test(f)?f:(d=g&&(o.boxSizingReliable()||f===a.style[b]),"auto"===f&&(f=a["offset"+b[0].toUpperCase()+b.slice(1)]),f=parseFloat(f)||0,f+Za(a,b,c||(g?"border":"content"),d,e)+"px")}r.extend({cssHooks:{opacity:{get:function(a,b){if(b){var c=Oa(a,"opacity");return""===c?"1":c}}}},cssNumber:{animationIterationCount:!0,columnCount:!0,fillOpacity:!0,flexGrow:!0,flexShrink:!0,fontWeight:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,widows:!0,zIndex:!0,zoom:!0},cssProps:{"float":"cssFloat"},style:function(a,b,c,d){if(a&&3!==a.nodeType&&8!==a.nodeType&&a.style){var e,f,g,h=r.camelCase(b),i=Ra.test(b),j=a.style;return i||(b=Xa(h)),g=r.cssHooks[b]||r.cssHooks[h],void 0===c?g&&"get"in g&&void 0!==(e=g.get(a,!1,d))?e:j[b]:(f=typeof c,"string"===f&&(e=ba.exec(c))&&e[1]&&(c=fa(a,b,e),f="number"),null!=c&&c===c&&("number"===f&&(c+=e&&e[3]||(r.cssNumber[h]?"":"px")),o.clearCloneStyle||""!==c||0!==b.indexOf("background")||(j[b]="inherit"),g&&"set"in g&&void 0===(c=g.set(a,c,d))||(i?j.setProperty(b,c):j[b]=c)),void 0)}},css:function(a,b,c,d){var e,f,g,h=r.camelCase(b),i=Ra.test(b);return i||(b=Xa(h)),g=r.cssHooks[b]||r.cssHooks[h],g&&"get"in g&&(e=g.get(a,!0,c)),void 0===e&&(e=Oa(a,b,d)),"normal"===e&&b in Ta&&(e=Ta[b]),""===c||c?(f=parseFloat(e),c===!0||isFinite(f)?f||0:e):e}}),r.each(["height","width"],function(a,b){r.cssHooks[b]={get:function(a,c,d){if(c)return!Qa.test(r.css(a,"display"))||a.getClientRects().length&&a.getBoundingClientRect().width?$a(a,b,d):ea(a,Sa,function(){return $a(a,b,d)})},set:function(a,c,d){var e,f=d&&Na(a),g=d&&Za(a,b,d,"border-box"===r.css(a,"boxSizing",!1,f),f);return g&&(e=ba.exec(c))&&"px"!==(e[3]||"px")&&(a.style[b]=c,c=r.css(a,b)),Ya(a,c,g)}}}),r.cssHooks.marginLeft=Pa(o.reliableMarginLeft,function(a,b){if(b)return(parseFloat(Oa(a,"marginLeft"))||a.getBoundingClientRect().left-ea(a,{marginLeft:0},function(){return a.getBoundingClientRect().left}))+"px"}),r.each({margin:"",padding:"",border:"Width"},function(a,b){r.cssHooks[a+b]={expand:function(c){for(var d=0,e={},f="string"==typeof c?c.split(" "):[c];d<4;d++)e[a+ca[d]+b]=f[d]||f[d-2]||f[0];return e}},La.test(a)||(r.cssHooks[a+b].set=Ya)}),r.fn.extend({css:function(a,b){return T(this,function(a,b,c){var d,e,f={},g=0;if(Array.isArray(b)){for(d=Na(a),e=b.length;g<e;g++)f[b[g]]=r.css(a,b[g],!1,d);return f}return void 0!==c?r.style(a,b,c):r.css(a,b)},a,b,arguments.length>1)}});function _a(a,b,c,d,e){return new _a.prototype.init(a,b,c,d,e)}r.Tween=_a,_a.prototype={constructor:_a,init:function(a,b,c,d,e,f){this.elem=a,this.prop=c,this.easing=e||r.easing._default,this.options=b,this.start=this.now=this.cur(),this.end=d,this.unit=f||(r.cssNumber[c]?"":"px")},cur:function(){var a=_a.propHooks[this.prop];return a&&a.get?a.get(this):_a.propHooks._default.get(this)},run:function(a){var b,c=_a.propHooks[this.prop];return this.options.duration?this.pos=b=r.easing[this.easing](a,this.options.duration*a,0,1,this.options.duration):this.pos=b=a,this.now=(this.end-this.start)*b+this.start,this.options.step&&this.options.step.call(this.elem,this.now,this),c&&c.set?c.set(this):_a.propHooks._default.set(this),this}},_a.prototype.init.prototype=_a.prototype,_a.propHooks={_default:{get:function(a){var b;return 1!==a.elem.nodeType||null!=a.elem[a.prop]&&null==a.elem.style[a.prop]?a.elem[a.prop]:(b=r.css(a.elem,a.prop,""),b&&"auto"!==b?b:0)},set:function(a){r.fx.step[a.prop]?r.fx.step[a.prop](a):1!==a.elem.nodeType||null==a.elem.style[r.cssProps[a.prop]]&&!r.cssHooks[a.prop]?a.elem[a.prop]=a.now:r.style(a.elem,a.prop,a.now+a.unit)}}},_a.propHooks.scrollTop=_a.propHooks.scrollLeft={set:function(a){a.elem.nodeType&&a.elem.parentNode&&(a.elem[a.prop]=a.now)}},r.easing={linear:function(a){return a},swing:function(a){return.5-Math.cos(a*Math.PI)/2},_default:"swing"},r.fx=_a.prototype.init,r.fx.step={};var ab,bb,cb=/^(?:toggle|show|hide)$/,db=/queueHooks$/;function eb(){bb&&(d.hidden===!1&&a.requestAnimationFrame?a.requestAnimationFrame(eb):a.setTimeout(eb,r.fx.interval),r.fx.tick())}function fb(){return a.setTimeout(function(){ab=void 0}),ab=r.now()}function gb(a,b){var c,d=0,e={height:a};for(b=b?1:0;d<4;d+=2-b)c=ca[d],e["margin"+c]=e["padding"+c]=a;return b&&(e.opacity=e.width=a),e}function hb(a,b,c){for(var d,e=(kb.tweeners[b]||[]).concat(kb.tweeners["*"]),f=0,g=e.length;f<g;f++)if(d=e[f].call(c,b,a))return d}function ib(a,b,c){var d,e,f,g,h,i,j,k,l="width"in b||"height"in b,m=this,n={},o=a.style,p=a.nodeType&&da(a),q=W.get(a,"fxshow");c.queue||(g=r._queueHooks(a,"fx"),null==g.unqueued&&(g.unqueued=0,h=g.empty.fire,g.empty.fire=function(){g.unqueued||h()}),g.unqueued++,m.always(function(){m.always(function(){g.unqueued--,r.queue(a,"fx").length||g.empty.fire()})}));for(d in b)if(e=b[d],cb.test(e)){if(delete b[d],f=f||"toggle"===e,e===(p?"hide":"show")){if("show"!==e||!q||void 0===q[d])continue;p=!0}n[d]=q&&q[d]||r.style(a,d)}if(i=!r.isEmptyObject(b),i||!r.isEmptyObject(n)){l&&1===a.nodeType&&(c.overflow=[o.overflow,o.overflowX,o.overflowY],j=q&&q.display,null==j&&(j=W.get(a,"display")),k=r.css(a,"display"),"none"===k&&(j?k=j:(ia([a],!0),j=a.style.display||j,k=r.css(a,"display"),ia([a]))),("inline"===k||"inline-block"===k&&null!=j)&&"none"===r.css(a,"float")&&(i||(m.done(function(){o.display=j}),null==j&&(k=o.display,j="none"===k?"":k)),o.display="inline-block")),c.overflow&&(o.overflow="hidden",m.always(function(){o.overflow=c.overflow[0],o.overflowX=c.overflow[1],o.overflowY=c.overflow[2]})),i=!1;for(d in n)i||(q?"hidden"in q&&(p=q.hidden):q=W.access(a,"fxshow",{display:j}),f&&(q.hidden=!p),p&&ia([a],!0),m.done(function(){p||ia([a]),W.remove(a,"fxshow");for(d in n)r.style(a,d,n[d])})),i=hb(p?q[d]:0,d,m),d in q||(q[d]=i.start,p&&(i.end=i.start,i.start=0))}}function jb(a,b){var c,d,e,f,g;for(c in a)if(d=r.camelCase(c),e=b[d],f=a[c],Array.isArray(f)&&(e=f[1],f=a[c]=f[0]),c!==d&&(a[d]=f,delete a[c]),g=r.cssHooks[d],g&&"expand"in g){f=g.expand(f),delete a[d];for(c in f)c in a||(a[c]=f[c],b[c]=e)}else b[d]=e}function kb(a,b,c){var d,e,f=0,g=kb.prefilters.length,h=r.Deferred().always(function(){delete i.elem}),i=function(){if(e)return!1;for(var b=ab||fb(),c=Math.max(0,j.startTime+j.duration-b),d=c/j.duration||0,f=1-d,g=0,i=j.tweens.length;g<i;g++)j.tweens[g].run(f);return h.notifyWith(a,[j,f,c]),f<1&&i?c:(i||h.notifyWith(a,[j,1,0]),h.resolveWith(a,[j]),!1)},j=h.promise({elem:a,props:r.extend({},b),opts:r.extend(!0,{specialEasing:{},easing:r.easing._default},c),originalProperties:b,originalOptions:c,startTime:ab||fb(),duration:c.duration,tweens:[],createTween:function(b,c){var d=r.Tween(a,j.opts,b,c,j.opts.specialEasing[b]||j.opts.easing);return j.tweens.push(d),d},stop:function(b){var c=0,d=b?j.tweens.length:0;if(e)return this;for(e=!0;c<d;c++)j.tweens[c].run(1);return b?(h.notifyWith(a,[j,1,0]),h.resolveWith(a,[j,b])):h.rejectWith(a,[j,b]),this}}),k=j.props;for(jb(k,j.opts.specialEasing);f<g;f++)if(d=kb.prefilters[f].call(j,a,k,j.opts))return r.isFunction(d.stop)&&(r._queueHooks(j.elem,j.opts.queue).stop=r.proxy(d.stop,d)),d;return r.map(k,hb,j),r.isFunction(j.opts.start)&&j.opts.start.call(a,j),j.progress(j.opts.progress).done(j.opts.done,j.opts.complete).fail(j.opts.fail).always(j.opts.always),r.fx.timer(r.extend(i,{elem:a,anim:j,queue:j.opts.queue})),j}r.Animation=r.extend(kb,{tweeners:{"*":[function(a,b){var c=this.createTween(a,b);return fa(c.elem,a,ba.exec(b),c),c}]},tweener:function(a,b){r.isFunction(a)?(b=a,a=["*"]):a=a.match(L);for(var c,d=0,e=a.length;d<e;d++)c=a[d],kb.tweeners[c]=kb.tweeners[c]||[],kb.tweeners[c].unshift(b)},prefilters:[ib],prefilter:function(a,b){b?kb.prefilters.unshift(a):kb.prefilters.push(a)}}),r.speed=function(a,b,c){var d=a&&"object"==typeof a?r.extend({},a):{complete:c||!c&&b||r.isFunction(a)&&a,duration:a,easing:c&&b||b&&!r.isFunction(b)&&b};return r.fx.off?d.duration=0:"number"!=typeof d.duration&&(d.duration in r.fx.speeds?d.duration=r.fx.speeds[d.duration]:d.duration=r.fx.speeds._default),null!=d.queue&&d.queue!==!0||(d.queue="fx"),d.old=d.complete,d.complete=function(){r.isFunction(d.old)&&d.old.call(this),d.queue&&r.dequeue(this,d.queue)},d},r.fn.extend({fadeTo:function(a,b,c,d){return this.filter(da).css("opacity",0).show().end().animate({opacity:b},a,c,d)},animate:function(a,b,c,d){var e=r.isEmptyObject(a),f=r.speed(b,c,d),g=function(){var b=kb(this,r.extend({},a),f);(e||W.get(this,"finish"))&&b.stop(!0)};return g.finish=g,e||f.queue===!1?this.each(g):this.queue(f.queue,g)},stop:function(a,b,c){var d=function(a){var b=a.stop;delete a.stop,b(c)};return"string"!=typeof a&&(c=b,b=a,a=void 0),b&&a!==!1&&this.queue(a||"fx",[]),this.each(function(){var b=!0,e=null!=a&&a+"queueHooks",f=r.timers,g=W.get(this);if(e)g[e]&&g[e].stop&&d(g[e]);else for(e in g)g[e]&&g[e].stop&&db.test(e)&&d(g[e]);for(e=f.length;e--;)f[e].elem!==this||null!=a&&f[e].queue!==a||(f[e].anim.stop(c),b=!1,f.splice(e,1));!b&&c||r.dequeue(this,a)})},finish:function(a){return a!==!1&&(a=a||"fx"),this.each(function(){var b,c=W.get(this),d=c[a+"queue"],e=c[a+"queueHooks"],f=r.timers,g=d?d.length:0;for(c.finish=!0,r.queue(this,a,[]),e&&e.stop&&e.stop.call(this,!0),b=f.length;b--;)f[b].elem===this&&f[b].queue===a&&(f[b].anim.stop(!0),f.splice(b,1));for(b=0;b<g;b++)d[b]&&d[b].finish&&d[b].finish.call(this);delete c.finish})}}),r.each(["toggle","show","hide"],function(a,b){var c=r.fn[b];r.fn[b]=function(a,d,e){return null==a||"boolean"==typeof a?c.apply(this,arguments):this.animate(gb(b,!0),a,d,e)}}),r.each({slideDown:gb("show"),slideUp:gb("hide"),slideToggle:gb("toggle"),fadeIn:{opacity:"show"},fadeOut:{opacity:"hide"},fadeToggle:{opacity:"toggle"}},function(a,b){r.fn[a]=function(a,c,d){return this.animate(b,a,c,d)}}),r.timers=[],r.fx.tick=function(){var a,b=0,c=r.timers;for(ab=r.now();b<c.length;b++)a=c[b],a()||c[b]!==a||c.splice(b--,1);c.length||r.fx.stop(),ab=void 0},r.fx.timer=function(a){r.timers.push(a),r.fx.start()},r.fx.interval=13,r.fx.start=function(){bb||(bb=!0,eb())},r.fx.stop=function(){bb=null},r.fx.speeds={slow:600,fast:200,_default:400},r.fn.delay=function(b,c){return b=r.fx?r.fx.speeds[b]||b:b,c=c||"fx",this.queue(c,function(c,d){var e=a.setTimeout(c,b);d.stop=function(){a.clearTimeout(e)}})},function(){var a=d.createElement("input"),b=d.createElement("select"),c=b.appendChild(d.createElement("option"));a.type="checkbox",o.checkOn=""!==a.value,o.optSelected=c.selected,a=d.createElement("input"),a.value="t",a.type="radio",o.radioValue="t"===a.value}();var lb,mb=r.expr.attrHandle;r.fn.extend({attr:function(a,b){return T(this,r.attr,a,b,arguments.length>1)},removeAttr:function(a){return this.each(function(){r.removeAttr(this,a)})}}),r.extend({attr:function(a,b,c){var d,e,f=a.nodeType;if(3!==f&&8!==f&&2!==f)return"undefined"==typeof a.getAttribute?r.prop(a,b,c):(1===f&&r.isXMLDoc(a)||(e=r.attrHooks[b.toLowerCase()]||(r.expr.match.bool.test(b)?lb:void 0)),void 0!==c?null===c?void r.removeAttr(a,b):e&&"set"in e&&void 0!==(d=e.set(a,c,b))?d:(a.setAttribute(b,c+""),c):e&&"get"in e&&null!==(d=e.get(a,b))?d:(d=r.find.attr(a,b),
null==d?void 0:d))},attrHooks:{type:{set:function(a,b){if(!o.radioValue&&"radio"===b&&B(a,"input")){var c=a.value;return a.setAttribute("type",b),c&&(a.value=c),b}}}},removeAttr:function(a,b){var c,d=0,e=b&&b.match(L);if(e&&1===a.nodeType)while(c=e[d++])a.removeAttribute(c)}}),lb={set:function(a,b,c){return b===!1?r.removeAttr(a,c):a.setAttribute(c,c),c}},r.each(r.expr.match.bool.source.match(/\w+/g),function(a,b){var c=mb[b]||r.find.attr;mb[b]=function(a,b,d){var e,f,g=b.toLowerCase();return d||(f=mb[g],mb[g]=e,e=null!=c(a,b,d)?g:null,mb[g]=f),e}});var nb=/^(?:input|select|textarea|button)$/i,ob=/^(?:a|area)$/i;r.fn.extend({prop:function(a,b){return T(this,r.prop,a,b,arguments.length>1)},removeProp:function(a){return this.each(function(){delete this[r.propFix[a]||a]})}}),r.extend({prop:function(a,b,c){var d,e,f=a.nodeType;if(3!==f&&8!==f&&2!==f)return 1===f&&r.isXMLDoc(a)||(b=r.propFix[b]||b,e=r.propHooks[b]),void 0!==c?e&&"set"in e&&void 0!==(d=e.set(a,c,b))?d:a[b]=c:e&&"get"in e&&null!==(d=e.get(a,b))?d:a[b]},propHooks:{tabIndex:{get:function(a){var b=r.find.attr(a,"tabindex");return b?parseInt(b,10):nb.test(a.nodeName)||ob.test(a.nodeName)&&a.href?0:-1}}},propFix:{"for":"htmlFor","class":"className"}}),o.optSelected||(r.propHooks.selected={get:function(a){var b=a.parentNode;return b&&b.parentNode&&b.parentNode.selectedIndex,null},set:function(a){var b=a.parentNode;b&&(b.selectedIndex,b.parentNode&&b.parentNode.selectedIndex)}}),r.each(["tabIndex","readOnly","maxLength","cellSpacing","cellPadding","rowSpan","colSpan","useMap","frameBorder","contentEditable"],function(){r.propFix[this.toLowerCase()]=this});function pb(a){var b=a.match(L)||[];return b.join(" ")}function qb(a){return a.getAttribute&&a.getAttribute("class")||""}r.fn.extend({addClass:function(a){var b,c,d,e,f,g,h,i=0;if(r.isFunction(a))return this.each(function(b){r(this).addClass(a.call(this,b,qb(this)))});if("string"==typeof a&&a){b=a.match(L)||[];while(c=this[i++])if(e=qb(c),d=1===c.nodeType&&" "+pb(e)+" "){g=0;while(f=b[g++])d.indexOf(" "+f+" ")<0&&(d+=f+" ");h=pb(d),e!==h&&c.setAttribute("class",h)}}return this},removeClass:function(a){var b,c,d,e,f,g,h,i=0;if(r.isFunction(a))return this.each(function(b){r(this).removeClass(a.call(this,b,qb(this)))});if(!arguments.length)return this.attr("class","");if("string"==typeof a&&a){b=a.match(L)||[];while(c=this[i++])if(e=qb(c),d=1===c.nodeType&&" "+pb(e)+" "){g=0;while(f=b[g++])while(d.indexOf(" "+f+" ")>-1)d=d.replace(" "+f+" "," ");h=pb(d),e!==h&&c.setAttribute("class",h)}}return this},toggleClass:function(a,b){var c=typeof a;return"boolean"==typeof b&&"string"===c?b?this.addClass(a):this.removeClass(a):r.isFunction(a)?this.each(function(c){r(this).toggleClass(a.call(this,c,qb(this),b),b)}):this.each(function(){var b,d,e,f;if("string"===c){d=0,e=r(this),f=a.match(L)||[];while(b=f[d++])e.hasClass(b)?e.removeClass(b):e.addClass(b)}else void 0!==a&&"boolean"!==c||(b=qb(this),b&&W.set(this,"__className__",b),this.setAttribute&&this.setAttribute("class",b||a===!1?"":W.get(this,"__className__")||""))})},hasClass:function(a){var b,c,d=0;b=" "+a+" ";while(c=this[d++])if(1===c.nodeType&&(" "+pb(qb(c))+" ").indexOf(b)>-1)return!0;return!1}});var rb=/\r/g;r.fn.extend({val:function(a){var b,c,d,e=this[0];{if(arguments.length)return d=r.isFunction(a),this.each(function(c){var e;1===this.nodeType&&(e=d?a.call(this,c,r(this).val()):a,null==e?e="":"number"==typeof e?e+="":Array.isArray(e)&&(e=r.map(e,function(a){return null==a?"":a+""})),b=r.valHooks[this.type]||r.valHooks[this.nodeName.toLowerCase()],b&&"set"in b&&void 0!==b.set(this,e,"value")||(this.value=e))});if(e)return b=r.valHooks[e.type]||r.valHooks[e.nodeName.toLowerCase()],b&&"get"in b&&void 0!==(c=b.get(e,"value"))?c:(c=e.value,"string"==typeof c?c.replace(rb,""):null==c?"":c)}}}),r.extend({valHooks:{option:{get:function(a){var b=r.find.attr(a,"value");return null!=b?b:pb(r.text(a))}},select:{get:function(a){var b,c,d,e=a.options,f=a.selectedIndex,g="select-one"===a.type,h=g?null:[],i=g?f+1:e.length;for(d=f<0?i:g?f:0;d<i;d++)if(c=e[d],(c.selected||d===f)&&!c.disabled&&(!c.parentNode.disabled||!B(c.parentNode,"optgroup"))){if(b=r(c).val(),g)return b;h.push(b)}return h},set:function(a,b){var c,d,e=a.options,f=r.makeArray(b),g=e.length;while(g--)d=e[g],(d.selected=r.inArray(r.valHooks.option.get(d),f)>-1)&&(c=!0);return c||(a.selectedIndex=-1),f}}}}),r.each(["radio","checkbox"],function(){r.valHooks[this]={set:function(a,b){if(Array.isArray(b))return a.checked=r.inArray(r(a).val(),b)>-1}},o.checkOn||(r.valHooks[this].get=function(a){return null===a.getAttribute("value")?"on":a.value})});var sb=/^(?:focusinfocus|focusoutblur)$/;r.extend(r.event,{trigger:function(b,c,e,f){var g,h,i,j,k,m,n,o=[e||d],p=l.call(b,"type")?b.type:b,q=l.call(b,"namespace")?b.namespace.split("."):[];if(h=i=e=e||d,3!==e.nodeType&&8!==e.nodeType&&!sb.test(p+r.event.triggered)&&(p.indexOf(".")>-1&&(q=p.split("."),p=q.shift(),q.sort()),k=p.indexOf(":")<0&&"on"+p,b=b[r.expando]?b:new r.Event(p,"object"==typeof b&&b),b.isTrigger=f?2:3,b.namespace=q.join("."),b.rnamespace=b.namespace?new RegExp("(^|\\.)"+q.join("\\.(?:.*\\.|)")+"(\\.|$)"):null,b.result=void 0,b.target||(b.target=e),c=null==c?[b]:r.makeArray(c,[b]),n=r.event.special[p]||{},f||!n.trigger||n.trigger.apply(e,c)!==!1)){if(!f&&!n.noBubble&&!r.isWindow(e)){for(j=n.delegateType||p,sb.test(j+p)||(h=h.parentNode);h;h=h.parentNode)o.push(h),i=h;i===(e.ownerDocument||d)&&o.push(i.defaultView||i.parentWindow||a)}g=0;while((h=o[g++])&&!b.isPropagationStopped())b.type=g>1?j:n.bindType||p,m=(W.get(h,"events")||{})[b.type]&&W.get(h,"handle"),m&&m.apply(h,c),m=k&&h[k],m&&m.apply&&U(h)&&(b.result=m.apply(h,c),b.result===!1&&b.preventDefault());return b.type=p,f||b.isDefaultPrevented()||n._default&&n._default.apply(o.pop(),c)!==!1||!U(e)||k&&r.isFunction(e[p])&&!r.isWindow(e)&&(i=e[k],i&&(e[k]=null),r.event.triggered=p,e[p](),r.event.triggered=void 0,i&&(e[k]=i)),b.result}},simulate:function(a,b,c){var d=r.extend(new r.Event,c,{type:a,isSimulated:!0});r.event.trigger(d,null,b)}}),r.fn.extend({trigger:function(a,b){return this.each(function(){r.event.trigger(a,b,this)})},triggerHandler:function(a,b){var c=this[0];if(c)return r.event.trigger(a,b,c,!0)}}),r.each("blur focus focusin focusout resize scroll click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup contextmenu".split(" "),function(a,b){r.fn[b]=function(a,c){return arguments.length>0?this.on(b,null,a,c):this.trigger(b)}}),r.fn.extend({hover:function(a,b){return this.mouseenter(a).mouseleave(b||a)}}),o.focusin="onfocusin"in a,o.focusin||r.each({focus:"focusin",blur:"focusout"},function(a,b){var c=function(a){r.event.simulate(b,a.target,r.event.fix(a))};r.event.special[b]={setup:function(){var d=this.ownerDocument||this,e=W.access(d,b);e||d.addEventListener(a,c,!0),W.access(d,b,(e||0)+1)},teardown:function(){var d=this.ownerDocument||this,e=W.access(d,b)-1;e?W.access(d,b,e):(d.removeEventListener(a,c,!0),W.remove(d,b))}}});var tb=a.location,ub=r.now(),vb=/\?/;r.parseXML=function(b){var c;if(!b||"string"!=typeof b)return null;try{c=(new a.DOMParser).parseFromString(b,"text/xml")}catch(d){c=void 0}return c&&!c.getElementsByTagName("parsererror").length||r.error("Invalid XML: "+b),c};var wb=/\[\]$/,xb=/\r?\n/g,yb=/^(?:submit|button|image|reset|file)$/i,zb=/^(?:input|select|textarea|keygen)/i;function Ab(a,b,c,d){var e;if(Array.isArray(b))r.each(b,function(b,e){c||wb.test(a)?d(a,e):Ab(a+"["+("object"==typeof e&&null!=e?b:"")+"]",e,c,d)});else if(c||"object"!==r.type(b))d(a,b);else for(e in b)Ab(a+"["+e+"]",b[e],c,d)}r.param=function(a,b){var c,d=[],e=function(a,b){var c=r.isFunction(b)?b():b;d[d.length]=encodeURIComponent(a)+"="+encodeURIComponent(null==c?"":c)};if(Array.isArray(a)||a.jquery&&!r.isPlainObject(a))r.each(a,function(){e(this.name,this.value)});else for(c in a)Ab(c,a[c],b,e);return d.join("&")},r.fn.extend({serialize:function(){return r.param(this.serializeArray())},serializeArray:function(){return this.map(function(){var a=r.prop(this,"elements");return a?r.makeArray(a):this}).filter(function(){var a=this.type;return this.name&&!r(this).is(":disabled")&&zb.test(this.nodeName)&&!yb.test(a)&&(this.checked||!ja.test(a))}).map(function(a,b){var c=r(this).val();return null==c?null:Array.isArray(c)?r.map(c,function(a){return{name:b.name,value:a.replace(xb,"\r\n")}}):{name:b.name,value:c.replace(xb,"\r\n")}}).get()}});var Bb=/%20/g,Cb=/#.*$/,Db=/([?&])_=[^&]*/,Eb=/^(.*?):[ \t]*([^\r\n]*)$/gm,Fb=/^(?:about|app|app-storage|.+-extension|file|res|widget):$/,Gb=/^(?:GET|HEAD)$/,Hb=/^\/\//,Ib={},Jb={},Kb="*/".concat("*"),Lb=d.createElement("a");Lb.href=tb.href;function Mb(a){return function(b,c){"string"!=typeof b&&(c=b,b="*");var d,e=0,f=b.toLowerCase().match(L)||[];if(r.isFunction(c))while(d=f[e++])"+"===d[0]?(d=d.slice(1)||"*",(a[d]=a[d]||[]).unshift(c)):(a[d]=a[d]||[]).push(c)}}function Nb(a,b,c,d){var e={},f=a===Jb;function g(h){var i;return e[h]=!0,r.each(a[h]||[],function(a,h){var j=h(b,c,d);return"string"!=typeof j||f||e[j]?f?!(i=j):void 0:(b.dataTypes.unshift(j),g(j),!1)}),i}return g(b.dataTypes[0])||!e["*"]&&g("*")}function Ob(a,b){var c,d,e=r.ajaxSettings.flatOptions||{};for(c in b)void 0!==b[c]&&((e[c]?a:d||(d={}))[c]=b[c]);return d&&r.extend(!0,a,d),a}function Pb(a,b,c){var d,e,f,g,h=a.contents,i=a.dataTypes;while("*"===i[0])i.shift(),void 0===d&&(d=a.mimeType||b.getResponseHeader("Content-Type"));if(d)for(e in h)if(h[e]&&h[e].test(d)){i.unshift(e);break}if(i[0]in c)f=i[0];else{for(e in c){if(!i[0]||a.converters[e+" "+i[0]]){f=e;break}g||(g=e)}f=f||g}if(f)return f!==i[0]&&i.unshift(f),c[f]}function Qb(a,b,c,d){var e,f,g,h,i,j={},k=a.dataTypes.slice();if(k[1])for(g in a.converters)j[g.toLowerCase()]=a.converters[g];f=k.shift();while(f)if(a.responseFields[f]&&(c[a.responseFields[f]]=b),!i&&d&&a.dataFilter&&(b=a.dataFilter(b,a.dataType)),i=f,f=k.shift())if("*"===f)f=i;else if("*"!==i&&i!==f){if(g=j[i+" "+f]||j["* "+f],!g)for(e in j)if(h=e.split(" "),h[1]===f&&(g=j[i+" "+h[0]]||j["* "+h[0]])){g===!0?g=j[e]:j[e]!==!0&&(f=h[0],k.unshift(h[1]));break}if(g!==!0)if(g&&a["throws"])b=g(b);else try{b=g(b)}catch(l){return{state:"parsererror",error:g?l:"No conversion from "+i+" to "+f}}}return{state:"success",data:b}}r.extend({active:0,lastModified:{},etag:{},ajaxSettings:{url:tb.href,type:"GET",isLocal:Fb.test(tb.protocol),global:!0,processData:!0,async:!0,contentType:"application/x-www-form-urlencoded; charset=UTF-8",accepts:{"*":Kb,text:"text/plain",html:"text/html",xml:"application/xml, text/xml",json:"application/json, text/javascript"},contents:{xml:/\bxml\b/,html:/\bhtml/,json:/\bjson\b/},responseFields:{xml:"responseXML",text:"responseText",json:"responseJSON"},converters:{"* text":String,"text html":!0,"text json":JSON.parse,"text xml":r.parseXML},flatOptions:{url:!0,context:!0}},ajaxSetup:function(a,b){return b?Ob(Ob(a,r.ajaxSettings),b):Ob(r.ajaxSettings,a)},ajaxPrefilter:Mb(Ib),ajaxTransport:Mb(Jb),ajax:function(b,c){"object"==typeof b&&(c=b,b=void 0),c=c||{};var e,f,g,h,i,j,k,l,m,n,o=r.ajaxSetup({},c),p=o.context||o,q=o.context&&(p.nodeType||p.jquery)?r(p):r.event,s=r.Deferred(),t=r.Callbacks("once memory"),u=o.statusCode||{},v={},w={},x="canceled",y={readyState:0,getResponseHeader:function(a){var b;if(k){if(!h){h={};while(b=Eb.exec(g))h[b[1].toLowerCase()]=b[2]}b=h[a.toLowerCase()]}return null==b?null:b},getAllResponseHeaders:function(){return k?g:null},setRequestHeader:function(a,b){return null==k&&(a=w[a.toLowerCase()]=w[a.toLowerCase()]||a,v[a]=b),this},overrideMimeType:function(a){return null==k&&(o.mimeType=a),this},statusCode:function(a){var b;if(a)if(k)y.always(a[y.status]);else for(b in a)u[b]=[u[b],a[b]];return this},abort:function(a){var b=a||x;return e&&e.abort(b),A(0,b),this}};if(s.promise(y),o.url=((b||o.url||tb.href)+"").replace(Hb,tb.protocol+"//"),o.type=c.method||c.type||o.method||o.type,o.dataTypes=(o.dataType||"*").toLowerCase().match(L)||[""],null==o.crossDomain){j=d.createElement("a");try{j.href=o.url,j.href=j.href,o.crossDomain=Lb.protocol+"//"+Lb.host!=j.protocol+"//"+j.host}catch(z){o.crossDomain=!0}}if(o.data&&o.processData&&"string"!=typeof o.data&&(o.data=r.param(o.data,o.traditional)),Nb(Ib,o,c,y),k)return y;l=r.event&&o.global,l&&0===r.active++&&r.event.trigger("ajaxStart"),o.type=o.type.toUpperCase(),o.hasContent=!Gb.test(o.type),f=o.url.replace(Cb,""),o.hasContent?o.data&&o.processData&&0===(o.contentType||"").indexOf("application/x-www-form-urlencoded")&&(o.data=o.data.replace(Bb,"+")):(n=o.url.slice(f.length),o.data&&(f+=(vb.test(f)?"&":"?")+o.data,delete o.data),o.cache===!1&&(f=f.replace(Db,"$1"),n=(vb.test(f)?"&":"?")+"_="+ub++ +n),o.url=f+n),o.ifModified&&(r.lastModified[f]&&y.setRequestHeader("If-Modified-Since",r.lastModified[f]),r.etag[f]&&y.setRequestHeader("If-None-Match",r.etag[f])),(o.data&&o.hasContent&&o.contentType!==!1||c.contentType)&&y.setRequestHeader("Content-Type",o.contentType),y.setRequestHeader("Accept",o.dataTypes[0]&&o.accepts[o.dataTypes[0]]?o.accepts[o.dataTypes[0]]+("*"!==o.dataTypes[0]?", "+Kb+"; q=0.01":""):o.accepts["*"]);for(m in o.headers)y.setRequestHeader(m,o.headers[m]);if(o.beforeSend&&(o.beforeSend.call(p,y,o)===!1||k))return y.abort();if(x="abort",t.add(o.complete),y.done(o.success),y.fail(o.error),e=Nb(Jb,o,c,y)){if(y.readyState=1,l&&q.trigger("ajaxSend",[y,o]),k)return y;o.async&&o.timeout>0&&(i=a.setTimeout(function(){y.abort("timeout")},o.timeout));try{k=!1,e.send(v,A)}catch(z){if(k)throw z;A(-1,z)}}else A(-1,"No Transport");function A(b,c,d,h){var j,m,n,v,w,x=c;k||(k=!0,i&&a.clearTimeout(i),e=void 0,g=h||"",y.readyState=b>0?4:0,j=b>=200&&b<300||304===b,d&&(v=Pb(o,y,d)),v=Qb(o,v,y,j),j?(o.ifModified&&(w=y.getResponseHeader("Last-Modified"),w&&(r.lastModified[f]=w),w=y.getResponseHeader("etag"),w&&(r.etag[f]=w)),204===b||"HEAD"===o.type?x="nocontent":304===b?x="notmodified":(x=v.state,m=v.data,n=v.error,j=!n)):(n=x,!b&&x||(x="error",b<0&&(b=0))),y.status=b,y.statusText=(c||x)+"",j?s.resolveWith(p,[m,x,y]):s.rejectWith(p,[y,x,n]),y.statusCode(u),u=void 0,l&&q.trigger(j?"ajaxSuccess":"ajaxError",[y,o,j?m:n]),t.fireWith(p,[y,x]),l&&(q.trigger("ajaxComplete",[y,o]),--r.active||r.event.trigger("ajaxStop")))}return y},getJSON:function(a,b,c){return r.get(a,b,c,"json")},getScript:function(a,b){return r.get(a,void 0,b,"script")}}),r.each(["get","post"],function(a,b){r[b]=function(a,c,d,e){return r.isFunction(c)&&(e=e||d,d=c,c=void 0),r.ajax(r.extend({url:a,type:b,dataType:e,data:c,success:d},r.isPlainObject(a)&&a))}}),r._evalUrl=function(a){return r.ajax({url:a,type:"GET",dataType:"script",cache:!0,async:!1,global:!1,"throws":!0})},r.fn.extend({wrapAll:function(a){var b;return this[0]&&(r.isFunction(a)&&(a=a.call(this[0])),b=r(a,this[0].ownerDocument).eq(0).clone(!0),this[0].parentNode&&b.insertBefore(this[0]),b.map(function(){var a=this;while(a.firstElementChild)a=a.firstElementChild;return a}).append(this)),this},wrapInner:function(a){return r.isFunction(a)?this.each(function(b){r(this).wrapInner(a.call(this,b))}):this.each(function(){var b=r(this),c=b.contents();c.length?c.wrapAll(a):b.append(a)})},wrap:function(a){var b=r.isFunction(a);return this.each(function(c){r(this).wrapAll(b?a.call(this,c):a)})},unwrap:function(a){return this.parent(a).not("body").each(function(){r(this).replaceWith(this.childNodes)}),this}}),r.expr.pseudos.hidden=function(a){return!r.expr.pseudos.visible(a)},r.expr.pseudos.visible=function(a){return!!(a.offsetWidth||a.offsetHeight||a.getClientRects().length)},r.ajaxSettings.xhr=function(){try{return new a.XMLHttpRequest}catch(b){}};var Rb={0:200,1223:204},Sb=r.ajaxSettings.xhr();o.cors=!!Sb&&"withCredentials"in Sb,o.ajax=Sb=!!Sb,r.ajaxTransport(function(b){var c,d;if(o.cors||Sb&&!b.crossDomain)return{send:function(e,f){var g,h=b.xhr();if(h.open(b.type,b.url,b.async,b.username,b.password),b.xhrFields)for(g in b.xhrFields)h[g]=b.xhrFields[g];b.mimeType&&h.overrideMimeType&&h.overrideMimeType(b.mimeType),b.crossDomain||e["X-Requested-With"]||(e["X-Requested-With"]="XMLHttpRequest");for(g in e)h.setRequestHeader(g,e[g]);c=function(a){return function(){c&&(c=d=h.onload=h.onerror=h.onabort=h.onreadystatechange=null,"abort"===a?h.abort():"error"===a?"number"!=typeof h.status?f(0,"error"):f(h.status,h.statusText):f(Rb[h.status]||h.status,h.statusText,"text"!==(h.responseType||"text")||"string"!=typeof h.responseText?{binary:h.response}:{text:h.responseText},h.getAllResponseHeaders()))}},h.onload=c(),d=h.onerror=c("error"),void 0!==h.onabort?h.onabort=d:h.onreadystatechange=function(){4===h.readyState&&a.setTimeout(function(){c&&d()})},c=c("abort");try{h.send(b.hasContent&&b.data||null)}catch(i){if(c)throw i}},abort:function(){c&&c()}}}),r.ajaxPrefilter(function(a){a.crossDomain&&(a.contents.script=!1)}),r.ajaxSetup({accepts:{script:"text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"},contents:{script:/\b(?:java|ecma)script\b/},converters:{"text script":function(a){return r.globalEval(a),a}}}),r.ajaxPrefilter("script",function(a){void 0===a.cache&&(a.cache=!1),a.crossDomain&&(a.type="GET")}),r.ajaxTransport("script",function(a){if(a.crossDomain){var b,c;return{send:function(e,f){b=r("<script>").prop({charset:a.scriptCharset,src:a.url}).on("load error",c=function(a){b.remove(),c=null,a&&f("error"===a.type?404:200,a.type)}),d.head.appendChild(b[0])},abort:function(){c&&c()}}}});var Tb=[],Ub=/(=)\?(?=&|$)|\?\?/;r.ajaxSetup({jsonp:"callback",jsonpCallback:function(){var a=Tb.pop()||r.expando+"_"+ub++;return this[a]=!0,a}}),r.ajaxPrefilter("json jsonp",function(b,c,d){var e,f,g,h=b.jsonp!==!1&&(Ub.test(b.url)?"url":"string"==typeof b.data&&0===(b.contentType||"").indexOf("application/x-www-form-urlencoded")&&Ub.test(b.data)&&"data");if(h||"jsonp"===b.dataTypes[0])return e=b.jsonpCallback=r.isFunction(b.jsonpCallback)?b.jsonpCallback():b.jsonpCallback,h?b[h]=b[h].replace(Ub,"$1"+e):b.jsonp!==!1&&(b.url+=(vb.test(b.url)?"&":"?")+b.jsonp+"="+e),b.converters["script json"]=function(){return g||r.error(e+" was not called"),g[0]},b.dataTypes[0]="json",f=a[e],a[e]=function(){g=arguments},d.always(function(){void 0===f?r(a).removeProp(e):a[e]=f,b[e]&&(b.jsonpCallback=c.jsonpCallback,Tb.push(e)),g&&r.isFunction(f)&&f(g[0]),g=f=void 0}),"script"}),o.createHTMLDocument=function(){var a=d.implementation.createHTMLDocument("").body;return a.innerHTML="<form></form><form></form>",2===a.childNodes.length}(),r.parseHTML=function(a,b,c){if("string"!=typeof a)return[];"boolean"==typeof b&&(c=b,b=!1);var e,f,g;return b||(o.createHTMLDocument?(b=d.implementation.createHTMLDocument(""),e=b.createElement("base"),e.href=d.location.href,b.head.appendChild(e)):b=d),f=C.exec(a),g=!c&&[],f?[b.createElement(f[1])]:(f=qa([a],b,g),g&&g.length&&r(g).remove(),r.merge([],f.childNodes))},r.fn.load=function(a,b,c){var d,e,f,g=this,h=a.indexOf(" ");return h>-1&&(d=pb(a.slice(h)),a=a.slice(0,h)),r.isFunction(b)?(c=b,b=void 0):b&&"object"==typeof b&&(e="POST"),g.length>0&&r.ajax({url:a,type:e||"GET",dataType:"html",data:b}).done(function(a){f=arguments,g.html(d?r("<div>").append(r.parseHTML(a)).find(d):a)}).always(c&&function(a,b){g.each(function(){c.apply(this,f||[a.responseText,b,a])})}),this},r.each(["ajaxStart","ajaxStop","ajaxComplete","ajaxError","ajaxSuccess","ajaxSend"],function(a,b){r.fn[b]=function(a){return this.on(b,a)}}),r.expr.pseudos.animated=function(a){return r.grep(r.timers,function(b){return a===b.elem}).length},r.offset={setOffset:function(a,b,c){var d,e,f,g,h,i,j,k=r.css(a,"position"),l=r(a),m={};"static"===k&&(a.style.position="relative"),h=l.offset(),f=r.css(a,"top"),i=r.css(a,"left"),j=("absolute"===k||"fixed"===k)&&(f+i).indexOf("auto")>-1,j?(d=l.position(),g=d.top,e=d.left):(g=parseFloat(f)||0,e=parseFloat(i)||0),r.isFunction(b)&&(b=b.call(a,c,r.extend({},h))),null!=b.top&&(m.top=b.top-h.top+g),null!=b.left&&(m.left=b.left-h.left+e),"using"in b?b.using.call(a,m):l.css(m)}},r.fn.extend({offset:function(a){if(arguments.length)return void 0===a?this:this.each(function(b){r.offset.setOffset(this,a,b)});var b,c,d,e,f=this[0];if(f)return f.getClientRects().length?(d=f.getBoundingClientRect(),b=f.ownerDocument,c=b.documentElement,e=b.defaultView,{top:d.top+e.pageYOffset-c.clientTop,left:d.left+e.pageXOffset-c.clientLeft}):{top:0,left:0}},position:function(){if(this[0]){var a,b,c=this[0],d={top:0,left:0};return"fixed"===r.css(c,"position")?b=c.getBoundingClientRect():(a=this.offsetParent(),b=this.offset(),B(a[0],"html")||(d=a.offset()),d={top:d.top+r.css(a[0],"borderTopWidth",!0),left:d.left+r.css(a[0],"borderLeftWidth",!0)}),{top:b.top-d.top-r.css(c,"marginTop",!0),left:b.left-d.left-r.css(c,"marginLeft",!0)}}},offsetParent:function(){return this.map(function(){var a=this.offsetParent;while(a&&"static"===r.css(a,"position"))a=a.offsetParent;return a||ra})}}),r.each({scrollLeft:"pageXOffset",scrollTop:"pageYOffset"},function(a,b){var c="pageYOffset"===b;r.fn[a]=function(d){return T(this,function(a,d,e){var f;return r.isWindow(a)?f=a:9===a.nodeType&&(f=a.defaultView),void 0===e?f?f[b]:a[d]:void(f?f.scrollTo(c?f.pageXOffset:e,c?e:f.pageYOffset):a[d]=e)},a,d,arguments.length)}}),r.each(["top","left"],function(a,b){r.cssHooks[b]=Pa(o.pixelPosition,function(a,c){if(c)return c=Oa(a,b),Ma.test(c)?r(a).position()[b]+"px":c})}),r.each({Height:"height",Width:"width"},function(a,b){r.each({padding:"inner"+a,content:b,"":"outer"+a},function(c,d){r.fn[d]=function(e,f){var g=arguments.length&&(c||"boolean"!=typeof e),h=c||(e===!0||f===!0?"margin":"border");return T(this,function(b,c,e){var f;return r.isWindow(b)?0===d.indexOf("outer")?b["inner"+a]:b.document.documentElement["client"+a]:9===b.nodeType?(f=b.documentElement,Math.max(b.body["scroll"+a],f["scroll"+a],b.body["offset"+a],f["offset"+a],f["client"+a])):void 0===e?r.css(b,c,h):r.style(b,c,e,h)},b,g?e:void 0,g)}})}),r.fn.extend({bind:function(a,b,c){return this.on(a,null,b,c)},unbind:function(a,b){return this.off(a,null,b)},delegate:function(a,b,c,d){return this.on(b,a,c,d)},undelegate:function(a,b,c){return 1===arguments.length?this.off(a,"**"):this.off(b,a||"**",c)}}),r.holdReady=function(a){a?r.readyWait++:r.ready(!0)},r.isArray=Array.isArray,r.parseJSON=JSON.parse,r.nodeName=B,"function"==typeof define&&define.amd&&define("jquery",[],function(){return r});var Vb=a.jQuery,Wb=a.$;return r.noConflict=function(b){return a.$===r&&(a.$=Wb),b&&a.jQuery===r&&(a.jQuery=Vb),r},b||(a.jQuery=a.$=r),r});

/*! nanoScrollerJS - v0.8.7 - (c) 2015 James Florentino; Licensed MIT */

!function(a){return"function"==typeof define&&define.amd?define(["jquery"],function(b){return a(b,window,document)}):"object"==typeof exports?module.exports=a(require("jquery"),window,document):a(jQuery,window,document)}(function(a,b,c){"use strict";var d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,A,B,C,D,E,F,G,H;z={paneClass:"nano-pane",sliderClass:"nano-slider",contentClass:"nano-content",enabledClass:"has-scrollbar",flashedClass:"flashed",activeClass:"active",iOSNativeScrolling:!1,preventPageScrolling:!1,disableResize:!1,alwaysVisible:!1,flashDelay:1500,sliderMinHeight:20,sliderMaxHeight:null,documentContext:null,windowContext:null},u="scrollbar",t="scroll",l="mousedown",m="mouseenter",n="mousemove",p="mousewheel",o="mouseup",s="resize",h="drag",i="enter",w="up",r="panedown",f="DOMMouseScroll",g="down",x="wheel",j="keydown",k="keyup",v="touchmove",d="Microsoft Internet Explorer"===b.navigator.appName&&/msie 7./i.test(b.navigator.appVersion)&&b.ActiveXObject,e=null,D=b.requestAnimationFrame,y=b.cancelAnimationFrame,F=c.createElement("div").style,H=function(){var a,b,c,d,e,f;for(d=["t","webkitT","MozT","msT","OT"],a=e=0,f=d.length;f>e;a=++e)if(c=d[a],b=d[a]+"ransform",b in F)return d[a].substr(0,d[a].length-1);return!1}(),G=function(a){return H===!1?!1:""===H?a:H+a.charAt(0).toUpperCase()+a.substr(1)},E=G("transform"),B=E!==!1,A=function(){var a,b,d;return a=c.createElement("div"),b=a.style,b.position="absolute",b.width="100px",b.height="100px",b.overflow=t,b.top="-9999px",c.body.appendChild(a),d=a.offsetWidth-a.clientWidth,c.body.removeChild(a),d},C=function(){var a,c,d;return c=b.navigator.userAgent,(a=/(?=.+Mac OS X)(?=.+Firefox)/.test(c))?(d=/Firefox\/\d{2}\./.exec(c),d&&(d=d[0].replace(/\D+/g,"")),a&&+d>23):!1},q=function(){function j(d,f){this.el=d,this.options=f,e||(e=A()),this.$el=a(this.el),this.doc=a(this.options.documentContext||c),this.win=a(this.options.windowContext||b),this.body=this.doc.find("body"),this.$content=this.$el.children("."+this.options.contentClass),this.$content.attr("tabindex",this.options.tabIndex||0),this.content=this.$content[0],this.previousPosition=0,this.options.iOSNativeScrolling&&null!=this.el.style.WebkitOverflowScrolling?this.nativeScrolling():this.generate(),this.createEvents(),this.addEvents(),this.reset()}return j.prototype.preventScrolling=function(a,b){if(this.isActive)if(a.type===f)(b===g&&a.originalEvent.detail>0||b===w&&a.originalEvent.detail<0)&&a.preventDefault();else if(a.type===p){if(!a.originalEvent||!a.originalEvent.wheelDelta)return;(b===g&&a.originalEvent.wheelDelta<0||b===w&&a.originalEvent.wheelDelta>0)&&a.preventDefault()}},j.prototype.nativeScrolling=function(){this.$content.css({WebkitOverflowScrolling:"touch"}),this.iOSNativeScrolling=!0,this.isActive=!0},j.prototype.updateScrollValues=function(){var a,b;a=this.content,this.maxScrollTop=a.scrollHeight-a.clientHeight,this.prevScrollTop=this.contentScrollTop||0,this.contentScrollTop=a.scrollTop,b=this.contentScrollTop>this.previousPosition?"down":this.contentScrollTop<this.previousPosition?"up":"same",this.previousPosition=this.contentScrollTop,"same"!==b&&this.$el.trigger("update",{position:this.contentScrollTop,maximum:this.maxScrollTop,direction:b}),this.iOSNativeScrolling||(this.maxSliderTop=this.paneHeight-this.sliderHeight,this.sliderTop=0===this.maxScrollTop?0:this.contentScrollTop*this.maxSliderTop/this.maxScrollTop)},j.prototype.setOnScrollStyles=function(){var a;B?(a={},a[E]="translate(0, "+this.sliderTop+"px)"):a={top:this.sliderTop},D?(y&&this.scrollRAF&&y(this.scrollRAF),this.scrollRAF=D(function(b){return function(){return b.scrollRAF=null,b.slider.css(a)}}(this))):this.slider.css(a)},j.prototype.createEvents=function(){this.events={down:function(a){return function(b){return a.isBeingDragged=!0,a.offsetY=b.pageY-a.slider.offset().top,a.slider.is(b.target)||(a.offsetY=0),a.pane.addClass(a.options.activeClass),a.doc.bind(n,a.events[h]).bind(o,a.events[w]),a.body.bind(m,a.events[i]),!1}}(this),drag:function(a){return function(b){return a.sliderY=b.pageY-a.$el.offset().top-a.paneTop-(a.offsetY||.5*a.sliderHeight),a.scroll(),a.contentScrollTop>=a.maxScrollTop&&a.prevScrollTop!==a.maxScrollTop?a.$el.trigger("scrollend"):0===a.contentScrollTop&&0!==a.prevScrollTop&&a.$el.trigger("scrolltop"),!1}}(this),up:function(a){return function(b){return a.isBeingDragged=!1,a.pane.removeClass(a.options.activeClass),a.doc.unbind(n,a.events[h]).unbind(o,a.events[w]),a.body.unbind(m,a.events[i]),!1}}(this),resize:function(a){return function(b){a.reset()}}(this),panedown:function(a){return function(b){return a.sliderY=(b.offsetY||b.originalEvent.layerY)-.5*a.sliderHeight,a.scroll(),a.events.down(b),!1}}(this),scroll:function(a){return function(b){a.updateScrollValues(),a.isBeingDragged||(a.iOSNativeScrolling||(a.sliderY=a.sliderTop,a.setOnScrollStyles()),null!=b&&(a.contentScrollTop>=a.maxScrollTop?(a.options.preventPageScrolling&&a.preventScrolling(b,g),a.prevScrollTop!==a.maxScrollTop&&a.$el.trigger("scrollend")):0===a.contentScrollTop&&(a.options.preventPageScrolling&&a.preventScrolling(b,w),0!==a.prevScrollTop&&a.$el.trigger("scrolltop"))))}}(this),wheel:function(a){return function(b){var c;if(null!=b)return c=b.delta||b.wheelDelta||b.originalEvent&&b.originalEvent.wheelDelta||-b.detail||b.originalEvent&&-b.originalEvent.detail,c&&(a.sliderY+=-c/3),a.scroll(),!1}}(this),enter:function(a){return function(b){var c;if(a.isBeingDragged)return 1!==(b.buttons||b.which)?(c=a.events)[w].apply(c,arguments):void 0}}(this)}},j.prototype.addEvents=function(){var a;this.removeEvents(),a=this.events,this.options.disableResize||this.win.bind(s,a[s]),this.iOSNativeScrolling||(this.slider.bind(l,a[g]),this.pane.bind(l,a[r]).bind(""+p+" "+f,a[x])),this.$content.bind(""+t+" "+p+" "+f+" "+v,a[t])},j.prototype.removeEvents=function(){var a;a=this.events,this.win.unbind(s,a[s]),this.iOSNativeScrolling||(this.slider.unbind(),this.pane.unbind()),this.$content.unbind(""+t+" "+p+" "+f+" "+v,a[t])},j.prototype.generate=function(){var a,c,d,f,g,h,i;return f=this.options,h=f.paneClass,i=f.sliderClass,a=f.contentClass,(g=this.$el.children("."+h)).length||g.children("."+i).length||this.$el.append('<div class="'+h+'"><div class="'+i+'" /></div>'),this.pane=this.$el.children("."+h),this.slider=this.pane.find("."+i),0===e&&C()?(d=b.getComputedStyle(this.content,null).getPropertyValue("padding-right").replace(/[^0-9.]+/g,""),c={right:-14,paddingRight:+d+14}):e&&(c={right:-e},this.$el.addClass(f.enabledClass)),null!=c&&this.$content.css(c),this},j.prototype.restore=function(){this.stopped=!1,this.iOSNativeScrolling||this.pane.show(),this.addEvents()},j.prototype.reset=function(){var a,b,c,f,g,h,i,j,k,l,m,n;return this.iOSNativeScrolling?void(this.contentHeight=this.content.scrollHeight):(this.$el.find("."+this.options.paneClass).length||this.generate().stop(),this.stopped&&this.restore(),a=this.content,f=a.style,g=f.overflowY,d&&this.$content.css({height:this.$content.height()}),b=a.scrollHeight+e,l=parseInt(this.$el.css("max-height"),10),l>0&&(this.$el.height(""),this.$el.height(a.scrollHeight>l?l:a.scrollHeight)),i=this.pane.outerHeight(!1),k=parseInt(this.pane.css("top"),10),h=parseInt(this.pane.css("bottom"),10),j=i+k+h,n=Math.round(j/b*i),n<this.options.sliderMinHeight?n=this.options.sliderMinHeight:null!=this.options.sliderMaxHeight&&n>this.options.sliderMaxHeight&&(n=this.options.sliderMaxHeight),g===t&&f.overflowX!==t&&(n+=e),this.maxSliderTop=j-n,this.contentHeight=b,this.paneHeight=i,this.paneOuterHeight=j,this.sliderHeight=n,this.paneTop=k,this.slider.height(n),this.events.scroll(),this.pane.show(),this.isActive=!0,a.scrollHeight===a.clientHeight||this.pane.outerHeight(!0)>=a.scrollHeight&&g!==t?(this.pane.hide(),this.isActive=!1):this.el.clientHeight===a.scrollHeight&&g===t?this.slider.hide():this.slider.show(),this.pane.css({opacity:this.options.alwaysVisible?1:"",visibility:this.options.alwaysVisible?"visible":""}),c=this.$content.css("position"),("static"===c||"relative"===c)&&(m=parseInt(this.$content.css("right"),10),m&&this.$content.css({right:"",marginRight:m})),this)},j.prototype.scroll=function(){return this.isActive?(this.sliderY=Math.max(0,this.sliderY),this.sliderY=Math.min(this.maxSliderTop,this.sliderY),this.$content.scrollTop(this.maxScrollTop*this.sliderY/this.maxSliderTop),this.iOSNativeScrolling||(this.updateScrollValues(),this.setOnScrollStyles()),this):void 0},j.prototype.scrollBottom=function(a){return this.isActive?(this.$content.scrollTop(this.contentHeight-this.$content.height()-a).trigger(p),this.stop().restore(),this):void 0},j.prototype.scrollTop=function(a){return this.isActive?(this.$content.scrollTop(+a).trigger(p),this.stop().restore(),this):void 0},j.prototype.scrollTo=function(a){return this.isActive?(this.scrollTop(this.$el.find(a).get(0).offsetTop),this):void 0},j.prototype.stop=function(){return y&&this.scrollRAF&&(y(this.scrollRAF),this.scrollRAF=null),this.stopped=!0,this.removeEvents(),this.iOSNativeScrolling||this.pane.hide(),this},j.prototype.destroy=function(){return this.stopped||this.stop(),!this.iOSNativeScrolling&&this.pane.length&&this.pane.remove(),d&&this.$content.height(""),this.$content.removeAttr("tabindex"),this.$el.hasClass(this.options.enabledClass)&&(this.$el.removeClass(this.options.enabledClass),this.$content.css({right:""})),this},j.prototype.flash=function(){return!this.iOSNativeScrolling&&this.isActive?(this.reset(),this.pane.addClass(this.options.flashedClass),setTimeout(function(a){return function(){a.pane.removeClass(a.options.flashedClass)}}(this),this.options.flashDelay),this):void 0},j}(),a.fn.nanoScroller=function(b){return this.each(function(){var c,d;if((d=this.nanoscroller)||(c=a.extend({},z,b),this.nanoscroller=d=new q(this,c)),b&&"object"==typeof b){if(a.extend(d.options,b),null!=b.scrollBottom)return d.scrollBottom(b.scrollBottom);if(null!=b.scrollTop)return d.scrollTop(b.scrollTop);if(b.scrollTo)return d.scrollTo(b.scrollTo);if("bottom"===b.scroll)return d.scrollBottom(0);if("top"===b.scroll)return d.scrollTop(0);if(b.scroll&&b.scroll instanceof a)return d.scrollTo(b.scroll);if(b.stop)return d.stop();if(b.destroy)return d.destroy();if(b.flash)return d.flash()}return d.reset()})},a.fn.nanoScroller.Constructor=q});

function lamejs(){function X(c){return new Int32Array(c)}function K(c){return new Float32Array(c)}function ca(c){if(1==c.length)return K(c[0]);var k=c[0];c=c.slice(1);for(var n=[],u=0;u<k;u++)n.push(ca(c));return n}function Ia(c){if(1==c.length)return X(c[0]);var k=c[0];c=c.slice(1);for(var n=[],u=0;u<k;u++)n.push(Ia(c));return n}function dc(c){if(1==c.length)return new Int16Array(c[0]);var k=c[0];c=c.slice(1);for(var n=[],u=0;u<k;u++)n.push(dc(c));return n}function Ob(c){if(1==c.length)return Array(c[0]);
var k=c[0];c=c.slice(1);for(var n=[],u=0;u<k;u++)n.push(Ob(c));return n}function ra(c){this.ordinal=c}function G(c){this.ordinal=c}function la(c){this.ordinal=function(){return c}}function mc(){this.getLameVersion=function(){return"3.98.4"};this.getLameShortVersion=function(){return"3.98.4"};this.getLameVeryShortVersion=function(){return"LAME3.98r"};this.getPsyVersion=function(){return"0.93"};this.getLameUrl=function(){return"http://www.mp3dev.org/"};this.getLameOsBitness=function(){return"32bits"}}
function Y(){function c(f,b,c,a,m,k){for(;0!=m--;)c[a]=1E-10+f[b+0]*k[0]-c[a-1]*k[1]+f[b-1]*k[2]-c[a-2]*k[3]+f[b-2]*k[4]-c[a-3]*k[5]+f[b-3]*k[6]-c[a-4]*k[7]+f[b-4]*k[8]-c[a-5]*k[9]+f[b-5]*k[10]-c[a-6]*k[11]+f[b-6]*k[12]-c[a-7]*k[13]+f[b-7]*k[14]-c[a-8]*k[15]+f[b-8]*k[16]-c[a-9]*k[17]+f[b-9]*k[18]-c[a-10]*k[19]+f[b-10]*k[20],++a,++b}function k(f,b,c,a,m,k){for(;0!=m--;)c[a]=f[b+0]*k[0]-c[a-1]*k[1]+f[b-1]*k[2]-c[a-2]*k[3]+f[b-2]*k[4],++a,++b}function n(f){return f*f}var V=Y.RMS_WINDOW_TIME_NUMERATOR,
E=Y.RMS_WINDOW_TIME_DENOMINATOR,B=[[.038575994352,-3.84664617118067,-.02160367184185,7.81501653005538,-.00123395316851,-11.34170355132042,-9.291677959E-5,13.05504219327545,-.01655260341619,-12.28759895145294,.02161526843274,9.4829380631979,-.02074045215285,-5.87257861775999,.00594298065125,2.75465861874613,.00306428023191,-.86984376593551,1.2025322027E-4,.13919314567432,.00288463683916],[.0541865640643,-3.47845948550071,-.02911007808948,6.36317777566148,-.00848709379851,-8.54751527471874,-.00851165645469,
9.4769360780128,-.00834990904936,-8.81498681370155,.02245293253339,6.85401540936998,-.02596338512915,-4.39470996079559,.01624864962975,2.19611684890774,-.00240879051584,-.75104302451432,.00674613682247,.13149317958808,-.00187763777362],[.15457299681924,-2.37898834973084,-.09331049056315,2.84868151156327,-.06247880153653,-2.64577170229825,.02163541888798,2.23697657451713,-.05588393329856,-1.67148153367602,.04781476674921,1.00595954808547,.00222312597743,-.45953458054983,.03174092540049,.16378164858596,
-.01390589421898,-.05032077717131,.00651420667831,.0234789740702,-.00881362733839],[.30296907319327,-1.61273165137247,-.22613988682123,1.0797749225997,-.08587323730772,-.2565625775407,.03282930172664,-.1627671912044,-.00915702933434,-.22638893773906,-.02364141202522,.39120800788284,-.00584456039913,-.22138138954925,.06276101321749,.04500235387352,-8.28086748E-6,.02005851806501,.00205861885564,.00302439095741,-.02950134983287],[.33642304856132,-1.49858979367799,-.2557224142557,.87350271418188,-.11828570177555,
.12205022308084,.11921148675203,-.80774944671438,-.07834489609479,.47854794562326,-.0046997791438,-.12453458140019,-.0058950022444,-.04067510197014,.05724228140351,.08333755284107,.00832043980773,-.04237348025746,-.0163538138454,.02977207319925,-.0176017656815],[.4491525660845,-.62820619233671,-.14351757464547,.29661783706366,-.22784394429749,-.372563729424,-.01419140100551,.00213767857124,.04078262797139,-.42029820170918,-.12398163381748,.22199650564824,.04097565135648,.00613424350682,.10478503600251,
.06747620744683,-.01863887810927,.05784820375801,-.03193428438915,.03222754072173,.00541907748707],[.56619470757641,-1.04800335126349,-.75464456939302,.29156311971249,.1624213774223,-.26806001042947,.16744243493672,.00819999645858,-.18901604199609,.45054734505008,.3093178284183,-.33032403314006,-.27562961986224,.0673936833311,.00647310677246,-.04784254229033,.08647503780351,.01639907836189,-.0378898455484,.01807364323573,-.00588215443421],[.58100494960553,-.51035327095184,-.53174909058578,-.31863563325245,
-.14289799034253,-.20256413484477,.17520704835522,.1472815413433,.02377945217615,.38952639978999,.15558449135573,-.23313271880868,-.25344790059353,-.05246019024463,.01628462406333,-.02505961724053,.06920467763959,.02442357316099,-.03721611395801,.01818801111503,-.00749618797172],[.53648789255105,-.2504987195602,-.42163034350696,-.43193942311114,-.00275953611929,-.03424681017675,.04267842219415,-.04678328784242,-.10214864179676,.26408300200955,.14590772289388,.15113130533216,-.02459864859345,-.17556493366449,
-.11202315195388,-.18823009262115,-.04060034127,.05477720428674,.0478866554818,.0470440968812,-.02217936801134]],w=[[.98621192462708,-1.97223372919527,-1.97242384925416,.97261396931306,.98621192462708],[.98500175787242,-1.96977855582618,-1.97000351574484,.9702284756635,.98500175787242],[.97938932735214,-1.95835380975398,-1.95877865470428,.95920349965459,.97938932735214],[.97531843204928,-1.95002759149878,-1.95063686409857,.95124613669835,.97531843204928],[.97316523498161,-1.94561023566527,-1.94633046996323,
.94705070426118,.97316523498161],[.96454515552826,-1.92783286977036,-1.92909031105652,.93034775234268,.96454515552826],[.96009142950541,-1.91858953033784,-1.92018285901082,.92177618768381,.96009142950541],[.95856916599601,-1.9154210807478,-1.91713833199203,.91885558323625,.95856916599601],[.94597685600279,-1.88903307939452,-1.89195371200558,.89487434461664,.94597685600279]];this.InitGainAnalysis=function(f,b){a:{for(var c=0;c<MAX_ORDER;c++)f.linprebuf[c]=f.lstepbuf[c]=f.loutbuf[c]=f.rinprebuf[c]=
f.rstepbuf[c]=f.routbuf[c]=0;switch(0|b){case 48E3:f.reqindex=0;break;case 44100:f.reqindex=1;break;case 32E3:f.reqindex=2;break;case 24E3:f.reqindex=3;break;case 22050:f.reqindex=4;break;case 16E3:f.reqindex=5;break;case 12E3:f.reqindex=6;break;case 11025:f.reqindex=7;break;case 8E3:f.reqindex=8;break;default:b=INIT_GAIN_ANALYSIS_ERROR;break a}f.sampleWindow=0|(b*V+E-1)/E;f.lsum=0;f.rsum=0;f.totsamp=0;na.ill(f.A,0);b=INIT_GAIN_ANALYSIS_OK}if(b!=INIT_GAIN_ANALYSIS_OK)return INIT_GAIN_ANALYSIS_ERROR;
f.linpre=MAX_ORDER;f.rinpre=MAX_ORDER;f.lstep=MAX_ORDER;f.rstep=MAX_ORDER;f.lout=MAX_ORDER;f.rout=MAX_ORDER;na.fill(f.B,0);return INIT_GAIN_ANALYSIS_OK};this.AnalyzeSamples=function(f,b,v,a,m,u,e){if(0==u)return GAIN_ANALYSIS_OK;var l=0;var d=u;switch(e){case 1:a=b;m=v;break;case 2:break;default:return GAIN_ANALYSIS_ERROR}u<MAX_ORDER?(T.arraycopy(b,v,f.linprebuf,MAX_ORDER,u),T.arraycopy(a,m,f.rinprebuf,MAX_ORDER,u)):(T.arraycopy(b,v,f.linprebuf,MAX_ORDER,MAX_ORDER),T.arraycopy(a,m,f.rinprebuf,MAX_ORDER,
MAX_ORDER));for(;0<d;){var g=d>f.sampleWindow-f.totsamp?f.sampleWindow-f.totsamp:d;if(l<MAX_ORDER){e=f.linpre+l;var q=f.linprebuf;var D=f.rinpre+l;var p=f.rinprebuf;g>MAX_ORDER-l&&(g=MAX_ORDER-l)}else e=v+l,q=b,D=m+l,p=a;c(q,e,f.lstepbuf,f.lstep+f.totsamp,g,B[f.reqindex]);c(p,D,f.rstepbuf,f.rstep+f.totsamp,g,B[f.reqindex]);k(f.lstepbuf,f.lstep+f.totsamp,f.loutbuf,f.lout+f.totsamp,g,w[f.reqindex]);k(f.rstepbuf,f.rstep+f.totsamp,f.routbuf,f.rout+f.totsamp,g,w[f.reqindex]);e=f.lout+f.totsamp;q=f.loutbuf;
D=f.rout+f.totsamp;p=f.routbuf;for(var r=g%8;0!=r--;)f.lsum+=n(q[e++]),f.rsum+=n(p[D++]);for(r=g/8;0!=r--;)f.lsum+=n(q[e+0])+n(q[e+1])+n(q[e+2])+n(q[e+3])+n(q[e+4])+n(q[e+5])+n(q[e+6])+n(q[e+7]),e+=8,f.rsum+=n(p[D+0])+n(p[D+1])+n(p[D+2])+n(p[D+3])+n(p[D+4])+n(p[D+5])+n(p[D+6])+n(p[D+7]),D+=8;d-=g;l+=g;f.totsamp+=g;f.totsamp==f.sampleWindow&&(e=10*Y.STEPS_per_dB*Math.log10((f.lsum+f.rsum)/f.totsamp*.5+1E-37),e=0>=e?0:0|e,e>=f.A.length&&(e=f.A.length-1),f.A[e]++,f.lsum=f.rsum=0,T.arraycopy(f.loutbuf,
f.totsamp,f.loutbuf,0,MAX_ORDER),T.arraycopy(f.routbuf,f.totsamp,f.routbuf,0,MAX_ORDER),T.arraycopy(f.lstepbuf,f.totsamp,f.lstepbuf,0,MAX_ORDER),T.arraycopy(f.rstepbuf,f.totsamp,f.rstepbuf,0,MAX_ORDER),f.totsamp=0);if(f.totsamp>f.sampleWindow)return GAIN_ANALYSIS_ERROR}u<MAX_ORDER?(T.arraycopy(f.linprebuf,u,f.linprebuf,0,MAX_ORDER-u),T.arraycopy(f.rinprebuf,u,f.rinprebuf,0,MAX_ORDER-u),T.arraycopy(b,v,f.linprebuf,MAX_ORDER-u,u),T.arraycopy(a,m,f.rinprebuf,MAX_ORDER-u,u)):(T.arraycopy(b,v+u-MAX_ORDER,
f.linprebuf,0,MAX_ORDER),T.arraycopy(a,m+u-MAX_ORDER,f.rinprebuf,0,MAX_ORDER));return GAIN_ANALYSIS_OK};this.GetTitleGain=function(f){var b=f.A;var c=f.A.length,a,m=0;for(a=0;a<c;a++)m+=b[a];if(0==m)b=GAIN_NOT_ENOUGH_SAMPLES;else{m=0|Math.ceil(m*(1-.95));for(a=c;0<a--&&!(0>=(m-=b[a])););b=64.82-a/Y.STEPS_per_dB}for(c=0;c<f.A.length;c++)f.B[c]+=f.A[c],f.A[c]=0;for(c=0;c<MAX_ORDER;c++)f.linprebuf[c]=f.lstepbuf[c]=f.loutbuf[c]=f.rinprebuf[c]=f.rstepbuf[c]=f.routbuf[c]=0;f.totsamp=0;f.lsum=f.rsum=0;return b}}
function wc(){function c(b,c,a,f,k,e,l,d,g,q,D,p,r,t,J){this.vbr_q=b;this.quant_comp=c;this.quant_comp_s=a;this.expY=f;this.st_lrm=k;this.st_s=e;this.masking_adj=l;this.masking_adj_short=d;this.ath_lower=g;this.ath_curve=q;this.ath_sensitivity=D;this.interch=p;this.safejoint=r;this.sfb21mod=t;this.msfix=J}function k(b,c,a,f,k,e,l,d,g,q,D,p,r,t){this.quant_comp=c;this.quant_comp_s=a;this.safejoint=f;this.nsmsfix=k;this.st_lrm=e;this.st_s=l;this.nsbass=d;this.scale=g;this.masking_adj=q;this.ath_lower=
D;this.ath_curve=p;this.interch=r;this.sfscale=t}function n(b,c,a){var f=b.VBR==G.vbr_rh?B:w,k=b.VBR_q_frac,e=f[c];f=f[c+1];e.st_lrm+=k*(f.st_lrm-e.st_lrm);e.st_s+=k*(f.st_s-e.st_s);e.masking_adj+=k*(f.masking_adj-e.masking_adj);e.masking_adj_short+=k*(f.masking_adj_short-e.masking_adj_short);e.ath_lower+=k*(f.ath_lower-e.ath_lower);e.ath_curve+=k*(f.ath_curve-e.ath_curve);e.ath_sensitivity+=k*(f.ath_sensitivity-e.ath_sensitivity);e.interch+=k*(f.interch-e.interch);e.msfix+=k*(f.msfix-e.msfix);f=
e.vbr_q;0>f&&(f=0);9<f&&(f=9);b.VBR_q=f;b.VBR_q_frac=0;0!=a?b.quant_comp=e.quant_comp:0<Math.abs(b.quant_comp- -1)||(b.quant_comp=e.quant_comp);0!=a?b.quant_comp_short=e.quant_comp_s:0<Math.abs(b.quant_comp_short- -1)||(b.quant_comp_short=e.quant_comp_s);0!=e.expY&&(b.experimentalY=0!=e.expY);0!=a?b.internal_flags.nsPsy.attackthre=e.st_lrm:0<Math.abs(b.internal_flags.nsPsy.attackthre- -1)||(b.internal_flags.nsPsy.attackthre=e.st_lrm);0!=a?b.internal_flags.nsPsy.attackthre_s=e.st_s:0<Math.abs(b.internal_flags.nsPsy.attackthre_s-
-1)||(b.internal_flags.nsPsy.attackthre_s=e.st_s);0!=a?b.maskingadjust=e.masking_adj:0<Math.abs(b.maskingadjust-0)||(b.maskingadjust=e.masking_adj);0!=a?b.maskingadjust_short=e.masking_adj_short:0<Math.abs(b.maskingadjust_short-0)||(b.maskingadjust_short=e.masking_adj_short);0!=a?b.ATHlower=-e.ath_lower/10:0<Math.abs(10*-b.ATHlower)||(b.ATHlower=-e.ath_lower/10);0!=a?b.ATHcurve=e.ath_curve:0<Math.abs(b.ATHcurve- -1)||(b.ATHcurve=e.ath_curve);0!=a?b.athaa_sensitivity=e.ath_sensitivity:0<Math.abs(b.athaa_sensitivity-
-1)||(b.athaa_sensitivity=e.ath_sensitivity);0<e.interch&&(0!=a?b.interChRatio=e.interch:0<Math.abs(b.interChRatio- -1)||(b.interChRatio=e.interch));0<e.safejoint&&(b.exp_nspsytune|=e.safejoint);0<e.sfb21mod&&(b.exp_nspsytune|=e.sfb21mod<<20);0!=a?b.msfix=e.msfix:0<Math.abs(b.msfix- -1)||(b.msfix=e.msfix);0==a&&(b.VBR_q=c,b.VBR_q_frac=k)}function V(b,c,a){var m=E.nearestBitrateFullIndex(c);b.VBR=G.vbr_abr;b.VBR_mean_bitrate_kbps=c;b.VBR_mean_bitrate_kbps=Math.min(b.VBR_mean_bitrate_kbps,320);b.VBR_mean_bitrate_kbps=
Math.max(b.VBR_mean_bitrate_kbps,8);b.brate=b.VBR_mean_bitrate_kbps;320<b.VBR_mean_bitrate_kbps&&(b.disable_reservoir=!0);0<f[m].safejoint&&(b.exp_nspsytune|=2);0<f[m].sfscale&&(b.internal_flags.noise_shaping=2);if(0<Math.abs(f[m].nsbass)){var k=int(4*f[m].nsbass);0>k&&(k+=64);b.exp_nspsytune|=k<<2}0!=a?b.quant_comp=f[m].quant_comp:0<Math.abs(b.quant_comp- -1)||(b.quant_comp=f[m].quant_comp);0!=a?b.quant_comp_short=f[m].quant_comp_s:0<Math.abs(b.quant_comp_short- -1)||(b.quant_comp_short=f[m].quant_comp_s);
0!=a?b.msfix=f[m].nsmsfix:0<Math.abs(b.msfix- -1)||(b.msfix=f[m].nsmsfix);0!=a?b.internal_flags.nsPsy.attackthre=f[m].st_lrm:0<Math.abs(b.internal_flags.nsPsy.attackthre- -1)||(b.internal_flags.nsPsy.attackthre=f[m].st_lrm);0!=a?b.internal_flags.nsPsy.attackthre_s=f[m].st_s:0<Math.abs(b.internal_flags.nsPsy.attackthre_s- -1)||(b.internal_flags.nsPsy.attackthre_s=f[m].st_s);0!=a?b.scale=f[m].scale:0<Math.abs(b.scale- -1)||(b.scale=f[m].scale);0!=a?b.maskingadjust=f[m].masking_adj:0<Math.abs(b.maskingadjust-
0)||(b.maskingadjust=f[m].masking_adj);0<f[m].masking_adj?0!=a?b.maskingadjust_short=.9*f[m].masking_adj:0<Math.abs(b.maskingadjust_short-0)||(b.maskingadjust_short=.9*f[m].masking_adj):0!=a?b.maskingadjust_short=1.1*f[m].masking_adj:0<Math.abs(b.maskingadjust_short-0)||(b.maskingadjust_short=1.1*f[m].masking_adj);0!=a?b.ATHlower=-f[m].ath_lower/10:0<Math.abs(10*-b.ATHlower)||(b.ATHlower=-f[m].ath_lower/10);0!=a?b.ATHcurve=f[m].ath_curve:0<Math.abs(b.ATHcurve- -1)||(b.ATHcurve=f[m].ath_curve);0!=
a?b.interChRatio=f[m].interch:0<Math.abs(b.interChRatio- -1)||(b.interChRatio=f[m].interch);return c}var E;this.setModules=function(b){E=b};var B=[new c(0,9,9,0,5.2,125,-4.2,-6.3,4.8,1,0,0,2,21,.97),new c(1,9,9,0,5.3,125,-3.6,-5.6,4.5,1.5,0,0,2,21,1.35),new c(2,9,9,0,5.6,125,-2.2,-3.5,2.8,2,0,0,2,21,1.49),new c(3,9,9,1,5.8,130,-1.8,-2.8,2.6,3,-4,0,2,20,1.64),new c(4,9,9,1,6,135,-.7,-1.1,1.1,3.5,-8,0,2,0,1.79),new c(5,9,9,1,6.4,140,.5,.4,-7.5,4,-12,2E-4,0,0,1.95),new c(6,9,9,1,6.6,145,.67,.65,-14.7,
6.5,-19,4E-4,0,0,2.3),new c(7,9,9,1,6.6,145,.8,.75,-19.7,8,-22,6E-4,0,0,2.7),new c(8,9,9,1,6.6,145,1.2,1.15,-27.5,10,-23,7E-4,0,0,0),new c(9,9,9,1,6.6,145,1.6,1.6,-36,11,-25,8E-4,0,0,0),new c(10,9,9,1,6.6,145,2,2,-36,12,-25,8E-4,0,0,0)],w=[new c(0,9,9,0,4.2,25,-7,-4,7.5,1,0,0,2,26,.97),new c(1,9,9,0,4.2,25,-5.6,-3.6,4.5,1.5,0,0,2,21,1.35),new c(2,9,9,0,4.2,25,-4.4,-1.8,2,2,0,0,2,18,1.49),new c(3,9,9,1,4.2,25,-3.4,-1.25,1.1,3,-4,0,2,15,1.64),new c(4,9,9,1,4.2,25,-2.2,.1,0,3.5,-8,0,2,0,1.79),new c(5,
9,9,1,4.2,25,-1,1.65,-7.7,4,-12,2E-4,0,0,1.95),new c(6,9,9,1,4.2,25,-0,2.47,-7.7,6.5,-19,4E-4,0,0,2),new c(7,9,9,1,4.2,25,.5,2,-14.5,8,-22,6E-4,0,0,2),new c(8,9,9,1,4.2,25,1,2.4,-22,10,-23,7E-4,0,0,2),new c(9,9,9,1,4.2,25,1.5,2.95,-30,11,-25,8E-4,0,0,2),new c(10,9,9,1,4.2,25,2,2.95,-36,12,-30,8E-4,0,0,2)],f=[new k(8,9,9,0,0,6.6,145,0,.95,0,-30,11,.0012,1),new k(16,9,9,0,0,6.6,145,0,.95,0,-25,11,.001,1),new k(24,9,9,0,0,6.6,145,0,.95,0,-20,11,.001,1),new k(32,9,9,0,0,6.6,145,0,.95,0,-15,11,.001,1),
new k(40,9,9,0,0,6.6,145,0,.95,0,-10,11,9E-4,1),new k(48,9,9,0,0,6.6,145,0,.95,0,-10,11,9E-4,1),new k(56,9,9,0,0,6.6,145,0,.95,0,-6,11,8E-4,1),new k(64,9,9,0,0,6.6,145,0,.95,0,-2,11,8E-4,1),new k(80,9,9,0,0,6.6,145,0,.95,0,0,8,7E-4,1),new k(96,9,9,0,2.5,6.6,145,0,.95,0,1,5.5,6E-4,1),new k(112,9,9,0,2.25,6.6,145,0,.95,0,2,4.5,5E-4,1),new k(128,9,9,0,1.95,6.4,140,0,.95,0,3,4,2E-4,1),new k(160,9,9,1,1.79,6,135,0,.95,-2,5,3.5,0,1),new k(192,9,9,1,1.49,5.6,125,0,.97,-4,7,3,0,0),new k(224,9,9,1,1.25,5.2,
125,0,.98,-6,9,2,0,0),new k(256,9,9,1,.97,5.2,125,0,1,-8,10,1,0,0),new k(320,9,9,1,.9,5.2,125,0,1,-10,12,0,0,0)];this.apply_preset=function(b,c,a){switch(c){case W.R3MIX:c=W.V3;b.VBR=G.vbr_mtrh;break;case W.MEDIUM:c=W.V4;b.VBR=G.vbr_rh;break;case W.MEDIUM_FAST:c=W.V4;b.VBR=G.vbr_mtrh;break;case W.STANDARD:c=W.V2;b.VBR=G.vbr_rh;break;case W.STANDARD_FAST:c=W.V2;b.VBR=G.vbr_mtrh;break;case W.EXTREME:c=W.V0;b.VBR=G.vbr_rh;break;case W.EXTREME_FAST:c=W.V0;b.VBR=G.vbr_mtrh;break;case W.INSANE:return c=
320,b.preset=c,V(b,c,a),b.VBR=G.vbr_off,c}b.preset=c;switch(c){case W.V9:return n(b,9,a),c;case W.V8:return n(b,8,a),c;case W.V7:return n(b,7,a),c;case W.V6:return n(b,6,a),c;case W.V5:return n(b,5,a),c;case W.V4:return n(b,4,a),c;case W.V3:return n(b,3,a),c;case W.V2:return n(b,2,a),c;case W.V1:return n(b,1,a),c;case W.V0:return n(b,0,a),c}if(8<=c&&320>=c)return V(b,c,a);b.preset=0;return c}}function qb(){function u(a){this.bits=0|a}function k(a,d,p,b,e,c){d=.5946/d;for(a>>=1;0!=a--;)e[c++]=d>p[b++]?
0:1,e[c++]=d>p[b++]?0:1}function n(a,d,b,e,c,l){a>>=1;var h=a%2;for(a>>=1;0!=a--;){var p=b[e++]*d;var r=b[e++]*d;var t=0|p;var f=b[e++]*d;var g=0|r;var J=b[e++]*d;var D=0|f;p+=B.adj43[t];t=0|J;r+=B.adj43[g];c[l++]=0|p;f+=B.adj43[D];c[l++]=0|r;J+=B.adj43[t];c[l++]=0|f;c[l++]=0|J}0!=h&&(p=b[e++]*d,r=b[e++]*d,p+=B.adj43[0|p],r+=B.adj43[0|r],c[l++]=0|p,c[l++]=0|r)}function V(a,d,b,e){var p,c=d,h=p=0;do{var r=a[c++],l=a[c++];p<r&&(p=r);h<l&&(h=l)}while(c<b);p<h&&(p=h);switch(p){case 0:return p;case 1:c=
d;d=0;p=w.ht[1].hlen;do h=2*a[c+0]+a[c+1],c+=2,d+=p[h];while(c<b);e.bits+=d;return 1;case 2:case 3:c=d;d=f[p-1];p=0;h=w.ht[d].xlen;r=2==d?w.table23:w.table56;do l=a[c+0]*h+a[c+1],c+=2,p+=r[l];while(c<b);a=p&65535;p>>=16;p>a&&(p=a,d++);e.bits+=p;return d;case 4:case 5:case 6:case 7:case 8:case 9:case 10:case 11:case 12:case 13:case 14:case 15:c=d;d=f[p-1];r=h=p=0;l=w.ht[d].xlen;var g=w.ht[d].hlen,D=w.ht[d+1].hlen,q=w.ht[d+2].hlen;do{var m=a[c+0]*l+a[c+1];c+=2;p+=g[m];h+=D[m];r+=q[m]}while(c<b);a=d;
p>h&&(p=h,a++);p>r&&(p=r,a=d+2);e.bits+=p;return a;default:if(p>ia.IXMAX_VAL)return e.bits=ia.LARGE_BITS,-1;p-=15;for(c=24;32>c&&!(w.ht[c].linmax>=p);c++);for(h=c-8;24>h&&!(w.ht[h].linmax>=p);h++);p=h;r=65536*w.ht[p].xlen+w.ht[c].xlen;h=0;do l=a[d++],g=a[d++],0!=l&&(14<l&&(l=15,h+=r),l*=16),0!=g&&(14<g&&(g=15,h+=r),l+=g),h+=w.largetbl[l];while(d<b);a=h&65535;h>>=16;h>a&&(h=a,p=c);e.bits+=h;return p}}function E(a,d,p,b,e,l,h,g){for(var r=d.big_values,f=2;f<c.SBMAX_l+1;f++){var x=a.scalefac_band.l[f];
if(x>=r)break;var t=e[f-2]+d.count1bits;if(p.part2_3_length<=t)break;t=new u(t);x=V(b,x,r,t);t=t.bits;p.part2_3_length<=t||(p.assign(d),p.part2_3_length=t,p.region0_count=l[f-2],p.region1_count=f-2-l[f-2],p.table_select[0]=h[f-2],p.table_select[1]=g[f-2],p.table_select[2]=x)}}var B=null;this.qupvt=null;this.setModules=function(a){B=this.qupvt=a};var ha=[[0,0],[0,0],[0,0],[0,0],[0,0],[0,1],[1,1],[1,1],[1,2],[2,2],[2,3],[2,3],[3,4],[3,4],[3,4],[4,5],[4,5],[4,6],[5,6],[5,6],[5,7],[6,7],[6,7]],f=[1,2,
5,7,7,10,10,13,13,13,13,13,13,13,13];this.noquant_count_bits=function(a,d,p){var b=d.l3_enc,e=Math.min(576,d.max_nonzero_coeff+2>>1<<1);null!=p&&(p.sfb_count1=0);for(;1<e&&0==(b[e-1]|b[e-2]);e-=2);d.count1=e;for(var l=0,h=0;3<e&&!(1<((b[e-1]|b[e-2]|b[e-3]|b[e-4])&2147483647));e-=4){var f=2*(2*(2*b[e-4]+b[e-3])+b[e-2])+b[e-1];l+=w.t32l[f];h+=w.t33l[f]}f=l;d.count1table_select=0;l>h&&(f=h,d.count1table_select=1);d.count1bits=f;d.big_values=e;if(0==e)return f;d.block_type==c.SHORT_TYPE?(l=3*a.scalefac_band.s[3],
l>d.big_values&&(l=d.big_values),h=d.big_values):d.block_type==c.NORM_TYPE?(l=d.region0_count=a.bv_scf[e-2],h=d.region1_count=a.bv_scf[e-1],h=a.scalefac_band.l[l+h+2],l=a.scalefac_band.l[l+1],h<e&&(f=new u(f),d.table_select[2]=V(b,h,e,f),f=f.bits)):(d.region0_count=7,d.region1_count=c.SBMAX_l-1-7-1,l=a.scalefac_band.l[8],h=e,l>h&&(l=h));l=Math.min(l,e);h=Math.min(h,e);0<l&&(f=new u(f),d.table_select[0]=V(b,0,l,f),f=f.bits);l<h&&(f=new u(f),d.table_select[1]=V(b,l,h,f),f=f.bits);2==a.use_best_huffman&&
(d.part2_3_length=f,best_huffman_divide(a,d),f=d.part2_3_length);if(null!=p&&d.block_type==c.NORM_TYPE){for(b=0;a.scalefac_band.l[b]<d.big_values;)b++;p.sfb_count1=b}return f};this.count_bits=function(a,d,e,b){var p=e.l3_enc,l=ia.IXMAX_VAL/B.IPOW20(e.global_gain);if(e.xrpow_max>l)return ia.LARGE_BITS;l=B.IPOW20(e.global_gain);var h,f=0,g=0,r=0,D=0,m=0,q=p,v=0,C=d,I=0;var Q=null!=b&&e.global_gain==b.global_gain;var S=e.block_type==c.SHORT_TYPE?38:21;for(h=0;h<=S;h++){var u=-1;if(Q||e.block_type==c.NORM_TYPE)u=
e.global_gain-(e.scalefac[h]+(0!=e.preflag?B.pretab[h]:0)<<e.scalefac_scale+1)-8*e.subblock_gain[e.window[h]];if(Q&&b.step[h]==u)0!=g&&(n(g,l,C,I,q,v),g=0),0!=r&&(k(r,l,C,I,q,v),r=0);else{var Z=e.width[h];f+e.width[h]>e.max_nonzero_coeff&&(h=e.max_nonzero_coeff-f+1,na.fill(p,e.max_nonzero_coeff,576,0),Z=h,0>Z&&(Z=0),h=S+1);0==g&&0==r&&(q=p,v=m,C=d,I=D);null!=b&&0<b.sfb_count1&&h>=b.sfb_count1&&0<b.step[h]&&u>=b.step[h]?(0!=g&&(n(g,l,C,I,q,v),g=0,q=p,v=m,C=d,I=D),r+=Z):(0!=r&&(k(r,l,C,I,q,v),r=0,q=
p,v=m,C=d,I=D),g+=Z);if(0>=Z){0!=r&&(k(r,l,C,I,q,v),r=0);0!=g&&(n(g,l,C,I,q,v),g=0);break}}h<=S&&(m+=e.width[h],D+=e.width[h],f+=e.width[h])}0!=g&&n(g,l,C,I,q,v);0!=r&&k(r,l,C,I,q,v);if(0!=(a.substep_shaping&2))for(l=0,S=.634521682242439/B.IPOW20(e.global_gain+e.scalefac_scale),f=0;f<e.sfbmax;f++)if(Q=e.width[f],0==a.pseudohalf[f])l+=Q;else for(g=l,l+=Q;g<l;++g)p[g]=d[g]>=S?p[g]:0;return this.noquant_count_bits(a,e,b)};this.best_huffman_divide=function(a,d){var e=new rb,b=d.l3_enc,l=X(23),f=X(23),
h=X(23),g=X(23);if(d.block_type!=c.SHORT_TYPE||1!=a.mode_gr){e.assign(d);if(d.block_type==c.NORM_TYPE){for(var y=d.big_values,m=0;22>=m;m++)l[m]=ia.LARGE_BITS;for(m=0;16>m;m++){var D=a.scalefac_band.l[m+1];if(D>=y)break;var q=0,k=new u(q),v=V(b,0,D,k);q=k.bits;for(var C=0;8>C;C++){var I=a.scalefac_band.l[m+C+2];if(I>=y)break;k=q;k=new u(k);I=V(b,D,I,k);k=k.bits;l[m+C]>k&&(l[m+C]=k,f[m+C]=m,h[m+C]=v,g[m+C]=I)}}E(a,e,d,b,l,f,h,g)}y=e.big_values;if(!(0==y||1<(b[y-2]|b[y-1])||(y=d.count1+2,576<y))){e.assign(d);
e.count1=y;for(D=m=0;y>e.big_values;y-=4)q=2*(2*(2*b[y-4]+b[y-3])+b[y-2])+b[y-1],m+=w.t32l[q],D+=w.t33l[q];e.big_values=y;e.count1table_select=0;m>D&&(m=D,e.count1table_select=1);e.count1bits=m;e.block_type==c.NORM_TYPE?E(a,e,d,b,l,f,h,g):(e.part2_3_length=m,m=a.scalefac_band.l[8],m>y&&(m=y),0<m&&(a=new u(e.part2_3_length),e.table_select[0]=V(b,0,m,a),e.part2_3_length=a.bits),y>m&&(a=new u(e.part2_3_length),e.table_select[1]=V(b,m,y,a),e.part2_3_length=a.bits),d.part2_3_length>e.part2_3_length&&d.assign(e))}}};
var b=[1,1,1,1,8,2,2,2,4,4,4,8,8,8,16,16],v=[1,2,4,8,1,2,4,8,2,4,8,2,4,8,4,8],a=[0,0,0,0,3,1,1,1,2,2,2,3,3,3,4,4],m=[0,1,2,3,0,1,2,3,1,2,3,1,2,3,2,3];qb.slen1_tab=a;qb.slen2_tab=m;this.best_scalefac_store=function(d,e,p,l){var f=l.tt[e][p],g,h,r=0;for(g=h=0;g<f.sfbmax;g++){var y=f.width[g];h+=y;for(y=-y;0>y&&0==f.l3_enc[y+h];y++);0==y&&(f.scalefac[g]=r=-2)}if(0==f.scalefac_scale&&0==f.preflag){for(g=h=0;g<f.sfbmax;g++)0<f.scalefac[g]&&(h|=f.scalefac[g]);if(0==(h&1)&&0!=h){for(g=0;g<f.sfbmax;g++)0<
f.scalefac[g]&&(f.scalefac[g]>>=1);f.scalefac_scale=r=1}}if(0==f.preflag&&f.block_type!=c.SHORT_TYPE&&2==d.mode_gr){for(g=11;g<c.SBPSY_l&&!(f.scalefac[g]<B.pretab[g]&&-2!=f.scalefac[g]);g++);if(g==c.SBPSY_l){for(g=11;g<c.SBPSY_l;g++)0<f.scalefac[g]&&(f.scalefac[g]-=B.pretab[g]);f.preflag=r=1}}for(g=0;4>g;g++)l.scfsi[p][g]=0;if(2==d.mode_gr&&1==e&&l.tt[0][p].block_type!=c.SHORT_TYPE&&l.tt[1][p].block_type!=c.SHORT_TYPE){e=l.tt[1][p];h=l.tt[0][p];for(r=0;r<w.scfsi_band.length-1;r++){for(g=w.scfsi_band[r];g<
w.scfsi_band[r+1]&&!(h.scalefac[g]!=e.scalefac[g]&&0<=e.scalefac[g]);g++);if(g==w.scfsi_band[r+1]){for(g=w.scfsi_band[r];g<w.scfsi_band[r+1];g++)e.scalefac[g]=-1;l.scfsi[p][r]=1}}for(g=l=p=0;11>g;g++)-1!=e.scalefac[g]&&(l++,p<e.scalefac[g]&&(p=e.scalefac[g]));for(y=h=0;g<c.SBPSY_l;g++)-1!=e.scalefac[g]&&(y++,h<e.scalefac[g]&&(h=e.scalefac[g]));for(r=0;16>r;r++)p<b[r]&&h<v[r]&&(g=a[r]*l+m[r]*y,e.part2_length>g&&(e.part2_length=g,e.scalefac_compress=r));r=0}for(g=0;g<f.sfbmax;g++)-2==f.scalefac[g]&&
(f.scalefac[g]=0);0!=r&&(2==d.mode_gr?this.scale_bitcount(f):this.scale_bitcount_lsf(d,f))};var z=[0,18,36,54,54,36,54,72,54,72,90,72,90,108,108,126],e=[0,18,36,54,51,35,53,71,52,70,88,69,87,105,104,122],l=[0,10,20,30,33,21,31,41,32,42,52,43,53,63,64,74];this.scale_bitcount=function(a){var d,g=0,f=0,t=a.scalefac;if(a.block_type==c.SHORT_TYPE){var m=z;0!=a.mixed_block_flag&&(m=e)}else if(m=l,0==a.preflag){for(d=11;d<c.SBPSY_l&&!(t[d]<B.pretab[d]);d++);if(d==c.SBPSY_l)for(a.preflag=1,d=11;d<c.SBPSY_l;d++)t[d]-=
B.pretab[d]}for(d=0;d<a.sfbdivide;d++)g<t[d]&&(g=t[d]);for(;d<a.sfbmax;d++)f<t[d]&&(f=t[d]);a.part2_length=ia.LARGE_BITS;for(d=0;16>d;d++)g<b[d]&&f<v[d]&&a.part2_length>m[d]&&(a.part2_length=m[d],a.scalefac_compress=d);return a.part2_length==ia.LARGE_BITS};var d=[[15,15,7,7],[15,15,7,0],[7,3,0,0],[15,31,31,0],[7,7,7,0],[3,3,0,0]];this.scale_bitcount_lsf=function(a,e){var b,f,l,m,h=X(4),x=e.scalefac;a=0!=e.preflag?2:0;for(l=0;4>l;l++)h[l]=0;if(e.block_type==c.SHORT_TYPE){var y=1;var k=B.nr_of_sfb_block[a][y];
for(b=m=0;4>b;b++){var q=k[b]/3;for(l=0;l<q;l++,m++)for(f=0;3>f;f++)x[3*m+f]>h[b]&&(h[b]=x[3*m+f])}}else for(y=0,k=B.nr_of_sfb_block[a][y],b=m=0;4>b;b++)for(q=k[b],l=0;l<q;l++,m++)x[m]>h[b]&&(h[b]=x[m]);q=!1;for(b=0;4>b;b++)h[b]>d[a][b]&&(q=!0);if(!q){e.sfb_partition_table=B.nr_of_sfb_block[a][y];for(b=0;4>b;b++)e.slen[b]=g[h[b]];y=e.slen[0];b=e.slen[1];h=e.slen[2];f=e.slen[3];switch(a){case 0:e.scalefac_compress=(5*y+b<<4)+(h<<2)+f;break;case 1:e.scalefac_compress=400+(5*y+b<<2)+h;break;case 2:e.scalefac_compress=
500+3*y+b;break;default:T.err.printf("intensity stereo not implemented yet\n")}}if(!q)for(b=e.part2_length=0;4>b;b++)e.part2_length+=e.slen[b]*e.sfb_partition_table[b];return q};var g=[0,1,2,2,3,3,3,3,4,4,4,4,4,4,4,4];this.huffman_init=function(a){for(var d=2;576>=d;d+=2){for(var e=0,b;a.scalefac_band.l[++e]<d;);for(b=ha[e][0];a.scalefac_band.l[b+1]>d;)b--;0>b&&(b=ha[e][0]);a.bv_scf[d-2]=b;for(b=ha[e][1];a.scalefac_band.l[b+a.bv_scf[d-2]+2]>d;)b--;0>b&&(b=ha[e][1]);a.bv_scf[d-1]=b}}}function xc(){var c;
this.setModules=function(k){c=k};this.ResvFrameBegin=function(k,n){var u=k.internal_flags,E=u.l3_side,B=c.getframebits(k);n.bits=(B-8*u.sideinfo_len)/u.mode_gr;var w=2048*u.mode_gr-8;if(320<k.brate)var f=8*int(1E3*k.brate/(k.out_samplerate/1152)/8+.5);else f=11520,k.strict_ISO&&(f=8*int(32E4/(k.out_samplerate/1152)/8+.5));u.ResvMax=f-B;u.ResvMax>w&&(u.ResvMax=w);if(0>u.ResvMax||k.disable_reservoir)u.ResvMax=0;k=n.bits*u.mode_gr+Math.min(u.ResvSize,u.ResvMax);k>f&&(k=f);E.resvDrain_pre=0;null!=u.pinfo&&
(u.pinfo.mean_bits=n.bits/2,u.pinfo.resvsize=u.ResvSize);return k};this.ResvMaxBits=function(c,n,u,E){var k=c.internal_flags,w=k.ResvSize,f=k.ResvMax;0!=E&&(w+=n);0!=(k.substep_shaping&1)&&(f*=.9);u.bits=n;10*w>9*f?(E=w-9*f/10,u.bits+=E,k.substep_shaping|=128):(E=0,k.substep_shaping&=127,c.disable_reservoir||0!=(k.substep_shaping&1)||(u.bits-=.1*n));c=w<6*k.ResvMax/10?w:6*k.ResvMax/10;c-=E;0>c&&(c=0);return c};this.ResvAdjust=function(c,n){c.ResvSize-=n.part2_3_length+n.part2_length};this.ResvFrameEnd=
function(c,n){var k,u=c.l3_side;c.ResvSize+=n*c.mode_gr;n=0;u.resvDrain_post=0;u.resvDrain_pre=0;0!=(k=c.ResvSize%8)&&(n+=k);k=c.ResvSize-n-c.ResvMax;0<k&&(n+=k);k=Math.min(8*u.main_data_begin,n)/8;u.resvDrain_pre+=8*k;n-=8*k;c.ResvSize-=8*k;u.main_data_begin-=k;u.resvDrain_post+=n;c.ResvSize-=n}}function qa(){function u(a,e,b){for(;0<b;){if(0==D){D=8;q++;if(a.header[a.w_ptr].write_timing==g){var c=a;T.arraycopy(c.header[c.w_ptr].buf,0,d,q,c.sideinfo_len);q+=c.sideinfo_len;g+=8*c.sideinfo_len;c.w_ptr=
c.w_ptr+1&da.MAX_HEADER_BUF-1}d[q]=0}c=Math.min(b,D);b-=c;D-=c;d[q]|=e>>b<<D;g+=c}}function k(a,d){var b=a.internal_flags,c;8<=d&&(u(b,76,8),d-=8);8<=d&&(u(b,65,8),d-=8);8<=d&&(u(b,77,8),d-=8);8<=d&&(u(b,69,8),d-=8);if(32<=d){var h=e.getLameShortVersion();if(32<=d)for(c=0;c<h.length&&8<=d;++c)d-=8,u(b,h.charAt(c),8)}for(;1<=d;--d)u(b,b.ancillary_flag,1),b.ancillary_flag^=a.disable_reservoir?0:1}function n(a,d,e){for(var b=a.header[a.h_ptr].ptr;0<e;){var h=Math.min(e,8-(b&7));e-=h;a.header[a.h_ptr].buf[b>>
3]|=d>>e<<8-(b&7)-h;b+=h}a.header[a.h_ptr].ptr=b}function V(a,d){a<<=8;for(var e=0;8>e;e++)a<<=1,d<<=1,0!=((d^a)&65536)&&(d^=32773);return d}function E(a,d){var e=w.ht[d.count1table_select+32],b,h=0,c=d.big_values,g=d.big_values;for(b=(d.count1-d.big_values)/4;0<b;--b){var l=0,f=0;var p=d.l3_enc[c+0];0!=p&&(f+=8,0>d.xr[g+0]&&l++);p=d.l3_enc[c+1];0!=p&&(f+=4,l*=2,0>d.xr[g+1]&&l++);p=d.l3_enc[c+2];0!=p&&(f+=2,l*=2,0>d.xr[g+2]&&l++);p=d.l3_enc[c+3];0!=p&&(f++,l*=2,0>d.xr[g+3]&&l++);c+=4;g+=4;u(a,l+e.table[f],
e.hlen[f]);h+=e.hlen[f]}return h}function B(a,d,e,b,h){var c=w.ht[d],g=0;if(0==d)return g;for(;e<b;e+=2){var l=0,f=0,p=c.xlen,r=c.xlen,m=0,C=h.l3_enc[e],k=h.l3_enc[e+1];0!=C&&(0>h.xr[e]&&m++,l--);15<d&&(14<C&&(m|=C-15<<1,f=p,C=15),14<k&&(r=k-15,m<<=p,m|=r,f+=p,k=15),r=16);0!=k&&(m<<=1,0>h.xr[e+1]&&m++,l--);C=C*r+k;f-=l;l+=c.hlen[C];u(a,c.table[C],l);u(a,m,f);g+=l+f}return g}function K(a,d){var e=3*a.scalefac_band.s[3];e>d.big_values&&(e=d.big_values);var b=B(a,d.table_select[0],0,e,d);return b+=B(a,
d.table_select[1],e,d.big_values,d)}function f(a,d){var e=d.big_values;var b=d.region0_count+1;var h=a.scalefac_band.l[b];b+=d.region1_count+1;var c=a.scalefac_band.l[b];h>e&&(h=e);c>e&&(c=e);b=B(a,d.table_select[0],0,h,d);b+=B(a,d.table_select[1],h,c,d);return b+=B(a,d.table_select[2],c,e,d)}function b(){this.total=0}function v(d,e){var b=d.internal_flags;var c=b.w_ptr;var h=b.h_ptr-1;-1==h&&(h=da.MAX_HEADER_BUF-1);var l=b.header[h].write_timing-g;e.total=l;if(0<=l){var f=1+h-c;h<c&&(f=1+h-c+da.MAX_HEADER_BUF);
l-=8*f*b.sideinfo_len}d=a.getframebits(d);l+=d;e.total+=d;e.total=0!=e.total%8?1+e.total/8:e.total/8;e.total+=q+1;0>l&&T.err.println("strange error flushing buffer ... \n");return l}var a=this,m=null,z=null,e=null,l=null;this.setModules=function(a,d,b,c){m=a;z=d;e=b;l=c};var d=null,g=0,q=0,D=0;this.getframebits=function(a){var d=a.internal_flags;return 8*(0|72E3*(a.version+1)*(0!=d.bitrate_index?w.bitrate_table[a.version][d.bitrate_index]:a.brate)/a.out_samplerate+d.padding)};this.CRC_writeheader=
function(a,d){var e=V(d[2]&255,65535);e=V(d[3]&255,e);for(var b=6;b<a.sideinfo_len;b++)e=V(d[b]&255,e);d[4]=byte(e>>8);d[5]=byte(e&255)};this.flush_bitstream=function(a){var d=a.internal_flags,e;var c=d.l3_side;0>(e=v(a,new b))||(k(a,e),d.ResvSize=0,c.main_data_begin=0,d.findReplayGain&&(c=m.GetTitleGain(d.rgdata),d.RadioGain=Math.floor(10*c+.5)|0),d.findPeakSample&&(d.noclipGainChange=Math.ceil(200*Math.log10(d.PeakSample/32767))|0,0<d.noclipGainChange?EQ(a.scale,1)||EQ(a.scale,0)?d.noclipScale=
Math.floor(32767/d.PeakSample*100)/100:d.noclipScale=-1:d.noclipScale=-1))};this.add_dummy_byte=function(a,e,b){a=a.internal_flags;for(var c;0<b--;){c=e;for(var h=8;0<h;){0==D&&(D=8,q++,d[q]=0);var l=Math.min(h,D);h-=l;D-=l;d[q]|=c>>h<<D;g+=l}for(c=0;c<da.MAX_HEADER_BUF;++c)a.header[c].write_timing+=8}};this.format_bitstream=function(a){var d=a.internal_flags;var e=d.l3_side;var l=this.getframebits(a);k(a,e.resvDrain_pre);var h=a.internal_flags,p,y;var m=h.l3_side;h.header[h.h_ptr].ptr=0;na.fill(h.header[h.h_ptr].buf,
0,h.sideinfo_len,0);16E3>a.out_samplerate?n(h,4094,12):n(h,4095,12);n(h,a.version,1);n(h,1,2);n(h,a.error_protection?0:1,1);n(h,h.bitrate_index,4);n(h,h.samplerate_index,2);n(h,h.padding,1);n(h,a.extension,1);n(h,a.mode.ordinal(),2);n(h,h.mode_ext,2);n(h,a.copyright,1);n(h,a.original,1);n(h,a.emphasis,2);a.error_protection&&n(h,0,16);if(1==a.version){n(h,m.main_data_begin,9);2==h.channels_out?n(h,m.private_bits,3):n(h,m.private_bits,5);for(y=0;y<h.channels_out;y++)for(p=0;4>p;p++)n(h,m.scfsi[y][p],
1);for(p=0;2>p;p++)for(y=0;y<h.channels_out;y++){var q=m.tt[p][y];n(h,q.part2_3_length+q.part2_length,12);n(h,q.big_values/2,9);n(h,q.global_gain,8);n(h,q.scalefac_compress,4);q.block_type!=c.NORM_TYPE?(n(h,1,1),n(h,q.block_type,2),n(h,q.mixed_block_flag,1),14==q.table_select[0]&&(q.table_select[0]=16),n(h,q.table_select[0],5),14==q.table_select[1]&&(q.table_select[1]=16),n(h,q.table_select[1],5),n(h,q.subblock_gain[0],3),n(h,q.subblock_gain[1],3),n(h,q.subblock_gain[2],3)):(n(h,0,1),14==q.table_select[0]&&
(q.table_select[0]=16),n(h,q.table_select[0],5),14==q.table_select[1]&&(q.table_select[1]=16),n(h,q.table_select[1],5),14==q.table_select[2]&&(q.table_select[2]=16),n(h,q.table_select[2],5),n(h,q.region0_count,4),n(h,q.region1_count,3));n(h,q.preflag,1);n(h,q.scalefac_scale,1);n(h,q.count1table_select,1)}}else for(n(h,m.main_data_begin,8),n(h,m.private_bits,h.channels_out),y=p=0;y<h.channels_out;y++)q=m.tt[p][y],n(h,q.part2_3_length+q.part2_length,12),n(h,q.big_values/2,9),n(h,q.global_gain,8),n(h,
q.scalefac_compress,9),q.block_type!=c.NORM_TYPE?(n(h,1,1),n(h,q.block_type,2),n(h,q.mixed_block_flag,1),14==q.table_select[0]&&(q.table_select[0]=16),n(h,q.table_select[0],5),14==q.table_select[1]&&(q.table_select[1]=16),n(h,q.table_select[1],5),n(h,q.subblock_gain[0],3),n(h,q.subblock_gain[1],3),n(h,q.subblock_gain[2],3)):(n(h,0,1),14==q.table_select[0]&&(q.table_select[0]=16),n(h,q.table_select[0],5),14==q.table_select[1]&&(q.table_select[1]=16),n(h,q.table_select[1],5),14==q.table_select[2]&&
(q.table_select[2]=16),n(h,q.table_select[2],5),n(h,q.region0_count,4),n(h,q.region1_count,3)),n(h,q.scalefac_scale,1),n(h,q.count1table_select,1);a.error_protection&&CRC_writeheader(h,h.header[h.h_ptr].buf);m=h.h_ptr;h.h_ptr=m+1&da.MAX_HEADER_BUF-1;h.header[h.h_ptr].write_timing=h.header[m].write_timing+l;h.h_ptr==h.w_ptr&&T.err.println("Error: MAX_HEADER_BUF too small in bitstream.c \n");h=8*d.sideinfo_len;var D=0,B=a.internal_flags,z=B.l3_side;if(1==a.version)for(m=0;2>m;m++)for(y=0;y<B.channels_out;y++){var C=
z.tt[m][y],I=qb.slen1_tab[C.scalefac_compress],Q=qb.slen2_tab[C.scalefac_compress];for(p=q=0;p<C.sfbdivide;p++)-1!=C.scalefac[p]&&(u(B,C.scalefac[p],I),q+=I);for(;p<C.sfbmax;p++)-1!=C.scalefac[p]&&(u(B,C.scalefac[p],Q),q+=Q);q=C.block_type==c.SHORT_TYPE?q+K(B,C):q+f(B,C);q+=E(B,C);D+=q}else for(y=m=0;y<B.channels_out;y++){C=z.tt[m][y];var S=0;Q=p=q=0;if(C.block_type==c.SHORT_TYPE){for(;4>Q;Q++){var w=C.sfb_partition_table[Q]/3,Z=C.slen[Q];for(I=0;I<w;I++,p++)u(B,Math.max(C.scalefac[3*p],0),Z),u(B,
Math.max(C.scalefac[3*p+1],0),Z),u(B,Math.max(C.scalefac[3*p+2],0),Z),S+=3*Z}q+=K(B,C)}else{for(;4>Q;Q++)for(w=C.sfb_partition_table[Q],Z=C.slen[Q],I=0;I<w;I++,p++)u(B,Math.max(C.scalefac[p],0),Z),S+=Z;q+=f(B,C)}q+=E(B,C);D+=S+q}h+=D;k(a,e.resvDrain_post);h+=e.resvDrain_post;e.main_data_begin+=(l-h)/8;v(a,new b)!=d.ResvSize&&T.err.println("Internal buffer inconsistency. flushbits <> ResvSize");8*e.main_data_begin!=d.ResvSize&&(T.err.printf("bit reservoir error: \nl3_side.main_data_begin: %d \nResvoir size:             %d \nresv drain (post)         %d \nresv drain (pre)          %d \nheader and sideinfo:      %d \ndata bits:                %d \ntotal bits:               %d (remainder: %d) \nbitsperframe:             %d \n",
8*e.main_data_begin,d.ResvSize,e.resvDrain_post,e.resvDrain_pre,8*d.sideinfo_len,h-e.resvDrain_post-8*d.sideinfo_len,h,h%8,l),T.err.println("This is a fatal error.  It has several possible causes:"),T.err.println("90%%  LAME compiled with buggy version of gcc using advanced optimizations"),T.err.println(" 9%%  Your system is overclocked"),T.err.println(" 1%%  bug in LAME encoding library"),d.ResvSize=8*e.main_data_begin);if(1E9<g){for(a=0;a<da.MAX_HEADER_BUF;++a)d.header[a].write_timing-=g;g=0}return 0};
this.copy_buffer=function(a,e,b,c,h){var g=q+1;if(0>=g)return 0;if(0!=c&&g>c)return-1;T.arraycopy(d,0,e,b,g);q=-1;D=0;if(0!=h&&(c=X(1),c[0]=a.nMusicCRC,l.updateMusicCRC(c,e,b,g),a.nMusicCRC=c[0],0<g&&(a.VBR_seek_table.nBytesWritten+=g),a.decode_on_the_fly)){c=ca([2,1152]);h=g;for(var f=-1,p;0!=f;)if(f=z.hip_decode1_unclipped(a.hip,e,b,h,c[0],c[1]),h=0,-1==f&&(f=0),0<f){if(a.findPeakSample){for(p=0;p<f;p++)c[0][p]>a.PeakSample?a.PeakSample=c[0][p]:-c[0][p]>a.PeakSample&&(a.PeakSample=-c[0][p]);if(1<
a.channels_out)for(p=0;p<f;p++)c[1][p]>a.PeakSample?a.PeakSample=c[1][p]:-c[1][p]>a.PeakSample&&(a.PeakSample=-c[1][p])}if(a.findReplayGain&&m.AnalyzeSamples(a.rgdata,c[0],0,c[1],0,f,a.channels_out)==Y.GAIN_ANALYSIS_ERROR)return-6}}return g};this.init_bit_stream_w=function(a){d=new Int8Array(W.LAME_MAXMP3BUFFER);a.h_ptr=a.w_ptr=0;a.header[a.h_ptr].write_timing=0;q=-1;g=D=0}}function zb(){function c(a,b){var d=a[b+0]&255;d=d<<8|a[b+1]&255;d=d<<8|a[b+2]&255;return d=d<<8|a[b+3]&255}function k(a,b,d){a[b+
0]=d>>24&255;a[b+1]=d>>16&255;a[b+2]=d>>8&255;a[b+3]=d&255}function n(a,b,d){a[b+0]=d>>8&255;a[b+1]=d&255}function V(a,b,d){return 255&(a<<b|d&~(-1<<b))}function E(a,b){var d=a.internal_flags;b[0]=V(b[0],8,255);b[1]=V(b[1],3,7);b[1]=V(b[1],1,16E3>a.out_samplerate?0:1);b[1]=V(b[1],1,a.version);b[1]=V(b[1],2,1);b[1]=V(b[1],1,a.error_protection?0:1);b[2]=V(b[2],4,d.bitrate_index);b[2]=V(b[2],2,d.samplerate_index);b[2]=V(b[2],1,0);b[2]=V(b[2],1,a.extension);b[3]=V(b[3],2,a.mode.ordinal());b[3]=V(b[3],
2,d.mode_ext);b[3]=V(b[3],1,a.copyright);b[3]=V(b[3],1,a.original);b[3]=V(b[3],2,a.emphasis);b[0]=255;d=b[1]&241;var e=1==a.version?128:16E3>a.out_samplerate?32:64;a.VBR==G.vbr_off&&(e=a.brate);e=a.free_format?0:255&16*K.BitrateIndex(e,a.version,a.out_samplerate);b[1]=1==a.version?255&(d|10):255&(d|2);d=b[2]&13;b[2]=255&(e|d)}function B(a,b){return b=b>>8^z[(b^a)&255]}var K,f,b;this.setModules=function(a,c,d){K=a;f=c;b=d};var v=zb.NUMTOCENTRIES,a=zb.MAXFRAMESIZE,m=v+4+4+4+4+4+9+1+1+8+1+1+3+1+1+2+
4+2+2,z=[0,49345,49537,320,49921,960,640,49729,50689,1728,1920,51009,1280,50625,50305,1088,52225,3264,3456,52545,3840,53185,52865,3648,2560,51905,52097,2880,51457,2496,2176,51265,55297,6336,6528,55617,6912,56257,55937,6720,7680,57025,57217,8E3,56577,7616,7296,56385,5120,54465,54657,5440,55041,6080,5760,54849,53761,4800,4992,54081,4352,53697,53377,4160,61441,12480,12672,61761,13056,62401,62081,12864,13824,63169,63361,14144,62721,13760,13440,62529,15360,64705,64897,15680,65281,16320,16E3,65089,64001,
15040,15232,64321,14592,63937,63617,14400,10240,59585,59777,10560,60161,11200,10880,59969,60929,11968,12160,61249,11520,60865,60545,11328,58369,9408,9600,58689,9984,59329,59009,9792,8704,58049,58241,9024,57601,8640,8320,57409,40961,24768,24960,41281,25344,41921,41601,25152,26112,42689,42881,26432,42241,26048,25728,42049,27648,44225,44417,27968,44801,28608,28288,44609,43521,27328,27520,43841,26880,43457,43137,26688,30720,47297,47489,31040,47873,31680,31360,47681,48641,32448,32640,48961,32E3,48577,
48257,31808,46081,29888,30080,46401,30464,47041,46721,30272,29184,45761,45953,29504,45313,29120,28800,45121,20480,37057,37249,20800,37633,21440,21120,37441,38401,22208,22400,38721,21760,38337,38017,21568,39937,23744,23936,40257,24320,40897,40577,24128,23040,39617,39809,23360,39169,22976,22656,38977,34817,18624,18816,35137,19200,35777,35457,19008,19968,36545,36737,20288,36097,19904,19584,35905,17408,33985,34177,17728,34561,18368,18048,34369,33281,17088,17280,33601,16640,33217,32897,16448];this.addVbrFrame=
function(a){var b=a.internal_flags;var d=b.VBR_seek_table;a=w.bitrate_table[a.version][b.bitrate_index];d.nVbrNumFrames++;d.sum+=a;d.seen++;if(!(d.seen<d.want)&&(d.pos<d.size&&(d.bag[d.pos]=d.sum,d.pos++,d.seen=0),d.pos==d.size)){for(a=1;a<d.size;a+=2)d.bag[a/2]=d.bag[a];d.want*=2;d.pos/=2}};this.getVbrTag=function(a){var b=new VBRTagData,d=0;b.flags=0;var e=a[d+1]>>3&1,f=a[d+2]>>2&3,m=a[d+3]>>6&3,p=a[d+2]>>4&15;p=w.bitrate_table[e][p];b.samprate=14==a[d+1]>>4?w.samplerate_table[2][f]:w.samplerate_table[e][f];
f=d=0!=e?3!=m?d+36:d+21:3!=m?d+21:d+13;if(!(new String(a,f,4(),null)).equals("Xing")&&!(new String(a,f,4(),null)).equals("Info"))return null;d+=4;b.hId=e;f=b.flags=c(a,d);d+=4;0!=(f&1)&&(b.frames=c(a,d),d+=4);0!=(f&2)&&(b.bytes=c(a,d),d+=4);if(0!=(f&4)){if(null!=b.toc)for(m=0;m<v;m++)b.toc[m]=a[d+m];d+=v}b.vbrScale=-1;0!=(f&8)&&(b.vbrScale=c(a,d),d+=4);b.headersize=72E3*(e+1)*p/b.samprate;d+=21;e=a[d+0]<<4;e+=a[d+1]>>4;p=(a[d+1]&15)<<8;p+=a[d+2]&255;if(0>e||3E3<e)e=-1;if(0>p||3E3<p)p=-1;b.encDelay=
e;b.encPadding=p;return b};this.InitVbrTag=function(b){var e=b.internal_flags;var d=1==b.version?128:16E3>b.out_samplerate?32:64;b.VBR==G.vbr_off&&(d=b.brate);d=72E3*(b.version+1)*d/b.out_samplerate;var c=e.sideinfo_len+m;e.VBR_seek_table.TotalFrameSize=d;if(d<c||d>a)b.bWriteVbrTag=!1;else for(e.VBR_seek_table.nVbrNumFrames=0,e.VBR_seek_table.nBytesWritten=0,e.VBR_seek_table.sum=0,e.VBR_seek_table.seen=0,e.VBR_seek_table.want=1,e.VBR_seek_table.pos=0,null==e.VBR_seek_table.bag&&(e.VBR_seek_table.bag=
new int[400],e.VBR_seek_table.size=400),d=new Int8Array(a),E(b,d),e=e.VBR_seek_table.TotalFrameSize,c=0;c<e;++c)f.add_dummy_byte(b,d[c]&255,1)};this.updateMusicCRC=function(a,b,d,c){for(var e=0;e<c;++e)a[0]=B(b[d+e],a[0])};this.getLameTagFrame=function(a,c){var d=a.internal_flags;if(!a.bWriteVbrTag||d.Class_ID!=W.LAME_ID||0>=d.VBR_seek_table.pos)return 0;if(c.length<d.VBR_seek_table.TotalFrameSize)return d.VBR_seek_table.TotalFrameSize;na.fill(c,0,d.VBR_seek_table.TotalFrameSize,0);E(a,c);var e=new Int8Array(v);
if(a.free_format)for(var l=1;l<v;++l)e[l]=255&255*l/100;else{var m=d.VBR_seek_table;if(!(0>=m.pos))for(l=1;l<v;++l){var p=0|Math.floor(l/v*m.pos);p>m.pos-1&&(p=m.pos-1);p=0|256*m.bag[p]/m.sum;255<p&&(p=255);e[l]=255&p}}p=d.sideinfo_len;a.error_protection&&(p-=2);c[p++]=0;c[p++]=0;c[p++]=0;c[p++]=0;k(c,p,15);p+=4;k(c,p,d.VBR_seek_table.nVbrNumFrames);p+=4;m=d.VBR_seek_table.nBytesWritten+d.VBR_seek_table.TotalFrameSize;k(c,p,0|m);p+=4;T.arraycopy(e,0,c,p,e.length);p+=e.length;a.error_protection&&f.CRC_writeheader(d,
c);var r=0;for(l=0;l<p;l++)r=B(c[l],r);e=p;l=r;var t=a.internal_flags;p=0;r=a.encoder_delay;var u=a.encoder_padding,h=100-10*a.VBR_q-a.quality,x=b.getLameVeryShortVersion();var y=[1,5,3,2,4,0,3];var A=0|(255<a.lowpassfreq/100+.5?255:a.lowpassfreq/100+.5),z=0,w=0,O=a.internal_flags.noise_shaping,F=0,C,I=0!=(a.exp_nspsytune&1);var Q=0!=(a.exp_nspsytune&2);var S=C=!1,ma=a.internal_flags.nogap_total,Z=a.internal_flags.nogap_current,L=a.ATHtype;switch(a.VBR){case vbr_abr:var V=a.VBR_mean_bitrate_kbps;
break;case vbr_off:V=a.brate;break;default:V=a.VBR_min_bitrate_kbps}y=0+(a.VBR.ordinal()<y.length?y[a.VBR.ordinal()]:0);t.findReplayGain&&(510<t.RadioGain&&(t.RadioGain=510),-510>t.RadioGain&&(t.RadioGain=-510),w=11264,w=0<=t.RadioGain?w|t.RadioGain:w|512|-t.RadioGain);t.findPeakSample&&(z=Math.abs(0|t.PeakSample/32767*Math.pow(2,23)+.5));-1!=ma&&(0<Z&&(S=!0),Z<ma-1&&(C=!0));I=L+((I?1:0)<<4)+((Q?1:0)<<5)+((C?1:0)<<6)+((S?1:0)<<7);0>h&&(h=0);switch(a.mode){case MONO:Q=0;break;case STEREO:Q=1;break;
case DUAL_CHANNEL:Q=2;break;case JOINT_STEREO:Q=a.force_ms?4:3;break;default:Q=7}C=32E3>=a.in_samplerate?0:48E3==a.in_samplerate?2:48E3<a.in_samplerate?3:1;if(a.short_blocks==ra.short_block_forced||a.short_blocks==ra.short_block_dispensed||-1==a.lowpassfreq&&-1==a.highpassfreq||a.scale_left<a.scale_right||a.scale_left>a.scale_right||a.disable_reservoir&&320>a.brate||a.noATH||a.ATHonly||0==L||32E3>=a.in_samplerate)F=1;O=O+(Q<<2)+(F<<5)+(C<<6);t=t.nMusicCRC;k(c,e+p,h);p+=4;for(h=0;9>h;h++)c[e+p+h]=
255&x.charAt(h);p+=9;c[e+p]=255&y;p++;c[e+p]=255&A;p++;k(c,e+p,z);p+=4;n(c,e+p,w);p+=2;n(c,e+p,0);p+=2;c[e+p]=255&I;p++;c[e+p]=255<=V?255:255&V;p++;c[e+p]=255&r>>4;c[e+p+1]=255&(r<<4)+(u>>8);c[e+p+2]=255&u;p+=3;c[e+p]=255&O;p++;c[e+p++]=0;n(c,e+p,a.preset);p+=2;k(c,e+p,m);p+=4;n(c,e+p,t);p+=2;for(a=0;a<p;a++)l=B(c[e+a],l);n(c,e+p,l);return d.VBR_seek_table.TotalFrameSize};this.putVbrTag=function(b,c){if(0>=b.internal_flags.VBR_seek_table.pos)return-1;c.seek(c.length());if(0==c.length())return-1;c.seek(0);
var d=new Int8Array(10);c.readFully(d);d=(new String(d,"ISO-8859-1")).startsWith("ID3")?0:((d[6]&127)<<21|(d[7]&127)<<14|(d[8]&127)<<7|d[9]&127)+d.length;c.seek(d);d=new Int8Array(a);b=getLameTagFrame(b,d);if(b>d.length)return-1;if(1>b)return 0;c.write(d,0,b);return 0}}function U(c,k,n,w){this.xlen=c;this.linmax=k;this.table=n;this.hlen=w}function xa(c){this.bits=c}function yc(){this.setModules=function(c,k){}}function sb(){this.bits=this.over_SSD=this.over_count=this.max_noise=this.tot_noise=this.over_noise=
0}function zc(){this.scale_right=this.scale_left=this.scale=this.out_samplerate=this.in_samplerate=this.num_channels=this.num_samples=this.class_id=0;this.decode_only=this.bWriteVbrTag=this.analysis=!1;this.quality=0;this.mode=la.STEREO;this.write_id3tag_automatic=this.decode_on_the_fly=this.findReplayGain=this.free_format=this.force_ms=!1;this.error_protection=this.emphasis=this.extension=this.original=this.copyright=this.compression_ratio=this.brate=0;this.disable_reservoir=this.strict_ISO=!1;this.quant_comp_short=
this.quant_comp=0;this.experimentalY=!1;this.preset=this.exp_nspsytune=this.experimentalZ=0;this.VBR=null;this.maskingadjust_short=this.maskingadjust=this.highpasswidth=this.lowpasswidth=this.highpassfreq=this.lowpassfreq=this.VBR_hard_min=this.VBR_max_bitrate_kbps=this.VBR_min_bitrate_kbps=this.VBR_mean_bitrate_kbps=this.VBR_q=this.VBR_q_frac=0;this.noATH=this.ATHshort=this.ATHonly=!1;this.athaa_sensitivity=this.athaa_loudapprox=this.athaa_type=this.ATHlower=this.ATHcurve=this.ATHtype=0;this.short_blocks=
null;this.useTemporal=!1;this.msfix=this.interChRatio=0;this.tune=!1;this.lame_allocated_gfp=this.frameNum=this.framesize=this.encoder_padding=this.encoder_delay=this.version=this.tune_value_a=0;this.internal_flags=null}function Ac(){this.linprebuf=K(2*Y.MAX_ORDER);this.linpre=0;this.lstepbuf=K(Y.MAX_SAMPLES_PER_WINDOW+Y.MAX_ORDER);this.lstep=0;this.loutbuf=K(Y.MAX_SAMPLES_PER_WINDOW+Y.MAX_ORDER);this.lout=0;this.rinprebuf=K(2*Y.MAX_ORDER);this.rinpre=0;this.rstepbuf=K(Y.MAX_SAMPLES_PER_WINDOW+Y.MAX_ORDER);
this.rstep=0;this.routbuf=K(Y.MAX_SAMPLES_PER_WINDOW+Y.MAX_ORDER);this.first=this.freqindex=this.rsum=this.lsum=this.totsamp=this.sampleWindow=this.rout=0;this.A=X(0|Y.STEPS_per_dB*Y.MAX_dB);this.B=X(0|Y.STEPS_per_dB*Y.MAX_dB)}function Bc(u){this.quantize=u;this.iteration_loop=function(k,n,u,w){var B=k.internal_flags,E=K(sa.SFBMAX),f=K(576),b=X(2),v=B.l3_side;var a=new xa(0);this.quantize.rv.ResvFrameBegin(k,a);a=a.bits;for(var m=0;m<B.mode_gr;m++){var z=this.quantize.qupvt.on_pe(k,n,b,a,m,m);B.mode_ext==
c.MPG_MD_MS_LR&&(this.quantize.ms_convert(B.l3_side,m),this.quantize.qupvt.reduce_side(b,u[m],a,z));for(z=0;z<B.channels_out;z++){var e=v.tt[m][z];if(e.block_type!=c.SHORT_TYPE){var l=0;l=B.PSY.mask_adjust-l}else l=0,l=B.PSY.mask_adjust_short-l;B.masking_lower=Math.pow(10,.1*l);this.quantize.init_outer_loop(B,e);this.quantize.init_xrpow(B,e,f)&&(this.quantize.qupvt.calc_xmin(k,w[m][z],e,E),this.quantize.outer_loop(k,e,E,f,z,b[z]));this.quantize.iteration_finish_one(B,m,z)}}this.quantize.rv.ResvFrameEnd(B,
a)}}function Cc(){this.floor=this.decay=this.adjustLimit=this.adjust=this.aaSensitivityP=this.useAdjust=0;this.l=K(c.SBMAX_l);this.s=K(c.SBMAX_s);this.psfb21=K(c.PSFB21);this.psfb12=K(c.PSFB12);this.cb_l=K(c.CBANDS);this.cb_s=K(c.CBANDS);this.eql_w=K(c.BLKSIZE/2)}function za(u,k,n,w){this.l=X(1+c.SBMAX_l);this.s=X(1+c.SBMAX_s);this.psfb21=X(1+c.PSFB21);this.psfb12=X(1+c.PSFB12);var E=this.l,B=this.s;4==arguments.length&&(this.arrL=arguments[0],this.arrS=arguments[1],this.arr21=arguments[2],this.arr12=
arguments[3],T.arraycopy(this.arrL,0,E,0,Math.min(this.arrL.length,this.l.length)),T.arraycopy(this.arrS,0,B,0,Math.min(this.arrS.length,this.s.length)),T.arraycopy(this.arr21,0,this.psfb21,0,Math.min(this.arr21.length,this.psfb21.length)),T.arraycopy(this.arr12,0,this.psfb12,0,Math.min(this.arr12.length,this.psfb12.length)))}function ia(){function u(a,b){b=E.ATHformula(b,a);return b=Math.pow(10,(b-100)/10+a.ATHlower)}function k(a){this.s=a}var n=null,w=null,E=null;this.setModules=function(a,b,d){n=
a;w=b;E=d};this.IPOW20=function(b){return a[b]};var B=ia.IXMAX_VAL+2,ha=ia.Q_MAX,f=ia.Q_MAX2;this.nr_of_sfb_block=[[[6,5,5,5],[9,9,9,9],[6,9,9,9]],[[6,5,7,3],[9,9,12,6],[6,9,12,6]],[[11,10,0,0],[18,18,0,0],[15,18,0,0]],[[7,7,7,0],[12,12,12,0],[6,15,12,0]],[[6,6,6,3],[12,9,9,6],[6,12,9,6]],[[8,8,5,0],[15,12,9,0],[6,18,9,0]]];var b=[0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,2,2,3,3,3,2,0];this.pretab=b;this.sfBandIndex=[new za([0,6,12,18,24,30,36,44,54,66,80,96,116,140,168,200,238,284,336,396,464,522,576],[0,4,
8,12,18,24,32,42,56,74,100,132,174,192],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0]),new za([0,6,12,18,24,30,36,44,54,66,80,96,114,136,162,194,232,278,332,394,464,540,576],[0,4,8,12,18,26,36,48,62,80,104,136,180,192],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0]),new za([0,6,12,18,24,30,36,44,54,66,80,96,116,140,168,200,238,284,336,396,464,522,576],[0,4,8,12,18,26,36,48,62,80,104,134,174,192],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0]),new za([0,4,8,12,16,20,24,30,36,44,52,62,74,90,110,134,162,196,238,288,342,418,576],[0,4,8,12,16,22,
30,40,52,66,84,106,136,192],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0]),new za([0,4,8,12,16,20,24,30,36,42,50,60,72,88,106,128,156,190,230,276,330,384,576],[0,4,8,12,16,22,28,38,50,64,80,100,126,192],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0]),new za([0,4,8,12,16,20,24,30,36,44,54,66,82,102,126,156,194,240,296,364,448,550,576],[0,4,8,12,16,22,30,42,58,78,104,138,180,192],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0]),new za([0,6,12,18,24,30,36,44,54,66,80,96,116,140,168,200,238,284,336,396,464,522,576],[0,4,8,12,18,26,36,48,62,80,104,
134,174,192],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0]),new za([0,6,12,18,24,30,36,44,54,66,80,96,116,140,168,200,238,284,336,396,464,522,576],[0,4,8,12,18,26,36,48,62,80,104,134,174,192],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0]),new za([0,12,24,36,48,60,72,88,108,132,160,192,232,280,336,400,476,566,568,570,572,574,576],[0,8,16,24,36,52,72,96,124,160,162,164,166,192],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0])];var v=K(ha+f+1),a=K(ha),m=K(B),z=K(B);this.adj43=z;this.iteration_init=function(b){var e=b.internal_flags,d=e.l3_side;
if(0==e.iteration_init_init){e.iteration_init_init=1;d.main_data_begin=0;d=b.internal_flags.ATH.l;for(var g=b.internal_flags.ATH.psfb21,q=b.internal_flags.ATH.s,k=b.internal_flags.ATH.psfb12,p=b.internal_flags,r=b.out_samplerate,t=0;t<c.SBMAX_l;t++){var J=p.scalefac_band.l[t],h=p.scalefac_band.l[t+1];for(d[t]=Ma.MAX_VALUE;J<h;J++){var x=J*r/1152;x=u(b,x);d[t]=Math.min(d[t],x)}}for(t=0;t<c.PSFB21;t++)for(J=p.scalefac_band.psfb21[t],h=p.scalefac_band.psfb21[t+1],g[t]=Ma.MAX_VALUE;J<h;J++)x=J*r/1152,
x=u(b,x),g[t]=Math.min(g[t],x);for(t=0;t<c.SBMAX_s;t++){J=p.scalefac_band.s[t];h=p.scalefac_band.s[t+1];for(q[t]=Ma.MAX_VALUE;J<h;J++)x=J*r/384,x=u(b,x),q[t]=Math.min(q[t],x);q[t]*=p.scalefac_band.s[t+1]-p.scalefac_band.s[t]}for(t=0;t<c.PSFB12;t++){J=p.scalefac_band.psfb12[t];h=p.scalefac_band.psfb12[t+1];for(k[t]=Ma.MAX_VALUE;J<h;J++)x=J*r/384,x=u(b,x),k[t]=Math.min(k[t],x);k[t]*=p.scalefac_band.s[13]-p.scalefac_band.s[12]}if(b.noATH){for(t=0;t<c.SBMAX_l;t++)d[t]=1E-20;for(t=0;t<c.PSFB21;t++)g[t]=
1E-20;for(t=0;t<c.SBMAX_s;t++)q[t]=1E-20;for(t=0;t<c.PSFB12;t++)k[t]=1E-20}p.ATH.floor=10*Math.log10(u(b,-1));m[0]=0;for(d=1;d<B;d++)m[d]=Math.pow(d,4/3);for(d=0;d<B-1;d++)z[d]=d+1-Math.pow(.5*(m[d]+m[d+1]),.75);z[d]=.5;for(d=0;d<ha;d++)a[d]=Math.pow(2,-.1875*(d-210));for(d=0;d<=ha+f;d++)v[d]=Math.pow(2,.25*(d-210-f));n.huffman_init(e);d=b.exp_nspsytune>>2&63;32<=d&&(d-=64);g=Math.pow(10,d/4/10);d=b.exp_nspsytune>>8&63;32<=d&&(d-=64);q=Math.pow(10,d/4/10);d=b.exp_nspsytune>>14&63;32<=d&&(d-=64);k=
Math.pow(10,d/4/10);d=b.exp_nspsytune>>20&63;32<=d&&(d-=64);b=k*Math.pow(10,d/4/10);for(d=0;d<c.SBMAX_l;d++)p=6>=d?g:13>=d?q:20>=d?k:b,e.nsPsy.longfact[d]=p;for(d=0;d<c.SBMAX_s;d++)p=5>=d?g:10>=d?q:11>=d?k:b,e.nsPsy.shortfact[d]=p}};this.on_pe=function(a,b,d,c,f,m){var e=a.internal_flags,g=0,l=X(2),q;g=new xa(g);a=w.ResvMaxBits(a,c,g,m);g=g.bits;var h=g+a;h>da.MAX_BITS_PER_GRANULE&&(h=da.MAX_BITS_PER_GRANULE);for(q=m=0;q<e.channels_out;++q)d[q]=Math.min(da.MAX_BITS_PER_CHANNEL,g/e.channels_out),l[q]=
0|d[q]*b[f][q]/700-d[q],l[q]>3*c/4&&(l[q]=3*c/4),0>l[q]&&(l[q]=0),l[q]+d[q]>da.MAX_BITS_PER_CHANNEL&&(l[q]=Math.max(0,da.MAX_BITS_PER_CHANNEL-d[q])),m+=l[q];if(m>a)for(q=0;q<e.channels_out;++q)l[q]=a*l[q]/m;for(q=0;q<e.channels_out;++q)d[q]+=l[q],a-=l[q];for(q=m=0;q<e.channels_out;++q)m+=d[q];if(m>da.MAX_BITS_PER_GRANULE)for(q=0;q<e.channels_out;++q)d[q]*=da.MAX_BITS_PER_GRANULE,d[q]/=m;return h};this.reduce_side=function(a,b,d,c){b=.33*(.5-b)/.5;0>b&&(b=0);.5<b&&(b=.5);b=0|.5*b*(a[0]+a[1]);b>da.MAX_BITS_PER_CHANNEL-
a[0]&&(b=da.MAX_BITS_PER_CHANNEL-a[0]);0>b&&(b=0);125<=a[1]&&(125<a[1]-b?(a[0]<d&&(a[0]+=b),a[1]-=b):(a[0]+=a[1]-125,a[1]=125));b=a[0]+a[1];b>c&&(a[0]=c*a[0]/b,a[1]=c*a[1]/b)};this.athAdjust=function(a,b,d){b=aa.FAST_LOG10_X(b,10);a*=a;var c=0;b-=d;1E-20<a&&(c=1+aa.FAST_LOG10_X(a,10/90.30873362));0>c&&(c=0);return Math.pow(10,.1*(b*c+(d+90.30873362-94.82444863)))};this.calc_xmin=function(a,b,d,f){var e=0,g=a.internal_flags,m,l=0,k=0,v=g.ATH,h=d.xr,x=a.VBR==G.vbr_mtrh?1:0,y=g.masking_lower;if(a.VBR==
G.vbr_mtrh||a.VBR==G.vbr_mt)y=1;for(m=0;m<d.psy_lmax;m++){var A=a.VBR==G.vbr_rh||a.VBR==G.vbr_mtrh?athAdjust(v.adjust,v.l[m],v.floor):v.adjust*v.l[m];var n=d.width[m];var u=A/n;var B=2.220446049250313E-16;var z=n>>1;var C=0;do{var I=h[l]*h[l];C+=I;B+=I<u?I:u;l++;I=h[l]*h[l];C+=I;B+=I<u?I:u;l++}while(0<--z);C>A&&k++;m==c.SBPSY_l&&(u=A*g.nsPsy.longfact[m],B<u&&(B=u));0!=x&&(A=B);a.ATHonly||(B=b.en.l[m],0<B&&(u=C*b.thm.l[m]*y/B,0!=x&&(u*=g.nsPsy.longfact[m]),A<u&&(A=u)));0!=x?f[e++]=A:f[e++]=A*g.nsPsy.longfact[m]}C=
575;if(d.block_type!=c.SHORT_TYPE)for(A=576;0!=A--&&qa.EQ(h[A],0);)C=A;d.max_nonzero_coeff=C;for(var Q=d.sfb_smin;m<d.psymax;Q++,m+=3){var S;var w=a.VBR==G.vbr_rh||a.VBR==G.vbr_mtrh?athAdjust(v.adjust,v.s[Q],v.floor):v.adjust*v.s[Q];n=d.width[m];for(S=0;3>S;S++){C=0;z=n>>1;u=w/n;B=2.220446049250313E-16;do I=h[l]*h[l],C+=I,B+=I<u?I:u,l++,I=h[l]*h[l],C+=I,B+=I<u?I:u,l++;while(0<--z);C>w&&k++;Q==c.SBPSY_s&&(u=w*g.nsPsy.shortfact[Q],B<u&&(B=u));A=0!=x?B:w;a.ATHonly||a.ATHshort||(B=b.en.s[Q][S],0<B&&(u=
C*b.thm.s[Q][S]*y/B,0!=x&&(u*=g.nsPsy.shortfact[Q]),A<u&&(A=u)));0!=x?f[e++]=A:f[e++]=A*g.nsPsy.shortfact[Q]}a.useTemporal&&(f[e-3]>f[e-3+1]&&(f[e-3+1]+=(f[e-3]-f[e-3+1])*g.decay),f[e-3+1]>f[e-3+2]&&(f[e-3+2]+=(f[e-3+1]-f[e-3+2])*g.decay))}return k};this.calc_noise_core=function(a,b,d,c){var e=0,f=b.s,g=a.l3_enc;if(f>a.count1)for(;0!=d--;){var l=a.xr[f];f++;e+=l*l;l=a.xr[f];f++;e+=l*l}else if(f>a.big_values){var k=K(2);k[0]=0;for(k[1]=c;0!=d--;)l=Math.abs(a.xr[f])-k[g[f]],f++,e+=l*l,l=Math.abs(a.xr[f])-
k[g[f]],f++,e+=l*l}else for(;0!=d--;)l=Math.abs(a.xr[f])-m[g[f]]*c,f++,e+=l*l,l=Math.abs(a.xr[f])-m[g[f]]*c,f++,e+=l*l;b.s=f;return e};this.calc_noise=function(a,c,d,f,m){var e=0,g=0,l,q=0,u=0,h=0,x=-20,y=0,A=a.scalefac,n=0;for(l=f.over_SSD=0;l<a.psymax;l++){var B=a.global_gain-(A[n++]+(0!=a.preflag?b[l]:0)<<a.scalefac_scale+1)-8*a.subblock_gain[a.window[l]];if(null!=m&&m.step[l]==B){var z=m.noise[l];y+=a.width[l];d[e++]=z/c[g++];z=m.noise_log[l]}else{z=v[B+ia.Q_MAX2];var w=a.width[l]>>1;y+a.width[l]>
a.max_nonzero_coeff&&(w=a.max_nonzero_coeff-y+1,w=0<w?w>>1:0);y=new k(y);z=this.calc_noise_core(a,y,w,z);y=y.s;null!=m&&(m.step[l]=B,m.noise[l]=z);z=d[e++]=z/c[g++];z=aa.FAST_LOG10(Math.max(z,1E-20));null!=m&&(m.noise_log[l]=z)}null!=m&&(m.global_gain=a.global_gain);h+=z;0<z&&(B=Math.max(0|10*z+.5,1),f.over_SSD+=B*B,q++,u+=z);x=Math.max(x,z)}f.over_count=q;f.tot_noise=h;f.over_noise=u;f.max_noise=x;return q};this.set_pinfo=function(a,f,d,g,m){var e=a.internal_flags,l,k,q=0==f.scalefac_scale?.5:1,
v=f.scalefac,h=K(sa.SFBMAX),x=K(sa.SFBMAX),y=new sb;calc_xmin(a,d,f,h);calc_noise(f,h,x,y,null);var u=0;var n=f.sfb_lmax;f.block_type!=c.SHORT_TYPE&&0==f.mixed_block_flag&&(n=22);for(l=0;l<n;l++){var B=e.scalefac_band.l[l],z=e.scalefac_band.l[l+1],w=z-B;for(k=0;u<z;u++)k+=f.xr[u]*f.xr[u];k/=w;var C=1E15;e.pinfo.en[g][m][l]=C*k;e.pinfo.xfsf[g][m][l]=C*h[l]*x[l]/w;k=0<d.en.l[l]&&!a.ATHonly?k/d.en.l[l]:0;e.pinfo.thr[g][m][l]=C*Math.max(k*d.thm.l[l],e.ATH.l[l]);e.pinfo.LAMEsfb[g][m][l]=0;0!=f.preflag&&
11<=l&&(e.pinfo.LAMEsfb[g][m][l]=-q*b[l]);l<c.SBPSY_l&&(e.pinfo.LAMEsfb[g][m][l]-=q*v[l])}if(f.block_type==c.SHORT_TYPE)for(n=l,l=f.sfb_smin;l<c.SBMAX_s;l++){B=e.scalefac_band.s[l];z=e.scalefac_band.s[l+1];w=z-B;for(var I=0;3>I;I++){k=0;for(C=B;C<z;C++)k+=f.xr[u]*f.xr[u],u++;k=Math.max(k/w,1E-20);C=1E15;e.pinfo.en_s[g][m][3*l+I]=C*k;e.pinfo.xfsf_s[g][m][3*l+I]=C*h[n]*x[n]/w;k=0<d.en.s[l][I]?k/d.en.s[l][I]:0;if(a.ATHonly||a.ATHshort)k=0;e.pinfo.thr_s[g][m][3*l+I]=C*Math.max(k*d.thm.s[l][I],e.ATH.s[l]);
e.pinfo.LAMEsfb_s[g][m][3*l+I]=-2*f.subblock_gain[I];l<c.SBPSY_s&&(e.pinfo.LAMEsfb_s[g][m][3*l+I]-=q*v[n]);n++}}e.pinfo.LAMEqss[g][m]=f.global_gain;e.pinfo.LAMEmainbits[g][m]=f.part2_3_length+f.part2_length;e.pinfo.LAMEsfbits[g][m]=f.part2_length;e.pinfo.over[g][m]=y.over_count;e.pinfo.max_noise[g][m]=10*y.max_noise;e.pinfo.over_noise[g][m]=10*y.over_noise;e.pinfo.tot_noise[g][m]=10*y.tot_noise;e.pinfo.over_SSD[g][m]=y.over_SSD}}function Dc(){this.sfb_count1=this.global_gain=0;this.step=X(39);this.noise=
K(39);this.noise_log=K(39)}function rb(){this.xr=K(576);this.l3_enc=X(576);this.scalefac=X(sa.SFBMAX);this.mixed_block_flag=this.block_type=this.scalefac_compress=this.global_gain=this.count1=this.big_values=this.part2_3_length=this.xrpow_max=0;this.table_select=X(3);this.subblock_gain=X(4);this.sfbdivide=this.psymax=this.sfbmax=this.psy_lmax=this.sfb_smin=this.sfb_lmax=this.part2_length=this.count1table_select=this.scalefac_scale=this.preflag=this.region1_count=this.region0_count=0;this.width=X(sa.SFBMAX);
this.window=X(sa.SFBMAX);this.count1bits=0;this.sfb_partition_table=null;this.slen=X(4);this.max_nonzero_coeff=0;var c=this;this.assign=function(k){c.xr=new Float32Array(k.xr);c.l3_enc=new Int32Array(k.l3_enc);c.scalefac=new Int32Array(k.scalefac);c.xrpow_max=k.xrpow_max;c.part2_3_length=k.part2_3_length;c.big_values=k.big_values;c.count1=k.count1;c.global_gain=k.global_gain;c.scalefac_compress=k.scalefac_compress;c.block_type=k.block_type;c.mixed_block_flag=k.mixed_block_flag;c.table_select=new Int32Array(k.table_select);
c.subblock_gain=new Int32Array(k.subblock_gain);c.region0_count=k.region0_count;c.region1_count=k.region1_count;c.preflag=k.preflag;c.scalefac_scale=k.scalefac_scale;c.count1table_select=k.count1table_select;c.part2_length=k.part2_length;c.sfb_lmax=k.sfb_lmax;c.sfb_smin=k.sfb_smin;c.psy_lmax=k.psy_lmax;c.sfbmax=k.sfbmax;c.psymax=k.psymax;c.sfbdivide=k.sfbdivide;c.width=new Int32Array(k.width);c.window=new Int32Array(k.window);c.count1bits=k.count1bits;c.sfb_partition_table=k.sfb_partition_table.slice(0);
c.slen=new Int32Array(k.slen);c.max_nonzero_coeff=k.max_nonzero_coeff}}function Ec(){function u(c){this.ordinal=c}function k(c){for(var b=0;b<c.sfbmax;b++)if(0==c.scalefac[b]+c.subblock_gain[c.window[b]])return!1;return!0}var n;this.rv=null;var w;this.qupvt=null;var E,B=new yc,ha;this.setModules=function(c,b,k,a){n=c;this.rv=w=b;this.qupvt=E=k;ha=a;B.setModules(E,ha)};this.ms_convert=function(c,b){for(var f=0;576>f;++f){var a=c.tt[b][0].xr[f],m=c.tt[b][1].xr[f];c.tt[b][0].xr[f]=.5*(a+m)*aa.SQRT2;
c.tt[b][1].xr[f]=.5*(a-m)*aa.SQRT2}};this.init_xrpow=function(c,b,k){var a=0|b.max_nonzero_coeff;b.xrpow_max=0;na.fill(k,a,576,0);for(var f,v=f=0;v<=a;++v){var e=Math.abs(b.xr[v]);f+=e;k[v]=Math.sqrt(e*Math.sqrt(e));k[v]>b.xrpow_max&&(b.xrpow_max=k[v])}if(1E-20<f){k=0;0!=(c.substep_shaping&2)&&(k=1);for(a=0;a<b.psymax;a++)c.pseudohalf[a]=k;return!0}na.fill(b.l3_enc,0,576,0);return!1};this.init_outer_loop=function(f,b){b.part2_3_length=0;b.big_values=0;b.count1=0;b.global_gain=210;b.scalefac_compress=
0;b.table_select[0]=0;b.table_select[1]=0;b.table_select[2]=0;b.subblock_gain[0]=0;b.subblock_gain[1]=0;b.subblock_gain[2]=0;b.subblock_gain[3]=0;b.region0_count=0;b.region1_count=0;b.preflag=0;b.scalefac_scale=0;b.count1table_select=0;b.part2_length=0;b.sfb_lmax=c.SBPSY_l;b.sfb_smin=c.SBPSY_s;b.psy_lmax=f.sfb21_extra?c.SBMAX_l:c.SBPSY_l;b.psymax=b.psy_lmax;b.sfbmax=b.sfb_lmax;b.sfbdivide=11;for(var k=0;k<c.SBMAX_l;k++)b.width[k]=f.scalefac_band.l[k+1]-f.scalefac_band.l[k],b.window[k]=3;if(b.block_type==
c.SHORT_TYPE){var a=K(576);b.sfb_smin=0;b.sfb_lmax=0;0!=b.mixed_block_flag&&(b.sfb_smin=3,b.sfb_lmax=2*f.mode_gr+4);b.psymax=b.sfb_lmax+3*((f.sfb21_extra?c.SBMAX_s:c.SBPSY_s)-b.sfb_smin);b.sfbmax=b.sfb_lmax+3*(c.SBPSY_s-b.sfb_smin);b.sfbdivide=b.sfbmax-18;b.psy_lmax=b.sfb_lmax;var m=f.scalefac_band.l[b.sfb_lmax];T.arraycopy(b.xr,0,a,0,576);for(k=b.sfb_smin;k<c.SBMAX_s;k++)for(var n=f.scalefac_band.s[k],e=f.scalefac_band.s[k+1],l=0;3>l;l++)for(var d=n;d<e;d++)b.xr[m++]=a[3*d+l];a=b.sfb_lmax;for(k=
b.sfb_smin;k<c.SBMAX_s;k++)b.width[a]=b.width[a+1]=b.width[a+2]=f.scalefac_band.s[k+1]-f.scalefac_band.s[k],b.window[a]=0,b.window[a+1]=1,b.window[a+2]=2,a+=3}b.count1bits=0;b.sfb_partition_table=E.nr_of_sfb_block[0][0];b.slen[0]=0;b.slen[1]=0;b.slen[2]=0;b.slen[3]=0;b.max_nonzero_coeff=575;na.fill(b.scalefac,0);k=f.ATH;a=b.xr;if(b.block_type!=c.SHORT_TYPE)for(b=!1,m=c.PSFB21-1;0<=m&&!b;m--)for(n=f.scalefac_band.psfb21[m],e=f.scalefac_band.psfb21[m+1],l=E.athAdjust(k.adjust,k.psfb21[m],k.floor),1E-12<
f.nsPsy.longfact[21]&&(l*=f.nsPsy.longfact[21]),--e;e>=n;e--)if(Math.abs(a[e])<l)a[e]=0;else{b=!0;break}else for(l=0;3>l;l++)for(b=!1,m=c.PSFB12-1;0<=m&&!b;m--)for(n=3*f.scalefac_band.s[12]+(f.scalefac_band.s[13]-f.scalefac_band.s[12])*l+(f.scalefac_band.psfb12[m]-f.scalefac_band.psfb12[0]),e=n+(f.scalefac_band.psfb12[m+1]-f.scalefac_band.psfb12[m]),d=E.athAdjust(k.adjust,k.psfb12[m],k.floor),1E-12<f.nsPsy.shortfact[12]&&(d*=f.nsPsy.shortfact[12]),--e;e>=n;e--)if(Math.abs(a[e])<d)a[e]=0;else{b=!0;
break}};u.BINSEARCH_NONE=new u(0);u.BINSEARCH_UP=new u(1);u.BINSEARCH_DOWN=new u(2);this.trancate_smallspectrums=function(f,b,k,a){var m=K(sa.SFBMAX);if((0!=(f.substep_shaping&4)||b.block_type!=c.SHORT_TYPE)&&0==(f.substep_shaping&128)){E.calc_noise(b,k,m,new sb,null);for(var n=0;576>n;n++){var e=0;0!=b.l3_enc[n]&&(e=Math.abs(b.xr[n]));a[n]=e}n=0;e=8;b.block_type==c.SHORT_TYPE&&(e=6);do{var l,d,g=b.width[e];n+=g;if(!(1<=m[e]||(na.sort(a,n-g,g),qa.EQ(a[n-1],0)))){var q=(1-m[e])*k[e];var v=l=0;do{for(d=
1;v+d<g&&!qa.NEQ(a[v+n-g],a[v+n+d-g]);d++);var p=a[v+n-g]*a[v+n-g]*d;if(q<p){0!=v&&(l=a[v+n-g-1]);break}q-=p;v+=d}while(v<g);if(!qa.EQ(l,0)){do Math.abs(b.xr[n-g])<=l&&(b.l3_enc[n-g]=0);while(0<--g)}}}while(++e<b.psymax);b.part2_3_length=ha.noquant_count_bits(f,b,null)}};this.outer_loop=function(f,b,n,a,m,B){var e=f.internal_flags,l=new rb,d=K(576),g=K(sa.SFBMAX),q=new sb,v=new Dc,p=9999999,r=!1,t=!1,w=0,h,x=e.CurrentStep[m],y=!1,A=e.OldValue[m];var z=u.BINSEARCH_NONE;b.global_gain=A;for(h=B-b.part2_length;;){var H=
ha.count_bits(e,a,b,null);if(1==x||H==h)break;H>h?(z==u.BINSEARCH_DOWN&&(y=!0),y&&(x/=2),z=u.BINSEARCH_UP,H=x):(z==u.BINSEARCH_UP&&(y=!0),y&&(x/=2),z=u.BINSEARCH_DOWN,H=-x);b.global_gain+=H;0>b.global_gain&&(b.global_gain=0,y=!0);255<b.global_gain&&(b.global_gain=255,y=!0)}for(;H>h&&255>b.global_gain;)b.global_gain++,H=ha.count_bits(e,a,b,null);e.CurrentStep[m]=4<=A-b.global_gain?4:2;e.OldValue[m]=b.global_gain;b.part2_3_length=H;if(0==e.noise_shaping)return 100;E.calc_noise(b,n,g,q,v);q.bits=b.part2_3_length;
l.assign(b);m=0;for(T.arraycopy(a,0,d,0,576);!r;){do{h=new sb;y=255;x=0!=(e.substep_shaping&2)?20:3;if(e.sfb21_extra){if(1<g[l.sfbmax])break;if(l.block_type==c.SHORT_TYPE&&(1<g[l.sfbmax+1]||1<g[l.sfbmax+2]))break}A=l;H=a;z=f.internal_flags;var O=A,F=g,C=H,I=f.internal_flags;var Q=0==O.scalefac_scale?1.2968395546510096:1.6817928305074292;for(var S=0,ma=0;ma<O.sfbmax;ma++)S<F[ma]&&(S=F[ma]);ma=I.noise_shaping_amp;3==ma&&(ma=t?2:1);switch(ma){case 2:break;case 1:S=1<S?Math.pow(S,.5):.95*S;break;default:S=
1<S?1:.95*S}var Z=0;for(ma=0;ma<O.sfbmax;ma++){var L=O.width[ma];Z+=L;if(!(F[ma]<S)){if(0!=(I.substep_shaping&2)&&(I.pseudohalf[ma]=0==I.pseudohalf[ma]?1:0,0==I.pseudohalf[ma]&&2==I.noise_shaping_amp))break;O.scalefac[ma]++;for(L=-L;0>L;L++)C[Z+L]*=Q,C[Z+L]>O.xrpow_max&&(O.xrpow_max=C[Z+L]);if(2==I.noise_shaping_amp)break}}if(Q=k(A))A=!1;else if(Q=2==z.mode_gr?ha.scale_bitcount(A):ha.scale_bitcount_lsf(z,A)){if(1<z.noise_shaping)if(na.fill(z.pseudohalf,0),0==A.scalefac_scale){Q=A;for(F=O=0;F<Q.sfbmax;F++){I=
Q.width[F];C=Q.scalefac[F];0!=Q.preflag&&(C+=E.pretab[F]);O+=I;if(0!=(C&1))for(C++,I=-I;0>I;I++)H[O+I]*=1.2968395546510096,H[O+I]>Q.xrpow_max&&(Q.xrpow_max=H[O+I]);Q.scalefac[F]=C>>1}Q.preflag=0;Q.scalefac_scale=1;Q=!1}else if(A.block_type==c.SHORT_TYPE&&0<z.subblock_gain){b:{Q=z;O=A;F=H;C=O.scalefac;for(H=0;H<O.sfb_lmax;H++)if(16<=C[H]){H=!0;break b}for(I=0;3>I;I++){ma=S=0;for(H=O.sfb_lmax+I;H<O.sfbdivide;H+=3)S<C[H]&&(S=C[H]);for(;H<O.sfbmax;H+=3)ma<C[H]&&(ma=C[H]);if(!(16>S&&8>ma)){if(7<=O.subblock_gain[I]){H=
!0;break b}O.subblock_gain[I]++;S=Q.scalefac_band.l[O.sfb_lmax];for(H=O.sfb_lmax+I;H<O.sfbmax;H+=3)if(ma=O.width[H],Z=C[H],Z-=4>>O.scalefac_scale,0<=Z)C[H]=Z,S+=3*ma;else{C[H]=0;Z=E.IPOW20(210+(Z<<O.scalefac_scale+1));S+=ma*(I+1);for(L=-ma;0>L;L++)F[S+L]*=Z,F[S+L]>O.xrpow_max&&(O.xrpow_max=F[S+L]);S+=ma*(3-I-1)}Z=E.IPOW20(202);S+=O.width[H]*(I+1);for(L=-O.width[H];0>L;L++)F[S+L]*=Z,F[S+L]>O.xrpow_max&&(O.xrpow_max=F[S+L])}}H=!1}Q=H||k(A)}Q||(Q=2==z.mode_gr?ha.scale_bitcount(A):ha.scale_bitcount_lsf(z,
A));A=!Q}else A=!0;if(!A)break;0!=l.scalefac_scale&&(y=254);A=B-l.part2_length;if(0>=A)break;for(;(l.part2_3_length=ha.count_bits(e,a,l,v))>A&&l.global_gain<=y;)l.global_gain++;if(l.global_gain>y)break;if(0==q.over_count){for(;(l.part2_3_length=ha.count_bits(e,a,l,v))>p&&l.global_gain<=y;)l.global_gain++;if(l.global_gain>y)break}E.calc_noise(l,n,g,h,v);h.bits=l.part2_3_length;z=b.block_type!=c.SHORT_TYPE?f.quant_comp:f.quant_comp_short;y=q;A=h;Q=l;H=g;switch(z){default:case 9:0<y.over_count?(z=A.over_SSD<=
y.over_SSD,A.over_SSD==y.over_SSD&&(z=A.bits<y.bits)):z=0>A.max_noise&&10*A.max_noise+A.bits<=10*y.max_noise+y.bits;break;case 0:z=A.over_count<y.over_count||A.over_count==y.over_count&&A.over_noise<y.over_noise||A.over_count==y.over_count&&qa.EQ(A.over_noise,y.over_noise)&&A.tot_noise<y.tot_noise;break;case 8:z=A;F=1E-37;for(O=0;O<Q.psymax;O++)C=H[O],C=aa.FAST_LOG10(.368+.632*C*C*C),F+=C;z.max_noise=Math.max(1E-20,F);case 1:z=A.max_noise<y.max_noise;break;case 2:z=A.tot_noise<y.tot_noise;break;case 3:z=
A.tot_noise<y.tot_noise&&A.max_noise<y.max_noise;break;case 4:z=0>=A.max_noise&&.2<y.max_noise||0>=A.max_noise&&0>y.max_noise&&y.max_noise>A.max_noise-.2&&A.tot_noise<y.tot_noise||0>=A.max_noise&&0<y.max_noise&&y.max_noise>A.max_noise-.2&&A.tot_noise<y.tot_noise+y.over_noise||0<A.max_noise&&-.05<y.max_noise&&y.max_noise>A.max_noise-.1&&A.tot_noise+A.over_noise<y.tot_noise+y.over_noise||0<A.max_noise&&-.1<y.max_noise&&y.max_noise>A.max_noise-.15&&A.tot_noise+A.over_noise+A.over_noise<y.tot_noise+y.over_noise+
y.over_noise;break;case 5:z=A.over_noise<y.over_noise||qa.EQ(A.over_noise,y.over_noise)&&A.tot_noise<y.tot_noise;break;case 6:z=A.over_noise<y.over_noise||qa.EQ(A.over_noise,y.over_noise)&&(A.max_noise<y.max_noise||qa.EQ(A.max_noise,y.max_noise)&&A.tot_noise<=y.tot_noise);break;case 7:z=A.over_count<y.over_count||A.over_noise<y.over_noise}0==y.over_count&&(z=z&&A.bits<y.bits);z=z?1:0;if(0!=z)p=b.part2_3_length,q=h,b.assign(l),m=0,T.arraycopy(a,0,d,0,576);else if(0==e.full_outer_loop){if(++m>x&&0==
q.over_count)break;if(3==e.noise_shaping_amp&&t&&30<m)break;if(3==e.noise_shaping_amp&&t&&15<l.global_gain-w)break}}while(255>l.global_gain+l.scalefac_scale);3==e.noise_shaping_amp?t?r=!0:(l.assign(b),T.arraycopy(d,0,a,0,576),m=0,w=l.global_gain,t=!0):r=!0}f.VBR==G.vbr_rh||f.VBR==G.vbr_mtrh?T.arraycopy(d,0,a,0,576):0!=(e.substep_shaping&1)&&trancate_smallspectrums(e,b,n,a);return q.over_count};this.iteration_finish_one=function(c,b,k){var a=c.l3_side,f=a.tt[b][k];ha.best_scalefac_store(c,b,k,a);1==
c.use_best_huffman&&ha.best_huffman_divide(c,f);w.ResvAdjust(c,f)};this.VBR_encode_granule=function(c,b,k,a,m,n,e){var f=c.internal_flags,d=new rb,g=K(576),q=e,v=(e+n)/2,p=0,r=f.sfb21_extra;na.fill(d.l3_enc,0);do{f.sfb21_extra=v>q-42?!1:r;var t=outer_loop(c,b,k,a,m,v);0>=t?(p=1,e=b.part2_3_length,d.assign(b),T.arraycopy(a,0,g,0,576),e-=32,t=e-n,v=(e+n)/2):(n=v+32,t=e-n,v=(e+n)/2,0!=p&&(p=2,b.assign(d),T.arraycopy(g,0,a,0,576)))}while(12<t);f.sfb21_extra=r;2==p&&T.arraycopy(d.l3_enc,0,b.l3_enc,0,576)};
this.get_framebits=function(c,b){var f=c.internal_flags;f.bitrate_index=f.VBR_min_bitrate;n.getframebits(c);f.bitrate_index=1;var a=n.getframebits(c);for(var m=1;m<=f.VBR_max_bitrate;m++)f.bitrate_index=m,a=new xa(a),b[m]=w.ResvFrameBegin(c,a),a=a.bits};this.VBR_old_prepare=function(f,b,k,a,m,n,e,l,d){var g=f.internal_flags,q=1,v=0;g.bitrate_index=g.VBR_max_bitrate;var p=w.ResvFrameBegin(f,new xa(0))/g.mode_gr;get_framebits(f,n);for(var r=0;r<g.mode_gr;r++){var t=E.on_pe(f,b,l[r],p,r,0);g.mode_ext==
c.MPG_MD_MS_LR&&(ms_convert(g.l3_side,r),E.reduce_side(l[r],k[r],p,t));for(t=0;t<g.channels_out;++t){var u=g.l3_side.tt[r][t];if(u.block_type!=c.SHORT_TYPE){var h=1.28/(1+Math.exp(3.5-b[r][t]/300))-.05;h=g.PSY.mask_adjust-h}else h=2.56/(1+Math.exp(3.5-b[r][t]/300))-.14,h=g.PSY.mask_adjust_short-h;g.masking_lower=Math.pow(10,.1*h);init_outer_loop(g,u);d[r][t]=E.calc_xmin(f,a[r][t],u,m[r][t]);0!=d[r][t]&&(q=0);e[r][t]=126;v+=l[r][t]}}for(r=0;r<g.mode_gr;r++)for(t=0;t<g.channels_out;t++)v>n[g.VBR_max_bitrate]&&
(l[r][t]*=n[g.VBR_max_bitrate],l[r][t]/=v),e[r][t]>l[r][t]&&(e[r][t]=l[r][t]);return q};this.bitpressure_strategy=function(f,b,k,a){for(var m=0;m<f.mode_gr;m++)for(var n=0;n<f.channels_out;n++){for(var e=f.l3_side.tt[m][n],l=b[m][n],d=0,g=0;g<e.psy_lmax;g++)l[d++]*=1+.029*g*g/c.SBMAX_l/c.SBMAX_l;if(e.block_type==c.SHORT_TYPE)for(g=e.sfb_smin;g<c.SBMAX_s;g++)l[d++]*=1+.029*g*g/c.SBMAX_s/c.SBMAX_s,l[d++]*=1+.029*g*g/c.SBMAX_s/c.SBMAX_s,l[d++]*=1+.029*g*g/c.SBMAX_s/c.SBMAX_s;a[m][n]=0|Math.max(k[m][n],
.9*a[m][n])}};this.VBR_new_prepare=function(f,b,k,a,m,n){var e=f.internal_flags,l=1,d=0,g=0;if(f.free_format){e.bitrate_index=0;d=new xa(d);var q=w.ResvFrameBegin(f,d);d=d.bits;m[0]=q}else e.bitrate_index=e.VBR_max_bitrate,d=new xa(d),w.ResvFrameBegin(f,d),d=d.bits,get_framebits(f,m),q=m[e.VBR_max_bitrate];for(m=0;m<e.mode_gr;m++){E.on_pe(f,b,n[m],d,m,0);e.mode_ext==c.MPG_MD_MS_LR&&ms_convert(e.l3_side,m);for(var v=0;v<e.channels_out;++v){var p=e.l3_side.tt[m][v];e.masking_lower=Math.pow(10,.1*e.PSY.mask_adjust);
init_outer_loop(e,p);0!=E.calc_xmin(f,k[m][v],p,a[m][v])&&(l=0);g+=n[m][v]}}for(m=0;m<e.mode_gr;m++)for(v=0;v<e.channels_out;v++)g>q&&(n[m][v]*=q,n[m][v]/=g);return l};this.calc_target_bits=function(f,b,k,a,m,u){var e=f.internal_flags,l=e.l3_side;e.bitrate_index=e.VBR_max_bitrate;var d=new xa(0);u[0]=w.ResvFrameBegin(f,d);e.bitrate_index=1;d=n.getframebits(f)-8*e.sideinfo_len;m[0]=d/(e.mode_gr*e.channels_out);d=f.VBR_mean_bitrate_kbps*f.framesize*1E3;0!=(e.substep_shaping&1)&&(d*=1.09);d/=f.out_samplerate;
d-=8*e.sideinfo_len;d/=e.mode_gr*e.channels_out;var g=.93+.07*(11-f.compression_ratio)/5.5;.9>g&&(g=.9);1<g&&(g=1);for(f=0;f<e.mode_gr;f++){var q=0;for(m=0;m<e.channels_out;m++){a[f][m]=int(g*d);if(700<b[f][m]){var v=int((b[f][m]-700)/1.4),p=l.tt[f][m];a[f][m]=int(g*d);p.block_type==c.SHORT_TYPE&&v<d/2&&(v=d/2);v>3*d/2?v=3*d/2:0>v&&(v=0);a[f][m]+=v}a[f][m]>da.MAX_BITS_PER_CHANNEL&&(a[f][m]=da.MAX_BITS_PER_CHANNEL);q+=a[f][m]}if(q>da.MAX_BITS_PER_GRANULE)for(m=0;m<e.channels_out;++m)a[f][m]*=da.MAX_BITS_PER_GRANULE,
a[f][m]/=q}if(e.mode_ext==c.MPG_MD_MS_LR)for(f=0;f<e.mode_gr;f++)E.reduce_side(a[f],k[f],d*e.channels_out,da.MAX_BITS_PER_GRANULE);for(f=b=0;f<e.mode_gr;f++)for(m=0;m<e.channels_out;m++)a[f][m]>da.MAX_BITS_PER_CHANNEL&&(a[f][m]=da.MAX_BITS_PER_CHANNEL),b+=a[f][m];if(b>u[0])for(f=0;f<e.mode_gr;f++)for(m=0;m<e.channels_out;m++)a[f][m]*=u[0],a[f][m]/=b}}function Fc(){function u(b,c,a){for(var f=10,n=c+238-14-286,e=-15;0>e;e++){var l=k[f+-10];var d=b[n+-224]*l;var g=b[c+224]*l;l=k[f+-9];d+=b[n+-160]*
l;g+=b[c+160]*l;l=k[f+-8];d+=b[n+-96]*l;g+=b[c+96]*l;l=k[f+-7];d+=b[n+-32]*l;g+=b[c+32]*l;l=k[f+-6];d+=b[n+32]*l;g+=b[c+-32]*l;l=k[f+-5];d+=b[n+96]*l;g+=b[c+-96]*l;l=k[f+-4];d+=b[n+160]*l;g+=b[c+-160]*l;l=k[f+-3];d+=b[n+224]*l;g+=b[c+-224]*l;l=k[f+-2];d+=b[c+-256]*l;g-=b[n+256]*l;l=k[f+-1];d+=b[c+-192]*l;g-=b[n+192]*l;l=k[f+0];d+=b[c+-128]*l;g-=b[n+128]*l;l=k[f+1];d+=b[c+-64]*l;g-=b[n+64]*l;l=k[f+2];d+=b[c+0]*l;g-=b[n+0]*l;l=k[f+3];d+=b[c+64]*l;g-=b[n+-64]*l;l=k[f+4];d+=b[c+128]*l;g-=b[n+-128]*l;
l=k[f+5];d+=b[c+192]*l;g-=b[n+-192]*l;d*=k[f+6];l=g-d;a[30+2*e]=g+d;a[31+2*e]=k[f+7]*l;f+=18;c--;n++}g=b[c+-16]*k[f+-10];d=b[c+-32]*k[f+-2];g+=(b[c+-48]-b[c+16])*k[f+-9];d+=b[c+-96]*k[f+-1];g+=(b[c+-80]+b[c+48])*k[f+-8];d+=b[c+-160]*k[f+0];g+=(b[c+-112]-b[c+80])*k[f+-7];d+=b[c+-224]*k[f+1];g+=(b[c+-144]+b[c+112])*k[f+-6];d-=b[c+32]*k[f+2];g+=(b[c+-176]-b[c+144])*k[f+-5];d-=b[c+96]*k[f+3];g+=(b[c+-208]+b[c+176])*k[f+-4];d-=b[c+160]*k[f+4];g+=(b[c+-240]-b[c+208])*k[f+-3];d-=b[c+224];b=d-g;c=d+g;g=a[14];
d=a[15]-g;a[31]=c+g;a[30]=b+d;a[15]=b-d;a[14]=c-g;d=a[28]-a[0];a[0]+=a[28];a[28]=d*k[f+-36+7];d=a[29]-a[1];a[1]+=a[29];a[29]=d*k[f+-36+7];d=a[26]-a[2];a[2]+=a[26];a[26]=d*k[f+-72+7];d=a[27]-a[3];a[3]+=a[27];a[27]=d*k[f+-72+7];d=a[24]-a[4];a[4]+=a[24];a[24]=d*k[f+-108+7];d=a[25]-a[5];a[5]+=a[25];a[25]=d*k[f+-108+7];d=a[22]-a[6];a[6]+=a[22];a[22]=d*aa.SQRT2;d=a[23]-a[7];a[7]+=a[23];a[23]=d*aa.SQRT2-a[7];a[7]-=a[6];a[22]-=a[7];a[23]-=a[22];d=a[6];a[6]=a[31]-d;a[31]+=d;d=a[7];a[7]=a[30]-d;a[30]+=d;d=
a[22];a[22]=a[15]-d;a[15]+=d;d=a[23];a[23]=a[14]-d;a[14]+=d;d=a[20]-a[8];a[8]+=a[20];a[20]=d*k[f+-180+7];d=a[21]-a[9];a[9]+=a[21];a[21]=d*k[f+-180+7];d=a[18]-a[10];a[10]+=a[18];a[18]=d*k[f+-216+7];d=a[19]-a[11];a[11]+=a[19];a[19]=d*k[f+-216+7];d=a[16]-a[12];a[12]+=a[16];a[16]=d*k[f+-252+7];d=a[17]-a[13];a[13]+=a[17];a[17]=d*k[f+-252+7];d=-a[20]+a[24];a[20]+=a[24];a[24]=d*k[f+-216+7];d=-a[21]+a[25];a[21]+=a[25];a[25]=d*k[f+-216+7];d=a[4]-a[8];a[4]+=a[8];a[8]=d*k[f+-216+7];d=a[5]-a[9];a[5]+=a[9];a[9]=
d*k[f+-216+7];d=a[0]-a[12];a[0]+=a[12];a[12]=d*k[f+-72+7];d=a[1]-a[13];a[1]+=a[13];a[13]=d*k[f+-72+7];d=a[16]-a[28];a[16]+=a[28];a[28]=d*k[f+-72+7];d=-a[17]+a[29];a[17]+=a[29];a[29]=d*k[f+-72+7];d=aa.SQRT2*(a[2]-a[10]);a[2]+=a[10];a[10]=d;d=aa.SQRT2*(a[3]-a[11]);a[3]+=a[11];a[11]=d;d=aa.SQRT2*(-a[18]+a[26]);a[18]+=a[26];a[26]=d-a[18];d=aa.SQRT2*(-a[19]+a[27]);a[19]+=a[27];a[27]=d-a[19];d=a[2];a[19]-=a[3];a[3]-=d;a[2]=a[31]-d;a[31]+=d;d=a[3];a[11]-=a[19];a[18]-=d;a[3]=a[30]-d;a[30]+=d;d=a[18];a[27]-=
a[11];a[19]-=d;a[18]=a[15]-d;a[15]+=d;d=a[19];a[10]-=d;a[19]=a[14]-d;a[14]+=d;d=a[10];a[11]-=d;a[10]=a[23]-d;a[23]+=d;d=a[11];a[26]-=d;a[11]=a[22]-d;a[22]+=d;d=a[26];a[27]-=d;a[26]=a[7]-d;a[7]+=d;d=a[27];a[27]=a[6]-d;a[6]+=d;d=aa.SQRT2*(a[0]-a[4]);a[0]+=a[4];a[4]=d;d=aa.SQRT2*(a[1]-a[5]);a[1]+=a[5];a[5]=d;d=aa.SQRT2*(a[16]-a[20]);a[16]+=a[20];a[20]=d;d=aa.SQRT2*(a[17]-a[21]);a[17]+=a[21];a[21]=d;d=-aa.SQRT2*(a[8]-a[12]);a[8]+=a[12];a[12]=d-a[8];d=-aa.SQRT2*(a[9]-a[13]);a[9]+=a[13];a[13]=d-a[9];d=
-aa.SQRT2*(a[25]-a[29]);a[25]+=a[29];a[29]=d-a[25];d=-aa.SQRT2*(a[24]+a[28]);a[24]-=a[28];a[28]=d-a[24];d=a[24]-a[16];a[24]=d;d=a[20]-d;a[20]=d;d=a[28]-d;a[28]=d;d=a[25]-a[17];a[25]=d;d=a[21]-d;a[21]=d;d=a[29]-d;a[29]=d;d=a[17]-a[1];a[17]=d;d=a[9]-d;a[9]=d;d=a[25]-d;a[25]=d;d=a[5]-d;a[5]=d;d=a[21]-d;a[21]=d;d=a[13]-d;a[13]=d;d=a[29]-d;a[29]=d;d=a[1]-a[0];a[1]=d;d=a[16]-d;a[16]=d;d=a[17]-d;a[17]=d;d=a[8]-d;a[8]=d;d=a[9]-d;a[9]=d;d=a[24]-d;a[24]=d;d=a[25]-d;a[25]=d;d=a[4]-d;a[4]=d;d=a[5]-d;a[5]=d;d=
a[20]-d;a[20]=d;d=a[21]-d;a[21]=d;d=a[12]-d;a[12]=d;d=a[13]-d;a[13]=d;d=a[28]-d;a[28]=d;d=a[29]-d;a[29]=d;d=a[0];a[0]+=a[31];a[31]-=d;d=a[1];a[1]+=a[30];a[30]-=d;d=a[16];a[16]+=a[15];a[15]-=d;d=a[17];a[17]+=a[14];a[14]-=d;d=a[8];a[8]+=a[23];a[23]-=d;d=a[9];a[9]+=a[22];a[22]-=d;d=a[24];a[24]+=a[7];a[7]-=d;d=a[25];a[25]+=a[6];a[6]-=d;d=a[4];a[4]+=a[27];a[27]-=d;d=a[5];a[5]+=a[26];a[26]-=d;d=a[20];a[20]+=a[11];a[11]-=d;d=a[21];a[21]+=a[10];a[10]-=d;d=a[12];a[12]+=a[19];a[19]-=d;d=a[13];a[13]+=a[18];
a[18]-=d;d=a[28];a[28]+=a[3];a[3]-=d;d=a[29];a[29]+=a[2];a[2]-=d}var k=[-.1482523854003001,32.308141959636465,296.40344946382766,883.1344870032432,11113.947376231741,1057.2713659324597,305.7402417275812,30.825928907280012,3.8533188138216365,59.42900443849514,709.5899960123345,5281.91112291017,-5829.66483675846,-817.6293103748613,-76.91656988279972,-4.594269939176596,.9063471690191471,.1960342806591213,-.15466694054279598,34.324387823855965,301.8067566458425,817.599602898885,11573.795901679885,1181.2520595540152,
321.59731579894424,31.232021761053772,3.7107095756221318,53.650946155329365,684.167428119626,5224.56624370173,-6366.391851890084,-908.9766368219582,-89.83068876699639,-5.411397422890401,.8206787908286602,.3901806440322567,-.16070888947830023,36.147034243915876,304.11815768187864,732.7429163887613,11989.60988270091,1300.012278487897,335.28490093152146,31.48816102859945,3.373875931311736,47.232241542899175,652.7371796173471,5132.414255594984,-6909.087078780055,-1001.9990371107289,-103.62185754286375,
-6.104916304710272,.7416505462720353,.5805693545089249,-.16636367662261495,37.751650073343995,303.01103387567713,627.9747488785183,12358.763425278165,1412.2779918482834,346.7496836825721,31.598286663170416,3.1598635433980946,40.57878626349686,616.1671130880391,5007.833007176154,-7454.040671756168,-1095.7960341867115,-118.24411666465777,-6.818469345853504,.6681786379192989,.7653668647301797,-.1716176790982088,39.11551877123304,298.3413246578966,503.5259106886539,12679.589408408976,1516.5821921214542,
355.9850766329023,31.395241710249053,2.9164211881972335,33.79716964664243,574.8943997801362,4853.234992253242,-7997.57021486075,-1189.7624067269965,-133.6444792601766,-7.7202770609839915,.5993769336819237,.9427934736519954,-.17645823955292173,40.21879108166477,289.9982036694474,359.3226160751053,12950.259102786438,1612.1013903507662,362.85067106591504,31.045922092242872,2.822222032597987,26.988862316190684,529.8996541764288,4671.371946949588,-8535.899136645805,-1282.5898586244496,-149.58553632943463,
-8.643494270763135,.5345111359507916,1.111140466039205,-.36174739330527045,41.04429910497807,277.5463268268618,195.6386023135583,13169.43812144731,1697.6433561479398,367.40983966190305,30.557037410382826,2.531473372857427,20.070154905927314,481.50208566532336,4464.970341588308,-9065.36882077239,-1373.62841526722,-166.1660487028118,-9.58289321133207,.4729647758913199,1.268786568327291,-.36970682634889585,41.393213350082036,261.2935935556502,12.935476055240873,13336.131683328815,1772.508612059496,369.76534388639965,
29.751323653701338,2.4023193045459172,13.304795348228817,430.5615775526625,4237.0568611071185,-9581.931701634761,-1461.6913552409758,-183.12733958476446,-10.718010163869403,.41421356237309503,1.414213562373095,-.37677560326535325,41.619486213528496,241.05423794991074,-187.94665032361226,13450.063605744153,1836.153896465782,369.4908799925761,29.001847876923147,2.0714759319987186,6.779591200894186,377.7767837205709,3990.386575512536,-10081.709459700915,-1545.947424837898,-200.3762958015653,-11.864482073055006,
.3578057213145241,1.546020906725474,-.3829366947518991,41.1516456456653,216.47684307105183,-406.1569483347166,13511.136535077321,1887.8076599260432,367.3025214564151,28.136213436723654,1.913880671464418,.3829366947518991,323.85365704338597,3728.1472257487526,-10561.233882199509,-1625.2025997821418,-217.62525175416,-13.015432208941645,.3033466836073424,1.66293922460509,-.5822628872992417,40.35639251440489,188.20071124269245,-640.2706748618148,13519.21490106562,1927.6022433578062,362.8197642637487,
26.968821921868447,1.7463817695935329,-5.62650678237171,269.3016715297017,3453.386536448852,-11016.145278780888,-1698.6569643425091,-234.7658734267683,-14.16351421663124,.2504869601913055,1.76384252869671,-.5887180101749253,39.23429103868072,155.76096234403798,-889.2492977967378,13475.470561874661,1955.0535223723712,356.4450994756727,25.894952980042156,1.5695032905781554,-11.181939564328772,214.80884394039484,3169.1640829158237,-11443.321309975563,-1765.1588461316153,-251.68908574481912,-15.49755935939164,
.198912367379658,1.847759065022573,-.7912582233652842,37.39369355329111,119.699486012458,-1151.0956593239027,13380.446257078214,1970.3952110853447,348.01959814116185,24.731487364283044,1.3850130831637748,-16.421408865300393,161.05030052864092,2878.3322807850063,-11838.991423510031,-1823.985884688674,-268.2854986386903,-16.81724543849939,.1483359875383474,1.913880671464418,-.7960642926861912,35.2322109610459,80.01928065061526,-1424.0212633405113,13235.794061869668,1973.804052543835,337.9908651258184,
23.289159354463873,1.3934255946442087,-21.099669467133474,108.48348407242611,2583.700758091299,-12199.726194855148,-1874.2780658979746,-284.2467154529415,-18.11369784385905,.09849140335716425,1.961570560806461,-.998795456205172,32.56307803611191,36.958364584370486,-1706.075448829146,13043.287458812016,1965.3831106103316,326.43182772364605,22.175018750622293,1.198638339011324,-25.371248002043963,57.53505923036915,2288.41886619975,-12522.674544337233,-1914.8400385312243,-299.26241273417224,-19.37805630698734,
.04912684976946725,1.990369453344394,.0178904535*aa.SQRT2/2.384E-6,.008938074*aa.SQRT2/2.384E-6,.0015673635*aa.SQRT2/2.384E-6,.001228571*aa.SQRT2/2.384E-6,4.856585E-4*aa.SQRT2/2.384E-6,1.09434E-4*aa.SQRT2/2.384E-6,5.0783E-5*aa.SQRT2/2.384E-6,6.914E-6*aa.SQRT2/2.384E-6,12804.797818791945,1945.5515939597317,313.4244966442953,20.801593959731544,1995.1556208053692,9.000838926174497,-29.20218120805369],n=[[2.382191739347913E-13,6.423305872147834E-13,9.400849094049688E-13,1.122435026096556E-12,1.183840321267481E-12,
1.122435026096556E-12,9.40084909404969E-13,6.423305872147839E-13,2.382191739347918E-13,5.456116108943412E-12,4.878985199565852E-12,4.240448995017367E-12,3.559909094758252E-12,2.858043359288075E-12,2.156177623817898E-12,1.475637723558783E-12,8.371015190102974E-13,2.599706096327376E-13,-5.456116108943412E-12,-4.878985199565852E-12,-4.240448995017367E-12,-3.559909094758252E-12,-2.858043359288076E-12,-2.156177623817898E-12,-1.475637723558783E-12,-8.371015190102975E-13,-2.599706096327376E-13,-2.382191739347923E-13,
-6.423305872147843E-13,-9.400849094049696E-13,-1.122435026096556E-12,-1.183840321267481E-12,-1.122435026096556E-12,-9.400849094049694E-13,-6.42330587214784E-13,-2.382191739347918E-13],[2.382191739347913E-13,6.423305872147834E-13,9.400849094049688E-13,1.122435026096556E-12,1.183840321267481E-12,1.122435026096556E-12,9.400849094049688E-13,6.423305872147841E-13,2.382191739347918E-13,5.456116108943413E-12,4.878985199565852E-12,4.240448995017367E-12,3.559909094758253E-12,2.858043359288075E-12,2.156177623817898E-12,
1.475637723558782E-12,8.371015190102975E-13,2.599706096327376E-13,-5.461314069809755E-12,-4.921085770524055E-12,-4.343405037091838E-12,-3.732668368707687E-12,-3.093523840190885E-12,-2.430835727329465E-12,-1.734679010007751E-12,-9.74825365660928E-13,-2.797435120168326E-13,0,0,0,0,0,0,-2.283748241799531E-13,-4.037858874020686E-13,-2.146547464825323E-13],[.1316524975873958,.414213562373095,.7673269879789602,1.091308501069271,1.303225372841206,1.56968557711749,1.920982126971166,2.414213562373094,3.171594802363212,
4.510708503662055,7.595754112725146,22.90376554843115,.984807753012208,.6427876096865394,.3420201433256688,.9396926207859084,-.1736481776669303,-.7660444431189779,.8660254037844387,.5,-.5144957554275265,-.4717319685649723,-.3133774542039019,-.1819131996109812,-.09457419252642064,-.04096558288530405,-.01419856857247115,-.003699974673760037,.8574929257125442,.8817419973177052,.9496286491027329,.9833145924917901,.9955178160675857,.9991605581781475,.999899195244447,.9999931550702802],[0,0,0,0,0,0,2.283748241799531E-13,
4.037858874020686E-13,2.146547464825323E-13,5.461314069809755E-12,4.921085770524055E-12,4.343405037091838E-12,3.732668368707687E-12,3.093523840190885E-12,2.430835727329466E-12,1.734679010007751E-12,9.74825365660928E-13,2.797435120168326E-13,-5.456116108943413E-12,-4.878985199565852E-12,-4.240448995017367E-12,-3.559909094758253E-12,-2.858043359288075E-12,-2.156177623817898E-12,-1.475637723558782E-12,-8.371015190102975E-13,-2.599706096327376E-13,-2.382191739347913E-13,-6.423305872147834E-13,-9.400849094049688E-13,
-1.122435026096556E-12,-1.183840321267481E-12,-1.122435026096556E-12,-9.400849094049688E-13,-6.423305872147841E-13,-2.382191739347918E-13]],w=n[c.SHORT_TYPE],E=n[c.SHORT_TYPE],B=n[c.SHORT_TYPE],G=n[c.SHORT_TYPE],f=[0,1,16,17,8,9,24,25,4,5,20,21,12,13,28,29,2,3,18,19,10,11,26,27,6,7,22,23,14,15,30,31];this.mdct_sub48=function(b,k,a){for(var m=286,v=0;v<b.channels_out;v++){for(var e=0;e<b.mode_gr;e++){for(var l,d=b.l3_side.tt[e][v],g=d.xr,q=0,D=b.sb_sample[v][1-e],p=0,r=0;9>r;r++)for(u(k,m,D[p]),u(k,
m+32,D[p+1]),p+=2,m+=64,l=1;32>l;l+=2)D[p-1][l]*=-1;for(l=0;32>l;l++,q+=18){D=d.block_type;p=b.sb_sample[v][e];var t=b.sb_sample[v][1-e];0!=d.mixed_block_flag&&2>l&&(D=0);if(1E-12>b.amp_filter[l])na.fill(g,q+0,q+18,0);else{if(1>b.amp_filter[l])for(r=0;18>r;r++)t[r][f[l]]*=b.amp_filter[l];if(D==c.SHORT_TYPE){for(r=-3;0>r;r++){var J=n[c.SHORT_TYPE][r+3];g[q+3*r+9]=p[9+r][f[l]]*J-p[8-r][f[l]];g[q+3*r+18]=p[14-r][f[l]]*J+p[15+r][f[l]];g[q+3*r+10]=p[15+r][f[l]]*J-p[14-r][f[l]];g[q+3*r+19]=t[2-r][f[l]]*
J+t[3+r][f[l]];g[q+3*r+11]=t[3+r][f[l]]*J-t[2-r][f[l]];g[q+3*r+20]=t[8-r][f[l]]*J+t[9+r][f[l]]}r=g;p=q;for(J=0;3>J;J++){var h=r[p+6]*n[c.SHORT_TYPE][0]-r[p+15];t=r[p+0]*n[c.SHORT_TYPE][2]-r[p+9];var x=h+t;var y=h-t;h=r[p+15]*n[c.SHORT_TYPE][0]+r[p+6];t=r[p+9]*n[c.SHORT_TYPE][2]+r[p+0];var A=h+t;var N=-h+t;t=2.069978111953089E-11*(r[p+3]*n[c.SHORT_TYPE][1]-r[p+12]);h=2.069978111953089E-11*(r[p+12]*n[c.SHORT_TYPE][1]+r[p+3]);r[p+0]=1.90752519173728E-11*x+t;r[p+15]=1.90752519173728E-11*-A+h;y*=1.6519652744032674E-11;
A=9.537625958686404E-12*A+h;r[p+3]=y-A;r[p+6]=y+A;x=9.537625958686404E-12*x-t;N*=1.6519652744032674E-11;r[p+9]=x+N;r[p+12]=x-N;p++}}else{J=K(18);for(r=-9;0>r;r++)x=n[D][r+27]*t[r+9][f[l]]+n[D][r+36]*t[8-r][f[l]],y=n[D][r+9]*p[r+9][f[l]]-n[D][r+18]*p[8-r][f[l]],J[r+9]=x-y*w[3+r+9],J[r+18]=x*w[3+r+9]+y;r=g;p=q;x=J;var H=x[17]-x[9];var O=x[15]-x[11];var F=x[14]-x[12];N=x[0]+x[8];A=x[1]+x[7];h=x[2]+x[6];y=x[3]+x[5];r[p+17]=N+h-y-(A-x[4]);J=(N+h-y)*E[19]+(A-x[4]);t=(H-O-F)*E[18];r[p+5]=t+J;r[p+6]=t-J;
var C=(x[16]-x[10])*E[18];A=A*E[19]+x[4];t=H*E[12]+C+O*E[13]+F*E[14];J=-N*E[16]+A-h*E[17]+y*E[15];r[p+1]=t+J;r[p+2]=t-J;t=H*E[13]-C-O*E[14]+F*E[12];J=-N*E[17]+A-h*E[15]+y*E[16];r[p+9]=t+J;r[p+10]=t-J;t=H*E[14]-C+O*E[12]-F*E[13];J=N*E[15]-A+h*E[16]-y*E[17];r[p+13]=t+J;r[p+14]=t-J;H=x[8]-x[0];O=x[6]-x[2];F=x[5]-x[3];N=x[17]+x[9];A=x[16]+x[10];h=x[15]+x[11];y=x[14]+x[12];r[p+0]=N+h+y+(A+x[13]);t=(N+h+y)*E[19]-(A+x[13]);J=(H-O+F)*E[18];r[p+11]=t+J;r[p+12]=t-J;C=(x[7]-x[1])*E[18];A=x[13]-A*E[19];t=N*E[15]-
A+h*E[16]+y*E[17];J=H*E[14]+C+O*E[12]+F*E[13];r[p+3]=t+J;r[p+4]=t-J;t=-N*E[17]+A-h*E[15]-y*E[16];J=H*E[13]+C-O*E[14]-F*E[12];r[p+7]=t+J;r[p+8]=t-J;t=-N*E[16]+A-h*E[17]-y*E[15];J=H*E[12]-C+O*E[13]-F*E[14];r[p+15]=t+J;r[p+16]=t-J}}if(D!=c.SHORT_TYPE&&0!=l)for(r=7;0<=r;--r)D=g[q+r]*B[20+r]+g[q+-1-r]*G[28+r],p=g[q+r]*G[28+r]-g[q+-1-r]*B[20+r],g[q+-1-r]=D,g[q+r]=p}}k=a;m=286;if(1==b.mode_gr)for(e=0;18>e;e++)T.arraycopy(b.sb_sample[v][1][e],0,b.sb_sample[v][0][e],0,32)}}}function Xa(){this.thm=new Xb;this.en=
new Xb}function c(){var u=c.FFTOFFSET,k=c.MPG_MD_MS_LR,n=null,w=this.psy=null,E=null,B=null;this.setModules=function(c,b,k,a){n=c;w=this.psy=b;E=a;B=k};var ha=new Fc;this.lame_encode_mp3_frame=function(f,b,v,a,m,z){var e=Ob([2,2]);e[0][0]=new Xa;e[0][1]=new Xa;e[1][0]=new Xa;e[1][1]=new Xa;var l=Ob([2,2]);l[0][0]=new Xa;l[0][1]=new Xa;l[1][0]=new Xa;l[1][1]=new Xa;var d=[null,null],g=f.internal_flags,q=ca([2,4]),D=[.5,.5],p=[[0,0],[0,0]],r=[[0,0],[0,0]];d[0]=b;d[1]=v;if(0==g.lame_encode_frame_init){b=
f.internal_flags;var t,J;if(0==b.lame_encode_frame_init){v=K(2014);var h=K(2014);b.lame_encode_frame_init=1;for(J=t=0;t<286+576*(1+b.mode_gr);++t)t<576*b.mode_gr?(v[t]=0,2==b.channels_out&&(h[t]=0)):(v[t]=d[0][J],2==b.channels_out&&(h[t]=d[1][J]),++J);for(J=0;J<b.mode_gr;J++)for(t=0;t<b.channels_out;t++)b.l3_side.tt[J][t].block_type=c.SHORT_TYPE;ha.mdct_sub48(b,v,h)}}g.padding=0;0>(g.slot_lag-=g.frac_SpF)&&(g.slot_lag+=f.out_samplerate,g.padding=1);if(0!=g.psymodel)for(h=[null,null],t=0,J=X(2),v=
0;v<g.mode_gr;v++){for(b=0;b<g.channels_out;b++)h[b]=d[b],t=576+576*v-c.FFTOFFSET;b=f.VBR==G.vbr_mtrh||f.VBR==G.vbr_mt?w.L3psycho_anal_vbr(f,h,t,v,e,l,p[v],r[v],q[v],J):w.L3psycho_anal_ns(f,h,t,v,e,l,p[v],r[v],q[v],J);if(0!=b)return-4;f.mode==la.JOINT_STEREO&&(D[v]=q[v][2]+q[v][3],0<D[v]&&(D[v]=q[v][3]/D[v]));for(b=0;b<g.channels_out;b++){var x=g.l3_side.tt[v][b];x.block_type=J[b];x.mixed_block_flag=0}}else for(v=0;v<g.mode_gr;v++)for(b=0;b<g.channels_out;b++)g.l3_side.tt[v][b].block_type=c.NORM_TYPE,
g.l3_side.tt[v][b].mixed_block_flag=0,r[v][b]=p[v][b]=700;0==g.ATH.useAdjust?g.ATH.adjust=1:(b=g.loudness_sq[0][0],q=g.loudness_sq[1][0],2==g.channels_out?(b+=g.loudness_sq[0][1],q+=g.loudness_sq[1][1]):(b+=b,q+=q),2==g.mode_gr&&(b=Math.max(b,q)),b=.5*b*g.ATH.aaSensitivityP,.03125<b?(1<=g.ATH.adjust?g.ATH.adjust=1:g.ATH.adjust<g.ATH.adjustLimit&&(g.ATH.adjust=g.ATH.adjustLimit),g.ATH.adjustLimit=1):(q=31.98*b+6.25E-4,g.ATH.adjust>=q?(g.ATH.adjust*=.075*q+.925,g.ATH.adjust<q&&(g.ATH.adjust=q)):g.ATH.adjustLimit>=
q?g.ATH.adjust=q:g.ATH.adjust<g.ATH.adjustLimit&&(g.ATH.adjust=g.ATH.adjustLimit),g.ATH.adjustLimit=q));ha.mdct_sub48(g,d[0],d[1]);g.mode_ext=c.MPG_MD_LR_LR;if(f.force_ms)g.mode_ext=c.MPG_MD_MS_LR;else if(f.mode==la.JOINT_STEREO){for(v=h=q=0;v<g.mode_gr;v++)for(b=0;b<g.channels_out;b++)q+=r[v][b],h+=p[v][b];q<=1*h&&(q=g.l3_side.tt[0],b=g.l3_side.tt[g.mode_gr-1],q[0].block_type==q[1].block_type&&b[0].block_type==b[1].block_type&&(g.mode_ext=c.MPG_MD_MS_LR))}g.mode_ext==k&&(e=l,p=r);if(f.analysis&&
null!=g.pinfo)for(v=0;v<g.mode_gr;v++)for(b=0;b<g.channels_out;b++)g.pinfo.ms_ratio[v]=g.ms_ratio[v],g.pinfo.ms_ener_ratio[v]=D[v],g.pinfo.blocktype[v][b]=g.l3_side.tt[v][b].block_type,g.pinfo.pe[v][b]=p[v][b],T.arraycopy(g.l3_side.tt[v][b].xr,0,g.pinfo.xr[v][b],0,576),g.mode_ext==k&&(g.pinfo.ers[v][b]=g.pinfo.ers[v][b+2],T.arraycopy(g.pinfo.energy[v][b+2],0,g.pinfo.energy[v][b],0,g.pinfo.energy[v][b].length));if(f.VBR==G.vbr_off||f.VBR==G.vbr_abr){for(l=0;18>l;l++)g.nsPsy.pefirbuf[l]=g.nsPsy.pefirbuf[l+
1];for(v=r=0;v<g.mode_gr;v++)for(b=0;b<g.channels_out;b++)r+=p[v][b];g.nsPsy.pefirbuf[18]=r;r=g.nsPsy.pefirbuf[9];for(l=0;9>l;l++)r+=(g.nsPsy.pefirbuf[l]+g.nsPsy.pefirbuf[18-l])*c.fircoef[l];r=3350*g.mode_gr*g.channels_out/r;for(v=0;v<g.mode_gr;v++)for(b=0;b<g.channels_out;b++)p[v][b]*=r}g.iteration_loop.iteration_loop(f,p,D,e);n.format_bitstream(f);a=n.copy_buffer(g,a,m,z,1);f.bWriteVbrTag&&E.addVbrFrame(f);if(f.analysis&&null!=g.pinfo){for(b=0;b<g.channels_out;b++){for(m=0;m<u;m++)g.pinfo.pcmdata[b][m]=
g.pinfo.pcmdata[b][m+f.framesize];for(m=u;1600>m;m++)g.pinfo.pcmdata[b][m]=d[b][m-u]}B.set_frame_pinfo(f,e)}g.bitrate_stereoMode_Hist[g.bitrate_index][4]++;g.bitrate_stereoMode_Hist[15][4]++;2==g.channels_out&&(g.bitrate_stereoMode_Hist[g.bitrate_index][g.mode_ext]++,g.bitrate_stereoMode_Hist[15][g.mode_ext]++);for(f=0;f<g.mode_gr;++f)for(d=0;d<g.channels_out;++d)m=g.l3_side.tt[f][d].block_type|0,0!=g.l3_side.tt[f][d].mixed_block_flag&&(m=4),g.bitrate_blockType_Hist[g.bitrate_index][m]++,g.bitrate_blockType_Hist[g.bitrate_index][5]++,
g.bitrate_blockType_Hist[15][m]++,g.bitrate_blockType_Hist[15][5]++;return a}}function Gc(){this.size=this.pos=this.want=this.seen=this.sum=0;this.bag=null;this.TotalFrameSize=this.nBytesWritten=this.nVbrNumFrames=0}function Hc(){this.tt=[[null,null],[null,null]];this.resvDrain_post=this.resvDrain_pre=this.private_bits=this.main_data_begin=0;this.scfsi=[X(4),X(4)];for(var c=0;2>c;c++)for(var k=0;2>k;k++)this.tt[c][k]=new rb}function Ic(){this.last_en_subshort=ca([4,9]);this.lastAttacks=X(4);this.pefirbuf=
K(19);this.longfact=K(c.SBMAX_l);this.shortfact=K(c.SBMAX_s);this.attackthre_s=this.attackthre=0}function Xb(){this.l=K(c.SBMAX_l);this.s=ca([c.SBMAX_s,3]);var u=this;this.assign=function(k){T.arraycopy(k.l,0,u.l,0,c.SBMAX_l);for(var n=0;n<c.SBMAX_s;n++)for(var w=0;3>w;w++)u.s[n][w]=k.s[n][w]}}function da(){function u(){this.ptr=this.write_timing=0;this.buf=new Int8Array(40)}this.fill_buffer_resample_init=this.iteration_init_init=this.lame_encode_frame_init=this.Class_ID=0;this.mfbuf=ca([2,da.MFSIZE]);
this.full_outer_loop=this.use_best_huffman=this.subblock_gain=this.noise_shaping_stop=this.psymodel=this.substep_shaping=this.noise_shaping_amp=this.noise_shaping=this.highpass2=this.highpass1=this.lowpass2=this.lowpass1=this.mode_ext=this.samplerate_index=this.bitrate_index=this.VBR_max_bitrate=this.VBR_min_bitrate=this.mf_size=this.mf_samples_to_encode=this.resample_ratio=this.channels_out=this.channels_in=this.mode_gr=0;this.l3_side=new Hc;this.ms_ratio=K(2);this.slot_lag=this.frac_SpF=this.padding=
0;this.tag_spec=null;this.nMusicCRC=0;this.OldValue=X(2);this.CurrentStep=X(2);this.masking_lower=0;this.bv_scf=X(576);this.pseudohalf=X(sa.SFBMAX);this.sfb21_extra=!1;this.inbuf_old=Array(2);this.blackfilt=Array(2*da.BPC+1);this.itime=new Float64Array(2);this.sideinfo_len=0;this.sb_sample=ca([2,2,18,c.SBLIMIT]);this.amp_filter=K(32);this.header=Array(da.MAX_HEADER_BUF);this.ResvMax=this.ResvSize=this.ancillary_flag=this.w_ptr=this.h_ptr=0;this.scalefac_band=new za;this.minval_l=K(c.CBANDS);this.minval_s=
K(c.CBANDS);this.nb_1=ca([4,c.CBANDS]);this.nb_2=ca([4,c.CBANDS]);this.nb_s1=ca([4,c.CBANDS]);this.nb_s2=ca([4,c.CBANDS]);this.s3_ll=this.s3_ss=null;this.decay=0;this.thm=Array(4);this.en=Array(4);this.tot_ener=K(4);this.loudness_sq=ca([2,2]);this.loudness_sq_save=K(2);this.mld_l=K(c.SBMAX_l);this.mld_s=K(c.SBMAX_s);this.bm_l=X(c.SBMAX_l);this.bo_l=X(c.SBMAX_l);this.bm_s=X(c.SBMAX_s);this.bo_s=X(c.SBMAX_s);this.npart_s=this.npart_l=0;this.s3ind=Ia([c.CBANDS,2]);this.s3ind_s=Ia([c.CBANDS,2]);this.numlines_s=
X(c.CBANDS);this.numlines_l=X(c.CBANDS);this.rnumlines_l=K(c.CBANDS);this.mld_cb_l=K(c.CBANDS);this.mld_cb_s=K(c.CBANDS);this.numlines_l_num1=this.numlines_s_num1=0;this.pe=K(4);this.ms_ener_ratio_old=this.ms_ratio_l_old=this.ms_ratio_s_old=0;this.blocktype_old=X(2);this.nsPsy=new Ic;this.VBR_seek_table=new Gc;this.PSY=this.ATH=null;this.nogap_current=this.nogap_total=0;this.findPeakSample=this.findReplayGain=this.decode_on_the_fly=!0;this.AudiophileGain=this.RadioGain=this.PeakSample=0;this.rgdata=
null;this.noclipScale=this.noclipGainChange=0;this.bitrate_stereoMode_Hist=Ia([16,5]);this.bitrate_blockType_Hist=Ia([16,6]);this.hip=this.pinfo=null;this.in_buffer_nsamples=0;this.iteration_loop=this.in_buffer_1=this.in_buffer_0=null;for(var k=0;k<this.en.length;k++)this.en[k]=new Xb;for(k=0;k<this.thm.length;k++)this.thm[k]=new Xb;for(k=0;k<this.header.length;k++)this.header[k]=new u}function Jc(){function u(c,k,f){var b=0;f<<=1;var n=k+f;var a=4;do{var m;var u=a>>1;var e=a;var l=a<<1;var d=l+e;
a=l<<1;var g=k;var q=g+u;do{var B=c[g+0]-c[g+e];var p=c[g+0]+c[g+e];var r=c[g+l]-c[g+d];var t=c[g+l]+c[g+d];c[g+l]=p-t;c[g+0]=p+t;c[g+d]=B-r;c[g+e]=B+r;B=c[q+0]-c[q+e];p=c[q+0]+c[q+e];r=aa.SQRT2*c[q+d];t=aa.SQRT2*c[q+l];c[q+l]=p-t;c[q+0]=p+t;c[q+d]=B-r;c[q+e]=B+r;q+=a;g+=a}while(g<n);var E=w[b+0];var h=w[b+1];for(m=1;m<u;m++){var x=1-2*h*h;var y=2*h*E;g=k+m;q=k+e-m;do{var A=y*c[g+e]-x*c[q+e];t=x*c[g+e]+y*c[q+e];B=c[g+0]-t;p=c[g+0]+t;var K=c[q+0]-A;var H=c[q+0]+A;A=y*c[g+d]-x*c[q+d];t=x*c[g+d]+y*c[q+
d];r=c[g+l]-t;t=c[g+l]+t;var O=c[q+l]-A;var F=c[q+l]+A;A=h*t-E*O;t=E*t+h*O;c[g+l]=p-t;c[g+0]=p+t;c[q+d]=K-A;c[q+e]=K+A;A=E*F-h*r;t=h*F+E*r;c[q+l]=H-t;c[q+0]=H+t;c[g+d]=B-A;c[g+e]=B+A;q+=a;g+=a}while(g<n);x=E;E=x*w[b+0]-h*w[b+1];h=x*w[b+1]+h*w[b+0]}b+=2}while(a<f)}var k=K(c.BLKSIZE),n=K(c.BLKSIZE_s/2),w=[.9238795325112867,.3826834323650898,.9951847266721969,.0980171403295606,.9996988186962042,.02454122852291229,.9999811752826011,.006135884649154475],E=[0,128,64,192,32,160,96,224,16,144,80,208,48,176,
112,240,8,136,72,200,40,168,104,232,24,152,88,216,56,184,120,248,4,132,68,196,36,164,100,228,20,148,84,212,52,180,116,244,12,140,76,204,44,172,108,236,28,156,92,220,60,188,124,252,2,130,66,194,34,162,98,226,18,146,82,210,50,178,114,242,10,138,74,202,42,170,106,234,26,154,90,218,58,186,122,250,6,134,70,198,38,166,102,230,22,150,86,214,54,182,118,246,14,142,78,206,46,174,110,238,30,158,94,222,62,190,126,254];this.fft_short=function(k,w,f,b,v){for(k=0;3>k;k++){var a=c.BLKSIZE_s/2,m=65535&192*(k+1),B=
c.BLKSIZE_s/8-1;do{var e=E[B<<2]&255;var l=n[e]*b[f][v+e+m];var d=n[127-e]*b[f][v+e+m+128];var g=l-d;l+=d;var q=n[e+64]*b[f][v+e+m+64];d=n[63-e]*b[f][v+e+m+192];var D=q-d;q+=d;a-=4;w[k][a+0]=l+q;w[k][a+2]=l-q;w[k][a+1]=g+D;w[k][a+3]=g-D;l=n[e+1]*b[f][v+e+m+1];d=n[126-e]*b[f][v+e+m+129];g=l-d;l+=d;q=n[e+65]*b[f][v+e+m+65];d=n[62-e]*b[f][v+e+m+193];D=q-d;q+=d;w[k][a+c.BLKSIZE_s/2+0]=l+q;w[k][a+c.BLKSIZE_s/2+2]=l-q;w[k][a+c.BLKSIZE_s/2+1]=g+D;w[k][a+c.BLKSIZE_s/2+3]=g-D}while(0<=--B);u(w[k],a,c.BLKSIZE_s/
2)}};this.fft_long=function(n,w,f,b,v){n=c.BLKSIZE/8-1;var a=c.BLKSIZE/2;do{var m=E[n]&255;var B=k[m]*b[f][v+m];var e=k[m+512]*b[f][v+m+512];var l=B-e;B+=e;var d=k[m+256]*b[f][v+m+256];e=k[m+768]*b[f][v+m+768];var g=d-e;d+=e;a-=4;w[a+0]=B+d;w[a+2]=B-d;w[a+1]=l+g;w[a+3]=l-g;B=k[m+1]*b[f][v+m+1];e=k[m+513]*b[f][v+m+513];l=B-e;B+=e;d=k[m+257]*b[f][v+m+257];e=k[m+769]*b[f][v+m+769];g=d-e;d+=e;w[a+c.BLKSIZE/2+0]=B+d;w[a+c.BLKSIZE/2+2]=B-d;w[a+c.BLKSIZE/2+1]=l+g;w[a+c.BLKSIZE/2+3]=l-g}while(0<=--n);u(w,
a,c.BLKSIZE/2)};this.init_fft=function(u){for(u=0;u<c.BLKSIZE;u++)k[u]=.42-.5*Math.cos(2*Math.PI*(u+.5)/c.BLKSIZE)+.08*Math.cos(4*Math.PI*(u+.5)/c.BLKSIZE);for(u=0;u<c.BLKSIZE_s/2;u++)n[u]=.5*(1-Math.cos(2*Math.PI*(u+.5)/c.BLKSIZE_s))}}function Pb(){function u(a,d){for(var b=0,h=0;h<c.BLKSIZE/2;++h)b+=a[h]*d.ATH.eql_w[h];return b*=D}function k(a,c,d,b,f,e){if(c>a)if(c<a*r)var g=c/a;else return a+c;else{if(a>=c*r)return a+c;g=a/c}a+=c;if(6>=b+3){if(g>=p)return a;b=0|aa.FAST_LOG10_X(g,16);return a*
x[b]}b=0|aa.FAST_LOG10_X(g,16);c=0!=e?f.ATH.cb_s[d]*f.ATH.adjust:f.ATH.cb_l[d]*f.ATH.adjust;return a<t*c?a>c?(d=1,13>=b&&(d=y[b]),c=aa.FAST_LOG10_X(a/c,10/15),a*((h[b]-d)*c+d)):13<b?a:a*y[b]:a*h[b]}function n(a,c,d){0>a&&(a=0);0>c&&(c=0);if(0>=a)return c;if(0>=c)return a;var b=c>a?c/a:a/c;if(-2<=d&&2>=d){if(b>=p)return a+c;d=0|aa.FAST_LOG10_X(b,16);return(a+c)*A[d]}if(b<r)return a+c;a<c&&(a=c);return a}function w(a,d,b,h,f){var e,g,l=0,k=0;for(e=g=0;e<c.SBMAX_s;++g,++e){var m=a.bo_s[e],y=a.npart_s;
for(m=m<y?m:y;g<m;)l+=d[g],k+=b[g],g++;a.en[h].s[e][f]=l;a.thm[h].s[e][f]=k;if(g>=y){++e;break}k=a.PSY.bo_s_weight[e];y=1-k;l=k*d[g];k*=b[g];a.en[h].s[e][f]+=l;a.thm[h].s[e][f]+=k;l=y*d[g];k=y*b[g]}for(;e<c.SBMAX_s;++e)a.en[h].s[e][f]=0,a.thm[h].s[e][f]=0}function E(a,d,b,h){var f,e,g=0,l=0;for(f=e=0;f<c.SBMAX_l;++e,++f){var k=a.bo_l[f],m=a.npart_l;for(k=k<m?k:m;e<k;)g+=d[e],l+=b[e],e++;a.en[h].l[f]=g;a.thm[h].l[f]=l;if(e>=m){++f;break}l=a.PSY.bo_l_weight[f];m=1-l;g=l*d[e];l*=b[e];a.en[h].l[f]+=g;
a.thm[h].l[f]+=l;g=m*d[e];l=m*b[e]}for(;f<c.SBMAX_l;++f)a.en[h].l[f]=0,a.thm[h].l[f]=0}function B(a,c,d){return 1<=d?a:0>=d?c:0<c?Math.pow(a/c,d)*c:0}function W(a,d){for(var b=309.07,h=0;h<c.SBMAX_s-1;h++)for(var f=0;3>f;f++){var e=a.thm.s[h][f];if(0<e){e*=d;var g=a.en.s[h][f];g>e&&(b=g>1E10*e?b+23.02585092994046*N[h]:b+N[h]*aa.FAST_LOG10(g/e))}}return b}function f(a,d){for(var b=281.0575,h=0;h<c.SBMAX_l-1;h++){var f=a.thm.l[h];if(0<f){f*=d;var e=a.en.l[h];e>f&&(b=e>1E10*f?b+23.02585092994046*H[h]:
b+H[h]*aa.FAST_LOG10(e/f))}}return b}function b(a,c,b,d,h){var f,e;for(f=e=0;f<a.npart_l;++f){var g=0,l=0,k;for(k=0;k<a.numlines_l[f];++k,++e){var m=c[e];g+=m;l<m&&(l=m)}b[f]=g;d[f]=l;h[f]=g*a.rnumlines_l[f]}}function v(a,c,b,d){var h=J.length-1,f=0,e=b[f]+b[f+1];if(0<e){var g=c[f];g<c[f+1]&&(g=c[f+1]);e=20*(2*g-e)/(e*(a.numlines_l[f]+a.numlines_l[f+1]-1));e|=0;e>h&&(e=h);d[f]=e}else d[f]=0;for(f=1;f<a.npart_l-1;f++)e=b[f-1]+b[f]+b[f+1],0<e?(g=c[f-1],g<c[f]&&(g=c[f]),g<c[f+1]&&(g=c[f+1]),e=20*(3*
g-e)/(e*(a.numlines_l[f-1]+a.numlines_l[f]+a.numlines_l[f+1]-1)),e|=0,e>h&&(e=h),d[f]=e):d[f]=0;e=b[f-1]+b[f];0<e?(g=c[f-1],g<c[f]&&(g=c[f]),e=20*(2*g-e)/(e*(a.numlines_l[f-1]+a.numlines_l[f]-1)),e|=0,e>h&&(e=h),d[f]=e):d[f]=0}function a(a,c,b,d,f,h,e){var g=2*h;f=0<h?Math.pow(10,f):1;for(var l,k,m=0;m<e;++m){var y=a[2][m],p=a[3][m],q=c[0][m],n=c[1][m],x=c[2][m],r=c[3][m];q<=1.58*n&&n<=1.58*q?(l=b[m]*y,k=Math.max(x,Math.min(r,b[m]*p)),l=Math.max(r,Math.min(x,l))):(k=x,l=r);0<h&&(r=d[m]*f,q=Math.min(Math.max(q,
r),Math.max(n,r)),x=Math.max(k,r),r=Math.max(l,r),n=x+r,0<n&&q*g<n&&(q=q*g/n,x*=q,r*=q),k=Math.min(x,k),l=Math.min(r,l));k>y&&(k=y);l>p&&(l=p);c[2][m]=k;c[3][m]=l}}function m(a,c){a=0<=a?27*-a:a*c;return-72>=a?0:Math.exp(.2302585093*a)}function z(a){0>a&&(a=0);a*=.001;return 13*Math.atan(.76*a)+3.5*Math.atan(a*a/56.25)}function e(a,b,d,f,h,e,g,l,k,m,y,p){var q=K(c.CBANDS+1),n=l/(15<p?1152:384),x=X(c.HBLKSIZE),r;l/=k;var u=0,C=0;for(r=0;r<c.CBANDS;r++){var t;var A=z(l*u);q[r]=l*u;for(t=u;.34>z(l*t)-
A&&t<=k/2;t++);a[r]=t-u;for(C=r+1;u<t;)x[u++]=r;if(u>k/2){u=k/2;++r;break}}q[r]=l*u;for(u=0;u<p;u++)r=m[u],A=m[u+1],r=0|Math.floor(.5+y*(r-.5)),0>r&&(r=0),t=0|Math.floor(.5+y*(A-.5)),t>k/2&&(t=k/2),d[u]=(x[r]+x[t])/2,b[u]=x[t],g[u]=(n*A-q[b[u]])/(q[b[u]+1]-q[b[u]]),0>g[u]?g[u]=0:1<g[u]&&(g[u]=1),A=z(l*m[u]*y),A=Math.min(A,15.5)/15.5,e[u]=Math.pow(10,1.25*(1-Math.cos(Math.PI*A))-2.5);for(b=u=0;b<C;b++)d=a[b],A=z(l*u),e=z(l*(u+d-1)),f[b]=.5*(A+e),A=z(l*(u-.5)),e=z(l*(u+d-.5)),h[b]=e-A,u+=d;return C}
function l(a,b,d,f,h,e){var g=ca([c.CBANDS,c.CBANDS]),l=0;if(e)for(var k=0;k<b;k++)for(e=0;e<b;e++){var y=d[k]-d[e];y=0<=y?3*y:1.5*y;if(.5<=y&&2.5>=y){var p=y-.5;p=8*(p*p-2*p)}else p=0;y+=.474;y=15.811389+7.5*y-17.5*Math.sqrt(1+y*y);-60>=y?p=0:(y=Math.exp(.2302585093*(p+y)),p=y/.6609193);y=p*f[e];g[k][e]=y*h[k]}else for(e=0;e<b;e++){p=15+Math.min(21/d[e],12);var q;var n;k=p;for(q=0;1E-20<m(q,k);--q);var x=q;for(n=0;1E-12<Math.abs(n-x);)q=(n+x)/2,0<m(q,k)?n=q:x=q;y=x;for(q=0;1E-20<m(q,k);q+=1);x=0;
for(n=q;1E-12<Math.abs(n-x);)q=(n+x)/2,0<m(q,k)?x=q:n=q;x=n;var r=0;for(n=0;1E3>=n;++n)q=y+n*(x-y)/1E3,q=m(q,k),r+=q;q=1001/(r*(x-y));for(k=0;k<b;k++)y=q*m(d[k]-d[e],p)*f[e],g[k][e]=y*h[k]}for(k=0;k<b;k++){for(e=0;e<b&&!(0<g[k][e]);e++);a[k][0]=e;for(e=b-1;0<e&&!(0<g[k][e]);e--);a[k][1]=e;l+=a[k][1]-a[k][0]+1}d=K(l);for(k=f=0;k<b;k++)for(e=a[k][0];e<=a[k][1];e++)d[f++]=g[k][e];return d}function d(a){a=z(a);a=Math.min(a,15.5)/15.5;return Math.pow(10,1.25*(1-Math.cos(Math.PI*a))-2.5)}function g(a,c){-.3>
a&&(a=3410);a=Math.max(.1,a/1E3);return 3.64*Math.pow(a,-.8)-6.8*Math.exp(-.6*Math.pow(a-3.4,2))+6*Math.exp(-.15*Math.pow(a-8.7,2))+.001*(.6+.04*c)*Math.pow(a,4)}var q=new Jc,D=1/217621504/(c.BLKSIZE/2),p,r,t,J=[1,.79433,.63096,.63096,.63096,.63096,.63096,.25119,.11749],h=[3.3246*3.3246,3.23837*3.23837,9.9500500969,9.0247369744,8.1854926609,7.0440875649,2.46209*2.46209,2.284*2.284,4.4892710641,1.96552*1.96552,1.82335*1.82335,1.69146*1.69146,2.4621061921,2.1508568964,1.37074*1.37074,1.31036*1.31036,
1.5691069696,1.4555939904,1.16203*1.16203,1.2715945225,1.09428*1.09428,1.0659*1.0659,1.0779838276,1.0382591025,1],x=[1.7782755904,1.35879*1.35879,1.38454*1.38454,1.39497*1.39497,1.40548*1.40548,1.3537*1.3537,1.6999465924,1.22321*1.22321,1.3169398564,1],y=[5.5396212496,2.29259*2.29259,4.9868695969,2.12675*2.12675,2.02545*2.02545,1.87894*1.87894,1.74303*1.74303,1.61695*1.61695,2.2499700001,1.39148*1.39148,1.29083*1.29083,1.19746*1.19746,1.2339655056,1.0779838276],A=[1.7782755904,1.35879*1.35879,1.38454*
1.38454,1.39497*1.39497,1.40548*1.40548,1.3537*1.3537,1.6999465924,1.22321*1.22321,1.3169398564,1],N=[11.8,13.6,17.2,32,46.5,51.3,57.5,67.1,71.5,84.6,97.6,130],H=[6.8,5.8,5.8,6.4,6.5,9.9,12.1,14.4,15,18.9,21.6,26.9,34.2,40.2,46.8,56.5,60.7,73.9,85.7,93.4,126.1],O=[-1.730326E-17,-.01703172,-1.349528E-17,.0418072,-6.73278E-17,-.0876324,-3.0835E-17,.1863476,-1.104424E-16,-.627638];this.L3psycho_anal_ns=function(a,d,h,e,g,l,m,y,p,n){var x=a.internal_flags,r=ca([2,c.BLKSIZE]),t=ca([2,3,c.BLKSIZE_s]),A=
K(c.CBANDS+1),I=K(c.CBANDS+1),C=K(c.CBANDS+2),Q=X(2),S=X(2),z,D,F,H,N,Z,L,V=ca([2,576]),ma=X(c.CBANDS+2),R=X(c.CBANDS+2);na.fill(R,0);var T=x.channels_out;a.mode==la.JOINT_STEREO&&(T=4);var M=a.VBR==G.vbr_off?0==x.ResvMax?0:x.ResvSize/x.ResvMax*.5:a.VBR==G.vbr_rh||a.VBR==G.vbr_mtrh||a.VBR==G.vbr_mt?.6:1;for(z=0;z<x.channels_out;z++){var Y=d[z],ha=h+576-350-21+192;for(F=0;576>F;F++){var U;var da=Y[ha+F+10];for(H=U=0;9>H;H+=2)da+=O[H]*(Y[ha+F+H]+Y[ha+F+21-H]),U+=O[H+1]*(Y[ha+F+H+1]+Y[ha+F+21-H-1]);
V[z][F]=da+U}g[e][z].en.assign(x.en[z]);g[e][z].thm.assign(x.thm[z]);2<T&&(l[e][z].en.assign(x.en[z+2]),l[e][z].thm.assign(x.thm[z+2]))}for(z=0;z<T;z++){var Qa=K(12),ya=[0,0,0,0],qa=K(12),ia=1,sa=K(c.CBANDS),Fa=K(c.CBANDS),ta=[0,0,0,0],za=K(c.HBLKSIZE),Wb=ca([3,c.HBLKSIZE_s]);for(F=0;3>F;F++)Qa[F]=x.nsPsy.last_en_subshort[z][F+6],qa[F]=Qa[F]/x.nsPsy.last_en_subshort[z][F+4],ya[0]+=Qa[F];if(2==z)for(F=0;576>F;F++){var Ya=V[0][F];var Xa=V[1][F];V[0][F]=Ya+Xa;V[1][F]=Ya-Xa}var Ia=V[z&1],ec=0;for(F=0;9>
F;F++){for(var xa=ec+64,Ga=1;ec<xa;ec++)Ga<Math.abs(Ia[ec])&&(Ga=Math.abs(Ia[ec]));x.nsPsy.last_en_subshort[z][F]=Qa[F+3]=Ga;ya[1+F/3]+=Ga;Ga=Ga>Qa[F+3-2]?Ga/Qa[F+3-2]:Qa[F+3-2]>10*Ga?Qa[F+3-2]/(10*Ga):0;qa[F+3]=Ga}if(a.analysis){var Qb=qa[0];for(F=1;12>F;F++)Qb<qa[F]&&(Qb=qa[F]);x.pinfo.ers[e][z]=x.pinfo.ers_save[z];x.pinfo.ers_save[z]=Qb}var Ma=3==z?x.nsPsy.attackthre_s:x.nsPsy.attackthre;for(F=0;12>F;F++)0==ta[F/3]&&qa[F]>Ma&&(ta[F/3]=F%3+1);for(F=1;4>F;F++)1.7>(ya[F-1]>ya[F]?ya[F-1]/ya[F]:ya[F]/
ya[F-1])&&(ta[F]=0,1==F&&(ta[0]=0));0!=ta[0]&&0!=x.nsPsy.lastAttacks[z]&&(ta[0]=0);if(3==x.nsPsy.lastAttacks[z]||0!=ta[0]+ta[1]+ta[2]+ta[3])ia=0,0!=ta[1]&&0!=ta[0]&&(ta[1]=0),0!=ta[2]&&0!=ta[1]&&(ta[2]=0),0!=ta[3]&&0!=ta[2]&&(ta[3]=0);2>z?S[z]=ia:0==ia&&(S[0]=S[1]=0);p[z]=x.tot_ener[z];var P=a,Ha=za,Gb=Wb,La=r,kb=z&1,Ra=t,Na=z&1,cb=e,Aa=z,va=d,qb=h,Va=P.internal_flags;if(2>Aa)q.fft_long(Va,La[kb],Aa,va,qb),q.fft_short(Va,Ra[Na],Aa,va,qb);else if(2==Aa){for(var ja=c.BLKSIZE-1;0<=ja;--ja){var Hb=La[kb+
0][ja],Ib=La[kb+1][ja];La[kb+0][ja]=(Hb+Ib)*aa.SQRT2*.5;La[kb+1][ja]=(Hb-Ib)*aa.SQRT2*.5}for(var Ba=2;0<=Ba;--Ba)for(ja=c.BLKSIZE_s-1;0<=ja;--ja)Hb=Ra[Na+0][Ba][ja],Ib=Ra[Na+1][Ba][ja],Ra[Na+0][Ba][ja]=(Hb+Ib)*aa.SQRT2*.5,Ra[Na+1][Ba][ja]=(Hb-Ib)*aa.SQRT2*.5}Ha[0]=La[kb+0][0];Ha[0]*=Ha[0];for(ja=c.BLKSIZE/2-1;0<=ja;--ja){var fc=La[kb+0][c.BLKSIZE/2-ja],tb=La[kb+0][c.BLKSIZE/2+ja];Ha[c.BLKSIZE/2-ja]=.5*(fc*fc+tb*tb)}for(Ba=2;0<=Ba;--Ba)for(Gb[Ba][0]=Ra[Na+0][Ba][0],Gb[Ba][0]*=Gb[Ba][0],ja=c.BLKSIZE_s/
2-1;0<=ja;--ja)fc=Ra[Na+0][Ba][c.BLKSIZE_s/2-ja],tb=Ra[Na+0][Ba][c.BLKSIZE_s/2+ja],Gb[Ba][c.BLKSIZE_s/2-ja]=.5*(fc*fc+tb*tb);var oa=0;for(ja=11;ja<c.HBLKSIZE;ja++)oa+=Ha[ja];Va.tot_ener[Aa]=oa;if(P.analysis){for(ja=0;ja<c.HBLKSIZE;ja++)Va.pinfo.energy[cb][Aa][ja]=Va.pinfo.energy_save[Aa][ja],Va.pinfo.energy_save[Aa][ja]=Ha[ja];Va.pinfo.pe[cb][Aa]=Va.pe[Aa]}2==P.athaa_loudapprox&&2>Aa&&(Va.loudness_sq[cb][Aa]=Va.loudness_sq_save[Aa],Va.loudness_sq_save[Aa]=u(Ha,Va));b(x,za,A,sa,Fa);v(x,sa,Fa,ma);for(L=
0;3>L;L++){var ea=void 0,Ab=void 0,Bb=Wb,Sa=I,Za=C,ub=z,zb=L,Ja=a.internal_flags;for(ea=Ab=0;ea<Ja.npart_s;++ea){for(var Rb=0,rb=0,db=Ja.numlines_s[ea],sb=0;sb<db;++sb,++Ab){var Cb=Bb[zb][Ab];Rb+=Cb;rb<Cb&&(rb=Cb)}Sa[ea]=Rb}for(Ab=ea=0;ea<Ja.npart_s;ea++){var Db=Ja.s3ind_s[ea][0],$a=Ja.s3_ss[Ab++]*Sa[Db];for(++Db;Db<=Ja.s3ind_s[ea][1];)$a+=Ja.s3_ss[Ab]*Sa[Db],++Ab,++Db;var vb=2*Ja.nb_s1[ub][ea];Za[ea]=Math.min($a,vb);Ja.blocktype_old[ub&1]==c.SHORT_TYPE&&(vb=16*Ja.nb_s2[ub][ea],Za[ea]=Math.min(vb,
Za[ea]));Ja.nb_s2[ub][ea]=Ja.nb_s1[ub][ea];Ja.nb_s1[ub][ea]=$a}for(;ea<=c.CBANDS;++ea)Sa[ea]=0,Za[ea]=0;w(x,I,C,z,L);for(Z=0;Z<c.SBMAX_s;Z++){var Ta=x.thm[z].s[Z][L];Ta*=.8;if(2<=ta[L]||1==ta[L+1]){var wb=0!=L?L-1:2;Ga=B(x.thm[z].s[Z][wb],Ta,.6*M);Ta=Math.min(Ta,Ga)}if(1==ta[L])wb=0!=L?L-1:2,Ga=B(x.thm[z].s[Z][wb],Ta,.3*M),Ta=Math.min(Ta,Ga);else if(0!=L&&3==ta[L-1]||0==L&&3==x.nsPsy.lastAttacks[z])wb=2!=L?L+1:0,Ga=B(x.thm[z].s[Z][wb],Ta,.3*M),Ta=Math.min(Ta,Ga);var Yb=Qa[3*L+3]+Qa[3*L+4]+Qa[3*L+
5];6*Qa[3*L+5]<Yb&&(Ta*=.5,6*Qa[3*L+4]<Yb&&(Ta*=.5));x.thm[z].s[Z][L]=Ta}}x.nsPsy.lastAttacks[z]=ta[2];for(D=N=0;D<x.npart_l;D++){for(var eb=x.s3ind[D][0],Jb=A[eb]*J[ma[eb]],lb=x.s3_ll[N++]*Jb;++eb<=x.s3ind[D][1];)Jb=A[eb]*J[ma[eb]],lb=k(lb,x.s3_ll[N++]*Jb,eb,eb-D,x,0);lb*=.158489319246111;C[D]=x.blocktype_old[z&1]==c.SHORT_TYPE?lb:B(Math.min(lb,Math.min(2*x.nb_1[z][D],16*x.nb_2[z][D])),lb,M);x.nb_2[z][D]=x.nb_1[z][D];x.nb_1[z][D]=lb}for(;D<=c.CBANDS;++D)A[D]=0,C[D]=0;E(x,A,C,z)}if((a.mode==la.STEREO||
a.mode==la.JOINT_STEREO)&&0<a.interChRatio){var xb=a.interChRatio,fa=a.internal_flags;if(1<fa.channels_out){for(var Ca=0;Ca<c.SBMAX_l;Ca++){var Sb=fa.thm[0].l[Ca],Eb=fa.thm[1].l[Ca];fa.thm[0].l[Ca]+=Eb*xb;fa.thm[1].l[Ca]+=Sb*xb}for(Ca=0;Ca<c.SBMAX_s;Ca++)for(var fb=0;3>fb;fb++)Sb=fa.thm[0].s[Ca][fb],Eb=fa.thm[1].s[Ca][fb],fa.thm[0].s[Ca][fb]+=Eb*xb,fa.thm[1].s[Ca][fb]+=Sb*xb}}if(a.mode==la.JOINT_STEREO){for(var Oa,ka=0;ka<c.SBMAX_l;ka++)if(!(x.thm[0].l[ka]>1.58*x.thm[1].l[ka]||x.thm[1].l[ka]>1.58*
x.thm[0].l[ka])){var Ua=x.mld_l[ka]*x.en[3].l[ka],gb=Math.max(x.thm[2].l[ka],Math.min(x.thm[3].l[ka],Ua));Ua=x.mld_l[ka]*x.en[2].l[ka];var gc=Math.max(x.thm[3].l[ka],Math.min(x.thm[2].l[ka],Ua));x.thm[2].l[ka]=gb;x.thm[3].l[ka]=gc}for(ka=0;ka<c.SBMAX_s;ka++)for(var ua=0;3>ua;ua++)x.thm[0].s[ka][ua]>1.58*x.thm[1].s[ka][ua]||x.thm[1].s[ka][ua]>1.58*x.thm[0].s[ka][ua]||(Ua=x.mld_s[ka]*x.en[3].s[ka][ua],gb=Math.max(x.thm[2].s[ka][ua],Math.min(x.thm[3].s[ka][ua],Ua)),Ua=x.mld_s[ka]*x.en[2].s[ka][ua],gc=
Math.max(x.thm[3].s[ka][ua],Math.min(x.thm[2].s[ka][ua],Ua)),x.thm[2].s[ka][ua]=gb,x.thm[3].s[ka][ua]=gc);Oa=a.msfix;if(0<Math.abs(Oa)){var Kb=Oa,hc=Kb,Zb=Math.pow(10,a.ATHlower*x.ATH.adjust);Kb*=2;hc*=2;for(var wa=0;wa<c.SBMAX_l;wa++){var ba=x.ATH.cb_l[x.bm_l[wa]]*Zb;var Wa=Math.min(Math.max(x.thm[0].l[wa],ba),Math.max(x.thm[1].l[wa],ba));var ab=Math.max(x.thm[2].l[wa],ba);var mb=Math.max(x.thm[3].l[wa],ba);if(Wa*Kb<ab+mb){var hb=Wa*hc/(ab+mb);ab*=hb;mb*=hb}x.thm[2].l[wa]=Math.min(ab,x.thm[2].l[wa]);
x.thm[3].l[wa]=Math.min(mb,x.thm[3].l[wa])}Zb*=c.BLKSIZE_s/c.BLKSIZE;for(wa=0;wa<c.SBMAX_s;wa++)for(var Da=0;3>Da;Da++)ba=x.ATH.cb_s[x.bm_s[wa]]*Zb,Wa=Math.min(Math.max(x.thm[0].s[wa][Da],ba),Math.max(x.thm[1].s[wa][Da],ba)),ab=Math.max(x.thm[2].s[wa][Da],ba),mb=Math.max(x.thm[3].s[wa][Da],ba),Wa*Kb<ab+mb&&(hb=Wa*Kb/(ab+mb),ab*=hb,mb*=hb),x.thm[2].s[wa][Da]=Math.min(x.thm[2].s[wa][Da],ab),x.thm[3].s[wa][Da]=Math.min(x.thm[3].s[wa][Da],mb)}}var ib=a.internal_flags;a.short_blocks!=ra.short_block_coupled||
0!=S[0]&&0!=S[1]||(S[0]=S[1]=0);for(var Ka=0;Ka<ib.channels_out;Ka++)Q[Ka]=c.NORM_TYPE,a.short_blocks==ra.short_block_dispensed&&(S[Ka]=1),a.short_blocks==ra.short_block_forced&&(S[Ka]=0),0!=S[Ka]?ib.blocktype_old[Ka]==c.SHORT_TYPE&&(Q[Ka]=c.STOP_TYPE):(Q[Ka]=c.SHORT_TYPE,ib.blocktype_old[Ka]==c.NORM_TYPE&&(ib.blocktype_old[Ka]=c.START_TYPE),ib.blocktype_old[Ka]==c.STOP_TYPE&&(ib.blocktype_old[Ka]=c.SHORT_TYPE)),n[Ka]=ib.blocktype_old[Ka],ib.blocktype_old[Ka]=Q[Ka];for(z=0;z<T;z++){var Ea=0;if(1<
z){var Lb=y;Ea=-2;var Tb=c.NORM_TYPE;if(n[0]==c.SHORT_TYPE||n[1]==c.SHORT_TYPE)Tb=c.SHORT_TYPE;var Fb=l[e][z-2]}else Lb=m,Ea=0,Tb=n[z],Fb=g[e][z];Lb[Ea+z]=Tb==c.SHORT_TYPE?W(Fb,x.masking_lower):f(Fb,x.masking_lower);a.analysis&&(x.pinfo.pe[e][z]=Lb[Ea+z])}return 0};var F=[-1.730326E-17,-.01703172,-1.349528E-17,.0418072,-6.73278E-17,-.0876324,-3.0835E-17,.1863476,-1.104424E-16,-.627638];this.L3psycho_anal_vbr=function(d,h,e,g,l,k,m,x,y,p){for(var r=d.internal_flags,A,t,I=K(c.HBLKSIZE),C=ca([3,c.HBLKSIZE_s]),
Q=ca([2,c.BLKSIZE]),z=ca([2,3,c.BLKSIZE_s]),S=ca([4,c.CBANDS]),D=ca([4,c.CBANDS]),O=ca([4,3]),L=[[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]],H=X(2),N=d.mode==la.JOINT_STEREO?4:r.channels_out,Z=ca([2,576]),G=d.internal_flags,V=G.channels_out,ma=d.mode==la.JOINT_STEREO?4:V,R=0;R<V;R++){firbuf=h[R];for(var T=e+576-350-21+192,M=0;576>M;M++){var Y;var ha=firbuf[T+M+10];for(var U=Y=0;9>U;U+=2)ha+=F[U]*(firbuf[T+M+U]+firbuf[T+M+21-U]),Y+=F[U+1]*(firbuf[T+M+U+1]+firbuf[T+M+21-U-1]);Z[R][M]=ha+Y}l[g][R].en.assign(G.en[R]);
l[g][R].thm.assign(G.thm[R]);2<ma&&(k[g][R].en.assign(G.en[R+2]),k[g][R].thm.assign(G.thm[R+2]))}for(R=0;R<ma;R++){var da=K(12),ya=K(12),qa=[0,0,0,0],ia=Z[R&1],sa=0,Fa=3==R?G.nsPsy.attackthre_s:G.nsPsy.attackthre,na=1;if(2==R)for(M=0,U=576;0<U;++M,--U){var ta=Z[0][M],za=Z[1][M];Z[0][M]=ta+za;Z[1][M]=ta-za}for(M=0;3>M;M++)ya[M]=G.nsPsy.last_en_subshort[R][M+6],da[M]=ya[M]/G.nsPsy.last_en_subshort[R][M+4],qa[0]+=ya[M];for(M=0;9>M;M++){for(var Xa=sa+64,Ya=1;sa<Xa;sa++)Ya<Math.abs(ia[sa])&&(Ya=Math.abs(ia[sa]));
G.nsPsy.last_en_subshort[R][M]=ya[M+3]=Ya;qa[1+M/3]+=Ya;Ya=Ya>ya[M+3-2]?Ya/ya[M+3-2]:ya[M+3-2]>10*Ya?ya[M+3-2]/(10*Ya):0;da[M+3]=Ya}for(M=0;3>M;++M){var Ia=ya[3*M+3]+ya[3*M+4]+ya[3*M+5],Wb=1;6*ya[3*M+5]<Ia&&(Wb*=.5,6*ya[3*M+4]<Ia&&(Wb*=.5));O[R][M]=Wb}if(d.analysis){var xa=da[0];for(M=1;12>M;M++)xa<da[M]&&(xa=da[M]);G.pinfo.ers[g][R]=G.pinfo.ers_save[R];G.pinfo.ers_save[R]=xa}for(M=0;12>M;M++)0==L[R][M/3]&&da[M]>Fa&&(L[R][M/3]=M%3+1);for(M=1;4>M;M++){var Qb=qa[M-1],Ga=qa[M];4E4>Math.max(Qb,Ga)&&Qb<
1.7*Ga&&Ga<1.7*Qb&&(1==M&&L[R][0]<=L[R][M]&&(L[R][0]=0),L[R][M]=0)}L[R][0]<=G.nsPsy.lastAttacks[R]&&(L[R][0]=0);if(3==G.nsPsy.lastAttacks[R]||0!=L[R][0]+L[R][1]+L[R][2]+L[R][3])na=0,0!=L[R][1]&&0!=L[R][0]&&(L[R][1]=0),0!=L[R][2]&&0!=L[R][1]&&(L[R][2]=0),0!=L[R][3]&&0!=L[R][2]&&(L[R][3]=0);2>R?H[R]=na:0==na&&(H[0]=H[1]=0);y[R]=G.tot_ener[R]}var qb=d.internal_flags;d.short_blocks!=ra.short_block_coupled||0!=H[0]&&0!=H[1]||(H[0]=H[1]=0);for(var Ma=0;Ma<qb.channels_out;Ma++)d.short_blocks==ra.short_block_dispensed&&
(H[Ma]=1),d.short_blocks==ra.short_block_forced&&(H[Ma]=0);for(var P=0;P<N;P++){var Ha=P&1;A=Q;var Gb=d,La=P,kb=g,Ra=I,Na=A,cb=Ha,Aa=Gb.internal_flags;if(2>La)q.fft_long(Aa,Na[cb],La,h,e);else if(2==La)for(var va=c.BLKSIZE-1;0<=va;--va){var rb=Na[cb+0][va],Va=Na[cb+1][va];Na[cb+0][va]=(rb+Va)*aa.SQRT2*.5;Na[cb+1][va]=(rb-Va)*aa.SQRT2*.5}Ra[0]=Na[cb+0][0];Ra[0]*=Ra[0];for(va=c.BLKSIZE/2-1;0<=va;--va){var ja=Na[cb+0][c.BLKSIZE/2-va],Hb=Na[cb+0][c.BLKSIZE/2+va];Ra[c.BLKSIZE/2-va]=.5*(ja*ja+Hb*Hb)}var Ib=
0;for(va=11;va<c.HBLKSIZE;va++)Ib+=Ra[va];Aa.tot_ener[La]=Ib;if(Gb.analysis){for(va=0;va<c.HBLKSIZE;va++)Aa.pinfo.energy[kb][La][va]=Aa.pinfo.energy_save[La][va],Aa.pinfo.energy_save[La][va]=Ra[va];Aa.pinfo.pe[kb][La]=Aa.pe[La]}var Ba=P,zb=I,tb=d.internal_flags;2==d.athaa_loudapprox&&2>Ba&&(tb.loudness_sq[g][Ba]=tb.loudness_sq_save[Ba],tb.loudness_sq_save[Ba]=u(zb,tb));if(0!=H[Ha]){var oa=void 0,ea=r,Ab=I,Bb=S[P],Sa=D[P],Za=P,ub=K(c.CBANDS),sb=K(c.CBANDS),Ja=X(c.CBANDS+2);b(ea,Ab,Bb,ub,sb);v(ea,ub,
sb,Ja);var Rb=0;for(oa=0;oa<ea.npart_l;oa++){var Xb,db=ea.s3ind[oa][0],cc=ea.s3ind[oa][1],Cb=0,Db=0;Cb=Ja[db];Db+=1;var $a=ea.s3_ll[Rb]*Bb[db]*J[Ja[db]];++Rb;for(++db;db<=cc;){Cb+=Ja[db];Db+=1;var vb=ea.s3_ll[Rb]*Bb[db]*J[Ja[db]];$a=Xb=n($a,vb,db-oa);++Rb;++db}Cb=(1+2*Cb)/(2*Db);var Ta=.5*J[Cb];$a*=Ta;if(ea.blocktype_old[Za&1]==c.SHORT_TYPE){var wb=2*ea.nb_1[Za][oa];Sa[oa]=0<wb?Math.min($a,wb):Math.min($a,.3*Bb[oa])}else{var Yb=16*ea.nb_2[Za][oa],eb=2*ea.nb_1[Za][oa];0>=Yb&&(Yb=$a);0>=eb&&(eb=$a);
wb=ea.blocktype_old[Za&1]==c.NORM_TYPE?Math.min(eb,Yb):eb;Sa[oa]=Math.min($a,wb)}ea.nb_2[Za][oa]=ea.nb_1[Za][oa];ea.nb_1[Za][oa]=$a;vb=ub[oa];vb*=ea.minval_l[oa];vb*=Ta;Sa[oa]>vb&&(Sa[oa]=vb);1<ea.masking_lower&&(Sa[oa]*=ea.masking_lower);Sa[oa]>Bb[oa]&&(Sa[oa]=Bb[oa]);1>ea.masking_lower&&(Sa[oa]*=ea.masking_lower)}for(;oa<c.CBANDS;++oa)Bb[oa]=0,Sa[oa]=0}else for(var Jb=r,lb=P,xb=0;xb<Jb.npart_l;xb++)Jb.nb_2[lb][xb]=Jb.nb_1[lb][xb],Jb.nb_1[lb][xb]=0}2==H[0]+H[1]&&d.mode==la.JOINT_STEREO&&a(S,D,r.mld_cb_l,
r.ATH.cb_l,d.ATHlower*r.ATH.adjust,d.msfix,r.npart_l);for(P=0;P<N;P++)Ha=P&1,0!=H[Ha]&&E(r,S[P],D[P],P);for(var fa=0;3>fa;fa++){for(P=0;P<N;++P)if(Ha=P&1,0!=H[Ha]){var Ca=r,Sb=P;if(0==fa)for(var Eb=0;Eb<Ca.npart_s;Eb++)Ca.nb_s2[Sb][Eb]=Ca.nb_s1[Sb][Eb],Ca.nb_s1[Sb][Eb]=0}else{t=z;var fb=P,Oa=fa,ka=C,Ua=t,gb=Ha,gc=d.internal_flags;0==Oa&&2>fb&&q.fft_short(gc,Ua[gb],fb,h,e);if(2==fb)for(var ua=c.BLKSIZE_s-1;0<=ua;--ua){var Kb=Ua[gb+0][Oa][ua],hc=Ua[gb+1][Oa][ua];Ua[gb+0][Oa][ua]=(Kb+hc)*aa.SQRT2*.5;
Ua[gb+1][Oa][ua]=(Kb-hc)*aa.SQRT2*.5}ka[Oa][0]=Ua[gb+0][Oa][0];ka[Oa][0]*=ka[Oa][0];for(ua=c.BLKSIZE_s/2-1;0<=ua;--ua){var Zb=Ua[gb+0][Oa][c.BLKSIZE_s/2-ua],wa=Ua[gb+0][Oa][c.BLKSIZE_s/2+ua];ka[Oa][c.BLKSIZE_s/2-ua]=.5*(Zb*Zb+wa*wa)}var ba=void 0,Wa=void 0,ab=void 0,mb=C,hb=S[P],Da=D[P],ib=P,Ka=fa,Ea=d.internal_flags,Lb=new float[c.CBANDS],Tb=K(c.CBANDS),Fb=new int[c.CBANDS];for(ba=Wa=0;ba<Ea.npart_s;++ba){var Ob=0,Pb=0,dc=Ea.numlines_s[ba];for(ab=0;ab<dc;++ab,++Wa){var nc=mb[Ka][Wa];Ob+=nc;Pb<nc&&
(Pb=nc)}hb[ba]=Ob;Lb[ba]=Pb;Tb[ba]=Ob/dc}for(;ba<c.CBANDS;++ba)Lb[ba]=0,Tb[ba]=0;var Mb=Ea,nb=Lb,Ub=Tb,$b=Fb,ac=J.length-1,pa=0,Pa=Ub[pa]+Ub[pa+1];if(0<Pa){var bb=nb[pa];bb<nb[pa+1]&&(bb=nb[pa+1]);Pa=20*(2*bb-Pa)/(Pa*(Mb.numlines_s[pa]+Mb.numlines_s[pa+1]-1));var ob=0|Pa;ob>ac&&(ob=ac);$b[pa]=ob}else $b[pa]=0;for(pa=1;pa<Mb.npart_s-1;pa++)Pa=Ub[pa-1]+Ub[pa]+Ub[pa+1],0<Pa?(bb=nb[pa-1],bb<nb[pa]&&(bb=nb[pa]),bb<nb[pa+1]&&(bb=nb[pa+1]),Pa=20*(3*bb-Pa)/(Pa*(Mb.numlines_s[pa-1]+Mb.numlines_s[pa]+Mb.numlines_s[pa+
1]-1)),ob=0|Pa,ob>ac&&(ob=ac),$b[pa]=ob):$b[pa]=0;Pa=Ub[pa-1]+Ub[pa];0<Pa?(bb=nb[pa-1],bb<nb[pa]&&(bb=nb[pa]),Pa=20*(2*bb-Pa)/(Pa*(Mb.numlines_s[pa-1]+Mb.numlines_s[pa]-1)),ob=0|Pa,ob>ac&&(ob=ac),$b[pa]=ob):$b[pa]=0;for(Wa=ba=0;ba<Ea.npart_s;ba++){var yb=Ea.s3ind_s[ba][0],mc=Ea.s3ind_s[ba][1];var lc=Fb[yb];var tc=1;var ic=Ea.s3_ss[Wa]*hb[yb]*J[Fb[yb]];++Wa;for(++yb;yb<=mc;){lc+=Fb[yb];tc+=1;var bc=Ea.s3_ss[Wa]*hb[yb]*J[Fb[yb]];ic=n(ic,bc,yb-ba);++Wa;++yb}lc=(1+2*lc)/(2*tc);var uc=.5*J[lc];ic*=uc;
Da[ba]=ic;Ea.nb_s2[ib][ba]=Ea.nb_s1[ib][ba];Ea.nb_s1[ib][ba]=ic;bc=Lb[ba];bc*=Ea.minval_s[ba];bc*=uc;Da[ba]>bc&&(Da[ba]=bc);1<Ea.masking_lower&&(Da[ba]*=Ea.masking_lower);Da[ba]>hb[ba]&&(Da[ba]=hb[ba]);1>Ea.masking_lower&&(Da[ba]*=Ea.masking_lower)}for(;ba<c.CBANDS;++ba)hb[ba]=0,Da[ba]=0}0==H[0]+H[1]&&d.mode==la.JOINT_STEREO&&a(S,D,r.mld_cb_s,r.ATH.cb_s,d.ATHlower*r.ATH.adjust,d.msfix,r.npart_s);for(P=0;P<N;++P)Ha=P&1,0==H[Ha]&&w(r,S[P],D[P],P,fa)}for(P=0;P<N;P++)if(Ha=P&1,0==H[Ha])for(var Vb=0;Vb<
c.SBMAX_s;Vb++){var vc=K(3);for(fa=0;3>fa;fa++){var jb=r.thm[P].s[Vb][fa];jb*=.8;if(2<=L[P][fa]||1==L[P][fa+1]){var jc=0!=fa?fa-1:2,kc=B(r.thm[P].s[Vb][jc],jb,.36);jb=Math.min(jb,kc)}else if(1==L[P][fa])jc=0!=fa?fa-1:2,kc=B(r.thm[P].s[Vb][jc],jb,.18),jb=Math.min(jb,kc);else if(0!=fa&&3==L[P][fa-1]||0==fa&&3==r.nsPsy.lastAttacks[P])jc=2!=fa?fa+1:0,kc=B(r.thm[P].s[Vb][jc],jb,.18),jb=Math.min(jb,kc);jb*=O[P][fa];vc[fa]=jb}for(fa=0;3>fa;fa++)r.thm[P].s[Vb][fa]=vc[fa]}for(P=0;P<N;P++)r.nsPsy.lastAttacks[P]=
L[P][2];for(var Nb=d.internal_flags,pb=0;pb<Nb.channels_out;pb++){var oc=c.NORM_TYPE;0!=H[pb]?Nb.blocktype_old[pb]==c.SHORT_TYPE&&(oc=c.STOP_TYPE):(oc=c.SHORT_TYPE,Nb.blocktype_old[pb]==c.NORM_TYPE&&(Nb.blocktype_old[pb]=c.START_TYPE),Nb.blocktype_old[pb]==c.STOP_TYPE&&(Nb.blocktype_old[pb]=c.SHORT_TYPE));p[pb]=Nb.blocktype_old[pb];Nb.blocktype_old[pb]=oc}for(P=0;P<N;P++){if(1<P){var pc=x;var qc=-2;var rc=c.NORM_TYPE;if(p[0]==c.SHORT_TYPE||p[1]==c.SHORT_TYPE)rc=c.SHORT_TYPE;var sc=k[g][P-2]}else pc=
m,qc=0,rc=p[P],sc=l[g][P];pc[qc+P]=rc==c.SHORT_TYPE?W(sc,r.masking_lower):f(sc,r.masking_lower);d.analysis&&(r.pinfo.pe[g][P]=pc[qc+P])}return 0};this.psymodel_init=function(a){var b=a.internal_flags,f,h=!0,g=13,k=0,m=0,x=-8.25,y=-4.5,n=K(c.CBANDS),u=K(c.CBANDS),A=K(c.CBANDS),w=a.out_samplerate;switch(a.experimentalZ){default:case 0:h=!0;break;case 1:h=a.VBR==G.vbr_mtrh||a.VBR==G.vbr_mt?!1:!0;break;case 2:h=!1;break;case 3:g=8,k=-1.75,m=-.0125,x=-8.25,y=-2.25}b.ms_ener_ratio_old=.25;b.blocktype_old[0]=
b.blocktype_old[1]=c.NORM_TYPE;for(f=0;4>f;++f){for(var v=0;v<c.CBANDS;++v)b.nb_1[f][v]=1E20,b.nb_2[f][v]=1E20,b.nb_s1[f][v]=b.nb_s2[f][v]=1;for(var z=0;z<c.SBMAX_l;z++)b.en[f].l[z]=1E20,b.thm[f].l[z]=1E20;for(v=0;3>v;++v){for(z=0;z<c.SBMAX_s;z++)b.en[f].s[z][v]=1E20,b.thm[f].s[z][v]=1E20;b.nsPsy.lastAttacks[f]=0}for(v=0;9>v;v++)b.nsPsy.last_en_subshort[f][v]=10}b.loudness_sq_save[0]=b.loudness_sq_save[1]=0;b.npart_l=e(b.numlines_l,b.bo_l,b.bm_l,n,u,b.mld_l,b.PSY.bo_l_weight,w,c.BLKSIZE,b.scalefac_band.l,
c.BLKSIZE/1152,c.SBMAX_l);for(f=0;f<b.npart_l;f++)z=k,n[f]>=g&&(z=m*(n[f]-g)/(24-g)+k*(24-n[f])/(24-g)),A[f]=Math.pow(10,z/10),b.rnumlines_l[f]=0<b.numlines_l[f]?1/b.numlines_l[f]:0;b.s3_ll=l(b.s3ind,b.npart_l,n,u,A,h);for(f=v=0;f<b.npart_l;f++){m=Ma.MAX_VALUE;for(z=0;z<b.numlines_l[f];z++,v++)k=w*v/(1E3*c.BLKSIZE),k=this.ATHformula(1E3*k,a)-20,k=Math.pow(10,.1*k),k*=b.numlines_l[f],m>k&&(m=k);b.ATH.cb_l[f]=m;m=-20+20*n[f]/10;6<m&&(m=100);-15>m&&(m=-15);m-=8;b.minval_l[f]=Math.pow(10,m/10)*b.numlines_l[f]}b.npart_s=
e(b.numlines_s,b.bo_s,b.bm_s,n,u,b.mld_s,b.PSY.bo_s_weight,w,c.BLKSIZE_s,b.scalefac_band.s,c.BLKSIZE_s/384,c.SBMAX_s);for(f=v=0;f<b.npart_s;f++){z=x;n[f]>=g&&(z=y*(n[f]-g)/(24-g)+x*(24-n[f])/(24-g));A[f]=Math.pow(10,z/10);m=Ma.MAX_VALUE;for(z=0;z<b.numlines_s[f];z++,v++)k=w*v/(1E3*c.BLKSIZE_s),k=this.ATHformula(1E3*k,a)-20,k=Math.pow(10,.1*k),k*=b.numlines_s[f],m>k&&(m=k);b.ATH.cb_s[f]=m;m=-7+7*n[f]/12;12<n[f]&&(m*=1+3.1*Math.log(1+m));12>n[f]&&(m*=1+2.3*Math.log(1-m));-15>m&&(m=-15);m-=8;b.minval_s[f]=
Math.pow(10,m/10)*b.numlines_s[f]}b.s3_ss=l(b.s3ind_s,b.npart_s,n,u,A,h);p=Math.pow(10,.5625);r=Math.pow(10,1.5);t=Math.pow(10,1.5);q.init_fft(b);b.decay=Math.exp(-2.302585092994046/(.01*w/192));f=3.5;0!=(a.exp_nspsytune&2)&&(f=1);0<Math.abs(a.msfix)&&(f=a.msfix);a.msfix=f;for(h=0;h<b.npart_l;h++)b.s3ind[h][1]>b.npart_l-1&&(b.s3ind[h][1]=b.npart_l-1);b.ATH.decay=Math.pow(10,576*b.mode_gr/w*-1.2);b.ATH.adjust=.01;b.ATH.adjustLimit=1;if(-1!=a.ATHtype){v=a.out_samplerate/c.BLKSIZE;for(f=k=h=0;f<c.BLKSIZE/
2;++f)k+=v,b.ATH.eql_w[f]=1/Math.pow(10,this.ATHformula(k,a)/10),h+=b.ATH.eql_w[f];h=1/h;for(f=c.BLKSIZE/2;0<=--f;)b.ATH.eql_w[f]*=h}for(h=v=0;h<b.npart_s;++h)for(f=0;f<b.numlines_s[h];++f)++v;for(h=v=0;h<b.npart_l;++h)for(f=0;f<b.numlines_l[h];++f)++v;for(f=v=0;f<b.npart_l;f++)k=w*(v+b.numlines_l[f]/2)/(1*c.BLKSIZE),b.mld_cb_l[f]=d(k),v+=b.numlines_l[f];for(;f<c.CBANDS;++f)b.mld_cb_l[f]=1;for(f=v=0;f<b.npart_s;f++)k=w*(v+b.numlines_s[f]/2)/(1*c.BLKSIZE_s),b.mld_cb_s[f]=d(k),v+=b.numlines_s[f];for(;f<
c.CBANDS;++f)b.mld_cb_s[f]=1;return 0};this.ATHformula=function(a,b){switch(b.ATHtype){case 0:a=g(a,9);break;case 1:a=g(a,-1);break;case 2:a=g(a,0);break;case 3:a=g(a,1)+6;break;case 4:a=g(a,b.ATHcurve);break;default:a=g(a,0)}return a}}function W(){function u(){this.mask_adjust_short=this.mask_adjust=0;this.bo_l_weight=K(c.SBMAX_l);this.bo_s_weight=K(c.SBMAX_s)}function k(){this.lowerlimit=0}function n(a,b){this.lowpass=b}function V(a){return 1<a?0:0>=a?1:Math.cos(Math.PI/2*a)}function E(a,b){switch(a){case 44100:return b.version=
1,0;case 48E3:return b.version=1;case 32E3:return b.version=1,2;case 22050:return b.version=0;case 24E3:return b.version=0,1;case 16E3:return b.version=0,2;case 11025:return b.version=0;case 12E3:return b.version=0,1;case 8E3:return b.version=0,2;default:return b.version=0,-1}}function B(a,b,d){16E3>d&&(b=2);d=w.bitrate_table[b][1];for(var c=2;14>=c;c++)0<w.bitrate_table[b][c]&&Math.abs(w.bitrate_table[b][c]-a)<Math.abs(d-a)&&(d=w.bitrate_table[b][c]);return d}function U(a,b,d){16E3>d&&(b=2);for(d=
0;14>=d;d++)if(0<w.bitrate_table[b][d]&&w.bitrate_table[b][d]==a)return d;return-1}function f(a,b){var d=[new n(8,2E3),new n(16,3700),new n(24,3900),new n(32,5500),new n(40,7E3),new n(48,7500),new n(56,1E4),new n(64,11E3),new n(80,13500),new n(96,15100),new n(112,15600),new n(128,17E3),new n(160,17500),new n(192,18600),new n(224,19400),new n(256,19700),new n(320,20500)];b=e.nearestBitrateFullIndex(b);a.lowerlimit=d[b].lowpass}function b(a){var b=c.BLKSIZE+a.framesize-c.FFTOFFSET;return b=Math.max(b,
512+a.framesize-32)}function v(f,g,k,p,q,n,r){var h=f.internal_flags,x=0,y=[null,null],u=[null,null];if(4294479419!=h.Class_ID)return-3;if(0==p)return 0;var t=d.copy_buffer(h,q,n,r,0);if(0>t)return t;n+=t;x+=t;u[0]=g;u[1]=k;if(qa.NEQ(f.scale,0)&&qa.NEQ(f.scale,1))for(t=0;t<p;++t)u[0][t]*=f.scale,2==h.channels_out&&(u[1][t]*=f.scale);if(qa.NEQ(f.scale_left,0)&&qa.NEQ(f.scale_left,1))for(t=0;t<p;++t)u[0][t]*=f.scale_left;if(qa.NEQ(f.scale_right,0)&&qa.NEQ(f.scale_right,1))for(t=0;t<p;++t)u[1][t]*=f.scale_right;
if(2==f.num_channels&&1==h.channels_out)for(t=0;t<p;++t)u[0][t]=.5*(u[0][t]+u[1][t]),u[1][t]=0;g=b(f);y[0]=h.mfbuf[0];y[1]=h.mfbuf[1];for(k=0;0<p;){var v=[null,null];v[0]=u[0];v[1]=u[1];t=new a;var A=f;var w=y;var B=k,E=p,D=t,H=A.internal_flags;if(.9999>H.resample_ratio||1.0001<H.resample_ratio)for(var O=0;O<H.channels_out;O++){var G=new m,J=D,N,V=w[O],T=H.mf_size,U=A.framesize,W=v[O],X=B,aa=E,ha=G,la=O,ca=A.internal_flags,ia=0,sa=A.out_samplerate/z(A.out_samplerate,A.in_samplerate);sa>da.BPC&&(sa=
da.BPC);var ra=1E-4>Math.abs(ca.resample_ratio-Math.floor(.5+ca.resample_ratio))?1:0;var R=1/ca.resample_ratio;1<R&&(R=1);var na=31;0==na%2&&--na;na+=ra;ra=na+1;if(0==ca.fill_buffer_resample_init){ca.inbuf_old[0]=K(ra);ca.inbuf_old[1]=K(ra);for(N=0;N<=2*sa;++N)ca.blackfilt[N]=K(ra);ca.itime[0]=0;for(ia=ca.itime[1]=0;ia<=2*sa;ia++){var M=0,za=(ia-sa)/(2*sa);for(N=0;N<=na;N++){var Fa=ca.blackfilt[ia],Ia=N,xa=N-za,Qa=Math.PI*R;xa/=na;0>xa&&(xa=0);1<xa&&(xa=1);var Ma=xa-.5;xa=.42-.5*Math.cos(2*xa*Math.PI)+
.08*Math.cos(4*xa*Math.PI);M+=Fa[Ia]=1E-9>Math.abs(Ma)?Qa/Math.PI:xa*Math.sin(na*Qa*Ma)/(Math.PI*na*Ma)}for(N=0;N<=na;N++)ca.blackfilt[ia][N]/=M}ca.fill_buffer_resample_init=1}M=ca.inbuf_old[la];for(R=0;R<U;R++){N=R*ca.resample_ratio;ia=0|Math.floor(N-ca.itime[la]);if(na+ia-na/2>=aa)break;za=N-ca.itime[la]-(ia+na%2*.5);za=0|Math.floor(2*za*sa+sa+.5);for(N=Fa=0;N<=na;++N)Ia=0|N+ia-na/2,Fa+=(0>Ia?M[ra+Ia]:W[X+Ia])*ca.blackfilt[za][N];V[T+R]=Fa}ha.num_used=Math.min(aa,na+ia-na/2);ca.itime[la]+=ha.num_used-
R*ca.resample_ratio;if(ha.num_used>=ra)for(N=0;N<ra;N++)M[N]=W[X+ha.num_used+N-ra];else{V=ra-ha.num_used;for(N=0;N<V;++N)M[N]=M[N+ha.num_used];for(ia=0;N<ra;++N,++ia)M[N]=W[X+ia]}J.n_out=R;D.n_in=G.num_used}else for(D.n_out=Math.min(A.framesize,E),D.n_in=D.n_out,A=0;A<D.n_out;++A)w[0][H.mf_size+A]=v[0][B+A],2==H.channels_out&&(w[1][H.mf_size+A]=v[1][B+A]);w=t.n_in;t=t.n_out;if(h.findReplayGain&&!h.decode_on_the_fly&&l.AnalyzeSamples(h.rgdata,y[0],h.mf_size,y[1],h.mf_size,t,h.channels_out)==Y.GAIN_ANALYSIS_ERROR)return-6;
p-=w;k+=w;h.mf_size+=t;1>h.mf_samples_to_encode&&(h.mf_samples_to_encode=c.ENCDELAY+c.POSTDELAY);h.mf_samples_to_encode+=t;if(h.mf_size>=g){w=r-x;0==r&&(w=0);t=f;w=e.enc.lame_encode_mp3_frame(t,y[0],y[1],q,n,w);t.frameNum++;t=w;if(0>t)return t;n+=t;x+=t;h.mf_size-=f.framesize;h.mf_samples_to_encode-=f.framesize;for(w=0;w<h.channels_out;w++)for(t=0;t<h.mf_size;t++)y[w][t]=y[w][t+f.framesize]}}return x}function a(){this.n_out=this.n_in=0}function m(){this.num_used=0}function z(a,b){return 0!=b?z(b,
a%b):a}var e=this;W.V9=410;W.V8=420;W.V7=430;W.V6=440;W.V5=450;W.V4=460;W.V3=470;W.V2=480;W.V1=490;W.V0=500;W.R3MIX=1E3;W.STANDARD=1001;W.EXTREME=1002;W.INSANE=1003;W.STANDARD_FAST=1004;W.EXTREME_FAST=1005;W.MEDIUM=1006;W.MEDIUM_FAST=1007;W.LAME_MAXMP3BUFFER=147456;var l,d,g,q,D,p=new Pb,r,t,J;this.enc=new c;this.setModules=function(a,b,c,f,e,k,m,n,u){l=a;d=b;g=c;q=f;D=e;r=k;t=n;J=u;this.enc.setModules(d,p,q,r)};this.lame_init=function(){var a=new zc;a.class_id=4294479419;var b=a.internal_flags=new da;
a.mode=la.NOT_SET;a.original=1;a.in_samplerate=44100;a.num_channels=2;a.num_samples=-1;a.bWriteVbrTag=!0;a.quality=-1;a.short_blocks=null;b.subblock_gain=-1;a.lowpassfreq=0;a.highpassfreq=0;a.lowpasswidth=-1;a.highpasswidth=-1;a.VBR=G.vbr_off;a.VBR_q=4;a.ATHcurve=-1;a.VBR_mean_bitrate_kbps=128;a.VBR_min_bitrate_kbps=0;a.VBR_max_bitrate_kbps=0;a.VBR_hard_min=0;b.VBR_min_bitrate=1;b.VBR_max_bitrate=13;a.quant_comp=-1;a.quant_comp_short=-1;a.msfix=-1;b.resample_ratio=1;b.OldValue[0]=180;b.OldValue[1]=
180;b.CurrentStep[0]=4;b.CurrentStep[1]=4;b.masking_lower=1;b.nsPsy.attackthre=-1;b.nsPsy.attackthre_s=-1;a.scale=-1;a.athaa_type=-1;a.ATHtype=-1;a.athaa_loudapprox=-1;a.athaa_sensitivity=0;a.useTemporal=null;a.interChRatio=-1;b.mf_samples_to_encode=c.ENCDELAY+c.POSTDELAY;a.encoder_padding=0;b.mf_size=c.ENCDELAY-c.MDCTDELAY;a.findReplayGain=!1;a.decode_on_the_fly=!1;b.decode_on_the_fly=!1;b.findReplayGain=!1;b.findPeakSample=!1;b.RadioGain=0;b.AudiophileGain=0;b.noclipGainChange=0;b.noclipScale=-1;
a.preset=0;a.write_id3tag_automatic=!0;a.lame_allocated_gfp=1;return a};this.nearestBitrateFullIndex=function(a){var b=[8,16,24,32,40,48,56,64,80,96,112,128,160,192,224,256,320];var d=b[16];var c=16;var f=b[16];var e=16;for(var h=0;16>h;h++)if(Math.max(a,b[h+1])!=a){d=b[h+1];c=h+1;f=b[h];e=h;break}return d-a>a-f?e:c};this.lame_init_params=function(a){var b=a.internal_flags;b.Class_ID=0;null==b.ATH&&(b.ATH=new Cc);null==b.PSY&&(b.PSY=new u);null==b.rgdata&&(b.rgdata=new Ac);b.channels_in=a.num_channels;
1==b.channels_in&&(a.mode=la.MONO);b.channels_out=a.mode==la.MONO?1:2;b.mode_ext=c.MPG_MD_MS_LR;a.mode==la.MONO&&(a.force_ms=!1);a.VBR==G.vbr_off&&128!=a.VBR_mean_bitrate_kbps&&0==a.brate&&(a.brate=a.VBR_mean_bitrate_kbps);a.VBR!=G.vbr_off&&a.VBR!=G.vbr_mtrh&&a.VBR!=G.vbr_mt&&(a.free_format=!1);a.VBR==G.vbr_off&&0==a.brate&&qa.EQ(a.compression_ratio,0)&&(a.compression_ratio=11.025);a.VBR==G.vbr_off&&0<a.compression_ratio&&(0==a.out_samplerate&&(a.out_samplerate=map2MP3Frequency(int(.97*a.in_samplerate))),
a.brate=0|16*a.out_samplerate*b.channels_out/(1E3*a.compression_ratio),b.samplerate_index=E(a.out_samplerate,a),a.free_format||(a.brate=B(a.brate,a.version,a.out_samplerate)));0!=a.out_samplerate&&(16E3>a.out_samplerate?(a.VBR_mean_bitrate_kbps=Math.max(a.VBR_mean_bitrate_kbps,8),a.VBR_mean_bitrate_kbps=Math.min(a.VBR_mean_bitrate_kbps,64)):32E3>a.out_samplerate?(a.VBR_mean_bitrate_kbps=Math.max(a.VBR_mean_bitrate_kbps,8),a.VBR_mean_bitrate_kbps=Math.min(a.VBR_mean_bitrate_kbps,160)):(a.VBR_mean_bitrate_kbps=
Math.max(a.VBR_mean_bitrate_kbps,32),a.VBR_mean_bitrate_kbps=Math.min(a.VBR_mean_bitrate_kbps,320)));if(0==a.lowpassfreq){switch(a.VBR){case G.vbr_off:var e=new k;f(e,a.brate);e=e.lowerlimit;break;case G.vbr_abr:e=new k;f(e,a.VBR_mean_bitrate_kbps);e=e.lowerlimit;break;case G.vbr_rh:var h=[19500,19E3,18600,18E3,17500,16E3,15600,14900,12500,1E4,3950];if(0<=a.VBR_q&&9>=a.VBR_q){e=h[a.VBR_q];h=h[a.VBR_q+1];var m=a.VBR_q_frac;e=linear_int(e,h,m)}else e=19500;break;default:h=[19500,19E3,18500,18E3,17500,
16500,15500,14500,12500,9500,3950],0<=a.VBR_q&&9>=a.VBR_q?(e=h[a.VBR_q],h=h[a.VBR_q+1],m=a.VBR_q_frac,e=linear_int(e,h,m)):e=19500}a.mode!=la.MONO||a.VBR!=G.vbr_off&&a.VBR!=G.vbr_abr||(e*=1.5);a.lowpassfreq=e|0}0==a.out_samplerate&&(2*a.lowpassfreq>a.in_samplerate&&(a.lowpassfreq=a.in_samplerate/2),e=a.lowpassfreq|0,h=a.in_samplerate,m=44100,48E3<=h?m=48E3:44100<=h?m=44100:32E3<=h?m=32E3:24E3<=h?m=24E3:22050<=h?m=22050:16E3<=h?m=16E3:12E3<=h?m=12E3:11025<=h?m=11025:8E3<=h&&(m=8E3),-1==e?e=m:(15960>=
e&&(m=44100),15250>=e&&(m=32E3),11220>=e&&(m=24E3),9970>=e&&(m=22050),7230>=e&&(m=16E3),5420>=e&&(m=12E3),4510>=e&&(m=11025),3970>=e&&(m=8E3),e=h<m?44100<h?48E3:32E3<h?44100:24E3<h?32E3:22050<h?24E3:16E3<h?22050:12E3<h?16E3:11025<h?12E3:8E3<h?11025:8E3:m),a.out_samplerate=e);a.lowpassfreq=Math.min(20500,a.lowpassfreq);a.lowpassfreq=Math.min(a.out_samplerate/2,a.lowpassfreq);a.VBR==G.vbr_off&&(a.compression_ratio=16*a.out_samplerate*b.channels_out/(1E3*a.brate));a.VBR==G.vbr_abr&&(a.compression_ratio=
16*a.out_samplerate*b.channels_out/(1E3*a.VBR_mean_bitrate_kbps));a.bWriteVbrTag||(a.findReplayGain=!1,a.decode_on_the_fly=!1,b.findPeakSample=!1);b.findReplayGain=a.findReplayGain;b.decode_on_the_fly=a.decode_on_the_fly;b.decode_on_the_fly&&(b.findPeakSample=!0);if(b.findReplayGain&&l.InitGainAnalysis(b.rgdata,a.out_samplerate)==Y.INIT_GAIN_ANALYSIS_ERROR)return a.internal_flags=null,-6;b.decode_on_the_fly&&!a.decode_only&&(null!=b.hip&&J.hip_decode_exit(b.hip),b.hip=J.hip_decode_init());b.mode_gr=
24E3>=a.out_samplerate?1:2;a.framesize=576*b.mode_gr;a.encoder_delay=c.ENCDELAY;b.resample_ratio=a.in_samplerate/a.out_samplerate;switch(a.VBR){case G.vbr_mt:case G.vbr_rh:case G.vbr_mtrh:a.compression_ratio=[5.7,6.5,7.3,8.2,10,11.9,13,14,15,16.5][a.VBR_q];break;case G.vbr_abr:a.compression_ratio=16*a.out_samplerate*b.channels_out/(1E3*a.VBR_mean_bitrate_kbps);break;default:a.compression_ratio=16*a.out_samplerate*b.channels_out/(1E3*a.brate)}a.mode==la.NOT_SET&&(a.mode=la.JOINT_STEREO);0<a.highpassfreq?
(b.highpass1=2*a.highpassfreq,b.highpass2=0<=a.highpasswidth?2*(a.highpassfreq+a.highpasswidth):2*a.highpassfreq,b.highpass1/=a.out_samplerate,b.highpass2/=a.out_samplerate):(b.highpass1=0,b.highpass2=0);0<a.lowpassfreq?(b.lowpass2=2*a.lowpassfreq,0<=a.lowpasswidth?(b.lowpass1=2*(a.lowpassfreq-a.lowpasswidth),0>b.lowpass1&&(b.lowpass1=0)):b.lowpass1=2*a.lowpassfreq,b.lowpass1/=a.out_samplerate,b.lowpass2/=a.out_samplerate):(b.lowpass1=0,b.lowpass2=0);e=a.internal_flags;var n=32,v=-1;if(0<e.lowpass1){var z=
999;for(h=0;31>=h;h++)m=h/31,m>=e.lowpass2&&(n=Math.min(n,h)),e.lowpass1<m&&m<e.lowpass2&&(z=Math.min(z,h));e.lowpass1=999==z?(n-.75)/31:(z-.75)/31;e.lowpass2=n/31}0<e.highpass2&&e.highpass2<.75/31*.9&&(e.highpass1=0,e.highpass2=0,T.err.println("Warning: highpass filter disabled.  highpass frequency too small\n"));if(0<e.highpass2){n=-1;for(h=0;31>=h;h++)m=h/31,m<=e.highpass1&&(v=Math.max(v,h)),e.highpass1<m&&m<e.highpass2&&(n=Math.max(n,h));e.highpass1=v/31;e.highpass2=-1==n?(v+.75)/31:(n+.75)/31}for(h=
0;32>h;h++)m=h/31,v=e.highpass2>e.highpass1?V((e.highpass2-m)/(e.highpass2-e.highpass1+1E-20)):1,m=e.lowpass2>e.lowpass1?V((m-e.lowpass1)/(e.lowpass2-e.lowpass1+1E-20)):1,e.amp_filter[h]=v*m;b.samplerate_index=E(a.out_samplerate,a);if(0>b.samplerate_index)return a.internal_flags=null,-1;if(a.VBR==G.vbr_off)if(a.free_format)b.bitrate_index=0;else{if(a.brate=B(a.brate,a.version,a.out_samplerate),b.bitrate_index=U(a.brate,a.version,a.out_samplerate),0>=b.bitrate_index)return a.internal_flags=null,-1}else b.bitrate_index=
1;a.analysis&&(a.bWriteVbrTag=!1);null!=b.pinfo&&(a.bWriteVbrTag=!1);d.init_bit_stream_w(b);e=b.samplerate_index+3*a.version+6*(16E3>a.out_samplerate?1:0);for(h=0;h<c.SBMAX_l+1;h++)b.scalefac_band.l[h]=q.sfBandIndex[e].l[h];for(h=0;h<c.PSFB21+1;h++)m=(b.scalefac_band.l[22]-b.scalefac_band.l[21])/c.PSFB21,m=b.scalefac_band.l[21]+h*m,b.scalefac_band.psfb21[h]=m;b.scalefac_band.psfb21[c.PSFB21]=576;for(h=0;h<c.SBMAX_s+1;h++)b.scalefac_band.s[h]=q.sfBandIndex[e].s[h];for(h=0;h<c.PSFB12+1;h++)m=(b.scalefac_band.s[13]-
b.scalefac_band.s[12])/c.PSFB12,m=b.scalefac_band.s[12]+h*m,b.scalefac_band.psfb12[h]=m;b.scalefac_band.psfb12[c.PSFB12]=192;b.sideinfo_len=1==a.version?1==b.channels_out?21:36:1==b.channels_out?13:21;a.error_protection&&(b.sideinfo_len+=2);e=a.internal_flags;a.frameNum=0;a.write_id3tag_automatic&&t.id3tag_write_v2(a);e.bitrate_stereoMode_Hist=Ia([16,5]);e.bitrate_blockType_Hist=Ia([16,6]);e.PeakSample=0;a.bWriteVbrTag&&r.InitVbrTag(a);b.Class_ID=4294479419;for(e=0;19>e;e++)b.nsPsy.pefirbuf[e]=700*
b.mode_gr*b.channels_out;-1==a.ATHtype&&(a.ATHtype=4);switch(a.VBR){case G.vbr_mt:a.VBR=G.vbr_mtrh;case G.vbr_mtrh:null==a.useTemporal&&(a.useTemporal=!1);g.apply_preset(a,500-10*a.VBR_q,0);0>a.quality&&(a.quality=LAME_DEFAULT_QUALITY);5>a.quality&&(a.quality=0);5<a.quality&&(a.quality=5);b.PSY.mask_adjust=a.maskingadjust;b.PSY.mask_adjust_short=a.maskingadjust_short;b.sfb21_extra=a.experimentalY?!1:44E3<a.out_samplerate;b.iteration_loop=new VBRNewIterationLoop(D);break;case G.vbr_rh:g.apply_preset(a,
500-10*a.VBR_q,0);b.PSY.mask_adjust=a.maskingadjust;b.PSY.mask_adjust_short=a.maskingadjust_short;b.sfb21_extra=a.experimentalY?!1:44E3<a.out_samplerate;6<a.quality&&(a.quality=6);0>a.quality&&(a.quality=LAME_DEFAULT_QUALITY);b.iteration_loop=new VBROldIterationLoop(D);break;default:b.sfb21_extra=!1,0>a.quality&&(a.quality=LAME_DEFAULT_QUALITY),e=a.VBR,e==G.vbr_off&&(a.VBR_mean_bitrate_kbps=a.brate),g.apply_preset(a,a.VBR_mean_bitrate_kbps,0),a.VBR=e,b.PSY.mask_adjust=a.maskingadjust,b.PSY.mask_adjust_short=
a.maskingadjust_short,b.iteration_loop=e==G.vbr_off?new Bc(D):new ABRIterationLoop(D)}if(a.VBR!=G.vbr_off){b.VBR_min_bitrate=1;b.VBR_max_bitrate=14;16E3>a.out_samplerate&&(b.VBR_max_bitrate=8);if(0!=a.VBR_min_bitrate_kbps&&(a.VBR_min_bitrate_kbps=B(a.VBR_min_bitrate_kbps,a.version,a.out_samplerate),b.VBR_min_bitrate=U(a.VBR_min_bitrate_kbps,a.version,a.out_samplerate),0>b.VBR_min_bitrate)||0!=a.VBR_max_bitrate_kbps&&(a.VBR_max_bitrate_kbps=B(a.VBR_max_bitrate_kbps,a.version,a.out_samplerate),b.VBR_max_bitrate=
U(a.VBR_max_bitrate_kbps,a.version,a.out_samplerate),0>b.VBR_max_bitrate))return-1;a.VBR_min_bitrate_kbps=w.bitrate_table[a.version][b.VBR_min_bitrate];a.VBR_max_bitrate_kbps=w.bitrate_table[a.version][b.VBR_max_bitrate];a.VBR_mean_bitrate_kbps=Math.min(w.bitrate_table[a.version][b.VBR_max_bitrate],a.VBR_mean_bitrate_kbps);a.VBR_mean_bitrate_kbps=Math.max(w.bitrate_table[a.version][b.VBR_min_bitrate],a.VBR_mean_bitrate_kbps)}a.tune&&(b.PSY.mask_adjust+=a.tune_value_a,b.PSY.mask_adjust_short+=a.tune_value_a);
e=a.internal_flags;switch(a.quality){default:case 9:e.psymodel=0;e.noise_shaping=0;e.noise_shaping_amp=0;e.noise_shaping_stop=0;e.use_best_huffman=0;e.full_outer_loop=0;break;case 8:a.quality=7;case 7:e.psymodel=1;e.noise_shaping=0;e.noise_shaping_amp=0;e.noise_shaping_stop=0;e.use_best_huffman=0;e.full_outer_loop=0;break;case 6:e.psymodel=1;0==e.noise_shaping&&(e.noise_shaping=1);e.noise_shaping_amp=0;e.noise_shaping_stop=0;-1==e.subblock_gain&&(e.subblock_gain=1);e.use_best_huffman=0;e.full_outer_loop=
0;break;case 5:e.psymodel=1;0==e.noise_shaping&&(e.noise_shaping=1);e.noise_shaping_amp=0;e.noise_shaping_stop=0;-1==e.subblock_gain&&(e.subblock_gain=1);e.use_best_huffman=0;e.full_outer_loop=0;break;case 4:e.psymodel=1;0==e.noise_shaping&&(e.noise_shaping=1);e.noise_shaping_amp=0;e.noise_shaping_stop=0;-1==e.subblock_gain&&(e.subblock_gain=1);e.use_best_huffman=1;e.full_outer_loop=0;break;case 3:e.psymodel=1;0==e.noise_shaping&&(e.noise_shaping=1);e.noise_shaping_amp=1;e.noise_shaping_stop=1;-1==
e.subblock_gain&&(e.subblock_gain=1);e.use_best_huffman=1;e.full_outer_loop=0;break;case 2:e.psymodel=1;0==e.noise_shaping&&(e.noise_shaping=1);0==e.substep_shaping&&(e.substep_shaping=2);e.noise_shaping_amp=1;e.noise_shaping_stop=1;-1==e.subblock_gain&&(e.subblock_gain=1);e.use_best_huffman=1;e.full_outer_loop=0;break;case 1:e.psymodel=1;0==e.noise_shaping&&(e.noise_shaping=1);0==e.substep_shaping&&(e.substep_shaping=2);e.noise_shaping_amp=2;e.noise_shaping_stop=1;-1==e.subblock_gain&&(e.subblock_gain=
1);e.use_best_huffman=1;e.full_outer_loop=0;break;case 0:e.psymodel=1,0==e.noise_shaping&&(e.noise_shaping=1),0==e.substep_shaping&&(e.substep_shaping=2),e.noise_shaping_amp=2,e.noise_shaping_stop=1,-1==e.subblock_gain&&(e.subblock_gain=1),e.use_best_huffman=1,e.full_outer_loop=0}b.ATH.useAdjust=0>a.athaa_type?3:a.athaa_type;b.ATH.aaSensitivityP=Math.pow(10,a.athaa_sensitivity/-10);null==a.short_blocks&&(a.short_blocks=ra.short_block_allowed);a.short_blocks!=ra.short_block_allowed||a.mode!=la.JOINT_STEREO&&
a.mode!=la.STEREO||(a.short_blocks=ra.short_block_coupled);0>a.quant_comp&&(a.quant_comp=1);0>a.quant_comp_short&&(a.quant_comp_short=0);0>a.msfix&&(a.msfix=0);a.exp_nspsytune|=1;0>a.internal_flags.nsPsy.attackthre&&(a.internal_flags.nsPsy.attackthre=Pb.NSATTACKTHRE);0>a.internal_flags.nsPsy.attackthre_s&&(a.internal_flags.nsPsy.attackthre_s=Pb.NSATTACKTHRE_S);0>a.scale&&(a.scale=1);0>a.ATHtype&&(a.ATHtype=4);0>a.ATHcurve&&(a.ATHcurve=4);0>a.athaa_loudapprox&&(a.athaa_loudapprox=2);0>a.interChRatio&&
(a.interChRatio=0);null==a.useTemporal&&(a.useTemporal=!0);b.slot_lag=b.frac_SpF=0;a.VBR==G.vbr_off&&(b.slot_lag=b.frac_SpF=72E3*(a.version+1)*a.brate%a.out_samplerate|0);q.iteration_init(a);p.psymodel_init(a);return 0};this.lame_encode_flush=function(a,e,f,g){var k=a.internal_flags,l=dc([2,1152]),h=0,m=k.mf_samples_to_encode-c.POSTDELAY,p=b(a);if(1>k.mf_samples_to_encode)return 0;var n=0;a.in_samplerate!=a.out_samplerate&&(m+=16*a.out_samplerate/a.in_samplerate);var q=a.framesize-m%a.framesize;576>
q&&(q+=a.framesize);a.encoder_padding=q;for(q=(m+q)/a.framesize;0<q&&0<=h;){var r=p-k.mf_size;m=a.frameNum;r*=a.in_samplerate;r/=a.out_samplerate;1152<r&&(r=1152);1>r&&(r=1);h=g-n;0==g&&(h=0);h=this.lame_encode_buffer(a,l[0],l[1],r,e,f,h);f+=h;n+=h;q-=m!=a.frameNum?1:0}k.mf_samples_to_encode=0;if(0>h)return h;h=g-n;0==g&&(h=0);d.flush_bitstream(a);h=d.copy_buffer(k,e,f,h,1);if(0>h)return h;f+=h;n+=h;h=g-n;0==g&&(h=0);if(a.write_id3tag_automatic){t.id3tag_write_v1(a);h=d.copy_buffer(k,e,f,h,0);if(0>
h)return h;n+=h}return n};this.lame_encode_buffer=function(a,b,d,c,e,f,g){var h=a.internal_flags,k=[null,null];if(4294479419!=h.Class_ID)return-3;if(0==c)return 0;if(null==h.in_buffer_0||h.in_buffer_nsamples<c)h.in_buffer_0=K(c),h.in_buffer_1=K(c),h.in_buffer_nsamples=c;k[0]=h.in_buffer_0;k[1]=h.in_buffer_1;for(var l=0;l<c;l++)k[0][l]=b[l],1<h.channels_in&&(k[1][l]=d[l]);return v(a,k[0],k[1],c,e,f,g)}}function Kc(){this.setModules=function(c,k){}}function Lc(){this.setModules=function(c,k,n){}}function Mc(){}
function Nc(){this.setModules=function(c,k){}}function Fa(){this.sampleRate=this.channels=this.dataLen=this.dataOffset=0}function cc(c){return c.charCodeAt(0)<<24|c.charCodeAt(1)<<16|c.charCodeAt(2)<<8|c.charCodeAt(3)}var na={fill:function(c,k,n,w){if(2==arguments.length)for(var u=0;u<c.length;u++)c[u]=arguments[1];else for(u=k;u<n;u++)c[u]=w}},T={arraycopy:function(c,k,n,w,E){for(E=k+E;k<E;)n[w++]=c[k++]}},aa={SQRT2:1.4142135623730951,FAST_LOG10:function(c){return Math.log10(c)},FAST_LOG10_X:function(c,
k){return Math.log10(c)*k}};ra.short_block_allowed=new ra(0);ra.short_block_coupled=new ra(1);ra.short_block_dispensed=new ra(2);ra.short_block_forced=new ra(3);var Ma={MAX_VALUE:3.4028235E38};G.vbr_off=new G(0);G.vbr_mt=new G(1);G.vbr_rh=new G(2);G.vbr_abr=new G(3);G.vbr_mtrh=new G(4);G.vbr_default=G.vbr_mtrh;la.STEREO=new la(0);la.JOINT_STEREO=new la(1);la.DUAL_CHANNEL=new la(2);la.MONO=new la(3);la.NOT_SET=new la(4);Y.STEPS_per_dB=100;Y.MAX_dB=120;Y.GAIN_NOT_ENOUGH_SAMPLES=-24601;Y.GAIN_ANALYSIS_ERROR=
0;Y.GAIN_ANALYSIS_OK=1;Y.INIT_GAIN_ANALYSIS_ERROR=0;Y.INIT_GAIN_ANALYSIS_OK=1;Y.YULE_ORDER=10;Y.MAX_ORDER=Y.YULE_ORDER;Y.MAX_SAMP_FREQ=48E3;Y.RMS_WINDOW_TIME_NUMERATOR=1;Y.RMS_WINDOW_TIME_DENOMINATOR=20;Y.MAX_SAMPLES_PER_WINDOW=Y.MAX_SAMP_FREQ*Y.RMS_WINDOW_TIME_NUMERATOR/Y.RMS_WINDOW_TIME_DENOMINATOR+1;qa.EQ=function(c,k){return Math.abs(c)>Math.abs(k)?Math.abs(c-k)<=1E-6*Math.abs(c):Math.abs(c-k)<=1E-6*Math.abs(k)};qa.NEQ=function(c,k){return!qa.EQ(c,k)};zb.NUMTOCENTRIES=100;zb.MAXFRAMESIZE=2880;
var w={t1HB:[1,1,1,0],t2HB:[1,2,1,3,1,1,3,2,0],t3HB:[3,2,1,1,1,1,3,2,0],t5HB:[1,2,6,5,3,1,4,4,7,5,7,1,6,1,1,0],t6HB:[7,3,5,1,6,2,3,2,5,4,4,1,3,3,2,0],t7HB:[1,2,10,19,16,10,3,3,7,10,5,3,11,4,13,17,8,4,12,11,18,15,11,2,7,6,9,14,3,1,6,4,5,3,2,0],t8HB:[3,4,6,18,12,5,5,1,2,16,9,3,7,3,5,14,7,3,19,17,15,13,10,4,13,5,8,11,5,1,12,4,4,1,1,0],t9HB:[7,5,9,14,15,7,6,4,5,5,6,7,7,6,8,8,8,5,15,6,9,10,5,1,11,7,9,6,4,1,14,4,6,2,6,0],t10HB:[1,2,10,23,35,30,12,17,3,3,8,12,18,21,12,7,11,9,15,21,32,40,19,6,14,13,22,34,
46,23,18,7,20,19,33,47,27,22,9,3,31,22,41,26,21,20,5,3,14,13,10,11,16,6,5,1,9,8,7,8,4,4,2,0],t11HB:[3,4,10,24,34,33,21,15,5,3,4,10,32,17,11,10,11,7,13,18,30,31,20,5,25,11,19,59,27,18,12,5,35,33,31,58,30,16,7,5,28,26,32,19,17,15,8,14,14,12,9,13,14,9,4,1,11,4,6,6,6,3,2,0],t12HB:[9,6,16,33,41,39,38,26,7,5,6,9,23,16,26,11,17,7,11,14,21,30,10,7,17,10,15,12,18,28,14,5,32,13,22,19,18,16,9,5,40,17,31,29,17,13,4,2,27,12,11,15,10,7,4,1,27,12,8,12,6,3,1,0],t13HB:[1,5,14,21,34,51,46,71,42,52,68,52,67,44,43,19,
3,4,12,19,31,26,44,33,31,24,32,24,31,35,22,14,15,13,23,36,59,49,77,65,29,40,30,40,27,33,42,16,22,20,37,61,56,79,73,64,43,76,56,37,26,31,25,14,35,16,60,57,97,75,114,91,54,73,55,41,48,53,23,24,58,27,50,96,76,70,93,84,77,58,79,29,74,49,41,17,47,45,78,74,115,94,90,79,69,83,71,50,59,38,36,15,72,34,56,95,92,85,91,90,86,73,77,65,51,44,43,42,43,20,30,44,55,78,72,87,78,61,46,54,37,30,20,16,53,25,41,37,44,59,54,81,66,76,57,54,37,18,39,11,35,33,31,57,42,82,72,80,47,58,55,21,22,26,38,22,53,25,23,38,70,60,51,
36,55,26,34,23,27,14,9,7,34,32,28,39,49,75,30,52,48,40,52,28,18,17,9,5,45,21,34,64,56,50,49,45,31,19,12,15,10,7,6,3,48,23,20,39,36,35,53,21,16,23,13,10,6,1,4,2,16,15,17,27,25,20,29,11,17,12,16,8,1,1,0,1],t15HB:[7,12,18,53,47,76,124,108,89,123,108,119,107,81,122,63,13,5,16,27,46,36,61,51,42,70,52,83,65,41,59,36,19,17,15,24,41,34,59,48,40,64,50,78,62,80,56,33,29,28,25,43,39,63,55,93,76,59,93,72,54,75,50,29,52,22,42,40,67,57,95,79,72,57,89,69,49,66,46,27,77,37,35,66,58,52,91,74,62,48,79,63,90,62,40,
38,125,32,60,56,50,92,78,65,55,87,71,51,73,51,70,30,109,53,49,94,88,75,66,122,91,73,56,42,64,44,21,25,90,43,41,77,73,63,56,92,77,66,47,67,48,53,36,20,71,34,67,60,58,49,88,76,67,106,71,54,38,39,23,15,109,53,51,47,90,82,58,57,48,72,57,41,23,27,62,9,86,42,40,37,70,64,52,43,70,55,42,25,29,18,11,11,118,68,30,55,50,46,74,65,49,39,24,16,22,13,14,7,91,44,39,38,34,63,52,45,31,52,28,19,14,8,9,3,123,60,58,53,47,43,32,22,37,24,17,12,15,10,2,1,71,37,34,30,28,20,17,26,21,16,10,6,8,6,2,0],t16HB:[1,5,14,44,74,63,
110,93,172,149,138,242,225,195,376,17,3,4,12,20,35,62,53,47,83,75,68,119,201,107,207,9,15,13,23,38,67,58,103,90,161,72,127,117,110,209,206,16,45,21,39,69,64,114,99,87,158,140,252,212,199,387,365,26,75,36,68,65,115,101,179,164,155,264,246,226,395,382,362,9,66,30,59,56,102,185,173,265,142,253,232,400,388,378,445,16,111,54,52,100,184,178,160,133,257,244,228,217,385,366,715,10,98,48,91,88,165,157,148,261,248,407,397,372,380,889,884,8,85,84,81,159,156,143,260,249,427,401,392,383,727,713,708,7,154,76,73,
141,131,256,245,426,406,394,384,735,359,710,352,11,139,129,67,125,247,233,229,219,393,743,737,720,885,882,439,4,243,120,118,115,227,223,396,746,742,736,721,712,706,223,436,6,202,224,222,218,216,389,386,381,364,888,443,707,440,437,1728,4,747,211,210,208,370,379,734,723,714,1735,883,877,876,3459,865,2,377,369,102,187,726,722,358,711,709,866,1734,871,3458,870,434,0,12,10,7,11,10,17,11,9,13,12,10,7,5,3,1,3],t24HB:[15,13,46,80,146,262,248,434,426,669,653,649,621,517,1032,88,14,12,21,38,71,130,122,216,
209,198,327,345,319,297,279,42,47,22,41,74,68,128,120,221,207,194,182,340,315,295,541,18,81,39,75,70,134,125,116,220,204,190,178,325,311,293,271,16,147,72,69,135,127,118,112,210,200,188,352,323,306,285,540,14,263,66,129,126,119,114,214,202,192,180,341,317,301,281,262,12,249,123,121,117,113,215,206,195,185,347,330,308,291,272,520,10,435,115,111,109,211,203,196,187,353,332,313,298,283,531,381,17,427,212,208,205,201,193,186,177,169,320,303,286,268,514,377,16,335,199,197,191,189,181,174,333,321,305,289,
275,521,379,371,11,668,184,183,179,175,344,331,314,304,290,277,530,383,373,366,10,652,346,171,168,164,318,309,299,287,276,263,513,375,368,362,6,648,322,316,312,307,302,292,284,269,261,512,376,370,364,359,4,620,300,296,294,288,282,273,266,515,380,374,369,365,361,357,2,1033,280,278,274,267,264,259,382,378,372,367,363,360,358,356,0,43,20,19,17,15,13,11,9,7,6,4,7,5,3,1,3],t32HB:[1,10,8,20,12,20,16,32,14,12,24,0,28,16,24,16],t33HB:[15,28,26,48,22,40,36,64,14,24,20,32,12,16,8,0],t1l:[1,4,3,5],t2l:[1,4,
7,4,5,7,6,7,8],t3l:[2,3,7,4,4,7,6,7,8],t5l:[1,4,7,8,4,5,8,9,7,8,9,10,8,8,9,10],t6l:[3,4,6,8,4,4,6,7,5,6,7,8,7,7,8,9],t7l:[1,4,7,9,9,10,4,6,8,9,9,10,7,7,9,10,10,11,8,9,10,11,11,11,8,9,10,11,11,12,9,10,11,12,12,12],t8l:[2,4,7,9,9,10,4,4,6,10,10,10,7,6,8,10,10,11,9,10,10,11,11,12,9,9,10,11,12,12,10,10,11,11,13,13],t9l:[3,4,6,7,9,10,4,5,6,7,8,10,5,6,7,8,9,10,7,7,8,9,9,10,8,8,9,9,10,11,9,9,10,10,11,11],t10l:[1,4,7,9,10,10,10,11,4,6,8,9,10,11,10,10,7,8,9,10,11,12,11,11,8,9,10,11,12,12,11,12,9,10,11,12,
12,12,12,12,10,11,12,12,13,13,12,13,9,10,11,12,12,12,13,13,10,10,11,12,12,13,13,13],t11l:[2,4,6,8,9,10,9,10,4,5,6,8,10,10,9,10,6,7,8,9,10,11,10,10,8,8,9,11,10,12,10,11,9,10,10,11,11,12,11,12,9,10,11,12,12,13,12,13,9,9,9,10,11,12,12,12,9,9,10,11,12,12,12,12],t12l:[4,4,6,8,9,10,10,10,4,5,6,7,9,9,10,10,6,6,7,8,9,10,9,10,7,7,8,8,9,10,10,10,8,8,9,9,10,10,10,11,9,9,10,10,10,11,10,11,9,9,9,10,10,11,11,12,10,10,10,11,11,11,11,12],t13l:[1,5,7,8,9,10,10,11,10,11,12,12,13,13,14,14,4,6,8,9,10,10,11,11,11,11,
12,12,13,14,14,14,7,8,9,10,11,11,12,12,11,12,12,13,13,14,15,15,8,9,10,11,11,12,12,12,12,13,13,13,13,14,15,15,9,9,11,11,12,12,13,13,12,13,13,14,14,15,15,16,10,10,11,12,12,12,13,13,13,13,14,13,15,15,16,16,10,11,12,12,13,13,13,13,13,14,14,14,15,15,16,16,11,11,12,13,13,13,14,14,14,14,15,15,15,16,18,18,10,10,11,12,12,13,13,14,14,14,14,15,15,16,17,17,11,11,12,12,13,13,13,15,14,15,15,16,16,16,18,17,11,12,12,13,13,14,14,15,14,15,16,15,16,17,18,19,12,12,12,13,14,14,14,14,15,15,15,16,17,17,17,18,12,13,13,14,
14,15,14,15,16,16,17,17,17,18,18,18,13,13,14,15,15,15,16,16,16,16,16,17,18,17,18,18,14,14,14,15,15,15,17,16,16,19,17,17,17,19,18,18,13,14,15,16,16,16,17,16,17,17,18,18,21,20,21,18],t15l:[3,5,6,8,8,9,10,10,10,11,11,12,12,12,13,14,5,5,7,8,9,9,10,10,10,11,11,12,12,12,13,13,6,7,7,8,9,9,10,10,10,11,11,12,12,13,13,13,7,8,8,9,9,10,10,11,11,11,12,12,12,13,13,13,8,8,9,9,10,10,11,11,11,11,12,12,12,13,13,13,9,9,9,10,10,10,11,11,11,11,12,12,13,13,13,14,10,9,10,10,10,11,11,11,11,12,12,12,13,13,14,14,10,10,10,
11,11,11,11,12,12,12,12,12,13,13,13,14,10,10,10,11,11,11,11,12,12,12,12,13,13,14,14,14,10,10,11,11,11,11,12,12,12,13,13,13,13,14,14,14,11,11,11,11,12,12,12,12,12,13,13,13,13,14,15,14,11,11,11,11,12,12,12,12,13,13,13,13,14,14,14,15,12,12,11,12,12,12,13,13,13,13,13,13,14,14,15,15,12,12,12,12,12,13,13,13,13,14,14,14,14,14,15,15,13,13,13,13,13,13,13,13,14,14,14,14,15,15,14,15,13,13,13,13,13,13,13,14,14,14,14,14,15,15,15,15],t16_5l:[1,5,7,9,10,10,11,11,12,12,12,13,13,13,14,11,4,6,8,9,10,11,11,11,12,12,
12,13,14,13,14,11,7,8,9,10,11,11,12,12,13,12,13,13,13,14,14,12,9,9,10,11,11,12,12,12,13,13,14,14,14,15,15,13,10,10,11,11,12,12,13,13,13,14,14,14,15,15,15,12,10,10,11,11,12,13,13,14,13,14,14,15,15,15,16,13,11,11,11,12,13,13,13,13,14,14,14,14,15,15,16,13,11,11,12,12,13,13,13,14,14,15,15,15,15,17,17,13,11,12,12,13,13,13,14,14,15,15,15,15,16,16,16,13,12,12,12,13,13,14,14,15,15,15,15,16,15,16,15,14,12,13,12,13,14,14,14,14,15,16,16,16,17,17,16,13,13,13,13,13,14,14,15,16,16,16,16,16,16,15,16,14,13,14,14,
14,14,15,15,15,15,17,16,16,16,16,18,14,15,14,14,14,15,15,16,16,16,18,17,17,17,19,17,14,14,15,13,14,16,16,15,16,16,17,18,17,19,17,16,14,11,11,11,12,12,13,13,13,14,14,14,14,14,14,14,12],t16l:[1,5,7,9,10,10,11,11,12,12,12,13,13,13,14,10,4,6,8,9,10,11,11,11,12,12,12,13,14,13,14,10,7,8,9,10,11,11,12,12,13,12,13,13,13,14,14,11,9,9,10,11,11,12,12,12,13,13,14,14,14,15,15,12,10,10,11,11,12,12,13,13,13,14,14,14,15,15,15,11,10,10,11,11,12,13,13,14,13,14,14,15,15,15,16,12,11,11,11,12,13,13,13,13,14,14,14,14,
15,15,16,12,11,11,12,12,13,13,13,14,14,15,15,15,15,17,17,12,11,12,12,13,13,13,14,14,15,15,15,15,16,16,16,12,12,12,12,13,13,14,14,15,15,15,15,16,15,16,15,13,12,13,12,13,14,14,14,14,15,16,16,16,17,17,16,12,13,13,13,13,14,14,15,16,16,16,16,16,16,15,16,13,13,14,14,14,14,15,15,15,15,17,16,16,16,16,18,13,15,14,14,14,15,15,16,16,16,18,17,17,17,19,17,13,14,15,13,14,16,16,15,16,16,17,18,17,19,17,16,13,10,10,10,11,11,12,12,12,13,13,13,13,13,13,13,10],t24l:[4,5,7,8,9,10,10,11,11,12,12,12,12,12,13,10,5,6,7,8,
9,10,10,11,11,11,12,12,12,12,12,10,7,7,8,9,9,10,10,11,11,11,11,12,12,12,13,9,8,8,9,9,10,10,10,11,11,11,11,12,12,12,12,9,9,9,9,10,10,10,10,11,11,11,12,12,12,12,13,9,10,9,10,10,10,10,11,11,11,11,12,12,12,12,12,9,10,10,10,10,10,11,11,11,11,12,12,12,12,12,13,9,11,10,10,10,11,11,11,11,12,12,12,12,12,13,13,10,11,11,11,11,11,11,11,11,11,12,12,12,12,13,13,10,11,11,11,11,11,11,11,12,12,12,12,12,13,13,13,10,12,11,11,11,11,12,12,12,12,12,12,13,13,13,13,10,12,12,11,11,11,12,12,12,12,12,12,13,13,13,13,10,12,12,
12,12,12,12,12,12,12,12,13,13,13,13,13,10,12,12,12,12,12,12,12,12,13,13,13,13,13,13,13,10,13,12,12,12,12,12,12,13,13,13,13,13,13,13,13,10,9,9,9,9,9,9,9,9,9,9,9,10,10,10,10,6],t32l:[1,5,5,7,5,8,7,9,5,7,7,9,7,9,9,10],t33l:[4,5,5,6,5,6,6,7,5,6,6,7,6,7,7,8]};w.ht=[new U(0,0,null,null),new U(2,0,w.t1HB,w.t1l),new U(3,0,w.t2HB,w.t2l),new U(3,0,w.t3HB,w.t3l),new U(0,0,null,null),new U(4,0,w.t5HB,w.t5l),new U(4,0,w.t6HB,w.t6l),new U(6,0,w.t7HB,w.t7l),new U(6,0,w.t8HB,w.t8l),new U(6,0,w.t9HB,w.t9l),new U(8,
0,w.t10HB,w.t10l),new U(8,0,w.t11HB,w.t11l),new U(8,0,w.t12HB,w.t12l),new U(16,0,w.t13HB,w.t13l),new U(0,0,null,w.t16_5l),new U(16,0,w.t15HB,w.t15l),new U(1,1,w.t16HB,w.t16l),new U(2,3,w.t16HB,w.t16l),new U(3,7,w.t16HB,w.t16l),new U(4,15,w.t16HB,w.t16l),new U(6,63,w.t16HB,w.t16l),new U(8,255,w.t16HB,w.t16l),new U(10,1023,w.t16HB,w.t16l),new U(13,8191,w.t16HB,w.t16l),new U(4,15,w.t24HB,w.t24l),new U(5,31,w.t24HB,w.t24l),new U(6,63,w.t24HB,w.t24l),new U(7,127,w.t24HB,w.t24l),new U(8,255,w.t24HB,w.t24l),
new U(9,511,w.t24HB,w.t24l),new U(11,2047,w.t24HB,w.t24l),new U(13,8191,w.t24HB,w.t24l),new U(0,0,w.t32HB,w.t32l),new U(0,0,w.t33HB,w.t33l)];w.largetbl=[65540,327685,458759,589832,655369,655370,720906,720907,786443,786444,786444,851980,851980,851980,917517,655370,262149,393222,524295,589832,655369,720906,720906,720907,786443,786443,786444,851980,917516,851980,917516,655370,458759,524295,589832,655369,720905,720906,786442,786443,851979,786443,851979,851980,851980,917516,917517,720905,589832,589832,
655369,720905,720906,786442,786442,786443,851979,851979,917515,917516,917516,983052,983052,786441,655369,655369,720905,720906,786442,786442,851978,851979,851979,917515,917516,917516,983052,983052,983053,720905,655370,655369,720906,720906,786442,851978,851979,917515,851979,917515,917516,983052,983052,983052,1048588,786441,720906,720906,720906,786442,851978,851979,851979,851979,917515,917516,917516,917516,983052,983052,1048589,786441,720907,720906,786442,786442,851979,851979,851979,917515,917516,983052,
983052,983052,983052,1114125,1114125,786442,720907,786443,786443,851979,851979,851979,917515,917515,983051,983052,983052,983052,1048588,1048589,1048589,786442,786443,786443,786443,851979,851979,917515,917515,983052,983052,983052,983052,1048588,983053,1048589,983053,851978,786444,851979,786443,851979,917515,917516,917516,917516,983052,1048588,1048588,1048589,1114125,1114125,1048589,786442,851980,851980,851979,851979,917515,917516,983052,1048588,1048588,1048588,1048588,1048589,1048589,983053,1048589,
851978,851980,917516,917516,917516,917516,983052,983052,983052,983052,1114124,1048589,1048589,1048589,1048589,1179661,851978,983052,917516,917516,917516,983052,983052,1048588,1048588,1048589,1179661,1114125,1114125,1114125,1245197,1114125,851978,917517,983052,851980,917516,1048588,1048588,983052,1048589,1048589,1114125,1179661,1114125,1245197,1114125,1048589,851978,655369,655369,655369,720905,720905,786441,786441,786441,851977,851977,851977,851978,851978,851978,851978,655366];w.table23=[65538,262147,
458759,262148,327684,458759,393222,458759,524296];w.table56=[65539,262148,458758,524296,262148,327684,524294,589831,458757,524294,589831,655368,524295,524295,589832,655369];w.bitrate_table=[[0,8,16,24,32,40,48,56,64,80,96,112,128,144,160,-1],[0,32,40,48,56,64,80,96,112,128,160,192,224,256,320,-1],[0,8,16,24,32,40,48,56,64,-1,-1,-1,-1,-1,-1,-1]];w.samplerate_table=[[22050,24E3,16E3,-1],[44100,48E3,32E3,-1],[11025,12E3,8E3,-1]];w.scfsi_band=[0,6,11,16,21];ia.Q_MAX=257;ia.Q_MAX2=116;ia.LARGE_BITS=1E5;
ia.IXMAX_VAL=8206;var sa={};sa.SFBMAX=3*c.SBMAX_s;c.ENCDELAY=576;c.POSTDELAY=1152;c.MDCTDELAY=48;c.FFTOFFSET=224+c.MDCTDELAY;c.DECDELAY=528;c.SBLIMIT=32;c.CBANDS=64;c.SBPSY_l=21;c.SBPSY_s=12;c.SBMAX_l=22;c.SBMAX_s=13;c.PSFB21=6;c.PSFB12=6;c.BLKSIZE=1024;c.HBLKSIZE=c.BLKSIZE/2+1;c.BLKSIZE_s=256;c.HBLKSIZE_s=c.BLKSIZE_s/2+1;c.NORM_TYPE=0;c.START_TYPE=1;c.SHORT_TYPE=2;c.STOP_TYPE=3;c.MPG_MD_LR_LR=0;c.MPG_MD_LR_I=1;c.MPG_MD_MS_LR=2;c.MPG_MD_MS_I=3;c.fircoef=[-.1039435,-.1892065,-.0432472*5,-.155915,3.898045E-17,
.0467745*5,.50455,.756825,.187098*5];da.MFSIZE=3456+c.ENCDELAY-c.MDCTDELAY;da.MAX_HEADER_BUF=256;da.MAX_BITS_PER_CHANNEL=4095;da.MAX_BITS_PER_GRANULE=7680;da.BPC=320;Fa.RIFF=cc("RIFF");Fa.WAVE=cc("WAVE");Fa.fmt_=cc("fmt ");Fa.data=cc("data");Fa.readHeader=function(c){var k=new Fa,n=c.getUint32(0,!1);if(Fa.RIFF==n&&(c.getUint32(4,!0),Fa.WAVE==c.getUint32(8,!1)&&Fa.fmt_==c.getUint32(12,!1))){var u=c.getUint32(16,!0),w=20;switch(u){case 16:case 18:k.channels=c.getUint16(w+2,!0);k.sampleRate=c.getUint32(w+
4,!0);break;default:throw"extended fmt chunk not implemented";}w+=u;u=Fa.data;for(var B=0;u!=n;){n=c.getUint32(w,!1);B=c.getUint32(w+4,!0);if(u==n)break;w+=B+8}k.dataLen=B;k.dataOffset=w+8;return k}};sa.SFBMAX=3*c.SBMAX_s;lamejs.Mp3Encoder=function(c,k,n){3!=arguments.length&&(console.error("WARN: Mp3Encoder(channels, samplerate, kbps) not specified"),c=1,k=44100,n=128);var u=new W,w=new Kc,B=new Y,G=new qa,f=new wc,b=new ia,v=new Ec,a=new zb,m=new mc,z=new Nc,e=new xc,l=new qb,d=new Lc,g=new Mc;
u.setModules(B,G,f,b,v,a,m,z,g);G.setModules(B,g,m,a);z.setModules(G,m);f.setModules(u);v.setModules(G,e,b,l);b.setModules(l,e,u.enc.psy);e.setModules(G);l.setModules(b);a.setModules(u,G,m);w.setModules(d,g);d.setModules(m,z,f);var q=u.lame_init();q.num_channels=c;q.in_samplerate=k;q.brate=n;q.mode=la.STEREO;q.quality=3;q.bWriteVbrTag=!1;q.disable_reservoir=!0;q.write_id3tag_automatic=!1;u.lame_init_params(q);var D=1152,p=0|1.25*D+7200,r=new Int8Array(p);this.encodeBuffer=function(a,b){1==c&&(b=a);
a.length>D&&(D=a.length,p=0|1.25*D+7200,r=new Int8Array(p));a=u.lame_encode_buffer(q,a,b,a.length,r,0,p);return new Int8Array(r.subarray(0,a))};this.flush=function(){var a=u.lame_encode_flush(q,r,0,p);return new Int8Array(r.subarray(0,a))}};lamejs.WavHeader=Fa}lamejs();

function Header(el) {
    this.el = el;

    var $buttons = this.el.find('.openwebrx-main-buttons').find('[data-toggle-panel]').filter(function(){
        // ignore buttons when the corresponding panel is not in the DOM
        return $('#' + $(this).data('toggle-panel'))[0];
    });

    $buttons.css({display: 'block'}).click(function () {
        toggle_panel($(this).data('toggle-panel'));
    });

    this.init_rx_photo();
};

Header.prototype.setDetails = function(details) {
    // Set receiver name
    var title = this.el.find('.webrx-rx-title');
    title.html(details['receiver_name']);

    // If receiver name has readable text, use it for window title
    var titleText = title.prop('textContent');
    if (titleText.length>0) document.title = 'OpenWebRX+ | ' + titleText;

    // Set the rest of details
    this.el.find('.webrx-rx-desc').html(details['receiver_location'] + ' | Loc: ' + details['locator'] + ', ASL: ' + details['receiver_asl'] + ' m');
    this.el.find('.webrx-rx-photo-title').html(details['photo_title']);
    this.el.find('.webrx-rx-photo-desc').html(details['photo_desc']);
};

Header.prototype.init_rx_photo = function() {
    this.rx_photo_state = 0;

    $.extend($.easing, {
        easeOutCubic:function(x) {
            return 1 - Math.pow( 1 - x, 3 );
        }
    });

    $('.webrx-top-container').find('.openwebrx-photo-trigger').click(this.toggle_rx_photo.bind(this));
};

Header.prototype.close_rx_photo = function() {
    this.rx_photo_state = 0;
    this.el.find('.openwebrx-description-container').removeClass('expanded');
    this.el.find(".openwebrx-rx-details-arrow").removeClass('openwebrx-rx-details-arrow--up').addClass('openwebrx-rx-details-arrow--down');
}

Header.prototype.open_rx_photo = function() {
    this.rx_photo_state = 1;
    this.el.find('.openwebrx-description-container').addClass('expanded');
    this.el.find(".openwebrx-rx-details-arrow").removeClass('openwebrx-rx-details-arrow--down').addClass('openwebrx-rx-details-arrow--up');
}

Header.prototype.toggle_rx_photo = function(ev) {
    if (ev && ev.target && ev.target.tagName == 'A') {
        return;
    }
    if (this.rx_photo_state) {
        this.close_rx_photo();
    } else {
        this.open_rx_photo();
    }
};

$.fn.header = function() {
    if (!this.data('header')) {
        this.data('header', new Header(this));
    }
    return this.data('header');
};

$(function(){
    $('.webrx-top-container').header();
});

function Filter(demodulator) {
    this.demodulator = demodulator;
    this.min_passband = 100;
}

Filter.prototype.getLimits = function() {
    var max_bw;
    if (['pocsag', 'page', 'packet', 'ais', 'acars'].indexOf(this.demodulator.get_secondary_demod()) >= 0) {
        max_bw = 12500;
    } else if (['dmr', 'dstar', 'nxdn', 'ysf', 'm17'].indexOf(this.demodulator.get_modulation()) >= 0) {
        max_bw = 6250;
    } else if (['lsbd', 'usbd'].indexOf(this.demodulator.get_modulation()) >= 0) {
        max_bw = 24000;
    } else if (this.demodulator.get_modulation() === 'wfm') {
        max_bw = 100000;
    } else if (this.demodulator.get_modulation() === 'drm') {
        max_bw = 50000;
    } else if (this.demodulator.get_modulation() === "freedv") {
        max_bw = 4000;
    } else if (this.demodulator.get_secondary_demod() === "ism") {
        max_bw = 600000;
    } else {
        max_bw = (audioEngine.getOutputRate() / 2) - 1;
    }
    return {
        high: max_bw,
        low: -max_bw
    };
};

function Envelope(demodulator) {
    this.demodulator = demodulator;
    this.dragged_range = Demodulator.draggable_ranges.none;
}

Envelope.prototype.draw = function(visible_range){
    this.visible_range = visible_range;
    var line = center_freq + this.demodulator.offset_frequency;

    //                                               ____
    // Draws a standard filter envelope like this: _/    \_
    // Parameters are given in offset frequency (Hz).
    // Envelope is drawn on the scale canvas.
    // A "drag range" object is returned, containing information about the draggable areas of the envelope
    // (beginning, ending and the line showing the offset frequency).
    var env_bounding_line_w = 5;   //
    var env_att_w = 5;             //     _______   ___env_h2 in px   ___|_____
    var env_h1 = 17;               //   _/|      \_ ___env_h1 in px _/   |_    \_
    var env_h2 = 5;                //   |||env_att_line_w                |_env_lineplus
    var env_lineplus = 1;          //   ||env_bounding_line_w
    var env_line_click_area = 6;
    //range=get_visible_freq_range();

    var from = center_freq + this.demodulator.offset_frequency;
    var to = center_freq + this.demodulator.offset_frequency;
    var fake_indicator = this.demodulator.low_cut==null || this.demodulator.high_cut==null;
    if (fake_indicator) {
        // fake values just so that the tuning indicator shows up
        var fixedBw = 3000
        // if we know the if rate, we can display that
        if (this.demodulator.ifRate) {
            fixedBw = this.demodulator.ifRate / 2;
        }
        from -= fixedBw;
        to += fixedBw;
    } else {
        from += this.demodulator.low_cut;
        to += this.demodulator.high_cut;
    }
    var from_px = scale_px_from_freq(from, range);
    var to_px = scale_px_from_freq(to, range);
    if (to_px < from_px) /* swap'em */ {
        var temp_px = to_px;
        to_px = from_px;
        from_px = temp_px;
    }

    from_px -= (env_att_w + env_bounding_line_w);
    to_px += (env_att_w + env_bounding_line_w);
    // do drawing:
    var color = this.color || '#ffff00'; // yellow
    scale_ctx.strokeStyle = color;
    scale_ctx.fillStyle = color;
    var drag_ranges = {envelope_on_screen: false, line_on_screen: false};
    if (!(to_px < 0 || from_px > window.innerWidth)) // out of screen?
    {
        scale_ctx.beginPath();

        if (fake_indicator) {
            scale_ctx.setLineDash([10, 5]);
        } else {
            drag_ranges.beginning = {x1: from_px, x2: from_px + env_bounding_line_w + env_att_w};
            drag_ranges.ending = {x1: to_px - env_bounding_line_w - env_att_w, x2: to_px};
            drag_ranges.whole_envelope = {x1: from_px, x2: to_px};
            drag_ranges.envelope_on_screen = true;
        }

        scale_ctx.moveTo(from_px, env_h1);
        scale_ctx.lineTo(from_px + env_bounding_line_w, env_h1);
        scale_ctx.lineTo(from_px + env_bounding_line_w + env_att_w, env_h2);
        scale_ctx.lineTo(to_px - env_bounding_line_w - env_att_w, env_h2);
        scale_ctx.lineTo(to_px - env_bounding_line_w, env_h1);
        scale_ctx.lineTo(to_px, env_h1);
        scale_ctx.lineWidth = 3;
        scale_ctx.globalAlpha = 0.3;
        scale_ctx.fill();
        scale_ctx.globalAlpha = 1;
        scale_ctx.stroke();
        scale_ctx.setLineDash([]);

        scale_ctx.lineWidth = 1;
        scale_ctx.font = "bold 11px sans-serif";
        scale_ctx.textBaseline = "top";
        scale_ctx.textAlign = "left";
        if (typeof(this.demodulator.high_cut) === 'number') {
            scale_ctx.fillText(this.demodulator.high_cut.toString(), to_px + env_att_w, env_h2);
        }
        scale_ctx.textAlign = "right";
        if (typeof(this.demodulator.low_cut) === 'number') {
            scale_ctx.fillText(this.demodulator.low_cut.toString(), from_px - env_att_w, env_h2);
        }
    }
    if (typeof line !== "undefined") // out of screen?
    {
        var line_px = scale_px_from_freq(line, range);
        if (!(line_px < 0 || line_px > window.innerWidth)) {
            drag_ranges.line = {x1: line_px - env_line_click_area / 2, x2: line_px + env_line_click_area / 2};
            drag_ranges.line_on_screen = true;
            scale_ctx.beginPath();
            scale_ctx.moveTo(line_px, env_h1 + env_lineplus);
            scale_ctx.lineTo(line_px, env_h2 - env_lineplus);
            scale_ctx.lineWidth = 3;
            scale_ctx.stroke();
        }
    }
    this.drag_ranges = drag_ranges;
};

Envelope.prototype.drag_start = function(x, key_modifiers){
    this.key_modifiers = key_modifiers;
    this.dragged_range = this.where_clicked(x, this.drag_ranges, key_modifiers);
    this.drag_origin = {
        x: x,
        low_cut: this.demodulator.low_cut,
        high_cut: this.demodulator.high_cut,
        offset_frequency: this.demodulator.offset_frequency
    };
    return this.dragged_range !== Demodulator.draggable_ranges.none;
};

Envelope.prototype.where_clicked = function(x, drag_ranges, key_modifiers) {  // Check exactly what the user has clicked based on ranges returned by envelope_draw().
    var in_range = function (x, range) {
        return range.x1 <= x && range.x2 >= x;
    };
    var dr = Demodulator.draggable_ranges;

    if (key_modifiers.shiftKey) {
        //Check first: shift + center drag emulates BFO knob
        if (drag_ranges.line_on_screen && in_range(x, drag_ranges.line)) return dr.bfo;
        //Check second: shift + envelope drag emulates PBF knob
        if (drag_ranges.envelope_on_screen && in_range(x, drag_ranges.whole_envelope)) return dr.pbs;
    }
    if (drag_ranges.envelope_on_screen) {
        // For low and high cut:
        if (in_range(x, drag_ranges.beginning)) return dr.beginning;
        if (in_range(x, drag_ranges.ending)) return dr.ending;
        // Last priority: having clicked anything else on the envelope, without holding the shift key
        if (in_range(x, drag_ranges.whole_envelope)) return dr.anything_else;
    }
    return dr.none; //User doesn't drag the envelope for this demodulator
};


Envelope.prototype.drag_move = function(x) {
    var dr = Demodulator.draggable_ranges;
    var new_value;
    if (this.dragged_range === dr.none) return false; // we return if user is not dragging (us) at all
    var freq_change = Math.round(this.visible_range.hps * (x - this.drag_origin.x));

    //dragging the line in the middle of the filter envelope while holding Shift does emulate
    //the BFO knob on radio equipment: moving offset frequency, while passband remains unchanged
    //Filter passband moves in the opposite direction than dragged, hence the minus below.
    var minus = (this.dragged_range === dr.bfo) ? -1 : 1;
    //dragging any other parts of the filter envelope while holding Shift does emulate the PBS knob
    //(PassBand Shift) on radio equipment: PBS does move the whole passband without moving the offset
    //frequency.
    if (this.dragged_range === dr.beginning || this.dragged_range === dr.bfo || this.dragged_range === dr.pbs) {
        this.demodulator.moveBandpass(
            this.drag_origin.low_cut + minus * freq_change,
            this.drag_origin.high_cut
        );
    }
    if (this.dragged_range === dr.ending || this.dragged_range === dr.bfo || this.dragged_range === dr.pbs) {
        this.demodulator.moveBandpass(
            this.drag_origin.low_cut,
            this.drag_origin.high_cut + minus * freq_change
        );
    }
    if (this.dragged_range === dr.anything_else || this.dragged_range === dr.bfo) {
        //when any other part of the envelope is dragged, the offset frequency is changed (whole passband also moves with it)
        new_value = this.drag_origin.offset_frequency + freq_change;
        //round value to the current tuning step
        if (tuning_step > 0) {
            new_value = Math.round(new_value / tuning_step) * tuning_step;
        }
        if (new_value > bandwidth / 2 || new_value < -bandwidth / 2) return true; //we don't allow tuning above Nyquist frequency :-)
        this.demodulator.set_offset_frequency(new_value);
    }
    //now do the actual modifications:
    //mkenvelopes(this.visible_range);
    //this.demodulator.set();
    return true;
};

Envelope.prototype.drag_end = function(){
    var to_return = this.dragged_range !== Demodulator.draggable_ranges.none; //this part is required for cliking anywhere on the scale to set offset
    this.dragged_range = Demodulator.draggable_ranges.none;
    return to_return;
};

Envelope.prototype.wheel = function(x, dir, modifier){
    var range = this.where_clicked(x, this.drag_ranges, {});
    if (range === Demodulator.draggable_ranges.none) return false;

    // When modifier is FALSE, shift bandpass up / down
    // When modifier is TRUE, make bandpadd wider / narrower
    var high_delta = dir? -50 : 50;
    var low_delta  = modifier? -high_delta : high_delta;
    this.demodulator.moveBandpass(
        this.demodulator.low_cut + low_delta,
        this.demodulator.high_cut + high_delta
    );

    return true;
};

//******* class Demodulator_default_analog *******
// This can be used as a base for basic audio demodulators.
// It already supports most basic modulations used for ham radio and commercial services: AM/FM/LSB/USB

function Demodulator(offset_frequency, modulation) {
    this.offset_frequency = offset_frequency;
    this.envelope = new Envelope(this);
    this.color = Demodulator.get_next_color();
    this.modulation = modulation;
    this.filter = new Filter(this);
    this.squelch_level = -150;
    this.dmr_filter = 3;
    this.audio_service_id = 0;
    this.started = false;
    this.state = {};
    this.secondary_demod = false;
    var mode = Modes.findByModulation(modulation);
    this.low_cut = mode && mode.bandpass? mode.bandpass.low_cut : null;
    this.high_cut = mode && mode.bandpass? mode.bandpass.high_cut : null;
    this.ifRate = mode && mode.ifRate;
    this.listeners = {
        "frequencychange": [],
        "squelchchange": []
    };
}

//ranges on filter envelope that can be dragged:
Demodulator.draggable_ranges = {
    none: 0,
    beginning: 1 /*from*/,
    ending: 2 /*to*/,
    anything_else: 3,
    bfo: 4 /*line (while holding shift)*/,
    pbs: 5
}; //to which parameter these correspond in envelope_draw()

Demodulator.color_index = 0;
Demodulator.colors = ["#ffff00", "#00ff00", "#00ffff", "#058cff", "#ff9600", "#a1ff39", "#ff4e39", "#ff5dbd"];

Demodulator.get_next_color = function() {
    if (this.color_index >= this.colors.length) this.color_index = 0;
    return (this.colors[this.color_index++]);
}



Demodulator.prototype.on = function(event, handler) {
    this.listeners[event].push(handler);
};

Demodulator.prototype.emit = function(event, params) {
    this.listeners[event].forEach(function(fn) {
        fn(params);
    });
};

Demodulator.prototype.set_offset_frequency = function(to_what) {
    if (typeof(to_what) == 'undefined' || to_what > bandwidth / 2 || to_what < -bandwidth / 2) return;
    to_what = Math.round(to_what);
    if (this.offset_frequency === to_what) {
        return;
    }
    this.offset_frequency = to_what;
    this.set();
    this.emit("frequencychange", to_what);
    mkenvelopes(get_visible_freq_range());
};

Demodulator.prototype.get_offset_frequency = function() {
    return this.offset_frequency;
};

Demodulator.prototype.get_modulation = function() {
    return this.modulation;
};

Demodulator.prototype.start = function() {
    this.started = true;
    this.set();
    ws.send(JSON.stringify({
        "type": "dspcontrol",
        "action": "start"
    }));
};

// TODO check if this is actually used
Demodulator.prototype.stop = function() {
};

Demodulator.prototype.send = function(params) {
    ws.send(JSON.stringify({"type": "dspcontrol", "params": params}));
}

Demodulator.prototype.set = function () {  //this function sends demodulator parameters to the server
    if (!this.started) return;
    var params = {
        "low_cut": this.low_cut,
        "high_cut": this.high_cut,
        "offset_freq": this.offset_frequency,
        "mod": this.modulation,
        "dmr_filter": this.dmr_filter,
        "audio_service_id": this.audio_service_id,
        "squelch_level": this.squelch_level,
        "secondary_mod": this.secondary_demod,
        "secondary_offset_freq": this.secondary_offset_freq
    };
    var to_send = {};
    for (var key in params) {
        if (!(key in this.state) || params[key] !== this.state[key]) {
            to_send[key] = params[key];
        }
    }
    if (Object.keys(to_send).length > 0) {
        this.send(to_send);
        for (var key in to_send) {
            this.state[key] = to_send[key];
        }
    }
    mkenvelopes(get_visible_freq_range());
};

Demodulator.prototype.setSquelch = function(squelch) {
    if (this.squelch_level == squelch) {
        return;
    }
    this.squelch_level = squelch;
    this.set();
    this.emit("squelchchange", squelch);
};

Demodulator.prototype.getSquelch = function() {
    return this.squelch_level;
};

Demodulator.prototype.setDmrFilter = function(dmr_filter) {
    this.dmr_filter = dmr_filter;
    this.set();
};

Demodulator.prototype.setAudioServiceId = function(audio_service_id) {
    this.audio_service_id = audio_service_id;
    this.set();
}

Demodulator.prototype.setBandpass = function(bandpass) {
    this.bandpass = bandpass;
    this.low_cut = bandpass.low_cut;
    this.high_cut = bandpass.high_cut;
    this.set();
};

Demodulator.prototype.disableBandpass = function() {
    delete this.bandpass;
    this.low_cut = null;
    this.high_cut = null;
    this.set()
};

Demodulator.prototype.moveBandpass = function(low_new, high_new) {
    // Don't let low_cut go beyond its limits
    if (low_new < this.filter.getLimits().low) return;

    // Nor the filter passband be too small
    if (this.high_cut - low_new < this.filter.min_passband) return;

    // Sanity check to prevent GNU Radio "firdes check failed: fa <= fb"
    if (low_new >= this.high_cut) return;

    // Don't let high_cut go beyond its limits
    if (high_new > this.filter.getLimits().high) return;

    // Nor the filter passband be too small
    if (high_new - this.low_cut < this.filter.min_passband) return;

    // Sanity check to prevent GNU Radio "firdes check failed: fa <= fb"
    if (high_new <= this.low_cut) return;

    // Set new bounds
    this.low_cut  = low_new;
    this.high_cut = high_new;
    this.set();
};

Demodulator.prototype.getBandpass = function() {
    return {
        low_cut: this.low_cut,
        high_cut: this.high_cut
    };
};

Demodulator.prototype.setIfRate = function(ifRate) {
    this.ifRate = ifRate;
};

Demodulator.prototype.set_secondary_demod = function(secondary_demod) {
    if (this.secondary_demod === secondary_demod) {
        return;
    }
    this.secondary_demod = secondary_demod;
    this.set();
};

Demodulator.prototype.get_secondary_demod = function() {
    return this.secondary_demod;
};

Demodulator.prototype.set_secondary_offset_freq = function(secondary_offset) {
    if (this.secondary_offset_freq === secondary_offset) {
        return;
    }
    this.secondary_offset_freq = secondary_offset;
    this.set();
};

function DemodulatorPanel(el) {
    var self = this;
    self.el = el;
    self.demodulator = null;
    self.mode = null;
    self.squelchMargin = 10;
    self.initialParams = {};

    var displayEl = el.find('.webrx-actual-freq')
    this.tuneableFrequencyDisplay = displayEl.tuneableFrequencyDisplay();
    displayEl.on('frequencychange', function(event, freq) {
        self.getDemodulator().set_offset_frequency(freq - self.center_freq);
    });

    this.mouseFrequencyDisplay = el.find('.webrx-mouse-freq').frequencyDisplay();

    Modes.registerModePanel(this);
    el.on('click', '.openwebrx-demodulator-button', function() {
        var modulation = $(this).data('modulation');
        if (modulation) {
            if (self.mode && self.mode.type === 'digimode' && self.mode.underlying.indexOf(modulation) >= 0) {
                // keep the mode, just switch underlying modulation
                self.setMode(self.mode.modulation, modulation)
            } else {
                self.setMode(modulation);
            }
        } else {
            self.disableDigiMode();
        }
    });
    el.on('change', '.openwebrx-secondary-demod-listbox', function() {
        var value = $(this).val();
        if (value === 'none') {
            self.disableDigiMode();
        } else {
            self.setMode(value);
        }
    });
    el.on('click', '.openwebrx-squelch-auto', function() {
        if (!self.squelchAvailable()) return;
        el.find('.openwebrx-squelch-slider').val(getLogSmeterValue(smeter_level) + self.getSquelchMargin());
        self.updateSquelch();
    });
    el.on('change', '.openwebrx-squelch-slider', function() {
        self.updateSquelch();
    });
    window.addEventListener('hashchange', function() {
        self.onHashChange();
    });
};

DemodulatorPanel.prototype.render = function() {
    var normalModes = Modes.getModes()
        .filter(function(m){ return m.type === 'analog'; });

    var digiModes = Modes.getModes()
        .filter(function(m){ return m.type === 'digimode'; })
        .sort(function(a, b){ return a.name.localeCompare(b.name) });

    var html = []

    var buttons = normalModes.map(function(m){
        return $(
            '<div ' +
                'class="openwebrx-button openwebrx-demodulator-button" ' +
                'data-modulation="' + m.modulation + '" ' +
                'id="openwebrx-button-' + m.modulation + '" r' +
            '>' + m.name + '</div>'
        );
    });

    var $modegrid = $('<div class="openwebrx-modes-grid"></div>');
    $modegrid.append.apply($modegrid, buttons);
    html.push($modegrid);

    html.push($(
        '<div class="openwebrx-panel-line openwebrx-panel-flex-line">' +
            '<div class="openwebrx-button openwebrx-demodulator-button openwebrx-button-dig">DIG</div>' +
            '<select class="openwebrx-secondary-demod-listbox">' +
                '<option value="none"></option>' +
                digiModes.map(function(m){
                    return '<option value="' + m.modulation + '">' + m.name + '</option>';
                }).join('') +
            '</select>' +
        '</div>'
    ));

    this.el.find(".openwebrx-modes").html(html);
};

DemodulatorPanel.prototype.setMode = function(requestedModulation, underlyingModulation) {
    var mode = Modes.findByModulation(requestedModulation);
    if (!mode) {
        return;
    }

    if (this.mode === mode && this.underlyingModulation === underlyingModulation) {
        return;
    }

    var modulation;
    if (mode.type !== 'digimode') {
        // analog modes have no underlying modulation
        underlyingModulation = undefined;
        modulation = mode.modulation;
    } else if (underlyingModulation) {
        // use given underlying modulation
        modulation = underlyingModulation;
    } else if (mode.underlying.indexOf(this.underlyingModulation) >= 0) {
        // use current underlying modulation if it fits
        modulation = underlyingModulation = this.underlyingModulation;
    } else if (this.mode && mode.underlying.indexOf(this.mode.modulation) >= 0) {
        // use current mode modulation if it fits
        modulation = underlyingModulation = this.mode.modulation;
    } else {
        // use mode's default underlying modulation
        modulation = underlyingModulation = mode.underlying[0];
    }

    var current = this.collectParams();
    if (this.demodulator) {
        current.offset_frequency = this.demodulator.get_offset_frequency();
        current.squelch_level = this.demodulator.getSquelch();
    }

    this.stopDemodulator();
    this.demodulator = new Demodulator(current.offset_frequency, modulation);
    this.demodulator.setSquelch(current.squelch_level);

    var self = this;
    var updateFrequency = function(freq) {
        self.tuneableFrequencyDisplay.setFrequency(self.center_freq + freq);
        self.updateHash();
    };
    this.demodulator.on("frequencychange", updateFrequency);
    updateFrequency(this.demodulator.get_offset_frequency());
    var updateSquelch = function(squelch) {
        self.el.find('.openwebrx-squelch-slider')
            .val(squelch)
            .attr('title', 'Squelch (' + squelch + ' dB)');
        self.updateHash();
    };
    this.demodulator.on('squelchchange', updateSquelch);
    updateSquelch(this.demodulator.getSquelch());

    if (mode.type === 'digimode') {
        this.demodulator.set_secondary_demod(mode.modulation);
        var uMode = Modes.findByModulation(underlyingModulation);
        var bandpass = mode.bandpass || (uMode && uMode.bandpass);
        if (bandpass) {
            this.demodulator.setBandpass(bandpass);
        } else {
            this.demodulator.disableBandpass();
        }
        var ifRate = mode.ifRate || (uMode && uMode.ifRate);
        this.demodulator.setIfRate(ifRate);
    } else {
        this.demodulator.set_secondary_demod(false);
    }

    this.demodulator.start();
    this.mode = mode;
    this.underlyingModulation = underlyingModulation;

    this.updateButtons();
    this.updatePanels();
    this.updateHash();
};

DemodulatorPanel.prototype.disableDigiMode = function() {
    this.setMode(this.getDemodulator().get_modulation());
};

DemodulatorPanel.prototype.updatePanels = function() {
    var modulation = this.getDemodulator().get_secondary_demod();
    $('#openwebrx-panel-digimodes').attr('data-mode', modulation);
    var mode = Modes.findByModulation(modulation);
    toggle_panel("openwebrx-panel-digimodes", modulation && (!mode || mode.secondaryFft));
    // WSJT-X modes share the same panel
    toggle_panel("openwebrx-panel-wsjt-message", ['ft8', 'wspr', 'jt65', 'jt9', 'ft4', 'fst4', 'fst4w', "q65", "msk144"].indexOf(modulation) >= 0);
    // Aeronautic modes share the same panel
    toggle_panel("openwebrx-panel-hfdl-message", ['hfdl', 'vdl2', 'acars'].indexOf(modulation) >= 0);
    // Packet modes share the same panel
    toggle_panel("openwebrx-panel-packet-message", ['packet', 'ais'].indexOf(modulation) >= 0);
    // These modes come with their own panels
    ['js8', 'page', 'pocsag', 'sstv', 'fax', 'ism', 'dsc', 'adsb', 'cwskimmer'].forEach(function(m) {
        toggle_panel('openwebrx-panel-' + m + '-message', modulation === m);
    });

    modulation = this.getDemodulator().get_modulation();
    var showing = 'openwebrx-panel-metadata-' + modulation;
    var metaPanels = $(".openwebrx-meta-panel");
    metaPanels.each(function (_, p) {
        toggle_panel(p.id, p.id === showing && !p.classList.contains('disabled'));
    });
    metaPanels.metaPanel().each(function() {
        this.clear();
    });
};

DemodulatorPanel.prototype.getDemodulator = function() {
    return this.demodulator;
};

DemodulatorPanel.prototype.collectParams = function() {
    var defaults = {
        offset_frequency: 0,
        squelch_level: -150,
        mod: 'nfm'
    }
    return $.extend(new Object(), defaults, this.validateInitialParams(this.initialParams), this.transformHashParams(this.parseHash()));
};

DemodulatorPanel.prototype.startDemodulator = function() {
    var params = this.collectParams();
    this.setMagicKey(params.magic_key);

    if (Modes.initComplete() && this.center_freq)
        this._apply(params);
};

DemodulatorPanel.prototype.stopDemodulator = function() {
    if (!this.demodulator) {
        return;
    }
    this.demodulator.stop();
    this.demodulator = null;
    this.mode = null;
}

DemodulatorPanel.prototype._apply = function(params) {
    if (params.secondary_mod) {
        this.setMode(params.secondary_mod, params.mod)
    } else {
        this.setMode(params.mod);
    }
    this.getDemodulator().set_offset_frequency(params.offset_frequency);
    this.getDemodulator().setSquelch(params.squelch_level);
    this.updateButtons();
};

DemodulatorPanel.prototype.setInitialParams = function(params) {
    $.extend(this.initialParams, params);
};

DemodulatorPanel.prototype.resetInitialParams = function() {
    this.initialParams = {};
};

DemodulatorPanel.prototype.setMagicKey = function(key) {
    this.magic_key = key;
};

DemodulatorPanel.prototype.getMagicKey = function() {
    return this.magic_key;
};

DemodulatorPanel.prototype.onHashChange = function() {
    this._apply(this.transformHashParams(this.parseHash()));
};

DemodulatorPanel.prototype.transformHashParams = function(params) {
    var ret = {
        mod: params.mod
    };
    if (typeof(params.secondary_mod) !== 'undefined') ret.secondary_mod = params.secondary_mod;
    if (typeof(params.offset_frequency) !== 'undefined') ret.offset_frequency = params.offset_frequency;
    if (typeof(params.sql) !== 'undefined') ret.squelch_level = parseInt(params.sql);
    if (typeof(params.key) !== 'undefined') ret.magic_key = params.key;
    return ret;
};

DemodulatorPanel.prototype.squelchAvailable = function () {
    return this.mode && this.mode.squelch;
}

DemodulatorPanel.prototype.updateButtons = function() {
    var $buttons = this.el.find(".openwebrx-demodulator-button");
    $buttons.removeClass("highlighted").removeClass('same-mod');
    var demod = this.getDemodulator()
    if (!demod) return;
    this.el.find('[data-modulation=' + demod.get_modulation() + ']').addClass("highlighted");
    var secondary_demod = demod.get_secondary_demod()
    if (secondary_demod) {
        this.el.find(".openwebrx-button-dig").addClass("highlighted");
        this.el.find('.openwebrx-secondary-demod-listbox').val(secondary_demod);
        var mode = Modes.findByModulation(secondary_demod);
        if (mode) {
            var self = this;
            mode.underlying.filter(function(m) {
                return m !== demod.get_modulation();
            }).forEach(function(m) {
                self.el.find('[data-modulation=' + m + ']').addClass('same-mod')
            });
        }
    } else {
        this.el.find('.openwebrx-secondary-demod-listbox').val('none');
    }
    var squelch_disabled = !this.squelchAvailable();
    this.el.find('.openwebrx-squelch-slider').prop('disabled', squelch_disabled);
    this.el.find('.openwebrx-squelch-auto')[squelch_disabled ? 'addClass' : 'removeClass']('disabled');
}

DemodulatorPanel.prototype.setCenterFrequency = function(center_freq) {
    var me = this;
    if (me.centerFreqTimeout) {
        clearTimeout(me.centerFreqTimeout);
        me.centerFreqTimeout = false;
    }
    this.centerFreqTimeout = setTimeout(function() {
        me.stopDemodulator();
        me.center_freq = center_freq;
        me.startDemodulator();
        me.centerFreqTimeout = false;
    }, 50);
};

DemodulatorPanel.prototype.parseHash = function() {
    if (!window.location.hash) {
        return {};
    }
    var params = window.location.hash.substring(1).split(",").map(function(x) {
        var harr = x.split('=');
        return [harr[0], harr.slice(1).join('=')];
    }).reduce(function(params, p){
        params[p[0]] = p[1];
        return params;
    }, {});

    return this.validateHash(params);
};

DemodulatorPanel.prototype.validateHash = function(params) {
    var self = this;
    params = Object.keys(params).filter(function(key) {
        if (key == 'freq' || key == 'mod' || key == 'secondary_mod' || key == 'sql') {
            return params.freq && Math.abs(params.freq - self.center_freq) <= bandwidth / 2;
        }
        return true;
    }).reduce(function(p, key) {
        p[key] = params[key];
        return p;
    }, {});

    if (params['freq']) {
        params['offset_frequency'] = params['freq'] - self.center_freq;
        delete params['freq'];
    }

    return params;
};

DemodulatorPanel.prototype.validateInitialParams = function(params) {
    return Object.fromEntries(
        Object.entries(params).filter(function(a) {
            if (a[0] == "offset_frequency") {
                return Math.abs(a[1]) <= bandwidth / 2;
            }
            return true;
        })
    );
};

DemodulatorPanel.prototype.updateHash = function() {
    var demod = this.getDemodulator();
    if (!demod) return;
    var self = this;
    window.location.hash = $.map({
        freq: demod.get_offset_frequency() + self.center_freq,
        mod: demod.get_modulation(),
        secondary_mod: demod.get_secondary_demod(),
        sql: demod.getSquelch(),
        key: self.magic_key
    }, function(value, key){
        if (typeof(value) === 'undefined' || value === false || value === '')
            return undefined;
        else
            return key + '=' + value;
    }).filter(function(v) {
        return !!v;
    }).join(',');
};

DemodulatorPanel.prototype.updateSquelch = function() {
    var sliderValue = parseInt(this.el.find(".openwebrx-squelch-slider").val());
    var demod = this.getDemodulator();
    if (demod) demod.setSquelch(sliderValue);
};

DemodulatorPanel.prototype.setSquelchMargin = function(margin) {
    if (typeof(margin) === 'undefined' || this.squelchMargin == margin) return;
    this.squelchMargin = margin;
};

DemodulatorPanel.prototype.getSquelchMargin = function() {
    return this.squelchMargin;
};

DemodulatorPanel.prototype.setMouseFrequency = function(freq) {
    this.mouseFrequencyDisplay.setFrequency(freq);
};

DemodulatorPanel.prototype.setTuningPrecision = function(precision) {
    this.tuneableFrequencyDisplay.setTuningPrecision(precision);
    this.mouseFrequencyDisplay.setTuningPrecision(precision);
};

$.fn.demodulatorPanel = function(){
    if (!this.data('panel')) {
        this.data('panel', new DemodulatorPanel(this));
    }
    return this.data('panel');
};

BookmarkLocalStorage = function(){
};

BookmarkLocalStorage.prototype.getBookmarks = function(){
    return JSON.parse(window.localStorage.getItem("bookmarks")) || [];
};

BookmarkLocalStorage.prototype.setBookmarks = function(bookmarks){
    window.localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
};

BookmarkLocalStorage.prototype.deleteBookmark = function(data) {
    if (data.id) data = data.id;
    var bookmarks = this.getBookmarks();
    bookmarks = bookmarks.filter(function(b) { return b.id !== data; });
    this.setBookmarks(bookmarks);
};

function BookmarkBar() {
    var me = this;
    me.modesToScan = ['lsb', 'usb', 'cw', 'am', 'sam', 'nfm'];
    me.localBookmarks = new BookmarkLocalStorage();
    me.$container = $('#openwebrx-bookmarks-container');
    me.bookmarks = {};

    me.$container.on('click', '.bookmark', function(e){
        var $bookmark = $(e.target).closest('.bookmark');
        me.$container.find('.bookmark').removeClass('selected');
        if (UI.tuneBookmark($bookmark.data())) {
            $bookmark.addClass('selected');
            UI.toggleScanner(false);
        }
    });

    me.$container.on('click', '.action[data-action=edit]', function(e){
        e.stopPropagation();
        var $bookmark = $(e.target).closest('.bookmark');
        me.showEditDialog($bookmark.data());
    });

    me.$container.on('click', '.action[data-action=delete]', function(e){
        e.stopPropagation();
        var $bookmark = $(e.target).closest('.bookmark');
        me.localBookmarks.deleteBookmark($bookmark.data());
        me.loadLocalBookmarks();
    });

    var $bookmarkButton = $('#openwebrx-panel-receiver').find('.openwebrx-bookmark-button');
    if (typeof(Storage) !== 'undefined') {
        $bookmarkButton.show();
    } else {
        $bookmarkButton.hide();
    }
    $bookmarkButton.click(function(){
        me.showEditDialog();
    });

    me.$dialog = $('#openwebrx-dialog-bookmark');
    me.$dialog.find('.openwebrx-button[data-action=cancel]').click(function(){
        me.$dialog.hide();
    });
    me.$dialog.find('.openwebrx-button[data-action=submit]').click(function(){
        me.storeBookmark();
    });
    me.$dialog.find('form').on('submit', function(e){
        e.preventDefault();
        me.storeBookmark();
    });
}

BookmarkBar.prototype.position = function(){
    var range = get_visible_freq_range();
    $('#openwebrx-bookmarks-container').find('.bookmark').each(function(){
        $(this).css('left', scale_px_from_freq($(this).data('frequency'), range));
    });
};

BookmarkBar.prototype.loadLocalBookmarks = function(){
    var bwh = bandwidth / 2;
    var start = center_freq - bwh;
    var end = center_freq + bwh;
    var bookmarks = this.localBookmarks.getBookmarks().filter(function(b){
        return b.frequency >= start && b.frequency <= end;
    });
    this.replace_bookmarks(bookmarks, 'local', true);
};

BookmarkBar.prototype.replace_bookmarks = function(bookmarks, source, editable) {
    editable = !!editable;
    bookmarks = bookmarks.map(function(b){
        b.source = source;
        b.editable = editable;
        return b;
    });
    this.bookmarks[source] = bookmarks;
    this.render();
};

BookmarkBar.prototype.render = function(){
    var bookmarks = Object.values(this.bookmarks).reduce(function(l, v){ return l.concat(v); });
    bookmarks = bookmarks.sort(function(a, b){ return a.frequency - b.frequency; });
    var elements = bookmarks.map(function(b){
        var $bookmark = $(
            '<div class="bookmark" data-source="' + b.source + '"' + (b.editable?' editable="editable"':'') + '>' +
                '<div class="bookmark-actions">' +
                    '<div class="openwebrx-button action" data-action="edit"><svg viewBox="0 0 80 80"><use xlink:href="static/gfx/svg-defs.svg#edit"></use></svg></div>' +
                    '<div class="openwebrx-button action" data-action="delete"><svg viewBox="0 0 80 80"><use xlink:href="static/gfx/svg-defs.svg#trashcan"></use></svg></div>' +
                '</div>' +
                '<div class="bookmark-content">' + b.name + '</div>' +
            '</div>'
        );
        if (b.description) {
            $bookmark.prop('title', b.description);
        }
        $bookmark.data(b);
        return $bookmark;
    });
    this.$container.find('.bookmark').remove();
    this.$container.append(elements);
	this.position();
};

BookmarkBar.prototype.showEditDialog = function(bookmark) {
    if (!bookmark) {
        var freq  = UI.getFrequency();
        var mode1 = UI.getModulation();
        var mode2 = UI.getUnderlying();
        if (!!mode1 && !!mode2) {
            // check for default underlying demod
            var m = Modes.findByModulation(mode1);
            if (m && m.underlying.indexOf(mode2) == 0) mode2 = '';
        }
        bookmark = {
            name        : '',
            frequency   : mode1 === 'cw'? freq + 800 : freq,
            modulation  : mode1,
            underlying  : mode2,
            description : '',
            scannable   : this.modesToScan.indexOf(mode1) >= 0
        }
    }
    this.$dialog.bookmarkDialog().setValues(bookmark);
    this.$dialog.show();
    this.$dialog.find('#name').focus();
};

BookmarkBar.prototype.sanitizeBookmark = function(b) {
    // must have name, frequency, and modulation
    if (!b.name || !b.frequency || !b.modulation)
        return "Must have name, frequency, and modulation.";

    // must have non-empty name
    b.name = b.name.trim();
    if (b.name.length <= 0) return "Must have a non-empty name.";

    // must have positive frequency
    b.frequency = Number(b.frequency);
    if (b.frequency <= 0) return "Frequency must be positive.";

    // must have valid modulation
    var mode = Modes.findByModulation(b.modulation);
    if (!mode) return "Must have valid modulation."

    // check that underlying demodulator is valid
    if (!b.underlying)
        b.underlying = '';
    else if (!mode.underlying)
        return "Must not have underlying modulation.";
    else if (mode.underlying.indexOf(b.underlying) < 0)
        return "Must have valid underlying modulation.";

    return null;
};

BookmarkBar.prototype.storeBookmark = function() {
    var me = this;
    var bookmark = this.$dialog.bookmarkDialog().getValues();
    if (!bookmark) return;

    var error = this.sanitizeBookmark(bookmark);
    if (error) { alert(error); return; }

    var bookmarks = me.localBookmarks.getBookmarks();

    if (!bookmark.id) {
        if (bookmarks.length) {
            bookmark.id = 1 + Math.max.apply(Math, bookmarks.map(function(b){ return b.id || 0; }));
        } else {
            bookmark.id = 1;
        }
    }

    bookmarks = bookmarks.filter(function(b) { return b.id !== bookmark.id; });
    bookmarks.push(bookmark);

    me.localBookmarks.setBookmarks(bookmarks);
    me.loadLocalBookmarks();
    me.$dialog.hide();
};

BookmarkBar.prototype.getAllBookmarks = function() {
    var sb = this.bookmarks['server'];
    var lb = this.bookmarks['local'];
    return !sb.length? (!lb.length? [] : lb) : !lb.length? sb : sb.concat(lb);
};

$.fn.bookmarkDialog = function() {
    var $el = this;
    return {
        setModes: function(modes) {
            $el.find('#modulation').html(modes.map(function(m) {
                return '<option value="' + m.modulation + '">' + m.name + '</option>';
            }).join(''));
            return this;
        },
        setUnderlying: function(modes) {
            $el.find('#underlying').html('<option value="">None</option>' +
            modes.filter(function(m) {
                return !m.underlying && m.type === 'analog';
            }).map(function(m) {
                return '<option value="' + m.modulation + '">' + m.name + '</option>';
            }).join(''));
            return this;
        },
        setValues: function(bookmark) {
            var $form = $el.find('form');
            ['name', 'frequency', 'modulation', 'underlying', 'description', 'scannable'].forEach(function(key) {
                var $input = $form.find('#' + key);
                if ($input.is(':checkbox')) {
                    $input.prop('checked', bookmark[key]);
                } else {
                    $input.val(bookmark[key]);
                }
            });
            $el.data('id', bookmark.id || false);
            return this;
        },
        getValues: function() {
            var bookmark = {};
            var valid = true;
            ['name', 'frequency', 'modulation', 'underlying', 'description', 'scannable'].forEach(function(key) {
                var $input = $el.find('#' + key);
                valid = valid && $input[0].checkValidity();
                bookmark[key] = $input.is(':checkbox')? $input.is(':checked') : $input.val();
            });
            if (!valid) {
                $el.find("form :submit").click();
                return;
            }
            bookmark.id = $el.data('id');
            return bookmark;
        }
    }
};

// this controls if the new AudioWorklet API should be used if available.
// the engine will still fall back to the ScriptProcessorNode if this is set to true but not available in the browser.
var useAudioWorklets = true;

function AudioEngine(maxBufferLength, audioReporter) {
    this.audioReporter = audioReporter;
    this.initStats();
    this.resetStats();

    this.onStartCallbacks = [];

    this.started = false;
    this.audioContext = this.buildAudioContext();
    if (!this.audioContext) {
        return;
    }

    var me = this;
    this.audioContext.onstatechange = function() {
        if (me.audioContext.state !== 'running') return;
        me._start();
    }

    this.audioCodec = new ImaAdpcmCodec();
    this.compression = 'none';

    this.setupResampling();
    this.resampler = new Interpolator(this.resamplingFactor);
    this.hdResampler = new Interpolator(this.hdResamplingFactor);

    this.maxBufferSize = maxBufferLength * this.getSampleRate();

    this.recorder = new AudioRecorder(this.getOutputRate(), 128);
    this.hdRecorder = new AudioRecorder(this.getHdOutputRate(), 128);
    this.recording = false;
    this.lastHd = false;
}

AudioEngine.prototype.buildAudioContext = function() {
    var ctxClass = window.AudioContext || window.webkitAudioContext;
    if (!ctxClass) {
        return;
    }

    // known good sample rates
    var goodRates = [48000, 44100, 96000]

    // let the browser chose the sample rate, if it is good, use it
    var ctx = new ctxClass({latencyHint: 'playback'});
    if (goodRates.indexOf(ctx.sampleRate) >= 0) {
        return ctx;
    }

    // if that didn't work, try if any of the good rates work
    if (goodRates.some(function(sr) {
        try {
            ctx = new ctxClass({sampleRate: sr, latencyHint: 'playback'});
            return true;
        } catch (e) {
            return false;
        }
    }, this)) {
        return ctx;
    }

    // fallback: let the browser decide
    // this may cause playback problems down the line
    return new ctxClass({latencyHint: 'playback'});
}

AudioEngine.prototype.resume = function(){
    this.audioContext.resume();
}

AudioEngine.prototype._start = function() {
    var me = this;

    // if failed to find a valid resampling factor...
    if (me.resamplingFactor === 0) {
         return;
    }

    // been started before?
    if (me.started) {
        return;
    }

    // are we allowed to play audio?
    if (!me.isAllowed()) {
        return;
    }
    me.started = true;

    var runCallbacks = function(workletType) {
        var callbacks = me.onStartCallbacks;
        me.onStartCallbacks = false;
        callbacks.forEach(function(c) { c(workletType); });
    };

    me.gainNode = me.audioContext.createGain();
    me.gainNode.connect(me.audioContext.destination);

    if (useAudioWorklets && me.audioContext.audioWorklet) {
        me.audioContext.audioWorklet.addModule('static/lib/AudioProcessor.js').then(function(){
            me.audioNode = new AudioWorkletNode(me.audioContext, 'openwebrx-audio-processor', {
                numberOfInputs: 0,
                numberOfOutputs: 1,
                outputChannelCount: [1],
                processorOptions: {
                    maxBufferSize: me.maxBufferSize
                }
            });
            me.audioNode.connect(me.gainNode);
            me.audioNode.port.addEventListener('message', function(m){
                var json = JSON.parse(m.data);
                if (typeof(json.buffersize) !== 'undefined') {
                    me.audioReporter({
                        buffersize: json.buffersize
                    });
                }
                if (typeof(json.samplesProcessed) !== 'undefined') {
                    me.audioSamples.add(json.samplesProcessed);
                }
            });
            me.audioNode.port.start();
            runCallbacks('AudioWorklet');
        });
    } else {
        me.audioBuffers = [];

        if (!AudioBuffer.prototype.copyToChannel) { //Chrome 36 does not have it, Firefox does
            AudioBuffer.prototype.copyToChannel = function (input, channel) //input is Float32Array
            {
                var cd = this.getChannelData(channel);
                for (var i = 0; i < input.length; i++) cd[i] = input[i];
            }
        }

        var bufferSize;
        if (me.audioContext.sampleRate < 44100 * 2)
            bufferSize = 4096;
        else if (me.audioContext.sampleRate >= 44100 * 2 && me.audioContext.sampleRate < 44100 * 4)
            bufferSize = 4096 * 2;
        else if (me.audioContext.sampleRate > 44100 * 4)
            bufferSize = 4096 * 4;


        function audio_onprocess(e) {
            var total = 0;
            var out = new Float32Array(bufferSize);
            while (me.audioBuffers.length) {
                var b = me.audioBuffers.shift();
                // not enough space to fit all data, so splice and put back in the queue
                if (total + b.length > bufferSize) {
                    var spaceLeft  = bufferSize - total;
                    var tokeep = b.subarray(0, spaceLeft);
                    out.set(tokeep, total);
                    var tobuffer = b.subarray(spaceLeft, b.length);
                    me.audioBuffers.unshift(tobuffer);
                    total += spaceLeft;
                    break;
                } else {
                    out.set(b, total);
                    total += b.length;
                }
            }

            e.outputBuffer.copyToChannel(out, 0);
            me.audioSamples.add(total);

        }

        //on Chrome v36, createJavaScriptNode has been replaced by createScriptProcessor
        var method = 'createScriptProcessor';
        if (me.audioContext.createJavaScriptNode) {
            method = 'createJavaScriptNode';
        }
        me.audioNode = me.audioContext[method](bufferSize, 0, 1);
        me.audioNode.onaudioprocess = audio_onprocess;
        me.audioNode.connect(me.gainNode);
        runCallbacks('ScriptProcessorNode')
    }

    setInterval(me.reportStats.bind(me), 1000);
};

AudioEngine.prototype.onStart = function(callback) {
    if (this.onStartCallbacks) {
        this.onStartCallbacks.push(callback);
    } else {
        callback();
    }
};

AudioEngine.prototype.isAllowed = function() {
    return this.audioContext.state === 'running';
};

AudioEngine.prototype.isStarted = function() {
    return this.started;
};

AudioEngine.prototype.reportStats = function() {
    if (this.audioNode.port) {
        this.audioNode.port.postMessage(JSON.stringify({cmd:'getStats'}));
    } else {
        this.audioReporter({
            buffersize: this.getBuffersize()
        });
    }
};

AudioEngine.prototype.initStats = function() {
    var me = this;
    var buildReporter = function(key) {
        return function(v){
            var report = {};
            report[key] = v;
            me.audioReporter(report);
        }

    };

    this.audioBytes = new Measurement();
    this.audioBytes.report(10000, 1000, buildReporter('audioByteRate'));

    this.audioSamples = new Measurement();
    this.audioSamples.report(10000, 1000, buildReporter('audioRate'));
};

AudioEngine.prototype.resetStats = function() {
    this.audioBytes.reset();
    this.audioSamples.reset();
};

AudioEngine.prototype.setupResampling = function() { //both at the server and the client
    var targetRate = this.audioContext.sampleRate;
    var audio_params = this.findRate(8000, 12000);
    if (!audio_params) {
        this.resamplingFactor = 0;
        this.outputRate = 0;
        divlog('Your audio card sampling rate (' + targetRate + ') is not supported.<br />Please change your operating system default settings in order to fix this.', 1);
    } else {
        this.resamplingFactor = audio_params.resamplingFactor;
        this.outputRate = audio_params.outputRate;
    }

    var hd_audio_params = this.findRate(36000, 48000);
    if (!hd_audio_params) {
        this.hdResamplingFactor = 0;
        this.hdOutputRate = 0;
        divlog('Your audio card sampling rate (' + targetRate + ') is not supported for HD audio<br />Please change your operating system default settings in order to fix this.', 1);
    } else {
        this.hdResamplingFactor = hd_audio_params.resamplingFactor;
        this.hdOutputRate = hd_audio_params.outputRate;
    }
};

AudioEngine.prototype.findRate = function(low, high) {
    var targetRate = this.audioContext.sampleRate;
    var i = 1;
    while (true) {
        var audio_server_output_rate = Math.floor(targetRate / i);
        if (audio_server_output_rate < low) {
            return;
        } else if (audio_server_output_rate >= low && audio_server_output_rate <= high) {
            return {
                resamplingFactor: i,
                outputRate: audio_server_output_rate
            }
        }
        i++;
    };
}

AudioEngine.prototype.getOutputRate = function() {
    return this.outputRate;
};

AudioEngine.prototype.getHdOutputRate = function() {
    return this.hdOutputRate;
}

AudioEngine.prototype.getSampleRate = function() {
    return this.audioContext.sampleRate;
};

AudioEngine.prototype.processAudio = function(data, resampler, recorder) {
    if (!this.audioNode) return;
    this.audioBytes.add(data.byteLength);
    var buffer;
    if (this.compression === "adpcm") {
        //resampling & ADPCM
        buffer = this.audioCodec.decodeWithSync(new Uint8Array(data));
    } else {
        buffer = new Int16Array(data);
    }
    if(this.recording) {
        recorder.record(buffer);
    }
    buffer = resampler.process(buffer);
    if (this.audioNode.port) {
        // AudioWorklets supported
        this.audioNode.port.postMessage(buffer);
    } else {
        // silently drop excess samples
        if (this.getBuffersize() + buffer.length <= this.maxBufferSize) {
            this.audioBuffers.push(buffer);
        }
    }
}

AudioEngine.prototype.pushAudio = function(data) {
    this.processAudio(data, this.resampler, this.recorder);
    this.lastHd = false;
};

AudioEngine.prototype.pushHdAudio = function(data) {
    this.processAudio(data, this.hdResampler, this.hdRecorder);
    this.lastHd = true;
}

AudioEngine.prototype.setCompression = function(compression) {
    this.compression = compression;
};

AudioEngine.prototype.setVolume = function(volume) {
    this.gainNode.gain.value = volume;
};

AudioEngine.prototype.getBuffersize = function() {
    // only available when using ScriptProcessorNode
    if (!this.audioBuffers) return 0;
    return this.audioBuffers.map(function(b){ return b.length; }).reduce(function(a, b){ return a + b; }, 0);
};

AudioEngine.prototype.startRecording = function() {
    if (!this.recording) {
        var date = new Date(Date.now()).toISOString().slice(2,19)
            .replaceAll('-','').replaceAll(':','').replaceAll('T','-');
        var freq = Math.round(UI.getFrequency() / 1000);
        this.mp3fileName = "REC-" + date + '-' + freq + ".mp3";
        this.recording = true;
    }
};

AudioEngine.prototype.stopRecording = function() {
    if (this.recording) {
        this.recording = false;

        // Save last updated recording
        if (this.lastHd) {
            this.hdRecorder.saveRecording(this.mp3fileName);
        } else {
            this.recorder.saveRecording(this.mp3fileName);
        }

        // Clear and stop all recorders
        this.hdRecorder.stopRecording();
        this.recorder.stopRecording();
    }
};

function AudioRecorder(sampleRate, kbps) {
    // Mono (1 channel), with given sample rate and bitrate
    this.mp3encoder = new lamejs.Mp3Encoder(1, sampleRate, kbps);
    this.blockSize  = 1152; // better be a multiple of 576
    this.mp3Data    = [];
}

AudioRecorder.prototype.record = function(samples) {
    for (var i = 0; i < samples.length; i += this.blockSize) {
        var chunk  = samples.subarray(i, i + this.blockSize);
        var mp3buf = this.mp3encoder.encodeBuffer(chunk);
        if (mp3buf.length > 0) this.mp3Data.push(mp3buf);
    }
};

AudioRecorder.prototype.stopRecording = function() {
    this.mp3encoder.flush();
    this.mp3Data = [];
}

AudioRecorder.prototype.saveRecording = function(name) {
    // finish writing mp3
    var mp3buf = this.mp3encoder.flush();
    if (mp3buf.length>0) this.mp3Data.push(new Int8Array(mp3buf));

    // Do not save unless we have data
    if (this.mp3Data.length==0) return false;

    var blob = new Blob(this.mp3Data, {type: "audio/mp3"});

    var a = document.createElement("a");
    a.href = window.URL.createObjectURL(blob);
    a.style = "display: none";
    a.download = name;
    document.body.appendChild(a);
    a.click();

    setTimeout(function() {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(a.href);
    }, 0);

    // Success
    return true;
};

function ImaAdpcmCodec() {
    this.reset();
}

ImaAdpcmCodec.prototype.reset = function() {
    this.stepIndex = 0;
    this.predictor = 0;
    this.step = 0;
    this.synchronized = 0;
    this.syncWord = "SYNC";
    this.syncCounter = 0;
    this.phase = 0;
    this.syncBuffer = new Uint8Array(4);
    this.syncBufferIndex = 0;
};

ImaAdpcmCodec.imaIndexTable = [ -1, -1, -1, -1, 2, 4, 6, 8, -1, -1, -1, -1, 2, 4, 6, 8 ];

ImaAdpcmCodec.imaStepTable = [
                               7, 8, 9, 10, 11, 12, 13, 14, 16, 17,
                               19, 21, 23, 25, 28, 31, 34, 37, 41, 45,
                               50, 55, 60, 66, 73, 80, 88, 97, 107, 118,
                               130, 143, 157, 173, 190, 209, 230, 253, 279, 307,
                               337, 371, 408, 449, 494, 544, 598, 658, 724, 796,
                               876, 963, 1060, 1166, 1282, 1411, 1552, 1707, 1878, 2066,
                               2272, 2499, 2749, 3024, 3327, 3660, 4026, 4428, 4871, 5358,
                               5894, 6484, 7132, 7845, 8630, 9493, 10442, 11487, 12635, 13899,
                               15289, 16818, 18500, 20350, 22385, 24623, 27086, 29794, 32767
                             ];

ImaAdpcmCodec.prototype.decode = function(data) {
    var output = new Int16Array(data.length * 2);
    for (var i = 0; i < data.length; i++) {
        output[i * 2] = this.decodeNibble(data[i] & 0x0F);
        output[i * 2 + 1] = this.decodeNibble((data[i] >> 4) & 0x0F);
    }
    return output;
};

ImaAdpcmCodec.prototype.decodeWithSync = function(data) {
    var output = new Int16Array(data.length * 2);
    var oi = 0;
    for (var index = 0; index < data.length; index++) {
        switch (this.phase) {
            case 0:
                // search for sync word
                if (data[index] !== this.syncWord.charCodeAt(this.synchronized++)) {
                    // reset if data is unexpected
                    this.synchronized = 0;
                }
                // if sync word has been found pass on to next phase
                if (this.synchronized === 4) {
                    this.syncBufferIndex = 0;
                    this.phase = 1;
                }
                break;
            case 1:
                // read codec runtime data from stream
                this.syncBuffer[this.syncBufferIndex++] = data[index];
                // if data is complete, apply and pass on to next phase
                if (this.syncBufferIndex === 4) {
                    var syncData = new Int16Array(this.syncBuffer.buffer);
                    this.stepIndex = syncData[0];
                    this.predictor = syncData[1];
                    this.syncCounter = 1000;
                    this.phase = 2;
                }
                break;
            case 2:
                // decode actual audio data
                output[oi++] = this.decodeNibble(data[index] & 0x0F);
                output[oi++] = this.decodeNibble(data[index] >> 4);
                // if the next sync keyword is due, reset and return to phase 0
                if (this.syncCounter-- === 0) {
                    this.synchronized = 0;
                    this.phase = 0;
                }
                break;
        }
    }
    return output.slice(0, oi);
};

ImaAdpcmCodec.prototype.decodeNibble = function(nibble) {
    this.stepIndex += ImaAdpcmCodec.imaIndexTable[nibble];
    this.stepIndex = Math.min(Math.max(this.stepIndex, 0), 88);

    var diff = this.step >> 3;
    if (nibble & 1) diff += this.step >> 2;
    if (nibble & 2) diff += this.step >> 1;
    if (nibble & 4) diff += this.step;
    if (nibble & 8) diff = -diff;

    this.predictor += diff;
    this.predictor = Math.min(Math.max(this.predictor, -32768), 32767);

    this.step = ImaAdpcmCodec.imaStepTable[this.stepIndex];

    return this.predictor;
};

function Interpolator(factor) {
    this.factor = factor;
    this.lowpass = new Lowpass(factor)
}

Interpolator.prototype.process = function(data) {
    var output = new Float32Array(data.length * this.factor);
    for (var i = 0; i < data.length; i++) {
        output[i * this.factor] = (data[i] + 0.5) / 32768;
    }
    return this.lowpass.process(output);
};

function Lowpass(interpolation) {
    this.interpolation = interpolation;
    var transitionBandwidth = 0.05;
    this.numtaps = Math.round(4 / transitionBandwidth);
    if (this.numtaps % 2 == 0) this.numtaps += 1;

    var cutoff = 1 / interpolation;
    this.coefficients = this.getCoefficients(cutoff / 2);

    this.delay = new Float32Array(this.numtaps);
    for (var i = 0; i < this.numtaps; i++){
        this.delay[i] = 0;
    }
    this.delayIndex = 0;
}

Lowpass.prototype.getCoefficients = function(cutoffRate) {
    var middle = Math.floor(this.numtaps / 2);
    // hamming window
    var window_function = function(r){
        var rate = 0.5 + r / 2;
        return 0.54 - 0.46 * Math.cos(2 * Math.PI * rate);
    }
    var output = [];
    output[middle] = 2 * Math.PI * cutoffRate * window_function(0);
    for (var i = 1; i <= middle; i++) {
        output[middle - i] = output[middle + i] = (Math.sin(2 * Math.PI * cutoffRate * i) / i) * window_function(i / middle);
    }
    return this.normalizeCoefficients(output);
};

Lowpass.prototype.normalizeCoefficients = function(input) {
    var sum = 0;
    var output = [];
    for (var i = 0; i < input.length; i++) {
        sum += input[i];
    }
    for (var i = 0; i < input.length; i++) {
        output[i] = input[i] / sum;
    }
    return output;
};

Lowpass.prototype.process = function(input) {
    output = new Float32Array(input.length);
    for (var oi = 0; oi < input.length; oi++) {
        this.delay[this.delayIndex] = input[oi];
        this.delayIndex = (this.delayIndex + 1) % this.numtaps;

        var acc = 0;
        var index = this.delayIndex;
        for (var i = 0; i < this.numtaps; ++i) {
            var index = index != 0 ? index - 1 : this.numtaps - 1;
            acc += this.delay[index] * this.coefficients[i];
            if (isNaN(acc)) debugger;
        }
        // gain by interpolation
        output[oi] = this.interpolation * acc;
    }
    return output;
};

ProgressBar = function(el) {
    this.$el = $(el);
    this.$innerText = $('<span class="openwebrx-progressbar-text">' + this.getDefaultText() + '</span>');
    this.$innerBar = $('<div class="openwebrx-progressbar-bar"></div>');
    this.$el.empty().append(this.$innerText, this.$innerBar);
};

ProgressBar.prototype.getDefaultText = function() {
    return '';
}

ProgressBar.prototype.set = function(val, text, over) {
    this.setValue(val);
    this.setText(text);
    this.setOver(over);
};

ProgressBar.prototype.setValue = function(val) {
    if (val < 0) val = 0;
    if (val > 1) val = 1;
    this.$innerBar.css({transform: 'translate(' + ((val - 1) * 100) + '%) translateZ(0)'});
};

ProgressBar.prototype.setText = function(text) {
    this.$innerText.html(text);
};

ProgressBar.prototype.setOver = function(over) {
    this.$el[over ? 'addClass' : 'removeClass']('openwebrx-progressbar--over');
};

AudioBufferProgressBar = function(el) {
    ProgressBar.call(this, el);
};

AudioBufferProgressBar.prototype = new ProgressBar();

AudioBufferProgressBar.prototype.getDefaultText = function() {
    return 'Audio buffer [0 ms]';
};

AudioBufferProgressBar.prototype.setSampleRate = function(sampleRate) {
    this.sampleRate = sampleRate;
};

AudioBufferProgressBar.prototype.setBuffersize = function(buffersize) {
    var audio_buffer_value = buffersize / this.sampleRate;
    var overrun = audio_buffer_value > audio_buffer_maximal_length_sec;
    var underrun = audio_buffer_value === 0;
    var text = "buffer";
    if (overrun) {
        text = "overrun";
    }
    if (underrun) {
        text = "underrun";
    }
    this.set(audio_buffer_value, "Audio " + text + " [" + (audio_buffer_value).toFixed(1) + " s]", overrun || underrun);
};


NetworkSpeedProgressBar = function(el) {
    ProgressBar.call(this, el);
};

NetworkSpeedProgressBar.prototype = new ProgressBar();

NetworkSpeedProgressBar.prototype.getDefaultText = function() {
    return 'Network usage [0 kbps]';
};

NetworkSpeedProgressBar.prototype.setSpeed = function(speed) {
    var speedInKilobits = speed * 8 / 1000;
    this.set(speedInKilobits / 2000, "Network usage [" + speedInKilobits.toFixed(1) + " kbps]", false);
};

AudioSpeedProgressBar = function(el) {
    ProgressBar.call(this, el);
};

AudioSpeedProgressBar.prototype = new ProgressBar();

AudioSpeedProgressBar.prototype.getDefaultText = function() {
    return 'Audio stream [0 kbps]';
};

AudioSpeedProgressBar.prototype.setSpeed = function(speed) {
    this.set(speed / 1000000, "Audio stream [" + (speed / 1000).toFixed(0) + " kbps]", false);
};

AudioOutputProgressBar = function(el, sampleRate) {
    ProgressBar.call(this, el);
};

AudioOutputProgressBar.prototype = new ProgressBar();

AudioOutputProgressBar.prototype.getDefaultText = function() {
    return 'Audio output [0 sps]';
};

AudioOutputProgressBar.prototype.setSampleRate = function(sampleRate) {
    this.maxRate = sampleRate * 1.25;
    this.minRate = sampleRate * .25;
};

AudioOutputProgressBar.prototype.setAudioRate = function(audioRate) {
    this.set(audioRate / this.maxRate, "Audio output [" + (audioRate / 1000).toFixed(1) + " ksps]", audioRate > this.maxRate || audioRate < this.minRate);
};

ClientsProgressBar = function(el) {
    ProgressBar.call(this, el);
    this.clients = 0;
    this.maxClients = 0;
};

ClientsProgressBar.prototype = new ProgressBar();

ClientsProgressBar.prototype.getDefaultText = function() {
    return 'Clients [1]';
};

ClientsProgressBar.prototype.setClients = function(clients) {
    this.clients = clients;
    this.render();
};

ClientsProgressBar.prototype.setMaxClients = function(maxClients) {
    this.maxClients = maxClients;
    this.render();
};

ClientsProgressBar.prototype.render = function() {
    this.set(this.clients / this.maxClients, "Clients [" + this.clients + "]", this.clients > this.maxClients * 0.85);
};

CpuProgressBar = function(el) {
    ProgressBar.call(this, el);
};

CpuProgressBar.prototype = new ProgressBar();

CpuProgressBar.prototype.getDefaultText = function() {
    return 'Server CPU [0%]';
};

CpuProgressBar.prototype.setUsage = function(usage) {
    const temp = this.temp? "/" + this.temp + "&deg;C" : "";
    this.set(usage, "Server CPU [" + Math.round(usage * 100) + "%" + temp + "]", usage > .85);
};

CpuProgressBar.prototype.setTemp = function(temp) {
    this.temp = temp;
};

ProgressBar.types = {
    cpu: CpuProgressBar,
    audiobuffer: AudioBufferProgressBar,
    audiospeed: AudioSpeedProgressBar,
    audiooutput: AudioOutputProgressBar,
    clients: ClientsProgressBar,
    networkspeed: NetworkSpeedProgressBar
}

$.fn.progressbar = function() {
    if (!this.data('progressbar')) {
        var constructor = ProgressBar.types[this.data('type')] || ProgressBar;
        this.data('progressbar', new constructor(this));
    }
    return this.data('progressbar');
};

function Measurement() {
    this.reporters = [];
    this.reset();
}

Measurement.prototype.add = function(v) {
    this.value += v;
};

Measurement.prototype.getValue = function() {
    return this.value;
};

Measurement.prototype.getElapsed = function() {
    return new Date() - this.start;
};

Measurement.prototype.getRate = function() {
    return this.getValue() / this.getElapsed();
};

Measurement.prototype.reset = function() {
    this.value = 0;
    this.start = new Date();
    this.reporters.forEach(function(r){ r.reset(); });
};

Measurement.prototype.report = function(range, interval, callback) {
    var reporter = new Reporter(this, range, interval, callback);
    this.reporters.push(reporter);
    return reporter;
};

function Reporter(measurement, range, interval, callback) {
    this.measurement = measurement;
    this.range = range;
    this.samples = [];
    this.callback = callback;
    this.interval = setInterval(this.report.bind(this), interval);
}

Reporter.prototype.sample = function(){
    this.samples.push({
        timestamp: new Date(),
        value: this.measurement.getValue()
    });
};

Reporter.prototype.report = function(){
    this.sample();
    var now = new Date();
    var minDate = now.getTime() - this.range;
    this.samples = this.samples.filter(function(s) {
        return s.timestamp.getTime() > minDate;
    });
    this.samples.sort(function(a, b) {
        return a.timestamp - b.timestamp;
    });
    var oldest = this.samples[0];
    var newest = this.samples[this.samples.length -1];
    var elapsed = newest.timestamp - oldest.timestamp;
    if (elapsed <= 0) return;
    var accumulated = newest.value - oldest.value;
    // we want rate per second, but our time is in milliseconds... compensate by 1000
    this.callback(accumulated * 1000 / elapsed);
};

Reporter.prototype.reset = function(){
    this.samples = [];
};
function FrequencyDisplay(element) {
    this.suffixes = {
        '': 0,
        'k': 3,
        'M': 6,
        'G': 9,
        'T': 12
    };
    this.element = $(element);
    this.digits = [];
    this.precision = 2;
    this.setupElements();
    this.setFrequency(0);
}

FrequencyDisplay.prototype.setupElements = function() {
    this.displayContainer = $('<div>');
    this.digitContainer = $('<span>');
    this.unitContainer = $('<span> Hz</span>');
    this.displayContainer.html([this.digitContainer, this.unitContainer]);
    this.element.html(this.displayContainer);
};

FrequencyDisplay.prototype.getSuffix = function() {
    var me = this;
    return Object.keys(me.suffixes).filter(function(key){
        return me.suffixes[key] == me.exponent;
    })[0] || "";
};

FrequencyDisplay.prototype.setFrequency = function(freq) {
    this.frequency = freq;
    if (this.frequency === 0 || Number.isNaN(this.frequency)) {
        this.exponent = 0
    } else {
        this.exponent = Math.floor(Math.log10(this.frequency) / 3) * 3;
    }

    var digits = Math.max(0, this.exponent - this.precision);
    var formatted = (freq / 10 ** this.exponent).toLocaleString(
        undefined,
        {maximumFractionDigits: digits, minimumFractionDigits: digits}
    );
    var children = this.digitContainer.children();
    for (var i = 0; i < formatted.length; i++) {
        if (!this.digits[i]) {
            this.digits[i] = $('<span>');
            var before = children[i];
            if (before) {
                $(before).after(this.digits[i]);
            } else {
                this.digitContainer.append(this.digits[i]);
            }
        }
        this.digits[i][(isNaN(formatted[i]) ? 'remove' : 'add') + 'Class']('digit');
        this.digits[i].html(formatted[i]);
    }
    while (this.digits.length > formatted.length) {
        this.digits.pop().remove();
    }
    this.unitContainer.text(' ' + this.getSuffix() + 'Hz');
};

FrequencyDisplay.prototype.setTuningPrecision = function(precision) {
    if (typeof(precision) == 'undefined') return;
    this.precision = precision;
    this.setFrequency(this.frequency);
};

function TuneableFrequencyDisplay(element) {
    FrequencyDisplay.call(this, element);
    this.setupEvents();
}

TuneableFrequencyDisplay.prototype = new FrequencyDisplay();

TuneableFrequencyDisplay.prototype.setupElements = function() {
    FrequencyDisplay.prototype.setupElements.call(this);
    this.input = $('<input type="number" step="any">');
    this.suffixInput = $('<select tabindex="-1">');
    this.suffixInput.append($.map(this.suffixes, function(e, p) {
        return $('<option value="' + e + '">' + p + 'Hz</option>');
    }));
    this.inputGroup = $('<div class="input-group">');
    this.inputGroup.append([this.input, this.suffixInput]);
    this.inputGroup.hide();
    this.element.append(this.inputGroup);
};

TuneableFrequencyDisplay.prototype.setupEvents = function() {
    var me = this;

    me.displayContainer.on('wheel', function(e){
        e.preventDefault();
        e.stopPropagation();

        var index = me.digitContainer.find('.digit').index(e.target);
        if (index < 0) return;

        var delta = 10 ** (Math.floor(Math.max(me.exponent, Math.log10(me.frequency))) - index);
        if (e.originalEvent.deltaY > 0) delta *= -1;
        var newFrequency = me.frequency + delta;

        me.element.trigger('frequencychange', newFrequency);
    });

    var submit = function(){
        var exponent = parseInt(me.suffixInput.val());
        var freq = parseFloat(me.input.val()) * 10 ** exponent;
        if (!isNaN(freq)) {
            me.element.trigger('frequencychange', freq);
        }
        me.inputGroup.hide();
        me.displayContainer.show();
    };
    $inputs = $.merge($(), me.input);
    $inputs = $.merge($inputs, me.suffixInput);
    $('body').on('click', function(e) {
        if (!me.input.is(':visible')) return;
        if ($.contains(me.element[0], e.target)) return;
        submit();
    });
    $inputs.on('blur', function(e){
        if (!me.input.is(':visible')) return;
        if ($inputs.toArray().indexOf(e.relatedTarget) >= 0) {
            return;
        }
        submit();
    });
    me.input.on('keydown', function(e){
        if (e.keyCode == 13) return submit();
        if (e.keyCode == 27) {
            me.inputGroup.hide();
            me.displayContainer.show();
            return;
        }
        var c = String.fromCharCode(e.which);
        Object.entries(me.suffixes).forEach(function(e) {
            if (e[0].toUpperCase() == c) {
                me.suffixInput.val(e[1]);
                return submit();
            }
        })
    });
    var currentExponent;
    me.suffixInput.on('change', function() {
        var newExponent = me.suffixInput.val();
        delta = currentExponent - newExponent;
        if (delta >= 0) {
            me.input.val(parseFloat(me.input.val()) * 10 ** delta);
        } else {
            // should not be necessary to handle this separately, but floating point precision in javascript
            // does not handle this well otherwise
            me.input.val(parseFloat(me.input.val()) / 10 ** -delta);
        }
        currentExponent = newExponent;
        me.input.focus();
    });
    $inputs.on('click', function(e){
        e.stopPropagation();
    });
    me.element.on('click', function(){
        currentExponent = me.exponent;
        me.input.val(me.frequency / 10 ** me.exponent);
        me.suffixInput.val(me.exponent);
        me.inputGroup.show();
        me.displayContainer.hide();
        me.input.focus();
    });
};

$.fn.frequencyDisplay = function() {
    if (!this.data('frequencyDisplay')) {
        this.data('frequencyDisplay', new FrequencyDisplay(this));
    }
    return this.data('frequencyDisplay');
}

$.fn.tuneableFrequencyDisplay = function() {
    if (!this.data('frequencyDisplay')) {
        this.data('frequencyDisplay', new TuneableFrequencyDisplay(this));
    }
    return this.data('frequencyDisplay');
}

function MessagePanel(el) {
    this.el = el;
    this.render();
    this.initClearButton();
}

MessagePanel.prototype.supportsMessage = function(message) {
    return false;
};

MessagePanel.prototype.render = function() {
};

MessagePanel.prototype.pushMessage = function(message) {
};

// Automatic clearing is not enabled by default.
// Call this method from the constructor to enable.
MessagePanel.prototype.initClearTimer = function() {
    var me = this;
    if (me.removalInterval) clearInterval(me.removalInterval);
    me.removalInterval = setInterval(function () {
        me.clearMessages(250);
    }, 15000);
};

// Clear all currently shown messages.
MessagePanel.prototype.clearMessages = function(toRemain) {
    var $elements = $(this.el).find('tbody tr');
    // limit to 1000 entries in the list since browsers get laggy at some point
    var toRemove = $elements.length - toRemain;
    if (toRemove <= 0) return;
    $elements.slice(0, toRemove).remove();
};

// Add CLEAR button to the message list.
MessagePanel.prototype.initClearButton = function() {
    var me = this;
    me.clearButton = $(
        '<div class="openwebrx-button">Clear</div>'
    );
    me.clearButton.css({
        position: 'absolute',
        top: '10px',
        right: '10px'
    });
    me.clearButton.on('click', function() {
        me.clearMessages(0);
    });
    $(me.el).append(me.clearButton);
};

// Scroll to the bottom of the message list.
MessagePanel.prototype.scrollToBottom = function() {
    var $t = $(this.el).find('tbody');
    $t.scrollTop($t[0].scrollHeight);
};

function WsjtMessagePanel(el) {
    MessagePanel.call(this, el);
    this.initClearTimer();
    this.qsoModes = ['FT8', 'JT65', 'JT9', 'FT4', 'FST4', 'Q65', 'MSK144'];
    this.beaconModes = ['WSPR', 'FST4W'];
    this.modes = [].concat(this.qsoModes, this.beaconModes);
}

WsjtMessagePanel.prototype = Object.create(MessagePanel.prototype);

WsjtMessagePanel.prototype.supportsMessage = function(message) {
    return this.modes.indexOf(message['mode']) >= 0;
};

WsjtMessagePanel.prototype.render = function() {
    $(this.el).append($(
        '<table>' +
            '<thead><tr>' +
                '<th class="time">UTC</th>' +
                '<th class="decimal">dB</th>' +
                '<th class="decimal">DT</th>' +
                '<th class="decimal freq">Freq</th>' +
                '<th class="message">Message</th>' +
            '</tr></thead>' +
            '<tbody></tbody>' +
        '</table>'
    ));
};

WsjtMessagePanel.prototype.pushMessage = function(msg) {
    var $b = $(this.el).find('tbody');
    var linkedmsg = msg['msg'];
    var matches;

    if (this.qsoModes.indexOf(msg['mode']) >= 0) {
        matches = linkedmsg.match(/^(.*?)([A-Z0-9\/]+)\s([A-Z0-9\/]+)\s(([A-R]{2}[0-9]{2})|(R?[+\-]?[0-9]{2})|(RRR))$/);
        if (matches) {
            var destination = matches[2]!=='CQ' && matches[2]!=='DX' && matches[2]!=='TEST'?
                Utils.linkifyCallsign(matches[2]) : matches[2];
            var locator = matches[5] && matches[5]!=='RR73'?
                Utils.linkifyLocator(matches[5]) : matches[4];
            linkedmsg = Utils.htmlEscape(matches[1]) + destination
                + ' ' + Utils.linkifyCallsign(matches[3])
                + ' ' + locator;
        } else {
            linkedmsg = Utils.htmlEscape(linkedmsg);
        }
    } else if (this.beaconModes.indexOf(msg['mode']) >= 0) {
        matches = linkedmsg.match(/([A-Z0-9]+)\s([A-R]{2}[0-9]{2})\s([0-9]+)/);
        if (matches) {
            linkedmsg = Utils.linkifyCallsign(matches[1])
                + ' ' + Utils.linkifyLocator(matches[2])
                + ' ' + Utils.htmlEscape(matches[3]);
        } else {
            linkedmsg = Utils.htmlEscape(linkedmsg);
        }
    }
    $b.append($(
        '<tr data-timestamp="' + msg['timestamp'] + '">' +
        '<td class="time">' + Utils.HHMMSS(msg['timestamp']) + '</td>' +
        '<td class="decimal">' + msg['db'] + '</td>' +
        '<td class="decimal">' + msg['dt'] + '</td>' +
        '<td class="decimal freq">' + msg['freq'] + '</td>' +
        '<td class="message" style="font-family:monospace;">' + linkedmsg + '</td>' +
        '</tr>'
    ));
    this.scrollToBottom();
}

$.fn.wsjtMessagePanel = function(){
    if (!this.data('panel')) {
        this.data('panel', new WsjtMessagePanel(this));
    }
    return this.data('panel');
};

function PacketMessagePanel(el) {
    MessagePanel.call(this, el);
    this.initClearTimer();
}

PacketMessagePanel.prototype = Object.create(MessagePanel.prototype);

PacketMessagePanel.prototype.supportsMessage = function(message) {
    return (message['mode'] === 'APRS') || (message['mode'] === 'AIS');
};

PacketMessagePanel.prototype.render = function() {
    $(this.el).append($(
        '<table>' +
            '<thead><tr>' +
                '<th class="time">UTC</th>' +
                '<th class="callsign">Callsign</th>' +
                '<th class="coord">Coord</th>' +
                '<th class="message">Comment</th>' +
            '</tr></thead>' +
            '<tbody></tbody>' +
        '</table>'
    ));
};

PacketMessagePanel.prototype.pushMessage = function(msg) {
    var $b = $(this.el).find('tbody');

    if (msg.type && msg.type === 'thirdparty' && msg.data) {
        msg = msg.data;
    }

    var source = msg.source;
    if (msg.type) {
        if (msg.type === 'nmea') {
            // Do not show AIS-specific stuff for now
            return;
        }
        if (msg.type === 'item') {
            source = msg.item;
        }
        if (msg.type === 'object') {
            source = msg.object;
        }
    }

    var timestamp = msg.timestamp? Utils.HHMMSS(msg.timestamp) : '';

    var link = '';
    var classes = [];
    var styles = {};
    var overlay = '';
    var stylesToString = function (s) {
        return $.map(s, function (value, key) {
            return key + ':' + value + ';'
        }).join('')
    };
    if (msg.symbol) {
        classes.push('aprs-symbol');
        classes.push('aprs-symboltable-' + (msg.symbol.table === '/' ? 'normal' : 'alternate'));
        styles['background-position-x'] = -(msg.symbol.index % 16) * 15 + 'px';
        styles['background-position-y'] = -Math.floor(msg.symbol.index / 16) * 15 + 'px';
        if (msg.symbol.table !== '/' && msg.symbol.table !== '\\') {
            var s = {};
            s['background-position-x'] = -(msg.symbol.tableindex % 16) * 15 + 'px';
            s['background-position-y'] = -Math.floor(msg.symbol.tableindex / 16) * 15 + 'px';
            overlay = '<div class="aprs-symbol aprs-symboltable-overlay" style="' + stylesToString(s) + '"></div>';
        }
    } else if (msg.lat && msg.lon) {
        classes.push('openwebrx-maps-pin');
        overlay = '<svg viewBox="0 0 20 35"><use xlink:href="static/gfx/svg-defs.svg#maps-pin"></use></svg>';
    }
    var attrs = [
        'class="' + classes.join(' ') + '"',
        'style="' + stylesToString(styles) + '"'
    ].join(' ');
    if (msg.lat && msg.lon) {
        link = Utils.linkToMap(source, overlay, attrs);
    } else {
        link = '<div ' + attrs + '>' + overlay + '</div>'
    }

    // Compose comment
    var comment = msg.comment || msg.message || '';
    if (comment !== '') {
        // Escape all special characters
        comment = Utils.htmlEscape(comment);
    } else if (msg.country) {
        // Add country flag and name in lieu of comment
        comment = Lookup.cdata2country([msg.ccode, msg.country]);
    } else if (msg.mode === 'AIS') {
        // Get country flag and name from the MMSI
        comment = Lookup.mmsi2country(source);
    }

    // Linkify source based on what it is (vessel or HAM callsign)
    source = msg.mode === 'AIS'?
        Utils.linkifyVessel(source) : Utils.linkifyCallsign(source);

    $b.append($(
        '<tr>' +
        '<td class="time">' + timestamp + '</td>' +
        '<td class="callsign">' + source + '</td>' +
        '<td class="coord">' + link + '</td>' +
        '<td class="message">' + comment + '</td>' +
        '</tr>'
    ));
    this.scrollToBottom();
};

$.fn.packetMessagePanel = function() {
    if (!this.data('panel')) {
        this.data('panel', new PacketMessagePanel(this));
    }
    return this.data('panel');
};

PocsagMessagePanel = function(el) {
    MessagePanel.call(this, el);
    this.initClearTimer();
}

PocsagMessagePanel.prototype = Object.create(MessagePanel.prototype);

PocsagMessagePanel.prototype.supportsMessage = function(message) {
    return message['mode'] === 'Pocsag';
};

PocsagMessagePanel.prototype.render = function() {
    $(this.el).append($(
        '<table>' +
            '<thead><tr>' +
                '<th class="address">Address</th>' +
                '<th class="message">Message</th>' +
            '</tr></thead>' +
            '<tbody></tbody>' +
        '</table>'
    ));
};

PocsagMessagePanel.prototype.pushMessage = function(msg) {
    var $b = $(this.el).find('tbody');
    $b.append($(
        '<tr>' +
            '<td class="address">' + msg.address + '</td>' +
            '<td class="message">' + Utils.htmlEscape(msg.message) + '</td>' +
        '</tr>'
    ));
    this.scrollToBottom();
};

$.fn.pocsagMessagePanel = function() {
    if (!this.data('panel')) {
        this.data('panel', new PocsagMessagePanel(this));
    }
    return this.data('panel');
};

PageMessagePanel = function(el) {
    MessagePanel.call(this, el);
    this.initClearTimer();
}

PageMessagePanel.prototype = Object.create(MessagePanel.prototype);

PageMessagePanel.prototype.supportsMessage = function(message) {
    return (message['mode'] === 'FLEX') || (message['mode'] === 'POCSAG');
};

PageMessagePanel.prototype.render = function() {
    $(this.el).append($(
        '<table>' +
            '<thead><tr>' +
                '<th class="address">CapCode</th>' +
                '<th class="mode">Mode</th>' +
                '<th class="timestamp">Time</th>' +
            '</tr></thead>' +
            '<tbody></tbody>' +
        '</table>'
    ));
};

PageMessagePanel.prototype.pushMessage = function(msg) {
    // Get color from the message, default to white
    var color = msg.hasOwnProperty('color')? msg.color : '#FFF';

    // Get channel from the message (FLEX only)
    var channel = msg.hasOwnProperty('channel')? '/' + msg.channel : '';


    // Append message header (address, time, etc)
    var $b = $(this.el).find('tbody');
    $b.append($(
        '<tr>' +
            '<td class="address">' + msg.address + '</td>' +
            '<td class="mode">' + msg.mode + msg.baud + channel + '</td>' +
            '<td class="timestamp" style="text-align:right;">' + Utils.HHMMSS(msg.timestamp) + '</td>' +
        '</tr>'
    ).css('background-color', color).css('color', '#000'));

    // Append message body (text)
    if (msg.hasOwnProperty('message')) {
        $b.append($(
            '<tr><td class="message" colspan="3">' +
            Utils.htmlEscape(msg.message) +
            '</td></tr>'
        ));
    }

    // Jump list to the last received message
    this.scrollToBottom();
};

$.fn.pageMessagePanel = function() {
    if (!this.data('panel')) {
        this.data('panel', new PageMessagePanel(this));
    }
    return this.data('panel');
};

HfdlMessagePanel = function(el) {
    MessagePanel.call(this, el);
    this.initClearTimer();
    this.modes = ['HFDL', 'VDL2', 'ADSB', 'ACARS'];
}

HfdlMessagePanel.prototype = Object.create(MessagePanel.prototype);

HfdlMessagePanel.prototype.supportsMessage = function(message) {
    return this.modes.indexOf(message['mode']) >= 0;
};

HfdlMessagePanel.prototype.render = function() {
    $(this.el).append($(
        '<table>' +
            '<thead><tr>' +
                '<th class="timestamp">Time</th>' +
                '<th class="flight">Flight</th>' +
                '<th class="aircraft">Aircraft</th>' +
                '<th class="data">Data</th>' +
            '</tr></thead>' +
            '<tbody></tbody>' +
        '</table>'
    ));
};

HfdlMessagePanel.prototype.pushMessage = function(msg) {
    var bcolor = msg.color?  msg.color : '#000';
    var fcolor = msg.color?  '#000' : '#FFF';
    var data   = msg.type?   msg.type : '';

    // Only linkify ICAO-compliant flight IDs
    var flight =
      !msg.flight? ''
    : !msg.flight.match(/^[A-Z]{3}[0-9]+[A-Z]*$/)? msg.flight
    : Utils.linkifyFlight(msg.flight);

    var aircraft =
      msg.aircraft? Utils.linkifyFlight(msg.aircraft)
    : msg.icao?     Utils.linkifyIcao(msg.icao)
    : '';

    var tstamp =
      msg.msgtime?   '<b>' + msg.msgtime + '</b>'
    : msg.timestamp? Utils.HHMMSS(msg.timestamp)
    : '';

    // Add location, altitude, speed, etc
    var data = '';
    if (msg.lat && msg.lon) {
        data += '@' + msg.lat.toFixed(4) + ',' + msg.lon.toFixed(4);
    }
    if (msg.altitude)    data += ' &UpArrowBar;' + msg.altitude + 'ft';
    if (msg.vspeed>0)    data += ' &UpperRightArrow;' + msg.vspeed + 'ft/m';
    if (msg.vspeed<0)    data += ' &LowerRightArrow;' + (-msg.vspeed) + 'ft/m';
    if (msg.speed)       data += ' &rightarrow;' + msg.speed + 'kt';
    if (msg.origin)      data += ' &lsh;' + msg.origin;
    if (msg.destination) data += ' &rdsh;' + msg.destination;

    // If no location data in the message, use message type as data
    if (!data.length && msg.type) data = msg.type;

    // Make data point to the map
    if (data.length && msg.mapid) data = Utils.linkToMap(msg.mapid, data);

    // Append report
    var $b = $(this.el).find('tbody');
    $b.append($(
        '<tr>' +
            '<td class="timestamp">' + tstamp + '</td>' +
            '<td class="flight">' + flight + '</td>' +
            '<td class="aircraft">' + aircraft + '</td>' +
            '<td class="data" style="text-align:left;">' + data + '</td>' +
        '</tr>'
    ).css('background-color', bcolor).css('color', fcolor));

    // Append messsage if present
    if (msg.message) {
        $b.append($(
            '<tr><td class="message" colspan="4">' + Utils.htmlEscape(msg.message) + '</td></tr>'
        ));
    }

    // Jump list to the last received message
    this.scrollToBottom();
};

$.fn.hfdlMessagePanel = function() {
    if (!this.data('panel')) {
        this.data('panel', new HfdlMessagePanel(this));
    }
    return this.data('panel');
};

AdsbMessagePanel = function(el) {
    MessagePanel.call(this, el);
    this.clearButton.css('display', 'none');
}

AdsbMessagePanel.prototype = Object.create(MessagePanel.prototype);

AdsbMessagePanel.prototype.supportsMessage = function(message) {
    return message['mode'] === 'ADSB-LIST';
};

AdsbMessagePanel.prototype.render = function() {
    $(this.el).append($(
        '<table>' +
            '<thead><tr>' +
                '<th class="flight">Flight</th>' +
                '<th class="aircraft">Aircraft</th>' +
                '<th class="squawk">Squawk</th>' +
                '<th class="distance">Dist</th>' +
                '<th class="altitude">Alt&nbsp;(ft)</th>' +
                '<th class="speed">Speed&nbsp;(kt)</th>' +
                '<th class="rssi">Signal</th>' +
            '</tr></thead>' +
            '<tbody></tbody>' +
        '</table>'
    ));
};

AdsbMessagePanel.prototype.pushMessage = function(msg) {
    // Must have list of aircraft
    if (!msg.aircraft) return;

    // Create new table body
    var body = '';
    var odd = false;
    msg.aircraft.forEach(entry => {
        // Signal strength
        var rssi = entry.rssi? entry.rssi + '&nbsp;dB' : '';

        // Flight identificators
        var flight =
          entry.flight? Utils.linkifyFlight(entry.flight)
        : '';
        var aircraft =
          entry.aircraft? Utils.linkifyFlight(entry.aircraft)
        : entry.icao?     Utils.linkifyIcao(entry.icao)
        : '';

        // Altitude and climb / descent
        var alt  = entry.altitude? '' + entry.altitude : '';
        if (entry.vspeed) {
            var vspeed = entry.vspeed;
            vspeed = vspeed>0? vspeed + '&uarr;' : (-vspeed) + '&darr;';
            alt    = vspeed + '&nbsp'.repeat(6 - alt.length) + alt;
        }

        // Speed and direction
        var speed = entry.speed? '' + entry.speed : '';
        if (entry.course) {
            var dir = Utils.degToCompass(entry.course);
            speed = dir + '&nbsp'.repeat(5 - speed.length) + speed;
        }

        // Replace squawk with emergency status, if present
        var squawk = entry.squawk? entry.squawk : '';
        if (entry.emergency && (entry.emergency!=='NONE')) {
            squawk = '<div style="color:white;background-color:red;"><b>&nbsp;'
                + entry.emergency + '&nbsp;</b></div>';
        }

        // Compute distance to the receiver
        var distance = '';
        var receiver_pos = Utils.getReceiverPos();
        if (receiver_pos && entry.lat && entry.lon) {
            var id = entry.icao?     entry.icao
                   : entry.aircraft? entry.aircraft
                   : entry.flight?   entry.flight
                   : null;

            distance = Utils.distanceKm(entry, receiver_pos) + '&nbsp;km';
            if (id) distance = Utils.linkToMap(id, distance);
        }

        body += '<tr style="background-color:' + (odd? '#E0FFE0':'#FFFFFF') + ';">'
            + '<td class="flight">'   + flight   + '</td>'
            + '<td class="aircraft">' + aircraft + '</td>'
            + '<td class="squawk">'   + squawk   + '</td>'
            + '<td class="distance">' + distance + '</td>'
            + '<td class="altitude">' + alt      + '</td>'
            + '<td class="speed">'    + speed    + '</td>'
            + '<td class="rssi">'     + rssi     + '</td>'
            + '</tr>\n';
        odd = !odd;
    });

    // Assign new table body
    $(this.el).find('tbody').html(body);
};

$.fn.adsbMessagePanel = function() {
    if (!this.data('panel')) {
        this.data('panel', new AdsbMessagePanel(this));
    }
    return this.data('panel');
};

DscMessagePanel = function(el) {
    MessagePanel.call(this, el);
    this.initClearTimer();
}

DscMessagePanel.prototype = Object.create(MessagePanel.prototype);

DscMessagePanel.prototype.supportsMessage = function(message) {
    return message['mode'] === 'DSC';
};

DscMessagePanel.prototype.render = function() {
    $(this.el).append($(
        '<table>' +
            '<thead><tr>' +
                '<th class="timestamp">UTC</th>' +
                '<th class="src">From</th>' +
                '<th class="dst">To</th>' +
                '<th class="data">Data</th>' +
            '</tr></thead>' +
            '<tbody></tbody>' +
        '</table>'
    ));
};

DscMessagePanel.prototype.pushMessage = function(msg) {
    var bcolor = msg.color? msg.color : '#000';
    var fcolor = msg.color? '#000' : '#FFF';
    var src    = msg.src? Utils.linkifyVessel(msg.src) : '';
    var dst    = msg.dst? Utils.linkifyVessel(msg.dst) : '';
    var data   = (
      (msg.category? ' ' + msg.category : '')
    + (msg.format?   ' ' + msg.format : '')
    + (msg.eos?      ' ' + msg.eos : '')
    + (!msg.ecc && !msg.data? ' ?' : '')
    ).trim().toUpperCase();

    // Format timestamp
    var timestamp =
      msg.time?      '<b>' + msg.time + '</b>'
    : msg.timestamp? Utils.HHMMSS(msg.timestamp)
    : '';

    // Format debugging data
    var symbols = '';
    if (msg.data) {
        symbols = msg.data.replace(
            /(.*)\|(.*)/, ' $1<span style="opacity:0.5;"> | $2 &hellip;</span>'
        );
    }

    // Combine remaining attributes into a message
    var message = (
      (msg.distress? ' ' + msg.distress : '')
    + (msg.id?     ' SHIP ' + Utils.linkifyVessel(msg.id) : '')
    + (msg.loc?    ' AT ' + msg.loc : '')
    + (msg.num?    ' DIAL ' + msg.num : '')
    + (msg.rxfreq? ' RX ' + Utils.printFreq(msg.rxfreq) : '')
    + (msg.txfreq? ' TX ' + Utils.printFreq(msg.txfreq) : '')
    + symbols
    ).trim();

    // Append report
    var $b = $(this.el).find('tbody');
    $b.append($(
        '<tr>' +
            '<td class="timestamp">' + timestamp + '</td>' +
            '<td class="src">' + src + '</td>' +
            '<td class="dst">' + dst + '</td>' +
            '<td class="data" style="text-align:left;">' + data + '</td>' +
        '</tr>'
    ).css('background-color', bcolor).css('color', fcolor));

    // Append messsage if present
    if (message) {
        $b.append($(
            '<tr><td class="message" colspan="4">' + message + '</td></tr>'
        ));
    }

    // Jump list to the last received message
    this.scrollToBottom();
};

$.fn.dscMessagePanel = function() {
    if (!this.data('panel')) {
        this.data('panel', new DscMessagePanel(this));
    }
    return this.data('panel');
};

IsmMessagePanel = function(el) {
    MessagePanel.call(this, el);
    this.initClearTimer();
    // These are basic message attributes
    this.basicInfo = ['mode', 'id', 'model', 'timestamp', 'freq', 'color'];
}

IsmMessagePanel.prototype = Object.create(MessagePanel.prototype);

IsmMessagePanel.prototype.supportsMessage = function(message) {
    return message['mode'] === 'ISM';
};

IsmMessagePanel.prototype.render = function() {
    $(this.el).append($(
        '<table>' +
            '<thead><tr>' +
                '<th class="address">ID</th>' +
                '<th class="device">Device</th>' +
                '<th class="timestamp">Time</th>' +
            '</tr></thead>' +
            '<tbody></tbody>' +
        '</table>'
    ));
};

IsmMessagePanel.prototype.formatAttr = function(msg, key) {
    return('<td class="attr" colspan="2">' +
        '<div style="border-bottom:1px dotted;">' +
        '<span style="float:left;">' + key + '</span>' +
        '<span style="float:right;">' + msg[key] + '</span>' +
        '</div></td>'
    );
};

IsmMessagePanel.prototype.pushMessage = function(msg) {
    // Get basic information, assume white color if missing
    var address = msg.hasOwnProperty('id')? msg.id : '???';
    var device  = msg.hasOwnProperty('model')? msg.model : '';
    var tstamp  = msg.hasOwnProperty('timestamp')? Utils.HHMMSS(msg.timestamp) : '';
    var color   = msg.hasOwnProperty('color')? msg.color : '#FFF';

    // Append message header (address, time, etc)
    var $b = $(this.el).find('tbody');
    $b.append($(
        '<tr>' +
            '<td class="address">' + address + '</td>' +
            '<td class="device">' + device + '</td>' +
            '<td class="timestamp" style="text-align:right;" colspan="2">' + tstamp + '</td>' +
        '</tr>'
    ).css('background-color', color).css('color', '#000'));

    // Append attributes in pairs, skip basic information
    var last = null;
    for (var key in msg) {
        if (this.basicInfo.indexOf(key) < 0) {
            var cell = this.formatAttr(msg, key);
            if (!last) {
                last = cell;
            } else {
                $b.append($('<tr>' + last + cell + '</tr>'));
                last = null;
            }
        }
    }

    // Last row
    if (last) $b.append($('<tr>' + last + '<td class="attr"/></tr>'));

    // Jump list to the last received message
    this.scrollToBottom();
};

$.fn.ismMessagePanel = function() {
    if (!this.data('panel')) {
        this.data('panel', new IsmMessagePanel(this));
    }
    return this.data('panel');
};

SstvMessagePanel = function(el) {
    MessagePanel.call(this, el);
    this.initClearTimer();
}

SstvMessagePanel.prototype = Object.create(MessagePanel.prototype);

SstvMessagePanel.prototype.supportsMessage = function(message) {
    return message['mode'] === 'SSTV';
};

SstvMessagePanel.prototype.render = function() {
    $(this.el).append($(
        '<table>' +
            '<thead><tr>' +
                '<th class="message">TV</th>' +
            '</tr></thead>' +
            '<tbody></tbody>' +
        '</table>'
    ));
};

SstvMessagePanel.prototype.pushMessage = function(msg) {
    var $b = $(this.el).find('tbody');
    if(msg.hasOwnProperty('message')) {
        // Append a new debug message text
// See service log for debug output instead
//        $b.append($('<tr><td class="message">' + msg.message + '</td></tr>'));
//        this.scrollToBottom();
    }
    else if(msg.width>0 && msg.height>0 && !msg.hasOwnProperty('line')) {
        var f = msg.frequency>0? ' at ' + Math.floor(msg.frequency/1000) + 'kHz' : '';
        var h = '<div>' + msg.timestamp + ' ' + msg.width + 'x' + msg.height +
            ' ' + msg.sstvMode + f + '</div>';
        var c = '<div onclick="Utils.saveCanvas(\'' + msg.filename + '\');">' +
            '<canvas class="frame" id="' + msg.filename +
            '" width="' + msg.width + '" height="' + msg.height +
            '"></canvas></div>';
        // Append a new canvas
        $b.append($('<tr><td class="message">' + h + c + '</td></tr>'));
        $b.scrollTop($b[0].scrollHeight);
        // Save canvas context and dimensions for future use
        this.ctx    = $(this.el).find('canvas').get(-1).getContext("2d");
        this.width  = msg.width;
        this.height = msg.height;
    }
    else if(msg.width>0 && msg.height>0 && msg.line>=0 && msg.hasOwnProperty('pixels')) {
        // Will copy pixels to img
        var pixels = atob(msg.pixels);
        var img = this.ctx.createImageData(msg.width, 1);
        // Convert BMP BGR pixels into HTML RGBA pixels
        for (var x = 0; x < msg.width; x++) {
            img.data[x*4 + 0] = pixels.charCodeAt(x*3 + 2);
            img.data[x*4 + 1] = pixels.charCodeAt(x*3 + 1);
            img.data[x*4 + 2] = pixels.charCodeAt(x*3 + 0);
            img.data[x*4 + 3] = 0xFF;
        }
        // Render scanline
        this.ctx.putImageData(img, 0, msg.line);
    }
};

$.fn.sstvMessagePanel = function() {
    if (!this.data('panel')) {
        this.data('panel', new SstvMessagePanel(this));
    }
    return this.data('panel');
};

FaxMessagePanel = function(el) {
    MessagePanel.call(this, el);
    this.initClearTimer();
}

FaxMessagePanel.prototype = Object.create(MessagePanel.prototype);

FaxMessagePanel.prototype.supportsMessage = function(message) {
    return message['mode'] === 'Fax';
};

FaxMessagePanel.prototype.render = function() {
    $(this.el).append($(
        '<table>' +
            '<thead><tr>' +
                '<th class="message">Fax</th>' +
            '</tr></thead>' +
            '<tbody></tbody>' +
        '</table>'
    ));
};

FaxMessagePanel.prototype.pushMessage = function(msg) {
    var $b = $(this.el).find('tbody');
    if(msg.hasOwnProperty('message')) {
        // Append a new debug message text
// See service log for debug output instead
//        $b.append($('<tr><td class="message">' + msg.message + '</td></tr>'));
//        this.scrollToBottom();
    }
    else if(msg.width>0 && msg.height>0 && !msg.hasOwnProperty('line')) {
        var f = msg.frequency>0? ' at ' + Math.floor(msg.frequency/1000) + 'kHz' : '';
        var h = '<div>' + msg.timestamp + ' ' + msg.width + 'x' + msg.height +
            ' ' + msg.faxMode + f + '</div>';
        var c = '<div onclick="Utils.saveCanvas(\'' + msg.filename + '\');">' +
            '<canvas class="frame" id="' + msg.filename +
            '" width="' + msg.width + '" height="' + msg.height +
            '"></canvas></div>';
        // Append a new canvas
        $b.append($('<tr><td class="message">' + h + c + '</td></tr>'));
        this.scrollToBottom();
        // Save canvas context and dimensions for future use
        this.ctx    = $(this.el).find('canvas').get(-1).getContext("2d");
        this.width  = msg.width;
        this.height = msg.height;
    }
    else if(msg.width>0 && msg.height>0 && msg.line>=0 && msg.ended) {
        const canvas  = $(this.el).find('canvas').get(-1);
        const image   = this.ctx.getImageData(0, 0, canvas.width, canvas.height);
        canvas.height = msg.line;
        this.height   = msg.line;
        this.ctx.putImageData(image, 0, 0);
    }
    else if(msg.width>0 && msg.height>0 && msg.line>=0 && msg.hasOwnProperty('pixels')) {
        // Will copy pixels to img
        var img = this.ctx.createImageData(msg.width, 1);
        var pixels;

        // Unpack RLE-compressed line of pixels
        if(!msg.rle) {
            pixels = atob(msg.pixels);
        } else {
            var rle = atob(msg.pixels);
            pixels = '';
            for(var x=0 ; x<rle.length ; ) {
                var c = rle.charCodeAt(x);
                if(c<128) {
                    pixels += rle.slice(x+1, x+c+2);
                    x += c + 2;
                } else {
                    pixels += rle.slice(x+1, x+2).repeat(c-128+2)
                    x += 2;
                }
            }
        }

        // Convert BMP BGR pixels into HTML RGBA pixels
        if(msg.depth==8) {
            for(var x=0, y=0; x<msg.width; x++) {
                var c = pixels.charCodeAt(x);
                img.data[y++] = c;
                img.data[y++] = c;
                img.data[y++] = c;
                img.data[y++] = 0xFF;
            }
        } else {
            for (var x = 0; x < msg.width; x++) {
                img.data[x*4 + 0] = pixels.charCodeAt(x*3 + 2);
                img.data[x*4 + 1] = pixels.charCodeAt(x*3 + 1);
                img.data[x*4 + 2] = pixels.charCodeAt(x*3 + 0);
                img.data[x*4 + 3] = 0xFF;
            }
        }

        // Render scanline
        this.ctx.putImageData(img, 0, msg.line);
    }
};

$.fn.faxMessagePanel = function() {
    if (!this.data('panel')) {
        this.data('panel', new FaxMessagePanel(this));
    }
    return this.data('panel');
};

CwSkimmerMessagePanel = function(el) {
    MessagePanel.call(this, el);
    this.texts = [];

    // CLEAR button clears underlying texts storage
    var me = this;
    this.clearButton.on('click', function() { me.texts = []; });
}

CwSkimmerMessagePanel.prototype = Object.create(MessagePanel.prototype);

CwSkimmerMessagePanel.prototype.supportsMessage = function(message) {
    return message['mode'] === 'CW';
};

CwSkimmerMessagePanel.prototype.render = function() {
    $(this.el).append($(
        '<table width="100%">' +
            '<thead><tr>' +
                '<th class="freq">Freq</th>' +
                '<th class="text">Text</th>' +
            '</tr></thead>' +
            '<tbody></tbody>' +
        '</table>'
    ));
};

CwSkimmerMessagePanel.prototype.pushMessage = function(msg) {
    // Must have some text
    if (!msg.text) return;

    // Clear cache if requested
//    if (msg.changed) this.texts = [];

    // Current time
    var now = Date.now();

    // Modify or add a new entry
    var j = this.texts.findIndex(function(x) { return x.freq >= msg.freq });
    if (j < 0) {
        // Append a new entry
        if (msg.text.trim().length > 0) {
            this.texts.push({ freq: msg.freq, text: msg.text, ts: now });
        }
    } else if (this.texts[j].freq == msg.freq) {
        // Update existing entry
        this.texts[j].text = (this.texts[j].text + msg.text).slice(-64);
        this.texts[j].ts   = now;
    } else {
        // Insert a new entry
        if (msg.text.trim().length > 0) {
            this.texts.splice(j, 0, { freq: msg.freq, text: msg.text, ts: now });
        }
    }

    // Generate table body
    var body = '';
    for (var j = 0 ; j < this.texts.length ; j++) {
        // Limit the lifetime of entries depending on their length
        var cutoff = 5000 * this.texts[j].text.length;
        if (now - this.texts[j].ts >= cutoff) {
            this.texts.splice(j--, 1);
        } else {
            var f = Math.floor(this.texts[j].freq / 100.0) / 10.0;
            body +=
                '<tr style="color:black;background-color:' + (j&1? '#E0FFE0':'#FFFFFF') +
                ';"><td class="freq">' + f.toFixed(1) +
                '</td><td class="text">' + this.texts[j].text + '</td></tr>\n';
        }
    }

    // Assign new table body
    $(this.el).find('tbody').html(body);
};

$.fn.cwskimmerMessagePanel = function() {
    if (!this.data('panel')) {
        this.data('panel', new CwSkimmerMessagePanel(this));
    }
    return this.data('panel');
};

Js8Thread = function(el){
    this.messages = [];
    this.el = el;
};

Js8Thread.prototype.getAverageFrequency = function(){
    var total = this.messages.map(function(message){
        return message.freq;
    }).reduce(function(t, f){
        return t + f;
    }, 0);
    return total / this.messages.length;
};

Js8Thread.prototype.pushMessage = function(message) {
    this.messages.push(message);
    this.render();
};

Js8Thread.prototype.render = function() {
    this.el.html(
        '<td class="time">' + Utils.HHMMSS(this.getLatestTimestamp()) + '</td>' +
        '<td class="decimal freq">' + Math.round(this.getAverageFrequency()) + '</td>' +
        '<td class="message" style="font-family:monospace;"><div>' + this.renderMessages() + '</div></td>'
    );
};

Js8Thread.prototype.getLatestTimestamp = function() {
    return this.messages[0].timestamp;
};

Js8Thread.prototype.isOpen = function() {
    if (!this.messages.length) return true;
    var last_message = this.messages[this.messages.length - 1];
    return (last_message.thread_type & 2) === 0;
};

Js8Thread.prototype.renderMessages = function() {
    var res = [];
    for (var i = 0; i < this.messages.length; i++) {
        var msg = this.messages[i];
        if (msg.thread_type & 1) {
            res.push('[ ');
        } else if (i === 0 || msg.timestamp - this.messages[i - 1].timestamp > this.getMessageDuration()) {
            res.push(' ... ');
        }
        var matches = msg.msg.match(/^([A-Z0-9]+)(:.*)$/);
        res.push(matches? Utils.linkifyCallsign(matches[1]) + matches[2] : msg.msg);
        if (msg.thread_type & 2) {
            res.push(' ]');
        } else if (i === this.messages.length -1) {
            res.push(' ... ');
        }
    }
    return res.join('');
};

Js8Thread.prototype.getMessageDuration = function() {
    switch (this.getMode()) {
        case 'A':
            return 15000;
        case 'E':
            return 30000;
        case 'B':
            return 10000;
        case 'C':
            return 6000;
    }
};

Js8Thread.prototype.getMode = function() {
    // we filter messages by mode, so the first one is as good as any
    if (!this.messages.length) return;
    return this.messages[0].js8mode;
};

Js8Thread.prototype.acceptsMode = function(mode) {
    var currentMode = this.getMode();
    return typeof(currentMode) === 'undefined' || currentMode === mode;
};

Js8Thread.prototype.purgeOldMessages = function() {
    var now = new Date().getTime();
    this.messages = this.messages.filter(function(m) {
        // keep messages around for 20 minutes
        return now - m.timestamp < 20 * 60 * 1000;
    });
    if (!this.messages.length) {
        this.el.remove();
    } else {
        this.render();
    }
    return this.messages.length;
};

Js8Thread.prototype.purge = function() {
    this.message = [];
    this.el.remove();
};

Js8Threader = function(el){
    MessagePanel.call(this, el);
    this.threads = [];
    this.tbody = $(el).find('tbody');
    var me = this;
    this.interval = setInterval(function(){
        me.purgeOldMessages();
    }, 15000);
};

Js8Threader.prototype = new MessagePanel();

Js8Threader.prototype.supportsMessage = function(message) {
    return message['mode'] === 'JS8';
};

Js8Threader.prototype.render = function() {
    $(this.el).append($(
        '<table>' +
            '<thead><tr>' +
                '<th class="time">UTC</th>' +
                '<th class="decimal freq">Freq</th>' +
                '<th class="message">Message</th>' +
            '</tr></thead>' +
            '<tbody></tbody>' +
        '</table>'
    ));
};

Js8Threader.prototype.clearMessages = function() {
    this.threads.forEach(function(t) {
        t.purge();
    });
    this.threads = [];
};

Js8Threader.prototype.purgeOldMessages = function() {
    this.threads = this.threads.filter(function(t) {
        return t.purgeOldMessages();
    });
};

Js8Threader.prototype.findThread = function(freq, mode) {
    var matching = this.threads.filter(function(thread) {
        // max frequency deviation: 5 Hz. this may be a little tight.
        return thread.isOpen() && thread.acceptsMode(mode) && Math.abs(thread.getAverageFrequency() - freq) <= 5;
    });
    matching.sort(function(a, b){
        return b.getLatestTimestamp() - a.getLatestTimestamp();
    });
    return matching[0] || false;
};

Js8Threader.prototype.pushMessage = function(message) {
    var thread;
    // only look for exising threads if the message is not a starting message
    if ((message.thread_type & 1) === 0) {
        thread = this.findThread(message.freq, message.js8mode);
    }
    if (!thread) {
        var line = $("<tr></tr>");
        this.tbody.append(line);
        thread = new Js8Thread(line);
        this.threads.push(thread);
    }
    thread.pushMessage(message);
    this.tbody.scrollTop(this.tbody[0].scrollHeight);
};

$.fn.js8 = function() {
    if (!this.data('threader')) {
        this.data('threader', new Js8Threader(this));
    }
    return this.data('threader');
};

var Modes = {
    modes: [],
    features: {},
    panels: [],
    setModes:function(json){
        this.modes = json.map(function(m){ return new Mode(m); });
        this.updatePanels();
        var bookmarkDialog = $('#openwebrx-dialog-bookmark').bookmarkDialog();
        bookmarkDialog.setUnderlying(this.modes);
        bookmarkDialog.setModes(this.modes);
    },
    getModes:function(){
        return this.modes;
    },
    setFeatures:function(features){
        this.features = features;
        this.updatePanels();
    },
    findByModulation:function(modulation){
        matches = this.modes.filter(function(m) { return m.modulation === modulation; });
        if (matches.length) return matches[0]
    },
    registerModePanel: function(el) {
        this.panels.push(el);
    },
    initComplete: function() {
        return this.modes.length && Object.keys(this.features).length;
    },
    updatePanels: function() {
        this.panels.forEach(function(p) {
            p.render();
            p.startDemodulator();
        });
    }
};

var Mode = function(json){
    this.modulation = json.modulation;
    this.name = json.name;
    this.type = json.type;
    this.squelch = json.squelch;
    if (json.bandpass) {
        this.bandpass = json.bandpass;
    }
    if (json.ifRate) {
        this.ifRate = json.ifRate;
    }
    if (this.type === 'digimode') {
        this.underlying = json.underlying;
        this.secondaryFft = json.secondaryFft;
    }
};

function MetaPanel(el) {
    this.el = el;
    this.modes = [];
}

MetaPanel.prototype.update = function(data) {
};

MetaPanel.prototype.isSupported = function(data) {
    return this.modes.includes(data.protocol);
};

MetaPanel.prototype.clear = function() {
    this.el.find(".openwebrx-meta-slot").removeClass("active").removeClass("sync");
};

function DmrMetaSlot(el) {
    this.el = $(el);
    this.clear();
}

DmrMetaSlot.prototype.update = function(data) {
    this.el[data['sync'] ? "addClass" : "removeClass"]("sync");
    if (data['sync'] && data['sync'] === "voice") {
        this.setId(data['additional'] && data['additional']['callsign'] || data['talkeralias'] || data['source']);
        this.setName(data['additional'] && data['additional']['fname']);
        this.setMode(['group', 'direct'].includes(data['type']) ? data['type'] : undefined);
        this.setTarget(data['target']);
        this.setLocation(data['lat'], data['lon'], this.getCallsign(data));
        this.el.addClass("active");
    } else {
        this.clear();
    }
};

DmrMetaSlot.prototype.getCallsign = function(data) {
    if ('additional' in data) {
        return data['additional']['callsign'];
    }
    if ('talkeralias' in data) {
        var matches = /^([A-Z0-9]+)(\s.*)?$/.exec(data['talkeralias']);
        if (matches) return matches[1];
    }
};

DmrMetaSlot.prototype.setId = function(id) {
    if (this.id === id) return;
    this.id = id;
    this.el.find('.openwebrx-dmr-id .dmr-id').text(id || '');
}

DmrMetaSlot.prototype.setName = function(name) {
    if (this.name === name) return;
    this.name = name;
    this.el.find('.openwebrx-dmr-name').text(name || '');
};

DmrMetaSlot.prototype.setMode = function(mode) {
    if (this.mode === mode) return;
    this.mode = mode;
    var classes = ['group', 'direct'].filter(function(c){
        return c !== mode;
    });
    this.el.removeClass(classes.join(' ')).addClass(mode);
}

DmrMetaSlot.prototype.setTarget = function(target) {
    if (this.target === target) return;
    this.target = target;
    this.el.find('.openwebrx-dmr-target').text(target || '');
}

DmrMetaSlot.prototype.setLocation = function(lat, lon, callsign) {
    var hasLocation = lat && lon && callsign && callsign != '';
    if (hasLocation === this.hasLocation && this.callsign === callsign) return;
    this.hasLocation = hasLocation; this.callsign = callsign;
    var html = '';
    if (hasLocation) {
        html = '<a class="openwebrx-maps-pin" href="map?callsign=' + encodeURIComponent(callsign) + '" target="_blank"><svg viewBox="0 0 20 35"><use xlink:href="static/gfx/svg-defs.svg#maps-pin"></use></svg></a>';
    }
    this.el.find('.openwebrx-dmr-id .location').html(html);
}

DmrMetaSlot.prototype.clear = function() {
    this.setId();
    this.setName();
    this.setMode();
    this.setTarget();
    this.setLocation();
    this.el.removeClass("active");
};

function DmrMetaPanel(el) {
    MetaPanel.call(this, el);
    this.modes = ['DMR'];
    this.slots = this.el.find('.openwebrx-meta-slot').toArray().map(function(el){
        return new DmrMetaSlot(el);
    });
}

DmrMetaPanel.prototype = new MetaPanel();

DmrMetaPanel.prototype.update = function(data) {
    if (!this.isSupported(data)) return;
    if (data['slot']) {
        var slot = this.slots[data['slot']];
        slot.update(data);
    } else {
        this.clear();
    }
}

DmrMetaPanel.prototype.clear = function() {
    MetaPanel.prototype.clear.call(this);
    this.el.find(".openwebrx-dmr-timeslot-panel").removeClass("muted");
    this.slots.forEach(function(slot) {
        slot.clear();
    });
};

function YsfMetaPanel(el) {
    MetaPanel.call(this, el);
    this.modes = ['YSF'];
    this.clear();
}

YsfMetaPanel.prototype = new MetaPanel();

YsfMetaPanel.prototype.update = function(data) {
    if (!this.isSupported(data)) return;
    this.setMode(data['mode']);

    if (data['mode'] && data['mode'] !== "") {
        this.setSource(data['source']);
        this.setLocation(data['lat'], data['lon'], data['source']);
        this.setUp(data['up']);
        this.setDown(data['down']);
        if (data['mode'].indexOf('data') < 0) {
            this.el.find(".openwebrx-meta-slot").addClass("active");
        }
    } else {
        this.clear();
    }
};

YsfMetaPanel.prototype.clear = function() {
    MetaPanel.prototype.clear.call(this);
    this.setMode();
    this.setSource();
    this.setLocation();
    this.setUp();
    this.setDown();
};

YsfMetaPanel.prototype.setMode = function(mode) {
    if (this.mode === mode) return;
    this.mode = mode;
    this.el.find('.openwebrx-ysf-mode').text(mode || '');
};

YsfMetaPanel.prototype.setSource = function(source) {
    if (this.source === source) return;
    this.source = source;
    this.el.find('.openwebrx-ysf-source .callsign').text(source || '');
};

YsfMetaPanel.prototype.setLocation = function(lat, lon, callsign) {
    var hasLocation = lat && lon && callsign && callsign != '';
    if (hasLocation === this.hasLocation && this.callsign === callsign) return;
    this.hasLocation = hasLocation; this.callsign = callsign;
    var html = '';
    if (hasLocation) {
        html = '<a class="openwebrx-maps-pin" href="map?callsign=' + encodeURIComponent(callsign) + '" target="_blank"><svg viewBox="0 0 20 35"><use xlink:href="static/gfx/svg-defs.svg#maps-pin"></use></svg></a>';
    }
    this.el.find('.openwebrx-ysf-source .location').html(html);
};

YsfMetaPanel.prototype.setUp = function(up) {
    if (this.up === up) return;
    this.up = up;
    this.el.find('.openwebrx-ysf-up').text(up || '');
};

YsfMetaPanel.prototype.setDown = function(down) {
    if (this.down === down) return;
    this.down = down;
    this.el.find('.openwebrx-ysf-down').text(down || '');
}

function DStarMetaPanel(el) {
    MetaPanel.call(this, el);
    this.modes = ['DSTAR'];
    this.clear();
}

DStarMetaPanel.prototype = new MetaPanel();

DStarMetaPanel.prototype.update = function(data) {
    if (!this.isSupported(data)) return;

    if (data['sync'] && data['sync'] == 'voice') {
        this.el.find(".openwebrx-meta-slot").addClass("active");
        this.setOurCall(data['ourcall']);
        this.setYourCall(data['yourcall']);
        this.setDeparture(data['departure']);
        this.setDestination(data['destination']);
        this.setMessage(data['message']);
        this.setLocation(data['lat'], data['lon'], data['ourcall']);
    } else {
        this.clear();
    }
};

DStarMetaPanel.prototype.setOurCall = function(ourcall) {
    if (this.ourcall === ourcall) return;
    this.ourcall = ourcall;
    this.el.find('.openwebrx-dstar-ourcall .callsign').text(ourcall || '');
};

DStarMetaPanel.prototype.setYourCall = function(yourcall) {
    if (this.yourcall === yourcall) return;
    this.yourcall = yourcall;
    this.el.find('.openwebrx-dstar-yourcall').text(yourcall || '');
};

DStarMetaPanel.prototype.setDeparture = function(departure) {
    if (this.departure === departure) return;
    this.departure = departure;
    this.el.find('.openwebrx-dstar-departure').text(departure || '');
};

DStarMetaPanel.prototype.setDestination = function(destination) {
    if (this.destination === destination) return;
    this.destination = destination;
    this.el.find('.openwebrx-dstar-destination').text(destination || '');
};

DStarMetaPanel.prototype.setMessage = function(message) {
    if (this.message === message) return;
    this.message = message;
    this.el.find('.openwebrx-dstar-message').text(message || '');
}

DStarMetaPanel.prototype.clear = function() {
    MetaPanel.prototype.clear.call(this);
    this.setOurCall();
    this.setYourCall();
    this.setDeparture();
    this.setDestination();
    this.setMessage();
    this.setLocation();
};

DStarMetaPanel.prototype.setLocation = function(lat, lon, callsign) {
    var hasLocation = lat && lon && callsign && callsign != '';
    if (hasLocation === this.hasLocation && this.callsign === callsign) return;
    this.hasLocation = hasLocation; this.callsign = callsign;
    var html = '';
    if (hasLocation) {
        html = '<a class="openwebrx-maps-pin" href="map?callsign=' + encodeURIComponent(callsign) + '" target="_blank"><svg viewBox="0 0 20 35"><use xlink:href="static/gfx/svg-defs.svg#maps-pin"></use></svg></a>';
    }
    this.el.find('.openwebrx-dstar-ourcall .location').html(html);
};

function NxdnMetaPanel(el) {
    MetaPanel.call(this, el);
    this.modes = ['NXDN'];
    this.clear();
}

NxdnMetaPanel.prototype = new MetaPanel();

NxdnMetaPanel.prototype.update = function(data) {
    if (!this.isSupported(data)) return;

    if (data['sync'] && data['sync'] === 'voice') {
        this.el.find(".openwebrx-meta-slot").addClass("active");
        this.setSource(data['additional'] && data['additional']['callsign'] || data['source']);
        this.setName(data['additional'] && data['additional']['fname']);
        this.setDestination(data['destination']);
        this.setMode(['conference', 'individual'].includes(data['type']) ? data['type'] : undefined);
    } else {
        this.clear();
    }
};

NxdnMetaPanel.prototype.setSource = function(source) {
    if (this.source === source) return;
    this.source = source;
    this.el.find('.openwebrx-nxdn-source').text(source || '');
};

NxdnMetaPanel.prototype.setName = function(name) {
    if (this.name === name) return;
    this.name = name;
    this.el.find('.openwebrx-nxdn-name').text(name || '');
};

NxdnMetaPanel.prototype.setDestination = function(destination) {
    if (this.destination === destination) return;
    this.destination = destination;
    this.el.find('.openwebrx-nxdn-destination').text(destination || '');
};

NxdnMetaPanel.prototype.setMode = function(mode) {
    if (this.mode === mode) return;
    this.mode = mode;

    var modes = ['individual', 'conference'];
    var classes = modes.filter(function(c){
        return c !== mode;
    });
    this.el.find('.openwebrx-meta-slot').removeClass(classes.join(' ')).addClass(mode);
};

NxdnMetaPanel.prototype.clear = function() {
    MetaPanel.prototype.clear.call(this);
    this.setMode();
    this.setSource();
    this.setName();
    this.setDestination();
};

function M17MetaPanel(el) {
    MetaPanel.call(this, el);
    this.modes = ['M17'];
    this.clear();
}

M17MetaPanel.prototype = new MetaPanel();

M17MetaPanel.prototype.update = function(data) {
    if (!this.isSupported(data)) return;

    if (data['sync'] && data['sync'] === 'voice') {
        this.el.find(".openwebrx-meta-slot").addClass("active");
        this.setSource(data['source']);
        this.setDestination(data['destination']);
    } else {
        this.clear();
    }
};

M17MetaPanel.prototype.setSource = function(source) {
    if (this.source === source) return;
    this.source = source;
    this.el.find('.openwebrx-m17-source').text(source || '');
};

M17MetaPanel.prototype.setDestination = function(destination) {
    if (this.destination === destination) return;
    this.destination = destination;
    this.el.find('.openwebrx-m17-destination').text(destination || '');
};

M17MetaPanel.prototype.clear = function() {
    MetaPanel.prototype.clear.call(this);
    this.setSource();
    this.setDestination();
};

function WfmMetaPanel(el) {
    MetaPanel.call(this, el);
    this.modes = ['WFM'];
    this.enabled = false;
    this.timeout = false;
    this.clear();
}

WfmMetaPanel.prototype = new MetaPanel();

WfmMetaPanel.prototype.update = function(data) {
    if (!this.isSupported(data)) return;
    var me = this;

    // automatically clear metadata panel when no RDS data is received for more than ten seconds
    if (this.timeout) clearTimeout(this.timeout);
    this.timeout = setTimeout(function(){
        me.clear();
    }, 10000);

    if ('pi' in data && data.pi !== this.pi) {
        this.clear();
        this.pi = data.pi;
    }

    var $el = $(this.el);

    if ('ps' in data) {
        this.ps = data.ps;
    }

    if ('prog_type' in data) {
        $el.find('.rds-prog_type').text(data['prog_type']);
    }

    if ('callsign' in data) {
        this.callsign = data.callsign;
    } else if ('callsign_uncertain' in data) {
        this.callsign = data.callsign_uncertain + '?';
    }

    if ('pi' in data) {
        this.pi = data.pi
    }

    if ('clock_time' in data) {
        var date = new Date(Date.parse(data.clock_time));
        $el.find('.rds-clock').text(date.toLocaleString([], {dateStyle: 'short', timeStyle: 'short'}));
    }

    if ('radiotext_plus' in data) {
        // prefer displaying radiotext plus over radiotext
        this.radiotext_plus = this.radiotext_plus || {
            item_toggle: -1,
            news: []
        };

        var tags = {};
        if ('tags' in data.radiotext_plus) {
            tags = Object.fromEntries(data.radiotext_plus.tags.map(function (tag) {
                return [tag['content-type'], tag['data']]
            }));
        }

        if (data.radiotext_plus.item_toggle !== this.radiotext_plus.item_toggle) {
            this.radiotext_plus.item_toggle = data.radiotext_plus.item_toggle;
            this.radiotext_plus.item = '';
        }

        this.radiotext_plus.item_running = !!data.radiotext_plus.item_running;

        if ('item.artist' in tags && 'item.title' in tags) {
            this.radiotext_plus.item = tags['item.artist'] + ' - ' + tags['item.title'];
        } else {
            var items = Object.entries(tags).filter(function (e) {
                return e[0].startsWith("item.")
            })
            if (items.length) {
                this.radiotext_plus.item = items.map(function (e) {
                    return e[0].substr(5, 1).toUpperCase() + e[0].substr(6) + ': ' + e[1];
                }).join('; ');
            }
        }

        if ('programme.now' in tags) {
            this.radiotext_plus.programme = tags['programme.now'];
        }

        if ('programme.homepage' in tags) {
            this.radiotext_plus.homepage = tags['programme.homepage'];
        }

        if ('stationname.long' in tags) {
            this.long_stationname = tags['stationname.long'];
        }

        if ('stationname.short' in tags) {
            this.short_stationname = tags['stationname.short'];
        }

        if ('info.news' in tags) {
            var n = tags['info.news'];
            var i = this.radiotext_plus.news.indexOf(n);
            if (i >= 0) {
                this.radiotext_plus.news.splice(i, 1);
            }
            this.radiotext_plus.news.push(n);
            // limit the number of items
            this.radiotext_plus.news = this.radiotext_plus.news.slice(-5);
        }

        if ('info.weather' in tags) {
            this.radiotext_plus.weather = tags['info.weather'];
        }
    }

    if ('radiotext' in data && !this.radiotext_plus) {
        this.radiotext = data.radiotext;
    }

    if (this.radiotext_plus) {
        $el.find('.rds-radiotext').empty();
        if (this.radiotext_plus.item_running) {
            $el.find('.rds-rtplus-item').text(this.radiotext_plus.item || '');
        } else {
            $el.find('.rds-rtplus-item').empty();
        }
        $el.find('.rds-rtplus-programme').text(this.radiotext_plus.programme || '');
        $el.find('.rds-rtplus-news').empty().html(this.radiotext_plus.news.map(function(n){
            return $('<li>').text(n);
        }));
        $el.find('.rds-rtplus-weather').text(this.radiotext_plus.weather || '');
        if (this.radiotext_plus.homepage) {
            var url = this.radiotext_plus.homepage;
            // prefix with a protcol if not present. we'll assume https, should be generally available these days.
            if (url.indexOf('://') < 0) url = 'https://' + url;
            // avoid updating the link if not necessary since that would prevent the user from clicking it
            if ($el.find('.rds-rtplus-homepage a').attr('href') !== url) {
                var link = $('<a href="' + url + '" target="_blank"></a>').text(this.radiotext_plus.homepage);
                $el.find('.rds-rtplus-homepage').html(link);
            }
        }
    } else {
        $el.find('.rds-radiotext-plus .autoclear').empty();
        $el.find('.rds-radiotext').text(this.radiotext || '');
    }

    $el.find('.rds-stationname').text(this.long_stationname || this.ps);
    $el.find('.rds-callsign').text(this.short_stationname || this.callsign);
    $el.find('.rds-identifier').text('PI:' + this.pi);
};

WfmMetaPanel.prototype.isSupported = function(data) {
    return this.modes.includes(data.mode);
};

WfmMetaPanel.prototype.setEnabled = function(enabled) {
    if (enabled === this.enabled) return;
    this.enabled = enabled;
    if (enabled) {
        $(this.el).removeClass('disabled').html(
            '<div class="rds-container">' +
                '<div class="rds-top-line">' +
                    '<span class="rds-callsign rds-autoclear"></span>' +
                    '<span class="rds-identifier rds-autoclear"></span>' +
                '</div>' +
                '<div class="rds-stationname rds-autoclear"></div>' +
                '<div class="rds-radiotext rds-autoclear"></div>' +
                '<div class="rds-radiotext-plus">' +
                    '<div class="rds-rtplus-programme rds-autoclear"></div>' +
                    '<div class="rds-rtplus-item rds-autoclear"></div>' +
                    '<ul class="rds-rtplus-news rds-autoclear"></ul>' +
                    '<div class="rds-rtplus-weather rds-autoclear"></div>' +
                    '<div class="rds-rtplus-homepage rds-autoclear"></div>' +
                '</div>' +
                '<div class="rds-bottom-line">' +
                    '<span class="rds-prog_type rds-autoclear"></span>' +
                    '<span class="rds-clock rds-autoclear"></span>' +
                '</div>' +
            '</div>'
        );
    } else {
        $(this.el).addClass('disabled').emtpy()
    }
};

WfmMetaPanel.prototype.clear = function() {
    $(this.el).find('.rds-autoclear').empty();
    this.pi = '';
    this.ps = '';
    this.callsign = '';
    this.long_stationname = '';
    this.short_stationname = '';

    this.radiotext = '';
    this.radiotext_plus = false;
};

function HdrMetaPanel(el) {
    MetaPanel.call(this, el);
    this.modes = ['HDR'];

    // Create info panel
    var $container = $(
        '<div class="hdr-container">' +
            '<div class="hdr-top-line">' +
                '<select id="hdr-program-id" class="hdr-selector"></select>' +
                '<span class="hdr-identifier"></span>' +
            '</div>' +
            '<div class="hdr-station"></div>' +
            '<div class="hdr-message"></div>' +
            '<div class="hdr-title"></div>' +
            '<div class="hdr-artist"></div>' +
            '<div class="hdr-album"></div>' +
            '<div class="hdr-bottom-line">' +
                '<span class="hdr-genre"></span>' +
            '</div>' +
        '</div>'
    );

    $(this.el).append($container);

    var $select = $('#hdr-program-id');
    $select.hide();
    $select.on("change", function() {
        var id = parseInt($(this).val());
        UI.getDemodulator().setAudioServiceId(id);
    });
}

HdrMetaPanel.prototype = new MetaPanel();

HdrMetaPanel.prototype.update = function(data) {
    if (!this.isSupported(data)) return;

    // Convert FCC ID to hexadecimal
    var fcc_id = '';
    if ('fcc_id' in data) {
        fcc_id = data.fcc_id.toString(16).toUpperCase();
        fcc_id = '0x' + ('0000' + fcc_id).slice(-4);
        fcc_id = ('country' in data?  data.country + ':' : '') + fcc_id;
    }

    // Update panel
    var $el = $(this.el);
    $el.find('.hdr-identifier').text(fcc_id);
    $el.find('.hdr-station').text(data.station || '');
    $el.find('.hdr-message').text(data.alert || data.message || data.slogan || '');
    $el.find('.hdr-title').text(data.title || '');
    $el.find('.hdr-artist').text(data.artist || '');
    $el.find('.hdr-genre').text(data.genre || '');
    $el.find('.hdr-album').text(data.album || '');

    // Update program selector
    var $select = $('#hdr-program-id');
    if (data.audio_services && data.audio_services.length) {
        $select.html(data.audio_services.map(function(pgm) {
            var selected = data.program == pgm.id? ' selected' : '';
            return '<option value="' + pgm.id + '"' + selected + '>P' +
                (pgm.id + 1) + ' - ' + pgm.name + '</option>';
        }).join());
        $select.show();
    } else {
        $select.html('');
        $select.hide();
    }
};

HdrMetaPanel.prototype.isSupported = function(data) {
    return this.modes.includes(data.mode);
};

function DabMetaPanel(el) {
    MetaPanel.call(this, el);
    var me = this;
    this.modes = ['DAB'];
    this.service_id = 0;
    this.$select = $('<select id="dab-service-id"></select>');
    this.$select.on("change", function() {
        me.service_id = parseInt($(this).val());
        UI.getDemodulator().setAudioServiceId(me.service_id);
    });
    var $container = $(
        '<div class="dab-container">' +
            '<div class="dab-auto-clear dab-ensemble-id"></div>' +
            '<div class="dab-auto-clear dab-ensemble-label"></div>' +
            '<div class="dab-auto-clear dab-timestamp"></div>' +
            '<label for="dab-service-id">DAB Programme:</label>' +
        '</div>'
    );
    $container.append(this.$select);
    $(this.el).append($container);
    this.clear();
    this.programmeTimeout = false;
}

DabMetaPanel.prototype = new MetaPanel();

DabMetaPanel.prototype.isSupported = function(data) {
    return this.modes.includes(data.mode);
}

DabMetaPanel.prototype.update = function(data) {
    if (!this.isSupported(data)) return;

    if ('ensemble_id' in data) {
        $(this.el).find('.dab-ensemble-id').text('0x' + data.ensemble_id.toString(16));
    }

    if ('ensemble_label' in data) {
        $(this.el).find('.dab-ensemble-label').text(data.ensemble_label);
    }

    if ('timestamp' in data) {
        var date = new Date(data.timestamp * 1000);
        $(this.el).find('.dab-timestamp').text(date.toLocaleString([], {dateStyle: 'short', timeStyle: 'medium'}));
    }

    if ('programmes' in data) {
        var options = Object.entries(data.programmes).map(function(e) {
            return '<option value="' + e[0] + '">' + e[1] + '</option>';
        });
        this.$select.html(
            options.join('') +
            '<option value="" disabled selected hidden>Loading...</option>'
        );

        var me = this;
        if (this.programmeTimeout) clearTimeout(this.programmeTimeout);
        this.programmeTimeout = setTimeout(function() {
            // user has selected a programme to play. don't interfere.
            me.$select.val(this.service_id);
            if (me.$select.val()) return;
            me.$select.val(me.$select.find('option:first').val()).change();
        }, 1000);
    }
}

DabMetaPanel.prototype.clear = function() {
    this.service_id = 0;
    $(this.el).find('.dab-auto-clear').empty();
    this.$select.html(
        '<option value="" disabled selected hidden>Loading...</option>'
    );
}

MetaPanel.types = {
    dmr: DmrMetaPanel,
    ysf: YsfMetaPanel,
    dstar: DStarMetaPanel,
    nxdn: NxdnMetaPanel,
    m17: M17MetaPanel,
    wfm: WfmMetaPanel,
    dab: DabMetaPanel,
    hdr: HdrMetaPanel,
};

$.fn.metaPanel = function() {
    return this.map(function() {
        var $self = $(this);
        if (!$self.data('metapanel')) {
            var matches = /^openwebrx-panel-metadata-([a-z0-9]+)$/.exec($self.prop('id'));
            var constructor = matches && MetaPanel.types[matches[1]] || MetaPanel;
            $self.data('metapanel', new constructor($self));
        }
        return $self.data('metapanel');
    });
};

//
// Waterfall colors
//

function Waterfall() {}

Waterfall.colors       = chroma.scale([0x000000, 0xFFFFFF]).colors(256, 'rgb');
Waterfall.levels       = { min: -150, max: 0 };
Waterfall.fixed_levels = { min: -150, max: 0 };
Waterfall.auto_levels  = { min: -150, max: 0 };
Waterfall.cont_levels  = { min: -150, max: 0 };
Waterfall.auto_min_range = 0;
Waterfall.measure_minmax_now = false;
Waterfall.measure_minmax_continuous = false;

// Get current waterfall min/max levels range.
Waterfall.getRange = function() {
    return this.levels;
};

// Set waterfall color theme, passed as an array of
// integer RGB values.
Waterfall.setTheme = function(theme) {
    this.colors = chroma.scale(theme).colors(256, 'rgb');
};

// Configure waterfall parameters from the attributes
// sent by the server.
Waterfall.configure = function(config) {
    if ('waterfall_levels' in config)
        this.fixed_levels = config['waterfall_levels'];
    if ('waterfall_auto_levels' in config)
        this.auto_levels = config['waterfall_auto_levels'];
    if ('waterfall_auto_min_range' in config)
        this.auto_min_range = config['waterfall_auto_min_range'];
    if ('waterfall_auto_level_default_mode' in config)
        this.toggleContinuousRange(config['waterfall_auto_level_default_mode']);
};

// Use one-time automatic min/max level update.
Waterfall.setAutoRange = function() {
    this.measure_minmax_now = true;
};

// Use default min/max levels.
Waterfall.setDefaultRange = function() {
    this.levels.min = this.fixed_levels.min;
    this.levels.max = this.fixed_levels.max;
    this.updateSliders();
    this.resetContinuousColors();
};

// Enable continuous min/max level updates.
Waterfall.toggleContinuousRange = function(on) {
    // If no argument given, toggle continuous mode
    on = typeof(on) === 'undefined'? !this.measure_minmax_continuous : on;

    this.measure_minmax_continuous = on;

    var autoButton = $('#openwebrx-waterfall-colors-auto');
    autoButton[on ? 'addClass' : 'removeClass']('highlighted');
    $('#openwebrx-waterfall-color-min, #openwebrx-waterfall-color-max').prop('disabled', on);
};

// Update waterfall min/max levels from sliders.
Waterfall.updateColors = function(which) {
    var $wfmax = $("#openwebrx-waterfall-color-max");
    var $wfmin = $("#openwebrx-waterfall-color-min");

    this.levels.max = parseInt($wfmax.val());
    this.levels.min = parseInt($wfmin.val());

    if (this.levels.min >= this.levels.max) {
        if (!which) {
            this.levels.min = this.levels.max -1;
        } else {
            this.levels.max = this.levels.min + 1;
        }
    }

    this.updateSliders();
};

// Update waterfall level sliders from min/max levels.
Waterfall.updateSliders = function() {
    $('#openwebrx-waterfall-color-max')
        .val(this.levels.max)
        .attr('title', 'Waterfall maximum level (' + Math.round(this.levels.max) + ' dB)');
    $('#openwebrx-waterfall-color-min')
        .val(this.levels.min)
        .attr('title', 'Waterfall minimum level (' + Math.round(this.levels.min) + ' dB)');
};

// Update automatic min/max levels.
Waterfall.updateAutoColors = function(levels) {
    var min_level = levels.min - this.auto_levels.min;
    var max_level = levels.max + this.auto_levels.max;

    max_level = Math.max(min_level + (this.auto_min_range || 0), max_level);

    this.levels.min = min_level;
    this.levels.max = max_level;
    this.updateSliders();
};

// Reset continuous min/max levels.
Waterfall.resetContinuousColors = function() {
    this.cont_levels.min = this.levels.min;
    this.cont_levels.max = this.levels.max;
};

// Update continous min/max levels.
Waterfall.updateContinuousColors = function(levels) {
    if (levels.max > this.cont_levels.max + 1) {
        this.cont_levels.max += 1;
    } else if (levels.max < this.cont_levels.max - 1) {
        this.cont_levels.max -= 0.1;
    }

    if (levels.min < this.cont_levels.min - 1) {
        this.cont_levels.min -= 1;
    } else if (levels.min > this.cont_levels.min + 1) {
        this.cont_levels.min += 0.1;
    }

    this.updateAutoColors(this.cont_levels);
};

// Measure min/max levels from the incoming data, if necessary.
Waterfall.measureRange = function(data) {
    // Drop out unless we actually need to measure levels
    if (!this.measure_minmax_now && !this.measure_minmax_continuous) return;

    // Get visible range of frequencies
    var range = get_visible_freq_range();
    var start = center_freq - bandwidth / 2;

    // This is based on an oversampling factor of about 1.25
    range.start = Math.max(0.1, (range.start - start) / bandwidth);
    range.end   = Math.min(0.9, (range.end - start) / bandwidth);

    // Align to the range edges, do not let things flip over
    if (range.start >= 0.9)
        range.start = range.end - range.bw / bandwidth;
    else if (range.end <= 0.1)
        range.end = range.start + range.bw / bandwidth;

    // Find min/max levels within the range
    data = data.slice(range.start * data.length, range.end * data.length);
    var levels = {
        min: Math.min.apply(Math, data),
        max: Math.max.apply(Math, data)
    };

    if (this.measure_minmax_now) {
        this.measure_minmax_now = false;
        this.updateAutoColors(levels);
        this.resetContinuousColors();
    }

    if (this.measure_minmax_continuous) {
        this.updateContinuousColors(levels);
    }
};

// Create a color based on the dB value and current color theme.
Waterfall.makeColor = function(db) {
    var v = (db - this.levels.min) / (this.levels.max - this.levels.min);
    v = Math.max(0, Math.min(1, v)) * (this.colors.length - 1);
    var i = Math.floor(v);
    v = v - i;

    if (v == 0) {
        return this.colors[i];
    } else {
        var c0 = this.colors[i];
        var c1 = this.colors[i+1];
        return [
            c0[0] + v * (c1[0] - c0[0]),
            c0[1] + v * (c1[1] - c0[1]),
            c0[2] + v * (c1[2] - c0[2])
        ];
    }
};

// Draw a single line of waterfall pixels based on the input data.
Waterfall.drawLine = function(out, data, offset = 0) {
    var y = 0;
    for (var x = 0; x < data.length; x++) {
        var color = this.makeColor(data[x] + offset);
        out[y++] = color[0];
        out[y++] = color[1];
        out[y++] = color[2];
        out[y++] = 255;
    }
};

//
// Handle keyboard shortcuts
//

function Shortcuts() {}

Shortcuts.init = function(target) {
    // Do not initialize twice
    if (this.overlay) return;

    var that = this;
    target.addEventListener('keydown', function(e) { that.handleKey(e); });

    this.overlay = jQuery('<div id="ks-overlay"></div>');
    this.overlay.hide();
    this.overlay.appendTo(target);

    this.overlay.html(`
    <div class="ks-title">Keyboard Shortcuts</div>
    <div class="ks-subtitle">Hide this help panel by pressing ${this.keycap('?')}</div>
    <div class="ks-separator"></div>
    <div class="ks-content">

      <div class="ks-item">
        <div class="ks-item-txt">select modulation</div>
        <div class="ks-item-kbd">(${this.keycap('Control')}+)&nbsp;${this.keycap('0')}..${this.keycap('9')}</div>
      </div>
      <div class="ks-item">
        <div class="ks-item-txt">zoom waterfall</div>
        <div class="ks-item-kbd">${this.keycap('ArrowUp')}|${this.keycap('ArrowDown')}</div>
      </div>
      <div class="ks-item">
        <div class="ks-item-txt">tune frequency</div>
        <div class="ks-item-kbd">${this.keycap('ArrowLeft')}|${this.keycap('ArrowRight')}</div>
      </div>

      <div class="ks-item">
        <div class="ks-item-txt">mute/unmute sound</div>
        <div class="ks-item-kbd">${this.keycap('Space')}</div>
      </div>
      <div class="ks-item">
        <div class="ks-item-txt">change volume</div>
        <div class="ks-item-kbd">${this.keycap('Control')}+${this.keycap('ArrowUp')}|${this.keycap('ArrowDown')}</div>
      </div>
      <div class="ks-item">
        <div class="ks-item-txt">change tuning step</div>
        <div class="ks-item-kbd">${this.keycap('Control')}+${this.keycap('ArrowLeft')}|${this.keycap('ArrowRight')}</div>
      </div>

      <div class="ks-item">
        <div class="ks-item-txt">toggle receiver panel</div>
        <div class="ks-item-kbd">${this.keycap('Enter')}</div>
      </div>
      <div class="ks-item">
        <div class="ks-item-txt">adjust bandpass width</div>
        <div class="ks-item-kbd">${this.keycap('Shift')}+${this.keycap('ArrowUp')}|${this.keycap('ArrowDown')}</div>
      </div>
      <div class="ks-item">
        <div class="ks-item-txt">adjust bandpass offset</div>
        <div class="ks-item-kbd">${this.keycap('Shift')}+${this.keycap('ArrowLeft')}|${this.keycap('ArrowRight')}</div>
      </div>

      <div class="ks-item">
        <div class="ks-item-txt">toggle noise reduction</div>
        <div class="ks-item-kbd">${this.keycap('N')}</div>
      </div>
      <div class="ks-item">
        <div class="ks-item-txt">adjust waterfall min level</div>
        <div class="ks-item-kbd">${this.keycap(',')}|${this.keycap('.')}</div>
      </div>
      <div class="ks-item">
        <div class="ks-item-txt">adjust waterfall max level</div>
        <div class="ks-item-kbd">${this.keycap('<')}|${this.keycap('>')}</div>
      </div>

      <div class="ks-item">
        <div class="ks-item-txt">auto-set colors once</div>
        <div class="ks-item-kbd">${this.keycap('Z')}</div>
      </div>
      <div class="ks-item">
        <div class="ks-item-txt">auto-set colors</div>
        <div class="ks-item-kbd">${this.keycap('X')}</div>
      </div>
      <div class="ks-item">
        <div class="ks-item-txt">set default colors</div>
        <div class="ks-item-kbd">${this.keycap('C')}</div>
      </div>

      <div class="ks-item">
        <div class="ks-item-txt">auto-set squelch</div>
        <div class="ks-item-kbd">${this.keycap('A')}</div>
      </div>
      <div class="ks-item">
        <div class="ks-item-txt">change squelch level</div>
        <div class="ks-item-kbd">${this.keycap('{')}|${this.keycap('}')}</div>
      </div>
      <div class="ks-item">
        <div class="ks-item-txt">disable squelch</div>
        <div class="ks-item-kbd">${this.keycap('D')}</div>
      </div>

      <div class="ks-item">
        <div class="ks-item-txt">toggle scanner</div>
        <div class="ks-item-kbd">${this.keycap('S')}</div>
      </div>
      <div class="ks-item">
        <div class="ks-item-txt">tune by squelch</div>
        <div class="ks-item-kbd">${this.keycap('[')}|${this.keycap(']')}</div>
      </div>
      <div class="ks-item">
        <div class="ks-item-txt">toggle log/chat</div>
        <div class="ks-item-kbd">${this.keycap('L')}</div>
      </div>

      <div class="ks-item">
        <div class="ks-item-txt">toggle recorder</div>
        <div class="ks-item-kbd">${this.keycap('R')}</div>
      </div>
      <div class="ks-item">
        <div class="ks-item-txt">toggle spectrum</div>
        <div class="ks-item-kbd">${this.keycap('V')}</div>
      </div>
      <div class="ks-item">
        <div class="ks-item-txt">toggle bandplan</div>
        <div class="ks-item-kbd">${this.keycap('B')}</div>
      </div>

      <div class="ks-item">
        <div class="ks-item-txt">open map</div>
        <div class="ks-item-kbd">${this.keycap('M')}</div>
      </div>
      <div class="ks-item">
        <div class="ks-item-txt">open files browser</div>
        <div class="ks-item-kbd">${this.keycap('F')}</div>
      </div>
      <div class="ks-item">
        <div class="ks-item-txt">open documentation</div>
        <div class="ks-item-kbd">${this.keycap('H')}</div>
      </div>
    </div>
    `);
};

Shortcuts.moveSlider = function(slider, delta) {
    var $control = $(slider);
    if (!$control.prop('disabled')) {
        $control.val(parseInt($control.val()) + delta).change();
    }
};

Shortcuts.moveSelector = function(selector, steps) {
    var $control = $(selector);
    if (!$control.prop('disabled')) {
        var max = $(selector + ' option').length;
        var n = $control.prop('selectedIndex') + steps;
        n = n < 0? n + max : n >= max? n - max : n;
        $control.prop('selectedIndex', n).change();
    }
};

Shortcuts.handleKey = function(event) {
    // Do not handle shortcuts when focused on a text or numeric input
    var on_input = !!($('input:focus').length && ($('input:focus')[0].type === 'text' || $('input:focus')[0].type === 'number'));
    if (on_input) return;

    // Leave CTRL+<LETTER> combinations to the browser
    if (event.ctrlKey && event.key.match(/^[a-z]$/i)) return;

    switch (event.key.toLowerCase()) {
        case 'arrowleft':
            if (event.ctrlKey) {
                // CTRL+LEFT: Decrease tuning step
                this.moveSelector('#openwebrx-tuning-step-listbox', -1);
            } else if (event.shiftKey) {
                // SHIFT+LEFT: Shift bandpass left
                var demodulators = getDemodulators();
                for (var i = 0; i < demodulators.length; i++) {
                    demodulators[i].moveBandpass(
                        demodulators[i].low_cut - 50,
                        demodulators[i].high_cut - 50
                    );
                }
            } else {
                // LEFT: Tune down
                tuneBySteps(-1);
            }
            break;

        case 'arrowright':
            if (event.ctrlKey) {
                // CTRL+RIGHT: Increase tuning step
                this.moveSelector('#openwebrx-tuning-step-listbox', 1);
            } else if (event.shiftKey) {
                // SHIFT+RIGHT: Shift bandpass right
                var demodulators = getDemodulators();
                for (var i = 0; i < demodulators.length; i++) {
                    demodulators[i].moveBandpass(
                        demodulators[i].low_cut + 50,
                        demodulators[i].high_cut + 50
                    );
                }
            } else {
                // RIGHT: Tune up
                tuneBySteps(1);
            }
            break;

        case 'arrowup':
            // Added ALT+UP for MacOS users who can't use CTRL+UP
            if (event.ctrlKey || event.altKey) {
                // CTRL+UP: Increase volume
                this.moveSlider('#openwebrx-panel-volume', 1);
            } else if (event.shiftKey) {
                // SHIFT+UP: Make bandpass wider
                var demodulators = getDemodulators();
                for (var i = 0; i < demodulators.length; i++) {
                    demodulators[i].moveBandpass(
                        demodulators[i].low_cut - 50,
                        demodulators[i].high_cut + 50
                    );
                }
            } else {
                // UP: Zoom in
                zoomInOneStep();
            }
            break;

        case 'arrowdown':
            // Added ALT+DOWN for MacOS users who can't use CTRL+DOWN
            if (event.ctrlKey || event.altKey) {
                // CTRL+DOWN: Decrease volume
                this.moveSlider('#openwebrx-panel-volume', -1);
            } else if (event.shiftKey) {
                // SHIFT+DOWN: Make bandpass narrower
                var demodulators = getDemodulators();
                for (var i = 0; i < demodulators.length; i++) {
                    demodulators[i].moveBandpass(
                        demodulators[i].low_cut + 50,
                        demodulators[i].high_cut - 50
                    );
                }
            } else {
                // DOWN: Zoom out
                zoomOutOneStep();
            }
            break;

        case 'pagedown':
            // PageDown: Shift central frequency down (if allowed)
            jumpBySteps(-1);
            break;

        case 'pageup':
            // PageUp: Shift central frequency up (if allowed)
            jumpBySteps(1);
            break;

        case '[':
            // [: Tune to a previous signal, by squelch
            tuneBySquelch(-1);
            break;

        case ']':
            // ]: Tune to a next signal, by squelch
            tuneBySquelch(1);
            break;

        case '{':
            // {: Decrease squelch
            this.moveSlider('#openwebrx-panel-receiver .openwebrx-squelch-slider', -1);
            break;

        case '}':
            // }: Increase squelch
            this.moveSlider('#openwebrx-panel-receiver .openwebrx-squelch-slider', 1);
            break;

        case '1': case '2': case '3': case '4': case '5':
        case '6': case '7': case '8': case '9': case '0':
            // [CTRL+]0-9: Select modulation
            var $modes = $('.openwebrx-demodulator-button');
            var n = parseInt(event.key);
            n = n > 0? n - 1 : 9;
            if (event.ctrlKey) n += 10;
            if (n < $modes.length) $modes[n].click();
            break;

        case 'a':
            // A: Set squelch automatically
            $('.openwebrx-squelch-auto').click();
            break;

        case 's':
            // S: Toggle scanner
            UI.toggleScanner();
            break;

        case 'd':
            // D: Turn off squelch
            var $squelchControl = $('#openwebrx-panel-receiver .openwebrx-squelch-slider');
            if (!$squelchControl.prop('disabled')) {
                $squelchControl.val($squelchControl.attr('min')).change();
            }
            break;

        case 'z':
            // Z: Set waterfall colors automatically
            $('#openwebrx-waterfall-colors-auto').click();
            break;

        case 'x':
            // X: Continuously auto-set waterfall colors
            $('#openwebrx-waterfall-colors-auto').triggerHandler('contextmenu');
            break;

        case 'c':
            // C: Set default waterfall colors
            $('#openwebrx-waterfall-colors-default').click();
            break;

        case 'v':
            // V: Toggle spectrum display
            UI.toggleSpectrum();
            break;

        case 'b':
            // B: Toggle bandplan display
            UI.toggleBandplan();
            break;

        case ' ':
            // SPACE: Mute/unmute sound
            UI.toggleMute();
            break;

        case 'n':
            // N: Toggle noise reduction
            UI.toggleNR();
            break;

        case 'r':
            // R: Toggle recorder
            UI.toggleRecording();
            break;

        case '<':
            // SHIFT+<: Decrease waterfall max level
            this.moveSlider('#openwebrx-waterfall-color-max', -1);
            break;

        case ',':
            // <: Decrease waterfall min level
            this.moveSlider('#openwebrx-waterfall-color-min', -1);
            break;

        case '>':
            // SHIFT+>: Increase waterfall max level
            this.moveSlider('#openwebrx-waterfall-color-max', 1);
            break;

        case '.':
            // >: Increase waterfall min level
            this.moveSlider('#openwebrx-waterfall-color-min', 1);
            break;

        case 'f':
            // F: Open file browser
            $('a.button[target="openwebrx-files"]')[0].click();
            break;

        case 'h':
            // H: Open documentation
            $('a.button[target="openwebrx-help"]')[0].click();
            break;

        case 'm':
            // M: Open map
            $('a.button[target="openwebrx-map"]')[0].click();
            break;

        case 'l':
            // L: Toggle log/chat panel
            $('div.button[data-toggle-panel="openwebrx-panel-log"]')[0].click();
            break;

        case 'enter':
            // ENTER: Toggle receiver panel
            $('div.button[data-toggle-panel="openwebrx-panel-receiver"]')[0].click();
            break;

        case '/': case '?':
            // ?: Show keyboard shortcuts help
            Shortcuts.overlay.slideToggle(100);
            break;

        default:
            // Key not handled, pass it on
            return;
    }

    // Key handled, prevent default operation
    event.preventDefault();
};

Shortcuts.keycap = function(key) {
    var keymap = {
        ',': ', <b style="font-size: 0.7rem">comma</b>',
        '.': '. <b style="font-size: 0.7rem">dot</b>',
        ';': '; <b style="font-size: 0.7rem">semicolon</b>',
        '\'': '\' <b style="font-size: 0.7rem">apostrophe</b>',
        'SHIFT': '&#8679; Shift',
        'CONTROL': '&#8963; Ctrl',
        'COMMAND': '&#8984; Cmd',
        'META': '&#8984; Meta',
        'ALT': '&#8997; Alt',
        'OPTION': '&#8997; Opt',
        'ENTER': '&crarr; Enter',
        'RETURN': '&crarr; Enter',
        'DELETE': '&#8998; Del',
        'BACKSPACE': '&#9003; BS',
        'ESCAPE': '&#9099; ESC',
        'ARROWRIGHT': '&rarr;',
        'ARROWLEFT': '&larr;',
        'ARROWUP': '&uarr;',
        'ARROWDOWN': '&darr;',
        'PAGEUP': '&#8670; PgUp',
        'PAGEDOWN': '&#8671; PgDn',
        'HOME': '&#8598; Home',
        'END': '&#8600; End',
        'TAB': '&#8677; Tab',
        'SPACE': '&#9251; Space',
        'INTERVAL': '&#9251; Space',
    };

    var k = keymap[key.toUpperCase()] || key.toUpperCase();

    return `<button class="kbc-button kbc-button-sm" title="${key}"><b>${k}</b></button>`;
};

function Bandplan(el) {
    this.el      = el;
    this.bands   = [];
    this.ctx     = null;
    this.enabled = false;

    // Make sure canvas fills the container
    el.style.width  = '100%';
    el.style.height = '100%';

    // Redraw bandplan once it fully shows up
    var me = this;
    el.parentElement.addEventListener("transitionend", function(ev) {
        me.draw();
    });

    // Colors used for band types
    this.colors = {
        'hamradio' : '#006000',
        'broadcast': '#000080',
        'public'   : '#400040',
        'service'  : '#800000'
    };
};

Bandplan.prototype.getColor = function(type) {
    // Default color is gray
    return type in this.colors? this.colors[type] : '#808080';
};

Bandplan.prototype.update = function(bands) {
    // Sort by low_bound for accurate rendering of overlapping bands
    this.bands = bands.sort(function (a, b) {
        return a.low_bound - b.low_bound;
    });

    // Draw new bands
    this.draw();
};

Bandplan.prototype.draw = function() {
    // Must be enabled to draw
    if (!this.enabled) return;

    var width  = this.el.offsetWidth;
    var height = this.el.offsetHeight;

    // If new dimensions are available...
    if ((height>0) && (width>0)) {
        // If canvas got resized or no context yet...
        if (!this.ctx || width!=this.el.width || height!=this.el.height) {
            this.el.width  = width;
            this.el.height = height;

            this.ctx = this.el.getContext('2d');
            this.ctx.lineWidth = height - 2;
            this.ctx.fillStyle = '#FFFFFF';
            this.ctx.textAlign = 'center';
            this.ctx.font = 'bold 11px sans-serif';
            this.ctx.textBaseline = 'middle';
        }
    }

    // Use whatever dimensions we have at the moment
    width  = this.el.width;
    height = this.el.height;

    // Must have context and dimensions here
    if (!this.ctx || !height || !width) return;

    // Clear canvas to transparency
    this.ctx.clearRect(0, 0, width, height);

    // Do not draw anything if there is nothing to draw
    var range = get_visible_freq_range();
    if (!range || !this.bands.length) return;

    // Center of the ribbon
    var center = (height - 2) / 2;

    //console.log("Drawing range of " + range.start + " - " + range.end);

    this.bands.forEach((x) => {
        if (x.low_bound < range.end && x.high_bound > range.start) {
            var start = Math.max(scale_px_from_freq(x.low_bound, range), 0);
            var end = Math.min(scale_px_from_freq(x.high_bound, range), width);
            var tag = x.tags.length > 0? x.tags[0] : '';

            //console.log("Drawing " + x.name + "(" + tag + ", " + x.low_bound
            //    + ", " + x.high_bound + ") => " + start + " - " + end);

            this.ctx.strokeStyle = this.getColor(tag);

            this.ctx.beginPath();
            this.ctx.moveTo(start, center);
            this.ctx.lineTo(end, center);
            this.ctx.stroke();

            var label = x.name;
            for (var j = 0 ; j >= 0 ; )
            {
                var w = this.ctx.measureText(label).width;
                if (w + height * 2 <= end - start) {
                    this.ctx.fillText(label, (start + end) / 2, center);
                    break;
                }

                j = label.lastIndexOf(' ');
                if (j >= 0) {
                    label = label.substring(0, j);
                }
            }
        }
    });
};

Bandplan.prototype.toggle = function(on) {
    // If no argument given, toggle bandplan
    if (typeof(on) === 'undefined') on = !this.enabled;

    if (on != this.enabled) {
        this.enabled = on;
        if (on) {
            this.el.parentElement.classList.add('expanded');
            // Try drawing right away, since we may know dimensions
            this.draw();
        } else {
            this.el.parentElement.classList.remove('expanded');
        }
    }
};

function Spectrum(el, msec) {
    this.el    = el;
    this.msec  = msec;
    this.ctx   = null;
    this.min   = 0;
    this.max   = 0;
    this.timer = 0;
    this.data  = [];

    // Make sure canvas fills the container
    el.style.width  = '100%';
    el.style.height = '100%';

    // Start with hidden spectrum display
    this.close();
};

Spectrum.prototype.update = function(data) {
    // Do not update if no redraw timer or no canvas
    if (!this.timer || (this.el.clientHeight == 0)) return;

    var i = this.data.length < data.length? this.data.length : data.length;

    // Truncate stored data length, add and fill missing data
    if (this.data.length > i) {
        this.data.length = i;
    } else if(this.data.length < data.length) {
        this.data.length = data.length;
        for(var j=i; j<data.length; ++j) this.data[j] = data[j];
    }

    // Average level over time
    for(var j=0; j<i; ++j) {
        this.data[j] = data[j]>this.data[j]?
            data[j] : this.data[j] + (data[j] - this.data[j]) / 10.0;
    }

//    this.min = Math.min(...data);
//    this.max = Math.max(...data);
    var wf_range = Waterfall.getRange();
    this.min = wf_range.min - 5;
    this.max = wf_range.max + 5;
};

Spectrum.prototype.draw = function() {
    // Do not draw if no redraw timer or no canvas
    if (!this.timer || (this.el.clientHeight == 0)) return;

    var vis_freq    = get_visible_freq_range();
    var vis_center  = vis_freq.center;
    var vis_start   = 0.5 - (center_freq - vis_freq.start) / bandwidth;
    var vis_end     = 0.5 - (center_freq - vis_freq.end) / bandwidth;

    var data_start  = Math.round(fft_size * vis_start);
    var data_end    = Math.round(fft_size * vis_end);
    var data_width  = data_end - data_start;
    var data_height = Math.abs(this.max - this.min);
    var spec_width  = this.el.offsetWidth;
    var spec_height = this.el.offsetHeight;

    // If canvas got resized, or no context yet...
    if (!this.ctx || spec_width!=this.el.width || spec_height!=this.el.height) {
        this.el.width  = spec_width;
        this.el.height = spec_height;
        this.ctx = this.el.getContext("2d");
        this.ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
        this.ctx.strokeStyle = "rgba(255, 255, 0, 1.0)";
        this.ctx.lineWidth = 1;
    }

    // Clear canvas to transparency
    this.ctx.clearRect(0, 0, spec_width, spec_height);

    // Mark currently tuned frequences
//    var demodulators = getDemodulators();
//    for (var i=0; i<demodulators.length; i++) {
//        var f = demodulators[i].get_offset_frequency() + center_freq;
//        var x = scale_px_from_freq(f, range);
//        this.ctx.beginPath();
//        this.ctx.moveTo(x, 0);
//        this.ctx.lineTo(x, spec_height);
//        this.ctx.stroke();
//    }

    // Draw spectrum
    if(spec_width <= data_width) {
        var x_ratio = data_width / spec_width;
        var y_ratio = spec_height / data_height;
        for(var x=0; x<spec_width; x++) {
            var y = (this.data[data_start + ((x * x_ratio) | 0)] - this.min) * y_ratio;
            this.ctx.fillRect(x, spec_height, 1, -y);
        }
    } else {
        var x_ratio = spec_width / data_width;
        var y_ratio = spec_height / data_height;
        var x_pos   = 0;
        for(var x=0; x<data_width; x++) {
            var y = (this.data[data_start + x] - this.min) * y_ratio;
            var k = ((x + 1) * x_ratio) | 0;
            this.ctx.fillRect(x_pos, spec_height, k - x_pos, -y);
            x_pos = k;
        }
    }
};

Spectrum.prototype.close = function() {
    // Hide container
    this.el.parentElement.classList.remove('expanded');

    // Stop redraw timer
    if (this.timer) {
        clearInterval(this.timer);
        this.timer = 0;
    }

    // Clear spectrum data
    this.data = [];
};

Spectrum.prototype.open = function() {
    // Show container
    this.el.parentElement.classList.add('expanded');

    // Start redraw timer
    if (!this.timer) {
        var me = this;
        this.timer = setInterval(function() { me.draw(); }, this.msec);
    }
};

Spectrum.prototype.toggle = function(on) {
    // If no argument given, toggle spectrum
    if (typeof(on) === 'undefined') on = !this.timer;

    // Toggle based on the current redraw timer state
    if (this.timer && !on) {
        this.close();
    } else if (!this.timer && on) {
        this.open();
    }
};

function Scanner(bookmarkBar, msec) {
    this.modes     = ['lsb', 'usb', 'cw', 'am', 'sam', 'nfm'];
    this.bbar      = bookmarkBar;
    this.bookmarks = null;
    this.msec      = msec;
    this.current   = -1;
    this.threshold = -80;
    this.timer     = 0;
}

Scanner.prototype.update = function(data) {
    // Do not update if no timer or no bookmarks
    if (!this.timer || !this.bookmarks || !this.bookmarks.length) return;

    // Average level over time for each bookmark
    for(var j=0 ; j<this.bookmarks.length ; ++j) {
        var b = this.bookmarks[j];
        if (b.frequency > 0) {
            var l = data[Math.round(b.pos * data.length)];
            b.level += (l - b.level) / 3.0;
        }
    }
}

Scanner.prototype.scan = function() {
    // Do not scan if no timer or no bookmarks
    if (!this.timer || !this.bookmarks || !this.bookmarks.length) return;

    // Get current squelch threshold from the slider
    // (why do we need to subtract ~13dB here to make FFT match the S-meter?)
    var $slider = $('#openwebrx-panel-receiver .openwebrx-squelch-slider');
    this.threshold = $slider.val() - 13.0;

    // This is going to be our starting scan location
    var current = 0;

    // If there is currently selected bookmark...
    if (this.current>=0) {
        // Check if its current level still exceeds threshold
        var level = this.bookmarks[this.current].level;
        if (level>this.threshold) return;
        // If current bookmark no longer relevant, scan further
        current = this.current;
        this.current = -1;
    }

    // For every shown bookmark...
    for(var j=0 ; j<this.bookmarks.length ; ++j) {
        var b = this.bookmarks[current];

        //console.log("SCAN: " + b.name + " at " + b.frequency + ": " + b.level);

        // If level exceeds threshold, tune to the bookmark
        if (b.level>this.threshold && UI.tuneBookmark(b)) {
            this.current = current;
            return;
        }

        // Go to the next bookmark
        current = (current + 1) % this.bookmarks.length;
    }
};

Scanner.prototype.stop = function() {
    // If timer running...
    if (this.timer) {
        // Stop redraw timer
        clearInterval(this.timer);
        this.timer = 0;
        // Remove current bookmarks
        this.bookmarks = null;
    }

    // Done
    return !this.timer;
}

Scanner.prototype.start = function() {
    // If timer is not running...
    if (!this.timer) {
        // Nothing found yet
        this.current = -1;
        // Get all scannable bookmarks from the bookmark bar
        this.bookmarks = this.bbar.getAllBookmarks().filter(
          (b) => !!b.scannable && !!b.frequency && !!b.modulation
        );

        // If there are bookmarks to scan...
        if (this.bookmarks && this.bookmarks.length>0) {
            // Precompute FFT offsets, initialize levels
            for(var j=0 ; j<this.bookmarks.length ; ++j) {
                var f = this.bookmarks[j].frequency;
                this.bookmarks[j].level = -1000;
                this.bookmarks[j].pos = f>0? (f - center_freq) / bandwidth + 0.5 : 0;
            }

            // Start redraw timer
            var me = this;
            this.timer = setInterval(function() { me.scan(); }, this.msec);
        }
    }

    // Done
    return !!this.timer;
}

Scanner.prototype.isRunning = function() {
    // Return current state
    return !!this.timer;
};

//
// Data Lookup Tables
//

function Lookup() {}

// Get country flag from a two-letter country code.
Lookup.ccode2flag = function(ccode) {
    if (!ccode || (ccode.length != 2))
        return '';
    else {
        ccode = ccode.toUpperCase();
        return '&#' + (0x1F1E6 + ccode.charCodeAt(0) - 0x41)
            + ';&#' + (0x1F1E6 + ccode.charCodeAt(1) - 0x41)
            + ';';
    }
};

// Get country flag + name from a ccode/cname tuple.
Lookup.cdata2country = function(cdata) {
    if (!cdata || (cdata.length != 2))
        return '';
    else {
        var flag = this.ccode2flag(cdata[0]);
        var name = cdata[1]? cdata[1] : '';
        return !flag? name : !name? flag : flag + '&nbsp;' + name;
    }
};

//
// HAM Callsigns
//

// Get country code and name from a HAM callsign.
Lookup.call2cdata = function(callsign) {
    for (var j=4 ; j>0 ; j--) {
        var pfx = callsign.substring(0, j);
        if (pfx in this.CALL2COUNTRY) return this.CALL2COUNTRY[pfx];
    }
    return null;
};

// Get country code from a HAM callsign.
Lookup.call2ccode = function(callsign) {
    var cdata = this.call2cdata(callsign);
    return cdata && cdata[0]? cdata[0] : '';
};

// Get country name from a HAM callsign.
Lookup.call2cname = function(callsign) {
    var cdata = this.call2cdata(callsign);
    return cdata && cdata[1]? cdata[1] : '';
};

// Get country flag + name from a HAM callsign.
Lookup.call2country = function(callsign) {
    return this.cdata2country(this.call2cdata(callsign));
};

//
// MMSI Numbers
//

// Check if a MMSI corresponds to a ground station.
Lookup.mmsiIsGround = function(mmsi) {
    return mmsi && mmsi.substring(0, 2) === '00';
};

// Get MID part from an AIS MMSI.
Lookup.mmsi2mid = function(mmsi) {
    return mmsi? mmsi.substring(0, 3) : '';
};

// Get country code and name from an AIS MMSI.
Lookup.mmsi2cdata = function(mmsi) {
    var mid = this.mmsi2mid(mmsi);
    return mid in this.MID2COUNTRY? this.MID2COUNTRY[mid] : null;
};

// Get country code from an MMSI number.
Lookup.mmsi2ccode = function(mmsi) {
    var cdata = this.mmsi2cdata(mmsi);
    return cdata && cdata[0]? cdata[0] : '';
};

// Get country name from an MMSI number.
Lookup.mmsi2cname = function(mmsi) {
    var cdata = this.mmsi2cdata(mmsi);
    return cdata && cdata[1]? cdata[1] : '';
};

// Get country flag + name from an MMSI number.
Lookup.mmsi2country = function(mmsi) {
    return this.cdata2country(this.mmsi2cdata(mmsi));
};

//
// HAM callsign prefix to country name conversion
//

Lookup.CALL2COUNTRY = {
    "0S"  : [null, "Principality of Seborga"],
    "1A"  : [null, "Sovereign Military Order of Malta"],
    "1B"  : [null, "Northern Cyprus or Blenheim Reef"],
    "1G"  : [null, "Geyser Reef"],
    "1L"  : [null, "Liberland"],
    "1M"  : [null, "Minerva Reefs"],
    "1S"  : [null, "Principality of Sealand"],
    "1Z"  : [null, "Kayin State"],
    "2"   : ["GB", "United Kingdom"],
    "3A"  : ["MC", "Monaco"],
    "3B"  : ["MU", "Mauritius"],
    "3C"  : ["GQ", "Equatorial Guinea"],
    "3DA" : ["SZ", "Swaziland"],
    "3DB" : ["SZ", "Swaziland"],
    "3DC" : ["SZ", "Swaziland"],
    "3DD" : ["SZ", "Swaziland"],
    "3DE" : ["SZ", "Swaziland"],
    "3DF" : ["SZ", "Swaziland"],
    "3DG" : ["SZ", "Swaziland"],
    "3DH" : ["SZ", "Swaziland"],
    "3DI" : ["SZ", "Swaziland"],
    "3DJ" : ["SZ", "Swaziland"],
    "3DK" : ["SZ", "Swaziland"],
    "3DL" : ["SZ", "Swaziland"],
    "3DM" : ["SZ", "Swaziland"],
    "3DN" : ["FJ", "Fiji"],
    "3DO" : ["FJ", "Fiji"],
    "3DP" : ["FJ", "Fiji"],
    "3DQ" : ["FJ", "Fiji"],
    "3DR" : ["FJ", "Fiji"],
    "3DS" : ["FJ", "Fiji"],
    "3DT" : ["FJ", "Fiji"],
    "3DU" : ["FJ", "Fiji"],
    "3DV" : ["FJ", "Fiji"],
    "3DW" : ["FJ", "Fiji"],
    "3DX" : ["FJ", "Fiji"],
    "3DY" : ["FJ", "Fiji"],
    "3DZ" : ["FJ", "Fiji"],
    "3E"  : ["PA", "Panama"],
    "3F"  : ["PA", "Panama"],
    "3G"  : ["CL", "Chile"],
    "3H"  : ["CN", "China"],
    "3I"  : ["CN", "China"],
    "3J"  : ["CN", "China"],
    "3K"  : ["CN", "China"],
    "3L"  : ["CN", "China"],
    "3M"  : ["CN", "China"],
    "3N"  : ["CN", "China"],
    "3O"  : ["CN", "China"],
    "3P"  : ["CN", "China"],
    "3Q"  : ["CN", "China"],
    "3R"  : ["CN", "China"],
    "3S"  : ["CN", "China"],
    "3T"  : ["CN", "China"],
    "3U"  : ["CN", "China"],
    "3V"  : ["TN", "Tunisia"],
    "3W"  : ["VN", "Vietnam"],
    "3X"  : ["GN", "Guinea"],
    "3Y"  : ["NO", "Norway"],
    "3Z"  : ["PL", "Poland"],
    "4A"  : ["MX", "Mexico"],
    "4B"  : ["MX", "Mexico"],
    "4C"  : ["MX", "Mexico"],
    "4D"  : ["PH", "Philippines"],
    "4E"  : ["PH", "Philippines"],
    "4F"  : ["PH", "Philippines"],
    "4G"  : ["PH", "Philippines"],
    "4H"  : ["PH", "Philippines"],
    "4I"  : ["PH", "Philippines"],
    "4J"  : ["AZ", "Azerbaijan"],
    "4K"  : ["AZ", "Azerbaijan"],
    "4L"  : ["GE", "Georgia"],
    "4M"  : ["VE", "Venezuela"],
    "4O"  : ["ME", "Montenegro"],
    "4P"  : ["LK", "Sri Lanka"],
    "4Q"  : ["LK", "Sri Lanka"],
    "4R"  : ["LK", "Sri Lanka"],
    "4S"  : ["LK", "Sri Lanka"],
    "4T"  : ["PE", "Peru"],
    "4U"  : [null, "United Nations"],
    "4V"  : ["HT", "Haiti"],
    "4W"  : ["TL", "East Timor"],
    "4X"  : ["IL", "Israel"],
    "4Y"  : [null, "International Civil Aviation Organization"],
    "4Z"  : ["IL", "Israel"],
    "5A"  : ["LY", "Libya"],
    "5B"  : ["CY", "Cyprus"],
    "5C"  : ["MA", "Morocco"],
    "5D"  : ["MA", "Morocco"],
    "5E"  : ["MA", "Morocco"],
    "5F"  : ["MA", "Morocco"],
    "5G"  : ["MA", "Morocco"],
    "5H"  : ["TZ", "Tanzania"],
    "5I"  : ["TZ", "Tanzania"],
    "5J"  : ["CO", "Colombia"],
    "5K"  : ["CO", "Colombia"],
    "5L"  : ["LR", "Liberia"],
    "5M"  : ["LR", "Liberia"],
    "5N"  : ["NG", "Nigeria"],
    "5O"  : ["NG", "Nigeria"],
    "5P"  : ["DK", "Denmark"],
    "5Q"  : ["DK", "Denmark"],
    "5R"  : ["MG", "Madagascar"],
    "5S"  : ["MG", "Madagascar"],
    "5T"  : ["MR", "Mauritania"],
    "5U"  : ["NE", "Niger"],
    "5V"  : ["TG", "Togo"],
    "5W"  : ["WS", "Western Samoa"],
    "5X"  : ["UG", "Uganda"],
    "5Y"  : ["KE", "Kenya"],
    "5Z"  : ["KE", "Kenya"],
    "6A"  : ["EG", "Egypt"],
    "6B"  : ["EG", "Egypt"],
    "6C"  : ["SY", "Syria"],
    "6D"  : ["MX", "Mexico"],
    "6E"  : ["MX", "Mexico"],
    "6F"  : ["MX", "Mexico"],
    "6G"  : ["MX", "Mexico"],
    "6H"  : ["MX", "Mexico"],
    "6I"  : ["MX", "Mexico"],
    "6J"  : ["MX", "Mexico"],
    "6K"  : ["HK", "South Korea"],
    "6L"  : ["HK", "South Korea"],
    "6M"  : ["HK", "South Korea"],
    "6N"  : ["HK", "South Korea"],
    "6O"  : ["SO", "Somalia"],
    "6P"  : ["PK", "Pakistan"],
    "6Q"  : ["PK", "Pakistan"],
    "6R"  : ["PK", "Pakistan"],
    "6S"  : ["PK", "Pakistan"],
    "6T"  : ["SD", "Sudan"],
    "6U"  : ["SD", "Sudan"],
    "6V"  : ["SN", "Senegal"],
    "6W"  : ["SN", "Senegal"],
    "6X"  : ["MG", "Madagascar"],
    "6Y"  : ["JM", "Jamaica"],
    "6Z"  : ["LR", "Liberia"],
    "7A"  : ["ID", "Indonesia"],
    "7B"  : ["ID", "Indonesia"],
    "7C"  : ["ID", "Indonesia"],
    "7D"  : ["ID", "Indonesia"],
    "7E"  : ["ID", "Indonesia"],
    "7F"  : ["ID", "Indonesia"],
    "7G"  : ["ID", "Indonesia"],
    "7H"  : ["ID", "Indonesia"],
    "7I"  : ["ID", "Indonesia"],
    "7J"  : ["JP", "Japan"],
    "7K"  : ["JP", "Japan"],
    "7L"  : ["JP", "Japan"],
    "7M"  : ["JP", "Japan"],
    "7N"  : ["JP", "Japan"],
    "7O"  : ["YE", "Yemen"],
    "7P"  : ["LS", "Lesotho"],
    "7Q"  : ["MW", "Malawi"],
    "7R"  : ["DZ", "Algeria"],
    "7S"  : ["SE", "Sweden"],
    "7T"  : ["DZ", "Algeria"],
    "7U"  : ["DZ", "Algeria"],
    "7V"  : ["DZ", "Algeria"],
    "7W"  : ["DZ", "Algeria"],
    "7X"  : ["DZ", "Algeria"],
    "7Y"  : ["DZ", "Algeria"],
    "7Z"  : ["SA", "Saudi Arabia"],
    "8A"  : ["ID", "Indonesia"],
    "8B"  : ["ID", "Indonesia"],
    "8C"  : ["ID", "Indonesia"],
    "8D"  : ["ID", "Indonesia"],
    "8E"  : ["ID", "Indonesia"],
    "8F"  : ["ID", "Indonesia"],
    "8G"  : ["ID", "Indonesia"],
    "8H"  : ["ID", "Indonesia"],
    "8I"  : ["ID", "Indonesia"],
    "8J"  : ["JP", "Japan"],
    "8K"  : ["JP", "Japan"],
    "8L"  : ["JP", "Japan"],
    "8M"  : ["JP", "Japan"],
    "8N"  : ["JP", "Japan"],
    "8O"  : ["BW", "Botswana"],
    "8P"  : ["BB", "Barbados"],
    "8Q"  : ["MV", "Maldives"],
    "8R"  : ["GY", "Guyana"],
    "8S"  : ["SE", "Sweden"],
    "8T"  : ["IN", "India"],
    "8U"  : ["IN", "India"],
    "8V"  : ["IN", "India"],
    "8W"  : ["IN", "India"],
    "8X"  : ["IN", "India"],
    "8Y"  : ["IN", "India"],
    "8Z"  : ["SA", "Saudi Arabia"],
    "9A"  : ["HR", "Croatia"],
    "9B"  : ["IR", "Iran"],
    "9C"  : ["IR", "Iran"],
    "9D"  : ["IR", "Iran"],
    "9E"  : ["ET", "Ethiopia"],
    "9F"  : ["ET", "Ethiopia"],
    "9G"  : ["GH", "Ghana"],
    "9H"  : ["MT", "Malta"],
    "9I"  : ["ZM", "Zambia"],
    "9J"  : ["ZM", "Zambia"],
    "9K"  : ["KW", "Kuwait"],
    "9L"  : ["SL", "Sierra Leone"],
    "9M0" : ["MY", "Spratly Islands"],
    "9M"  : ["MY", "Malaysia"],
    "9N"  : ["NP", "Nepal"],
    "9O"  : ["CD", "Democratic Republic of Congo"],
    "9P"  : ["CD", "Democratic Republic of Congo"],
    "9Q"  : ["CD", "Democratic Republic of Congo"],
    "9R"  : ["CD", "Democratic Republic of Congo"],
    "9S"  : ["CD", "Democratic Republic of Congo"],
    "9T"  : ["CD", "Democratic Republic of Congo"],
    "9U"  : ["BI", "Burundi"],
    "9V"  : ["SG", "Singapore"],
    "9W"  : ["MY", "Malaysia"],
    "9X"  : ["RW", "Rwanda"],
    "9Y"  : ["TT", "Trinidad and Tobago"],
    "9Z"  : ["TT", "Trinidad and Tobago"],
    "A2"  : ["BW", "Botswana"],
    "A3"  : ["TO", "Tonga"],
    "A4"  : ["OM", "Oman"],
    "A5"  : ["BT", "Bhutan"],
    "A6"  : ["AE", "United Arab Emirates"],
    "A7"  : ["QA", "Qatar"],
    "A8"  : ["LR", "Liberia"],
    "A9"  : ["BH", "Bahrain"],
    "AA"  : ["US", "United States"],
    "AB"  : ["US", "United States"],
    "AC"  : ["US", "United States"],
    "AD"  : ["US", "United States"],
    "AE"  : ["US", "United States"],
    "AF"  : ["US", "United States"],
    "AG"  : ["US", "United States"],
    "AH"  : ["US", "United States"],
    "AI"  : ["US", "United States"],
    "AJ"  : ["US", "United States"],
    "AK"  : ["US", "United States"],
    "AL"  : ["US", "United States"],
    "AM"  : ["ES", "Spain"],
    "AN"  : ["ES", "Spain"],
    "AO"  : ["ES", "Spain"],
    "AP"  : ["PK", "Pakistan"],
    "AQ"  : ["PK", "Pakistan"],
    "AR"  : ["PK", "Pakistan"],
    "AS"  : ["PK", "Pakistan"],
    "AT"  : ["IN", "India"],
    "AU"  : ["IN", "India"],
    "AV"  : ["IN", "India"],
    "AW"  : ["IN", "India"],
    "AX"  : ["AU", "Australia"],
    "AY"  : ["AR", "Argentina"],
    "AZ"  : ["AR", "Argentina"],
    "BM"  : ["TW", "Taiwan"],
    "BN"  : ["TW", "Taiwan"],
    "BO"  : ["TW", "Taiwan"],
    "BP"  : ["TW", "Taiwan"],
    "BQ"  : ["TW", "Taiwan"],
    "BU"  : ["TW", "Taiwan"],
    "BV9" : ["TW", "Spratly Islands"],
    "BV"  : ["TW", "Taiwan"],
    "BW"  : ["TW", "Taiwan"],
    "BX"  : ["TW", "Taiwan"],
    "B"   : ["CN", "China"],
    "C2"  : ["NR", "Nauru"],
    "C3"  : ["AD", "Andorra"],
    "C4"  : ["CY", "Cyprus"],
    "C5"  : ["GM", "Gambia"],
    "C6"  : ["BS", "Bahamas"],
    "C7"  : [null, "World Meteorological Organization"],
    "C8"  : ["MZ", "Mozambique"],
    "C9"  : ["MZ", "Mozambique"],
    "CA"  : ["CL", "Chile"],
    "CB"  : ["CL", "Chile"],
    "CC"  : ["CL", "Chile"],
    "CD"  : ["CL", "Chile"],
    "CE"  : ["CL", "Chile"],
    "CF"  : ["CA", "Canada"],
    "CG"  : ["CA", "Canada"],
    "CH"  : ["CA", "Canada"],
    "CI"  : ["CA", "Canada"],
    "CJ"  : ["CA", "Canada"],
    "CK"  : ["CA", "Canada"],
    "CL"  : ["CU", "Cuba"],
    "CM"  : ["CU", "Cuba"],
    "CN"  : ["MA", "Morocco"],
    "CO"  : ["CU", "Cuba"],
    "CP"  : ["BO", "Bolivia"],
    "CQ"  : ["PT", "Portugal"],
    "CR"  : ["PT", "Portugal"],
    "CS"  : ["PT", "Portugal"],
    "CT"  : ["PT", "Portugal"],
    "CU"  : ["PT", "Portugal"],
    "CV"  : ["UY", "Uruguay"],
    "CW"  : ["UY", "Uruguay"],
    "CX"  : ["UY", "Uruguay"],
    "CY"  : ["CA", "Canada"],
    "CZ"  : ["CA", "Canada"],
    "D0"  : ["UA", "Donetsk"],
    "D1"  : ["UA", "Donetsk"],
    "D2"  : ["AO", "Angola"],
    "D3"  : ["AO", "Angola"],
    "D4"  : ["CV", "Cape Verde"],
    "D5"  : ["LR", "Liberia"],
    "D6"  : ["KM", "Comoros"],
    "D7"  : ["HK", "South Korea"],
    "D8"  : ["HK", "South Korea"],
    "D9"  : ["HK", "South Korea"],
    "DA"  : ["DE", "Germany"],
    "DB"  : ["DE", "Germany"],
    "DC"  : ["DE", "Germany"],
    "DD"  : ["DE", "Germany"],
    "DE"  : ["DE", "Germany"],
    "DF"  : ["DE", "Germany"],
    "DG"  : ["DE", "Germany"],
    "DH"  : ["DE", "Germany"],
    "DI"  : ["DE", "Germany"],
    "DJ"  : ["DE", "Germany"],
    "DK"  : ["DE", "Germany"],
    "DL"  : ["DE", "Germany"],
    "DM"  : ["DE", "Germany"],
    "DN"  : ["DE", "Germany"],
    "DO"  : ["DE", "Germany"],
    "DP"  : ["DE", "Germany"],
    "DQ"  : ["DE", "Germany"],
    "DR"  : ["DE", "Germany"],
    "DS"  : ["HK", "South Korea"],
    "DT"  : ["HK", "South Korea"],
    "DU"  : ["PH", "Philippines"],
    "DV"  : ["PH", "Philippines"],
    "DW"  : ["PH", "Philippines"],
    "DX0" : ["PH", "Spratly Islands"],
    "DX"  : ["PH", "Philippines"],
    "DY"  : ["PH", "Philippines"],
    "DZ"  : ["PH", "Philippines"],
    "E2"  : ["TH", "Thailand"],
    "E3"  : ["ER", "Eritrea"],
    "E4"  : ["PS", "Palestine"],
    "E5"  : ["CK", "Cook Islands"],
    "E6"  : ["NU", "Niue"],
    "E7"  : ["BA", "Bosnia and Herzegovina"],
    "EA"  : ["ES", "Spain"],
    "EB"  : ["ES", "Spain"],
    "EC"  : ["ES", "Spain"],
    "ED"  : ["ES", "Spain"],
    "EE"  : ["ES", "Spain"],
    "EF"  : ["ES", "Spain"],
    "EG"  : ["ES", "Spain"],
    "EH"  : ["ES", "Spain"],
    "EI"  : ["IE", "Ireland"],
    "EJ"  : ["IE", "Ireland"],
    "EK"  : ["AM", "Armenia"],
    "EL"  : ["LR", "Liberia"],
    "EM"  : ["UA", "Ukraine"],
    "EN"  : ["UA", "Ukraine"],
    "EO"  : ["UA", "Ukraine"],
    "EP"  : ["IR", "Iran"],
    "EQ"  : ["IR", "Iran"],
    "ER"  : ["MD", "Moldova"],
    "ES"  : ["EE", "Estonia"],
    "ET"  : ["ET", "Ethiopia"],
    "EU"  : ["BY", "Belarus"],
    "EV"  : ["BY", "Belarus"],
    "EW"  : ["BY", "Belarus"],
    "EX"  : ["KG", "Kyrgyzstan"],
    "EY"  : ["TJ", "Tajikistan"],
    "EZ"  : ["TM", "Turkmenistan"],
    "F"   : ["FR", "France"],
    "G"   : ["GB", "United Kingdom"],
    "H2"  : ["CY", "Cyprus"],
    "H3"  : ["PA", "Panama"],
    "H4"  : ["SB", "Solomon Islands"],
    "H5"  : [null, "Bophuthatswana"],
    "H6"  : ["NI", "Nicaragua"],
    "H7"  : ["NI", "Nicaragua"],
    "H8"  : ["PA", "Panama"],
    "H9"  : ["PA", "Panama"],
    "HA"  : ["HU", "Hungary"],
    "HB3Y" : ["LI", "Liechtenstein"],
    "HB0" : ["LI", "Liechtenstein"],
    "HBL" : ["LI", "Liechtenstein"],
    "HB"  : ["CH", "Switzerland"],
    "HC"  : ["EC", "Ecuador"],
    "HD"  : ["EC", "Ecuador"],
    "HE"  : ["CH", "Switzerland"],
    "HF"  : ["PL", "Poland"],
    "HG"  : ["HU", "Hungary"],
    "HH"  : ["HT", "Haiti"],
    "HI"  : ["DO", "Dominican Republic"],
    "HJ"  : ["CO", "Colombia"],
    "HK"  : ["CO", "Colombia"],
    "HL"  : ["HK", "South Korea"],
    "HM"  : ["KP", "North Korea"],
    "HN"  : ["IQ", "Iraq"],
    "HO"  : ["PA", "Panama"],
    "HP"  : ["PA", "Panama"],
    "HQ"  : ["HN", "Honduras"],
    "HR"  : ["HN", "Honduras"],
    "HS"  : ["TH", "Thailand"],
    "HT"  : ["NI", "Nicaragua"],
    "HU"  : ["SV", "El Salvador"],
    "HV"  : ["VA", "Vatican"],
    "HW"  : ["FR", "France"],
    "HX"  : ["FR", "France"],
    "HY"  : ["FR", "France"],
    "HZ"  : ["SA", "Saudi Arabia"],
    "I"   : ["IT", "Italy"],
    "J2"  : ["DJ", "Djibouti"],
    "J3"  : ["GD", "Grenada"],
    "J4"  : ["GR", "Greece"],
    "J5"  : ["GW", "Guinea-Bissau"],
    "J6"  : ["LC", "Saint Lucia"],
    "J7"  : ["DM", "Dominica"],
    "J8"  : ["VC", "Saint Vincent and Grenadines"],
    "JA"  : ["JP", "Japan"],
    "JB"  : ["JP", "Japan"],
    "JC"  : ["JP", "Japan"],
    "JD"  : ["JP", "Japan"],
    "JE"  : ["JP", "Japan"],
    "JF"  : ["JP", "Japan"],
    "JG"  : ["JP", "Japan"],
    "JH"  : ["JP", "Japan"],
    "JI"  : ["JP", "Japan"],
    "JJ"  : ["JP", "Japan"],
    "JK"  : ["JP", "Japan"],
    "JL"  : ["JP", "Japan"],
    "JM"  : ["JP", "Japan"],
    "JN"  : ["JP", "Japan"],
    "JO"  : ["JP", "Japan"],
    "JP"  : ["JP", "Japan"],
    "JQ"  : ["JP", "Japan"],
    "JR"  : ["JP", "Japan"],
    "JS"  : ["JP", "Japan"],
    "JT"  : ["MN", "Mongolia"],
    "JU"  : ["MN", "Mongolia"],
    "JV"  : ["MN", "Mongolia"],
    "JW"  : ["NO", "Norway"],
    "JX"  : ["NO", "Norway"],
    "JY"  : ["JO", "Jordan"],
    "JZ"  : ["ID", "Indonesia"],
    "K"   : ["US", "United States"],
    "L2"  : ["AR", "Argentina"],
    "L3"  : ["AR", "Argentina"],
    "L4"  : ["AR", "Argentina"],
    "L5"  : ["AR", "Argentina"],
    "L6"  : ["AR", "Argentina"],
    "L7"  : ["AR", "Argentina"],
    "L8"  : ["AR", "Argentina"],
    "L9"  : ["AR", "Argentina"],
    "LA"  : ["NO", "Norway"],
    "LB"  : ["NO", "Norway"],
    "LC"  : ["NO", "Norway"],
    "LD"  : ["NO", "Norway"],
    "LE"  : ["NO", "Norway"],
    "LF"  : ["NO", "Norway"],
    "LG"  : ["NO", "Norway"],
    "LH"  : ["NO", "Norway"],
    "LI"  : ["NO", "Norway"],
    "LJ"  : ["NO", "Norway"],
    "LK"  : ["NO", "Norway"],
    "LL"  : ["NO", "Norway"],
    "LM"  : ["NO", "Norway"],
    "LN"  : ["NO", "Norway"],
    "LO"  : ["AR", "Argentina"],
    "LP"  : ["AR", "Argentina"],
    "LQ"  : ["AR", "Argentina"],
    "LR"  : ["AR", "Argentina"],
    "LS"  : ["AR", "Argentina"],
    "LT"  : ["AR", "Argentina"],
    "LU"  : ["AR", "Argentina"],
    "LV"  : ["AR", "Argentina"],
    "LW"  : ["AR", "Argentina"],
    "LX"  : ["LU", "Luxembourg"],
    "LY"  : ["LT", "Lithuania"],
    "LZ"  : ["BG", "Bulgaria"],
    "M"   : ["GB", "United Kingdom"],
    "N"   : ["US", "United States"],
    "O1"  : ["GE", "South Ossetia"],
    "OA"  : ["PE", "Peru"],
    "OB"  : ["PE", "Peru"],
    "OC"  : ["PE", "Peru"],
    "OD"  : ["LB", "Lebanon"],
    "OE"  : ["AT", "Austria"],
    "OF"  : ["FI", "Finland"],
    "OG"  : ["FI", "Finland"],
    "OH"  : ["FI", "Finland"],
    "OI"  : ["FI", "Finland"],
    "OJ"  : ["FI", "Finland"],
    "OK"  : ["CZ", "Czech Republic"],
    "OL"  : ["CZ", "Czech Republic"],
    "OM"  : ["SK", "Slovakia"],
    "ON"  : ["BE", "Belgium"],
    "OO"  : ["BE", "Belgium"],
    "OP"  : ["BE", "Belgium"],
    "OQ"  : ["BE", "Belgium"],
    "OR"  : ["BE", "Belgium"],
    "OS"  : ["BE", "Belgium"],
    "OT"  : ["BE", "Belgium"],
    "OU"  : ["DK", "Denmark"],
    "OV"  : ["DK", "Denmark"],
    "OW"  : ["DK", "Denmark"],
    "OX"  : ["DK", "Denmark"],
    "OY"  : ["DK", "Denmark"],
    "OZ"  : ["DK", "Denmark"],
    "P2"  : ["PG", "Papua New Guinea"],
    "P3"  : ["CY", "Cyprus"],
    "P4"  : ["AW", "Aruba"],
    "P5"  : ["KP", "North Korea"],
    "P6"  : ["KP", "North Korea"],
    "P7"  : ["KP", "North Korea"],
    "P8"  : ["KP", "North Korea"],
    "P9"  : ["KP", "North Korea"],
    "PA"  : ["NL", "Netherlands"],
    "PB"  : ["NL", "Netherlands"],
    "PC"  : ["NL", "Netherlands"],
    "PD"  : ["NL", "Netherlands"],
    "PE"  : ["NL", "Netherlands"],
    "PF"  : ["NL", "Netherlands"],
    "PG"  : ["NL", "Netherlands"],
    "PH"  : ["NL", "Netherlands"],
    "PI"  : ["NL", "Netherlands"],
    "PJ"  : ["AN", "Antilles (Netherlands)"],
    "PK"  : ["ID", "Indonesia"],
    "PL"  : ["ID", "Indonesia"],
    "PM"  : ["ID", "Indonesia"],
    "PN"  : ["ID", "Indonesia"],
    "PO"  : ["ID", "Indonesia"],
    "PP"  : ["BR", "Brazil"],
    "PQ"  : ["BR", "Brazil"],
    "PR"  : ["BR", "Brazil"],
    "PS"  : ["BR", "Brazil"],
    "PT"  : ["BR", "Brazil"],
    "PU"  : ["BR", "Brazil"],
    "PV"  : ["BR", "Brazil"],
    "PW"  : ["BR", "Brazil"],
    "PX"  : ["BR", "Brazil"],
    "PY"  : ["BR", "Brazil"],
    "PZ"  : ["SR", "Suriname"],
    "RA6" : ["RU", "Chechnya"],
    "R"   : ["RU", "Russia"],
    "S0"  : ["EH", "Western Sahara"],
    "S2"  : ["BD", "Bangladesh"],
    "S3"  : ["BD", "Bangladesh"],
    "S5"  : ["SI", "Slovenia"],
    "S6"  : ["SG", "Singapore"],
    "S7"  : ["SC", "Seychelles"],
    "S8"  : ["ZA", "South Africa"],
    "S9"  : ["ST", "Sao Tome and Principe"],
    "SA"  : ["SE", "Sweden"],
    "SB"  : ["SE", "Sweden"],
    "SC"  : ["SE", "Sweden"],
    "SD"  : ["SE", "Sweden"],
    "SE"  : ["SE", "Sweden"],
    "SF"  : ["SE", "Sweden"],
    "SG"  : ["SE", "Sweden"],
    "SH"  : ["SE", "Sweden"],
    "SI"  : ["SE", "Sweden"],
    "SJ"  : ["SE", "Sweden"],
    "SK"  : ["SE", "Sweden"],
    "SL"  : ["SE", "Sweden"],
    "SM"  : ["SE", "Sweden"],
    "SN"  : ["PL", "Poland"],
    "SO"  : ["PL", "Poland"],
    "SP"  : ["PL", "Poland"],
    "SQ"  : ["PL", "Poland"],
    "SR"  : ["PL", "Poland"],
    "SSA" : ["EG", "Egypt"],
    "SSB" : ["EG", "Egypt"],
    "SSC" : ["EG", "Egypt"],
    "SSD" : ["EG", "Egypt"],
    "SSE" : ["EG", "Egypt"],
    "SSF" : ["EG", "Egypt"],
    "SSG" : ["EG", "Egypt"],
    "SSH" : ["EG", "Egypt"],
    "SSI" : ["EG", "Egypt"],
    "SSJ" : ["EG", "Egypt"],
    "SSK" : ["EG", "Egypt"],
    "SSL" : ["EG", "Egypt"],
    "SSM" : ["EG", "Egypt"],
    "SS"  : ["SD", "Sudan"],
    "ST"  : ["SD", "Sudan"],
    "SU"  : ["EG", "Egypt"],
    "SV"  : ["GR", "Greece"],
    "SW"  : ["GR", "Greece"],
    "SX"  : ["GR", "Greece"],
    "SY"  : ["GR", "Greece"],
    "SZ"  : ["GR", "Greece"],
    "T0"  : [null, "Principality of Seborga"],
    "T1"  : ["MD", "Transnistria"],
    "T2"  : ["TV", "Tuvalu"],
    "T3"  : ["KI", "Kiribati"],
    "T4"  : ["CU", "Cuba"],
    "T5"  : ["SO", "Somalia"],
    "T6"  : ["AF", "Afghanistan"],
    "T7"  : ["SM", "San Marino"],
    "T8"  : ["PW", "Palau"],
    "TA"  : ["TR", "Turkey"],
    "TB"  : ["TR", "Turkey"],
    "TC"  : ["TR", "Turkey"],
    "TD"  : ["GT", "Guatemala"],
    "TE"  : ["CR", "Costa Rica"],
    "TF"  : ["IS", "Iceland"],
    "TG"  : ["GT", "Guatemala"],
    "TH"  : ["FR", "France"],
    "TI"  : ["CR", "Costa Rica"],
    "TJ"  : ["CM", "Cameroon"],
    "TK"  : ["FR", "France"],
    "TL"  : ["CF", "Central African Republic"],
    "TM"  : ["FR", "France"],
    "TN"  : ["CG", "Republic of Congo"],
    "TO"  : ["FR", "France"],
    "TP"  : ["FR", "France"],
    "TQ"  : ["FR", "France"],
    "TR"  : ["GA", "Gabon"],
    "TS"  : ["TN", "Tunisia"],
    "TT"  : ["TD", "Chad"],
    "TU"  : ["CI", "Ivory Coast"],
    "TV"  : ["FR", "France"],
    "TW"  : ["FR", "France"],
    "TX"  : ["FR", "France"],
    "TY"  : ["BJ", "Benin"],
    "TZ"  : ["ML", "Mali"],
    "UA"  : ["RU", "Russia"],
    "UB"  : ["RU", "Russia"],
    "UC"  : ["RU", "Russia"],
    "UD"  : ["RU", "Russia"],
    "UE"  : ["RU", "Russia"],
    "UF"  : ["RU", "Russia"],
    "UG"  : ["RU", "Russia"],
    "UH"  : ["RU", "Russia"],
    "UI"  : ["RU", "Russia"],
    "UJ"  : ["UZ", "Uzbekistan"],
    "UK"  : ["UZ", "Uzbekistan"],
    "UL"  : ["UZ", "Uzbekistan"],
    "UM"  : ["UZ", "Uzbekistan"],
    "UN"  : ["KZ", "Kazakhstan"],
    "UO"  : ["KZ", "Kazakhstan"],
    "UP"  : ["KZ", "Kazakhstan"],
    "UQ"  : ["KZ", "Kazakhstan"],
    "UR"  : ["UA", "Ukraine"],
    "US"  : ["UA", "Ukraine"],
    "UT"  : ["UA", "Ukraine"],
    "UU"  : ["UA", "Ukraine"],
    "UV"  : ["UA", "Ukraine"],
    "UW"  : ["UA", "Ukraine"],
    "UX"  : ["UA", "Ukraine"],
    "UY"  : ["UA", "Ukraine"],
    "UZ"  : ["UA", "Ukraine"],
    "V2"  : ["AG", "Antigua and Barbuda"],
    "V3"  : ["BZ", "Belize"],
    "V4"  : ["KN", "Saint Kitts and Nevis"],
    "V5"  : ["NA", "Namibia"],
    "V6"  : ["FM", "Micronesia"],
    "V7"  : ["MH", "Marshall Islands"],
    "V8"  : ["BN", "Brunei"],
    "VA"  : ["CA", "Canada"],
    "VB"  : ["CA", "Canada"],
    "VC"  : ["CA", "Canada"],
    "VD"  : ["CA", "Canada"],
    "VE"  : ["CA", "Canada"],
    "VF"  : ["CA", "Canada"],
    "VG"  : ["CA", "Canada"],
    "VH"  : ["AU", "Australia"],
    "VI"  : ["AU", "Australia"],
    "VJ"  : ["AU", "Australia"],
    "VK"  : ["AU", "Australia"],
    "VL"  : ["AU", "Australia"],
    "VM"  : ["AU", "Australia"],
    "VN"  : ["AU", "Australia"],
    "VO"  : ["CA", "Newfoundland (Canada)"],
    "VP"  : ["GB", "United Kingdom"],
    "VQ"  : ["GB", "United Kingdom"],
    "VR"  : ["HK", "Hong Kong"],
    "VS"  : ["GB", "United Kingdom"],
    "VT"  : ["IN", "India"],
    "VU"  : ["IN", "India"],
    "VV"  : ["IN", "India"],
    "VW"  : ["IN", "India"],
    "VX"  : ["CA", "Canada"],
    "VY"  : ["CA", "Canada"],
    "VZ"  : ["AU", "Australia"],
    "W"   : ["US", "United States"],
    "XA"  : ["MX", "Mexico"],
    "XB"  : ["MX", "Mexico"],
    "XC"  : ["MX", "Mexico"],
    "XD"  : ["MX", "Mexico"],
    "XE"  : ["MX", "Mexico"],
    "XF"  : ["MX", "Mexico"],
    "XG"  : ["MX", "Mexico"],
    "XH"  : ["MX", "Mexico"],
    "XI"  : ["MX", "Mexico"],
    "XJ"  : ["CA", "Canada"],
    "XK"  : ["CA", "Canada"],
    "XL"  : ["CA", "Canada"],
    "XM"  : ["CA", "Canada"],
    "XN"  : ["CA", "Canada"],
    "XO"  : ["CA", "Canada"],
    "XP"  : ["DK", "Denmark"],
    "XQ"  : ["CL", "Chile"],
    "XR"  : ["CL", "Chile"],
    "XS"  : ["CN", "China"],
    "XT"  : ["BF", "Burkina Faso"],
    "XU"  : ["KH", "Cambodia"],
    "XV"  : ["VN", "Vietnam"],
    "XW"  : ["LA", "Laos"],
    "XX"  : ["MO", "Macao"],
    "XY"  : ["MM", "Myanmar"],
    "XZ"  : ["MM", "Myanmar"],
    "Y2"  : ["DE", "Germany"],
    "Y3"  : ["DE", "Germany"],
    "Y4"  : ["DE", "Germany"],
    "Y5"  : ["DE", "Germany"],
    "Y6"  : ["DE", "Germany"],
    "Y7"  : ["DE", "Germany"],
    "Y8"  : ["DE", "Germany"],
    "Y9"  : ["DE", "Germany"],
    "YA"  : ["AF", "Afghanistan"],
    "YB"  : ["ID", "Indonesia"],
    "YC"  : ["ID", "Indonesia"],
    "YD"  : ["ID", "Indonesia"],
    "YE"  : ["ID", "Indonesia"],
    "YF"  : ["ID", "Indonesia"],
    "YG"  : ["ID", "Indonesia"],
    "YH"  : ["ID", "Indonesia"],
    "YI"  : ["IQ", "Iraq"],
    "YJ"  : ["VU", "Vanuatu"],
    "YK"  : ["SY", "Syria"],
    "YL"  : ["LV", "Latvia"],
    "YM"  : ["TR", "Turkey"],
    "YN"  : ["NI", "Nicaragua"],
    "YO"  : ["RO", "Romania"],
    "YP"  : ["RO", "Romania"],
    "YQ"  : ["RO", "Romania"],
    "YR"  : ["RO", "Romania"],
    "YS"  : ["SV", "El Salvador"],
    "YT"  : ["RS", "Serbia"],
    "YU"  : ["RS", "Serbia"],
    "YV"  : ["VE", "Venezuela"],
    "YW"  : ["VE", "Venezuela"],
    "YX"  : ["VE", "Venezuela"],
    "YY"  : ["VE", "Venezuela"],
    "Z2"  : ["ZW", "Zimbabwe"],
    "Z3"  : ["MK", "Macedonia"],
    "Z6"  : ["XK", "Kosovo"],
    "Z8"  : ["SS", "South Sudan"],
    "ZA"  : ["AL", "Albania"],
    "ZB"  : ["GB", "United Kingdom"],
    "ZC"  : ["GB", "United Kingdom"],
    "ZD"  : ["GB", "United Kingdom"],
    "ZE"  : ["GB", "United Kingdom"],
    "ZF"  : ["GB", "United Kingdom"],
    "ZG"  : ["GB", "United Kingdom"],
    "ZH"  : ["GB", "United Kingdom"],
    "ZI"  : ["GB", "United Kingdom"],
    "ZJ"  : ["GB", "United Kingdom"],
    "ZK"  : ["NZ", "New Zealand"],
    "ZL"  : ["NZ", "New Zealand"],
    "ZM"  : ["NZ", "New Zealand"],
    "ZN"  : ["GB", "United Kingdom"],
    "ZO"  : ["GB", "United Kingdom"],
    "ZP"  : ["PY", "Paraguay"],
    "ZQ"  : ["GB", "United Kingdom"],
    "ZR"  : ["ZA", "South Africa"],
    "ZS"  : ["ZA", "South Africa"],
    "ZT"  : ["ZA", "South Africa"],
    "ZU"  : ["ZA", "South Africa"],
    "ZV"  : ["BR", "Brazil"],
    "ZW"  : ["BR", "Brazil"],
    "ZX"  : ["BR", "Brazil"],
    "ZY"  : ["BR", "Brazil"],
    "ZZ"  : ["BR", "Brazil"]
};

//
// AIS MID prefix to country name conversion
//

Lookup.MID2COUNTRY = {
    "002" : [null, "Europe Coast Station"],
    "003" : [null, "North America Coast Station"],
    "004" : [null, "Asia Coast Station"],
    "005" : [null, "Oceania Coast Station"],
    "006" : [null, "Africa Coast Station"],
    "007" : [null, "South America Coast Station"],
    "501" : ["FR", "Adelie Land (France)"],
    "401" : ["AF", "Afghanistan"],
    "303" : ["US", "Alaska (USA)"],
    "201" : ["AL", "Albania"],
    "605" : ["DZ", "Algeria"],
    "559" : ["AS", "Samoa (USA)"],
    "202" : ["AD", "Andorra"],
    "603" : ["AO", "Angola"],
    "301" : ["AI", "Anguilla"],
    "304" : ["AG", "Antigua and Barbuda"],
    "305" : ["AG", "Antigua and Barbuda"],
    "701" : ["AR", "Argentina"],
    "216" : ["AM", "Armenia"],
    "307" : ["AW", "Aruba"],
    "608" : ["GB", "Ascension Island"],
    "503" : ["AU", "Australia"],
    "203" : ["AT", "Austria"],
    "423" : ["AZ", "Azerbaijan"],
    "204" : ["PT", "Azores (Portugal)"],
    "308" : ["BS", "Bahamas"],
    "309" : ["BS", "Bahamas"],
    "311" : ["BS", "Bahamas"],
    "408" : ["BH", "Bahrain"],
    "405" : ["BD", "Bangladesh"],
    "314" : ["BB", "Barbados"],
    "206" : ["BY", "Belarus"],
    "205" : ["BE", "Belgium"],
    "312" : ["BZ", "Belize"],
    "610" : ["BJ", "Benin"],
    "310" : ["BM", "Bermuda"],
    "410" : ["BT", "Bhutan"],
    "720" : ["BO", "Bolivia"],
    "306" : ["NL", "Bonaire, Sint Eustatius and Saba (Netherlands)"],
    "478" : ["BA", "Bosnia and Herzegovina"],
    "611" : ["BW", "Botswana"],
    "710" : ["BR", "Brazil"],
    "378" : ["VG", "Virgin Islands (UK)"],
    "508" : ["BN", "Brunei"],
    "207" : ["BG", "Bulgaria"],
    "633" : ["BF", "Burkina Faso"],
    "609" : ["BI", "Burundi"],
    "514" : ["KH", "Cambodia"],
    "515" : ["KH", "Cambodia"],
    "613" : ["CM", "Cameroon"],
    "316" : ["CA", "Canada"],
    "617" : ["CV", "Cape Verde"],
    "319" : ["KY", "Cayman Islands"],
    "612" : ["CF", "Central African Republic"],
    "670" : ["TD", "Chad"],
    "725" : ["CL", "Chile"],
    "412" : ["CN", "China"],
    "413" : ["CN", "China"],
    "414" : ["CN", "China"],
    "516" : ["CX", "Christmas Island"],
    "523" : ["CC", "Cocos (Keeling) Islands"],
    "730" : ["CO", "Colombia"],
    "616" : ["KM", "Comoros"],
    "620" : ["KM", "Comoros"],
    "615" : ["CG", "Republic of Congo"],
    "518" : ["CK", "Cook Islands"],
    "321" : ["CR", "Costa Rica"],
    "619" : ["CI", "Ivory Coast"],
    "238" : ["HR", "Croatia"],
    "618" : ["FR", "Crozet Archipelago"],
    "323" : ["CU", "Cuba"],
    "306" : ["CW", "Curacao (Netherlands)"],
    "209" : ["CY", "Cyprus"],
    "210" : ["CY", "Cyprus"],
    "212" : ["CY", "Cyprus"],
    "270" : ["CZ", "Czech Republic"],
    "445" : ["KP", "North Korea"],
    "676" : ["CD", "Republic of Congo"],
    "219" : ["DK", "Denmark"],
    "220" : ["DK", "Denmark"],
    "621" : ["DJ", "Djibouti"],
    "325" : ["DM", "Dominica"],
    "327" : ["DO", "Dominican Republic"],
    "735" : ["EC", "Ecuador"],
    "622" : ["EG", "Egypt"],
    "359" : ["SV", "El Salvador"],
    "631" : ["GQ", "Equatorial Guinea"],
    "625" : ["ER", "Eritrea"],
    "276" : ["EE", "Estonia"],
    "624" : ["ET", "Ethiopia"],
    "740" : ["FK", "Falkland Islands (Malvinas)"],
    "231" : ["FO", "Faroe Islands"],
    "520" : ["FJ", "Fiji"],
    "230" : ["FI", "Finland"],
    "226" : ["FR", "France"],
    "227" : ["FR", "France"],
    "228" : ["FR", "France"],
    "546" : ["PF", "French Polynesia"],
    "626" : ["GA", "Gabon"],
    "629" : ["GM", "Gambia"],
    "213" : ["GE", "Georgia"],
    "211" : ["DE", "Germany"],
    "218" : ["DE", "Germany (former DDR)"],
    "627" : ["GH", "Ghana"],
    "236" : ["GI", "Gibraltar"],
    "237" : ["GR", "Greece"],
    "239" : ["GR", "Greece"],
    "240" : ["GR", "Greece"],
    "241" : ["GR", "Greece"],
    "331" : ["GL", "Greenland"],
    "330" : ["GD", "Grenada"],
    "329" : ["FR", "Guadeloupe (France)"],
    "332" : ["GT", "Guatemala"],
    "745" : ["FR", "Guiana (France)"],
    "632" : ["GN", "Guinea"],
    "630" : ["GW", "Guinea-Bissau"],
    "750" : ["GY", "Guyana"],
    "336" : ["HT", "Haiti"],
    "334" : ["HN", "Honduras"],
    "477" : ["HK", "Hong Kong"],
    "243" : ["HU", "Hungary"],
    "251" : ["IS", "Iceland"],
    "419" : ["IN", "India"],
    "525" : ["ID", "Indonesia"],
    "422" : ["IR", "Iran"],
    "425" : ["IQ", "Iraq"],
    "250" : ["IE", "Ireland"],
    "428" : ["IL", "Israel"],
    "247" : ["IT", "Italy"],
    "339" : ["JM", "Jamaica"],
    "431" : ["JP", "Japan"],
    "432" : ["JP", "Japan"],
    "438" : ["JO", "Jordan"],
    "436" : ["KZ", "Kazakhstan"],
    "634" : ["KE", "Kenya"],
    "635" : ["FR", "Kerguelen Islands"],
    "529" : ["KI", "Kiribati"],
    "440" : ["KR", "South Korea"],
    "441" : ["KR", "South Korea"],
    "447" : ["KW", "Kuwait"],
    "451" : ["KG", "Kyrgyzstan"],
    "531" : ["LA", "Laos"],
    "275" : ["LV", "Latvia"],
    "450" : ["LB", "Lebanon"],
    "644" : ["LS", "Lesotho"],
    "636" : ["LR", "Liberia"],
    "637" : ["LR", "Liberia"],
    "642" : ["LY", "Libya"],
    "252" : ["LI", "Liechtenstein"],
    "277" : ["LT", "Lithuania"],
    "253" : ["LU", "Luxembourg"],
    "453" : ["MO", "Macao"],
    "274" : ["MK", "Macedonia"],
    "647" : ["MG", "Madagascar"],
    "255" : ["PT", "Madeira (Portugal)"],
    "655" : ["MW", "Malawi"],
    "533" : ["MY", "Malaysia"],
    "455" : ["MV", "Maldives"],
    "649" : ["ML", "Mali"],
    "215" : ["MT", "Malta"],
    "229" : ["MT", "Malta"],
    "248" : ["MT", "Malta"],
    "249" : ["MT", "Malta"],
    "256" : ["MT", "Malta"],
    "538" : ["MH", "Marshall Islands"],
    "347" : ["FR", "Martinique (France)"],
    "654" : ["MR", "Mauritania"],
    "645" : ["MU", "Mauritius"],
    "345" : ["MX", "Mexico"],
    "510" : ["FM", "Micronesia"],
    "214" : ["MD", "Moldova"],
    "254" : ["MC", "Monaco"],
    "457" : ["MN", "Mongolia"],
    "262" : ["ME", "Montenegro"],
    "348" : ["MS", "Montserrat"],
    "242" : ["MA", "Morocco"],
    "650" : ["MZ", "Mozambique"],
    "506" : ["MM", "Myanmar"],
    "659" : ["NA", "Namibia"],
    "544" : ["NR", "Nauru"],
    "459" : ["NP", "Nepal"],
    "244" : ["NL", "Netherlands"],
    "245" : ["NL", "Netherlands"],
    "246" : ["NL", "Netherlands"],
    "540" : ["NC", "New Caledonia"],
    "512" : ["NZ", "New Zealand"],
    "350" : ["NI", "Nicaragua"],
    "656" : ["NE", "Niger"],
    "657" : ["NG", "Nigeria"],
    "542" : ["NU", "Niue"],
    "536" : ["MP", "Northern Mariana Islands (USA)"],
    "257" : ["NO", "Norway"],
    "258" : ["NO", "Norway"],
    "259" : ["NO", "Norway"],
    "461" : ["OM", "Oman"],
    "463" : ["PK", "Pakistan"],
    "511" : ["PW", "Palau"],
    "443" : ["PS", "Palestine"],
    "351" : ["PA", "Panama"],
    "352" : ["PA", "Panama"],
    "353" : ["PA", "Panama"],
    "354" : ["PA", "Panama"],
    "355" : ["PA", "Panama"],
    "356" : ["PA", "Panama"],
    "357" : ["PA", "Panama"],
    "370" : ["PA", "Panama"],
    "371" : ["PA", "Panama"],
    "372" : ["PA", "Panama"],
    "373" : ["PA", "Panama"],
    "374" : ["PA", "Panama"],
    "553" : ["PG", "Papua New Guinea"],
    "755" : ["PY", "Paraguay"],
    "760" : ["PE", "Peru"],
    "548" : ["PH", "Philippines"],
    "555" : ["PN", "Pitcairn Islands"],
    "261" : ["PL", "Poland"],
    "263" : ["PT", "Portugal"],
    "358" : ["PR", "Puerto Rico (USA)"],
    "466" : ["QA", "Qatar"],
    "660" : ["RE", "Reunion (France)"],
    "264" : ["RO", "Romania"],
    "273" : ["RU", "Russia"],
    "661" : ["RW", "Rwanda"],
    "665" : ["SH", "Saint Helena"],
    "341" : ["KN", "Saint Kitts and Nevis"],
    "343" : ["LC", "Saint Lucia"],
    "607" : ["FR", "Saint Paul and Amsterdam Islands"],
    "361" : ["VC", "Saint Pierre and Miquelon"],
    "375" : ["PM", "Saint Vincent and Grenadines"],
    "376" : ["PM", "Saint Vincent and Grenadines"],
    "377" : ["PM", "Saint Vincent and Grenadines"],
    "561" : ["WS", "Samoa"],
    "268" : ["SM", "San Marino"],
    "668" : ["ST", "Sao Tome and Principe"],
    "403" : ["SA", "Saudi Arabia"],
    "663" : ["SN", "Senegal"],
    "279" : ["RS", "Serbia"],
    "664" : ["SC", "Seychelles"],
    "667" : ["SL", "Sierra Leone"],
    "563" : ["SG", "Singapore"],
    "564" : ["SG", "Singapore"],
    "565" : ["SG", "Singapore"],
    "566" : ["SG", "Singapore"],
    "306" : ["SX", "Sint Maarten (Netherlands)"],
    "267" : ["SK", "Slovakia"],
    "278" : ["SK", "Slovenia"],
    "557" : ["SB", "Solomon Islands"],
    "666" : ["SO", "Somalia"],
    "601" : ["ZA", "South Africa"],
    "224" : ["ES", "Spain"],
    "225" : ["ES", "Spain"],
    "417" : ["LK", "Sri Lanka"],
    "638" : ["SS", "South Sudan"],
    "662" : ["SD", "Sudan"],
    "765" : ["SR", "Suriname"],
    "669" : ["SZ", "Swaziland"],
    "265" : ["SE", "Sweden"],
    "266" : ["SE", "Sweden"],
    "269" : ["CH", "Switzerland"],
    "468" : ["SY", "Syria"],
    "416" : ["TW", "Taiwan"],
    "472" : ["TJ", "Tajikistan"],
    "674" : ["TZ", "Tanzania"],
    "677" : ["TZ", "Tanzania"],
    "567" : ["TH", "Thailand"],
    "671" : ["TG", "Togo"],
    "570" : ["TO", "Tonga"],
    "362" : ["TT", "Trinidad and Tobago"],
    "672" : ["TN", "Tunisia"],
    "271" : ["TR", "Turkey"],
    "434" : ["TM", "Turkmenistan"],
    "364" : ["TC", "Turks and Caicos Islands"],
    "572" : ["TV", "Tuvalu"],
    "675" : ["UG", "Uganda"],
    "272" : ["UA", "Ukraine"],
    "470" : ["AE", "United Arab Emirates"],
    "471" : ["AE", "United Arab Emirates"],
    "232" : ["GB", "United Kingdom"],
    "233" : ["GB", "United Kingdom"],
    "234" : ["GB", "United Kingdom"],
    "235" : ["GB", "United Kingdom"],
    "379" : ["VI", "Virgin Islands (USA)"],
    "338" : ["US", "United States"],
    "366" : ["US", "United States"],
    "367" : ["US", "United States"],
    "368" : ["US", "United States"],
    "369" : ["US", "United States"],
    "770" : ["UY", "Uruguay"],
    "437" : ["UZ", "Uzbekistan"],
    "576" : ["VU", "Vanuatu"],
    "577" : ["VU", "Vanuatu"],
    "208" : ["VA", "Vatican"],
    "775" : ["VE", "Venezuela"],
    "574" : ["VN", "Vietnam"],
    "578" : ["WF", "Wallis and Futuna Islands"],
    "473" : ["YE", "Yemen"],
    "475" : ["YE", "Yemen"],
    "678" : ["ZM", "Zambia"],
    "679" : ["ZW", "Zimbabwe"]
};

//
// Utility functions
//

function Utils() {}

Utils.fm_url = 'https://www.google.com/search?q={}+FM';
Utils.callsign_url = null;
Utils.vessel_url = null;
Utils.flight_url = null;
Utils.icao_url = null;
Utils.receiver_pos = null;

// Set receiver position
Utils.setReceiverPos = function(pos) {
    if (pos.lat && pos.lon) this.receiver_pos = pos;
};

// Get receiver position
Utils.getReceiverPos = function() {
    return this.receiver_pos;
};

// Set URL for linkifying callsigns
Utils.setCallsignUrl = function(url) {
    this.callsign_url = url;
};

// Set URL for linkifying AIS vessel IDs
Utils.setVesselUrl = function(url) {
    this.vessel_url = url;
};

// Set URL for linkifying flight and aircraft IDs
Utils.setFlightUrl = function(url) {
    this.flight_url = url;
};

// Set URL for linkifying ICAO aircraft IDs
Utils.setIcaoUrl = function(url) {
    this.icao_url = url;
};

// Escape HTML code
Utils.htmlEscape = function(input) {
    return $('<div/>').text(input).html();
};

// Print frequency (in Hz) in a nice way
Utils.printFreq = function(freq) {
    if (isNaN(parseInt(freq))) {
        return freq;
    } else if (freq >= 30000000) {
        return '' + (freq / 1000000.0) + 'MHz';
    } else if (freq >= 10000) {
        return '' + (freq / 1000.0) + 'kHz';
    } else {
        return '' + freq + 'Hz';
    }
}

// Change frequency as required by given modulation
Utils.offsetFreq = function(freq, mod) {
    switch(mod) {
        case 'cw':
            return freq - 800;
        case 'fax':
            return freq - 1900;
        case 'cwdecoder':
        case 'rtty450':
        case 'rtty170':
        case 'rtty85':
        case 'bpsk31':
        case 'bpsk63':
        case 'sitorb':
        case 'navtex':
        case 'dsc':
            return freq - 1000;
    }

    return freq;
}

// Wrap given callsign or other ID into a clickable link.
Utils.linkify = function(id, url = null, content = null, tip = null) {
    // If no specific content, use the ID itself
    if (content == null) content = id;

    // Compose tooltip
    var tipText = tip? ' title="' + tip + '"'  : '';

    // Must have valid ID and lookup URL
    if ((id == '') || (url == null) || (url == '')) {
        return tipText? '<div' + tipText + '>' + content + '</div>'  : content;
    } else {
        return '<a target="callsign_info"' + tipText + ' href="' +
            url.replaceAll('{}', id) + '">' + content + '</a>';
    }
};

// Create link to an FM station
Utils.linkifyFM = function(name) {
    return this.linkify(name, this.fm_url);
};

// Create link to a callsign, with country tooltip, etc.
Utils.linkifyCallsign = function(callsign) {
    // Strip callsign of modifiers
    var id = callsign.replace(/[-/].*$/, '');
    // Add country name as a tooltip
    return this.linkify(id, this.callsign_url, callsign, Lookup.call2cname(id));
};

// Create link to a maritime vessel, with country tooltip, etc.
Utils.linkifyVessel = function(mmsi) {
    // Add country name as a tooltip
    return this.linkify(mmsi, this.vessel_url, mmsi, Lookup.mmsi2cname(mmsi));
};

// Create link to a flight or an aircraft
Utils.linkifyFlight = function(flight, content = null) {
    return this.linkify(flight, this.flight_url, content);
};

// Create link to a MODE-S ICAO ID
Utils.linkifyIcao = function(icao, content = null) {
    return this.linkify(icao, this.icao_url, content);
};

// Create link to tune OWRX to the given frequency and modulation.
Utils.linkifyFreq = function(freq, mod) {
    return '<a target="openwebrx-rx" href="/#freq='
        + freq + ',mod=' + mod + '">' + Utils.printFreq(freq) + '</a>';
};

// Create link to a map locator
Utils.linkifyLocator = function(locator) {
    return '<a target="openwebrx-map" href="map?locator='
        + encodeURIComponent(locator) + '">' + locator + '</a>';
}

// Linkify given content so that clicking them opens the map with
// the info bubble.
Utils.linkToMap = function(id, content = null, attrs = "") {
    if (id) {
        return '<a ' + attrs + ' href="map?callsign='
            + encodeURIComponent(id) + '" target="openwebrx-map">'
            + (content != null? content  : id) + '</a>';
    } else if (content != null) {
        return '<div ' + attrs + '>' + content + '</div>';
    } else {
        return '';
    }
};

// Print time in hours, minutes, and seconds.
Utils.HHMMSS = function(t) {
    var pad = function (i) { return ('' + i).padStart(2, "0") };

    // Convert timestamps into dates
    if (!(t instanceof Date)) t = new Date(t);

    return pad(t.getUTCHours()) + ':' + pad(t.getUTCMinutes()) + ':' + pad(t.getUTCSeconds());
};

// Compute distance, in kilometers, between two latlons. Use receiver
// location if the second latlon is not provided.
Utils.distanceKm = function(p1, p2) {
    // Use receiver location if second latlon not given
    if (p2 == null) p2 = this.receiver_pos;
    // Convert from map objects to latlons
    if ("lng" in p1) p1 = { lat : p1.lat(), lon : p1.lng() };
    if ("lng" in p2) p2 = { lat : p2.lat(), lon : p2.lng() };
    // Earth radius in km
    var R = 6371.0;
    // Convert degrees to radians
    var rlat1 = p1.lat * (Math.PI/180);
    var rlat2 = p2.lat * (Math.PI/180);
    // Compute difference in radians
    var difflat = rlat2 - rlat1;
    var difflon = (p2.lon - p1.lon) * (Math.PI/180);
    // Compute distance
    d = 2 * R * Math.asin(Math.sqrt(
        Math.sin(difflat/2) * Math.sin(difflat/2) +
        Math.cos(rlat1) * Math.cos(rlat2) * Math.sin(difflon/2) * Math.sin(difflon/2)
    ));
    return Math.round(d);
};

// Truncate string to a given number of characters, adding "..." to the end.
Utils.truncate = function(str, count) {
    return str.length > count? str.slice(0, count) + '&mldr;'  : str;
};

// Convert degrees to compass direction.
Utils.degToCompass = function(deg) {
    dir = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    return dir[Math.floor((deg/22.5) + 0.5) % 16];
};

// Convert Maidenhead locator ID to lat/lon pair.
Utils.loc2latlng = function(id) {
    return [
        (id.charCodeAt(1) - 65 - 9) * 10 + Number(id[3]) + 0.5,
        (id.charCodeAt(0) - 65 - 9) * 20 + Number(id[2]) * 2 + 1.0
    ];
};

// Convert given name to an information section title.
Utils.makeListTitle = function(name) {
    return '<div style="border-bottom:2px solid;padding-top:1em;"><b>' + name + '</b></div>';
};

// Convert given name/value to an information section item.
Utils.makeListItem = function(name, value) {
    return '<div style="display:flex;justify-content:space-between;border-bottom:1px dotted;white-space:nowrap;">'
        + '<span>' + name + '&nbsp;&nbsp;&nbsp;&nbsp;</span>'
        + '<span>' + value + '</span>'
        + '</div>';
};

// Get opacity value in the 0..1 range based on the given age.
Utils.getOpacityScale = function(age) {
    var scale = 1;
    if (age >= retention_time / 2) {
        scale = (retention_time - age) / (retention_time / 2);
    }
    return Math.max(0, Math.min(1, scale));
};

// Save given canvas into a PNG file.
Utils.saveCanvas = function(canvas) {
    // Get canvas by its ID
    var c = document.getElementById(canvas);
    if (c == null) return;

    // Convert canvas to a data blob
    c.toBlob(function(blob) {
        // Create and click a link to the canvas data URL
        var a = document.createElement('a');
        a.href = window.URL.createObjectURL(blob);
        a.style = 'display: none';
        a.download = canvas + ".png";
        document.body.appendChild(a);
        a.click();

        // Get rid of the canvas data URL
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(a.href);
        }, 0);
    }, 'image/png');
};

//
// Local Storage Access
//

function LS() {}

// Return true of setting exist in storage.
LS.has = function(key) {
    return localStorage && (localStorage.getItem(key)!=null);
};

// Save named UI setting to local storage.
LS.save = function(key, value) {
    if (localStorage) localStorage.setItem(key, value);
};

// Load named UI setting from local storage.
LS.loadStr = function(key) {
    return localStorage? localStorage.getItem(key) : null;
};

LS.loadInt = function(key) {
    var x = localStorage? localStorage.getItem(key) : null;
    return x!=null? parseInt(x) : 0;
}

LS.loadBool = function(key) {
    var x = localStorage? localStorage.getItem(key) : null;
    return x==='true';
}

function Clock(el) {
    // Save HTML element to update
    this.el = el;
    // Update for the first time
    this.update();
}

Clock.prototype.update = function() {
    const now = new Date();
    const me = this;

    // Next update at the next minute change
    setTimeout(function() { me.update(); }, 1000 * (60 - now.getUTCSeconds()));

    // Display UTC clock
    if (this.el) {
        const hours = ("00" + now.getUTCHours()).slice(-2);
        const minutes = ("00" + now.getUTCMinutes()).slice(-2);
        this.el.html(`${hours}:${minutes} UTC`);
    }
}

//
// Built-in Chat
//

function Chat() {}

// We start with these values
Chat.nickname = '';

// Load chat settings from local storage.
Chat.loadSettings = function() {
    this.setNickname(LS.has('chatname')? LS.loadStr('chatname') : '');
};

// Set chat nickname.
Chat.setNickname = function(nickname) {
    if (this.nickname !== nickname) {
        this.nickname = nickname;
        LS.save('chatname', nickname);
        $('#openwebrx-chat-name').val(nickname);
    }
};

Chat.recvMessage = function(nickname, text, color = 'white') {
    // Show chat panel
    toggle_panel('openwebrx-panel-log', true);

    divlog(
        '[<span class="chatname" style="color:' + color + ';">'
      + Utils.htmlEscape(nickname) + '</span>]:&nbsp;'
      + '<span class="chatmessage">' + Utils.htmlEscape(text)
      + '</span>'
    );
};

Chat.sendMessage = function(text, nickname = '') {
    ws.send(JSON.stringify({
        'type': 'sendmessage', 'name': nickname, 'text': text
    }));
};

// Collect nick and message from controls and send message.
Chat.send = function() {
    this.setNickname($('#openwebrx-chat-name').val().trim());

    var msg = $('#openwebrx-chat-message').val().trim();
    if (msg.length > 0) this.sendMessage(msg, this.nickname);
    $('#openwebrx-chat-message').val('');
};

// Attach events to chat controls.
Chat.keyPress = function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        this.send();
    }
};

//
// User Interface functions
//

function UI() {}

// We start with these values
UI.theme = 'default';
UI.wfTheme = null;
UI.frame = false;
UI.opacity = 100;
UI.volume = -1;
UI.volumeMuted = -1;
UI.nrThreshold = -20;
UI.nrEnabled = false;
UI.wheelSwap = false;
UI.spectrum = false;
UI.bandplan = false;

// Foldable UI sections and their initial states
UI.sections = {
    'modes'   : true,
    'controls': true,
    'settings': false,
    'display' : true
};

// Load UI settings from local storage.
UI.loadSettings = function() {
    this.setTheme(LS.has('ui_theme')? LS.loadStr('ui_theme') : 'default');
    this.setOpacity(LS.has('ui_opacity')? LS.loadInt('ui_opacity') : 100);
    this.toggleFrame(LS.has('ui_frame')? LS.loadBool('ui_frame') : false);
    this.toggleWheelSwap(LS.has('ui_wheel')? LS.loadBool('ui_wheel') : false);
    this.toggleSpectrum(LS.has('ui_spectrum')? LS.loadBool('ui_spectrum') : false);
    this.toggleBandplan(LS.has('ui_bandplan')? LS.loadBool('ui_bandplan') : false);
    this.setWfTheme(LS.has('wf_theme')? LS.loadStr('wf_theme') : 'default');
    this.setNR(LS.has('nr_threshold')? LS.loadInt('nr_threshold') : 0);
    this.toggleNR(LS.has('nr_enabled')? LS.loadBool('nr_enabled') : false);

    // Toggle UI sections
    for (section in this.sections) {
        var id = 'openwebrx-section-' + section;
        var el = document.getElementById(id);
        if (el) this.toggleSection(el,
            LS.has(id)? LS.loadBool(id) : this.sections[section]
        );
    }
};

// Load audio settings from local storage.
UI.loadAudioSettings = function() {
    // Must have running audio engine
    if (!audioEngine.isStarted()) return;

    // Get volume and mute
    var volume = LS.has('volume')? LS.loadInt('volume') : 100;
    var muted  = LS.has('volumeMuted')? LS.loadInt('volumeMuted') : -1;
    if (muted >= 0) {
        if (this.volumeMuted >= 0) {
            this.volumeMuted = muted;
        } else {
            this.volume = muted;
            this.toggleMute(true);
        }
    } else {
        if (this.volumeMuted < 0) {
            this.setVolume(volume);
        } else {
            this.volumeMuted = volume;
            this.toggleMute(false);
        }
    }
}

//
// Modulation Controls
//

UI.getDemodulatorPanel = function() {
    return $('#openwebrx-panel-receiver').demodulatorPanel();
};

UI.getDemodulator = function() {
    return this.getDemodulatorPanel().getDemodulator();
}

UI.getModulation = function() {
    var mode1 = this.getDemodulator().get_secondary_demod();
    var mode2 = this.getDemodulator().get_modulation();
    return !!mode1? mode1 : !mode2? '' : mode2;
};

UI.getUnderlying = function() {
    var mode1 = this.getDemodulator().get_secondary_demod();
    var mode2 = this.getDemodulator().get_modulation();
    return !mode1? '' : !mode2? '' : mode2;
};

UI.setModulation = function(mode, underlying) {
    this.getDemodulatorPanel().setMode(mode, underlying);
};

//
// Frequency Controls
//

UI.getOffsetFrequency = function(x) {
    if (typeof(x) === 'undefined') {
        // No argument: return currently tuned offset
        return this.getDemodulator().get_offset_frequency();
    } else {
        // Pointer position: return offset under pointer
        // Use rounded absolute frequency to get offset
        return this.getFrequency(x) - center_freq;
    }
};

UI.getFrequency = function(x) {
    if (typeof(x) === 'undefined') {
        // No argument: return currently tuned frequency
        return center_freq + this.getOffsetFrequency();
    } else {
        // Pointer position: return frequency under pointer
        x = x / canvas_container.clientWidth;
        x = center_freq + (bandwidth * x) - (bandwidth / 2);
        return tuning_step>0?
            Math.round(x / tuning_step) * tuning_step : Math.round(x);
    }
};

UI.setOffsetFrequency = function(offset) {
    return this.getDemodulator().set_offset_frequency(offset);
};

UI.setFrequency = function(freq) {
    return this.setOffsetFrequency(freq - center_freq);
};

UI.tuneBookmark = function(b) {
    // Bookmark must have frequency and modulation
    if (!b || !b.frequency || !b.modulation) return false;

    //console.log("TUNE: " + b.name + " at " + b.frequency + ": " + b.modulation);

    // Tune to the bookmark frequency
    var freq = b.modulation === 'cw'? b.frequency - 800 : b.frequency;
    UI.setFrequency(freq, b.modulation);
    UI.setModulation(b.modulation, b.underlying);

    // Done
    return true;
};

//
// Volume Controls
//

// Set audio volume in 0..150 range.
UI.setVolume = function(x) {
    // Must have running audio engine
    if (!audioEngine.isStarted()) return;

    x = Math.min(150, Math.max(0, Math.round(parseFloat(x))));
    if (this.volume != x) {
        this.volume = x;
        LS.save('volume', x);
        $('#openwebrx-panel-volume').val(x)
        if (audioEngine) {
            // Map 0-150 to -55..+5db gain
            gain = x > 0? Math.pow(10, ((x / 2.5) - 55) / 20) : 0;
            audioEngine.setVolume(gain);
        }
    }
};

// Toggle audio muting.
UI.toggleMute = function(on) {
    // Must have running audio engine
    if (!audioEngine.isStarted()) return;

    // If no argument given, toggle mute
    var toggle = typeof(on) === 'undefined';
    var $muteButton = $('.openwebrx-mute-button');
    var $volumePanel = $('#openwebrx-panel-volume');

    if ((this.volumeMuted >= 0) && (toggle || !on)) {
        this.setVolume(this.volumeMuted);
        this.volumeMuted = -1;
        $muteButton.removeClass('muted');
        $volumePanel.prop('disabled', false);
        LS.save('volumeMuted', this.volumeMuted);
    } else if (toggle || on) {
        this.volumeMuted = this.volume;
        this.setVolume(0);
        $muteButton.addClass('muted');
        $volumePanel.prop('disabled', true);
        LS.save('volumeMuted', this.volumeMuted);
    }
};

//
// Noise Reduction Controls
//

// Set noise reduction threshold in decibels.
UI.setNR = function(x) {
    x = Math.round(parseFloat(x));
    if (this.nrThreshold != x) {
        this.nrThreshold = x;
        LS.save('nr_threshold', x);
        $('#openwebrx-panel-nr').attr('title', 'Noise reduction level (' + x + ' dB)').val(x);
        this.updateNR();
    }
};

// Toggle noise reduction function.
UI.toggleNR = function(on) {
    var $nrPanel = $('#openwebrx-panel-nr');

    // If no argument given, toggle NR
    this.nrEnabled = !!(typeof(on)==='undefined'? $nrPanel.prop('disabled') : on);

    LS.save('nr_enabled', this.nrEnabled);
    $nrPanel.prop('disabled', !this.nrEnabled);
    this.updateNR();
}

// Send changed noise reduction parameters to the server.
UI.updateNR = function() {
    ws.send(JSON.stringify({
        'type': 'connectionproperties',
        'params': {
            'nr_enabled': this.nrEnabled,
            'nr_threshold': this.nrThreshold
        }
    }));
}

//
// Audio Recording Controls
//

UI.toggleRecording = function(on) {
    // If no argument given, toggle audio recording
    var toggle = typeof(on) === 'undefined';

    var $recButton = $('.openwebrx-record-button');

    if ($recButton.is(':visible')) {
        if (audioEngine.recording && (toggle || !on)) {
            audioEngine.stopRecording();
            $recButton.css('animation-name', '');
        } else if (toggle || on) {
            audioEngine.startRecording();
            $recButton.css('animation-name', 'openwebrx-record-animation');
        }
    }
};

//
// Scanner Controls
//

UI.toggleScanner = function(on) {
    // If no argument given, toggle scanner
    if (typeof(on) === 'undefined') on = !scanner.isRunning();

    // Do not change scanner state if not needed
    if (scanner.isRunning() == on) return;

    // Start or stop scanner as needed
    if (on) scanner.start(); else scanner.stop();

    // Get current scanner state
    on = scanner.isRunning();

    // Update UI elements
    var $scanButton = $('.openwebrx-squelch-auto');
    $scanButton.css('animation-name', on? 'openwebrx-scan-animation' : '');
    if (on) {
        $scanButton.addClass('highlighted');
    } else {
        $scanButton.removeClass('highlighted');
    }
};

//
// Look & Feel Controls
//

UI.toggleSection = function(el, on) {
    // If no argument given, toggle section
    var toggle = typeof(on) === 'undefined';

    var next_el = el.nextElementSibling;
    if (next_el) {
        if ((next_el.classList.contains('closed')) && (toggle || on)) {
            el.innerHTML = el.innerHTML.replace('\u25B4', '\u25BE');
            next_el.classList.remove('closed');
            LS.save(el.id, true);
        } else if (toggle || !on) {
            el.innerHTML = el.innerHTML.replace('\u25BE', '\u25B4');
            next_el.classList.add('closed');
            LS.save(el.id, false);
        }
    }
};

// Show or hide spectrum display
UI.toggleSpectrum = function(on) {
    // If no argument given, toggle spectrum
    if (typeof(on) === 'undefined') on = !this.spectrum;

    this.spectrum = on;
    LS.save('ui_spectrum', on);
    if (spectrum) spectrum.toggle(on);
};

// Show or hide bandplan display
UI.toggleBandplan = function(on) {
    // If no argument given, toggle bandplan
    if (typeof(on) === 'undefined') on = !this.bandplan;

    if (this.bandplan != on) {
        this.bandplan = on;
        LS.save('ui_bandplan', on);
        $('#openwebrx-bandplan-checkbox').attr('checked', on);
        if (bandplan) bandplan.toggle(on);
    }
};

// Show or hide frame around receiver and other panels.
UI.toggleFrame = function(on) {
    // If no argument given, toggle frame
    if (typeof(on) === 'undefined') on = !this.frame;

    if (this.frame != on) {
        this.frame = on;
        LS.save('ui_frame', on);
        $('#openwebrx-frame-checkbox').attr('checked', on);

        var border = on ? '2px solid white' : '2px solid transparent';
        $('#openwebrx-panel-receiver').css( 'border', border);
        $('#openwebrx-dialog-bookmark').css('border', border);
//        $('#openwebrx-digimode-canvas-container').css('border', border);
//        $('.openwebrx-message-panel').css('border', border);
    }
};

// Get current mouse wheel function
UI.getWheelSwap = function() {
    return this.wheelSwap;
};

// Set mouse wheel function (zooming when swapped)
UI.toggleWheelSwap = function(on) {
    // If no argument given, toggle wheel swap
    if (typeof(on) === 'undefined') on = !this.wheelSwap;

    if (this.wheelSwap != on) {
        this.wheelSwap = on;
        LS.save('ui_wheel', on);
        $('#openwebrx-wheel-checkbox').attr('checked', on);
    }
};

// Set user interface opacity in 10..100% range.
UI.setOpacity = function(x) {
    // Limit opacity to 10..100% range
    x = x<10? 10 : x>100? 100 : x;

    if (this.opacity != x) {
        this.opacity = x;
        LS.save('ui_opacity', x);
        $('.openwebrx-panel').css('opacity', x/100);
        $('#openwebrx-opacity-slider')
            .attr('title', 'Opacity (' + Math.round(x) + '%)')
            .val(x);
    }
};

// Set user interface theme.
UI.setTheme = function(theme) {
    // Do not set twice
    if (this.theme === theme) return;

    // Save current theme name
    this.theme = theme;
    LS.save('ui_theme', theme);

    // Set selector
    var lb = $('#openwebrx-themes-listbox');
    lb.val(theme);

    // Remove existing theme
    var opts = lb[0].options;
    for(j=0 ; j<opts.length ; j++) {
        $('body').removeClass('theme-' + opts[j].value);
    }
    $('body').removeClass('has-theme');

    // Apply new theme
    if (theme && (theme != '') && (theme != 'default')) {
        $('body').addClass('theme-' + theme);
        $('body').addClass('has-theme');
    }
};

// Set waterfall color theme.
UI.setWfTheme = function(theme) {
    // Theme name must be valid
    if (!(theme in this.wfThemes)) return;

    // Do not set twice
    if (this.wfTheme === theme) return;

    // Save current theme name
    this.wfTheme = theme;
    LS.save('wf_theme', theme);

    // Set selector
    $('#openwebrx-wf-themes-listbox').val(theme);

    // Set new colors in the waterfall
    Waterfall.setTheme(this.wfThemes[theme]);
};

// Set default waterfall color theme.
UI.setDefaultWfTheme = function(colors) {
    // Update default waterfall theme with new colors
    this.wfThemes['default'] = colors;

    // If default theme currently used, update waterfall
    if (this.wfTheme === 'default') {
        this.wfTheme = null;
        this.setWfTheme('default');
    }
};

// Waterfall color themes
UI.wfThemes = {
    'default' : [0x000000, 0xFFFFFF],
    'teejeez' : [0x000000, 0x0000FF, 0x00FFFF, 0x00FF00, 0xFFFF00, 0xFF0000, 0xFF00FF, 0xFFFFFF],
    'ha7ilm'  : [0x000000, 0x2E6893, 0x69A5D0, 0x214B69, 0x9DC4E0, 0xFFF775, 0xFF8A8A, 0xB20000],
    'ocean'   : [0x000000, 0x000965, 0x00E0FF, 0x2EFF00, 0xFFEC00, 0xFF0000],
    'eclipse' : [
        0x000020, 0x000030, 0x000050, 0x000091, 0x1E90FF, 0xFFFFFF, 0xFFFF00, 0xFE6D16,
        0xFF0000, 0xC60000, 0x9F0000, 0x750000, 0x4A0000
    ],
    'turbo'   : [
        0x30123B, 0x311542, 0x33184A, 0x341B51, 0x351E58, 0x36215F, 0x372466, 0x38266C,
        0x392973, 0x3A2C79, 0x3B2F80, 0x3C3286, 0x3D358B, 0x3E3891, 0x3E3A97, 0x3F3D9C,
        0x4040A2, 0x4043A7, 0x4146AC, 0x4248B1, 0x424BB6, 0x434EBA, 0x4351BF, 0x4453C3,
        0x4456C7, 0x4559CB, 0x455BCF, 0x455ED3, 0x4561D7, 0x4663DA, 0x4666DD, 0x4669E1,
        0x466BE4, 0x466EE7, 0x4671E9, 0x4673EC, 0x4676EE, 0x4678F1, 0x467BF3, 0x467DF5,
        0x4680F7, 0x4682F9, 0x4685FA, 0x4587FC, 0x458AFD, 0x448CFE, 0x448FFE, 0x4391FF,
        0x4294FF, 0x4196FF, 0x3F99FF, 0x3E9BFF, 0x3D9EFE, 0x3BA1FD, 0x3AA3FD, 0x38A6FB,
        0x36A8FA, 0x35ABF9, 0x33ADF7, 0x31B0F6, 0x2FB2F4, 0x2DB5F2, 0x2CB7F0, 0x2AB9EE,
        0x28BCEC, 0x26BEEA, 0x25C0E7, 0x23C3E5, 0x21C5E2, 0x20C7E0, 0x1FC9DD, 0x1DCCDB,
        0x1CCED8, 0x1BD0D5, 0x1AD2D3, 0x19D4D0, 0x18D6CD, 0x18D8CB, 0x18DAC8, 0x17DBC5,
        0x17DDC3, 0x17DFC0, 0x18E0BE, 0x18E2BB, 0x19E3B9, 0x1AE5B7, 0x1BE6B4, 0x1DE8B2,
        0x1EE9AF, 0x20EAAD, 0x22ECAA, 0x24EDA7, 0x27EEA4, 0x29EFA1, 0x2CF09E, 0x2FF19B,
        0x32F298, 0x35F394, 0x38F491, 0x3CF58E, 0x3FF68B, 0x43F787, 0x46F884, 0x4AF980,
        0x4EFA7D, 0x51FA79, 0x55FB76, 0x59FC73, 0x5DFC6F, 0x61FD6C, 0x65FD69, 0x69FE65,
        0x6DFE62, 0x71FE5F, 0x75FF5C, 0x79FF59, 0x7DFF56, 0x80FF53, 0x84FF50, 0x88FF4E,
        0x8BFF4B, 0x8FFF49, 0x92FF46, 0x96FF44, 0x99FF42, 0x9CFE40, 0x9FFE3E, 0xA2FD3D,
        0xA4FD3B, 0xA7FC3A, 0xAAFC39, 0xACFB38, 0xAFFA37, 0xB1F936, 0xB4F835, 0xB7F835,
        0xB9F634, 0xBCF534, 0xBFF434, 0xC1F334, 0xC4F233, 0xC6F033, 0xC9EF34, 0xCBEE34,
        0xCEEC34, 0xD0EB34, 0xD2E934, 0xD5E835, 0xD7E635, 0xD9E435, 0xDBE236, 0xDDE136,
        0xE0DF37, 0xE2DD37, 0xE4DB38, 0xE6D938, 0xE7D738, 0xE9D539, 0xEBD339, 0xEDD139,
        0xEECF3A, 0xF0CD3A, 0xF1CB3A, 0xF3C93A, 0xF4C73A, 0xF5C53A, 0xF7C33A, 0xF8C13A,
        0xF9BF39, 0xFABD39, 0xFABA38, 0xFBB838, 0xFCB637, 0xFCB436, 0xFDB135, 0xFDAF35,
        0xFEAC34, 0xFEA933, 0xFEA732, 0xFEA431, 0xFFA12F, 0xFF9E2E, 0xFF9C2D, 0xFF992C,
        0xFE962B, 0xFE932A, 0xFE9028, 0xFE8D27, 0xFD8A26, 0xFD8724, 0xFC8423, 0xFC8122,
        0xFB7E20, 0xFB7B1F, 0xFA781E, 0xF9751C, 0xF8721B, 0xF86F1A, 0xF76C19, 0xF66917,
        0xF56616, 0xF46315, 0xF36014, 0xF25D13, 0xF05B11, 0xEF5810, 0xEE550F, 0xED530E,
        0xEB500E, 0xEA4E0D, 0xE94B0C, 0xE7490B, 0xE6470A, 0xE4450A, 0xE34209, 0xE14009,
        0xDF3E08, 0xDE3C07, 0xDC3A07, 0xDA3806, 0xD83606, 0xD63405, 0xD43205, 0xD23105,
        0xD02F04, 0xCE2D04, 0xCC2B03, 0xCA2903, 0xC82803, 0xC62602, 0xC32402, 0xC12302,
        0xBF2102, 0xBC1F01, 0xBA1E01, 0xB71C01, 0xB41B01, 0xB21901, 0xAF1801, 0xAC1601,
        0xAA1501, 0xA71401, 0xA41201, 0xA11101, 0x9E1001, 0x9B0F01, 0x980D01, 0x950C01,
        0x920B01, 0x8E0A01, 0x8B0901, 0x880801, 0x850701, 0x810602, 0x7E0502, 0x7A0402
    ]
};
