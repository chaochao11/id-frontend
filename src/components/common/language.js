export function getQueryString(name) {
    let reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    let r = window.location.search.substr(1).match(reg);
    if(r!=null)return  decodeURI(r[2]); return null;
}

export function getLocalValue(key) {
    let lang = getQueryString("lang") || "EN";
    // console.log(lang);
    // if (lang === "EN") {
    //     document.title="InvestDigital";
    //     return window.EN[key];
    // }
    // else{
    //     document.title="InvestDigital";
    // }
    return window.CN[key];
}