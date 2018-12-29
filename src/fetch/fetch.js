
export const searchToObj = (url) => {
    /*这个方法将"?letter=2&opp=23"这种string转换为JS对象形式，方便获取URL的参数*/
    let theRequest = {};
    if (url.indexOf("?") !== -1) {
        let str = url.substr(1);
        let strs = str.split("&");
        for(let i = 0; i < strs.length; i ++) {
            theRequest[strs[i].split("=")[0]]= decodeURIComponent(strs[i].split("=")[1]);
        }
    }
    return theRequest;
};

export const objToSearch = function (obj) {
    // 将对象 {a:1,b:2} 转为查询字符串
    let newSearch = '?';
    for (let item in obj) {
        newSearch = `${newSearch}${item}=${obj[item]}&`;
    }
    return newSearch.substring(0,newSearch.length-1);//去掉最后的&
};

export const fetchGet = (url, fetchPrm) => {
    const searchStr = objToSearch(fetchPrm);
    return fetch(url+searchStr).then((response) => {
        if (response.status === 200) {
            return response.json();
        }
    })
}

export const fetchPost = (url, fetchPrm) => {
    let loading;
    if (fetchPrm.isShowLoading !== false){
        loading = document.getElementById('ajaxLoading');
        loading.style.display = 'block';
    }
    return fetch(url, {
        method: 'POST',
        body: JSON.stringify(fetchPrm),
        credentials: 'include',
        headers: new Headers({
            'Content-Type': 'application/json', // 指定提交方式为表单提交
        }),
        xhrFields:{
            withCredentials:true
        }
    }).then((response) => {
        if (fetchPrm.isShowLoading !== false) {
            loading = document.getElementById('ajaxLoading');
            loading.style.display = 'none';
        }
        if (response.ok) {
            return response.json();
        }
        return response.json();
    });
}