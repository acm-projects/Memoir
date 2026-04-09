// @/services/messages.service.ts
import { supabase } from '@/lib/supabase'; 

// ─── Conversations (used by messages.tsx) ─────────────────────────────────────

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
    .update({ unread: 0 })
    .eq('conversation_id', conversationId)
    .neq('sender_id', userId);
}

// ─── Chat room (used by chatRoom.tsx) ─────────────────────────────────────────

// Gets the other participant's profile from conversation_participants
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
    .neq('user_id', currentUserId)
    .single();

  if (error) return { data: null, error };
  return { data, error: null };
}

// Gets all messages for a conversation, oldest first, joining custom_cards for card messages
export async function getMessages(conversationId: string) {
  return await supabase
    .from('messages')
    .select(`
      id,
      content,
      sender_id,
      created_at,
      shared_folder_id,
      shared_card_id,
      custom_cards:shared_card_id (
        id,
        card_color,
        card_items
      )
    `)
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true });
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
    });}
