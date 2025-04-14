import { useDidHide, useDidShow } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { createMemo, createSignal, mergeProps, onCleanup, onMount, Show, splitProps } from 'solid-js'
import { requestAnimationFrame, cancelAnimationFrame, ensureNumber } from './utils'
import type { CountToProps } from './types'
import './index.scss'

const defaultProps = {
  startVal: 0,
  endVal: 0,
  duration: 3000,
  autoStart: true,
  decimals: 0,
  useEasing: true,
  decimal: '.',
  separator: '',
  className: '',
}

const Index = (props: CountToProps) => {
  const merged = mergeProps(defaultProps, props)

  const [local, _rest] = splitProps(merged, [
    'startVal',
    'endVal',
    'duration',
    'autoStart',
    'decimals',
    'useEasing',
    'decimal',
    'separator',
    'className',
    'onFinish',
    'ref',
    'prefix',
    'suffix',
  ])


  onMount(() => {
    local.autoStart && start()
  })

  useDidShow(() => {
    local.autoStart && start()
  })

  const formatNumber = (num) => {
    num = Number(num)
    num = num.toFixed(Number(local.decimals))
    num += ''
    const x = num.split('.')
    let x1 = x[0]
    const x2 = x.length > 1 ? local.decimal + x[1] : ''
    const rgx = /(\d+)(\d{3})/
    if (local.separator && !ensureNumber(local.separator)) {
      while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + local.separator + '$2')
      }
    }
    return x1 + x2
  }

  const [displayValue, setDisplayValue] = createSignal<string>(formatNumber(local.startVal))

  let localData = {
    localStartVal: local.startVal,
    localDuration: local.duration,
  }
  let remaining: number | null = null
  let paused: boolean = true
  let rAF: any = null
  let startTime: number | null = null
  let printVal: number = local.startVal

  const countDown = createMemo<boolean>(() => {
    return local.startVal > local.endVal
  })

  const easingFn = (t, b, c, d) => {
    return (c * (-Math.pow(2, (-10 * t) / d) + 1) * 1024) / 1023 + b
  }

  const start = () => {
    if (!paused)
      return
    localData = {
      localStartVal: local.startVal,
      localDuration: local.duration,
    }
    startTime = null
    paused = false
    rAF = requestAnimationFrame(count)
  }

  const pause = () => {
    if (paused)
      return
    paused = true
    cancelAnimationFrame(rAF)
  }

  const resume = () => {
    if (!paused)
      return
    paused = false
    startTime = null
    localData = {
      localStartVal: printVal,
      localDuration: remaining || local.duration,
    }
    rAF = requestAnimationFrame(count)
  }

  const reset = () => {
    paused = true
    cancelAnimationFrame(rAF)
    localData = {
      localStartVal: local.startVal,
      localDuration: local.duration,
    }
    printVal = local.startVal
    remaining = null
    startTime = null
    setDisplayValue(formatNumber(local.startVal))
  }

  local.ref && local.ref({
    start,
    pause,
    resume,
    reset,
  })


  const count = (timestamp: number) => {
    if (!startTime) startTime = timestamp

    const { localDuration, localStartVal } = localData

    const progress = timestamp - (startTime || 0)
    remaining = localDuration - progress

    let value: number
    if (local.useEasing) {
      value = countDown()
        ? easingFn(progress, 0, localStartVal - local.endVal, localDuration)
        : easingFn(
          progress,
          localStartVal,
          local.endVal - localStartVal,
          localDuration,
        )
    } else {
      value = countDown()
        ? localStartVal - (localStartVal - local.endVal) * (progress / localDuration)
        : localStartVal + (local.endVal - localStartVal) * (progress / localDuration)
    }

    printVal = countDown()
      ? Math.max(value, local.endVal)
      : Math.min(value, local.endVal)

    setDisplayValue(formatNumber(printVal) || '0')
    if (progress < localDuration) {
      rAF = requestAnimationFrame(count)
    } else {
      local.onFinish && local.onFinish()
    }
  }

  onCleanup(() => {
    cancelAnimationFrame(rAF)
  })

  useDidHide(() => {
    cancelAnimationFrame(rAF)
  })

  return (
    <View class={'count-up ' + local.className || ''}>
      <Show when={!!local.prefix}>
        <Text class='count-up__prefix'>{local.prefix}</Text>
      </Show>
      <Text class='count-up__content'>{displayValue()}</Text>
      <Show when={!!local.suffix}>
        <Text class='count-up__suffix'>{local.suffix}</Text>
      </Show>
    </View>
  )
}

const CountUp = Index
export { CountUp }
export default CountUp
