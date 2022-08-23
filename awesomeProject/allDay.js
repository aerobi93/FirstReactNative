{dataMeteo &&  <ScrollView style={StylesAllDay.container} horizontal ={true}>
{ dataMeteo.daily.map((data, index) =>  {

  return (
  <TouchableOpacity style={StylesAllDay.card}  key={data.dt} onPress={() => setMeteoDetail(index)}>
    <Text style={StylesAllDay.day}>
    {dayDisplay(data.dt)}
    </Text>
   {
    data.weather.map((weather, index) => <Image style= {StylesAllDay.ico} key={index} source= {{uri : `http://openweathermap.org/img/wn/${weather.icon}@2x.png`}} />)
   }
   <View style={StylesAllDay.containerTemp}>
    <Text> {Math.round((data.temp.min - 273) *1)  /1}° </Text>
    <Text style> {Math.round((data.temp.max - 273) * 1)  /1}° </Text>
  </View>
  <Text>	&#9748; {data.humidity}%</Text>
  </TouchableOpacity>
 
)})
}
</ScrollView>}