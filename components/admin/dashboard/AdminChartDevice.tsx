"use client"

import Skeleton from "@/components/ui/Skeleton"
import { useAction, usePromise } from "@/lib/ultis/promise"
import { Chart } from "chart.js/auto"
import { memo, useEffect, useRef, useState } from "react"

const AdminChartDevice = ({
  getAccessDevice
}: {
  getAccessDevice: () => Promise<{counts: {mobile: bigint, tablet: bigint, pc: bigint}}>
}) => {
  const [loading, setLoading] = useState(false)

  const [data, setData] = useState<{mobile: number, tablet: number, pc: number}>({
    mobile: 0, 
    tablet: 0, 
    pc: 0
  })

  const fetchData = () => usePromise({
    loading,
    setLoading,
    showSuccessTitle: false,
    callback: async () => {
      const { counts } = await useAction(getAccessDevice)
      setData({
        mobile: Number(counts.mobile),
        tablet: Number(counts.tablet),
        pc: Number(counts.pc)
      })
    }
  })

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <div className="w-full rounded-lg bg-white p-6 h-80 flex flex-col space-y-6">
      <div className="flex-none flex items-center space-x-3">
        <div className="rounded w-4 h-8 bg-slate-900"></div>
        <p className="font-semibold">Thiết bị truy cập</p>
      </div>
      <div className="flex-grow min-h-0 flex justify-center items-center">
        { loading
          ? <div className="animate-pulse">
              <div className="h-full aspect-square">
                <Skeleton className="!w-full !h-full rounded-full" />
              </div>
              <div className="flex-col justify-self-center ml-6">
                <Skeleton width={150} />
                <Skeleton width={100} />
                <Skeleton width={120} />
              </div>
            </div>
          : <ChartTwo data={data} />
        }
      </div>
    </div>
  )
}

const ChartTwo = memo(({
  data: {mobile, tablet, pc}
}: {
  data: {mobile: number, tablet: number, pc: number}
}) => {
  const chartEl = useRef<HTMLCanvasElement | null>(null)
  const chart = useRef<Chart<"doughnut">>()

  const getPercent = (type: 'mobile' | 'tablet' | 'pc') => {
    const totalCount = mobile + tablet + pc
    return Math.round((type == "mobile" ? mobile : type == "tablet" ? tablet : pc) / totalCount * 100)
  }

  useEffect(() => {
    if (chartEl.current) {
      chart.current = new Chart(chartEl.current, {
        type: 'doughnut',
        data: {
          labels: ['Di động', 'Máy tính bảng', 'Máy tính để bàn'],
          datasets: [
            {
              label: 'Dataset 1',
              data: [mobile, tablet, pc],
              backgroundColor: ['#0ea5e9', '#10b981', '#ef4444'],
            }
          ]
        },
        options: {
          responsive: true,
          plugins: {
            filler: {
              propagate: false,
            },
            title: {
              display: false
            },
            legend: {
              display: false
            },
          },
        },
      })
    }
    
    return () => {
      chart.current?.destroy()
    }
  }, [])

  return <>
    <canvas ref={chartEl} ></canvas>
    <div className="flex-col justify-self-center ml-6">
      <div className="flex items-center space-x-2">
        <span className="w-2 h-2 rounded-full bg-sky-500"></span>
        <span>{getPercent('mobile')}% thiết bị di động</span>
      </div>
      <div className="flex items-center space-x-2">
        <span className="w-2 h-2 rounded-full bg-teal-500"></span>
        <span>{getPercent('tablet')}% máy tính bảng</span>
      </div>
      <div className="flex items-center space-x-2">
        <span className="w-2 h-2 rounded-full bg-red-500"></span>
        <span>{getPercent('pc')}% máy tính để bàn</span>
      </div>
    </div>
  </>
})

export default AdminChartDevice