const SHEET_ID = '1oe2Nj6b0-ylTgyPCEmLgP-95NAI8NA-J_1EiUU2ahEc'
const PRODUCTS_SHEET = 'Products'
const ORDERS_SHEET = 'Orders'
const SETTINGS_SHEET = 'Settings'
const SLIP_FOLDER_NAME = 'Haulio Preorder Slips'

function doGet(e) {
  const type = e.parameter.type

  if (type === 'products') {
    return jsonResponse(readProducts())
  }
  if (type === 'settings') {
    return jsonResponse(readSettings())
  }
  if (type === 'order') {
    return jsonResponse({ order: findOrder(e.parameter.id) })
  }
  return jsonResponse({ error: 'unknown type' })
}

function doPost(e) {
  const body = JSON.parse(e.postData.contents)

  if (body.action === 'createOrder') {
    const orderId = createOrder(body)
    return jsonResponse({ orderId })
  }
  return jsonResponse({ error: 'unknown action' })
}

function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON,
  )
}

function sheetByName(name) {
  return SpreadsheetApp.openById(SHEET_ID).getSheetByName(name)
}

function rowsAsObjects(sheet) {
  const values = sheet.getDataRange().getValues()
  const headers = values[0]
  return values.slice(1).map((row) => {
    const obj = {}
    headers.forEach((h, i) => (obj[h] = row[i]))
    return obj
  })
}

function readProducts() {
  const sheet = sheetByName(PRODUCTS_SHEET)
  return rowsAsObjects(sheet)
    .filter((p) => p.id)
    .map((p) => ({
      id: String(p.id),
      name: p.name,
      category: p.category,
      brand: p.brand || '',
      price: Number(p.price),
      imageUrl: p.imageUrl,
      description: p.description || '',
      deadline: p.deadline || '',
      variants: p.variants
        ? String(p.variants)
            .split(',')
            .map((v) => v.trim())
            .filter(Boolean)
        : [],
      available: String(p.available).toUpperCase() === 'TRUE',
    }))
}

function readSettings() {
  const sheet = sheetByName(SETTINGS_SHEET)
  const values = sheet.getDataRange().getValues()
  const map = {}
  values.slice(1).forEach((row) => {
    map[row[0]] = row[1]
  })

  return {
    bank: {
      bankName: map.bankName || '',
      accountName: map.accountName || '',
      accountNumber: map.accountNumber || '',
      promptpay: map.promptpay || '',
    },
    schedule: {
      kr: { openRange: map.kr_openRange || '', shipDate: map.kr_shipDate || '' },
      jp: { openRange: map.jp_openRange || '', shipDate: map.jp_shipDate || '' },
    },
  }
}

function findOrder(orderId) {
  const sheet = sheetByName(ORDERS_SHEET)
  const match = rowsAsObjects(sheet).find((o) => String(o.orderId) === orderId)
  if (!match) return null

  return {
    id: match.orderId,
    customerName: match.customerName,
    customerPhone: match.customerPhone,
    lineId: match.lineId || '',
    address: match.address,
    note: match.note,
    items: JSON.parse(match.itemsJson || '[]'),
    total: Number(match.total),
    slipUrl: match.slipUrl,
    status: match.status,
    createdAt: match.createdAt,
  }
}

function createOrder(body) {
  const orderId = 'HL' + Utilities.getUuid().slice(0, 8).toUpperCase()
  const slipUrl = saveSlipImage(body.slipBase64, body.slipFileName, orderId)

  const sheet = sheetByName(ORDERS_SHEET)
  sheet.appendRow([
    orderId,
    new Date(),
    body.customerName,
    body.customerPhone,
    body.address,
    body.note || '',
    JSON.stringify(body.items),
    body.total,
    slipUrl,
    'pending',
    body.lineId || '',
  ])

  return orderId
}

function saveSlipImage(base64, fileName, orderId) {
  const folders = DriveApp.getFoldersByName(SLIP_FOLDER_NAME)
  const folder = folders.hasNext() ? folders.next() : DriveApp.createFolder(SLIP_FOLDER_NAME)

  const bytes = Utilities.base64Decode(base64)
  const ext = (fileName || '').split('.').pop().toLowerCase()
  const mimeType = ext === 'png' ? 'image/png' : 'image/jpeg'
  const blob = Utilities.newBlob(bytes, mimeType, `${orderId}_${fileName || 'slip.jpg'}`)

  const file = folder.createFile(blob)
  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW)
  return `https://drive.google.com/uc?id=${file.getId()}`
}
