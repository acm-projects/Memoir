// @/services/bulletinBoard.service.ts
import { supabase } from '@/lib/supabase'; 

// ─── Conversations (used by messages.tsx) ─────────────────────────────────────
interface ConversationUser {
  id: string;
  name: string;
  avatar: any;
  lastMessage: string;
  unread: number;
  timestamp: string; // variables for the user
}

// Gets the latest message per conversation for the messages list screen
export async function getConversations(userId: string) {
  const { data, error } = await supabase
    .from('messages')
    .select(`
      conversation_id,
      content,
      sender_id,
      created_at,
      unread,
      profiles:sender_id (
        id,
        username,
        avatar_url
      )
    `)
    .order('created_at', { ascending: false });

  if (error) return { data: null, error };

  // Keep only the latest message per conversation_id
  const seen = new Set<string>();
  const latest = data.filter((msg: any) => {
    if (seen.has(msg.conversation_id)) return false;
    seen.add(msg.conversation_id);
    return true;
  });

  return { data: latest, error: null };
}

// Zeros out unread count when user opens a conversation
export async function markConversationAsRead(conversationId: string, userId: string) {
  return await supabase
    .from('messages')
    .update({ unread: 0 }) // updates unread count to 0
    .eq('conversation_id', conversationId) // when convo id matches the convo id in data
    .neq('sender_id', userId); // when the sender is not the user, important specification because unread
    // will only be updated for the user, not the sender
}

// ─── Chat room (used by chatRoom.tsx) ─────────────────────────────────────────

// Gets the other participant's profile from conversation_participants
// Queries where conversation_id matches AND user_id is not the current user
export async function getConversationPartner(conversationId: string, currentUserId: string) {
  const { data, error } = await supabase
    .from('conversation_participants')
    .select(`
      user_id,
      profiles:user_id (
        username,
        avatar_url
      )
    `)
    .eq('conversation_id', conversationId)
    .neq('user_id', currentUserId) // get the OTHER person, not current user
    .single();                      // only one other participant

  if (error) return { data: null, error };
  return { data, error: null };
}
// Gets all messages for a conversation, oldest first so they render top to bottom
export async function getMessages(conversationId: string) {
  return await supabase
    .from('messages')
    .select('id, content, sender_id, created_at, shared_folder_id, shared_card_id')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true }); // oldest at top 
}
// Inserts a new text message into the messages table
export async function sendMessage(conversationId: string, senderId: string, content: string) {
  return await supabase
    .from('messages')
    .insert({
      conversation_id: conversationId, 
      sender_id: senderId,
      content,
      unread: 1, // recipient hasn't read it yet
    });
}