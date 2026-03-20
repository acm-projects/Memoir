import { supabase } from '@/lib/supabase'

// CREATE - send a message
export async function sendMessage(
  conversationId: string,
  senderId: string,
  content?: string,         // optional text
  sharedCardId?: string,    // optional shared card
  sharedFolderId?: string   // optional shared folder
) {
  const { data, error } = await supabase
    .from('messages')
    .insert({
      conversation_id: conversationId,
      sender_id: senderId,
      content,
      shared_card_id: sharedCardId ?? null,
      shared_folder_id: sharedFolderId ?? null
    })
    .select()
    .single()
  return { data, error }
}

// READ - get all messages in a conversation
export async function getMessages(conversationId: string) {
  const { data, error } = await supabase
    .from('messages')
    .select(`
      *,
      sender:profiles!sender_id(*),
      shared_card:cards(*),
      shared_folder:folders(*)
    `)
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true })
  return { data, error }
}

// DELETE - delete a message
export async function deleteMessage(messageId: string) {
  const { data, error } = await supabase
    .from('messages')
    .delete()
    .eq('id', messageId)
  return { data, error }
}

// CREATE - share a card in a conversation
export async function shareCard(
  conversationId: string,
  senderId: string,
  cardId: string,
  message?: string
) {
  const { data, error } = await supabase
    .from('messages')
    .insert({
      conversation_id: conversationId,
      sender_id: senderId,
      content: message ?? null,
      shared_card_id: cardId
    })
    .select()
    .single()
  return { data, error }
}

// CREATE - share a folder in a conversation
export async function shareFolder(
  conversationId: string,
  senderId: string,
  folderId: string,
  message?: string
) {
  const { data, error } = await supabase
    .from('messages')
    .insert({
      conversation_id: conversationId,
      sender_id: senderId,
      content: message ?? null,
      shared_folder_id: folderId
    })
    .select()
    .single()
  return { data, error }
}