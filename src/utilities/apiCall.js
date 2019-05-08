export function apiCall(data){
    return fetch('/api', {
        method: 'POST', // or 'PUT'
        body: JSON.stringify(data), // data can be `string` or {object}!
        headers:{
          'Content-Type': 'application/json'
        }
      })
      .then(function(response) {
          return response.json();
      })
      .then(function(myJson) {
          return myJson;
      })
      .catch(err=>{
          return err
      });
     
    // return fetch('/api')
    // .then(function(response) {
    //     return response.json();
    // })
    // .then(function(myJson) {
    //     return myJson;
    // })
    // .catch(err=>{
    //     return err
    // });
}