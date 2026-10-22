const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const root = path.resolve(__dirname, '..');
const type = JSON.parse(fs.readFileSync(path.join(__dirname, 'lettering.json'), 'utf8'));
const colors = { ivory:'#FAF8F5', charcoal:'#1B1917', red:'#C73532', coral:'#EF7770', gold:'#F2B544' };
const markPath = 'M0 112V108Q0 100 8 100V74Q8 58 24 58H44Q60 58 60 74V100H68V54Q68 38 84 38H104Q120 38 120 54V100H128V34Q128 18 144 18H164Q180 18 180 34V100H184Q192 100 192 108V112Z';
const esc = s => s.replaceAll('&','&amp;').replaceAll('<','&lt;');
const svg = (w,h,content,label='Cheap Seats') => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="${label}"><title>${esc(label)}</title>${content}</svg>`;
const rect = (w,h,color,rx=0) => `<rect width="${w}" height="${h}" rx="${rx}" fill="${color}"/>`;
const mark = (x,y,w,color) => `<path fill="${color}" d="${markPath}" transform="translate(${x} ${y}) scale(${w/192})"/>`;
const letters = (key,x,y,width,color) => `<path fill="${color}" d="${type[key].d}" transform="translate(${x} ${y}) scale(${width/type[key].width})"/>`;
const label = (text,x,y,size,color,weight=400) => `<text x="${x}" y="${y}" font-family="Arial,sans-serif" font-size="${size}" font-weight="${weight}" fill="${color}">${esc(text)}</text>`;
const save = (name,data) => { const file = path.join(root,name); fs.mkdirSync(path.dirname(file),{recursive:true}); fs.writeFileSync(file,data); return file; };
const render = async (name,source,w,h) => {const image=sharp(Buffer.from(source)); if(w) image.resize(w,h); await image.png().toFile(path.join(root,name));};
const horizontal = (theme) => {const wordW=590; const height=type.wordmark.height*wordW/type.wordmark.width; return svg(864,160,mark(24,15,192,theme.mark)+letters('wordmark',248,(160-height)/2,wordW,theme.text));};
const themes={light:{mark:colors.red,text:colors.charcoal,bg:colors.ivory},dark:{mark:colors.coral,text:colors.ivory,bg:colors.charcoal},black:{mark:'#000000',text:'#000000'},white:{mark:'#FFFFFF',text:'#FFFFFF'}};
const icon = (fill,bg=null,rounded=false) => svg(512,512,(bg?rect(512,512,bg,rounded?112:0):'')+mark(76,136,360,fill));
const micro = (size) => {const content=rect(16,16,colors.charcoal,3)+'<path fill="'+colors.ivory+'" d="M1 13V12H2V10Q2 9 3 9H4Q5 9 5 10V12H6V7Q6 6 7 6H8Q9 6 9 7V12H10V4Q10 3 11 3H13Q14 3 14 4V12H15V13Z"/>';return svg(16,16,content);};

(async()=>{
  for(const [name,t] of Object.entries(themes)) {
    const logo=horizontal(t);
    save(`logos/cheapseats-horizontal-${name}.svg`,logo);
    await render(`logos/cheapseats-horizontal-${name}.png`,logo,1728,320);
    const wordW=520, wordH=type.wordmark.height*wordW/type.wordmark.width;
    const stacked=svg(640,400,mark(192,40,256,t.mark)+letters('wordmark',60,270,wordW,t.text));
    save(`logos/cheapseats-stacked-${name}.svg`,stacked);
    await render(`logos/cheapseats-stacked-${name}.png`,stacked,1280,800);
    save(`marks/cheapseats-mark-${name}.svg`,svg(192,112,mark(0,0,192,t.mark)));
    save(`marks/cheapseats-symbol-${name}.svg`,icon(t.mark));
    await render(`marks/cheapseats-symbol-${name}.png`,icon(t.mark),1024,1024);
    const wordmark=svg(640,128,letters('wordmark',24,28,592,t.text));
    save(`logos/cheapseats-wordmark-${name}.svg`,wordmark);
  }
  save('marks/cheapseats-mark-currentcolor.svg',svg(192,112,mark(0,0,192,'currentColor')));
  const favicon=svg(64,64,rect(64,64,colors.charcoal,14)+mark(8,17,48,colors.ivory));
  save('web/favicon.svg',favicon);
  save('web/favicon-micro.svg',micro(16));
  fs.mkdirSync(path.join(root,'web'),{recursive:true});
  const icoImages=[];
  for(const size of [16,32,48]) {
    const source=size===16?micro(16):favicon;
    const data=await sharp(Buffer.from(source)).resize(size,size).png().toBuffer();
    save(`web/favicon-${size}.png`,data);
    icoImages.push({size,data});
  }
  const icoHeader=Buffer.alloc(6+16*icoImages.length); icoHeader.writeUInt16LE(1,2); icoHeader.writeUInt16LE(icoImages.length,4);
  let offset=icoHeader.length;
  icoImages.forEach(({size,data},i)=>{const at=6+16*i;icoHeader[at]=size;icoHeader[at+1]=size;icoHeader.writeUInt16LE(1,at+4);icoHeader.writeUInt16LE(32,at+6);icoHeader.writeUInt32LE(data.length,at+8);icoHeader.writeUInt32LE(offset,at+12);offset+=data.length;});
  save('web/favicon.ico',Buffer.concat([icoHeader,...icoImages.map(x=>x.data)]));
  const appIcon=icon(colors.ivory,colors.red);
  save('web/app-icon.svg',appIcon);
  for(const size of [180,192,512]) await render(`web/${size===180?'apple-touch-icon':`icon-${size}`}.png`,appIcon,size,size);
  await render('web/icon-maskable-512.png',svg(512,512,rect(512,512,colors.red)+mark(112,156,288,colors.ivory)),512,512);
  save('web/site.webmanifest',JSON.stringify({name:'Cheap Seats',short_name:'Cheap Seats',id:'/',start_url:'/',display:'standalone',background_color:colors.ivory,theme_color:colors.charcoal,icons:[{src:'icon-192.png',sizes:'192x192',type:'image/png',purpose:'any'},{src:'icon-512.png',sizes:'512x512',type:'image/png',purpose:'any'},{src:'icon-maskable-512.png',sizes:'512x512',type:'image/png',purpose:'maskable'}]},null,2)+'\n');
  fs.mkdirSync(path.join(root,'social'),{recursive:true});
  for(const [name,t] of Object.entries({light:themes.light,dark:themes.dark})) {
    const avatar=icon(name==='light'?colors.ivory:colors.coral,name==='light'?colors.red:colors.charcoal);
    save(`social/avatar-${name}.svg`,avatar);
    await render(`social/avatar-${name}.png`,avatar,1024,1024);
    const card=svg(1200,630,rect(1200,630,t.bg)+mark(96,166,240,t.mark)+letters('wordmark',380,216,710,t.text)+letters('domain',384,332,344,t.text));
    save(`social/og-${name}.svg`,card);
    await render(`social/og-${name}.png`,card,1200,630);
    const banner=svg(1500,500,rect(1500,500,t.bg)+mark(426,129,204,t.mark)+letters('wordmark',672,166,650,t.text)+letters('domain',676,268,300,t.text));
    save(`social/banner-${name}.svg`,banner);
    await render(`social/banner-${name}.png`,banner,1500,500);
  }
  const boardParts=[rect(1600,1220,colors.ivory),label('Cheap Seats / Back Row',64,64,32,colors.charcoal,700)];
  boardParts.push(`<g transform="translate(48 104)">${rect(728,204,'#FFFFFF',16)}<g transform="translate(16 36) scale(.80)">${horizontal(themes.light).replace(/^<svg[^>]*>|<\/svg>$/g,'')}</g></g>`);
  boardParts.push(`<g transform="translate(808 104)">${rect(744,204,colors.charcoal,16)}<g transform="translate(24 36) scale(.80)">${horizontal(themes.dark).replace(/^<svg[^>]*>|<\/svg>$/g,'')}</g></g>`);
  boardParts.push(label('Primary mark',64,370,20,colors.charcoal),mark(80,400,300,colors.red));
  boardParts.push(label('Monochrome',560,370,20,colors.charcoal),mark(576,400,300,colors.charcoal));
  boardParts.push(label('App icon / favicon',1056,370,20,colors.charcoal),`<g transform="translate(1060 405) scale(.4)">${icon(colors.ivory,colors.red,true).replace(/^<svg[^>]*>|<\/svg>$/g,'')}</g>`);
  for(const [i,size] of [16,32,48].entries()) boardParts.push(`<image x="${1310+i*76}" y="466" width="${size}" height="${size}" href="data:image/png;base64,${fs.readFileSync(path.join(root,`web/favicon-${size}.png`)).toString('base64')}"/>`,label(`${size}px`,1300+i*76,550,16,colors.charcoal));
  boardParts.push(label('Social preview / light',64,660,20,colors.charcoal),label('Social preview / dark',824,660,20,colors.charcoal));
  for(const [i,name] of ['light','dark'].entries()) boardParts.push(`<image x="${48+i*760}" y="684" width="744" height="391" href="data:image/png;base64,${fs.readFileSync(path.join(root,`social/og-${name}.png`)).toString('base64')}"/>`);
  boardParts.push(label('IVORY  #FAF8F5',64,1158,18,colors.charcoal),label('CHARCOAL  #1B1917',410,1158,18,colors.charcoal),label('RED  #C73532',820,1158,18,colors.red),label('CORAL  #EF7770',1170,1158,18,colors.red));
  const board=svg(1600,1220,boardParts.join(''),'Cheap Seats Back Row brand overview');
  save('brand-overview.svg',board);
  await render('brand-overview.png',board,1600,1220);
  const files=[];function list(dir){for(const item of fs.readdirSync(dir,{withFileTypes:true})){const p=path.join(dir,item.name);if(item.isDirectory())list(p);else if(!p.includes('/source/'))files.push(path.relative(root,p));}}list(root);
  save('asset-manifest.json',JSON.stringify({brand:'Cheap Seats',concept:'Back Row',colors,files},null,2)+'\n');
  console.log(`Built ${files.length} assets in ${root}`);
})();
