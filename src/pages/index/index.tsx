import { View, Button } from '@tarojs/components'
import { useLoad } from '@tarojs/taro'
import CountUp from '@/components/count-up'
import React from 'react'
import './index.scss'


export default function Index() {
  useLoad(() => {
    console.log('Page loaded.')
  })

  const CountUpRef = React.useRef<any>()

  return (
    <View className='index'>
      <View className='component-title'>Taro-CountUp-React 数字滚动</View>
      <View className='block-title'>基本用法</View>
      <CountUp startVal={30} endVal={500} />
      <View className='block-title'>设置滚动相关参数</View>
      <CountUp startVal={30} endVal={500} duration={2000} useEasing={false} />
      <View className='block-title'>是否显示小数位</View>
      <CountUp startVal={30} endVal={500.55} decimals={2} />
      <View className='block-title'>千分位分隔符</View>
      <CountUp endVal={1500} separator=',' />
      <View className='block-title'>手动控制</View>
      <CountUp
        startVal={30}
        endVal={1500}
        separator=','
        autoStart={false}
        duration={50000}
        ref={CountUpRef}
      />
      <View className='controller'>
        <Button onClick={() => CountUpRef.current?.start()} >开始</Button>
        <Button onClick={() => CountUpRef.current?.pause()} >暂停</Button>
        <Button onClick={() => CountUpRef.current?.resume()} >继续</Button>
        <Button onClick={() => CountUpRef.current?.reset()} >重置</Button>
      </View>
    </View>
  )
}
