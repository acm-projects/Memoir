import { supabase } from '@/lib/supabase'

// CREATE - create a new card
export async function createCard(userId: string, card: {
  title?: string
  caption?: string
  folder_id?: string
  event_date?: string
}) {
  const { data, error } = await supabase
    .from('cards')
    .insert({ ...card, user_id: userId })
    .select()
    .single()
  return { data, error }
}

// READ - get all cards for a user
export async function getCards(userId: string) {
  const { data, error } = await supabase
    .from('cards')
    .select('*, card_images(*)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  return { data, error }
}

// READ - get all cards in a specific folder
export async function getCardsByFolder(folderId: string) {
  const { data, error } = await supabase
    .from('cards')
    .select('*, card_images(*)')
    .eq('folder_id', folderId)
    .order('created_at', { ascending: false })
  return { data, error }
}

// READ - get a single card by id
export async function getCardById(cardId: string) {
  const { data, error } = await supabase
    .from('cards')
    .select('*, card_images(*), card_tags(*, tags(*))')
    .eq('id', cardId)
    .single()
  return { data, error }
}

// UPDATE - update a card
export async function updateCard(cardId: string, updates: {
  title?: string
  caption?: string
  folder_id?: string
  event_date?: string
  ocr_text?: string
}) {
  const { data, error } = await supabase
    .from('cards')
    .update(updates)
    .eq('id', cardId)
    .select()
    .single()
  return { data, error }
}

// DELETE - delete a card
export async function deleteCard(cardId: string) {
  const { data, error } = await supabase
    .from('cards')
    .delete()
    .eq('id', cardId)
  return { data, error }
}

// UPDATE - move card to a different folder
export async function moveCardToFolder(cardId: string, folderId: string) {
  const { data, error } = await supabase
    .from('cards')
    .update({ folder_id: folderId })
    .eq('id', cardId)
    .select()
    .single()
  return { data, error }
}