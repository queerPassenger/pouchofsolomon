export const stringLimiter=(string,len,limiter)=>{
    limiter=limiter?limiter:'...';
    return string.length>len?string.substring(0,len)+limiter:string;
}