
// ==UserScript==
// @name        Aimbot/esp/chams
// @namespace   https://discord.gg/ENHYznSPmM
// @version      3.0
// @description  Fixed Blue Screen
// @author      Jaguar
// @icon        https://www.google.com/s2/favicons?sz=64&domain_url=kirka.io
// @grant       none
// @run-at      document-start
// @require     https://cdn.jsdelivr.net/npm/three@0.155.0/build/three.min.js#sha256-ec0a84377f1dce9d55b98f04ac7057376fa5371c33ab1cd907b85ae5f18fab7e
// @require     https://cdn.jsdelivr.net/npm/three-mesh-bvh@0.6.3/build/index.umd.cjs#sha256-4781a92a7e9b459164f7f1c4a78f14664ced5d853626640ce3f0aac4d01daf10
// @match       https://kirka.io/*
// ==/UserScript==


var FovSize=40,AimbotKey="Y",ChamsKey="H",MenuKey="O";
function createElement(e,t){const s=document.createElement(t);return e.appendChild(s),s}var Module=class{constructor(e,t,s){this.key=e,this.name=t,this.description=s,this.key=this.key.toUpperCase()}state;onGameEnter(){}onGameExit(){}onTick(){}onKeyDown(e){}onKeyUp(e){}onMouseDown(e){}onMouseUp(e){}};function joinOxfordComma(e){switch(e.length){case 0:return"";case 1:return e[0];case 2:return`${e[0]} and ${e[1]}`;default:return`${e.slice(0,e.length-1).join(", ")}, and ${e[e.length-1]}`}}var ToggleModule=class extends Module{constructor(e,t,s,n,o=0){super(e,t,s),this.modes=n,this.defaultModeIndex=o,this.currentModeIndex=o}currentModeIndex;onKeyDown(e){super.onKeyDown(e),e.key.toUpperCase()===this.key&&(this.currentModeIndex=(this.currentModeIndex+1)%this.modes.length,this.onModeChange())}onModeChange(){}getCurrentMode(){return this.modes[this.currentModeIndex]}isEnabled(){return this.currentModeIndex>0}getMenuItem(){return`[${this.key}] ${this.name}: ${this.getCurrentMode()}`}getDocumentation(){return`**${this.name} (toggle key: ${this.key}, modes: ${joinOxfordComma(this.modes.map(((e,t)=>t===this.defaultModeIndex?`${e} (default)`:e)))})**: ${this.description}`}},MenuModule=class extends ToggleModule{constructor(e,t,s){super(e,"Menu","Displays the status of all features.",["Off","On"],1),this.position=t,this.modules=s}container=void 0;activationKeys=void 0;onGameEnter(){super.onGameEnter(),void 0===this.container&&(this.container=this.state.widgets.createWidget(this.position),this.activationKeys=new Set(this.modules.map((e=>e.key)))),this.isEnabled()&&(this.setVisible(!0),this.updateMenu())}onModeChange(){super.onModeChange(),this.isEnabled()?(this.setVisible(!0),this.updateMenu()):this.setVisible(!1)}onKeyDown(e){super.onKeyDown(e),this.isEnabled()&&this.activationKeys.has(e.key.toUpperCase())&&this.updateMenu()}onKeyUp(e){super.onKeyUp(e),this.isEnabled()&&this.activationKeys.has(e.key.toUpperCase())&&this.updateMenu()}updateMenu(){this.container.innerHTML="",this.appendLine("JaguarWare",18,"white");for(const e of this.modules)this.appendLine(e.getMenuItem(),16,e.isEnabled()?"white":"red")}appendLine(e,t,s){const n=createElement(this.container,"div");n.textContent=e,n.style.fontSize=`${t}px`,n.style.color=s}setVisible(e){this.container.style.display=e?"block":"none"}},WidgetContainer=class{element;constructor(){this.element=createElement(document.body,"div"),this.element.style.zIndex="2147483647",this.setVisible(!1)}setVisible(e){this.element.style.display=e?"block":"none"}createWidget(){const e=createElement(this.element,"div");return e.style.position="absolute",e.style.left="50%",e.style.top="50%",e.style.transform="translate(-50%, -50%)",e.style.zIndex="2147483647",e.style.padding="4px",e.style.borderRadius="10px",e.style.background="linear-gradient(to right, orange, black)",e.style.fontFamily="monospace",e}},Script=class{constructor(e,t,s,n,o,i,a,r,h){this.websiteName=e,this.iconDomain=t,this.requires=s,this.matchPatterns=n,this.changelog=o,this.modules=i,this.state=a;const d=new MenuModule(r,h,i);i.push(d);for(const e of i)e.state=this.state}inGame=!0;init(){this.state.widgets=new WidgetContainer,document.addEventListener("keydown",(e=>{this.onKeyDown(e)})),document.addEventListener("keyup",(e=>{this.onKeyUp(e)})),document.addEventListener("mousedown",(e=>{this.onMouseDown(e)})),document.addEventListener("mouseup",(e=>{this.onMouseUp(e)})),this.setUp()}onGameEnter(){this.inGame=!0,this.state.widgets.setVisible(!0);for(const e of this.modules)e.onGameEnter()}onGameExit(){this.inGame=!0,this.state.widgets.setVisible(!0);for(const e of this.modules)e.onGameEnter()}onTick(){if(this.inGame)for(const e of this.modules)e.isEnabled()&&e.onTick()}onKeyDown(e){if(!this.shouldSkipEvent(e))for(const t of this.modules)t.onKeyDown(e)}onKeyUp(e){if(!this.shouldSkipEvent(e))for(const t of this.modules)t.onKeyUp(e)}onMouseDown(e){if(!this.shouldSkipEvent(e))for(const t of this.modules)t.onMouseDown(e)}onMouseUp(e){if(!this.shouldSkipEvent(e))for(const t of this.modules)t.onMouseUp(e)}shouldSkipEvent(e){if(!this.inGame)return!0;const t=e.target.tagName;return"INPUT"===t||"TEXTAREA"===t||"A"===t||"BUTTON"===t}};function hookApply(e,t,s){e[t]=new Proxy(e[t],{apply(e,t,n){const o=s(...n);return void 0!==o?o:Reflect.apply(e,t,n)}})}var State=class{widgets},KirkaState=class extends State{THREE;MeshBVHLib;game;scene;camera;me;players;entityManager;getOtherPlayers(){return this.scene.children.filter((e=>"Group"===e.type))}getOpponents(){const e=this.getOtherPlayers();return void 0===this.me.team?e:e.filter((e=>e.entity.colyseusObject.team!==this.me.team))}getComponent(e){return this.entityManager._entities.filter((t=>t._components[e])).map((t=>t._components[e]))[0]}},AimbotModule=class extends ToggleModule{holdingRMB=!1;smoothingFactor=1;constructor(){super(AimbotKey,"Aimbot","Aimbot User Issue",["Off","On"])}onMouseDown(e){super.onMouseDown(e),2===e.button&&(this.holdingRMB=!0)}onMouseUp(e){super.onMouseUp(e),2===e.button&&(this.holdingRMB=!1)}onTick(){if(super.onTick(),"On"===this.getCurrentMode()&&!this.holdingRMB)return;const{Vector3:e}=this.state.THREE,t=this.state.me.pos,s=new e(t.x,t.y,t.z).add(this.state.camera.position),n=this.state.getOpponents().filter((e=>e.entity.colyseusObject.isAlive)).map((t=>(new e).copy(t.position).add(t.children[1].position))).sort(((e,t)=>s.distanceToSquared(e)-s.distanceToSquared(t))),o=new e;for(const t of n){if(!this.isInFOV(s,t,FovSize))continue;if(!this.isVisible(s,t))continue;(new e).subVectors(s,t).normalize();const n=this.state.getComponent(44);o.lerp(t,this.smoothingFactor);const i=(new e).subVectors(s,o).normalize();n.x=Math.asin(-i.y),n.y=Math.atan2(i.x,i.z),n.deltaX=0,n.deltaY=0;break}}isInFOV(e,t,s){const{Vector3:n}=this.state.THREE,o=new n(0,0,-1);o.applyQuaternion(this.state.camera.quaternion),o.normalize();const i=(new n).subVectors(t,e);i.normalize();const a=o.dot(i);return 180*Math.acos(a)/Math.PI<=s/2}isVisible(e,t){const{Raycaster:s,Vector3:n}=this.state.THREE,{MeshBVH:o,acceleratedRaycast:i}=this.state.MeshBVHLib;n.prototype.mWwnNTo=n.prototype.distanceTo;const a=new s(e,(new n).subVectors(t,e).normalize(),0,(new n).subVectors(t,e).length());a.firstHitOnly=!0;const r=this.state.scene.children.filter((e=>"Mesh"===e.type));for(const e of r){null===e.geometry.boundingBox&&e.geometry.computeBoundingBox(),void 0===e.geometry.boundsTree&&(e.geometry.boundsTree=new o(e.geometry)),e.matrixWorld=e.wnNWMm;const t=Object.getPrototypeOf(e),s=t.raycast;t.raycast=i;const n=a.intersectObject(e,!1).length;if(e.matrixWorld=void 0,t.raycast=s,n>0)return!1}return!0}};class WallhackModule extends ToggleModule{constructor(){super(ChamsKey,"Chams","Wall Hacks",["Off","On"])}onModeChange(){if(super.onModeChange(),this.isEnabled())this.update();else for(const e of this.state.getOtherPlayers())this.setVisible(e,!1)}onTick(){super.onTick(),this.update()}update(){const e=this.state.getOtherPlayers();let t;t="Chams"===this.getCurrentMode()?new Set(e.map((e=>e.entity.id))):new Set(this.state.getOpponents().map((e=>e.entity.id)));for(const s of e)this.setVisible(s,t.has(s.entity.id))}setVisible(e,t){const s=e.children[0].children[0].children[1].material;s.color.setRGB(0,255,255),s.fog=!t,s.alphaTest=t?.99:1,s.depthTest=!t}}var KirkaScript=class extends Script{constructor(){super("Kirka.io","kirka.io",["https://cdn.jsdelivr.net/npm/three@0.155.0/build/three.min.js#sha256-ec0a84377f1dce9d55b98f04ac7057376fa5371c33ab1cd907b85ae5f18fab7e","https://cdn.jsdelivr.net/npm/three-mesh-bvh@0.6.3/build/index.umd.cjs#sha256-4781a92a7e9b459164f7f1c4a78f14664ced5d853626640ce3f0aac4d01daf10"],["https://kirka.io/*"],[{date:"TODO",changes:["Initial public release."]}],[new AimbotModule,new WallhackModule],new KirkaState,MenuKey,{right:"0",bottom:"50%"})}setUp(){this.state.THREE=window.THREE,delete window.THREE,this.state.MeshBVHLib=window.MeshBVHLib,delete window.MeshBVHLib,hookApply(WeakMap.prototype,"set",(e=>{"Scene"===e.type&&e.children.length>1&&(this.state.scene=e)})),hookApply(window,"requestAnimationFrame",(()=>{this.onTick()})),this.state.players={},hookApply(Object,"defineProperty",((e,t)=>{"fov"===t&&e.wnWmN?this.state.me=e.wnWmN:"isAlive"===t?this.state.players[e.name]=e:"filmGauge"===t&&e.position.y>0?this.state.camera=e:"client"===t?this.state.game=e:"_entityManager"===t&&(this.state.entityManager=e._entityManager)}));let e=!1;setInterval((()=>{const t=null!==document.querySelector(".game-interface");t!==e&&(this.onGameEnter(),e=t)}),100)}},script=new KirkaScript;script.init();
