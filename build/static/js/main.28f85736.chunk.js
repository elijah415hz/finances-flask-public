(this.webpackJsonpreact_client=this.webpackJsonpreact_client||[]).push([[0],{114:function(e,t,n){},122:function(e,t,n){},123:function(e,t,n){"use strict";n.r(t);var a=n(2),r=n(0),o=n.n(r),c=n(13),i=n.n(c),s=(n(114),n(16)),l=n(7),d=n(88),u=n(17),m=n(71),h=n(74),j=n(10),p=n.n(j),b=n(19),f=n(18),O=n(87),g=n.n(O),v=n(86),x=n.n(v),y=n(160),w=n(161),k=n(162),C=n(5),N=n(178),S=Object(C.a)((function(e){return Object(N.a)({head:{backgroundColor:e.palette.common.black,color:e.palette.common.white},body:{fontSize:14,padding:0,maxWidth:"10ch"}})}))(y.a),L=Object(C.a)((function(e){return Object(N.a)({root:{"&:nth-of-type(odd)":{backgroundColor:e.palette.action.hover},"& input":{backgroundColor:"inherit",paddingLeft:0}}})}))(w.a);function _(e){var t=Object(r.useState)({Amount:""}),n=Object(s.a)(t,2),o=n[0],c=n[1];function i(e,t){return Object(a.jsx)("datalist",{id:t,children:e.map((function(e){return Object(a.jsx)("option",{value:e.name},e.id)}))})}function d(e){var t=e.target,n=t.name,a=t.value;c(Object(l.a)(Object(l.a)({},o),{},Object(f.a)({},n,a)))}return Object(r.useEffect)((function(){c(e.entry)}),[e.entry]),Object(a.jsxs)(L,{children:[e.fields.filter((function(e){return!e.name.includes("id")})).map((function(t){var n,r,c,s,l,u,m,h,j,p;return Object(a.jsxs)(S,{children:["Amount"===t.name?Object(a.jsx)("span",{children:"$"}):null,Object(a.jsx)("input",{name:t.name,onBlur:function(t){e.handleChange(t,e.i)},onChange:d,className:"tableInput",value:o[t.name]||"",list:t.name,style:{width:"80%"}}),"Source"===t.name&&(null===(n=e.dataLists)||void 0===n?void 0:n.source)?i(null===(r=e.dataLists)||void 0===r?void 0:r.source,t.name):null,"Person"===t.name&&(null===(c=e.dataLists)||void 0===c?void 0:c.person_earner)?i(null===(s=e.dataLists)||void 0===s?void 0:s.person_earner,t.name):null,"Narrow_category"===t.name&&(null===(l=e.dataLists)||void 0===l?void 0:l.narrow_category)?i(null===(u=e.dataLists)||void 0===u?void 0:u.narrow_category,t.name):null,"Broad_category"===t.name&&(null===(m=e.dataLists)||void 0===m?void 0:m.broad_category)?i(null===(h=e.dataLists)||void 0===h?void 0:h.broad_category,t.name):null,"Vendor"===t.name&&(null===(j=e.dataLists)||void 0===j?void 0:j.vendor)?i(null===(p=e.dataLists)||void 0===p?void 0:p.vendor,t.name):null]})})),Object(a.jsx)(S,{children:Object(a.jsx)(k.a,{color:"primary",onClick:function(){return e.handleUpdate(e.i)},children:Object(a.jsx)(x.a,{})})}),Object(a.jsx)(S,{children:Object(a.jsx)(k.a,{"aria-label":"delete",color:"secondary",onClick:function(){return e.deleteEntry(o.entry_id||o.id)},children:Object(a.jsx)(g.a,{})})})]})}function I(e){return Object(a.jsx)("tbody",{children:Object(a.jsx)("tr",{children:e.fields.filter((function(e){return!e.name.includes("id")})).map((function(t){return Object(a.jsxs)("td",{children:["Amount"===t.name?Object(a.jsx)("span",{children:"$"}):null,Object(a.jsx)("span",{className:"tableInput",children:e.entry[t.name]||""})]},e.i+t.name)}))})})}var T=n(165),A=n(167),E=n(164),D=n(166),B=n(125),P=n(163);function U(e){var t=Object(C.a)((function(e){return Object(N.a)({head:{backgroundColor:e.palette.primary.main,color:e.palette.common.white}})}))(y.a),n=Object(P.a)((function(e){return Object(N.a)({table:{minWidth:650}})}))();return Object(a.jsx)(E.a,{component:B.a,children:Object(a.jsxs)(T.a,{className:n.table,children:[Object(a.jsx)(D.a,{children:Object(a.jsxs)(w.a,{children:[e.state.schema.fields.filter((function(e){return!e.name.includes("id")})).map((function(e){return Object(a.jsx)(t,{children:e.name.replace("_"," ")},e.name)})),Object(a.jsx)(t,{children:Object(a.jsx)("span",{children:"Save"})}),Object(a.jsx)(t,{children:Object(a.jsx)("span",{children:"Delete"})})]})}),Object(a.jsx)(A.a,{className:"tableBody",children:e.state.data.map((function(t,n){return"pivot"===e.form?Object(a.jsx)(I,{entry:t,i:n,fields:e.state.schema.fields},t.entry_id||t.id):Object(a.jsx)(_,{entry:t,i:n,fields:e.state.schema.fields,handleChange:e.handleChange,handleUpdate:e.handleUpdate,dataLists:e.dataLists,deleteEntry:e.deleteEntry},n)}))})]})})}function F(e,t){if(401===e.status)throw new Error("Unauthorized");return"json"===t?e.json():e.text()}var z,G={expenses:function(e,t){return fetch("/api/expenses/".concat(t.year,"/").concat(t.month),{headers:{authorization:"Bearer ".concat(e)}}).then((function(e){return F(e,"json")}))},postExpenses:function(e,t){return fetch("/api/expenses/",{method:"POST",headers:{authorization:"Bearer ".concat(e),"Content-Type":"application/json"},body:JSON.stringify(t)}).then((function(e){return F(e,"text")}))},postBatchExpenses:function(e,t){return fetch("/api/expenses/batch",{method:"POST",headers:{authorization:"Bearer ".concat(e),"Content-Type":"application/json"},body:JSON.stringify(t)}).then((function(e){return F(e,"text")}))},postIncome:function(e,t){return fetch("/api/income/",{method:"POST",headers:{authorization:"Bearer ".concat(e),"Content-Type":"application/json"},body:JSON.stringify(t)}).then((function(e){return F(e,"text")}))},postBatchIncome:function(e,t){return fetch("/api/income/batch",{method:"POST",headers:{authorization:"Bearer ".concat(e),"Content-Type":"application/json"},body:JSON.stringify(t)}).then((function(e){return F(e,"text")}))},deleteExpenses:function(e,t){return fetch("/api/expenses/".concat(t),{method:"DELETE",headers:{authorization:"Bearer ".concat(e)}}).then((function(e){return F(e,"text")}))},updateExpenses:function(e,t){return fetch("/api/expenses/".concat(t.entry_id),{method:"PUT",headers:{authorization:"Bearer ".concat(e),"Content-Type":"application/json"},body:JSON.stringify(t)}).then((function(e){return F(e,"text")}))},income:function(e,t){return fetch("/api/income/".concat(t.year,"/").concat(t.month),{headers:{authorization:"Bearer ".concat(e)}}).then((function(e){return F(e,"json")}))},updateIncome:function(e,t){return fetch("/api/income/".concat(t.id),{method:"PUT",headers:{authorization:"Bearer ".concat(e),"Content-Type":"application/json"},body:JSON.stringify(t)}).then((function(e){return F(e,"text")}))},deleteIncome:function(e,t){return fetch("/api/income/".concat(t),{method:"DELETE",headers:{authorization:"Bearer ".concat(e)}}).then((function(e){return F(e,"text")}))},pivot:function(e,t){return fetch("/api/expenses/pivot/".concat(t.year,"/").concat(t.month),{headers:{authorization:"Bearer ".concat(e)}}).then((function(e){return F(e,"json")}))},dataList:function(e){return fetch("/api/datalists",{headers:{authorization:"Bearer ".concat(e)}}).then((function(e){return F(e,"json")}))},login:function(e){return fetch("/auth/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(e)}).then((function(e){return F(e,"json")}))},checkAuth:function(e){return fetch("/auth/checkAuth",{headers:{authorization:"Bearer ".concat(e)}}).then((function(e){return F(e,"json")}))}},M=n(89);function W(){return(W=Object(b.a)(p.a.mark((function e(){return p.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,Object(M.a)("pendingFinances",2,{upgrade:function(e){e.createObjectStore("expenses",{autoIncrement:!0}),e.createObjectStore("income",{autoIncrement:!0})}});case 2:z=e.sent,navigator.onLine&&V();case 4:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function R(e,t){return J.apply(this,arguments)}function J(){return(J=Object(b.a)(p.a.mark((function e(t,n){return p.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,z.put(t,n);case 2:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function V(){return H.apply(this,arguments)}function H(){return(H=Object(b.a)(p.a.mark((function e(){var t,n,a;return p.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t=localStorage.getItem("token"),e.prev=1,e.next=4,z.getAll("expenses");case 4:if(!((n=e.sent).length>0)){e.next=9;break}return e.next=8,G.postBatchExpenses(t,n);case 8:z.clear("expenses");case 9:return e.next=11,z.getAll("income");case 11:if(!((a=e.sent).length>0)){e.next=16;break}return e.next=15,G.postBatchIncome(t,a);case 15:z.clear("income");case 16:e.next=21;break;case 18:e.prev=18,e.t0=e.catch(1),console.error(e.t0);case 21:case"end":return e.stop()}}),e,null,[[1,18]])})))).apply(this,arguments)}window.addEventListener("online",V);var $=n(180),Y=n(172),K=n(171),q=n(182),Q=n(176),X=n(183),Z=n(168),ee=n(66),te=n(23),ne=n(175);function ae(e){var t,n=o.a.useContext(ue),c=n.Auth,i=n.setAuth,d={Date:new Date(Date.now()),Amount:NaN,person_id:NaN,broad_category_id:NaN,narrow_category_id:NaN,vendor:"",notes:""},u=Object(r.useState)(d),m=Object(s.a)(u,2),h=m[0],j=m[1],O=Object(r.useState)({name:"",id:NaN}),g=Object(s.a)(O,2),v=g[0],x=g[1],y=[{name:"Groceries",id:6,narrowCategories:[{name:"Food",id:10},{name:"Alcohol",id:49},{name:"Entertaining",id:7}]},{name:"Health and Body",id:12,narrowCategories:[{name:"Toiletries",id:27},{name:"Make-up",id:51},{name:"Drugs/Supplements",id:273},{name:"Doctors Visits",id:24},{name:"Gym",id:34},{name:"Essential Oils",id:58},{name:"Massages/Body Care",id:41}],person:!0},{name:"Work",id:8,narrowCategories:[{name:"Road Food Out",id:20},{name:"Road Groceries",id:37},{name:"Road Coffee",id:21},{name:"Business Food",id:70},{name:"Scores",id:68},{name:"Office Supplies",id:11},{name:"Plane Tickets",id:18},{name:"Transportation",id:9},{name:"Union Dues",id:55},{name:"Dry Cleaning",id:14},{name:"Concert Tickets",id:655},{name:"Lessons/Coachings",id:69},{name:"Application fees",id:61},{name:"Pianist Fees",id:656}],person:!0},{name:"Eating Out",id:3,narrowCategories:[{name:"Date",id:28},{name:"Friends",id:3},{name:"Snacks",id:17},{name:"On the Run",id:8},{name:"Coffee",id:30},{name:"Ordering in",id:48}]},{name:"Home Goods",id:9,narrowCategories:[{name:"Kitchen",id:12},{name:"Decorating",id:29},{name:"Furniture",id:16},{name:"Paper Products/Cleaning",id:15},{name:"Office Supplies",id:11},{name:"Hobbies/Creative",id:23},{name:"Linens",id:201}]},{name:"New York Home",id:1,narrowCategories:[{name:"Rent",id:40},{name:"Internet",id:1},{name:"Electricity",id:26}]},{name:"Seattle Home",id:7,narrowCategories:[{name:"Mortgage",id:39},{name:"HOA",id:38},{name:"Taxes",id:657},{name:"Internet",id:1},{name:"Electricity",id:26},{name:"Manager/Maintanence",id:42},{name:"Insurance",id:134}]},{name:"Clothes",id:11,person:!0},{name:"Laundry",id:4,narrowCategories:[{name:"Laundry",id:4},{name:"Dry Cleaning",id:14}]},{name:"Entertainment",id:14,narrowCategories:[{name:"Live Shows",id:32},{name:"Movies",id:44},{name:"Museums",id:53},{name:"Books",id:36},{name:"Home (Netflix, Spotify, Amazon, Movie Rentals)",id:46},{name:"Newspaper/Magazine",id:47}]},{name:"Philanthropy",id:17},{name:"Electronics",id:5,narrowCategories:[{name:"Phone Bill",id:33},{name:"Computers",id:588},{name:"Accessories",id:31},{name:"Cloud Storage Fees",id:6}]},{name:"Gifts",id:13},{name:"Transportation",id:2,narrowCategories:[{name:"Gas",id:22},{name:"Repairs",id:577},{name:"Insurance",id:134},{name:"Bike",id:567},{name:"Subway",id:35},{name:"Taxi/Lyft",id:5},{name:"Car Rental",id:2},{name:"Seattle Airplanes",id:276},{name:"Parking",id:209}]},{name:"Maggie",id:10,narrowCategories:[{name:"Food",id:10},{name:"Litter",id:13},{name:"Vet Bills",id:275},{name:"Toys",id:60}]},{name:"Travel/Leisure",id:16,narrowCategories:[{name:"Planes",id:62},{name:"Ground Transportation",id:52},{name:"Food",id:10},{name:"Experiences",id:64},{name:"Lodging",id:43}]},{name:"Legal",id:19,narrowCategories:[{name:"Documents",id:202},{name:"Services",id:63}]},{name:"Student Loans",id:15},{name:"Education",id:18,person:!0},{name:"Theo",id:7,narrowCategories:[{name:"Baby sitting",id:274},{name:"Toys",id:60}]}];function w(e){var t=e.target.name;if(j(Object(l.a)(Object(l.a)({},h),{},Object(f.a)({},t,e.target.value))),"broad_category_id"===t){var n=y.filter((function(t){return t.id===e.target.value}))[0];x(n)}}function k(){return(k=Object(b.a)(p.a.mark((function e(t){var n,a,r;return p.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t.preventDefault(),(a=Object(l.a)({},h)).Date=null===(n=a.Date)||void 0===n?void 0:n.toLocaleDateString("en-US"),e.prev=3,e.next=6,G.postExpenses(c.token,a);case 6:r=e.sent,console.log(r),e.next=15;break;case 10:e.prev=10,e.t0=e.catch(3),R("expenses",a),console.error(e.t0),"Unauthorized"===e.t0.message&&i({type:"LOGOUT"});case 15:return e.prev=15,j(d),x({name:"",id:NaN}),e.finish(15);case 19:case"end":return e.stop()}}),e,null,[[3,10,15,19]])})))).apply(this,arguments)}return Object(a.jsx)("div",{className:e.classes.root,children:Object(a.jsxs)("form",{className:e.classes.root,onSubmit:function(e){return k.apply(this,arguments)},children:[Object(a.jsx)(te.a,{utils:ee.a,children:Object(a.jsx)(ne.a,{disableToolbar:!0,variant:"inline",format:"MM/dd/yyyy",margin:"normal",id:"date-picker-inline",name:"Date",label:"Date",value:h.Date,onChange:function(e){j(Object(l.a)(Object(l.a)({},h),{},{Date:e}))},KeyboardButtonProps:{"aria-label":"change date"}})}),Object(a.jsx)($.a,{onChange:w,value:h.vendor,label:"Vendor",name:"vendor",type:"string",InputLabelProps:{shrink:!0}}),Object(a.jsx)($.a,{onChange:w,value:h.Amount,label:"Amount",name:"Amount",type:"number",InputProps:{startAdornment:Object(a.jsx)(Y.a,{position:"start",children:"$"})},inputProps:{step:"0.01"}}),Object(a.jsxs)(K.a,{className:e.classes.formControl,children:[Object(a.jsx)(q.a,{htmlFor:"broad_category",children:"Broad Category"}),Object(a.jsx)(Q.a,{onChange:w,value:h.broad_category_id,name:"broad_category_id",labelId:"broad_category",label:"Broad Category",children:y.map((function(e){return Object(a.jsx)(X.a,{value:e.id,children:e.name})}))})]}),v.narrowCategories?Object(a.jsxs)(K.a,{className:e.classes.formControl,children:[Object(a.jsx)(q.a,{htmlFor:"narrow_category",children:"Narrow Category"}),Object(a.jsx)(Q.a,{onChange:w,value:h.narrow_category_id,name:"narrow_category_id",labelId:"narrow_category",label:"Narrow Category",children:null===(t=v.narrowCategories)||void 0===t?void 0:t.map((function(e){return Object(a.jsx)(X.a,{value:e.id,children:e.name})}))})]}):null,v.person?Object(a.jsxs)(K.a,{className:e.classes.formControl,children:[Object(a.jsx)(q.a,{htmlFor:"person_id",children:"Person"}),Object(a.jsx)(Q.a,{onChange:w,value:h.person_id,name:"person_id",labelId:"person_id",label:"Person",children:[{name:"Alexa",id:3},{name:"Eli",id:1},{name:"Theo",id:2}].map((function(e){return Object(a.jsx)(X.a,{value:e.id,children:e.name})}))})]}):null,Object(a.jsx)($.a,{onChange:w,value:h.notes,label:"Notes",name:"notes",type:"string",InputLabelProps:{shrink:!0}}),Object(a.jsx)(Z.a,{type:"submit",variant:"contained",color:"primary",children:"Submit"}),Object(a.jsx)(Z.a,{type:"button",variant:"contained",color:"secondary",onClick:function(){j(d),e.hideForms()},children:"Close"})]})})}function re(e){var t=o.a.useContext(ue),n=t.Auth,c=t.setAuth,i={date:new Date(Date.now()),amount:NaN,earner_id:NaN,source:""},d=Object(r.useState)(i),u=Object(s.a)(d,2),m=u[0],h=u[1];function j(e){var t=e.target.name;h(Object(l.a)(Object(l.a)({},m),{},Object(f.a)({},t,e.target.value)))}function O(){return(O=Object(b.a)(p.a.mark((function e(t){var a,r,o;return p.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t.preventDefault(),a=Object(l.a)({},m),e.prev=2,a.date=null===(r=a.date)||void 0===r?void 0:r.toLocaleDateString("en-US"),e.next=6,G.postIncome(n.token,a);case 6:o=e.sent,h(i),console.log(o),e.next=16;break;case 11:e.prev=11,e.t0=e.catch(2),R("income",a),console.error(e.t0),"Unauthorized"===e.t0.message&&c({type:"LOGOUT"});case 16:case"end":return e.stop()}}),e,null,[[2,11]])})))).apply(this,arguments)}return Object(a.jsx)("div",{className:e.classes.root,children:Object(a.jsxs)("form",{className:e.classes.root,onSubmit:function(e){return O.apply(this,arguments)},children:[Object(a.jsx)(te.a,{utils:ee.a,children:Object(a.jsx)(ne.a,{disableToolbar:!0,variant:"inline",format:"MM/dd/yyyy",margin:"normal",id:"date-picker-inline",name:"Date",label:"Date",value:m.date,onChange:function(e){h(Object(l.a)(Object(l.a)({},m),{},{date:e}))},KeyboardButtonProps:{"aria-label":"change date"}})}),Object(a.jsx)($.a,{onChange:j,value:m.source,label:"Source",name:"source",type:"string",InputLabelProps:{shrink:!0}}),Object(a.jsx)($.a,{onChange:j,value:m.amount,label:"Amount",name:"amount",type:"number",InputProps:{startAdornment:Object(a.jsx)(Y.a,{position:"start",children:"$"})},inputProps:{step:"0.01"}}),Object(a.jsxs)(K.a,{className:e.classes.formControl,children:[Object(a.jsx)(q.a,{htmlFor:"earner_id",children:"Person"}),Object(a.jsx)(Q.a,{onChange:j,value:m.earner_id,name:"earner_id",labelId:"earner_id",label:"Person",children:[{name:"Alexa",id:3},{name:"Eli",id:1},{name:"Rent",id:8},{name:"Sales",id:10},{name:"Gift",id:11}].map((function(e){return Object(a.jsx)(X.a,{value:e.id,children:e.name})}))})]}),Object(a.jsx)(Z.a,{type:"submit",variant:"contained",color:"primary",children:"Submit"}),Object(a.jsx)(Z.a,{type:"button",variant:"contained",color:"secondary",onClick:function(){h(i),e.hideForms()},children:"Close"})]})})}var oe=n(173),ce=n(174);var ie=function(){var e,t,n=o.a.useContext(ue),c=n.Auth,i=n.setAuth,d=Object(r.useState)({form:"expenses",year:new Date(Date.now()).getUTCFullYear(),month:new Date(Date.now()).getUTCMonth()+1}),u=Object(s.a)(d,2),m=u[0],j=u[1],O=Object(r.useState)({schema:{fields:[]},data:[{Amount:"",Date:"",Source:"",Person:"",id:NaN,source_id:NaN,earner_id:NaN}]}),g=Object(s.a)(O,2),v=g[0],x=g[1],y=Object(r.useState)({schema:{fields:[]},data:[{Amount:"",Date:"",Source:"",Vendor:"",Broad_category:"",Narrow_category:"",Person:"",Notes:"",entry_id:NaN}]}),w=Object(s.a)(y,2),k=w[0],C=w[1],S=Object(r.useState)({schema:{fields:[]},data:[{Amount:"",Broad_category:"",Narrow_category:""}]}),L=Object(s.a)(S,2),_=L[0],I=L[1],T=Object(r.useState)({source:[],person_earner:[],narrow_category:[],broad_category:[],vendor:[]}),A=Object(s.a)(T,2),E=A[0],D=A[1],B=Object(r.useState)(!1),F=Object(s.a)(B,2),z=F[0],M=F[1],W=Object(r.useState)(!1),R=Object(s.a)(W,2),J=R[0],V=R[1],H=Object(r.useState)(!1),Y=Object(s.a)(H,2),ee=Y[0],te=Y[1];function ne(){M(!1),V(!1),te(!1)}function ie(e){if(e.Date){var t=new Date(e.Date),n=t.getUTCFullYear(),a=(1+t.getUTCMonth()).toString();a=a.length>1?a:"0"+a;var r=t.getUTCDate().toString(),o=a+"/"+(r=r.length>1?r:"0"+r)+"/"+n;return e.Date=o,e}return e}function se(e){var t=e.target.name;j(Object(l.a)(Object(l.a)({},m),{},Object(f.a)({},t,e.target.value)))}function le(){return(le=Object(b.a)(p.a.mark((function e(t){var n,a;return p.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,t.preventDefault(),n=m.form,e.next=5,G[n](c.token,m);case 5:a=e.sent,"pivot"!==n&&(a.data=a.data.map(ie)),e.t0=n,e.next="expenses"===e.t0?10:"income"===e.t0?12:"pivot"===e.t0?14:16;break;case 10:return C(a),e.abrupt("break",16);case 12:return x(a),e.abrupt("break",16);case 14:return I(a),e.abrupt("break",16);case 16:e.next=21;break;case 18:e.prev=18,e.t1=e.catch(0),"Unauthorized"===e.t1.message&&i({type:"LOGOUT"});case 21:case"end":return e.stop()}}),e,null,[[0,18]])})))).apply(this,arguments)}function de(e,t){var n,a;switch(e){case"Person":n=E.person_earner,a="person_id";break;case"Source":n=E.source,a="source_id";break;case"Broad_category":n=E.broad_category,a="broad_category_id";break;case"Narrow_category":n=E.narrow_category,a="narrow_category_id";break;case"Vendor":n=E.vendor,a="vendor_id"}var r=n.filter((function(e){return e.name===t}))[0];return r?{id:a,dataListItem:r}:{id:null,dataListItem:null}}function me(){return(me=Object(b.a)(p.a.mark((function e(t,n){var a,r,o,c,s,d,u,m;return p.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:try{a=t.target,r=a.name,o=a.value,c=Object(h.a)(k.data),s=Object(l.a)(Object(l.a)({},c[n]),{},Object(f.a)({},r,o)),"Person"!==r&&"Broad_category"!==r&&"Narrow_category"!==r&&"Vendor"!==r||(d=de(r,o),u=d.id,m=d.dataListItem,u&&m&&(s=Object(l.a)(Object(l.a)({},s),{},Object(f.a)({},u,m.id)))),c[n]=s,C(Object(l.a)(Object(l.a)({},k),{},{data:c}))}catch(j){console.error(j),"Unauthorized"===j.message&&i({type:"LOGOUT"})}case 1:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function he(){return(he=Object(b.a)(p.a.mark((function e(t){var n;return p.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,G.updateExpenses(c.token,k.data[t]);case 3:n=e.sent,console.log(n),e.next=10;break;case 7:e.prev=7,e.t0=e.catch(0),console.log(e.t0);case 10:case"end":return e.stop()}}),e,null,[[0,7]])})))).apply(this,arguments)}function je(){return(je=Object(b.a)(p.a.mark((function e(t){var n;return p.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,G.updateIncome(c.token,v.data[t]);case 3:n=e.sent,console.log(n),e.next=10;break;case 7:e.prev=7,e.t0=e.catch(0),console.log(e.t0);case 10:case"end":return e.stop()}}),e,null,[[0,7]])})))).apply(this,arguments)}function pe(){return(pe=Object(b.a)(p.a.mark((function e(t,n){var a,r,o,c,i,s,d,u;return p.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:try{a=t.target,r=a.name,o=a.value,c=Object(h.a)(v.data),i=Object(l.a)(Object(l.a)({},c[n]),{},Object(f.a)({},r,o)),"Person"!==r&&"Source"!==r||(s=de(r,o),d=s.id,u=s.dataListItem,d&&u&&(i=Object(l.a)(Object(l.a)({},i),{},Object(f.a)({},d,u.id)))),c[n]=i,x(Object(l.a)(Object(l.a)({},v),{},{data:c}))}catch(m){console.error(m)}case 1:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function be(e){return fe.apply(this,arguments)}function fe(){return(fe=Object(b.a)(p.a.mark((function e(t){var n,a;return p.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(e.prev=0,"expenses"!==m.form){e.next=8;break}return e.next=4,G.deleteExpenses(c.token,t);case 4:n=k.data.filter((function(e){return e.entry_id!==t})),C(Object(l.a)(Object(l.a)({},k),{},{data:n})),e.next=13;break;case 8:if("income"!==m.form){e.next=13;break}return e.next=11,G.deleteIncome(c.token,t);case 11:a=v.data.filter((function(e){return e.id!==t})),x(Object(l.a)(Object(l.a)({},v),{},{data:a}));case 13:e.next=19;break;case 15:e.prev=15,e.t0=e.catch(0),console.error(e.t0),"Unauthorized"===e.t0&&i({type:"LOGOUT"});case 19:case"end":return e.stop()}}),e,null,[[0,15]])})))).apply(this,arguments)}var Oe=Object(P.a)((function(e){var t;return Object(N.a)({formControl:{margin:e.spacing(1),minWidth:"7em"},selectEmpty:{marginTop:e.spacing(2)},root:(t={display:"flex",justifyContent:"center",flexWrap:"wrap"},Object(f.a)(t,e.breakpoints.up("md"),{flexWrap:"noWrap"}),Object(f.a)(t,"& > *",Object(f.a)({margin:e.spacing(1)},e.breakpoints.down("xs"),{width:"100%"})),t),wallchart:{width:"100%"},logoutBtn:{float:"right",margin:"1em"},offline:{backgroundColor:"red",color:"white",textAlign:"center",position:"sticky"}})}))(),ge=Object(r.useState)(!1),ve=Object(s.a)(ge,2),xe=ve[0],ye=ve[1];return window.addEventListener("offline",(function(){return ye(!0)})),window.addEventListener("online",(function(){return ye(!1)})),Object(r.useEffect)((function(){function e(){return(e=Object(b.a)(p.a.mark((function e(){var t;return p.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,G.dataList(c.token);case 2:t=e.sent,D(t);case 4:case"end":return e.stop()}}),e)})))).apply(this,arguments)}!function(){e.apply(this,arguments)}(),navigator.onLine||ye(!0)}),[]),Object(a.jsxs)("div",{className:"Home",children:[xe?Object(a.jsx)(oe.a,{className:Oe.offline,position:"sticky",children:"Offline"}):null,Object(a.jsxs)("header",{className:"header",children:[Object(a.jsx)(Z.a,{variant:"contained",color:"primary",className:Oe.logoutBtn,onClick:function(){return i({type:"LOGOUT"})},children:"Logout"}),Object(a.jsx)(ce.a,{className:Oe.root,children:Object(a.jsx)("h1",{style:{textAlign:"center"},children:"Finances!"})}),c.token?Object(a.jsx)("img",{src:"/wallchart",alt:"Wall Chart",className:Oe.wallchart}):null,Object(a.jsxs)(ce.a,{className:Oe.root,children:[z?Object(a.jsx)(ae,{classes:Oe,hideForms:ne}):J||ee?null:Object(a.jsx)(Z.a,{type:"submit",variant:"contained",color:"primary",className:Oe.root,onClick:function(){M(!0)},children:"Log Expense"}),J?Object(a.jsx)(re,{classes:Oe,hideForms:ne}):z||ee?null:Object(a.jsx)(Z.a,{variant:"contained",color:"primary",className:Oe.root,onClick:function(){V(!0)},children:"Log Income"}),ee?Object(a.jsxs)("form",{onSubmit:function(e){return le.apply(this,arguments)},className:Oe.root,children:[Object(a.jsxs)(K.a,{variant:"outlined",className:Oe.formControl,children:[Object(a.jsx)(q.a,{htmlFor:"form",children:"Report"}),Object(a.jsxs)(Q.a,{name:"form",label:"Report",labelId:"form",value:m.form,onChange:se,children:[Object(a.jsx)(X.a,{value:"income",children:"Income"}),Object(a.jsx)(X.a,{value:"expenses",children:"Expenses"}),Object(a.jsx)(X.a,{value:"pivot",children:"Pivot Table"})]})]}),Object(a.jsx)($.a,{onChange:se,value:m.year,label:"Year",name:"year",type:"number",variant:"outlined"}),Object(a.jsxs)(K.a,{variant:"outlined",className:Oe.formControl,children:[Object(a.jsx)(q.a,{htmlFor:"month2",children:"Month"}),Object(a.jsxs)(Q.a,{onChange:se,value:m.month,name:"month",labelId:"month2",label:"Month",children:[Object(a.jsx)(X.a,{value:1,children:"January"}),Object(a.jsx)(X.a,{value:2,children:"February"}),Object(a.jsx)(X.a,{value:3,children:"March"}),Object(a.jsx)(X.a,{value:4,children:"April"}),Object(a.jsx)(X.a,{value:5,children:"May"}),Object(a.jsx)(X.a,{value:6,children:"June"}),Object(a.jsx)(X.a,{value:7,children:"July"}),Object(a.jsx)(X.a,{value:8,children:"August"}),Object(a.jsx)(X.a,{value:9,children:"September"}),Object(a.jsx)(X.a,{value:10,children:"October"}),Object(a.jsx)(X.a,{value:11,children:"November"}),Object(a.jsx)(X.a,{value:12,children:"December"})]})]}),Object(a.jsx)(Z.a,{type:"submit",variant:"contained",color:"primary",children:"View"}),Object(a.jsx)(Z.a,{type:"button",variant:"contained",color:"secondary",onClick:function(){ne()},children:"Close"})]}):J||z?null:Object(a.jsx)(Z.a,{variant:"contained",color:"secondary",className:Oe.root,onClick:function(){te(!0)},children:"View Reports"})]})]}),Object(a.jsxs)("div",{className:"body",children:["income"===m.form&&(null===(e=v.data[0])||void 0===e?void 0:e.id)?Object(a.jsx)(U,{state:v,dataLists:E,handleChange:function(e,t){return pe.apply(this,arguments)},handleUpdate:function(e){return je.apply(this,arguments)},deleteEntry:be,form:m.form}):null,"expenses"===m.form&&(null===(t=k.data[0])||void 0===t?void 0:t.entry_id)?Object(a.jsx)(U,{state:k,dataLists:E,handleChange:function(e,t){return me.apply(this,arguments)},handleUpdate:function(e){return he.apply(this,arguments)},deleteEntry:be,form:m.form}):null,"pivot"===m.form&&_?Object(a.jsx)(U,{state:_,deleteEntry:function(){return null},handleUpdate:function(){return null},handleChange:function(){return null},form:m.form}):null]})]})},se=Object(P.a)((function(e){return Object(N.a)({root:{display:"flex",justifyContent:"center",flexWrap:"wrap","& > *":Object(f.a)({margin:e.spacing(1)},e.breakpoints.down("xs"),{width:"100%"})}})}));function le(){var e=o.a.useContext(ue),t=e.Auth,n=e.setAuth,c=Object(r.useState)({username:"",password:""}),i=Object(s.a)(c,2),d=i[0],m=i[1],h=Object(r.useState)(!1),j=Object(s.a)(h,2),O=j[0],g=j[1],v=function(e){var t=e.target,n=t.name,a=t.value;m(Object(l.a)(Object(l.a)({},d),{},Object(f.a)({},n,a)))},x=function(){var e=Object(b.a)(p.a.mark((function e(t){return p.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:t.preventDefault();try{G.login(d).then((function(e){console.log("Login Token: "+e.token),n({type:"LOGIN",payload:{user:d.username,token:e.token}})}))}catch(a){console.log(a),g(!0)}case 2:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),y=se();return t.loggedIn?Object(a.jsx)(u.a,{to:"/"}):Object(a.jsx)(a.Fragment,{children:Object(a.jsxs)("div",{className:"Login",style:{textAlign:"center"},children:[Object(a.jsx)("h4",{children:"Login"}),Object(a.jsx)("div",{className:"Response",children:O?Object(a.jsx)("p",{children:"Incorrect username or password"}):null}),Object(a.jsxs)("form",{className:y.root,onSubmit:x,children:[Object(a.jsx)($.a,{onChange:v,value:d.username,type:"text",name:"username",label:"username",variant:"outlined"}),Object(a.jsx)($.a,{onChange:v,value:d.password,type:"password",name:"password",label:"password",variant:"outlined"}),Object(a.jsx)(Z.a,{variant:"contained",color:"primary",name:"login",type:"submit",children:"Login"})]})]})})}n(122);var de=function(e){var t=e.component,n=e.loggedIn,r=Object(d.a)(e,["component","loggedIn"]);return Object(a.jsx)(u.b,Object(l.a)(Object(l.a)({},r),{},{render:function(e){return n?Object(a.jsx)(t,Object(l.a)({},e)):Object(a.jsx)(u.a,{to:"/login"})}}))},ue=o.a.createContext({Auth:{loggedIn:!1,user:"",token:""},setAuth:function(){}});function me(){var e=Object(r.useReducer)((function(e,t){return"LOGIN"===t.type&&t.payload?(localStorage.setItem("user",t.payload.user),localStorage.setItem("token",t.payload.token),Object(l.a)(Object(l.a)({},e),{},{loggedIn:!0,user:t.payload.user,token:t.payload.token})):"LOGOUT"===t.type?(localStorage.clear(),Object(l.a)(Object(l.a)({},e),{},{loggedIn:!1,user:"",token:""})):e}),{loggedIn:!1,user:"",token:""}),t=Object(s.a)(e,2),n=t[0],o=t[1];return Object(r.useEffect)((function(){var e=localStorage.getItem("token"),t=localStorage.getItem("user");e&&G.checkAuth(e).then((function(t){return o({type:"LOGIN",payload:{user:t.username,token:e}})})).catch((function(n){"Unauthorized"===n.message?o({type:"LOGOUT"}):o({type:"LOGIN",payload:{user:t||"",token:e||""}})}))}),[]),Object(r.useEffect)((function(){!function(){W.apply(this,arguments)}()})),Object(a.jsx)(ue.Provider,{value:{Auth:n,setAuth:o},children:Object(a.jsxs)(m.a,{children:[Object(a.jsx)(de,{path:"/",loggedIn:n.loggedIn,setLoggedIn:o,component:ie}),Object(a.jsx)(u.b,{exact:!0,path:"/login",children:Object(a.jsx)(le,{})})]})})}var he=Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));function je(e,t){navigator.serviceWorker.register(e).then((function(e){e.onupdatefound=function(){var n=e.installing;null!=n&&(n.onstatechange=function(){"installed"===n.state&&(navigator.serviceWorker.controller?(console.log("New content is available and will be used when all tabs for this page are closed. See https://cra.link/PWA."),t&&t.onUpdate&&t.onUpdate(e)):(console.log("Content is cached for offline use."),t&&t.onSuccess&&t.onSuccess(e)))})}})).catch((function(e){console.error("Error during service worker registration:",e)}))}var pe=function(e){e&&e instanceof Function&&n.e(3).then(n.bind(null,185)).then((function(t){var n=t.getCLS,a=t.getFID,r=t.getFCP,o=t.getLCP,c=t.getTTFB;n(e),a(e),r(e),o(e),c(e)}))};i.a.render(Object(a.jsx)(me,{}),document.getElementById("root")),function(e){if("serviceWorker"in navigator){if(new URL("",window.location.href).origin!==window.location.origin)return;window.addEventListener("load",(function(){var t="".concat("","/service-worker.js");he?(!function(e,t){fetch(e,{headers:{"Service-Worker":"script"}}).then((function(n){var a=n.headers.get("content-type");404===n.status||null!=a&&-1===a.indexOf("javascript")?navigator.serviceWorker.ready.then((function(e){e.unregister().then((function(){window.location.reload()}))})):je(e,t)})).catch((function(){console.log("No internet connection found. App is running in offline mode.")}))}(t,e),navigator.serviceWorker.ready.then((function(){console.log("This web app is being served cache-first by a service worker. To learn more, visit https://cra.link/PWA")}))):je(t,e)}))}}(),pe()}},[[123,1,2]]]);
//# sourceMappingURL=main.28f85736.chunk.js.map