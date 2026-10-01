// สร้าง payload พร้อมเพย์ (Thai QR Payment / EMVCo) แบบระบุยอด

function tlv(tag: string, value: string) {
  return tag + String(value.length).padStart(2, '0') + value
}

function crc16(data: string) {
  let crc = 0xffff
  for (let i = 0; i < data.length; i++) {
    crc ^= data.charCodeAt(i) << 8
    for (let b = 0; b < 8; b++) {
      crc = crc & 0x8000 ? ((crc << 1) ^ 0x1021) & 0xffff : (crc << 1) & 0xffff
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, '0')
}

/** target = เบอร์โทร 10 หลัก หรือเลขบัตรประชาชน/ผู้เสียภาษี 13 หลัก; คืน null ถ้ารูปแบบไม่ถูก */
export function promptPayPayload(target: string, amount?: number): string | null {
  const digits = String(target).replace(/\D/g, '')
  let account: string
  if (digits.length === 13) account = tlv('02', digits)
  else if (digits.length === 10 && digits.startsWith('0')) account = tlv('01', '0066' + digits.slice(1))
  else return null

  const fields =
    tlv('00', '01') +
    tlv('01', amount ? '12' : '11') +
    tlv('29', tlv('00', 'A000000677010111') + account) +
    tlv('58', 'TH') +
    tlv('53', '764') +
    (amount ? tlv('54', amount.toFixed(2)) : '') +
    '6304'
  return fields + crc16(fields)
}
