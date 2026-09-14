const money=n=>new Intl.NumberFormat('vi-VN').format(n);
const combos=[
{name:'Lẩu nấm uyên ương DPA',image:'hotpot1',price:1389000,serves:'8–10 người',description:'Gà đen nuôi thảo mộc, chim câu, trứng non, bắp bò, kê gà, mọc. Kèm rau, mì gạo, 6 loại nấm tươi và đậu non.'},
{name:'Lẩu Thái chua cay đặc biệt',image:'hotpot2',price:1100000,serves:'Set lẩu đặc biệt',description:'Gà, bắp bò, sườn sụn, tôm rảo, cá chép giòn, mực và ngao tươi. Nước dùng chua cay kiểu Thái, kèm rau theo mùa.'},
{name:'Lẩu Tứ Xuyên hai ngăn',image:'hotpot3',price:1199000,serves:'8–10 người',description:'Hai vị nước dùng: cay tê và lẩu sữa. Sụn sườn, gầu bò, bắp bò, ba chỉ bò Mỹ, bao tử heo, bao tử bò, rau và đậu non.'},
{name:'Lẩu tôm bầu',image:'hotpot4',price:950000,serves:'Set lẩu đặc biệt',description:'Tôm rảo tươi, viên mọc tôm cùng nước dùng riêu cua và gạch cua. Kèm đậu phụ chiên, phồng tôm, dưa chuột và rau nhúng lẩu.'}
];
const best=[...combos.slice(0,3),{name:'Lẩu ốc DPA',image:'snail',price:890000,description:'Hương vị Hà Nội với ốc giòn, nước lẩu chua cay thơm dấm bỗng, sả và cà chua.'},{name:'Cá quả nướng bọt biển',image:'fish',price:389000,description:'Cá nướng thơm, thịt mềm ngọt, dùng cùng rau tươi và nước chấm đậm đà.'}];
function feature(item,isBest=false){return `<article class="feature-card"><img src="assets/${item.image}.jpg" alt="${item.name}" ${isBest?'loading="lazy"':''} width="260" height="260"><div class="feature-body"><h3>${item.name}</h3>${!isBest&&item.serves?`<span class="serves">${item.serves}</span>`:''}<p>${item.description}</p><div class="price">${money(item.price)} <small>đ</small></div></div></article>`}
document.getElementById('combo-list').innerHTML=combos.map(x=>feature(x)).join('');
document.getElementById('best-list').innerHTML=best.map(x=>feature(x,true)).join('');
const starters=[['Bánh đa','ricecracker',20000],['Lạc cháy tỏi','peanuts',20000],['Dưa chuột chẻ','cucumber',30000],['Ngô chiên bơ','corn',50000],['Xúc xích DPA','sausage',50000],['Đậu chiên giòn / rim hành / chiên sả','tofu',50000],['Khoai tây lắc phô mai','fries',69000],['Nem Hải Phòng','nem',75000],['Đậu phụ sốt Tứ Xuyên','mapo',79000]];
const draft=[['Bia Liquan Vàng','beer1',33000],['Bia tươi Budweiser','beer2',39000],['Tháp bia Budweiser','beer3',360000]];
const beers=[['Bia 333 lon','beer4',18000],['Bia 333 chai','beer5',18000],['Bia Hà Nội','beer6',19000]];
function menu(items,id){document.getElementById(id).innerHTML=items.map(([name,image,price])=>`<article class="menu-item"><img src="assets/${image}.jpg" alt="${name}" width="132" height="132" loading="lazy"><div class="menu-text"><h4>${name}</h4><strong>${money(price)}đ</strong></div></article>`).join('')}
menu(starters,'starter-list');menu(draft,'draft-list');menu(beers,'beer-list');
document.querySelectorAll('[data-scroll]').forEach(button=>button.addEventListener('click',()=>{const list=document.getElementById(button.dataset.scroll);const amount=list.querySelector('article').getBoundingClientRect().width+20;list.scrollBy({left:Number(button.dataset.dir)*amount,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'})}));
const links=[...document.querySelectorAll('nav a')];const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){links.forEach(link=>link.classList.toggle('active',link.hash==='#'+entry.target.id))}})},{rootMargin:'-15% 0px -65% 0px'});document.querySelectorAll('main section,footer').forEach(section=>observer.observe(section));
