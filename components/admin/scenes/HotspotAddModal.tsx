"use client"

import { useRouter } from 'next/navigation';
import { Dispatch, FormEvent, SetStateAction, useEffect, useState } from 'react'
import { SceneDataState } from '@/app/admin/(admin)/scenes/page';
import { useAction, usePromise } from '@/lib/utils/promise';
import { createEditHotspot } from '@/actions/admin/scenes';
import { Modal, ModalAction, ModalContent, ModalTitle } from '@/components/ui/Modal';
import ButtonAdmin from '../form/ButtonAdmin';
import { Tab, TabContent, TabList, Tabs } from '@/components/ui/Tabs';
import InputAdmin from '../form/InputAdmin';
import RelationInputAdmin from '../form/RelationInputAdmin';
import SelectAdmin from '../form/SelectAdmin';
import RichTextAdmin from '../form/RichTextAdmin';

const HotspotAddModal = ({
  sceneId, coordinates, data, open, setOpen, tabCurrentHotspot, setTabCurrentHotspot,
  scenes
}: {
  scenes: SceneDataState[],
  sceneId?: string,
  coordinates: {
    yaw: number;
    pitch: number;
  },
  data?: any | null,
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>;
  tabCurrentHotspot: 'link' | 'info',
  setTabCurrentHotspot: Dispatch<SetStateAction<'link' | 'info'>>;
}) => {
  const router = useRouter()

  const [target, setTarget] = useState<any>(null)
  const [type, setType] = useState<string>('1')
  const [title, setTitle] = useState('')
  const [video, setVideo] = useState('')
  const [description, setDescription] = useState('')

  useEffect(() => {
    if (data) {
      if (data.target) {
        const tempData = scenes.find(v => v.id == data.target)
        setTarget(tempData || undefined)
      }
      setType(data.type || '1')
      setTitle(data.title || '')
      setVideo(data.video || '')
      setDescription(data.description || '')
    }
    else {
      setTarget(null)
      setType('1')
      setTitle('')
      setVideo('')
      setDescription('')
    }
  }, [data])

  const handleClose = () => {
    if (loading) return
    setOpen(false)
  }

  const handleChangeTab = (event: React.SyntheticEvent, newValue: 'link' | 'info') => {
    setTabCurrentHotspot(newValue)
  };

  // const [infoType, setInfoType] = useState('1')

  const [loading, setLoading] = useState(false)
  const handelSubmit = async (e: FormEvent) => {
    e.preventDefault()
    await usePromise({
      loading: loading,
      setLoading: setLoading,
      callback: async () => {
        await useAction(() => createEditHotspot({
          id: data?.id,
          sceneId: sceneId || '',
          hotspotType: tabCurrentHotspot,
          yaw: data ? data.yaw : (coordinates.yaw || ''),
          pitch: data ? data.pitch : (coordinates.pitch || ''),
          target,
          type,
          title,
          description,
          video
        }))

        router.refresh()
        setOpen(false)
      }
    })
  }

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
      >
        <ModalTitle>{data ? 'Sửa' : 'Thêm'} điểm nóng mới</ModalTitle>
        <ModalContent>
          <Tabs value={tabCurrentHotspot} setValue={setTabCurrentHotspot}>
            <TabList>
              <Tab value="link">Liên kết</Tab>
              <Tab value="info">Thông tin</Tab>
            </TabList>

            <TabContent value="link">
              <div className="mt-4 rounded bg-gray-50 p-4 flex flex-col space-y-4">
                <InputAdmin disabled label="Tọa độ" value={JSON.stringify(data ? {yaw: data.yaw, pitch: data.pitch} : coordinates)} />
                <RelationInputAdmin 
                  label='Chọn điểm chụp' 
                  details={{tableNameRelation: 'scene', titleRelation: 'name', typeRelation: 'many-to-one'}} 
                  required={true} 
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                />
                <SelectAdmin label='loại' required value={type} onChange={e => setType(e.target.value)}>
                  <option value="1" selected>Cơ bản</option>
                  <option value="2">Trên cao</option>
                  <option value="3">Mặt đất</option>
                  <option value="4">Thông tin</option>
                </SelectAdmin>
              </div>
            </TabContent>
            <TabContent value="info">
              <div className="mt-4 rounded bg-gray-50 p-4 flex flex-col space-y-4">
                <InputAdmin disabled label="Tọa độ" value={JSON.stringify(data ? {yaw: data.yaw, pitch: data.pitch} : coordinates)} />
                <InputAdmin 
                  label='Tiêu đề' 
                  name='title' 
                  required={true} 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <SelectAdmin label='loại' name='type' required value={type} onChange={e => setType(e.target.value)}>
                  <option value="1" selected>Cơ bản</option>
                  <option value="2">Video</option>
                </SelectAdmin>

                {
                  type == "2"
                  ? <InputAdmin 
                    label='Video' 
                    name='video' 
                    required={true} 
                    value={video}
                    onChange={(e) => setVideo(e.target.value)}
                  />
                  : <RichTextAdmin 
                    placeholder='eg. NrkWdRHKfZE' 
                    label='Nội dung' 
                    name='description' 
                    required={true} 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                }
            
              </div>
            </TabContent>
          </Tabs>
        </ModalContent>
        <ModalAction>
          <ButtonAdmin disabled={loading} color='white' onClick={() => setOpen(false)}>
            Hủy bỏ
          </ButtonAdmin>
          <ButtonAdmin disabled={loading} className='!ml-auto' startIcon={loading ? "progress_activity" : null} >Tiếp tục</ButtonAdmin>
        </ModalAction>
      </Modal>
    </>
  )
}

export default HotspotAddModal