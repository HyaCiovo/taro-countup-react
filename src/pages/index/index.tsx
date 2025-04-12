import { View, Button } from '@tarojs/components'
import CountUp from '@/components/count-up'
import { ICountToRef } from '@/components/count-up/types'
import './index.scss'

export default function Index() {
  let CountToRef!: ICountToRef

  return (
    <View class='index'>
      <View class='component-title'>Taro-CountUp-Solid 数字滚动</View>
      <View class='block-title'>基本用法</View>
      <CountUp startVal={30} endVal={500} />
      <View class='block-title'>设置滚动相关参数</View>
      <CountUp startVal={30} endVal={500} duration={2000} useEasing={false} />
      <View class='block-title'>是否显示小数位</View>
      <CountUp startVal={30} endVal={500.55} decimals={2} />
      <View class='block-title'>千分位分隔符</View>
      <CountUp endVal={1500} separator=',' />
      <View class='block-title'>手动控制</View>
      <CountUp
        startVal={30}
        endVal={1500}
        separator=','
        autoStart={false}
        duration={50000}
        ref={CountToRef}
      />
      <View class='controller'>
        <Button onClick={() => CountToRef?.start()} >开始</Button>
        <Button onClick={() => CountToRef?.pause()} >暂停</Button>
        <Button onClick={() => CountToRef?.resume()} >继续</Button>
        <Button onClick={() => CountToRef?.reset()} >重置</Button>
      </View>
    </View>
  )
}
