!function(t,e){"function"==typeof define&&define.amd?define([],e):"object"==typeof exports?module.exports=e():t.Tour=e()}(this,function(){"use strict";function t(t,e){return function(){return t.apply(e,arguments)}}function e(t){return"tourjs-"+(t?t+"-":"")+u++}function i(t){function e(){4==i.readyState&&200==i.status&&(f=document.createElement("div"),f.innerHTML=i.responseText,t.success&&t.success())}var i=new XMLHttpRequest;i.onreadystatechange=e,i.open("GET",t.svg||"dist/svg/defs.svg",!0),i.send()}function o(t){var e=t.getBoundingClientRect(),i=n();return e.right=i.width-e.right,e.bottom=i.height-e.bottom,e}function n(){var t=document.documentElement;return{width:window.innerWidth||t.clientWidth,height:window.innerHeight||t.clientHeight}}function s(t,e){e=e||{};var i=f.querySelector(t).cloneNode(!0);return i.setAttribute("class","tourjs-shape"),e.transform&&i.setAttribute("transform",e.transform),i}function h(i){return this instanceof h?(this.id=e("hint"),this.options=i||{},void(this._setPosition=t(this._setPosition,this))):new h(i)}function d(e){this.hint=e,this._setPosition=t(this._setPosition,this)}function l(t){this.id=e(),this.hints=t,this.highlights=[],this.hints.forEach(function(t){this.highlights.push(new d(t))}.bind(this))}function r(i){return this instanceof r?(this.id=e("overview"),this.options=i||{},void(this._setPosition=t(this._setPosition,this))):new r(i)}function p(t){return this instanceof p?(this.id=e("step"),this.options=t.options||{},this._initOverview(this.options.overview),this.overlay=new l(t.hints),this.hints=[],void t.hints.forEach(function(t){this.hints.push(new h(t))}.bind(this))):new p(t)}function a(i){return this instanceof a?(this._onKeyUp=t(this._onKeyUp,this),this._onLoad=t(this._onLoad,this),this.unload=t(this.unload,this),this.id=e(),this.options=i.options||{},void this._initSteps(i.steps)):new a(i)}var u,c,f,v;return u=0,c=10,v="http://www.w3.org/2000/svg",h.prototype={load:function(t){this.node||(this.node=document.createElement("div"),this.node.id=this.id,this.node.className="tourjs-hint",this.node.classList.add("tourjs-"+this.options.position+(this.options.inverted?"-inverted":"")),this.node.classList.add("tourjs-"+this.options.type),this._renderTooltip(),this._renderShape(),document.getElementById(this.id)||t.appendChild(this.node),this._setPosition()),window.addEventListener("resize",this._setPosition),window.addEventListener("scroll",this._setPosition)},unload:function(){window.removeEventListener("resize",this._setPosition),window.removeEventListener("scroll",this._setPosition)},_setPosition:function(){var t=o(document.querySelector(this.options.target)),e=o(this.node);switch(this.options.type){case"arrow":switch(this.options.position){case"top-left":this.node.style.top=t.top-e.height-c+"px",this.node.style.left=t.left-e.width-c+"px";break;case"top":this.node.style.top=t.top-e.height-c+"px",this.node.style.left=t.left+t.width/2-e.width/2+"px";break;case"top-right":this.node.style.top=t.top-e.height-c+"px",this.node.style.left=t.left+t.width+c+"px";break;case"right":this.node.style.top=t.height>e.height?t.top+(t.height-e.height)/2+"px":t.top-(e.height-t.height)/2+"px",this.node.style.left=t.left+t.width+c+"px";break;case"bottom-right":this.node.style.top=t.bottom+c+"px",this.node.style.left=t.left+t.width+c+"px";break;case"bottom":this.node.style.top=t.bottom+c+"px",this.node.style.left=t.left+t.width/2-e.width/2+"px";break;case"bottom-left":this.node.style.top=t.bottom+c+"px",this.node.style.left=t.left-e.width-c+"px";break;case"left":this.node.style.top=t.height>e.height?t.top+(t.height-e.height)/2+"px":t.top-(e.height-t.height)/2+"px",this.node.style.left=t.left-e.width-c+"px"}break;case"curved-arrow":switch(this.options.position){case"top-left":this.node.style.top=t.top-e.height-c+"px",this.node.style.left=t.left-e.width-c+"px";break;case"top":this.node.style.top=t.top-e.height-c+"px",this.node.style.left=this.options.inverted?t.left+t.width/2-e.width+16+"px":t.left+t.width/2-16+"px";break;case"top-right":this.node.style.top=t.top-e.height-c+"px",this.node.style.left=t.left+t.width+c+"px";break;case"right":this.node.style.top=t.height>e.height?this.options.inverted?t.top+t.height/2-e.height+16+"px":t.top+t.height/2+"px":this.options.inverted?t.top-t.height/2-e.height/2+12+"px":t.top+t.height/2-16+"px",this.node.style.left=t.left+t.width+c+"px";break;case"bottom-right":this.node.style.top=t.bottom+c+"px",this.node.style.left=t.left+t.width+c+"px";break;case"bottom":this.node.style.top=t.bottom+c+"px",this.node.style.left=this.options.inverted?t.left+t.width/2-16+"px":t.left+t.width/2-e.width+16+"px";break;case"bottom-left":this.node.style.top=t.bottom+c+"px",this.node.style.left=t.left-e.width-c+"px";break;case"left":this.node.style.top=t.height>e.height?this.options.inverted?t.top+t.height/2-16+"px":t.top-(e.height-t.height/2)+16+"px":this.options.inverted?t.top+t.height/2-e.height/2+24+"px":t.top+t.height/2-e.height+18+"px",this.node.style.left=t.left-e.width-c+"px"}}},_renderDescription:function(t){var e;this.options.description&&(e=document.createElement("div"),e.className="tourjs-description",e.innerHTML=this.options.description,t.appendChild(e))},_renderShape:function(){var t=s("#tourjs-symbol-"+this.options.type+"-"+this.options.position+(this.options.inverted?"-inverted":""));this.node.appendChild(t)},_renderTitle:function(t){var e=document.createElement("h2");e.innerText=this.options.title,t.appendChild(e)},_renderTooltip:function(){var t=document.createElement("div");t.className="tourjs-tooltip",this.options.width&&(this.node.style.width=this.options.width+"px",this.node.style.maxWidth=this.options.width+"px"),this._renderTitle(t),this._renderDescription(t),this.node.appendChild(t)}},d.prototype={load:function(){return this.hint.highlight!==!1?(this.node||(this.node=document.createElementNS(v,"rect"),this.node.setAttributeNS(null,"style","stroke:none;fill:#000;")),this._setPosition(),window.addEventListener("resize",this._setPosition),window.addEventListener("scroll",this._setPosition),this.node):void 0},unload:function(){this.node&&(window.removeEventListener("resize",this._setPosition),window.removeEventListener("scroll",this._setPosition))},_setPosition:function(){var t,e;this.node&&(e=document.querySelector(this.hint.highlight?this.hint.highlight:this.hint.target),t=o(e),this.node.setAttributeNS(null,"x",t.left-c),this.node.setAttributeNS(null,"y",t.top-c),this.node.setAttributeNS(null,"height",t.height+2*c),this.node.setAttributeNS(null,"width",t.width+2*c))}},l.prototype={load:function(t){var e,i,o;this.node?(this.node.style.display="block",this.highlights.forEach(function(t){t.load()})):(this.node=document.createElementNS(v,"svg"),this.node.setAttributeNS(null,"id","overlay-"+this.id),this.node.setAttributeNS(null,"class","tourjs-overlay"),this.node.setAttributeNS(null,"x",0),this.node.setAttributeNS(null,"y",0),this.node.setAttributeNS(null,"height","100%"),this.node.setAttributeNS(null,"width","100%"),e=document.createElementNS(v,"defs"),i=document.createElementNS(v,"mask"),i.setAttributeNS(null,"x",0),i.setAttributeNS(null,"y",0),i.setAttributeNS(null,"height","100%"),i.setAttributeNS(null,"width","100%"),i.setAttributeNS(null,"id","overlay-"+this.id+"-mask"),o=document.createElementNS(v,"rect"),o.setAttributeNS(null,"x",0),o.setAttributeNS(null,"y",0),o.setAttributeNS(null,"height","100%"),o.setAttributeNS(null,"width","100%"),o.setAttributeNS(null,"style","stroke:none;fill:#FFF;"),i.appendChild(o),this.highlights.forEach(function(t){t.load()&&i.appendChild(t.load())}),e.appendChild(i),this.node.appendChild(e),o=document.createElementNS(v,"rect"),o.setAttributeNS(null,"x",0),o.setAttributeNS(null,"y",0),o.setAttributeNS(null,"height","100%"),o.setAttributeNS(null,"width","100%"),o.setAttributeNS(null,"style","stroke:none;fill:rgba(0,0,0,0.6);mask:url(#overlay-"+this.id+"-mask);"),this.node.appendChild(o),t.appendChild(this.node))},unload:function(){this.node&&(this.node.style.display="none",this.highlights.forEach(function(t){t.unload()}))}},r.prototype={load:function(t){var e,i,o;if(!this.node){if(this.node=document.createElement("div"),this.node.id=this.id,this.node.className="tourjs-overview",this.options.width){var n=this.options.width+"px";this.node.style.width=n,this.node.style.maxWidth=n}o=document.createElement("h1"),o.innerText=this.options.title,o.className="tourjs-overview-title",this.node.appendChild(o),this.options.description&&(i=document.createElement("div"),i.className="tourjs-overview-line",i.appendChild(s("#tourjs-symbol-line")),this.node.appendChild(i),e=document.createElement("div"),e.innerHTML=this.options.description,e.className="tourjs-overview-description",this.node.appendChild(e)),document.getElementById(this.id)||t.appendChild(this.node)}return window.addEventListener("resize",this._setPosition),window.addEventListener("scroll",this._setPosition),window.setTimeout(function(){this._setPosition()}.bind(this),0),this.node},unload:function(){window.removeEventListener("resize",this._setPosition),window.removeEventListener("scroll",this._setPosition)},_setPosition:function(){var t=o(this.node);this.node.style.marginLeft=-(t.width/2)+"px",this.node.style.marginTop=-(t.height/2)+"px"}},p.prototype={load:function(t,e){var i=function(){this.node?this.node.style.display="block":(this.node=document.createElement("div"),this.node.id=this.id,this.node.className="tourjs-step",document.getElementById(this.id)||t.appendChild(this.node),this._paginate(t),this._loadOverview()),this.overlay.load(this.node),this.hints.forEach(function(t){t.load(this.node)}.bind(this)),e&&e(this),"function"==typeof this.options.afterLoad&&this.options.afterLoad()}.bind(this);"function"==typeof this.options.beforeLoad?this.options.beforeLoad(i):i()},unload:function(){var t=function(){this.node&&(this.node.style.display="none",this.hints.forEach(function(t){t.unload()})),"function"==typeof this.options.afterUnload&&this.options.afterUnload()}.bind(this);"function"==typeof this.options.beforeUnload?this.options.beforeUnload(t):t()},_initOverview:function(t){t&&!this.overview&&(this.overview=new r(t))},_loadOverview:function(){this.overview&&this.node.appendChild(this.overview.load(this.node))},_paginate:function(t){var e,i,o,n,h,d;if(this.previous||this.next){o=document.createElement("div"),o.className="tourjs-pagination",d=document.createElement("div"),d.className="tourjs-pagination-wrapper",n=document.createElement("div"),n.className="tourjs-previous-step",this.previous&&n.addEventListener("click",function(e){e.stopPropagation(),this.unload(),this.previous.load(t)}.bind(this)),h=s("#tourjs-symbol-chevron-left"),n.appendChild(h),d.appendChild(n);var l=document.createElement("div");l.className="tourjs-step-count",l.innerText="Step "+this.options.index+" of "+this.options.stepCount,d.appendChild(l),e=document.createElement("div"),e.className="tourjs-next-step",this.next&&e.addEventListener("click",function(e){e.stopPropagation(),this.unload(),this.next.load(t)}.bind(this)),i=s("#tourjs-symbol-chevron-right"),e.appendChild(i),d.appendChild(e),o.appendChild(d),this.node.appendChild(o)}}},a.prototype={load:function(){var t=function(){this.node||(this.node=document.createElement("div"),this.node.id=this.id,this.node.className="tourjs",document.getElementById(this.id)||document.body.appendChild(this.node)),i({svg:this.options.svg,success:this._onLoad}),"function"==typeof this.options.afterLoad&&this.options.afterLoad()}.bind(this);"function"==typeof this.options.beforeLoad?this.options.beforeLoad(t):t()},unload:function(){var t=function(){document.removeEventListener("keyup",this._onKeyUp),this.steps.forEach(function(t){t.unload()}),this._unloadCloseButton(),"function"==typeof this.options.afterUnload&&this.options.afterUnload()}.bind(this);"function"==typeof this.options.beforeUnload?this.options.beforeUnload(t):t()},_initSteps:function(t){var e,i,o=1,n=t.length;t&&(this.steps=[],t.forEach(function(t){t.options||(t.options={}),t.options.index=o,t.options.stepCount=n,e=new p(t),this.steps.push(e),i&&(e.previous=i,i.next=e),i=e,o++}.bind(this)))},_onKeyUp:function(t){27===t.keyCode&&this.unload()},_onLoad:function(){document.addEventListener("keyup",this._onKeyUp),this._loadCloseButton(),this._loadFirstStep(),"function"==typeof this.options.afterLoad&&this.options.afterLoad()},_loadFirstStep:function(){this.loadStep(1)},loadStep:function(t){this.steps.forEach(function(e){e=this.steps[t-1],e.options.index===t?e.load(this.node):e.unload()}.bind(this))},_loadCloseButton:function(){var t=document.getElementById("tourjs-close");t||(t=s("#tourjs-symbol-close"),t.id="tourjs-close",this.node.appendChild(t)),t.addEventListener("click",this.unload),t.style.display="block"},_unloadCloseButton:function(){var t=document.getElementById("tourjs-close");t&&(t.style.display="none",t.removeEventListener("click",this.unload))}},a});