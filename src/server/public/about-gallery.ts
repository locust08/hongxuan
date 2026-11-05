const photographs=[
 {number:'02',label:'Automotive connector housings',width:1600,height:900},
 {number:'03',label:'Automotive clips and fasteners',width:1600,height:1200},
 {number:'04',label:'Insulated electrical terminals',width:1600,height:900},
 {number:'05',label:'H4 headlamp wiring kit',width:1600,height:1600},
 {number:'06',label:'Relay wiring harness kit',width:1600,height:1600},
 {number:'07',label:'Connector housings and terminals',width:1500,height:1500},
 {number:'08',label:'Starter power supply wiring kit',width:1600,height:1600},
];
export function aboutGallery():string {
 return `<section class="about-gallery" aria-labelledby="product-range-heading"><h2 id="product-range-heading">Our product range</h2><p>A selection of Hong Xuan automotive electrical components and wiring products.</p><div class="about-gallery-grid">${photographs.map((photo,index)=>`<figure class="about-product${index===0?' about-product-featured':''}"><a href="/about/products/product-${photo.number}.jpeg" target="_blank" rel="noopener" aria-label="View full-size photo: ${photo.label}"><img class="about-product-photo" src="/about/products/product-${photo.number}.jpeg" alt="${photo.label}" width="${photo.width}" height="${photo.height}" loading="lazy" decoding="async"></a><figcaption>${photo.label}</figcaption></figure>`).join('')}</div></section>`;
}
