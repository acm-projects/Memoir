// @/services/messages.service.ts
import { supabase } from '@/lib/supabase'; 

export interface Contact {
  id: string; // conv id
  name: string;
  avatar: any;
  unread: number;
} // used for send card, gets the message contact people

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

  const seen = new Set<string>();
  const latest = (data as any[]).filter((msg) => {
    if (seen.has(msg.conversation_id)) return false;
    seen.add(msg.conversation_id);
    return true;
  });

  const withPartner = await Promise.all(latest.map(async (msg: any) => {
    // If the latest message was sent by the current user, we need the other person's profile
    let profiles = msg.profiles;
    if (msg.sender_id === userId) {
      const { data: otherMsg } = await supabase
        .from('messages')
        .select('profiles:sender_id (id, username, avatar_url)')
        .eq('conversation_id', msg.conversation_id)
        .neq('sender_id', userId)
        .limit(1)
        .single();
      profiles = otherMsg?.profiles ?? null;
    }

    const { count } = await supabase
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .eq('conversation_id', msg.conversation_id)
      .eq('unread', 1)
      .neq('sender_id', userId);

    return { ...msg, profiles, unread: count ?? 0 };
  }));

  return { data: withPartner, error: null };
}

// Zeros out unread count when user opens a conversation
export async function markConversationAsRead(conversationId: string, userId: string) {
  const {data, error} = await supabase
    .from('messages')
    .update({ unread: 0 })
    .eq('conversation_id', conversationId)
    .neq('sender_id', userId);
    console.log('markConversationAsRead result:', { data, error }); // ← add this
  return { data, error };
}

// ─── Chat room (used by chatRoom.tsx) ─────────────────────────────────────────

// Gets the other participant's profile from conversation_participants
export async function getConversationPartner(conversationId: string, currentUserId: string) {
  const {data, error} = await supabase
    .from('conversation_participants')
    .select(`
      profiles (id, username, avatar_url)
    `)
    .eq('conversation_id', conversationId)
    .neq('user_id', currentUserId).single();

  return { data: data, error: null };
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
      shared_card_id
    `)
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true }); // removed get cards, causing issues, will handle later 
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

export async function sendCardMessage(
  conversationId: string,
  senderId: string,
  cardColor: string,
  cardItems: string,
) {

  const { data: card, error: cardError } = await supabase
    .from('custom_cards')
    .insert({ card_color: cardColor, card_items: cardItems, created_by: senderId })
    .select()
    .single();

  if (cardError) {
    console.error('card insert error:', cardError);
    return { error: cardError };
  }

  const { error } = await supabase.from('messages').insert({
    conversation_id: conversationId,
    sender_id: senderId,
    content: '🎴 Shared a card',
    shared_card_id: card.id,
  });

  return { error };
}
export async function getContacts(userId: string) { // fix: added get contacts feature for send card
  const { data, error } = await supabase
    .from('messages')
    .select(`
      conversation_id,
      profiles:sender_id (
        username,
        avatar_url
      )
    `)
    .neq('sender_id', userId);

  if (error) return { data: null, error };

  const seen = new Set<string>();
  const mapped: Contact[] = [];

  for (const row of data as any[]) {
    if (seen.has(row.conversation_id)) continue;
    seen.add(row.conversation_id);

    mapped.push({
      id: row.conversation_id,
      name: row.profiles?.username ?? 'Unknown',
      avatar: row.profiles?.avatar_url ?? null,
      unread: 0,
    });
  }

  return { data: mapped, error: null };
}

