/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React , {useEffect, useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Pressable,
  Image,
  TextInput,
  TouchableOpacity
} from 'react-native';


import  Header  from './awesomeProject/header';
import {dayDisplay, searchTempMax, searchTempMin} from "./awesomeProject/utils"


const App = () => {
  let [dataMeteo, setDataMeteo] = useState()
  let [dtSelected, setDtSelected] = useState()
  let [actualTime, setActualTime] = useState()
  let [displayHourData , setDisplayHourData] =  useState()

  let [dataByHourly, setDataByHourly] = useState()
  
 
  let [lat, setLat] = useState(50.633)
  let [lon, setLon] = useState(3.0586)
  let [town, setTown] = useState("paris")
  let [toogleChangeTown, setToogleChangeTown] = useState()
  let [newValue, setNewValue] = useState()


const researchTown  = (newTown) => {
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${newTown}&appid=3571c0352c17d542004999a575b6f178`)
  .then(res => res.json())
  .then (json =>  {
    setLat(json.coord.lat)
    setLon(json.coord.lon)
    setTown(newTown)
  })
  .catch((err) => {
    console.log(err, "err")
  })
}

  useEffect(() => {
    if (town) {
      fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&lang=fr&appid=3571c0352c17d542004999a575b6f178&unit=Celsius`, {
        method : 'GET'
      })
      .then(res => res.json())
      .then (json => { 
        if(json.daily) {setDataMeteo(json)}
      })
      .catch((err) => {
        console.log(err, "err")
      })
    }
  }, [lat])
  
  useEffect(() => {

    let actualHour = new Date(Date.now()).getHours()
    let actualHourArrounded = new Date(Date.now()).setHours(actualHour,0,0) / 1000
    let today23h = new Date(Date.now()).setHours(23,0,0) /1000
    let actualAt00 = new Date(Date.now()).setHours(0,0,0) 
    let tomorow = new Date(actualAt00 + (60 * 60 * 24 * 1000)) /1000
    let afterTomorow = new Date(actualAt00 + (60 * 60 * 48 * 1000)) / 1000

    if (!dtSelected) {
      setDtSelected(parseInt(new Date(Date.now()).setHours(actualHour, 0, 0) /1000))
    }
    else if (dtSelected < Date.now()/1000) {
      setDtSelected(parseInt(new Date(Date.now()).setHours(actualHour, 0, 0) /1000))
    }

    if(dataMeteo) {
      if (dtSelected <= today23h)  {
        let dataToday = dataMeteo.hourly.filter((element) => (
          element.dt >= actualHourArrounded && element.dt < tomorow
        ))
        setDataByHourly(dataToday)
        setDisplayHourData(true)
      }
      else if (dtSelected >= tomorow  && dtSelected <=  afterTomorow) {
        let dataTomorow = dataMeteo.hourly.filter((element) => (
          element.dt > tomorow && element.dt < afterTomorow
        ))
        setDataByHourly(dataTomorow)
        setDisplayHourData(true)
      }

      else setDisplayHourData(false)

    }
  }, [dataMeteo, dtSelected])

  useEffect(() => {
  },[displayHourData])
  return (
    <SafeAreaView style={{backgroundColor : '#1A99D2'}}>
      <StatusBar  />
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <View style = {{ padding : 24}}>
        { 
          // header with town name && button to change this
        }
          { town && <Header title={town} />}
          
          { (town && !toogleChangeTown) &&   
          <Pressable  onPress={(evt) => setToogleChangeTown(!toogleChangeTown)}>
            <Text style = {StylesApp.buttonText}> + changer de ville</Text>
          </Pressable>
          }
          { (town && toogleChangeTown) && 
            <TextInput 
              placeholder='nom de la ville'
              style= {StylesApp.button}
              value={newValue}
              onChangeText = {setNewValue}
              onSubmitEditing = {
                () => {
                  researchTown(newValue)
                  setToogleChangeTown(!toogleChangeTown)
                }
              }
            />
          }  
        </View>
        {
          // detail by hour in default actual 
        }
       {(displayHourData && dataMeteo) && dataMeteo.hourly.map((detail) => {
        if(detail.dt == dtSelected) {
          return (
            <View  key={detail.dt}>
              <View style={{flexDirection : 'row'}}>
                <View style={{width : "60%"}}>
                  <Text style= {StylesDetail.temp}> {Math.round(detail.temp - 273)}°</Text>
                </View>
                <View style={{width: "40%"}}>
                  {
                    detail.weather.map((weather, index) => 
                    <Image key= {index} style= {StylesDetail.ico}  source= {{uri : `http://openweathermap.org/img/wn/${weather.icon}@2x.png`}} />
                    )
                  }
                  <Text style={StylesDetail.descr}>
                    {
                      detail.weather.map((weather) => weather.description)
                    }
                  </Text>
                </View>
              </View>
              <View style={{width : "60%", position : "relative", top : -32}}>
                  {
                    dataMeteo.daily.map((dataDaily) => {
                      if ( dataDaily.dt == new Date(dtSelected *1000).setHours(13,0,0) /1000) {
                        return (
                          <View key={dataDaily.dt}> 
                            <Text style={{textAlign:'center'}}> { "min " + Math.round(dataDaily.temp.min - 273)+'°'  + ' ' +'max ' + Math.round(dataDaily.temp.max - 273)+'°'}</Text>
                            <Text style={{textAlign:'center'}}> resenti : {Math.round(dataDaily.feels_like.day  - 273 )}°</Text>
                          </View>
                        )
                      }
                    })
                  }
              </View>
            </View>
          )
        } 
      })}

      {(!displayHourData && dataMeteo) && dataMeteo.daily.map((detail) => {
        if (( detail.dt == new Date(dtSelected *1000).setHours(13,0,0) /1000)) {
          return (
            <View  key={detail.dt}>
              <View style={{flexDirection : 'row'}}>
                <View style={{width : "60%"}}>
                  <Text style= {StylesDetail.temp}> {Math.round(detail.feels_like.day - 273)}°</Text>
                </View>
                <View style={{width: "40%"}}>
                  {
                    detail.weather.map((weather, index) => 
                    <Image key= {index} style= {StylesDetail.ico}  source= {{uri : `http://openweathermap.org/img/wn/${weather.icon}@2x.png`}} />
                    )
                  }
                  <Text style={StylesDetail.descr}>
                    {
                      detail.weather.map((weather) => weather.description)
                    }
                  </Text>
                </View>
              </View>
              <View style={{width : "60%", position : "relative", top : -32}}>
                  {
                    dataMeteo.daily.map((dataDaily) => {
                      if ( dataDaily.dt == new Date(dtSelected *1000).setHours(13,0,0) /1000) {
                        return (
                          <View key={dataDaily.dt}> 
                            <Text style={{textAlign:'center'}}> { "min " + Math.round(dataDaily.temp.min - 273)+'°'  + ' ' +'max ' + Math.round(dataDaily.temp.max - 273)+'°'}</Text>
                            <Text style={{textAlign:'center'}}> resenti : {Math.round(dataDaily.feels_like.day  - 273 )}°</Text>
                          </View>
                        )
                      }
                    })
                  }
              </View>
            </View>
          )
        }
         
      })}
      {(displayHourData && dataMeteo) && <ScrollView style={StylesAllDay.container} horizontal ={true}>
        {
        dataByHourly && dataByHourly.map((dataHourly) => {
          let date = new Date(dataHourly.dt * 1000)
          
          return (
            <TouchableOpacity key={dataHourly.dt} style={{paddingHorizontal: 8}} onPress={() => setDtSelected(dataHourly.dt)}>
              <Text style={{textAlign:"center"}}>{date.getHours()}h</Text>
              {
                dataHourly.weather.map((weather, index) => <Image style= {StylesAllDay.ico} key={index} source= {{uri : `http://openweathermap.org/img/wn/${weather.icon}@2x.png`}} />)
              }
              <Text style={{textAlign: "center"}}>{Math.round(dataHourly.feels_like - 273 )}° </Text>
              <Text>	&#9748; {Math.round(dataHourly.pop * 100)}%</Text>
            </TouchableOpacity>
          )
        })
      }
      </ScrollView>}
      
      {
      // scroll view with daily data 
      }

      {dataMeteo &&  
        <ScrollView style={StylesAllDay.container} horizontal ={true}>
          { 
            dataMeteo.daily.map((data) =>  {
              return (
              <TouchableOpacity style={StylesAllDay.card}  key={data.dt} onPress={() => setDtSelected(data.dt)}>
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
              <Text>	&#9748; {Math.round(data.pop * 100)}%</Text>
              </TouchableOpacity>
            )})
          }
        </ScrollView>
      }
      {
        (dataMeteo && dtSelected) &&  dataMeteo.daily.map((dataDaily) => {
          if (dataDaily.dt == new Date(dtSelected *1000).setHours(13,0,0) /1000) {
            return (
              <View key={dataDaily.dt} style={StylesAllDay.container} >
                <View  style={{width:'33%'}}>
                  <Text style={{fontSize: 48, textAlign:'center'}}> &#x2600;</Text>
                  <Text style={{fontSize: 16, textAlign:'center'}}> Indice Uv</Text>
                  <Text style={{fontSize: 16, textAlign:'center'}}> {dataDaily.uvi}</Text>
                </View>
                <View style={{width:'33%'}}>
                  <Text style={{fontSize: 48, textAlign:'center'}}>&#127786;</Text>
                  <Text style={{fontSize: 16, textAlign:'center'}}> Vent</Text>
                  <Text style={{fontSize: 16, textAlign:'center'}}> {Math.round(dataDaily.wind_speed * 3.6)}km/h</Text>
                </View>
                <View style={{width:'33%'}}>
                  <Text style={{fontSize: 48, textAlign:'center'}}>&#128167;</Text>
                  <Text style={{fontSize: 16, textAlign:'center'}}> Humidié</Text>
                  <Text style={{fontSize: 16, textAlign:'center'}}> {Math.round(dataDaily.humidity)}%</Text>
                </View>
              </View>
            )
          }
          
        })
      }

      {
        (dataMeteo && dtSelected) &&  dataMeteo.daily.map((dataDaily) => {
          if ( dataDaily.dt == new Date(dtSelected *1000).setHours(13,0,0) /1000) {
            return (
              <View key={dataDaily.dt} style={StylesAllDay.container}> 
                <View style={{marginHorizontal : 24}}> 
                  <Text style={{fontSize : 18,  textAlign: "center"}}>
                    lever du soleil
                  </Text>
                  <Text style={{fontSize : 24, fontWeight : "bold",  textAlign: "center"}}>
                    {new Date(dataDaily.sunrise * 1000).getHours() + ':' + new Date(dataDaily.sunrise * 1000).getMinutes() }
                  </Text>
                  <Text style={{ color : "green", textAlign: 'center', fontSize: 36}}> &#x2600;</Text>
                  <View style={{ borderBottomColor : "brown", borderBottomWidth : 2, borderStyle: "solid", position: "relative", top: -24}} />
                </View>

                <View style={{marginHorizontal : 24}}> 
                  <Text style={{fontSize : 18,  textAlign: "center"}}>
                    couche du soleil
                  </Text>
                  <Text style={{fontSize : 24, fontWeight : "bold",  textAlign: "center"}}>
                    {new Date(dataDaily.sunset * 1000).getHours() + ':' + new Date(dataDaily.sunrise * 1000).getMinutes() }
                  </Text>
                  <Text style={{ color : "green", textAlign: 'center', fontSize: 36}}> &#x2600;</Text>
                  <View style={{ borderBottomColor : "brown", borderBottomWidth : 2, borderStyle: "solid", position: "relative", top: -36 }} />
                </View>
               
              </View>
            
            )
          }
        })
      }
      
      
      </ScrollView>
    </SafeAreaView>

  );
};

const StylesApp = StyleSheet.create({
  buttonText  : { 
    marginVertical : 24,
    textAlign : "center"
  }, 
  button : {
    borderColor : "black",
    borderRadius : 20,
    borderStyle : "solid",
    borderWidth: 1, 
    width :  '70%', 
    marginHorizontal: '15%',
    marginVertical : 16
  }
})

const StylesDetail = StyleSheet.create({
  ico : {
    width : 110,
    height : 110,
    marginHorizontal: "10%" 
  },
  temp : {
    fontSize :48,
    fontWeight : "bold",
    textAlign : 'center',
    marginTop : 22,
    with : "70%"
  },
  descr : {
    textAlign : "center",
    fontSize : 22
  }
})

const StylesAllDay = StyleSheet.create({
  container : {
    flexDirection: 'row',
    paddingHorizontal : 16,
    backgroundColor: "rgb(16, 176, 234)",
    marginHorizontal: "2.5%",
    marginVertical : 16,
    width: "95%",
    borderRadius :20
  },
  containerTemp: {
    flexDirection : "row",
    justifyContent : "space-around",
  },
  card : {
    flexDirection : "column",
    padding : 24,
  },
  day : {
    textAlign : "center"
  },
  ico: {
    height: 48,
    width : 48
  }
})
export default App;
