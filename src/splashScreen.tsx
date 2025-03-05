import { useNavigation } from "@react-navigation/native";
import { Divider } from "@rneui/base";
import React, { useEffect, useState } from "react";
import { StatusBar, Text, View } from "react-native";



export default function Splash() {

    const navigation = useNavigation();
    const [loader, setLoader] = useState(true)

    useEffect(() => {
        Navi()
    })
    const Navi = () => {
        setTimeout(() => {
            setLoader(false)
            navigation.navigate("Todo")
        }, 3000)
    }

    return (
        // <StatusBar translucent={true}>
        <View style={{ flex: 1, backgroundColor: '#a9a4c9' }}>
            <StatusBar backgroundColor={'#a9a4c9'} />
            {loader &&
                <View style={{ alignItems: 'center', top: '25%' }}>
                    <Text style={{ fontSize: 100, fontWeight: 'bold', color: '#7C6F97' }}>To</Text>
                    <Text style={{ fontSize: 40, fontWeight: 'bold', color: '#7C6F97', textDecorationLine: 'line-through' }}>List</Text>
                    <Text style={{ fontSize: 100, fontWeight: 'bold', color: '#7C6F97' }}>Do</Text>
                </View>
                // navigation.navigate('Todo')
            }
        </View>
    )
}