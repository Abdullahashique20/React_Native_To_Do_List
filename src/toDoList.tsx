import { Button, Icon, Input } from "@rneui/base";
import React, { useEffect, useState } from "react";
import { FlatList, ImageBackground, Keyboard, Pressable, Text, TouchableOpacity, View } from "react-native";
import Popover from "react-native-popover-view";
import { useFormik } from "formik";
import * as yup from 'yup'
import { Dialog } from "@rneui/themed";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppFonts } from "./appColors";


export default function ToDOList() {

    const [data, setData] = useState([])
    const [add, setAdd] = useState(false)
    const [isEdit, setIsEdit] = useState(false)
    const [editData, setEditData] = useState()
    const [alert, setAlert] = useState(false)


    useEffect(() => {
        GetData()
    }, [])

    const GetData = async () => {
        let StoreData = await AsyncStorage.getItem('Value')
        StoreData ?
            setData(JSON.parse(StoreData)) : setData([])
    }



    const ValidationSchema = yup.object().shape({
        ListData: yup.string()
            .label('ListData')
            .matches(/^(?!\s+$)[\w\s!@#$%^&*()\-+=\[\]{};:'",.<>?/`~]+$/, 'Empty Space Only Not Allowed')
    })
    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            ListData: isEdit ? editData?.content : ''
        },
        validationSchema: ValidationSchema,
        onSubmit: () => {
        }
    })


    const Submit = async () => {
        if (isEdit) {
            setData((prev) => {
                let val = [...prev]
                val.forEach((item) => {
                    if (item.id == editData.id) {
                        item.content = formik.values.ListData
                    }
                })
                console.log('editt', val);
                AsyncStorage.setItem('Value', JSON.stringify(val))
                return val
            })
            setIsEdit(false)
            setAdd(false)
        }
        else {
            let newId = data?.length > 0 ? data[data.length - 1].id + 1 : 1
            let newData = { content: formik?.values?.ListData, id: newId, selected: false }
            let Update = [...data, newData]
            await AsyncStorage.setItem('Value', JSON.stringify(Update))
            setData(Update)
            setAdd(false)
            formik.resetForm()
        }

    }

    const Remove = async (id: number) => {
        let deleteData = data.filter((item: { id: number; }) => id !== item.id)
        await AsyncStorage.setItem('Value', JSON.stringify(deleteData))
        setData(deleteData)
    }

    const Edit = (item) => {
        setEditData(item)
        setIsEdit(true)
        setAdd(true)
    }

    const renderItem = ({ item, index }: { item: any, index: number }) => {

        return (
            <View style={{ paddingBottom: 10 }}>
                <ImageBackground source={require('./assets/whitePaint.png')} >
                    <View key={index} style={{ flex: 1, flexDirection: 'row', }}>
                        <View style={{ flex: 0.85 }}>
                            <Pressable style={{ flexDirection: 'row' }}
                                onPress={() => {
                                    setData((prev) => {
                                        let val = [...prev]
                                        val.map((itemData) => {
                                            if (itemData.id === item.id) {
                                                item.selected = !item.selected
                                            }
                                        })
                                        AsyncStorage.setItem('Value', JSON.stringify(val))
                                        return val
                                    })
                                }}>
                                <Pressable style={{ paddingHorizontal: 15, top: 5 }}
                                    onPress={() => {
                                        setData((prev) => {
                                            let val = [...prev]
                                            val.map((itemData) => {
                                                if (itemData.id === item.id) {
                                                    item.selected = !item.selected
                                                }
                                            })
                                            AsyncStorage.setItem('Value', JSON.stringify(val))
                                            return val
                                        })
                                    }}>
                                    <Icon type="font-awesome" name={item?.selected ? "check-square-o" : "square-o"} />
                                </Pressable>
                                <Text style={{ textDecorationLine: item?.selected ? 'line-through' : 'none', fontSize: 18, top: 5, fontFamily: AppFonts?.appfonts?.bold }}>{item?.content}</Text>
                            </Pressable>
                        </View>
                        <View style={{ flex: 0.2, justifyContent: 'center', alignItems: 'center' }}>
                            <View style={{ flexDirection: 'row' }}>
                                <TouchableOpacity onPress={() => Edit(item)}>
                                    <Icon name="edit" type="material" size={22} style={{ padding: 5 }} color={'green'} />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => Remove(item.id)}>
                                    <Icon name="delete" type="material" size={22} style={{ padding: 5 }} color={'red'} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </ImageBackground>
            </View>
        )
    }

    const ExitFunction = () => {
        if (formik?.dirty) {
            setAdd(false)
            setTimeout(() => {
                setAlert(true)
            }, 500)
        }
        else {
            setAdd(false);
            formik.resetForm()
        }
    }



    return (
        <View style={{ flex: 1, backgroundColor: AppFonts?.appColors?.primary }}>
            <View style={{ flexDirection: 'row', padding: 10, justifyContent: 'center' }}
            >
                <Text style={{ fontSize: 35, fontFamily: AppFonts?.appfonts?.ultra }}>To Do List</Text>
            </View>
            <View >
                <ImageBackground source={require('./assets/whitePaint.png')} style={{ marginBottom: 10 }}>
                    <TouchableOpacity onPress={() => {
                        setAdd(true);
                    }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                            <Icon size={26} style={{ paddingRight: 15, top: 3 }} type="font-awesome" name="plus-square-o" />
                            <Text style={{ fontFamily: AppFonts?.appfonts?.bold, fontSize: 22 }}>Add the List</Text>
                        </View>
                    </TouchableOpacity>
                </ImageBackground>
                <FlatList
                    data={data}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id.toString()}
                />
            </View>
            <Popover isVisible={add} onRequestClose={() => {
                Keyboard.dismiss();
            }}>
                <View style={{ flex: 1, width: 300, borderRadius: 20, paddingTop: 10, paddingBottom: 20 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 10 }}>
                        <Text style={{ fontSize: 20, fontWeight: 'bold', alignSelf: 'center', }}>write List To Do</Text>
                        <TouchableOpacity onPress={() => {
                            ExitFunction()
                        }}>
                            <Icon size={25} name="close-circle-outline" type="material-community" />
                        </TouchableOpacity>
                    </View>
                    <Input
                        multiline={true}
                        placeholder="What to Do?"
                        value={formik?.values?.ListData}
                        onChangeText={formik.handleChange('ListData')}
                        onBlur={formik.handleBlur('ListData')}
                        errorMessage={formik.errors.ListData && formik?.errors?.ListData ? formik?.errors?.ListData : undefined}
                    />
                    <Button
                        title={'Submit'}
                        containerStyle={{ alignItems: 'center' }}
                        disabled={!formik?.dirty || !formik?.isValid}
                        onPress={() => Submit()}
                        color={AppFonts?.appColors?.primary}
                    />
                </View>
            </Popover>
            <Popover isVisible={alert} popoverStyle={{ padding: 10 }}>
                <Dialog.Title titleStyle={{ width: 200, textAlign: 'center' }} title="Are you sure you want to leave?" />
                <View style={{ flexDirection: 'row', justifyContent: 'center', paddingHorizontal: 10 }}>
                    <Dialog.Button title={'No'} onPress={() => {
                        setAlert(false)
                        setTimeout(() => {
                            setAdd(true);
                        }, 500)
                    }
                    } />
                    <Dialog.Button title={'Yes'}
                        onPress={() => {
                            ExitFunction()
                        }} />
                </View>
            </Popover>
        </View>
    )
}