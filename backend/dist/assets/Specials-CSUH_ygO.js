import{p,q as m,a,b as s,d as c,F as o,f as d,i as l,t as r}from"./index-CeKSCuS1.js";const v={class:"row g-3"},y={class:"card film-item"},u={class:"card-body"},_={class:"text-primary"},g={key:1,class:"col-lg-3"},k={__name:"Specials",setup(S){const t=p();return m(async()=>{await t.getSpecialsAthinoramaAction()}),(f,e)=>(l(),a("div",v,[e[2]||(e[2]=s("div",{class:"col-lg-12"},[s("div",{class:"card film-item"},[s("div",{class:"card-body"},[s("h4",{class:"text-center text-secondary m-0"}," Οι ειδικές προβολές της εβδομάδας ")])])],-1)),c(t).loadingSpecials?(l(),a(o,{key:1},d(4,i=>s("div",{class:"col-lg-3 placeholder-specialEvent",key:i},e[1]||(e[1]=[s("div",{class:"placeholder-glow h-100 w-100"},[s("span",{class:"placeholder h-100 rounded-2 col-12"})],-1)]))),64)):(l(),a(o,{key:0},[c(t).SPECIALS.length?(l(!0),a(o,{key:0},d(c(t).SPECIALS,(i,n)=>(l(),a("div",{class:"col-lg-3",key:n},[s("div",y,[s("div",u,[s("div",_,r(i.title),1),s("div",null,r(i.cinema),1)])])]))),128)):(l(),a("div",g,e[0]||(e[0]=[s("div",{class:"card film-item"},[s("div",{class:"card-body"},[s("div",{class:"text-primary"}," Δεν βρέθηκαν ειδικές προβολές "),s("div",null," Δοκιμάστε να ξαναφορτώσετε τη σελίδα! ")])],-1)])))],64))]))}};export{k as default};