import { supabase } from '@/lib/supabase'

// CREATE - upload an image and add to a card
export async function addCardImage(cardId: string, imageFile: {
  uri: string
  name: string
  type: string
}) {
  // Step 1 - upload image to Supabase Storage
  const filePath = `cards/${cardId}/${imageFile.name}`
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('cards')
    .upload(filePath, {
      uri: imageFile.uri,
      name: imageFile.name,
      type: imageFile.type,
    } as any)

  if (uploadError) return { data: null, error: uploadError }

  // Step 2 - get the public URL of the uploaded image
  const { data: urlData } = supabase.storage
    .from('cards')
    .getPublicUrl(filePath)

  // Step 3 - save the image URL to card_images table
  const { data, error } = await supabase
    .from('card_images')
    .insert({
      card_id: cardId,
      image_url: urlData.publicUrl,
      order_index: 0
    })
    .select()
    .single()

  return { data, error }

  // Step 4 - automatically trigger OCR     ====> PROBABLY NEED TO MOVE THIS AND CHECK THE CODE AS WELL; IT IS TO CALL THE OCR SERVICE TO EXTRACT TEXT FROM THE IMAGE AND SAVE IT TO THE CARD. THIS SHOULD HAPPEN AFTER THE IMAGE IS UPLOADED AND SAVED IN THE DATABASE, SO THAT THE OCR SERVICE CAN ACCESS THE IMAGE URL AND CARD ID TO UPDATE THE CARD WITH THE EXTRACTED TEXT.
  await fetch('http://localhost:5000/ocr', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      image_url: urlData.publicUrl,
      card_id: cardId
    })
  })

}

// READ - get all images for a card
export async function getCardImages(cardId: string) {
  const { data, error } = await supabase
    .from('card_images')
    .select('*')
    .eq('card_id', cardId)
    .order('order_index', { ascending: true })
  return { data, error }
}

// UPDATE - update image order
export async function updateImageOrder(imageId: string, orderIndex: number) {
  const { data, error } = await supabase
    .from('card_images')
    .update({ order_index: orderIndex })
    .eq('id', imageId)
    .select()
    .single()
  return { data, error }
}

// DELETE - delete an image
export async function deleteCardImage(imageId: string, imageUrl: string) {
  // Step 1 - delete from Storage
  const filePath = imageUrl.split('/cards/')[1]
  const { error: storageError } = await supabase.storage
    .from('cards')
    .remove([`cards/${filePath}`])

  if (storageError) return { data: null, error: storageError }

  // Step 2 - delete from card_images table
  const { data, error } = await supabase
    .from('card_images')
    .delete()
    .eq('id', imageId)

  return { data, error }
}