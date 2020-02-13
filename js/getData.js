let getData = {};
export default getData;

let apiUrl = '../server_api/'

getData.fetch = async (id = 'vehicles.js', timeout = 0) => {
    id = id !== 'vehicles.js' ? `vehicle_${id}.js` : id;
    let url = `${apiUrl}${id}`
    let response = await fetch(url);
    let data = await response.json()
    return data;
}

getData.timeout = (time) => {
    return new Promise((resolve)=> setTimeout(()=> resolve(), time));    
}

getData.carImageUrl = (media) =>{
    let index;
    index = media.findIndex((v)=>v.url != undefined);
    return `../${media[index].url}`;
}