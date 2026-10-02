import {
  ArrowLeft,
  ArrowRight,
  CaretDown,
  Check,
  CheckCircle,
  ChatCircleText,
  Clock,
  DownloadSimple,
  House,
  Handbag,
  Image,
  Minus,
  MagnifyingGlass,
  Plus,
  QrCode,
  Trash,
  Truck,
  UploadSimple,
  X,
  type Icon as PhosphorIcon,
} from '@phosphor-icons/react'

// ไอคอนทั้งหมดมาจาก Phosphor (ชุดเดียว น้ำหนักเส้นเดียว) ไม่วาด path เอง
const ICONS = {
  home: House,
  bag: Handbag,
  truck: Truck,
  back: ArrowLeft,
  arrowRight: ArrowRight,
  add: Plus,
  remove: Minus,
  close: X,
  delete: Trash,
  search: MagnifyingGlass,
  check: Check,
  checkCircle: CheckCircle,
  image: Image,
  upload: UploadSimple,
  download: DownloadSimple,
  schedule: Clock,
  expand: CaretDown,
  qr: QrCode,
  chat: ChatCircleText,
} satisfies Record<string, PhosphorIcon>

export type IconName = keyof typeof ICONS

export default function Icon({
  name,
  size = 24,
  weight = 'regular',
  className,
}: {
  name: IconName
  size?: number
  weight?: 'regular' | 'bold' | 'fill'
  className?: string
}) {
  const Cmp = ICONS[name]
  return <Cmp size={size} weight={weight} className={className} aria-hidden="true" />
}
