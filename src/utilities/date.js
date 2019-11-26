function addDays(days) {
    var dat = new Date(this.valueOf())
    dat.setDate(dat.getDate() + days);
    return dat;
}
function getDayString() {
    return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][new Date(this.valueOf()).getDay()]
}
const methodSet = {
    addDays,
    getDayString
};

export function addPrototype(set){
    set.map(key=>{
        Date.prototype[key] = methodSet[key];
    });
    return;
}
export function removePrototype(set){
    set.map(key=>{
        delete Date.prototype[key];
    });
    return;
}