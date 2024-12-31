const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/IndividualMovieDrawer-Cj0JJMBh.js","assets/index-CeKSCuS1.js","assets/index-CfcssPeC.css"])))=>i.map(i=>d[i]);
import{u as O,r as y,c as R,w as j,o as N,a,b as e,t as i,d as h,e as m,F as u,f as _,g,h as k,i as l,j as V,m as T,_ as U,k as B,l as P,n as $}from"./index-CeKSCuS1.js";const F="/assets/athinorama-f9PAEoVM.jpg",W="/assets/imdb-BbzhYrCg.png",Y={class:"card border-0 mb-3 col-lg-6 mx-auto"},q={class:"card-header"},z={class:"d-flex justify-content-between gap-2"},G={class:"text-primary m-0"},H={class:"row g-2"},K={class:"col-12"},J={class:"col-12 d-flex justify-content-start flex-wrap gap-1 align-items-center"},Q={class:"tag-outlined"},X={class:"tag-outlined"},Z={class:"tag-outlined"},ee={key:0,class:"tag-outlined"},te={key:1,class:"rating-placeholder placeholder-glow"},se={key:2,class:"tag-outlined"},ae={class:"col-12 d-flex justify-content-start flex-wrap gap-1 align-items-center"},le={class:"card-body"},ne={class:"d-flex gap-3"},oe={class:"my-4"},ie={key:0,class:"mb-2"},re={key:1,class:"mb-2"},de={class:"d-flex justify-content-end align-items-end gap-2"},ue=["href"],ce=["href"],ve={class:"d-flex flex-column justify-content-center flex-md-row gap-3 flex-md-wrap"},me=["onClick"],_e={class:"card-header"},he={class:"text-secondary"},ge={class:"d-flex justify-content-between flex-wrap"},fe={key:0},pe={class:"card-body"},ye={key:1},Se={class:"col-5 text-truncate"},be={class:"col-7 d-flex flex-wrap column-gap-2"},ke=2,we=3,xe=4,De=2,Me=3,Ae={__name:"IndividualMovie",props:{filmId:{type:String,default:""}},setup(w){const S=w,x=B(()=>$(()=>import("./IndividualMovieDrawer-Cj0JJMBh.js"),__vite__mapDeps([0,1,2]))),f=O(),D=P(),t=y(""),p=y(!1),r=y(t.value.cinemas),M=R(()=>{let d=f.ATHINORAMA_URLS.find(n=>n.id===t.value.id).url;return d=`https://www.athinorama.gr${d}`,d}),C=({day:d,cinemaType:n,location:o})=>{if(r.value=[...h(t).cinemas],d===ke){const c=new Date().toLocaleDateString("en-US",{weekday:"long"});r.value=r.value.filter(v=>v.cinemaSchedule[c]&&v.cinemaSchedule[c].length>0)}else if(d===we){const s=new Date;s.setDate(s.getDate()+1);const c=s.toLocaleDateString("en-US",{weekday:"long"});r.value=r.value.filter(v=>v.cinemaSchedule[c]&&v.cinemaSchedule[c].length>0)}else d===xe&&(r.value=r.value.filter(s=>s.cinemaSchedule.Saturday&&s.cinemaSchedule.Saturday.length>0||s.cinemaSchedule.Sunday&&s.cinemaSchedule.Sunday.length>0));n===De?r.value=r.value.filter(s=>s.isOutdoor):n===Me&&(r.value=r.value.filter(s=>!s.isOutdoor)),o!=="ALL"&&(r.value=r.value.filter(s=>s.cinemaLocation===o))},A=d=>{f.setSelectedCinemaAction(d.cinema),D.push({name:"Cinema",params:{cinema:d.cinema.match(/[\p{Script=Latin}\p{Script=Greek}0-9]/gu).join("")}})},I=()=>{p.value=!0},b=d=>{t.value=f.getIndividualMovie(d),r.value=[...t.value.cinemas]};return j(()=>S.filmId,d=>{b(d)}),N(()=>{b(S.filmId)}),(d,n)=>(l(),a("div",null,[e("div",Y,[e("div",q,[e("div",z,[e("h2",G,i(t.value.greekTitle),1),e("i",{class:"bi bi-list fs-3 cursor-pointer",onClick:I})]),e("div",H,[e("div",K,i(t.value.originalTitle),1),e("div",J,[e("div",Q,"Σε "+i(t.value.cinemas.length)+" σινεμά",1),e("div",X,i(h(V)(t.value.duration)),1),e("div",Z,i(t.value.year),1),t.value.imdbRating?(l(),a("div",ee,i(t.value.imdbRating==="None"?"?/10":`${t.value.imdbRating}/10`),1)):(l(),a("div",te,n[1]||(n[1]=[e("span",{class:"placeholder rounded-3 col-12"},null,-1)]))),t.value.rated?(l(),a("div",se,i(t.value.rated),1)):m("",!0)]),e("div",ae,[(l(!0),a(u,null,_(t.value.tags,(o,s)=>(l(),a("div",{key:s,class:"tag-square"},i(o),1))),128))])])]),e("div",le,[e("div",ne,[e("div",null,[n[2]||(n[2]=e("b",null,"Σκηνοθεσία: ",-1)),(l(!0),a(u,null,_(t.value.directors,(o,s)=>(l(),a(u,null,[g(i(o),1),s<t.value.directors.length-1?(l(),a("span",{key:s},", ")):m("",!0)],64))),256))])]),e("div",oe,i(t.value.summary),1),t.value.actors.length?(l(),a("div",ie,[n[3]||(n[3]=e("b",null,"Παίζουν: ",-1)),n[4]||(n[4]=g()),(l(!0),a(u,null,_(t.value.actors,(o,s)=>(l(),a(u,null,[g(i(o),1),s<t.value.actors.length-1?(l(),a("span",{key:s},", ")):m("",!0)],64))),256))])):m("",!0),t.value.awards?(l(),a("div",re,[n[5]||(n[5]=e("b",null,"Βραβεία: ",-1)),e("span",null,i(t.value.awards),1)])):m("",!0),e("div",de,[e("a",{href:M.value,target:"_blank",rel:"noopener noreferrer"},n[6]||(n[6]=[e("img",{src:F,alt:"Athinorama",width:"30",height:"30",class:"cursor-pointer"},null,-1)]),8,ue),t.value.imdbLink?(l(),a("a",{key:0,href:t.value.imdbLink,target:"_blank",rel:"noopener noreferrer"},n[7]||(n[7]=[e("img",{src:W,alt:"IMDb",width:"30",height:"30",class:"cursor-pointer"},null,-1)]),8,ce)):m("",!0)])])]),e("div",ve,[(l(!0),a(u,null,_(r.value,(o,s)=>(l(),a("div",{key:s,class:"card border-0 cinema-item cursor-pointer",onClick:c=>A(o)},[e("div",_e,[e("h2",he,i(o.cinema),1),e("div",ge,[e("div",null,i(o.cinemaLocation),1),o.isOutdoor?(l(),a("div",fe,n[8]||(n[8]=[e("i",{class:"bi bi-brightness-high-fill is-outdoor"},null,-1)]))):m("",!0)])]),e("div",pe,[typeof o.cinemaSchedule=="string"||o.cinemaSchedule instanceof String?(l(),a(u,{key:0},[g(i(o.cinemaSchedule),1)],64)):(l(),a("div",ye,[(l(!0),a(u,null,_(Object.entries(o.cinemaSchedule),([c,v])=>(l(),a(u,null,[v.length?(l(),a("div",{class:"row my-2",key:c},[e("div",Se,i(h(T)(c)),1),e("div",be,[(l(!0),a(u,null,_(v,(L,E)=>(l(),a("span",{key:E},i(L),1))),128))])])):m("",!0)],64))),256))]))])],8,me))),128))]),k(h(x),{modelValue:p.value,"onUpdate:modelValue":n[0]||(n[0]=o=>p.value=o),onFilterChanged:C,state:t.value},null,8,["modelValue","state"]),k(U)]))}};export{Ae as default};