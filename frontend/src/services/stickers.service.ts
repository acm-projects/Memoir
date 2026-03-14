import { supabase } from '@/lib/supabase'

// READ - get all preset stickers
export async function getPresetStickers() {
  const { data, error } = await supabase
    .from('stickers')
    .select('*')
    .eq('is_preset', true)
  return { data, error }
}

// READ - get all custom stickers for a user
export async function getUserStickers(userId: string) {
  const { data, error } = await supabase
    .from('stickers')
    .select('*')
    .eq('user_id', userId)
    .eq('is_preset', false)
  return { data, error }
}

// READ - get all stickers (preset + user's custom)
export async function getAllStickers(userId: string) {
  const { data, error } = await supabase
    .from('stickers')
    .select('*')
    .or(`is_preset.eq.true,user_id.eq.${userId}`)
    .order('is_preset', { ascending: false })
  return { data, error }
}

// CREATE - upload a custom sticker
export async function uploadCustomSticker(userId: string, stickerFile: {
  uri: string
  name: string
  type: string
}) {
  // Step 1 - upload to Supabase Storage
  const filePath = `stickers/${userId}/${stickerFile.name}`
  const { error: uploadError } = await supabase.storage
    .from('stickers')
    .upload(filePath, {
      uri: stickerFile.uri,
      name: stickerFile.name,
      type: stickerFile.type,
    } as any)

  if (uploadError) return { data: null, error: uploadError }

  // Step 2 - get public URL
  const { data: urlData } = supabase.storage
    .from('stickers')
    .getPublicUrl(filePath)

  // Step 3 - save to stickers table
  const { data, error } = await supabase
    .from('stickers')
    .insert({
      user_id: userId,
      image_url: urlData.publicUrl,
      is_preset: false
    })
    .select()
    .single()

  return { data, error }
}

// DELETE - delete a custom sticker
export async function deleteCustomSticker(stickerId: string, imageUrl: string) {
  // Step 1 - delete from Storage
  const filePath = imageUrl.split('/stickers/')[1]
  const { error: storageError } = await supabase.storage
    .from('stickers')
    .remove([`stickers/${filePath}`])

  if (storageError) return { data: null, error: storageError }

  // Step 2 - delete from stickers table
  const { data, error } = await supabase
    .from('stickers')
    .delete()
    .eq('id', stickerId)

  return { data, error }
}

// CREATE - place a sticker on a folder
export async function addStickerToFolder(
  folderId: string,
  stickerId: string,
  position: { x: number, y: number, scale: number }
) {
  const { data, error } = await supabase
    .from('folder_stickers')
    .insert({
      folder_id: folderId,
      sticker_id: stickerId,
      position_x: position.x,
      position_y: position.y,
      scale: position.scale
    })
    .select()
    .single()
  return { data, error }
}

// READ - get all stickers on a folder
export async function getFolderStickers(folderId: string) {
  const { data, error } = await supabase
    .from('folder_stickers')
    .select('*, stickers(*)')
    .eq('folder_id', folderId)
  return { data, error }
}

// UPDATE - update sticker position on folder
export async function updateStickerPosition(
  folderStickerId: string,
  position: { x: number, y: number, scale: number }
) {
  const { data, error } = await supabase
    .from('folder_stickers')
    .update({
      position_x: position.x,
      position_y: position.y,
      scale: position.scale
    })
    .eq('id', folderStickerId)
    .select()
    .single()
  return { data, error }
}

// DELETE - remove a sticker from a folder
export async function removeStickerFromFolder(folderStickerId: string) {
  const { data, error } = await supabase
    .from('folder_stickers')
    .delete()
    .eq('id', folderStickerId)
  return { data, error }
}

// ## What's Different Here
// ### This file handles THREE tables
// stickers         → the actual sticker images
// folder_stickers  → which stickers are on which folders
// storage bucket   → the actual image files