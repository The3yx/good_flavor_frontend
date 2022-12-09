export default function getCityArray (rawCityArray)
{
    return rawCityArray.map((value,index) =>{
        var provice = {};
        provice.value = value.name
        provice.label = value.name
        provice.children = value.pchilds.map((value, index) =>{
            var city = {};
            city.value = value.name
            city.label = value.name
            return city
        })
        return provice
    })

}