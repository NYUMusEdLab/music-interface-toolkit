(window.webpackJsonp=window.webpackJsonp||[]).push([[4],{63:function(e,n,a){"use strict";a.r(n),a.d(n,"frontMatter",(function(){return u})),a.d(n,"metadata",(function(){return d})),a.d(n,"rightToc",(function(){return l})),a.d(n,"default",(function(){return h}));var t=a(2),i=a(6),o=a(0),c=a.n(o),r=a(80),s=(a(54),[!0,!1,!0,!1,!0,!0,!1,!0,!1,!0,!1,!0]),p=function(e){for(var n=e.low,a=void 0===n?21:n,t=e.high,i=void 0===t?108:t,o=e.keyClass,r=[],p=[],u=a;u<=i;++u){var d=[];d.push("piano-ui-key"),d.push(s[u%12]?"piano-ui-white-key":"piano-ui-black-key"),o&&d.push.apply(d,o(u));var l=c.a.createElement("div",{className:d.join(" "),key:u});s[u%12]?(p.push(l),r.push(c.a.createElement("div",{className:"piano-ui-gap",key:u}))):r.push(l)}return c.a.createElement("div",{className:"piano-ui"},c.a.createElement("div",null,r),c.a.createElement("div",null,p))},u={title:"Piano Component"},d={unversionedId:"piano",id:"piano",isDocsHomePage:!0,title:"Piano Component",description:"`jsx",source:"@site/docs/piano.mdx",permalink:"/music-interface-toolkit/piano-ui/",editUrl:"https://github.com/NYUMusEdLab/music-interface-toolkit/edit/master/packages/piano-ui/docs/piano.mdx",sidebar:"docs"},l=[],m={rightToc:l};function h(e){var n=e.components,a=Object(i.a)(e,["components"]);return Object(r.b)("wrapper",Object(t.a)({},m,a,{components:n,mdxType:"MDXLayout"}),Object(r.b)("pre",null,Object(r.b)("code",Object(t.a)({parentName:"pre"},{className:"language-jsx"}),"// Specify a range of two octaves\n<Piano low={48} high={72} />\n")),Object(r.b)(p,{low:48,high:72,mdxType:"Piano"}))}h.isMDXComponent=!0}}]);