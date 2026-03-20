import { supabase } from '@/lib/supabase'

// CREATE - start a new conversation with a friend
export async function createConversation(userId: string, friendId: string) {
  // Step 1 - check if conversation already exists between these two users
  const { data: existing } = await supabase
    .from('conversation_participants')
    .select('conversation_id')
    .eq('user_id', userId)

  if (existing && existing.length > 0) {
    const conversationIds = existing.map(p => p.conversation_id)
    const { data: existingConvo } = await supabase
      .from('conversation_participants')
      .select('conversation_id')
      .eq('user_id', friendId)
      .in('conversation_id', conversationIds)
      .single()

    if (existingConvo) {
      return { data: existingConvo, error: null }
    }
  }

  // Step 2 - create new conversation
  const { data: conversation, error: convoError } = await supabase
    .from('conversations')
    .insert({})
    .select()
    .single()

  if (convoError) return { data: null, error: convoError }

  // Step 3 - add both users as participants
  const { error: participantsError } = await supabase
    .from('conversation_participants')
    .insert([
      { conversation_id: conversation.id, user_id: userId },
      { conversation_id: conversation.id, user_id: friendId }
    ])

  if (participantsError) return { data: null, error: participantsError }

  return { data: conversation, error: null }
}

// READ - get all conversations for a user
export async function getConversations(userId: string) {
  const { data, error } = await supabase
    .from('conversation_participants')
    .select('*, conversations(*)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  return { data, error }
}

// READ - get a single conversation by id
export async function getConversationById(conversationId: string) {
  const { data, error } = await supabase
    .from('conversations')
    .select('*, conversation_participants(*, profiles(*))')
    .eq('id', conversationId)
    .single()
  return { data, error }
}

// DELETE - delete a conversation
export async function deleteConversation(conversationId: string) {
  const { data, error } = await supabase
    .from('conversations')
    .delete()
    .eq('id', conversationId)
  return { data, error }
}

// ## What's Interesting Here

// ### `createConversation` has Three Steps
// Step 1 → check if conversation already exists between these two users
//           (don't create duplicates!)
// Step 2 → create the conversation row
// Step 3 → add BOTH users as participants in one insert