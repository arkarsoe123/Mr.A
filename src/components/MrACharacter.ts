// @ts-nocheck
import * as THREE from 'three';

/*
  Mr.A website character
  - Procedural 3D humanoid: no binary model required for the first prototype.
  - Public API:
      MrA.play('idle'|'walk'|'run'|'dance'|'jump'|'happy'|'sad'|'annoyed'|'curious'|'talk'|'hug'|'peek'|'hide')
      MrA.moveTo(percent)
      MrA.say(text)
      MrA.peekBehind(selector)
      MrA.setAutoWander(true/false)
*/

export class MrACharacter {
  constructor(options = {}) {
    this.opt = { scale:1, bottom:12, right:18, autoWander:false, ...options };
    this.state = 'idle';
    this.stateUntil = 0;
    this.hidden = false;
    this.targetX = null;
    this.x = 0;
    this.speed = 0;
    this.clock = new THREE.Clock();
    this.destroyed = false;
    this.parts = {};
    this._buildLayer();
    this._buildScene();
    this._animate();

    if (this.opt.autoWander) {
      setTimeout(() => this._wander(), 1800);
    }
  }

  _buildLayer() {
    this.layer = document.createElement('div');
    this.layer.id = 'mr-a-character-layer';
    Object.assign(this.layer.style, {
      position:'absolute', inset:'0', pointerEvents:'none', zIndex:'2',
      overflow:'visible', transition:'z-index .1s'
    });
    (this.opt.mount || document.body).appendChild(this.layer);

    this.canvas = document.createElement('canvas');
    this.canvas.setAttribute('aria-hidden','true');
    Object.assign(this.canvas.style, {width:'100%',height:'100%',display:'block'});
    this.layer.appendChild(this.canvas);

    this.bubble = document.createElement('div');
    Object.assign(this.bubble.style, {
      position:'fixed', maxWidth:'220px', padding:'9px 12px',
      borderRadius:'14px', background:'rgba(10,16,30,.92)',
      color:'#fff', border:'1px solid rgba(255,255,255,.16)',
      font:'600 13px system-ui,sans-serif', boxShadow:'0 8px 30px rgba(0,0,0,.25)',
      opacity:'0', transform:'translateY(6px)', transition:'opacity .2s,transform .2s',
      pointerEvents:'none'
    });
    this.layer.appendChild(this.bubble);
    window.addEventListener('resize', () => this._resize());
  }

  _buildScene() {
    const width = this.opt.mount?.clientWidth || innerWidth;
    const height = this.opt.mount?.clientHeight || innerHeight;
    this.renderer = new THREE.WebGLRenderer({canvas:this.canvas, alpha:true, antialias:true});
    this.renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    this.renderer.setSize(width, height, false);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(28, width/height, .1, 100);
    this.camera.position.set(0, 1.6, 8.5);
    this.camera.lookAt(0, 1.45, 0);

    const hemi = new THREE.HemisphereLight(0xffffff, 0x23304d, 2.0);
    this.scene.add(hemi);
    const key = new THREE.DirectionalLight(0xffffff, 2.2);
    key.position.set(3,6,5); this.scene.add(key);

    this.root = new THREE.Group();
    this.root.scale.setScalar(this.opt.scale);
    this.scene.add(this.root);

    this._makeBody();
    this._makeFace();

    this.root.position.set(0, -1.25, 0);
    this.x = 0;
  }

  mat(color, metal=0, rough=.55) {
    return new THREE.MeshStandardMaterial({color, metalness:metal, roughness:rough});
  }

  part(geo, material, parent, name) {
    const m = new THREE.Mesh(geo, material);
    m.name = name;
    parent.add(m);
    this.parts[name] = m;
    return m;
  }

  _makeBody() {
    const white = this.mat(0xeaf2ff, .18, .3);
    const dark = this.mat(0x18243b, .55, .28);
    const blue = this.mat(0x4aa8ff, .25, .32);
    const cyan = this.mat(0x79e7ff, .2, .24);
    const black = this.mat(0x07101e, .5, .22);

    this.hips = new THREE.Group(); this.hips.position.y=.95; this.root.add(this.hips);
    this.torso = new THREE.Group(); this.torso.position.y=.72; this.hips.add(this.torso);
    this.part(new THREE.CapsuleGeometry(.58,.78,6,16), white, this.torso, 'torso');

    this.chest = this.part(new THREE.CapsuleGeometry(.49,.58,6,16), dark, this.torso, 'chest');
    this.chest.scale.set(1.12,.72,.8); this.chest.position.z=.02;

    this.neck = new THREE.Group(); this.neck.position.y=.82; this.torso.add(this.neck);
    this.part(new THREE.CylinderGeometry(.16,.18,.22,12), cyan, this.neck, 'neck');
    this.head = new THREE.Group(); this.head.position.y=.55; this.neck.add(this.head);
    this.part(new THREE.SphereGeometry(.54,24,16), white, this.head, 'head');

    this.visor = this.part(new THREE.SphereGeometry(.39,24,12,0,Math.PI*2,0,Math.PI*.55), black, this.head, 'visor');
    this.visor.position.set(0,.05,.43); this.visor.scale.set(1,.62,.34);

    this.eyeL = this.part(new THREE.SphereGeometry(.055,12,8), cyan, this.head, 'eyeL');
    this.eyeR = this.part(new THREE.SphereGeometry(.055,12,8), cyan, this.head, 'eyeR');
    this.eyeL.position.set(-.13,.05,.58); this.eyeR.position.set(.13,.05,.58);

    this.mouth = this.part(new THREE.SphereGeometry(.07,12,8), cyan, this.head, 'mouth');
    this.mouth.scale.set(1,.25,.25); this.mouth.position.set(0,-.15,.58);

    this._limb('armL',-.68,.62,.22,white,blue);
    this._limb('armR', .68,.62,.22,white,blue);
    this._leg('legL',-.27,white,dark);
    this._leg('legR', .27,white,dark);
  }

  _limb(name, x, y, z, skin, accent) {
    const g = new THREE.Group(); g.position.set(x,y,z); this.torso.add(g);
    const upper = this.part(new THREE.CapsuleGeometry(.16,.56,5,10), skin, g, name+'Upper');
    upper.rotation.z = x<0 ? -.12 : .12;
    const fore = new THREE.Group(); fore.position.y=-.58; g.add(fore);
    this.part(new THREE.CapsuleGeometry(.14,.5,5,10), accent, fore, name+'Fore');
    const hand = this.part(new THREE.SphereGeometry(.17,12,8), skin, fore, name+'Hand');
    hand.position.y=-.34;
    this.parts[name] = g;
    return g;
  }

  _leg(name, x, skin, boot) {
    const g = new THREE.Group(); g.position.set(x,.05,0); this.hips.add(g);
    this.part(new THREE.CapsuleGeometry(.19,.68,5,10), skin, g, name+'Upper');
    const shin = new THREE.Group(); shin.position.y=-.62; g.add(shin);
    this.part(new THREE.CapsuleGeometry(.17,.62,5,10), boot, shin, name+'Shin');
    const foot = this.part(new THREE.BoxGeometry(.34,.18,.55), boot, shin, name+'Foot');
    foot.position.set(0,-.38,.12);
    this.parts[name] = g;
    return g;
  }

  _makeFace() {
    this.faceTarget = {happy:0, sad:0, annoyed:0, curious:0};
  }

  _resize() {
    const width = this.opt.mount?.clientWidth || innerWidth;
    const height = this.opt.mount?.clientHeight || innerHeight;
    this.renderer.setSize(width, height, false);
    this.camera.aspect = width/height;
    this.camera.updateProjectionMatrix();
  }

  play(name, duration=0) {
    const allowed = ['idle','walk','run','dance','jump','happy','sad','annoyed','curious','talk','hug','peek','hide'];
    if (!allowed.includes(name)) name='idle';
    this.state = name;
    this.hidden = name === 'hide';
    this.stateUntil = duration ? performance.now()+duration : 0;
    if (name==='talk') this.say('Hello! I am Mr.A.');
    return this;
  }

  moveTo(percent) {
    this.targetX = Math.max(2, Math.min(98, percent));
    this.play('walk');
    return this;
  }

  say(text, ms=2600) {
    this.bubble.textContent = text;
    this.bubble.style.opacity='1';
    this.bubble.style.transform='translateY(0)';
    clearTimeout(this._sayTimer);
    this._sayTimer=setTimeout(()=>{
      this.bubble.style.opacity='0';
      this.bubble.style.transform='translateY(6px)';
    }, ms);
    return this;
  }

  peekBehind(selector) {
    const el = typeof selector==='string' ? document.querySelector(selector) : selector;
    if (!el) return this;
    const r = el.getBoundingClientRect();
    this.targetX = ((r.left+r.width*.5)/innerWidth)*100;
    this.state='peek';
    // Put the character layer below the selected header, while preserving the rest of the page.
    const z = parseInt(getComputedStyle(el).zIndex) || 10;
    this.layer.style.zIndex = String(Math.max(1,z-1));
    this._peekEl = el;
    setTimeout(()=>this.layer.style.zIndex='9999', 1800);
    return this;
  }

  setAutoWander(on) {
    this.opt.autoWander=!!on;
    if (on) this._wander();
    return this;
  }

  _wander() {
    if (!this.opt.autoWander) return;
    const next = 10 + Math.random()*80;
    this.targetX=next;
    this.state=Math.random()<.2?'dance':'walk';
    setTimeout(()=>this._wander(), 4000+Math.random()*3500);
  }

  _animate() {
    if (this.destroyed) return;
    requestAnimationFrame(()=>this._animate());
    const dt = Math.min(this.clock.getDelta(), .05);
    const t = performance.now()/1000;

    if (this.targetX != null) {
      const target = (this.targetX/100*2)-1;
      this.x += (target-this.x) * Math.min(1,dt*2.2);
      if (Math.abs(target-this.x)<.012 && this.state==='walk') this.state='idle';
    }

    const p=this.parts;
    // reset subtle transforms
    this._pose(t);

    const px=(this.x*innerWidth*.48);
    this.root.position.x = THREE.MathUtils.lerp(this.root.position.x, px/70, .18);
    this.root.position.y = -1.25;
    this.root.visible = !this.hidden;

    if (this.state==='hide') this.root.visible=false;
    if (this.state==='peek') {
      this.root.visible=true;
      this.root.position.y=-.9;
      this.root.rotation.y=.22;
    }

    // screen coordinates for speech bubble
    const v = new THREE.Vector3(0,2.8,0).applyMatrix4(this.root.matrixWorld).project(this.camera);
    this.bubble.style.left = `${(v.x*.5+.5)*innerWidth-70}px`;
    this.bubble.style.top = `${(-v.y*.5+.5)*innerHeight-45}px`;

    this.renderer.render(this.scene,this.camera);
  }

  destroy() {
    this.destroyed = true;
    this.renderer?.dispose();
    this.layer?.remove();
  }

  _pose(t) {
    const p=this.parts;
    const s=this.state;
    const walk = Math.sin(t*(s==='run'?10:s==='walk'?6:2.2));
    const bounce = Math.abs(Math.sin(t*3.0));

    // neutral
    p.armL.rotation.z = -.08; p.armR.rotation.z=.08;
    p.armL.rotation.x = 0; p.armR.rotation.x=0;
    p.legL.rotation.x=0; p.legR.rotation.x=0;
    p.head.rotation.z=0; p.head.rotation.y=0;
    p.torso.rotation.z=0; p.torso.rotation.x=0;
    p.mouth.scale.y=.25;
    this.root.rotation.y=0;

    if(s==='idle') {
      this.root.position.y += Math.sin(t*2)*.025;
    } else if(s==='walk' || s==='run') {
      const k=s==='run'?1.35:0.8;
      p.legL.rotation.x=walk*.45*k; p.legR.rotation.x=-walk*.45*k;
      p.armL.rotation.x=-walk*.32*k; p.armR.rotation.x=walk*.32*k;
      this.root.position.y += Math.abs(walk)*.035*k;
    } else if(s==='dance') {
      this.root.position.y += bounce*.12;
      this.root.rotation.y=Math.sin(t*3)*.22;
      p.armL.rotation.z=-1.0+Math.sin(t*6)*.3;
      p.armR.rotation.z=1.0+Math.sin(t*6+1)*.3;
      p.legL.rotation.z=Math.sin(t*6)*.25; p.legR.rotation.z=-Math.sin(t*6)*.25;
    } else if(s==='jump') {
      const j=Math.abs(Math.sin(t*2.2));
      this.root.position.y += j*.9;
      p.armL.rotation.z=-.9; p.armR.rotation.z=.9;
      p.legL.rotation.x=.5; p.legR.rotation.x=.5;
    } else if(s==='happy') {
      p.armL.rotation.z=-.7; p.armR.rotation.z=.7;
      this.root.position.y += bounce*.08;
      p.mouth.scale.y=.65;
    } else if(s==='sad') {
      p.head.rotation.x=.16; p.mouth.scale.y=.12;
      p.armL.rotation.z=.28; p.armR.rotation.z=-.28;
      this.root.position.y -= .08;
    } else if(s==='annoyed') {
      p.head.rotation.z=Math.sin(t*2)*.08; p.mouth.scale.y=.12;
      p.armL.rotation.z=.35; p.armR.rotation.z=-.35;
    } else if(s==='curious') {
      p.head.rotation.z=.18; p.head.rotation.y=Math.sin(t*2)*.12;
      p.armR.rotation.z=.55;
    } else if(s==='talk') {
      p.mouth.scale.y=.25+.2*Math.abs(Math.sin(t*9));
      p.head.rotation.y=Math.sin(t*3)*.04;
      p.armL.rotation.z=-.3; p.armR.rotation.z=.3;
    } else if(s==='hug') {
      p.armL.rotation.z=-1.15; p.armR.rotation.z=1.15;
      p.armL.rotation.x=-.25; p.armR.rotation.x=-.25;
    } else if(s==='peek') {
      p.head.rotation.y=.35; p.head.rotation.z=.08;
      p.armL.rotation.z=-.45; p.armR.rotation.z=.45;
    }
  }
}
