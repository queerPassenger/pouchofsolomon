function addDays(days) {
    var dat = new Date(this.valueOf())
    dat.setDate(dat.getDate() + days);
    return dat;
}
function getDayString() {
    return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][new Date(this.valueOf()).getDay()]
}
function getYears(fromDate, toDate) {
    let fromYear = fromDate.getFullYear();
    let toYear = toDate.getFullYear();
    let yearSet = [];
    if (fromYear && toYear) {
        for (let i = fromYear; i <= toYear; i++) {
            yearSet.push(i);
        }
    }
    return yearSet;
}
const methodSet = {
    addDays,
    getDayString,
    getYears
};

export function addPrototype(set) {
    set.map(key => {
        Date.prototype[key] = methodSet[key];
    });
    return;
}
export function removePrototype(set) {
    set.map(key => {
        delete Date.prototype[key];
    });
    return;
}