import React from "react"
import { View, Text, StyleSheet } from "react-native"

const Header = ({ title }) => {
  return (
    <View>
      <Text style={headerStyle.title}>Méteo de {title}</Text>
		</View>
  )
}


const headerStyle = StyleSheet.create({
    title : {
        textAlign : "center",
        fontSize : 36,
				color : "black"
    }
})

export default Header