const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

export async function uploadImage(file: File): Promise<string> {
  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    throw new Error('Cloudinary ยังไม่ได้ตั้งค่า ดู README สำหรับขั้นตอนตั้งค่า')
  }

  const form = new FormData()
  form.append('file', file)
  form.append('upload_preset', UPLOAD_PRESET)

  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
    method: 'POST',
    body: form,
  })

  if (!res.ok) {
    throw new Error('อัปโหลดรูปไม่สำเร็จ')
  }

  const data = (await res.json()) as { secure_url: string }
  return data.secure_url
}
