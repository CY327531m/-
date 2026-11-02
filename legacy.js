
import QRCode from 'qrcode';

/* ============ 媒体（照片优先 + 极简占位） ============ */
const _cv=n=>getComputedStyle(document.documentElement).getPropertyValue(n).trim();
const C_RED='#c8342f', C_GOLD='#d9b96b', C_OLIVE=_cv('--olive'), C_LABEL=_cv('--label-dim'),
      C_NODE=_cv('--node-red'), C_INK=_cv('--ink'), C_LABEL_HI=_cv('--label-bright'), C_GOLD_HI=_cv('--gold-hi');
const ART={
  'ex-medal':`<svg viewBox="0 0 64 64" width="140" height="140"><path d="M20 5 L16 20 M44 5 L48 20" stroke="rgba(200,52,47,.4)" stroke-width="3" fill="none" stroke-linecap="round"/><circle cx="32" cy="33" r="12.5" fill="rgba(200,52,47,.1)" stroke="rgba(217,185,107,.5)" stroke-width="1.4"/><path d="M32 24 L34.6 29.7 L40.7 30.4 L36 34.9 L37.5 41 L32 37.8 L26.5 41 L28 34.9 L23.3 30.4 L29.4 29.7 Z" fill="rgba(217,185,107,.4)"/><circle cx="49" cy="46" r="6" fill="rgba(200,52,47,.08)" stroke="rgba(217,185,107,.35)" stroke-width="1"/><rect x="46.8" y="43.8" width="4.4" height="4.4" fill="none" stroke="rgba(217,185,107,.28)" stroke-width="0.9"/></svg>`,
  'ex-callig':`<svg viewBox="0 0 64 64" width="140" height="140"><path d="M14 20 C 22 14, 42 14, 50 20 L50 44 C 42 50, 22 50, 14 44 Z" fill="none" stroke="rgba(217,185,107,.45)" stroke-width="1.3"/><rect x="11" y="16" width="5" height="32" rx="2.5" fill="rgba(217,185,107,.3)"/><rect x="48" y="16" width="5" height="32" rx="2.5" fill="rgba(217,185,107,.3)"/><path d="M20 27 C 26 24, 34 24, 40 27" fill="none" stroke="rgba(217,185,107,.32)" stroke-width="1.1"/><path d="M20 33 C 26 30, 34 30, 40 33" fill="none" stroke="rgba(217,185,107,.28)" stroke-width="1.1"/><path d="M20 39 C 26 36, 34 36, 40 39" fill="none" stroke="rgba(217,185,107,.28)" stroke-width="1.1"/></svg>`,
  'ex-map':`<svg viewBox="0 0 64 64" width="140" height="140"><path d="M10 11 L54 11 L54 45 L10 45 Z" fill="rgba(217,185,107,.05)" stroke="rgba(217,185,107,.42)" stroke-width="1.2"/><path d="M13 21 C 25 15, 41 25, 51 19" fill="none" stroke="rgba(217,185,107,.22)" stroke-width="0.9"/><path d="M13 30 C 25 24, 41 34, 51 28" fill="none" stroke="rgba(217,185,107,.22)" stroke-width="0.9"/><path d="M13 39 C 25 33, 41 43, 51 37" fill="none" stroke="rgba(217,185,107,.22)" stroke-width="0.9"/><path d="M18 41 L31 32 L46 38" fill="none" stroke="rgba(200,52,47,.45)" stroke-width="1.5"/></svg>`
};
function mediaHTML(id, type, name){
  const art=ART[id];
  const fb = art ? art : `<span class="pf-ring">${type}</span>`;
  return `<div class="ph-fallback">${fb}<span class="pf-name">${name}</span></div>`+
         `<img class="ph" src="${PIC[id+'.jpg']||''}" alt="${name}" loading="eager" decoding="async" onerror="this.style.display='none'">`+
         `<span class="chip">${type}</span>`;
}

/* ============ 数据 ============ */
const SITES = [
  {id:'memorial', name:'成都战役纪念馆', core:true, x:330, y:120,
   tag:'核心展馆',
   desc:'纪念馆位于铜鼓村1组，与烈士陵园隔路相望。馆内陈列书籍21本、老兵捐赠的徽章钱币9枚、题词4副；门前标牌上镌刻着三个称号：四川省国防教育基地、成都市爱国主义教育基地、文明实践基地。这些称号，体现了其作为爱国主义与国防教育基地的功能定位。',
   meta:['位置：铜鼓村1组','称号：省国防教育基地 / 市爱国主义教育基地','展陈：书籍21本 / 徽章钱币9枚 / 题词4副']},
  {id:'cemy', name:'成都战役烈士陵园', core:true, x:400, y:170,
   tag:'纪念地',
   desc:'陵园于2008年4月建成，占地19.72亩，园内建有主题浮雕墙、烈士墓区、纪念碑与纪念广场，遍植松柏。这里安葬着216名烈士，其中133名留有姓名、84名无名；2016年7月，蒲江籍维和烈士李磊长眠于此。2026年6月，216座烈士墓碑完成修缮描金，陵园以更庄重的面貌迎接瞻仰。这里是开展纪念与缅怀活动的重要场所。',
   meta:['建成：2008年4月','占地：19.72亩','墓碑：216座（2026年6月修缮描金）']},
  {id:'wall', name:'英烈墙', core:false, x:300, y:175,
   tag:'纪念地',
   desc:'英烈墙上的第一个名字是“王宪聚”。他本名王献聚，系解放军第16军137团指导员，在吴山坡战斗中率部歼敌约两千后壮烈牺牲。当年刻字误了一字，至今未改。2019年，他的亲外孙在网上读到一篇《成都战役之中兴场战斗》，循着线索寻到铜鼓村，才第一次见到了外祖父的名字。英烈墙镌刻着烈士名录，供瞻仰凭吊。',
   meta:['有名烈士：133名','无名烈士：84名','首位英烈：王宪聚（王献聚）']},
  {id:'hospital', name:'战地医院旧址', core:false, x:230, y:150,
   tag:'红色旧址',
   desc:'这里曾是救治伤员的地方。村里投入200万元财政资金进行保护提升，复原了当年的场景。这里复原了当年的救治场景，是了解战役后勤保障的重要点位。',
   meta:['类型：红色旧址','保护提升：财政200万元']},
  {id:'well', name:'弹痕水井（王陵基沉印井）', core:false, x:200, y:230,
   tag:'红色旧址',
   desc:'井壁上仍留有弹痕。据村中讲解员讲述，1949年王陵基溃逃时，曾将官印沉入这口井中。井壁弹痕至今犹存，是那段战事的实物印记。',
   meta:['类型：红色旧址','看点：弹痕遗迹']},
  {id:'chen', name:'陈水碾林盘', core:false, x:160, y:300,
   tag:'红色林盘',
   desc:'这是一处典型的川西林盘，竹林掩映、老树葱茏、水渠环绕。环境整治中，又新增了同心石、军民同心像、观景平台和一条林中栈道。',
   meta:['类型：林盘节点','配套：同心石 / 军民同心像']},
  {id:'hydro', name:'水文水电博物馆', core:false, x:150, y:360,
   tag:'研学场馆',
   desc:'这是一座展示水电发展历史的展馆。祭奠仪式结束后，参观者常会顺路前来参观。',
   meta:['类型：研学场馆','主题：水电发展史']},
  {id:'wushan', name:'吴山坡战斗遗址', core:false, x:470, y:120,
   tag:'战斗遗址',
   desc:'王献聚曾率部在此作战，歼敌约两千。讲解员讲述这段历史时，常以山势与战壕方位为参照。吴山坡是成都战役的重要战场之一。',
   meta:['战役：吴山坡战斗','战果：歼敌约两千']},
  {id:'minxin', name:'军民同心像·同心石', core:false, x:260, y:340,
   tag:'红色地标',
   desc:'军民同心像与同心石由水美乡村项目兴建，矗立在烈士陵园与村内水系之间。这组景观承载着军民团结共建的寓意。',
   meta:['类型：公共艺术节点','位置：陵园与水系之间']},
  {id:'wumian', name:'五面山歼敌态势遗址', core:false, x:520, y:200,
   tag:'战斗遗址',
   desc:'这里是《五面山歼敌态势图》标注的战场之一。1949年12月24日，《人民日报》刊登了解放军攻克蒲江的消息，五面山一带正是围歼敌军的关键地段。五面山围歼是成都战役的关键环节。',
   meta:['史料：五面山歼敌态势图','见报：1949.12.24《人民日报》']},
  {id:'camp', name:'红色少年营', core:false, x:430, y:250,
   tag:'研学基地',
   desc:'面向中小学生开展的红色实践活动，如“五一少年体验营”。营地以实践活动为载体，面向青少年开展红色教育。',
   meta:['类型：研学基地','活动：五一少年体验营']},
  {id:'fruit', name:'柑橘·猕猴桃产业园', core:false, x:560, y:300,
   tag:'绿色产业',
   desc:'这里种植柑橘6000亩、猕猴桃1400亩，年产果实1.6万吨。除研学外，还开展采摘体验与果树认养。',
   meta:['柑橘：6000亩','猕猴桃：1400亩','年产：1.6万吨']},
  {id:'road', name:'研学绿道', core:false, x:360, y:300,
   tag:'研学配套',
   desc:'村里修建了4公里天府绿道，改造2.3公里产业道路，将各红色点位串联成线。',
   meta:['天府绿道：4公里','产业道路：2.3公里']},
  {id:'cold', name:'铜福果业冷链物流中心', core:false, x:560, y:380,
   tag:'集体经济',
   desc:'这座冷库由铜鼓村与邻村合建，采收后的果实可直接入库储存，两村每年因此增收180万元。',
   meta:['类型：集体经济项目','带动：两村年增收180万元']},
];

const EXHIBITS = [
  {id:'ex-sculpt', name:'群雕《成都战役核心战斗》', tag:'实体雕塑',
   desc:'这是立于村口的青铜群雕，基座上镌刻着“成都战役核心战斗”六个字。举旗、端机枪、投弹，六位战士均作向前冲锋之势。1949年12月，这一带正是主战场。群雕再现成都战役中解放军冲锋的战斗场景。',
   meta:['类别：户外雕塑','铭文：成都战役核心战斗']},
  {id:'ex-relief', name:'红砂岩浮雕墙', tag:'浮雕展陈',
   desc:'陵园入口处，两堵红砂岩浮雕墙夹着上山的台阶。墙上刻有行军、阻击、支前的场面，墙脚则是一段战史碑文。浮雕呈现了当年行军、阻击与支前的场面。',
   meta:['类别：浮雕长墙','位置：陵园入口']},
  {id:'ex-wall', name:'英烈墙上的"王宪聚"', tag:'纪念碑刻',
   desc:'英烈墙上的第一个名字是“王宪聚”。他本名王献聚，是解放军第16军137团指导员，在吴山坡战斗中率部歼敌约两千后壮烈牺牲。当年刻字误了一字，一直未曾更改。2019年，他的亲外孙在网上读到《成都战役之中兴场战斗》，循迹寻至铜鼓村，才第一次见到了外祖父的名字。英烈墙是传承英烈精神的重要载体。',
   meta:['类别：纪念史料','关联点位：英烈墙']},
  {id:'ex-tribute', name:'陵园碑刻', tag:'纪念地',
   desc:'浮雕墙前立着一块石碑，上刻“成都战役烈士陵园”，碑前常摆着一束白菊。园中安葬着216名烈士，其中133名留有姓名、84名无名；2016年7月，蒲江籍维和烈士李磊长眠于此。2026年6月，216座烈士墓碑完成修缮描金。石碑为园内重要的纪念标志。',
   meta:['类别：碑刻','关联点位：烈士陵园']},
  {id:'ex-bugle', name:'司号员铜像', tag:'馆内雕塑',
   desc:'馆内立着一座司号员铜像，小号手仰头吹号，身后是党徽与红旗浮雕墙。铜像刻画了司号员吹响冲锋号的历史瞬间。',
   meta:['类别：馆内雕塑','主题：冲锋号']},
  {id:'ex-oath', name:'入党誓词墙', tag:'现场教学点',
   desc:'陵园旁有一面红墙，上刻入党誓词全文，墙前立着“不忘初心、牢记使命”八个立体大字。前来研学的党员常在此重温入党誓词。入党誓词墙是开展党性教育、重温入党誓词的重要场所。',
   meta:['类别：宣誓景墙','功能：重温入党誓词']},
  {id:'ex-quote', name:'"三个怎么来"墙', tag:'题词展陈',
   desc:'一面红色大墙上，镌刻着那三句话：不能忘记红色政权是怎么来的、新中国是怎么来的、今天的幸福生活是怎么来的。这段题词强调铭记来路、不忘初心，是开展爱国主义教育的重要内容。',
   meta:['类别：嘱托墙','字数：三句']},
  {id:'ex-book', name:'战役文献展柜', tag:'文献整理',
   desc:'展柜中陈列着《成都战役参战同忆录》《十六军征战纪实》等书籍。近年来，村里走访老将军、老战士，累计整理约100万字档案资料，编成5册成都战役读本，用作党员培训教材与中小学生课外读物。这些读本用作党员培训教材与中小学生课外读物，发挥着传承历史的作用。',
   meta:['体量：约100万字档案','成果：读本5册']},
  {id:'ex-medal', name:'老兵捐的徽章钱币', tag:'实物展陈',
   desc:'展出的9枚徽章与钱币，均由参战老兵捐赠。这些徽章钱币由参战老兵捐赠，是那段历史的珍贵实物。',
   meta:['数量：徽章钱币9枚','来源：参战老兵捐献']},
  {id:'ex-callig', name:'名家题词', tag:'文献展陈',
   desc:'馆内悬挂着4副题词，出自马识途、王晓、左良等名家之手。',
   meta:['题词人：马识途 / 王晓 / 左良','数量：题词4副']},
  {id:'ex-map', name:'五面山歼敌态势图', tag:'史料图件',
   desc:'这幅《成都战役蒲江五面山歼敌态势图》标示了当时的兵力部署。1949年12月24日，《人民日报》刊登了解放军攻克蒲江的消息。该态势图是了解战役部署的重要史料。',
   meta:['史料：五面山态势图','见报：1949.12.24《人民日报》']},
];

const STATS = [
  {big:'6000',unit:'亩',cap:'柑橘种植面积'},
  {big:'1400',unit:'亩',cap:'猕猴桃种植面积'},
  {big:'1.6',unit:'万吨',cap:'年产果品'},
  {big:'110',unit:'万元',cap:'2025村集体经济'},
  {big:'3.52',unit:'万元',cap:'村民人均收入'},
  {big:'15',unit:'万人次',cap:'2025全村接待游客'},
];

const BARS = [
  {label:'柑橘(亩)',val:6000,disp:'6000亩'},
  {label:'猕猴桃(亩)',val:1400,disp:'1400亩'},
  {label:'年产果品(吨)',val:16000,disp:'1.6万吨'},
  {label:'村集体经济(万元)',val:110,disp:'110万元'},
  {label:'年接待游客(万人次)',val:15,disp:'15万人次'},
];

const TIMELINE = [
  {yr:'1949年12月上旬',title:'大军逼近成都',red:false,desc:'解放战争进入最后阶段，解放军挥师向成都方向疾进，国民党残部则企图背靠康滇、负隅盘踞四川。'},
  {yr:'1949年12月',title:'铜鼓村主战场鏖战',red:true,desc:'成都战役在蒲江县西来镇铜鼓村一带打响，解放军在此阻击敌军，吴山坡一战歼敌约两千。'},
  {yr:'1949年12月24日',title:'《人民日报》刊载攻克蒲江',red:false,desc:'当日，《人民日报》刊载解放军攻克蒲江的消息，五面山歼敌态势图标注的战场成为围歼敌军的关键地域。'},
  {yr:'1949年12月底',title:'成都和平解放',red:true,desc:'成都战役促成成都和平解放与四川全面解放，是解放战争中的最后一次大规模战役。'},
  {yr:'2008年4月',title:'烈士陵园建成',red:false,desc:'成都战役烈士陵园建成，占地19.72亩，安葬有名烈士133名、无名烈士84名，共计216座烈士墓碑；2016年7月，维和烈士李磊归葬于此。2026年6月，216座墓碑完成修缮描金。'},
  {yr:'2016年7月',title:'维和烈士李磊归葬',red:true,desc:'2016年7月10日，蒲江籍90后战士李磊在南苏丹联合国维和任务中遭炮火袭击牺牲，年仅22岁，被追记一等功，联合国授予哈马舍尔德勋章。7月22日，他的骨灰安葬于成都战役烈士陵园，上万家乡人冒雨送行——与1949年成都战役牺牲的烈士们长眠于同一片山坡。'},
  {yr:'2021年',title:'全国红色美丽村庄试点',red:false,desc:'铜鼓村被中组部、财政部纳入“推动红色村组织振兴、建设红色美丽村庄”试点，是四川省首批、成都市首个入选村庄。'},
  {yr:'2025年',title:'集体经济 110 万元',red:false,desc:'村集体经济收入110万元，村民人均收入3.52万元，2025年全村接待游客15万人次。'},
];

/* ============ 集章状态 ============ */
const STORE_KEY = 'tonggu_visited_v1';
function loadVisited(){ try{return JSON.parse(localStorage.getItem(STORE_KEY))||[];}catch(e){return [];} }
function saveVisited(a){ try{localStorage.setItem(STORE_KEY,JSON.stringify(a));}catch(e){} }
let visited = loadVisited();

/* ============ 渲染 ============ */
function renderMap(){
  const g = document.getElementById('mapPoints');
  const list = document.getElementById('siteList');
  g.innerHTML=''; list.innerHTML='';
  const NS='http://www.w3.org/2000/svg';
  ROUTE.map(id=>SITES.find(s=>s.id===id)).forEach(s=>{
    const isCore = s.core;
    const done = visited.includes(s.id);
    const no = ROUTE.indexOf(s.id)+1;
    const r = isCore?12:9;
    const c = document.createElementNS(NS,'circle');
    c.setAttribute('cx',s.x); c.setAttribute('cy',s.y); c.setAttribute('r',r);
    c.setAttribute('fill',done?C_OLIVE:(isCore?C_GOLD:C_NODE));
    c.setAttribute('stroke','rgba(240,223,174,.9)'); c.setAttribute('stroke-width','1.4');
    c.setAttribute('data-id',s.id);
    c.style.cursor='pointer';
    c.setAttribute('tabindex','0');c.setAttribute('role','button');
    c.setAttribute('aria-label',no+'. '+s.name);
    c.setAttribute('focusable','true');
    c.addEventListener('click',()=>openSite(s.id));
    c.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openSite(s.id);}});
    g.appendChild(c);
    /* 触控热区：透明大圆，手机上不用精确点中小圆点 */
    const hit=document.createElementNS(NS,'circle');
    hit.setAttribute('cx',s.x); hit.setAttribute('cy',s.y); hit.setAttribute('r','20');
    hit.setAttribute('fill','rgba(0,0,0,0)'); hit.setAttribute('data-id',s.id);
    hit.style.cursor='pointer';
    hit.addEventListener('click',()=>openSite(s.id));
    g.appendChild(hit);
    const num=document.createElementNS(NS,'text');
    num.setAttribute('x',s.x); num.setAttribute('y',s.y+3.6);
    num.setAttribute('text-anchor','middle'); num.setAttribute('font-size','10');
    num.setAttribute('font-weight','600'); num.setAttribute('font-family','serif');
    num.setAttribute('fill',isCore||done?C_INK:C_LABEL_HI);
    num.setAttribute('pointer-events','none');
    num.textContent=no; g.appendChild(num);
    const lb=MAP_LABELS[s.id]||[0,-18,'middle'];
    const t=document.createElementNS(NS,'text');
    t.setAttribute('x',s.x+lb[0]); t.setAttribute('y',s.y+lb[1]);
    t.setAttribute('text-anchor',lb[2]); t.setAttribute('font-size','13');
    t.setAttribute('font-family','serif'); t.setAttribute('fill',C_LABEL);
    t.setAttribute('letter-spacing','0.8');
    t.setAttribute('pointer-events','none');
    t.textContent=s.name; g.appendChild(t);
    const item=document.createElement('div');
    item.className='site-item'+(done?' done':'');
    item.dataset.id=s.id;
    item.setAttribute('role','button');
    item.setAttribute('tabindex','0');
    item.setAttribute('aria-label','查看点位：'+s.name);
    item.innerHTML=`<span class="nm"><i class="dot"></i>${no}. ${s.name}</span>`;
    item.addEventListener('click',()=>openSite(s.id));
    item.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openSite(s.id);}});
    list.appendChild(item);
  });
  routeInit();
}

/* ============ 地图缩放 / 平移（手机端重点） ============ */
(function(){
  const view=document.getElementById('mapView'), zoom=document.getElementById('mapZoom');
  if(!view||!zoom)return;
  let s=1,tx=0,ty=0;
  const SMIN=1,SMAX=3.6;
  function apply(){zoom.style.transform='translate('+tx+'px,'+ty+'px) scale('+s+')';}
  function clamp(){
    const vw=view.clientWidth,vh=view.clientHeight;
    tx=Math.min(0,Math.max(vw-vw*s,tx));
    ty=Math.min(0,Math.max(vh-vh*s,ty));
  }
  function zoomAt(cx,cy,ns){
    ns=Math.max(SMIN,Math.min(SMAX,ns));
    const k=ns/s;
    tx=cx-(cx-tx)*k; ty=cy-(cy-ty)*k; s=ns;
    clamp(); apply();
  }
  /* 窄屏默认视角：放大落位核心区（纪念馆—陵园一带） */
  function mobileView(){
    const vw=view.clientWidth;
    if(!vw||vw>=620)return false;
    const vh=view.clientHeight,k=vw/680;
    s=1.7; tx=vw/2-360*k*s; ty=vh/2-205*k*s;
    clamp(); apply();
    return true;
  }
  function reset(){ if(!mobileView()){ s=1;tx=0;ty=0;apply(); } }
  document.querySelector('.map-ctl').addEventListener('pointerdown',e=>e.stopPropagation());
  document.getElementById('mzIn').addEventListener('click',()=>zoomAt(view.clientWidth/2,view.clientHeight/2,s*1.45));
  document.getElementById('mzOut').addEventListener('click',()=>zoomAt(view.clientWidth/2,view.clientHeight/2,s/1.45));
  document.getElementById('mzReset').addEventListener('click',reset);
  /* 拖动 + 双指捏合 */
  const pts=new Map();
  let dragMoved=false,pinchD0=0,pinchS0=1;
  const gh=document.querySelector('.map-gesture-hint');
  let ghHidden=false;
  view.addEventListener('pointerdown',e=>{
    if(!ghHidden&&gh){ghHidden=true;gh.style.transition='opacity .5s';gh.style.opacity='0';setTimeout(()=>gh.remove(),600);}
    pts.set(e.pointerId,{x:e.clientX,y:e.clientY});
    view.setPointerCapture(e.pointerId);
    if(pts.size===2){
      const a=[...pts.values()];
      pinchD0=Math.hypot(a[0].x-a[1].x,a[0].y-a[1].y); pinchS0=s;
    }
    dragMoved=false;
  });
  view.addEventListener('pointermove',e=>{
    if(!pts.has(e.pointerId))return;
    const prev=pts.get(e.pointerId);
    const dx=e.clientX-prev.x, dy=e.clientY-prev.y;
    pts.set(e.pointerId,{x:e.clientX,y:e.clientY});
    if(pts.size===1){
      if(Math.abs(dx)+Math.abs(dy)>0){
        tx+=dx; ty+=dy;
        if(Math.abs(dx)+Math.abs(dy)>3){dragMoved=true;view.classList.add('grabbing');}
        clamp(); apply();
      }
    }else if(pts.size===2){
      dragMoved=true;
      const a=[...pts.values()];
      const d=Math.hypot(a[0].x-a[1].x,a[0].y-a[1].y);
      const r=view.getBoundingClientRect();
      const mx=(a[0].x+a[1].x)/2-r.left, my=(a[0].y+a[1].y)/2-r.top;
      zoomAt(mx,my,pinchS0*(d/(pinchD0||1)));
    }
  });
  function up(e){
    pts.delete(e.pointerId);
    if(pts.size<2)view.classList.remove('grabbing');
    /* 触摸/平板：pointer capture 会把 click 改派发到 view 而非圆点，
       未拖动时手动补一次命中，保证点按点位可打开详情 */
    if(!dragMoved && e.pointerType!=='mouse'){
      const el=document.elementFromPoint(e.clientX,e.clientY);
      const dot=el && el.closest ? el.closest('#mapSvg circle') : null;
      if(dot) dot.dispatchEvent(new MouseEvent('click',{bubbles:true}));
    }
    setTimeout(()=>{dragMoved=false;},0);
  }
  view.addEventListener('pointerup',up);
  view.addEventListener('pointercancel',up);
  /* 拖动结束后抑制误触发的点位点击 */
  view.addEventListener('click',e=>{
    if(dragMoved){e.stopPropagation();e.preventDefault();}
  },true);
  view.addEventListener('wheel',e=>{
    e.preventDefault();
    const r=view.getBoundingClientRect();
    zoomAt(e.clientX-r.left,e.clientY-r.top,s*(e.deltaY<0?1.18:1/1.18));
  },{passive:false});
  /* 双击 / 双指点按放大 */
  let lastTapT=0,lastTapX=0,lastTapY=0;
  view.addEventListener('pointerup',e=>{
    if(e.pointerType==='mouse')return;
    const now=Date.now();
    if(!dragMoved && now-lastTapT<320 && Math.hypot(e.clientX-lastTapX,e.clientY-lastTapY)<28){
      const r=view.getBoundingClientRect();
      if(s<SMAX-0.05) zoomAt(e.clientX-r.left,e.clientY-r.top,s*1.6); else reset();
      lastTapT=0; return;
    }
    lastTapT=now; lastTapX=e.clientX; lastTapY=e.clientY;
  });
  /* 窄屏默认放大到核心区（纪念馆—陵园一带） */
  function initMobile(){ if(s===1)mobileView(); }
  window.addEventListener('resize',()=>{clamp();apply();});
  /* showPage 在文件末尾才挂到 window，延迟一帧再包装 */
  setTimeout(()=>{
    if(document.getElementById('map').classList.contains('active'))initMobile();
    const _show=window.showPage;
    if(typeof _show==='function'){
      window.showPage=function(id){ const r=_show(id); if(id==='map')setTimeout(initMobile,30); return r; };
    }
  },0);
})();

/* ============ 环线进度：实线推进 + 司号员走位 ============ */
let _wp=null,_wpLen=0,_arrows=[],_bugler=null,_siteArc={},_wpPts=null;
function routeInit(){
  _wp=document.getElementById('walkedPath');
  _bugler=document.getElementById('bugler');
  if(!_wp)return;
  /* 弧长计算只跑一次：路径采样一次缓存，避免每次 renderMap 重复上万次 getPointAtLength */
  if(!_wpPts){
    _wpLen=_wp.getTotalLength();
    _wpPts=[];
    for(let a=0;a<=_wpLen;a+=2){_wpPts.push(_wp.getPointAtLength(a));}
    _siteArc={};
    SITES.forEach(s=>{
      let best=0,bd=1e9;
      for(let i=0;i<_wpPts.length;i++){const p=_wpPts[i];const d=(p.x-s.x)**2+(p.y-s.y)**2;if(d<bd){bd=d;best=i*2;}}
      _siteArc[s.id]=best;
    });
  }
  if(!tourOn){_wp.style.strokeDasharray='0 '+_wpLen;}
  // 方向箭头
  const g=document.getElementById('routeArrows');
  g.innerHTML='';_arrows=[];
  const NS='http://www.w3.org/2000/svg';
  for(let i=1;i<=8;i++){
    const a=_wpLen*i/9;
    const p1=_wp.getPointAtLength(a-2),p2=_wp.getPointAtLength(a+2);
    const ang=Math.atan2(p2.y-p1.y,p2.x-p1.x)*180/Math.PI;
    const t=document.createElementNS(NS,'path');
    t.setAttribute('d','M-7.5,-5.2 L6.5,0 L-7.5,5.2 Z');
    t.setAttribute('fill','rgba(217,185,107,.45)');
    t.setAttribute('transform',`translate(${p2.x},${p2.y}) rotate(${ang})`);
    t.dataset.arc=a;
    g.appendChild(t);_arrows.push(t);
  }
}
function routeProgress(id){
  if(!_wp)return;
  const arc=_siteArc[id]||0;
  _wp.style.transition='stroke-dasharray 1.2s ease';
  _wp.style.strokeDasharray=arc+' '+_wpLen;
  _arrows.forEach(t=>{
    t.setAttribute('fill',parseFloat(t.dataset.arc)<=arc?C_GOLD_HI:'rgba(217,185,107,.45)');
  });
  if(_bugler){
    const p=_wp.getPointAtLength(arc);
    _bugler.setAttribute('opacity','1');
    const from={x:parseFloat(_bugler.getAttribute('x')),y:parseFloat(_bugler.getAttribute('y'))};
    const to={x:p.x+6,y:p.y-40};
    const t0=performance.now(),dur=1100;
    function step(now){
      const k=Math.min(1,(now-t0)/dur),e=k*(2-k);
      _bugler.setAttribute('x',from.x+(to.x-from.x)*e);
      _bugler.setAttribute('y',from.y+(to.y-from.y)*e);
      if(k<1)requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
}
function routeReset(){
  if(_wp){_wp.style.strokeDasharray='0 '+_wpLen;}
  _arrows.forEach(t=>t.setAttribute('fill','rgba(217,185,107,.45)'));
  if(_bugler)_bugler.setAttribute('opacity','0');
}

function renderExhibits(){
  const grid=document.getElementById('exhibitGrid');
  grid.innerHTML='';
  EXHIBITS.forEach((e,i)=>{
    const no=String(i+1).padStart(2,'0');
    const card=document.createElement('div');
    card.className='card';
    card.innerHTML=`<div class="media">${mediaHTML(e.id, e.tag, e.name)}</div>
      <div class="plate"><span class="no">展品 ${no}</span><span>${e.tag}</span></div>
      <div class="body"><h4>${e.name}</h4><p>${e.desc.slice(0,46)}…</p></div>`;
    card.addEventListener('click',()=>openExhibit(e.id));
    grid.appendChild(card);
  });
}

function renderStats(){
  const grid=document.getElementById('statGrid');
  grid.innerHTML='';
  STATS.forEach(s=>{
    const d=document.createElement('div');
    d.className='stat-card';
    d.innerHTML=`<div class="big">${s.big}<span class="unit"> ${s.unit}</span></div>
      <div class="cap">${s.cap}</div>`;
    grid.appendChild(d);
  });
  const bars=document.getElementById('barChart');
  bars.innerHTML='';
  /* 各指标单位不同，条长按对数比例示意量级，避免小数值看不见 */
  const maxLog=Math.max(...BARS.map(b=>Math.log10(b.val)));
  BARS.forEach(b=>{
    const row=document.createElement('div');
    row.className='bar-row';
    row.innerHTML=`<div class="bl">${b.label}</div>
      <div class="bar-track"><div class="bar-fill"></div></div>
      <div class="bv">${b.disp}</div>`;
    bars.appendChild(row);
    requestAnimationFrame(()=>setTimeout(()=>{
      row.querySelector('.bar-fill').style.width=Math.max(4,(Math.log10(b.val)/maxLog*100))+'%';
    },60));
  });
}

function renderTimeline(){
  const tl=document.getElementById('timelineList');
  tl.innerHTML='';
  TIMELINE.forEach((t,k)=>{
    const it=document.createElement('div');
    it.className='tl-item'+(t.red?' red':'');
    it.dataset.idx=k;
    it.innerHTML=`<span class="dot"></span><div class="yr">${t.yr}</div>
      <h4>${t.title}</h4><p>${t.desc}</p>`;
    tl.appendChild(it);
  });
}

/* ============ 弹窗 ============ */
const modal=document.getElementById('modal');
let _siteAudio=null;
function stopSiteAudio(){
  if(_siteAudio){_siteAudio.pause();_siteAudio=null;}
  const b=document.getElementById('mAudioBtn');
  if(b){b.classList.remove('on');b.textContent='🔊 听讲解';}
}
function fillModal(id, tag, title, bodyHTML, metaArr, qrId){
  stopSiteAudio();
  document.getElementById('mTag').textContent=tag;
  document.getElementById('mTitle').textContent=title;
  document.getElementById('mMedia').innerHTML=mediaHTML(id, tag, title);
  document.getElementById('mBody').innerHTML=(qrId?`<button id="mAudioBtn" class="m-audio">🔊 听讲解</button>`:'')+bodyHTML;
  document.getElementById('mMeta').innerHTML=(metaArr||[]).map(m=>`<span>${m}</span>`).join('');
  const qrBox=document.getElementById('mQR');
  if(qrId&&location.protocol==='file:'){
    qrBox.innerHTML=`<div class="qr-txt"><b>研学护照 · 集章打卡</b><br>离线版已内嵌研学护照，点击下方直接打开；线上版可用手机扫码，进度与本站互通。<br><button type="button" class="m-audio" id="mPassBtn">打开研学护照 →</button></div>`;
    document.getElementById('mPassBtn').addEventListener('click',function(){
      if(window.__openPassport)window.__openPassport(qrId);
    });
  }else if(qrId){
    qrBox.innerHTML=`<img alt="扫码打开研学护照" decoding="async" style="background:#fff;">
      <div class="qr-txt"><b>扫码听讲解 · 集章打卡</b><br>用手机扫此码，打开「铜鼓研学护照」：听点位语音讲解，并在手机端完成环线集章，进度与本站互通。</div>`;
    QRCode.toDataURL(location.origin+'/passport.html?site='+qrId,{width:220,margin:1})
      .then(u=>{const im=qrBox.querySelector('img'); if(im)im.src=u;})
      .catch(()=>{const im=qrBox.querySelector('img'); if(im)im.style.display='none';});
    document.getElementById('mAudioBtn').addEventListener('click',function(){
      if(_siteAudio){stopSiteAudio();return;}
      const a=new Audio((window.__TG_AUDIO__&&window.__TG_AUDIO__[qrId])||'audio/'+qrId+'.mp3');
      _siteAudio=a; this.classList.add('on'); this.textContent='⏸ 停止讲解';
      a.onended=a.onerror=()=>stopSiteAudio();
      a.play().catch(()=>stopSiteAudio());
    });
  }else{
    qrBox.innerHTML='';
  }
  modal.classList.add('show');
  document.body.style.overflow='hidden';
  window._lastFocus=document.activeElement;
  document.getElementById('closeModal').focus();
}
function openSite(id){
  const s=SITES.find(x=>x.id===id); if(!s)return;
  fillModal(s.id, s.tag, s.name, `<p>${s.desc}</p>`,
    s.meta.concat(['类型：'+(s.core?'核心点位':'环线点位')]), s.id);
  if(!visited.includes(id)){
    visited.push(id); saveVisited(visited);
    /* 弹窗先呈现，地图/集章/拼图延后一帧再渲染，点击不卡 */
    requestAnimationFrame(()=>requestAnimationFrame(()=>{
      renderMap(); updateCheckin();
      renderPuzzle(id); toastPiece(s);
    }));
  }
}
function openExhibit(id){
  const e=EXHIBITS.find(x=>x.id===id); if(!e)return;
  fillModal(e.id, e.tag, e.name, `<p>${e.desc}</p>`, e.meta);
}
document.getElementById('closeModal').addEventListener('click',closeModal);
modal.addEventListener('click',e=>{if(e.target===modal)closeModal();});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&modal.classList.contains('show'))closeModal();});
function closeModal(){stopSiteAudio();modal.classList.remove('show');document.body.style.overflow='';
  if(window._lastFocus&&window._lastFocus.focus){try{window._lastFocus.focus();}catch(e){}}}

/* ============ 记忆拼图 ============ */
function puzzleSrc(){
  const img=document.querySelector('#map .phead img');
  return img?img.src:'';
}
function buildPuzzle(){
  const box=document.getElementById('puzzle'); if(!box||box.dataset.built)return;
  const src=puzzleSrc();
  box.style.setProperty('--pz',`url("${src}")`);
  const probe=new Image();
  probe.onload=()=>{box.style.aspectRatio=(probe.naturalWidth/probe.naturalHeight).toFixed(3);};
  probe.src=src;
  ROUTE.forEach((id,i)=>{
    const col=i%7,row=Math.floor(i/7);
    const d=document.createElement('div');
    d.className='piece'; d.dataset.id=id;
    d.style.setProperty('--bp',`${col/6*100}% ${row*100}%`);
    d.innerHTML=`<span class="pnum">${i+1}</span><span class="pname"></span>`;
    box.appendChild(d);
  });
  box.dataset.built='1';
}
function renderPuzzle(newId){
  const box=document.getElementById('puzzle'); if(!box)return;
  buildPuzzle();
  box.querySelectorAll('.piece').forEach(p=>{
    const got=visited.includes(p.dataset.id);
    const was=p.classList.contains('got');
    p.classList.toggle('got',got);
    p.classList.remove('new');
    const s=SITES.find(x=>x.id===p.dataset.id);
    p.querySelector('.pname').textContent=got&&s?s.name:'';
    if(got&&!was&&p.dataset.id===newId){
      void p.offsetWidth; p.classList.add('new');
    }
  });
  const total=SITES.length, n=visited.filter(v=>SITES.some(s=>s.id===v)).length;
  box.classList.toggle('done',n>=total&&total>0);
  const foot=document.getElementById('pzFoot');
  if(foot){
    foot.textContent = n>=total ? '拼图完成——铜鼓村的全貌，因你的足迹而点亮。'
      : n>0 ? `已归位 ${n} / ${total} 枚碎片，继续走，画面会越来越完整。`
      : '14 枚碎片，拼出铜鼓村的全貌。';
  }
}
let _pzToastTimer=null;
function toastPiece(site){
  let t=document.getElementById('pzToast');
  if(!t){t=document.createElement('div');t.id='pzToast';document.body.appendChild(t);}
  const total=SITES.length, n=visited.filter(v=>SITES.some(s=>s.id===v)).length;
  t.innerHTML=`<b>碎片归位 · ${ROUTE.indexOf(site.id)+1} 号</b><br>${site.name}（已集 ${n} / ${total}）`;
  t.classList.add('show');
  clearTimeout(_pzToastTimer);
  _pzToastTimer=setTimeout(()=>t.classList.remove('show'),3200);
}

/* ============ 集章进度 ============ */
function updateCheckin(){
  const total=SITES.length, doneCount=visited.filter(v=>SITES.some(s=>s.id===v)).length;
  const pct=Math.round(doneCount/total*100);
  document.getElementById('pgHint').textContent=`${doneCount} / ${total} 处红色地标已踏访`;
  document.getElementById('pgFill').style.width=pct+'%';
  const medal=document.getElementById('medal'),medalTxt=document.getElementById('medalTxt'),msg=document.getElementById('pgMsg');
  if(doneCount>=total){
    medal.classList.add('lit');
    medalTxt.innerHTML='研学勋章<br/>14 处都走完了';
    msg.textContent='环线上的点位都看过了。';
  }else if(doneCount>0){
    medal.classList.remove('lit');
    medalTxt.innerHTML='研学进行中<br/>继续往下走';
    msg.textContent='再走 '+ (total-doneCount) +' 处就能点亮勋章。';
  }else{
    medal.classList.remove('lit');
    medalTxt.innerHTML='还没集章<br/>去环线走走';
    msg.textContent='每踏访一处，即可查看该点位的史料说明。';
  }
  renderPuzzle();
}
document.getElementById('resetBtn').addEventListener('click',()=>{
  visited=[];saveVisited(visited);renderMap();updateCheckin();
});

/* ============ 路由 ============ */
const pages=document.querySelectorAll('.page');
let pageHist=[],_navBack=false;
function pageBack(){_navBack=true;showPage(pageHist.pop()||'home');_navBack=false;}
function showPage(id){
  if(tourBtn&&tourBtn.classList.contains('playing'))tourStop();
  const _cur=document.querySelector('.page.active');
  if(!_navBack&&_cur&&_cur.id!==id){pageHist.push(_cur.id);if(pageHist.length>30)pageHist.shift();}
  pages.forEach(p=>p.classList.remove('active'));
  const el=document.getElementById(id);
  if(el)el.classList.add('active');
  document.getElementById('mobileMenu').classList.remove('show');
  document.querySelectorAll('.nav-links a').forEach(a=>a.classList.toggle('on',a.dataset.page===id));
  window.scrollTo({top:0,behavior:'smooth'});
  if(id==='tribute')tbFetch();
}
document.querySelectorAll('[data-page]').forEach(a=>a.addEventListener('click',()=>showPage(a.dataset.page)));
/* 每页页底：返回上一页 / 回到首页 */
document.querySelectorAll('.page').forEach(pg=>{
  if(pg.id==='home')return;
  const nav=document.createElement('div');
  nav.className='page-nav';
  const b1=document.createElement('button');
  b1.type='button';b1.className='pt-link';b1.textContent='← 返回上一页';
  b1.addEventListener('click',pageBack);
  const sep=document.createElement('span');sep.className='pt-sep';sep.textContent='·';
  const b2=document.createElement('button');
  b2.type='button';b2.className='pt-link';b2.textContent='回到首页';
  b2.addEventListener('click',()=>showPage('home'));
  nav.appendChild(b1);nav.appendChild(sep);nav.appendChild(b2);
  pg.appendChild(nav);
});
document.querySelectorAll('[data-goto]').forEach(a=>{
  a.addEventListener('click',()=>showPage(a.dataset.goto));
  if(a.tagName==='DIV'){a.setAttribute('role','link');a.setAttribute('tabindex','0');
    a.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();showPage(a.dataset.goto);}});}
});
/* 深链接：#map / #memorial … 可直接打开某一页（等脚本初始化完再切） */
function pageFromHash(){
  const hid=decodeURIComponent(location.hash.slice(1));
  const el=hid&&document.getElementById(hid);
  if(el&&el.classList.contains('page'))showPage(hid);
}
window.addEventListener('load',pageFromHash);
window.addEventListener('hashchange',pageFromHash);
document.getElementById('hamburger').addEventListener('click',()=>{
  const mm=document.getElementById('mobileMenu');
  mm.classList.toggle('show');
  document.getElementById('hamburger').setAttribute('aria-expanded',mm.classList.contains('show'));
});

/* 产业页 festival 卡片 */
document.querySelector('[data-modal="modal-festival"]').addEventListener('click',()=>{
  fillModal('festival','红色仪式','丰收祭英烈·金果献忠魂',
   `<p>每年猕猴桃成熟时，村民都会摘下第一茬红心果，敬放在烈士墓前。这一仪式至今已延续四届。此仪式延续至今，寄托着村民对烈士的缅怀。</p>`,
   ['周期：每年猕猴桃丰收季','届数：已举办四届']);
});

/* ============ 环线自动漫游 ============ */
const ROUTE=['memorial','wushan','wumian','camp','fruit','cold','road',
             'hydro','chen','minxin','well','hospital','wall','cemy'];
const MAP_LABELS={memorial:[0,-26,'middle'],wushan:[0,-22,'middle'],wumian:[18,2,'start'],
  camp:[0,30,'middle'],fruit:[-18,-8,'end'],cold:[-18,14,'end'],road:[0,28,'middle'],
  hydro:[0,30,'middle'],chen:[-10,-16,'end'],minxin:[0,32,'middle'],well:[-14,-14,'end'],
  hospital:[-10,-16,'end'],wall:[-18,-10,'end'],cemy:[0,32,'middle']};
const TOUR_MS=4500;
let tourIdx=-1, tourTimer=null, tourOn=false, tourPaused=false;
const tourBtn=document.getElementById('tourBtn');
const tourCard=document.getElementById('tourCard');
const tourHint=document.getElementById('tourHint');
const tourPulse=document.getElementById('tourPulse');

function tourHighlight(id){
  document.querySelectorAll('#mapPoints circle').forEach(c=>{
    const s=SITES.find(x=>x.id===c.getAttribute('data-id'));
    const on=c.getAttribute('data-id')===id;
    c.setAttribute('r',on?16:(s&&s.core?11:8));
    c.setAttribute('stroke',on?C_GOLD:'#12100c');
    c.setAttribute('stroke-width',on?3:2);
  });
  const s=SITES.find(x=>x.id===id);
  if(s){tourPulse.setAttribute('cx',s.x);tourPulse.setAttribute('cy',s.y);}
  tourPulse.classList.add('on');
  document.querySelectorAll('.site-item').forEach(it=>{
    const on=it.dataset.id===id;
    it.style.background=on?'#241e18':'';
  });
  /* 只在点位列表容器内部滚动，不再 scrollIntoView 拉动整页——漫游时页面可自由上下滑动 */
  const cur=document.querySelector('.site-item[data-id="'+id+'"]');
  const side=document.querySelector('.map-side');
  if(cur&&side){
    side.scrollTo({top:cur.offsetTop-side.clientHeight/2+cur.clientHeight/2,behavior:'smooth'});
  }
}
function tourShow(i){
  const s=SITES.find(x=>x.id===ROUTE[i]);
  if(!s)return;
  document.getElementById('tcNo').textContent='第 '+(i+1)+' / '+ROUTE.length+' 站';
  document.getElementById('tcName').textContent=s.name;
  document.getElementById('tcDesc').textContent=s.desc;
  tourHighlight(s.id);
  routeProgress(s.id);
}
function tourStep(){
  tourIdx=(tourIdx+1)%ROUTE.length;
  tourShow(tourIdx);
  tourTimer=setTimeout(tourStep,TOUR_MS);
}
function tourStart(){
  tourOn=true;tourPaused=false;
  tourCard.classList.add('on');
  tourBtn.textContent='■ 结束漫游';
  tourBtn.classList.add('playing');
  tourHint.textContent='地图正沿环线行进，每站停留 4.5 秒；点击地图任意位置可暂停，再点继续。';
  tourIdx=-1;tourStep();
}
function tourPause(){
  if(!tourOn||tourPaused)return;
  tourPaused=true;
  clearTimeout(tourTimer);tourTimer=null;
  tourBtn.textContent='▶ 继续漫游';
  const s=SITES.find(x=>x.id===ROUTE[tourIdx]);
  tourHint.textContent='已暂停，停留在「'+(s?s.name:'')+'」。点击地图任意位置或「继续漫游」接着走。';
}
function tourResume(){
  if(!tourOn||!tourPaused)return;
  tourPaused=false;
  tourBtn.textContent='■ 结束漫游';
  tourHint.textContent='地图正沿环线行进，每站停留 4.5 秒；点击地图任意位置可暂停，再点继续。';
  tourTimer=setTimeout(tourStep,TOUR_MS);
}
function tourStop(){
  tourOn=false;tourPaused=false;
  clearTimeout(tourTimer);tourTimer=null;
  tourCard.classList.remove('on');
  tourBtn.textContent='▶ 开始环线漫游';
  tourBtn.classList.remove('playing');
  tourHint.textContent='启动后地图沿环线依次行进，每到一处停留讲解。展厅无人值守时可持续播放。';
  tourPulse.classList.remove('on');
  routeReset();
  renderMap();
}
tourBtn.addEventListener('click',()=>{
  if(!tourOn)tourStart();
  else if(tourPaused)tourResume();
  else tourStop();
});
/* 漫游中点击地图任意位置（非拖动）即暂停/继续，停留在当前点位 */
(function(){
  const view=document.getElementById('mapView');
  if(!view)return;
  let downX=0,downY=0;
  view.addEventListener('pointerdown',e=>{downX=e.clientX;downY=e.clientY;});
  view.addEventListener('click',e=>{
    if(!tourOn)return;
    if(Math.hypot(e.clientX-downX,e.clientY-downY)>12)return; /* 拖动/缩放不算 */
    tourPaused?tourResume():tourPause();
  });
})();

/* ============ 红色问答 ============ */
/* 题目全部锚定 TIMELINE 条目：tl = 战役历程中的索引，判定后引用该条原文 */
const QS=[
 {tl:0,q:'解放战争进入最后阶段，国民党残部企图背靠何处、盘踞四川？',
  o:['康滇','陕甘','湘西','桂北'],a:0},
 {tl:1,q:'成都战役在蒲江县西来镇铜鼓村一带打响，吴山坡一战歼敌约多少人？',
  o:['约两百人','约两千人','约两万人','约五百人'],a:1},
 {tl:2,q:'1949年12月24日，《人民日报》刊载解放军攻克何地？',
  o:['邛崃','蒲江','大邑','新津'],a:1},
 {tl:3,q:'成都战役在解放战争中处于何种历史地位？',
  o:['第一次大规模战役','相持阶段的转折战役','最后一次大规模战役','规模最小的一次战役'],a:2},
 {tl:4,q:'成都战役烈士陵园建成于何时，园内烈士墓碑共多少座？',
  o:['2008年4月，216座','2008年4月，133座','2010年4月，216座','2021年，84座'],a:0},
 {tl:6,q:'2021年，铜鼓村被哪两个部门纳入红色美丽村庄建设试点？',
  o:['中组部、财政部','文旅部、财政部','民政部、财政部','农业农村部、财政部'],a:0}
];
const qE={no:document.getElementById('qNo'),yr:document.getElementById('qYr'),
  text:document.getElementById('qText'),
  opts:document.getElementById('qOpts'),fb:document.getElementById('qFb'),
  next:document.getElementById('qNext'),score:document.getElementById('qScore'),
  num:document.getElementById('qScoreNum'),txt:document.getElementById('qScoreText'),
  back:document.getElementById('qBack')};
let qi=0,qRight=0,qMiss=[],qState=[];
function qRenderProg(){
  const box=document.getElementById('qProg'); if(!box)return;
  box.innerHTML=QS.map(function(_,k){
    let cls='qp';
    if(qState[k]===1)cls+=' right'; else if(qState[k]===2)cls+=' wrong';
    if(k===qi&&qState[k]===0)cls+=' cur';
    return '<span class="'+cls+'">'+(k+1)+'</span>';
  }).join('');
  const answered=qState.filter(function(v){return v>0;}).length;
  document.getElementById('qSideStat').textContent = answered===0
    ? '尚未作答' : '已作答 '+answered+' / '+QS.length+' 题 · 答对 '+qRight+' 题';
}
function qShuffle(a){
  for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));const t=a[i];a[i]=a[j];a[j]=t;}
  return a;
}
function qShow(){
  document.getElementById('qDone').classList.remove('on');
  qE.text.style.display=''; qE.opts.style.display='';
  document.querySelector('#quizBox .q-meta').style.display='';
  const it=QS[qi], src=TIMELINE[it.tl];
  qE.no.textContent=(qi+1)+' / '+QS.length;
  qE.yr.textContent=src.yr+'　'+src.title;
  qE.text.textContent=it.q;
  const opts=qShuffle(it.o.map(function(t,i){return {t:t,ok:i===it.a};}));
  qE.opts.innerHTML=opts.map(function(o,i){
    return '<button class="qopt" data-i="'+i+'">'+o.t+'</button>';}).join('');
  qE.fb.innerHTML='<p class="q-placeholder">作答后，此处即时给出判定，并附上该题对应的战役历程史实原文。</p>';
  qE.next.style.display='none';
  qE.next.textContent=qi===QS.length-1?'查看成绩':'下一题';
  qRenderProg();
  Array.prototype.forEach.call(qE.opts.children,function(b){
    b.addEventListener('click',function(){qAnswer(b,opts);});
  });
}
function qAnswer(btn,opts){
  if(btn.disabled)return;
  const i=+btn.dataset.i,it=QS[qi],src=TIMELINE[it.tl];
  Array.prototype.forEach.call(qE.opts.children,function(b,k){
    b.disabled=true;
    if(opts[k].ok)b.classList.add('ok');
  });
  if(opts[i].ok){qRight++;qState[qi]=1;}
  else{btn.classList.add('no');qMiss.push(it.tl);qState[qi]=2;}
  qRenderProg();
  const head=opts[i].ok?'回答正确。':'正确答案：'+it.o[it.a]+'。';
  qE.fb.innerHTML=head+
    '<div class="q-evi"><div class="e-tag">出处 · 战役历程 · '+src.yr+'</div><p>'+src.desc+'</p></div>';
  qE.next.style.display='inline-block';
}
function qFinish(){
  qE.num.textContent=qRight+' / '+QS.length;
  const miss=[];qMiss.forEach(function(k){if(miss.indexOf(k)<0)miss.push(k);});
  let s=qRight===QS.length?'六题全部答对。'
        :'答对 '+qRight+' 题，答错 '+qMiss.length+' 题。';
  if(miss.length){
    s+='答错的题目涉及战役历程中的 '+miss.length+' 个条目，点击按钮可跳转至对应条目查看。';
    qE.back.innerHTML=miss.map(function(k){
      return '<button class="reset-btn" data-idx="'+k+'">查看相关史实：'+TIMELINE[k].title+'</button>';}).join('');
    Array.prototype.forEach.call(qE.back.children,function(b){
      b.addEventListener('click',function(){gotoTimeline(+b.dataset.idx);});
    });
  }else{qE.back.innerHTML='';}
  qE.txt.textContent=s;
  qE.score.classList.add('on');
  /* 左栏切换为完成面板 */
  qE.text.style.display='none'; qE.opts.style.display='none'; qE.next.style.display='none';
  document.querySelector('#quizBox .q-meta').style.display='none';
  document.getElementById('qDoneNum').textContent=qRight;
  document.getElementById('qDoneTxt').textContent =
    qRight===QS.length ? '全部答对，这段战役的脉络你已经完整走了一遍。'
    : qRight>=4 ? '大部分都答对了，答错的题目可以在右侧跳转回战役历程对应条目。'
    : '没关系，答错的题目正是值得回看的地方，右侧可跳转至对应史实。';
  document.getElementById('qDone').classList.add('on');
  document.getElementById('qFb').innerHTML='<p class="q-placeholder">六道题已全部作答完毕。错题回顾与对应史实原文的跳转按钮在下方成绩单内。</p>';
}
document.getElementById('qDoneAgain').addEventListener('click',qInit);
function gotoTimeline(idx){
  showPage('timeline');
  const items=document.querySelectorAll('#timelineList .tl-item');
  Array.prototype.forEach.call(items,function(n){n.classList.remove('hl');});
  const t=items[idx]; if(!t)return;
  t.classList.add('hl');
  t.scrollIntoView({behavior:'smooth',block:'center'});
}
function qInit(){
  qi=0;qRight=0;qMiss=[];qState=QS.map(function(){return 0;});
  qE.score.classList.remove('on');
  qE.back.innerHTML='';
  qShow();
}
qE.next.addEventListener('click',function(){
  if(qi<QS.length-1){qi++;qShow();}else{qFinish();}
});

/* ============ 致敬留言（云端共享） ============ */
const TB_DEMO=[
  {n:'本地参观者',m:'住在附近，第一次完整读完这段战役的经过。',d:'2026.09.18'},
  {n:'成都游客',m:'带孩子来的。他指着英烈墙上的名字问，为什么有的只有姓、没有名。',d:'2026.10.05'},
  {n:'外省来客',m:'路过蒲江，顺着路牌一路找了过来。',d:'2026.10.26'}
];
let TB_SERVER=[],tbArm=-1,tbTimer=null;
/* 本机持有的删除凭证：{留言id: token}，只有提交者本人（本浏览器）能删 */
const TB_TOK_KEY='tonggu_tribute_tokens';
function tbTokLoad(){ try{return JSON.parse(localStorage.getItem(TB_TOK_KEY))||{};}catch(e){return {};} }
function tbTokSave(o){ try{localStorage.setItem(TB_TOK_KEY,JSON.stringify(o));}catch(e){} }
function tbEsc(s){
  return String(s).replace(/[&<>"']/g,function(c){
    return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});
}
async function tbFetch(){
  const cnt=document.getElementById('tbCnt');
  if(location.protocol==='file:'){ TB_SERVER=tbLocalLoad(); tbRender(); return; }
  try{
    const r=await fetch('/api/tributes');
    if(!r.ok)throw new Error('bad');
    const j=await r.json();
    TB_SERVER=(j.items||[]).map(function(x){
      const d=x.createdAt?String(x.createdAt).slice(0,10).replace(/-/g,'.'):'';
      return {id:x.id,n:x.name,m:x.message,d:d};
    });
  }catch(e){
    TB_SERVER=tbLocalLoad();
  }
  tbRender();
}
/* 离线（单文件）模式：留言存本机 localStorage */
const TB_LOCAL_KEY='tonggu_tributes_local';
function tbLocalLoad(){ try{return JSON.parse(localStorage.getItem(TB_LOCAL_KEY))||[];}catch(e){return [];} }
function tbLocalSave(a){ try{localStorage.setItem(TB_LOCAL_KEY,JSON.stringify(a));}catch(e){} }
function tbRender(){
  const wall=document.getElementById('tbWall'),
        cnt=document.getElementById('tbCnt'),
        clr=document.getElementById('tbClr');
  const toks=tbTokLoad();
  const all=TB_SERVER.concat(TB_DEMO);
  wall.innerHTML=all.map(function(m){
    const own=m.id!=null&&toks[m.id];
    return '<div class="tb-item"><span class="who">'+tbEsc(m.n)+'</span>'+
           '<p class="say">'+tbEsc(m.m)+'</p>'+
           '<div class="tb-foot">'+
             (m.d?'<span class="when">写于 '+tbEsc(m.d)+'</span>':'<span class="when"></span>')+
             (own?'<button class="tb-del'+(m.id===tbArm?' armed':'')+'" type="button" data-id="'+m.id+'">'+
                  (m.id===tbArm?'确认删除':'删除')+'</button>':'')+
           '</div></div>';
  }).join('');
  if(cnt)cnt.textContent=location.protocol==='file:'
    ?'本机留言 '+TB_SERVER.length+' 条 · 仅本机可见'
    :'云端留言 '+TB_SERVER.length+' 条 · 全员可见';
  if(clr)clr.hidden=true;
}
function tbDisarm(){ if(tbTimer){clearTimeout(tbTimer);tbTimer=null;} tbArm=-1;tbRender(); }
(function(){
  const form=document.getElementById('tbForm'),
        nameEl=document.getElementById('tbName'),
        msgEl=document.getElementById('tbMsg'),
        cntEl=document.getElementById('tbCount'),
        noteEl=document.getElementById('tbNote'),
        wallEl=document.getElementById('tbWall');
  msgEl.addEventListener('input',function(){cntEl.textContent=this.value.length;});
  form.addEventListener('submit',async function(e){
    e.preventDefault();
    const msg=msgEl.value.trim();
    if(!msg){noteEl.textContent='留言内容为空，未提交。';msgEl.focus();return;}
    const btn=form.querySelector('.tb-submit');
    btn.disabled=true;noteEl.textContent='正在提交…';
    if(location.protocol==='file:'){
      const arr=tbLocalLoad();
      const id=Date.now();
      const d=new Date();const ds=d.getFullYear()+'.'+String(d.getMonth()+1).padStart(2,'0')+'.'+String(d.getDate()).padStart(2,'0');
      arr.unshift({id:id,n:nameEl.value.trim()||'来访者',m:msg,d:ds});
      tbLocalSave(arr);
      const t=tbTokLoad();t[id]='local';tbTokSave(t);
      msgEl.value='';cntEl.textContent='0';
      noteEl.textContent='留言已保存在本机（离线版留言仅本机可见）。';
      TB_SERVER=arr; tbRender();
      btn.disabled=false;
      return;
    }
    try{
      const r=await fetch('/api/tributes',{method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({name:nameEl.value.trim()||'来访者',message:msg})});
      if(!r.ok)throw new Error('bad');
      const j=await r.json();
      if(j.id&&j.deleteToken){const t=tbTokLoad();t[j.id]=j.deleteToken;tbTokSave(t);}
      msgEl.value='';cntEl.textContent='0';
      noteEl.textContent='留言已提交，所有访客都能看到；本机可删除。';
      await tbFetch();
    }catch(err){
      noteEl.textContent='网络异常，留言未提交，请稍后再试。';
    }finally{
      btn.disabled=false;
    }
  });
  /* 删除自己提交的留言：两步确认，需本机持有凭证 */
  wallEl.addEventListener('click',async function(e){
    const btn=e.target.closest?e.target.closest('.tb-del'):null;
    if(!btn)return;
    const id=+btn.dataset.id;
    if(tbArm!==id){
      if(tbTimer){clearTimeout(tbTimer);}
      tbArm=id;tbRender();
      tbTimer=setTimeout(tbDisarm,4000);
      return;
    }
    if(tbTimer){clearTimeout(tbTimer);tbTimer=null;}
    tbArm=-1;
    const toks=tbTokLoad();
    if(location.protocol==='file:'){
      tbLocalSave(tbLocalLoad().filter(function(x){return x.id!==id;}));
      delete toks[id];tbTokSave(toks);
      noteEl.textContent='已删除该条留言。';
      TB_SERVER=tbLocalLoad(); tbRender();
      return;
    }
    try{
      const r=await fetch('/api/tributes/'+id,{method:'DELETE',
        headers:{'x-delete-token':toks[id]||''}});
      if(!r.ok)throw new Error('bad');
      delete toks[id];tbTokSave(toks);
      noteEl.textContent='已删除该条留言。';
      await tbFetch();
    }catch(err){
      noteEl.textContent='删除失败，请稍后再试。';
      tbRender();
    }
  });
  tbFetch();
})();

/* ============ 初始化 ============ */
renderMap();renderExhibits();renderStats();renderTimeline();updateCheckin();qInit();
/* 暴露给调试与自动化测试 */
window.showPage=showPage;window.openSite=openSite;

